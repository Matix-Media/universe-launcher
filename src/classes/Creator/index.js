/* global __static */
"strict mode";

import fs from "fs";
import { ipcRenderer } from "electron";
import path from "path";
import isValid from "is-valid-path";
import _ from "lodash";
import sanitize from "sanitize-filename";
import os from "os";
import CurseforgeAPI from "../CurseforgeAPI";

const fsp = fs.promises;

const creator_assets = path.join(__static, "static/creator");
const prefix = "[CREATOR] ";
const default_assets = [
    {
        id: "icon.png",
        source: path.join(creator_assets, "defaults", "modpack_icon.png"),
    },
    {
        id: "logo.png",
        source: path.join(creator_assets, "defaults", "modpack_icon.png"),
    },
];

export default class Creator {
    isLoaded = false;
    #paths = { userData: null, projects: null, documents: null };
    #projects = { openedProjects: [], lastUsedRoot: null };

    async load() {
        if (this.isLoaded) return;

        ipcRenderer.send("user_data_path");
        await new Promise((resolve) => {
            ipcRenderer.once("user_data_path", (event, args) => {
                this.#paths = {
                    userData: args.userData,
                    projects: path.join(args.userData, "projects.json"),
                    documents: args.documents,
                };
                resolve();
            });
        });

        try {
            await fsp.access(this.#paths.projects, fs.constants.F_OK);
        } catch (err) {
            await fsp.writeFile(this.#paths.projects, JSON.stringify(this.#projects));
            return;
        }
        this.isLoaded = true;
    }

    getProjectsRoot() {
        return this.#projects.lastUsedRoot ? this.#projects.lastUsedRoot : this.#paths.documents;
    }

    async saveSettings() {
        await fsp.writeFile(this.#paths.projects, JSON.stringify(this.#projects));
    }

    async checkProjectLocation(location) {
        if (_.isEmpty(location) || !isValid(location) || location.trim() == "") return false;
        if (fs.existsSync(location)) return false;
        try {
            await fsp.access(location);
            return false;
        } catch (err) {
            //
        }
        return true;
    }

    // eslint-disable-next-line no-unused-vars
    async createProject(location, name, modpackName, mcVersion, modloader, modloaderVersion) {
        this.#projects.lastUsedRoot = path.dirname(location);

        console.log(prefix + 'Creating project "' + name + '"...');

        await fsp.mkdir(location);

        console.log(prefix + "Creating project meta file...");

        let paths = {
            debug: "debug",
            build: "build",
            assets: "assets",
            instance: "instance",
        };

        console.log(prefix + "Creating project paths...");

        for (let path_ of Object.values(paths)) {
            await fsp.mkdir(path.join(location, path_));
        }

        console.log(prefix + "Copying default assets...");

        for (let asset of default_assets) {
            let targetLocation = path.join(location, paths.assets, asset.id);
            await fsp.copyFile(asset.source, targetLocation);

            /*var res = await axios.get(asset.source, { responseType: "arraybuffer" });
            var f = await fsp.open(targetLocation, "w");
            await f.write(Buffer.from(res.data, "binary"));
            await f.close();*/
        }

        console.log(prefix + "Downloading modloader version information");

        let modloaderInformation = await CurseforgeAPI.instance.getModloaderInformation(
            modloaderVersion
        );
        console.log(modloaderInformation);

        let projectMeta = {
            project: {
                name: name,
                paths: paths,
            },
            modpack: {
                name: modpackName,
                minecraft: {
                    version: mcVersion,
                    versionJson: modloaderInformation.versionJson,
                },
                modloader: {
                    type: modloader,
                    version: modloaderVersion,
                },
                version: "1.0.0",
                description: "Another UNIVERSE Launcher modpack.",
                author: os.userInfo().username,
                license: "MIT",
                assets: {
                    icon: "${assets}/icon.png",
                    logo: "${assets}/logo.png",
                    cover: "${assets}/cover.png",
                    banner: "${assets}/banner.png",
                },
            },
        };

        await fsp.writeFile(
            path.join(location, sanitize(name) + ".ulmpmeta.json"),
            JSON.stringify(projectMeta)
        );

        console.log(prefix + "Project created successfully!");

        this.#projects.openedProjects.push({ name: name, location: location });
        this.saveSettings();
    }
}
