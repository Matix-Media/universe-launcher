export default class Mod {
    path!: String
    name!: String
    description: String = ""
    author!: String
    url: String = ""

    constructor(
        path: String, 
        name: String, 
        author: String, 
        description: String = "", 
        url: String = ""
    ) {
        this.path = path
        this.name = name
        this.author = author
        this.description = description
        this.url = url
    }

    /**
     * 
     * @returns The name of the Mod
     */
    getName(): String {
        return this.name
    }

    /**
     * 
     * @returns The description of the Mod (Could be empty!)
     */
    getDescription(): String {
        return this.description
    }

    /**
     * 
     * @returns The name of the Mod Author
     */
    getAuthor(): String {
        return this.author
    }

    /**
     * 
     * @returns The origin URL of the Mod (Could be empty!)
     */
    getURL(): String {
        return this.url
    }

    /**
     * 
     * @returns The path of the Mod in the Modpack
     */
    getPath(): String {
        return this.path
    }
}