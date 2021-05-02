import User from "../User";
import Modpack from "./Modpack";
import Session from "./Session";

export default class Stats {
    user!: User
    modpack!: Modpack

    constructor(user: User, modpack: Modpack) {
        this.user = user
        this.modpack = modpack
    }

    getPlaytime(): Number {
        // Calculate playtime from sessions
        return -1
    }

    getLastSession(): Session | undefined {
        // Get the latest session using User.getSessions and looping through tem
        return undefined
    }

}