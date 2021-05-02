import Account from "./Account"
import Author from "./Author";
import DiscoveryInfo from "./DiscoveryInfo/DiscoveryInfo"
import Modpack from "./modpack/Modpack"
import Session from "./modpack/Session"

export default class User {
    settings: Map<string, Object> = new Map<string, Object>()
    library: Array<Modpack> = new Array<Modpack>()
    discovery!: DiscoveryInfo
    accounts: Array<Account> = new Array<Account>()
    sessions: Array<Session> = new Array<Session>()
    appVersion: string

    cachedModpacks: Map<number, Modpack> = new Map<number, Modpack>()
    cachedAuthors: Map<number, Author> = new Map<number, Author>()

    constructor() {
        this.discovery = new DiscoveryInfo()
    }

    /**
     * 
     * @param key The key of the setting
     * @returns The setting or undefined
     */
    getSetting(key: string): Object | undefined {
        return this.settings.get(key)
    }

    /**
     * 
     * @param id The ID of the Modpack
     * @returns The Modpack (or undefined if not found!)
     */
    getModpack(id: number): Modpack | undefined {
        if (this.cachedModpacks.has(id)) {
            return this.cachedModpacks.get(id)
        } else {
            // Fetch the Modpack from the API and add to cache
            return undefined
        }
    }

    /**
     * 
     * @param id The ID of the Author
     * @returns The Author (or undefined if not found!)
     */
    getAuthor(id: number): Author | undefined {
        if (this.cachedAuthors.has(id)) {
            return this.cachedAuthors.get(id)
        } else {
            // Fetch the Author from the API and add to cache
            return undefined
        }
    }

    /**
     * 
     * @returns All Modpacks the User has in its library
     */
    getLibrary(): Array<Modpack> {
        return this.library
    }

    /**
     * 
     * @returns The DiscoveryInfo object
     */
    getDiscovery(): DiscoveryInfo {
        return this.discovery
    }

    /**
     * 
     * @returns the version of the installed app
     */
    getAppVersion(): string {
        return this.appVersion
    }

    /**
     * 
     * @param appVersion Set the version of the app
     */
    setAppVersion(appVersion: string): void {
        this.appVersion = appVersion
    }

    /**
     * 
     * @returns All Accounts of the User
     */
    getAccounts(): Array<Account> {
        return this.accounts
    }

    /**
     * 
     * @returns All the sessions the user had on the local Machine
     */
    getSessions(): Array<Session> {
        return this.sessions
    }
}