import { db as iconDB } from "file-icons-js";
import { basename } from "path";

const customDB = [
    [
        [/\.mca$/i, ".dat"],
        [/\.dat_mcr$/i, ".dat"],
        [/\.dat_old$/i, ".dat"],
        [/\.lock$/i, ".dat"],
        [/\.mcmeta$/i, ".json"],
    ],
    [
        [/^mods$/, ".bundle"],
        [/^shaderpacks$/, ".fsh"],
    ],
];

export default {
    matchCustomDB(path, dir = false) {
        let data = dir ? customDB[1] : customDB[0];
        for (let entry of data) {
            if (entry[0].test(path)) {
                return entry[1];
            }
        }
        return null;
    },

    getFileIcon(path, dir = false) {
        path = basename(path);
        var customMatch = this.matchCustomDB(path, dir);
        if (customMatch) path = customMatch;

        var icon;
        if (!dir) {
            icon = iconDB.matchName(path);
            if (!icon) icon = iconDB.matchName(".txt");
        } else {
            icon = iconDB.matchName(path, true);
            if (!icon) icon = iconDB.matchLanguage(path);
        }

        return icon;
    },
};
