<template>
    <div class="discover">
        <div class="content">
            <carousel :slides="[
                {
                    modpack: 'Survival Default Kit', 
                    title: 'Improved Survival experience', 
                    icon: 'https://imgur.com/eiuJs3z.png', 
                    banner: 'https://imgur.com/43RMwht.png', 
                    category: 'New Modpack', 
                    text: 'Optimize your survival gameplay with this great modpack!',
                    button: 'Play now',
                    target: '/discover/0'
                }, 
                {
                    modpack: 'OptiFine for Forge 1.16.4', 
                    title: 'Get the best visuals out of Minecraft', 
                    icon: 'https://imgur.com/u1B1co3.png', 
                    banner: 'https://images-eu.ssl-images-amazon.com/images/I/91i55nLc-7L.jpg', 
                    category: 'New Modpack', 
                    text: 'Tune up your game with the OptiFine extension. Get the best visual experience out of Minecraft!',
                    button: 'Learn more',
                    target: '/discover/1'
                },
                {
                    modpack: 'Star Wars: Conquest', 
                    title: 'A galaxy far, far away meets Minecraft', 
                    icon: 'https://prodigits.co.uk/thumbs/wallpapers/p2/movies/44/e7a519c412482820.jpg', 
                    banner: 'https://cdn.technicpack.net/platform2/pack-backgrounds/1361984.jpg?1610551623', 
                    category: 'New Modpack', 
                    text: 'Travel to new worlds, complete quests, forge your own lightsabers, and build your own ship as you explore a galaxy far, far away!',
                    button: 'Discover the Galaxy',
                    target: '/discover/2'
                },
                {
                    modpack: 'Minecraft SKY', 
                    title: 'Skyblock but different', 
                    icon: 'https://i.ytimg.com/vi/Q3xWKeOjBnA/maxresdefault.jpg', 
                    banner: 'https://cdn.hipwallpaper.com/i/58/60/IGaW4g.jpg', 
                    category: 'New Modpack', 
                    text: 'Just a tree. That is all you get to build up your own steampunk empire in the skies!',
                    button: 'Try now',
                    target: '/discover/3'
                },
                {
                    modpack: 'RL Craft',
                    title: 'The most extreme pack!',
                    icon: 'https://imgur.com/1LKTVsX.png',
                    banner: 'https://assets.gamepur.com/wp-content/uploads/2020/10/23142934/RLCraft.jpg',
                    category: 'New Modpack',
                    text: 'You want Ultra-Hardcore-Minecraft? Then RL Craft is perfect for your desires.',
                    button: 'Get Real',
                    target: '/discover/4'
                }
            ]" />

                <header-list title="New Modpacks" class="new list" height="21rem">
                    <modpack-big image="https://imgur.com/u1B1co3.png" target="/discover/1" name="OptiFine for Forge 1.16.4" author="Matix" game-version="1.16.4" />
                    <modpack-big image="https://imgur.com/eiuJs3z.png" target="/discover/0" name="Survival Default Kit" author="Matix" game-version="1.16.4" />
                    <modpack-big image="https://prodigits.co.uk/thumbs/wallpapers/p2/movies/44/e7a519c412482820.jpg" target="/discover/0" name="Star Wars: Conquest" author="Matix" game-version="1.7.10" />
                    <modpack-big image="https://i.ytimg.com/vi/Q3xWKeOjBnA/maxresdefault.jpg" target="/discover/2" name="Minecraft SKY" author="Matix" game-version="1.7.10" />
                    <modpack-big image="https://imgur.com/1LKTVsX.png" target="/discover/2" name="RL Craft" author="Matix" game-version="1.12.2" />
                </header-list>

                <header-list title="Popular Modpacks" class="new list" height="21rem">
                    <modpack-big image="https://imgur.com/eiuJs3z.png" target="/discover/0" name="Survival Default Kit" author="Matix" game-version="1.16.4" />
                    <modpack-big image="https://prodigits.co.uk/thumbs/wallpapers/p2/movies/44/e7a519c412482820.jpg" target="/discover/0" name="Star Wars: Conquest" author="Matix" game-version="1.7.10" />
                    <modpack-big image="https://imgur.com/u1B1co3.png" target="/discover/1" name="OptiFine for Forge 1.16.4" author="Matix" game-version="1.16.4" />
                    <modpack-big image="https://imgur.com/1LKTVsX.png" target="/discover/2" name="RL Craft" author="Matix" game-version="1.12.2" />
                    <modpack-big image="https://i.ytimg.com/vi/Q3xWKeOjBnA/maxresdefault.jpg" target="/discover/2" name="Minecraft SKY" author="Matix" game-version="1.7.10" />
                </header-list>
        </div>

        
        <div class="filter">
            <search-box />
            <div class="row">
                <p class="description">Order by:</p>
                <dropdown class="control" :options="['Alphabetical', 'Relevance', 'Release date']" default="Alphabetical" />
            </div>
            <div class="multi-select">
                <p class="control">CATEGORIES</p>
                <multi-select :options="['Action', 'Adventure', 'Indie', 'RPG', 'Strategie']" />
            </div>
        </div>
    </div>
</template>

<script>
import Dropdown from '../components/controls/Dropdown.vue'
import SearchBox from '../components/SearchBox.vue'
import MultiSelect from '../components/controls/MultiSelect.vue'
import Carousel from '../components/Carousel.vue'
import ModpackBig from '../components/ModpackBig.vue'
import HeaderList from "../components/HeaderList.vue"

export default {
    components: { 
        Dropdown, 
        SearchBox,
        MultiSelect,
        Carousel,
        ModpackBig,
        HeaderList
    },
    name: "Discover"
}
</script>

<style scoped>
div.discover {
    padding-right: 15rem;
}

div.content {
    flex: 1;
    
    padding: 1.5rem;
    padding-bottom: 5rem;
    box-sizing: border-box;

    height: 100%;
    overflow: auto;
}

div.content div.list {
    margin-top: 5rem;
}

div.content div.list div.modpack-big {
    margin-right: 2rem;
    margin-bottom: 5rem;
}

div.filter {
    position: fixed;
    top: 0;
    right: 0;
    width: 15rem;
    height: 100%;
    box-sizing: border-box;
    font-size: .9rem;
    font-weight: 300;
    padding: 1rem;

    background-color: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(15px);
}

div.filter div {
    margin-bottom: 1rem;
}

div.filter .control {
    color: rgba(255, 255, 255, 0.8);
}

div.filter .description {
    color: rgba(255, 255, 255, 0.5);
}

div.filter .row {
    display: flex;
    flex-direction: row;
}
</style>