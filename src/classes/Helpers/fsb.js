"strict mode";

import fs from "fs";
const fsp = fs.promises;

export default {
    /**
     * Check if a file/directory exists
     * @param {string} location The location of the file/directory
     * @param {integer} mode mode
     * @returns {Promise<boolean>}
     */
    async exists(location, mode = fs.constants.F_OK) {
        try {
            await fsp.access(location, mode);
            return true;
        } catch (_) {
            return false;
        }
    },

    /**
     * Check if a directory exists
     * @param {string} location The location of the directory
     * @returns {Promise<boolean>}
     */
    async isDirectory(location) {
        try {
            return (await fsp.stat(location)).isDirectory();
        } catch (_) {
            return false;
        }
    },

    /**
     * Check if a file exists
     * @param {string} location The location of the file
     * @returns {Promise<boolean>}
     */
    async isFile(location) {
        try {
            return (await fsp.stat(location)).isFile();
        } catch (_) {
            return false;
        }
    },
};
