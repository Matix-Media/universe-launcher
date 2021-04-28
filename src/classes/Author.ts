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