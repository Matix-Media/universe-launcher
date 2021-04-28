import Author from "../Author";

export default class Comment {
    id!: Number
    author!: Author
    content!: String
    date!: Date

    constructor(id: Number, author: Author, content: String, date: Date) {
        this.id = id
        this.author = author
        this.content = content
        this.date = date
    }

    /**
     * 
     * @returns The ID of the Comment
     */
    getId(): Number {
        return this.id
    }

    /**
     * 
     * @returns The Author of the Comment
     */
    getAuthor(): Author {
        return this.author
    }

    /**
     * 
     * @returns The content of the Comment
     */
    getContent(): String {
        return this.content
    }

    /**
     * 
     * @returns The Date which when the Comment was created
     */
    getDate(): Date {
        return this.date
    }
}