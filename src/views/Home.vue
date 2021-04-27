<template>
    <div class="home">
        <div class="news">
            <h3>News</h3>
            <div class="content">
                <NewsSmall icon="https://imgur.com/eiuJs3z.png" modpack="Survival Default Kit" title="Major Update to 1.2.1 yeah i tried!" content="Finally! We are updating to 1.2.1. With this update you get the updated mods of Xaero's Minimap and much more stuff ready for you to explore. her is some random teyt to fill the space that is currently empty and to some better designing." date="2021-01-25T14:48Z" modpackTarget="/library/0" newsId="1" />

                <NewsSmall icon="https://imgur.com/u1B1co3.png" modpack="OptiFine for Forge 1.16.4" title="Updated OptiFine" content="We updated OptiFine to HD U G6 for Minecraft 1.16.4. This fixed a lot of old bugs from the recent version HD U G5." date="2021-01-07T14:48Z" modpackTarget="/library/1" newsId="0" />
            </div>
        </div>
        <div class="lists">
            <full-list title="RECENTLY PLAYED">
                <div class="list-recently-played list">
                    <modpack-small image="https://imgur.com/eiuJs3z.png" target="/library/0" />
                    <modpack-small image="https://imgur.com/u1B1co3.png" target="/library/1" />
                </div>
            </full-list>

            <full-list title="YOUR MODPACKS">
                <div class="list-your-modpacks list">
                    <modpack-small image="https://imgur.com/u1B1co3.png" target="/library/1" />
                    <modpack-small image="https://imgur.com/eiuJs3z.png" target="/library/0" />
                </div>
            </full-list>
        </div>
    </div>
</template>

<script>
import NewsSmall from '../components/NewsSmall.vue';
import FullList from '../components/FullList.vue';
import ModpackSmall from '../components/ModpackSmall.vue';

export default {
    name: "Home",
    components: {
        NewsSmall,
        FullList,
        ModpackSmall
    }
}
</script>

<style scoped>
div.home {
    padding-bottom: 5rem;
}

div.news {
    margin: 0 3rem 0 2rem;
    background-color: rgba(255, 255, 255, 0.19);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    backdrop-filter: blur(15px);
    padding: .5rem;
    box-shadow: 1px 4px 9px -1px rgba(0,0,0,0.05);
    overflow: hidden;
}

div.news h3 {
    margin-bottom: .3rem;
}

div.news div.content,
div.list {
    display: flex;
    align-content: top;
    flex-direction: row;
}

div.news div.content div.news-small {
    margin-right: 1.5rem;
}

div.modpack-small {
    margin-right: 1rem;
}

div.lists div.full-list {
    margin: 1.5rem 3rem 0 2rem;
}
</style>