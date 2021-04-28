import User from "../User";
import Session from "./Session";

export default class Stats {
    user!: User

    getPlaytime(): Number {
        // Calculate playtime from sessions
        return -1
    }

    getLastSession(): Session | undefined {
        // Get the latest session using User.getSessions and looping through tem
        return undefined
    }

}