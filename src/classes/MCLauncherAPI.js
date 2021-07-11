import axios from "axios";

export default class MCLauncherAPI {
    async getVersions(snapshots = false, metadata = false) {
        var result = (
            await axios.get("https://launchermeta.mojang.com/mc/game/version_manifest.json")
        ).data;

        if (!snapshots) {
            result.latest = result.latest.release;
            let versions = [];
            for (let version of result.versions) {
                if (version.type == "release") versions.push(version);
            }
            result.versions = versions;
        }

        if (!metadata) {
            let versions = [];
            for (let version of result.versions) {
                versions.push(version.id);
            }
            result.versions = versions;
        }

        return result;
    }
}
