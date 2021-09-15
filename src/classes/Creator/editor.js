import { promises as fsp } from "fs";
import path from "path";
import fsb from "../Helpers/fsb";
import AdmZip from "adm-zip";
import zipHelper from "../Helpers/zip-helper";
import toml from "toml";
import chokidar from "chokidar";

export default class Editor {
    root = null;
    location = null;
    meta = null;
    mods = [];
    worlds = [];
    resourcepacks = [];
    fileWatcher = null;
    #events = {
        fileUpdates: [],
    };

    constructor(location) {
        this.location = location;
        this.root = path.dirname(this.location);
    }

    /**
     * Get the absolute path to a target
     * @param {string} targetPath Target path (instance, build, debug, assets)
     * @returns The absolute path to the target
     */
    getPath(targetPath) {
        return path.join(this.root, this.meta.project.paths[targetPath]);
    }

    /**
     * This callback reports the status of the loading process
     * @callback loadingStatusCallback
     * @param {string} statusMessage
     */

    /**
     * Load the project into the editor
     * @param {loadingStatusCallback} callback Reports the loading status
     */
    async load(callback = () => {}) {
        console.log('Loading "' + path.basename(this.location) + '"...');

        callback("Loading project information...");

        let content = JSON.parse(await fsp.readFile(this.location));
        this.meta = content;

        callback("Loading mods...");

        try {
            let modsDir = path.join(this.getPath("instance"), "mods");
            if (await fsb.isDirectory(modsDir)) {
                let i = 0;
                for (let file of await fsp.readdir(modsDir)) {
                    if (await this.loadMod(path.join("mods", file))) {
                        i++;
                        console.log("Loaded mod:", file);
                        callback("Loading mods (" + i + ")...");
                    }
                }
            }
        } catch (err) {
            console.warn("Could not load mods:", err);
        }

        callback("Loading resource packs...");

        try {
            let packsDir = path.join(this.getPath("instance"), "resourcepacks");
            if (await fsb.isDirectory(packsDir)) {
                let i = 0;
                for (let pack of await fsp.readdir(packsDir)) {
                    if (await this.loadResourcepack(path.join("resourcepacks", pack))) {
                        i++;
                        console.log("Loaded resource pack:", pack);
                        callback("Loading resource packs (" + i + ")...");
                    }
                }
            }
        } catch (err) {
            console.warn("Could not load resourcepacks:", err);
        }

        callback("Loading worlds...");

        try {
            let worldsDir = path.join(this.getPath("instance"), "saves");
            if (await fsb.isDirectory(worldsDir)) {
                let i = 0;
                for (let world of await fsp.readdir(worldsDir)) {
                    if (await this.loadWorld(path.join("saves", world))) {
                        i++;
                        console.log("Loaded world:", world);
                        callback("Loading worlds (" + i + ")...");
                    }
                }
            }
        } catch (err) {
            console.warn("Could not load worlds:", err);
        }

        callback("Scanning files...");

        // eslint-disable-next-line no-unused-vars
        this.fileWatcher = chokidar.watch(this.getPath("instance"));
        this.fileWatcher.on("all", (event, path) => {
            for (let callback of this.#events.fileUpdates) {
                callback(event, path);
            }
            //console.log(event, path);
        });
    }
    /**
     * Load a mod into the editor (The mod must be saved in the project instance)
     * @param {string} relPath Relative path starting from the instance directory to the mod
     * @return {Promise<Object> | Promise<null>} The mod object or null if unable to be loaded
     */
    async loadMod(relPath) {
        if (path.extname(relPath) != ".jar") return null;

        let filepath = path.join(this.getPath("instance"), relPath);

        let zip = new AdmZip(filepath);
        for (let entry of zip.getEntries()) {
            if (entry.entryName == "fabric.mod.json") {
                let entryContent = JSON.parse(await zipHelper.readAsText(zip, entry));

                let mod = {
                    file: relPath,
                    id: entryContent.id,
                    name: entryContent.name,
                    version: entryContent.version,
                    description: entryContent.description,
                    author: entryContent.authors[0],
                    website: entryContent.contact.homepage,
                    modloader: "fabric",
                };
                if (!this.mods.includes(mod)) this.mods.push(mod);

                return mod;
            } else if (entry.entryName == "META-INF/mods.toml") {
                let entryContent = toml.parse(await zipHelper.readAsText(zip, entry));

                let mods = [];
                for (let modEntry of entryContent.mods) {
                    let mod = {
                        file: relPath,
                        id: modEntry.modId,
                        name: modEntry.displayName,
                        version: modEntry.version,
                        description: modEntry.description,
                        author: modEntry.authors,
                        website: modEntry.displayURL,
                        modloader: "forge",
                    };
                    mods.push(mod);
                }

                for (let mod of mods) {
                    if (!this.mods.includes(mod)) this.mods.push(mod);
                }

                return mods[0];
            }
        }
    }

    /**
     * Load a resource pack into the editor (The resource pack must be saved in the project instance)
     * @param {string} relPath Relative path starting from the instance directory to the resource pack
     * @returns {Promise<object> | Promise<null>}
     */
    async loadResourcepack(relPath) {
        let packPath = path.join(this.getPath("instance"), relPath);
        if (!(await fsb.exists(packPath))) return null;

        let metaContent = null;
        if (await fsb.isDirectory(packPath)) {
            try {
                metaContent = await fsp.readFile(path.join(packPath, "pack.mcmeta"));
            } catch (_) {
                return null;
            }
        } else if (path.extname(packPath).toLowerCase() == ".zip") {
            try {
                let zip = new AdmZip(packPath);
                let entry = zip.getEntry("pack.mcmeta");
                metaContent = await zipHelper.readAsText(zip, entry);
            } catch (_) {
                return null;
            }
        } else {
            return null;
        }
        metaContent = JSON.parse(metaContent);

        let resourcepack = {
            name: path.parse(relPath).name,
            description: metaContent.pack.description,
            format: metaContent.pack.pack_format,
            file: relPath,
        };

        if (!this.resourcepacks.includes(resourcepack)) this.resourcepacks.push(resourcepack);
        return resourcepack;
    }

    /**
     * Load a world into the editor (The world must be saved in the project instance)
     * @param {string} relPath Relative path starting from the instance directory to the world folder
     * @returns {Promise<object> | Promise<null>}
     */
    async loadWorld(relPath) {
        let levelDatFile = path.join(this.getPath("instance"), relPath, "level.dat");
        if (!(await fsb.isFile(levelDatFile))) return null;

        //return true;
    }

    on(event, callback) {
        if (this.#events[event]) {
            this.#events[event].push(callback);
        } else {
            throw new Error("Unknown event name.");
        }
    }
}
