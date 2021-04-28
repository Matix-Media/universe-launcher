import Modpack from "./Modpack"

export default class News {
    date!: Date
    modpack!: Modpack
    title!: string
    content!: string

    constructor(date: Date, modpack: Modpack, title: string, content: string) {
        this.date = date
        this.modpack = modpack
        this.title = title
        this.content = content
    }

    /**
     * 
     * @returns The date of the News
     */
    getDate(): Date {
        return this.date
    }

    /**
     * 
     * @returns The Modpack of the News
     */
    getModpack(): Modpack {
        return this.modpack
    }

    /**
     * 
     * @returns The title of the News
     */
    getTitle(): string {
        return this.title
    }

    /**
     * 
     * @returns The content of the News
     */
    getContent(): string {
        return this.content
    }
}