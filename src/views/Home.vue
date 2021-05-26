<template>
    <div class="home">
        <div class="news" v-if="!$api.offlineMode">
            <h3>News</h3>
            <div class="content">
                <NewsSmall v-for="article in data.news" :key="article.ID" :icon="article.modpack.icon" :modpack="article.modpack.name" :title="article.title" :content="article.shortened" :date="article.created" :modpackTarget="'/library/' + article.modpack.ID" :newsId="article.ID" />
            </div>
        </div>
        <div class="lists">
            <full-list title="RECENTLY PLAYED">
                <div class="list-recently-played list">
                    <modpack-small v-for="modpack in data.recentlyPlayed" :key="modpack.ID" :image="modpack.cover" :target="'/library/' + modpack.ID" />
                </div>
            </full-list>

            <full-list title="FAVORITE MODPACKS">
                <div class="list-your-modpacks list">
                    <modpack-small v-for="modpack in data.favorites" :key="modpack.ID" :image="modpack.cover" :target="'/library/' + modpack.ID" />
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
    },
    data() {
        return {
            loading: true,
            data: {
                news: [],
                recentlyPlayed: [],
                favorites: []
            }
        }
    },
    mounted() {
        this.$nextTick(async () => {
            var result = await this.$api.getHome();
            this.data.news = result.news;
            this.data.recentlyPlayed = result.recentlyPlayed;
            this.data.favorites = result.favorites;
            this.loading = false;
        })
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