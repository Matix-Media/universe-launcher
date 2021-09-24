import { getClassWithColor } from "file-icons-js";

const customDB = [
    [/\.mca$/i, ".dat"],
    [/\.dat_mcr$/i, ".dat"],
    [/\.dat_old$/i, ".dat"],
    [/\.lock$/i, ".dat"],
    [/\.mcmeta$/i, ".json"],
];

export default {
    matchCustomDB(path) {
        for (let entry of customDB) {
            if (entry[0].test(path)) {
                return entry[1];
            }
        }
        return null;
    },

    getFileIcon(path) {
        var customMatch = this.matchCustomDB(path);
        if (customMatch) path = customMatch;

        var icon = getClassWithColor(path);
        console.log(icon);
        return !icon ? getClassWithColor(".dat") : icon;
    },
};
