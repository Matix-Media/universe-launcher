/* eslint-disable no-prototype-builtins */
import axios from "axios";

("strict mode");

const isDevelopment = process.env.NODE_ENV !== "production";
const apiUrl = isDevelopment ? "http://localhost:3000" : "https://api.universe.matix-media.net";

export default class API {
    constructor() {
        this.cache = {
            modpacks: { modpacks: {}, comments: {}, news: {}, mods: {} },
            home: {},
            discovery: {},
        };
    }

    getModpack(id) {
        return new Promise((resolve, reject) => {
            if (this.cache.modpacks.modpacks.hasOwnProperty(id)) {
                resolve(this.cache.modpacks.modpacks[id]);
            } else {
                axios
                    .get(apiUrl + "/modpack/" + id)
                    .then((res) => {
                        this.cache.modpacks.modpacks[id] = res.data;
                        resolve(res.data);
                    })
                    .catch(() => {
                        reject();
                    });
            }
        });
    }

    getHome()
}
