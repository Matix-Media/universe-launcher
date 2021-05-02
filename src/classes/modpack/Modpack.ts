import Author from "../Author"
import Mod from "./Mod"
import Comment from "./Comment"
import Stats from "./Stats"
import News from "./News"

interface IModpack {
    id: number,
    name: string,
    author: Author,
    versionReleaseDate: Date,
    releaseDate: Date,
    description: string,
    version: string,
    gameVersion: string,
    commentsAmount: number,
    downloads: number,
    likes: number,
    logo: string,
    icon: string,
    cover: string
}

export default class Modpack {
    id!: number
    name!: string
    author!: Author
    versionReleaseDate!: Date
    releaseDate!: Date
    mods: Array<Mod> = new Array<Mod>()
    description: string = ""
    version!: string
    gameVersion!: string
    comments: Array<Comment> = new Array<Comment>()
    commentsAmount!: number
    downloads!: number
    likes!: number
    stats!: Stats
    installed: boolean = false
    news: Array<News> = new Array<News>()
    logo!: string
    icon!: string
    cover!: string


    constructor(
        id: number,
        name: string,
        author: Author,
        versionReleaseDate: Date,
        releaseDate: Date,
        version: string,
        gameVersion: string,
        commentsAmount: number,
        downloads: number,
        likes: number,
        logo: string,
        icon: string,
        cover: string,
        description: string = ""
    ) {
        this.id = id
        this.name = name
        this.author = author
        this.versionReleaseDate = versionReleaseDate
        this.releaseDate = releaseDate
        this.version = version
        this.gameVersion = gameVersion
        this.commentsAmount = commentsAmount
        this.downloads = downloads
        this.likes = likes
        this.logo = logo
        this.icon = icon
        this.cover = cover
        this.description = description
    }

    /**
     * Parse Object to new Modpack object
     * @param obj to parse
     * @returns new Modpack
     */
    static parse(obj: object): Modpack {
        var default_: IModpack = {
            id: -1, 
            name: "", 
            author: null, 
            versionReleaseDate: null,
            releaseDate: null,
            version: "", 
            gameVersion: "", 
            commentsAmount: -1, 
            downloads: -1, 
            likes: -1, 
            logo: "", 
            icon: "", 
            cover: "", 
            description: ""
        }
        if ("author" in obj)
            obj["author"] = Author.parse(obj["author"])
        if ("versionReleaseDate" in obj)
            obj["versionReleaseDate"] = Date.parse(obj["versionReleaseDate"])
        if ("releaseDate" in obj)
            obj["releaseDate"] = Date.parse(obj["releaseDate"])

        var parsed: IModpack = Object.assign(default_, obj)

        return new Modpack(parsed.id, parsed.name, parsed.author, parsed.versionReleaseDate, parsed.releaseDate, parsed.version, parsed.gameVersion, parsed.commentsAmount, parsed.downloads, parsed.likes, parsed.logo, parsed.icon, parsed.cover, parsed.description)
    }

    /**
     * 
     * @returns The ID of the Modpack
     */
    getId(): number {
        return this.id
    }

    /**
     * 
     * @returns The name of the Modpack
     */
    getName(): string {
        return this.name
    }

    /**
     * 
     * @returns The Author of the Modpack
     */
    getAuthor(): Author {
        return this.author
    }

    /**
     * 
     * @returns The release date of the latest version of the Modpack
     */
    getVersionReleaseDate(): Date {
        return this.versionReleaseDate
    }

    /**
     * 
     * @returns The release date of the first version of the Modpack
     */
    getReleaseDate(): Date {
        return this.releaseDate
    }

    /**
     * 
     * @returns All Mods used in the Modpack
     */
    getMods(): Array<Mod> {
        return this.mods
    }

    /**
     * 
     * @returns The latest version of the Modpack
     */
    getVersion(): string {
        return this.version
    }

    /**
     * 
     * @returns The version of Minecraft the Modpack was made for
     */
    getGameVersion(): string {
        return this.gameVersion
    }

    /**
     * 
     * @returns All Comments of the Modpack
     */
    getComments(): Array<Comment> {
        return this.comments
    }

    /**
     * 
     * @returns The amount of comments of the Modpack
     */
    getCommentsAmount(): number {
        return this.commentsAmount
    }

    /**
     * 
     * @returns The amount of downloads the Modpack has
     */
    getDownloads(): number {
        return this.downloads
    }

    /**
     * 
     * @returns The amount of likes the Modpack has
     */
    getLikes(): number {
        return this.likes
    }

    /**
     * 
     * @returns The Stats of the Modpack
     */
    getStats(): Stats {
        return this.stats
    }

    /**
     * 
     * @returns All News of the Modpack
     */
    getNews(): Array<News> {
        return this.news
    }

    /**
     * 
     * @returns The URL of the logo of the Modpack
     */
    getLogo(): string {
        return this.logo
    }

    /**
     * 
     * @returns The URL of the icon of the Modpack
     */
    getIcon(): string {
        return this.icon
    }

    /**
     * 
     * @returns The URL of the cover of the Modpack
     */
    getCover(): string {
        return this.cover
    }

    /**
     * 
     * @returns The description of the Modpack
     */
    getDescription(): string {
        return this.description
    }

    /**
     * Install the Modpack on te locale Machine
     * @returns If the process succeeded
     */
    install(): boolean {
        return false
    }

    /**
     * Launch the Modpack on the locale Machine
     * @returns If the process succeeded
     */
    play(): boolean {
        return false
    }

    /**
     * Like the Modpack with your default Account
     * @returns If the process succeeded
     */
    like(): boolean {
        return false
    }

    /**
     * 
     * @param content The content of the comment
     * @returns If the process succeeded
     */
    comment(content: string): boolean {
        return false
    }
}