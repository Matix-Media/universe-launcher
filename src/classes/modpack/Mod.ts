interface IMod {
    path: string,
    name: string,
    author: string,
    description: string,
    url: string
}

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
     * Parse object to new Mod object
     * @param obj to parse
     * @returns new Mod
     */
    static parse(obj: object): Mod {
        var default_: IMod = {path: "", name: "", author: "", description: "", url: ""}
        var parsed: IMod = Object.assign(default_, obj)

        return new Mod(parsed.path, parsed.name, parsed.author, parsed.description, parsed.url)
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