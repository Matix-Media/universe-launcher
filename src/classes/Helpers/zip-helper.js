// eslint-disable-next-line no-unused-vars
import AdmZip from "adm-zip";
import zlip from "zlib";

export default {
    /**
     * Read zip entry as text async as promise
     * @param {AdmZip} archive
     * @param {string | AdmZip.IZipEntry} entry
     * @param {string} encoding
     * @return {string} The archive content
     */
    readAsText(archive, entry, encoding = "utf8") {
        return new Promise((resolve, reject) => {
            archive.readAsTextAsync(
                entry,
                (data, err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                },
                encoding
            );
        });
    },

    /**
     * Helpers for the zlib library
     */
    zlib: {
        /**
         * Asynchronously gunzip buffer
         * @param {zlib.InputType} buffer The zipped buffer
         * @returns {Promise<Buffer>}
         */
        gunzip(buffer) {
            return new Promise((resolve, reject) => {
                zlip.gunzip(buffer, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        },
    },
};
