/* eslint-disable no-prototype-builtins */
import axios from "axios";
import { ipcRenderer } from "electron";
import fs from "fs";
import path from "path";
import { Authenticator } from "minecraft-launcher-core";
const fsp = fs.promises;

("strict mode");

const isDevelopment = process.env.NODE_ENV !== "production";
const apiUrl = isDevelopment ? "http://localhost:3000" : "https://api.universe.matix-media.net";
var userData;
var paths;
ipcRenderer.send("user_data_path");
ipcRenderer.on("user_data_path", (event, args) => {
    userData = args.userData;
    paths = {
        library: path.join(userData, "library.json"),
        config: path.join(userData, "config.json"),
        accounts: path.join(userData, "accounts.json"),
        defaultInstallation: path.join(userData, "modpacks"),
    };
});

export default class API {
    #cache_default = {
        modpacks: {
            modpacks: {},
            offlineModpacks: {},
            comments: {},
            news: {},
            mods: {},
        },
        home: null,
        discovery: null,
        newsArticles: {},
    };
    #cache = {
        modpacks: {
            modpacks: {},
            offlineModpacks: {},
            comments: {},
            news: {},
            mods: {},
        },
        home: null,
        discovery: null,
        newsArticles: {},
    };
    offlineMode = false;
    library = {};
    favorites = [];
    sessions = [];
    settings = {};
    accounts = {};
    defaultAccount = null;

    constructor() {}

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
                this.#cache.modpacks.offlineModpacks[elem.ID] = mpInfo;

                try {
                    await fsp.access(path.join(elem["installationPath"], "sessions.json"));
                    var sessionsFile = await fsp.readFile(
                        path.join(elem["installationPath"], "sessions.json")
                    );
                    sessionsFile = JSON.parse(sessionsFile);

                    var _sessions = [];
                    sessionsFile.forEach((session) => {
                        _sessions.push({ modpack: id, ...session });
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
        } catch (err) {
            await fsp.writeFile(
                paths.config,
                JSON.stringify({
                    settings: {
                        throttleDownloads: false,
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

    async loadProfiles() {
        try {
            await fsp.access(paths.accounts, fs.constants.F_OK);

            var content = await fsp.readFile(paths.accounts);
            content = JSON.parse(content);
            this.defaultAccount = content.default;
            Object.entries(content.accounts).forEach(async (entry) => {
                const [key, value] = entry;
                console.log("Validating account " + value.username + "...");
                if (value.type === "Mojang") {
                    var response = await Authenticator.validate(
                        value.accessToken,
                        value.clientToken
                    );
                    if (response) {
                        this.accounts[key] = value;
                        console.log("Account validated");
                    } else {
                        console.log("Updating tokens...");
                        response = await Authenticator.refreshAuth(
                            value.accessToken,
                            value.clientToken,
                            { id: value.id, username: value.username }
                        );
                        if (response) {
                            value["accessToken"] = response.access_token;
                            value["clientToken"] = response.client_token;
                            value["UUID"] = response.uuid;
                            value["username"] = response.name;
                            this.accounts[key] = value;
                            content.accounts[key] = value;

                            await fsp.writeFile(paths.accounts, JSON.stringify(content));

                            console.log("Account validated");
                        } else {
                            throw new Error(
                                "Unknown error occurred when refreshing Account information."
                            );
                        }
                    }
                } else if (value.type === "Xbox") {
                    throw new Error("Microsoft Accounts are not support yet.");
                } else {
                    throw new Error("Unknown Account type: " + value.type);
                }
            });
        } catch (err) {
            await fsp.writeFile(paths.accounts, JSON.stringify({ accounts: {}, default: null }));
        }
    }

    getHome() {
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

                if (this.offlineMode) {
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
                        .then((err) => {
                            reject(err);
                        });
                }
            }
        });
    }

    getDiscovery() {
        return new Promise((resolve, reject) => {
            if (this.#cache.discovery !== null) {
                resolve(this.#cache.discovery);
            } else {
                axios
                    .get(apiUrl + "/discovery")
                    .then((res) => {
                        this.#cache.discovery = res.data;
                        resolve(res.data);
                    })
                    .then((err) => {
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