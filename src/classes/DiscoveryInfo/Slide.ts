import Modpack from "../modpack/Modpack"

export default class Slide {
    private title!: string
    private description!: string
    private button!: string
    private headline!: string
    private name!: string
    private eyebrow!: string
    private banner!: string
    private cover!: string
    private modpack!: Modpack


	constructor(
        title: string,
        description: string,
        button: string,
        headline: string,
        name: string,
        eyebrow: string,
        banner: string,
        cover: string,
        modpack: Modpack
    ) {
        this.title = title
        this.description = description
        this.button = button
        this.headline = headline
        this.name = name
        this.eyebrow = eyebrow
        this.banner = banner
        this.cover = cover
        this.modpack = modpack
	}

    /**
     * 
     * @returns The title of the Slide
     */
    getTitle(): string {
        return this.title
    }

    /**
     * 
     * @returns The description of the Slide
     */
    getDescription(): string {
        return this.description
    }

    /**
     * 
     * @returns The button-text of the Slide
     */
    getButton(): string {
        return this.button
    }
    
    /**
     * 
     * @returns The headline text of the Slide
     */
    getHeadline(): string {
        return this.headline
    }

    /**
     * 
     * @returns The name of the Slide
     */
    getName(): string {
        return this.name
    }

    /**
     * 
     * @returns The eyebrow-text of the Slide
     */
    getEyebrow(): string {
        return this.eyebrow
    }

    /**
     * 
     * @returns The URL of the banner of the Slide
     */
    getBanner(): string {
        return this.banner
    }

    /**
     * 
     * @returns The URL of the cover of the Slide
     */
    getCover(): string {
        return this.cover
    }

    /**
     * 
     * @returns The Modpack of the Slide
     */
    getModpack(): Modpack {
        return this.modpack
    }
}