import { db as iconDB } from "file-icons-js";
import { basename } from "path";

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

    getFileIcon(path, dir = false) {
        path = basename(path);
        var customMatch = this.matchCustomDB(path);
        if (customMatch) path = customMatch;

        var icon;
        if (!dir) icon = iconDB.matchName(path);
        else icon = iconDB.matchName(path, true);

        if (!icon)
            if (!dir) icon = iconDB.matchName(".txt").getClass();
            else icon = "dir-type";
        else icon = icon.getClass(0);

        return icon;
    },
};
