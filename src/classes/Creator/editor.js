import { promises as fsp } from "fs";
import path from "path";
import fsb from "../Helpers/fsb";
import AdmZip from "adm-zip";
import zipHelper from "../Helpers/zip-helper";
import toml from "toml";
import { NbtReader } from "node-nbt";
import zlib from "zlib";

export default class Editor {
    root = null;
    location = null;
    meta = null;
    mods = [];

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

    async load(callback = () => {}) {
        callback("Loading files...");

        let content = JSON.parse(await fsp.readFile(this.location));
        this.meta = content;

        callback("Loading mods...");

        try {
            let modsDir = path.join(this.getPath("instance"), "mods");
            if (await fsb.exists(modsDir)) {
                let i = 0;
                for (let file of await fsp.readdir(modsDir)) {
                    if (await this.loadMod(path.join("mods", file))) {
                        i++;
                        callback("Loading mods (" + i + ")...");
                    }
                }
            }
        } catch (err) {
            console.warn("Could not load mods: ", err);
        }
        console.log(this.mods);
    }

    /**
     * Load a mod into the editor (The mod must be saved in the project instance)
     * @param {string} relPath Relative path starting from the instance directory to the mod
     * @return {Promise<object> | Promise<null>} The mod object or null if unable to be loaded
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
     * Load a world into the editor (The world must be saved in the project instance)
     * @param {string} relPath Relative path starting from the instance directory to the world folder
     * @returns {Promise<object> | Promise<null>}
     */
    async loadWorld(relPath) {
        let levelDatFile = path.join(this.getPath("instance"), relPath, "level.dat");
        if (!(await fsb.isFile(levelDatFile))) return null;

        let nbtBuffer = await fsp.readFile(levelDatFile);
        zlib.gunzip()
        NbtReader.printAscii(nbtBuffer);
    }
}
