import axios from "axios";

export default class CurseforgeAPI {
    #requestCache = {
        modloader: null,
    };
    static instance = new CurseforgeAPI();

    async getModloaders() {
        var result;
        if (!this.#requestCache.modloader) {
            result = await axios.get(
                "https://addons-ecs.forgesvc.net/api/v2/minecraft/modloader?includeAll=true"
            );
            result = result.data;

            result.sort(function(a, b) {
                return new Date(b.dateModified) - new Date(a.dateModified);
            });

            this.#requestCache.modloader = result;
        }
        result = this.#requestCache.modloader;
        return result;
    }

    async getSpecificModloaders(type, gameVersions, metadata) {
        var versions = await this.getModloaders();
        var result = [];
        for (let version of versions) {
            if (version.type != type) continue;

            if (gameVersions.length == 0 || gameVersions.includes(version.gameVersion)) {
                //console.log(version);
                if (metadata) {
                    result.push(version);
                } else {
                    result.push(version.name);
                }
            }
        }
        return result;
    }

    async getForgeVersions(gameVersions = [], metadata = false) {
        return await this.getSpecificModloaders(1, gameVersions, metadata);
    }

    async getFabricVersions(gameVersions = [], metadata = false) {
        return await this.getSpecificModloaders(4, gameVersions, metadata);
    }

    async getLatestModloaderVersion(type, gameVersion) {
        var versions = await this.getModloaders();
        for (let version of versions) {
            if (version.type != type) continue;
            if (version.gameVersion != gameVersion) continue;
            if (version.latest == true) return version;
        }
    }

    async getLatestForgeVersion(gameVersion) {
        return await this.getLatestModloaderVersion(1, gameVersion);
    }

    async getLatestFabricVersion(gameVersion) {
        return await this.getLatestModloaderVersion(4, gameVersion);
    }

    async getModloaderInformation(modloaderVersion) {
        var response = await axios.get(
            "https://addons-ecs.forgesvc.net/api/v2/minecraft/modloader/" + modloaderVersion
        );
        return response.data;
    }
}
