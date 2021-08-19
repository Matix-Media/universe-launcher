// eslint-disable-next-line no-unused-vars
import AdmZip from "adm-zip";

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
};
