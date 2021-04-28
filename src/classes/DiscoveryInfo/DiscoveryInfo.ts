import Modpack from "../modpack/Modpack";
import { Category, Order } from "./Enums";
import Slide from "./Slide";

export default class DiscoveryInfo {
    
    /**
     * 
     * @returns Get the latest Slides
     */
    getSlides(): Array<Slide> {
        // Fetch latest Slides from API
        return new Array<Slide>()
    }

    /**
     * Get the latest Modpacks
     */
    getNewModpacks(): Array<Modpack> {
        // Fetch latest Modpacks from API
        return new Array<Modpack>()
    }

    /**
     * 
     * @returns Get the latest popular Modpacks
     */
    getPopularModpacks(): Array<Modpack> {
        // Fetch latest popular Modpacks from API
        return new Array<Modpack>()
    }

    /**
     * 
     * @param query The search term
     * @param order (Optional) The oder of the search results
     * @param categories (Optional) The categories which are searched in (if empty list all categories are used)
     * @returns 
     */
    search(
        query: string, 
        order: Order = Order.Relevance, 
        categories: Array<Category> = new Array<Category>()
    ): Array<Modpack> {
        // Fetch search results from API
        return new Array<Modpack>()
    }

}