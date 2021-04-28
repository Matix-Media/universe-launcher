import Account from "../Account";
import Modpack from "./Modpack";

export default class Session {
    modpack!: Modpack
    account!: Account
    start!: Date
    end: Date | undefined
    
    constructor(modpack: Modpack, account: Account, start: Date | undefined = undefined, end: Date | undefined = undefined) {
        this.modpack = modpack
        this.account = account
        if (start)
            this.start = start
        else
            this.start = new Date()
        this.end = end
    }

    /**
     * 
     * @returns The Modpack of the Session
     */
    getModpack(): Modpack {
        return this.modpack
    }

    /**
     * 
     * @returns The Account of the Session
     */
    getAccount(): Account {
        return this.account
    }

    /**
     * 
     * @returns If the session is currently active
     */
    isActive(): boolean {
        if (this.end)
            return false
        else
            return true
    }

    /**
     * 
     * @returns The start of the session
     */
    getStart(): Date {
        return this.start
    }

    /**
     * 
     * @returns The end of the session
     */
    getEnd(): Date | undefined {
        return this.end
    }
}