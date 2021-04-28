import Author from "../Author"
import Mod from "./Mod"
import Comment from "./Comment"
import Stats from "./Stats"
import News from "./News"

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
        mods: Array<Mod>,
        version: string,
        gameVersion: string,
        comments: Array<Comment>,
        commentsAmount: number,
        downloads: number,
        likes: number,
        stats: Stats,
        news: Array<News>,
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
        this.mods.concat(mods)
        this.version = version
        this.gameVersion = gameVersion
        this.comments.concat(comments)
        this.commentsAmount = commentsAmount
        this.downloads = downloads
        this.likes = likes
        this.stats = stats
        this.news.concat(news)
        this.logo = logo
        this.icon = icon
        this.cover = cover
        this.description = description
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