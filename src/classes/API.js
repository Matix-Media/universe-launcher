/* eslint-disable no-prototype-builtins */
import axios from "axios";
import { ipcRenderer } from "electron";
import fs from "fs";
import path from "path";
import { Authenticator } from "minecraft-launcher-core";
import MSMC from "msmc";

const fsp = fs.promises;

("strict mode");

const isDevelopment = process.env.NODE_ENV !== "production";
const apiUrl = isDevelopment ? "http://localhost:3000" : "https://api.universe.matix-media.net";
var userData;
var paths;
ipcRenderer.send("user_data_path");
ipcRenderer.once("user_data_path", (event, args) => {
    userData = args.userData;
    paths = {
        library: path.join(userData, "library.json"),
        config: path.join(userData, "config.json"),
        accounts: path.join(userData, "accounts.json"),
        defaultInstallation: path.join(userData, "modpacks"),
    };
});

export default class API {
    #cache_default = {};
    #cache = {
        modpacks: {
            modpacks: {},
            offlineModpacks: {},
            comments: {},
            news: {},
            mods: {},
        },
        home: null,
        library: {},
        discover: null,
        newsArticles: {},
    };
    offlineMode = false;
    library = {};
    favorites = [];
    sessions = [];
    settings = {};
    accounts = {};
    defaultAccount = null;

    constructor() {
        Object.assign(this.#cache_default, this.#cache);
    }

    versionCompare(v1, v2, options) {
        var lexicographical = options && options.lexicographical,
            zeroExtend = options && options.zeroExtend,
            v1parts = v1.split("."),
            v2parts = v2.split(".");

        function isValidPart(x) {
            return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
        }

        if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
            return NaN;
        }

        if (zeroExtend) {
            while (v1parts.length < v2parts.length) v1parts.push("0");
            while (v2parts.length < v1parts.length) v2parts.push("0");
        }

        if (!lexicographical) {
            v1parts = v1parts.map(Number);
            v2parts = v2parts.map(Number);
        }

        for (var i = 0; i < v1parts.length; ++i) {
            if (v2parts.length == i) {
                return 1;
            }

            if (v1parts[i] == v2parts[i]) {
                continue;
            } else if (v1parts[i] > v2parts[i]) {
                return 1;
            } else {
                return -1;
            }
        }

        if (v1parts.length != v2parts.length) {
            return -1;
        }

        return 0;
    }

    checkConnection() {
        return new Promise((resolve, reject) => {
            axios
                .get(apiUrl)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                    this.offlineMode = true;
                });
        });
    }

    async loadLibrary() {
        try {
            await fsp.access(paths.library, fs.constants.F_OK);
        } catch (err) {
            await fsp.writeFile(paths.library, JSON.stringify({ installed: [], favorites: [] }));
            return;
        }

        var content = await fsp.readFile(paths.library);
        content = JSON.parse(content);
        this.favorites = content.favorites;
        var i = 0;
        for (const elem of content.installed) {
            try {
                await fsp.access(
                    path.join(elem["installationPath"], "modpack.json"),
                    fs.constants.F_OK
                );
                var mpInfo = await fsp.readFile(
                    path.join(elem["installationPath"], "modpack.json")
                );
                mpInfo = JSON.parse(mpInfo);

                var id = elem["ID"];
                this.library[elem["ID"]] = elem;
                mpInfo["game_version"] = mpInfo.gameVersion;
                mpInfo["version_release_date"] = mpInfo.versionReleaseDate;
                this.#cache.modpacks.offlineModpacks[elem.ID] = mpInfo;

                try {
                    await fsp.access(path.join(elem["installationPath"], "sessions.json"));
                    var sessionsFile = await fsp.readFile(
                        path.join(elem["installationPath"], "sessions.json")
                    );
                    sessionsFile = JSON.parse(sessionsFile);

                    var _sessions = [];
                    sessionsFile.forEach((session) => {
                        _sessions.push({
                            modpack: id,
                            name: mpInfo["name"],
                            cover: mpInfo["cover"],
                            ...session,
                        });
                    });
                    this.sessions.push(..._sessions);
                } catch (err) {
                    //
                }
            } catch (err) {
                console.warn(
                    "Installed modpack " + id + " seems to be corrupted. removing from library:",
                    err
                );

                delete content.installed[i];
                await fsp.writeFile(paths.library, JSON.stringify(content));
            }
            i++;
        }
    }

    async loadSessions() {
        this.sessions.sort((a, b) => {
            var aDate = new Date(a.started);
            var bDate = new Date(b.started);
            if (aDate > bDate) {
                return 1;
            } else if (aDate < bDate) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    async loadConfig() {
        try {
            await fsp.access(paths.config, fs.constants.F_OK);

            var content = await fsp.readFile(paths.config);
            content = JSON.parse(content);
            this.settings = content;

            if (this.settings.connectivity.proxy.enabled) {
                axios.defaults.proxy = {
                    host: this.settings.connectivity.proxy.host,
                    port: this.settings.connectivity.proxy.port,
                };
            } else {
                axios.defaults.proxy = undefined;
            }
        } catch (err) {
            await fsp.writeFile(
                paths.config,
                JSON.stringify({
                    appearance: {
                        minimizeOnMcStartup: true,
                        closeOnMcExit: false,
                    },
                    connectivity: {
                        throttleDownloads: {
                            enabled: false,
                            throttle: 0,
                        },
                        proxy: {
                            enabled: false,
                            host: "",
                            port: 0,
                        },
                    },
                    notifications: {
                        modpackReady: true,
                        news: true,
                    },
                })
            );
        }
    }

    async saveConfig() {
        if (this.settings.connectivity.proxy.enabled) {
            axios.defaults.proxy = {
                host: this.settings.connectivity.proxy.host,
                port: this.settings.connectivity.proxy.port,
            };
        } else {
            axios.defaults.proxy = undefined;
        }
        await fsp.writeFile(paths.config, JSON.stringify(this.settings));
    }

    async addProfile(type = "mojang", data) {
        console.log("Validating account...");
        var addedAccountUUID = null;
        if (type.toLowerCase() == "microsoft" || type.toLowerCase() == "xbox") {
            console.log(data.profile);
            let profile = {
                type: "Xbox",
                id: data.profile.id,
                accessToken: data.access_token,
                refreshToken: data.profile._msmc.refresh,
                expires: data.profile._msmc.expires_by,
                UUID: data.profile.id,
                username: data.profile.name,
            };
            this.accounts[data.profile.id] = profile;

            addedAccountUUID = data.profile.id;
        } else if (type.toLowerCase() == "mojang") {
            try {
                var result = await Authenticator.getAuth(data.email, data.password);
            } catch (err) {
                console.log("Incorrect credentials.");
                return false;
            }
            let profile = {
                type: "Mojang",
                id: result.uuid,
                accessToken: result.access_token,
                clientToken: result.client_token,
                login: result.name,
                UUID: result.selected_profile.id,
                username: result.selected_profile.name,
            };
            this.accounts[profile.id] = profile;

            addedAccountUUID = result.uuid;
        } else {
            throw new Error('Account type "' + type + '" is not supported.');
        }
        if (Object.keys(this.accounts).length == 1) {
            console.log("Setting as default.");
            this.defaultAccount = addedAccountUUID;
        }
        await fsp.writeFile(
            paths.accounts,
            JSON.stringify({
                accounts: this.accounts,
                default: this.defaultAccount,
            })
        );
        console.log("Account saved.");
        return addedAccountUUID;
    }

    async removeProfile(id) {
        console.log("Removing account...");
        const account = this.accounts[id];
        if (account.type.toLowerCase() == "mojang") {
            await Authenticator.invalidate(account.accessToken, account.clientToken);
            delete this.accounts[id];
        } else if (
            account.type.toLowerCase() == "xbox" ||
            account.type.toLowerCase() == "microsoft"
        ) {
            delete this.accounts[id];
        } else {
            throw new Error('Account type "' + account.type + '" is not supported.');
        }
        await fsp.writeFile(
            paths.accounts,
            JSON.stringify({
                accounts: this.accounts,
                default: this.defaultAccount,
            })
        );
        console.log("Account removed.");
    }

    async setDefaultProfile(id) {
        this.defaultAccount = id;
        await fsp.writeFile(
            paths.accounts,
            JSON.stringify({
                accounts: this.accounts,
                default: this.defaultAccount,
            })
        );
    }

    async loadProfiles() {
        try {
            await fsp.access(paths.accounts, fs.constants.F_OK);
        } catch (err) {
            await fsp.writeFile(paths.accounts, JSON.stringify({ accounts: {}, default: null }));
            return;
        }
        var content = await fsp.readFile(paths.accounts);
        content = JSON.parse(content);
        this.defaultAccount = content.default;

        var lastThrownError = null;
        for (const key in content.accounts) {
            const value = content.accounts[key];
            console.log("Validating account " + value.username + "...");
            if (value.type.toLowerCase() === "mojang") {
                try {
                    var response = await Authenticator.validate(
                        value.accessToken,
                        value.clientToken
                    );
                    this.accounts[key] = value;
                    console.log("Account is valid");
                } catch (err) {
                    console.log("Updating tokens...");
                    try {
                        /*ipcRenderer.invoke("refresh_mojang")

                        MSMC.setFetch(require("node-fetch"));
                        response = await MSMC.getMCLC().refresh({
                            access_token: value.accessToken,
                            client_token: value.clientToken,
                        });
                        console.log(response);*/
                        response = await Authenticator.refreshAuth(
                            value.accessToken,
                            value.clientToken
                        );
                    } catch (err) {
                        console.error("Could not refresh tokens.");
                        lastThrownError = err;
                        continue;
                    }

                    console.log("Tokens refreshed");
                    if (response) {
                        value["accessToken"] = response.access_token;
                        value["clientToken"] = response.client_token;
                        value["UUID"] = response.uuid;
                        value["username"] = response.name;
                        this.accounts[key] = value;
                        content.accounts[key] = value;

                        await fsp.writeFile(paths.accounts, JSON.stringify(content));
                    } else {
                        console.error("Could not refresh tokens (Unknown error).");
                        lastThrownError = new Error(
                            "Unknown error occurred while refreshing account information."
                        );
                    }
                }
            } else if (
                value.type.toLowerCase() === "xbox" ||
                value.type.toLowerCase() === "microsoft"
            ) {
                var valid = MSMC.validate({
                    _msmc: { expires_by: value.expires, mcToken: "filler" },
                });
                if (!valid) {
                    console.log("Updating tokens...");
                    try {
                        await new Promise((resolve, reject) => {
                            ipcRenderer.send("refresh_oauth2_ms", {
                                _msmc: { refresh: value.refreshToken },
                            });
                            ipcRenderer.once("refresh_oauth2_ms_callback", (event, callback) => {
                                let profile = {
                                    type: "Xbox",
                                    id: callback.profile.id,
                                    accessToken: callback.access_token,
                                    refreshToken: callback.profile._msmc.refresh,
                                    expires: callback.profile._msmc.expires_by,
                                    UUID: callback.profile.id,
                                    username: callback.profile.name,
                                };

                                this.accounts[key] = profile;
                                content.accounts[key] = profile;

                                resolve();
                            });
                            var updateEvent = ipcRenderer.on(
                                "refresh_oauth2_ms_update",
                                (event, update) => {
                                    if (
                                        update.type == "Rejection" ||
                                        update.type == "Error" ||
                                        update.type == "Cancelled"
                                    ) {
                                        reject();
                                        updateEvent.removeAllListeners();
                                    }
                                }
                            );
                            ipcRenderer.once("refresh_oauth2_ms_error", (event, err) => {
                                reject(err);
                            });
                        });
                        await fsp.writeFile(paths.accounts, JSON.stringify(content));

                        console.log("Tokens refreshed");
                    } catch (err) {
                        console.error("Could not refresh tokens.");
                        lastThrownError = err;
                        continue;
                    }
                } else {
                    console.log("Account is valid");
                    this.accounts[key] = value;
                }
            } else {
                lastThrownError = new Error('Account type "' + value.type + '" is not supported.');
            }
        }
        if (lastThrownError != null) {
            throw lastThrownError;
        }
    }

    getHome(localeOfflineMode = false) {
        return new Promise((resolve, reject) => {
            if (this.#cache.home !== null) {
                resolve(this.#cache.home);
            } else {
                var requestedModpacks = [];
                var requestedNews = [];
                var recentlyPlayed = [];
                var favorites = [];
                this.sessions.slice(-10).forEach((elem) => {
                    if (!requestedModpacks.includes(elem["modpack"])) {
                        recentlyPlayed.push(elem["modpack"]);
                        requestedModpacks.push(elem["modpack"]);
                    }
                });
                favorites = this.favorites.slice(0, 10);
                favorites.forEach((elem) => {
                    if (!requestedModpacks.includes(elem)) requestedModpacks.push(elem);
                });
                Object.values(this.library).forEach((elem) => {
                    if (!requestedNews.includes(elem.ID)) requestedNews.push(elem.ID);
                });
                favorites.forEach((elem) => {
                    if (!requestedNews.includes(elem)) requestedNews.push(elem);
                });

                if (localeOfflineMode || this.offlineMode) {
                    var resNews = [];
                    var resRecentlyPlayed = [];
                    var resFavorites = [];

                    var elem;
                    for (elem of recentlyPlayed) {
                        if (this.#cache.modpacks.offlineModpacks[elem]) {
                            resRecentlyPlayed.push(this.#cache.modpacks.offlineModpacks[elem]);
                        }
                    }
                    for (elem of favorites) {
                        if (this.#cache.modpacks.offlineModpacks[elem]) {
                            resFavorites.push(this.#cache.modpacks.offlineModpacks[elem]);
                        }
                    }
                    resolve({
                        news: resNews,
                        recentlyPlayed: resRecentlyPlayed,
                        favorites: resFavorites,
                    });
                } else {
                    axios
                        .post(apiUrl + "/home", {
                            modpacks: requestedModpacks,
                            news: requestedNews,
                        })
                        .then((res) => {
                            var val = {
                                recentlyPlayed: [],
                                favorites: [],
                                news: [],
                            };
                            var elem;
                            var modpack;
                            for (elem of recentlyPlayed) {
                                for (modpack of res.data.modpacks) {
                                    if (modpack["ID"] == elem) {
                                        val.recentlyPlayed.push(modpack);
                                        break;
                                    }
                                }
                            }
                            for (elem of favorites) {
                                for (modpack of res.data.modpacks) {
                                    if (modpack["ID"] == elem) {
                                        val.favorites.push(modpack);
                                        break;
                                    }
                                }
                            }
                            val.news = res.data.news;
                            this.#cache.home = val;
                            resolve(val);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
            }
        });
    }

    async getLibrary(order = "alphabetical", query = null, localOfflineMode = false) {
        var result = [];
        var library = Object.keys(this.library);
        var id;
        if (localOfflineMode || this.offlineMode) {
            for (id of library) {
                if (this.#cache.modpacks.offlineModpacks[id]) {
                    result.push(this.#cache.modpacks.offlineModpacks[id]);
                }
            }
        } else {
            var needRequest = [];
            for (id of library) {
                if (this.#cache.library[id]) {
                    result.push(this.#cache.library[id]);
                } else {
                    needRequest.push(id);
                }
            }
            if (needRequest.length > 0) {
                var req = await axios.post(apiUrl + "/modpacks", {
                    modpacks: needRequest,
                });
                for (var elem of req.data) {
                    this.#cache.library[elem.ID] = elem;
                }
                result.push(...req.data);
            }
        }
        result.sort((a, b) => {
            switch (order.toLowerCase()) {
                default:
                case "alphabetical":
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                case "release date":
                    var aDate = new Date(a.version_release_date);
                    var bDate = new Date(b.version_release_date);
                    if (aDate < bDate) return -1;
                    if (aDate > bDate) return 1;
                    return 0;
            }
        });
        if (query) {
            result = result.filter((elem) => {
                return elem.name
                    .toLowerCase()
                    .trim()
                    .includes(query.toLowerCase().trim());
            });
        }
        return result;
    }

    getDiscover() {
        return new Promise((resolve, reject) => {
            if (this.#cache.discover !== null) {
                resolve(this.#cache.discover);
            } else {
                axios
                    .get(apiUrl + "/discover")
                    .then((res) => {
                        this.#cache.discover = res.data;
                        resolve(res.data);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            }
        });
    }

    getModpack(id) {
        return new Promise((resolve, reject) => {
            if (this.#cache.modpacks.modpacks.hasOwnProperty(id)) {
                resolve(this.#cache.modpacks.modpacks[id]);
            } else {
                if (this.offlineMode) {
                    if (this.#cache.modpacks.offlineModpacks[id]) {
                        resolve(this.#cache.modpacks.offlineModpacks[id]);
                    }
                } else {
                    axios
                        .get(apiUrl + "/modpack/" + id)
                        .then((res) => {
                            this.#cache.modpacks.modpacks[id] = res.data;
                            resolve(res.data);
                        })
                        .catch((err) => {
                            if (err.response) {
                                if (err.response.status === 404) {
                                    reject(false, null);
                                }
                            }
                            reject(true, err);
                        });
                }
            }
        });
    }

    getNews(id) {
        return new Promise((resolve, reject) => {
            if (this.#cache.modpacks.news.hasOwnProperty(id)) {
                resolve(this.#cache.modpacks.news[id]);
            } else {
                axios
                    .get(apiUrl + "/modpack/" + id + "/news")
                    .then((res) => {
                        this.#cache.modpacks.news[id] = res.data;
                        resolve(res.data);
                    })
                    .catch((err) => {
                        if (err.response) {
                            if (err.response.status === 404) {
                                reject(false, null);
                            }
                        }
                        reject(true, err);
                    });
            }
        });
    }

    getMods(id) {
        return new Promise((resolve, reject) => {
            if (this.#cache.modpacks.mods.hasOwnProperty(id)) {
                resolve(this.#cache.modpacks.mods[id]);
            } else {
                axios
                    .get(apiUrl + "/modpack/" + id + "/mods")
                    .then((res) => {
                        this.#cache.modpacks.mods[id] = res.data;
                        resolve(res.data);
                    })
                    .catch((err) => {
                        if (err.response) {
                            if (err.response.status === 404) {
                                reject(false, null);
                            }
                        }
                        reject(true, err);
                    });
            }
        });
    }

    getComments(id) {
        return new Promise((resolve, reject) => {
            if (this.#cache.modpacks.comments.hasOwnProperty(id)) {
                resolve(this.#cache.modpacks.comments[id]);
            } else {
                axios
                    .get(apiUrl + "/modpack/" + id + "/comments")
                    .then((res) => {
                        this.#cache.modpacks.comments[id] = res.data;
                        resolve(res.data);
                    })
                    .catch((err) => {
                        if (err.response) {
                            if (err.response.status === 404) {
                                reject(false, null);
                            }
                        }
                        reject(true, err);
                    });
            }
        });
    }

    getNewsArticle(id) {
        return new Promise((resolve, reject) => {
            if (this.#cache.newsArticles.hasOwnProperty(id)) {
                resolve(this.#cache.newsArticles[id]);
            } else {
                axios
                    .get(apiUrl + "/news/" + id)
                    .then((res) => {
                        this.#cache.newsArticles[id] = res.data;
                        resolve(res.data);
                    })
                    .catch((err) => {
                        if (err.response && err.response.status === 404) {
                            reject(false, null);
                        }
                        reject(true, err);
                    });
            }
        });
    }

    inLibrary(id) {
        return this.library.hasOwnProperty(id);
    }

    clearCache() {
        this.#cache = JSON.parse(JSON.stringify(this.#cache_default));
    }
}
