export default class Author {
    id!: Number
    name!: String

    /**
     * 
     * @param id of the Author
     * @param name of the Author
     */
    constructor(id: Number, name: String) {
        this.id = id
        this.name = name
    }

    /**
     * Parse object to new Author object
     * @param obj to parse
     * @returns new Author
     */
    static parse(obj: any): Author {
        var id: number = -1
        var name: string = ""

        if ("id" in obj)
            id = obj.id
        if ("name" in obj)
            name = obj.name

        return new Author(id, name)
    }

    /**
     * 
     * @returns The ID of the Author
     */
    getId(): Number {
        return this.id;
    }

    /**
     * 
     * @returns The name of the Author
     */
    getName(): String {
        return this.name
    }
}