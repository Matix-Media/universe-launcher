<template>
    <div class="home">
        <div class="skeleton-loader" v-if="isLoading">
            <div class="sk-bg" style="margin: 0 3rem 0 2rem;height:13rem;border-top-left-radius:0;border-top-right-radius:0">
                <div class="sk" style="height:1.5rem;width:5rem;margin:.8rem .5rem"></div>
                <div style="margin:1.2rem .5rem;display:flex;">
                    <div style="margin-right:3rem">
                        <div class="sk" style="height:1.3rem;width:10rem;"></div>
                        <div class="sk" style="height:1rem;width:8rem;margin-top:.6rem;"></div>
                        <div class="sk" style="height:1rem;width:9rem;margin-top:.3rem;"></div>
                        <div class="sk" style="height:1rem;width:12rem;margin-top:.3rem;"></div>
                    </div>
                    <div style="margin-right:3rem">
                        <div class="sk" style="height:1.3rem;width:10rem;"></div>
                        <div class="sk" style="height:1rem;width:8rem;margin-top:.6rem;"></div>
                        <div class="sk" style="height:1rem;width:9rem;margin-top:.3rem;"></div>
                        <div class="sk" style="height:1rem;width:12rem;margin-top:.3rem;"></div>
                    </div>
                    <div style="margin-right:3rem">
                        <div class="sk" style="height:1.3rem;width:10rem;"></div>
                        <div class="sk" style="height:1rem;width:8rem;margin-top:.6rem;"></div>
                        <div class="sk" style="height:1rem;width:9rem;margin-top:.3rem;"></div>
                        <div class="sk" style="height:1rem;width:12rem;margin-top:.3rem;"></div>
                    </div>
                    <div>
                        <div class="sk" style="height:1.3rem;width:10rem;"></div>
                        <div class="sk" style="height:1rem;width:8rem;margin-top:.6rem;"></div>
                        <div class="sk" style="height:1rem;width:9rem;margin-top:.3rem;"></div>
                        <div class="sk" style="height:1rem;width:12rem;margin-top:.3rem;"></div>
                    </div>
                </div>
            </div>
            <div class="sk-bg" style="margin:1.5rem 3rem 0 2rem">
                <div class="sk" style="margin:.5rem;width:8rem;height:1.5rem;"></div>
                <div style="margin-top: .5rem;display:flex;">
                    <div class="sk" style="width: 6.5rem; height: 9rem;margin:.5rem"></div>
                    <div class="sk" style="width: 6.5rem; height: 9rem;margin:.5rem"></div>
                    <div class="sk" style="width: 6.5rem; height: 9rem;margin:.5rem"></div>
                    <div class="sk" style="width: 6.5rem; height: 9rem;margin:.5rem"></div>
                    <div class="sk" style="width: 6.5rem; height: 9rem;margin:.5rem"></div>
                    <div class="sk" style="width: 6.5rem; height: 9rem;margin:.5rem"></div>
                    <div class="sk" style="width: 6.5rem; height: 9rem;margin:.5rem"></div>
                    <div class="sk" style="width: 6.5rem; height: 9rem;margin:.5rem"></div>
                </div>
            </div>
            <div class="sk-bg" style="margin:1.5rem 3rem 0 2rem">
                <div class="sk" style="margin:.5rem;width:8rem;height:1.5rem;"></div>
                <div style="margin-top: .5rem;display:flex;">
                    <div class="sk" style="width: 6.5rem; height: 9rem;margin:.5rem"></div>
                    <div class="sk" style="width: 6.5rem; height: 9rem;margin:.5rem"></div>
                    <div class="sk" style="width: 6.5rem; height: 9rem;margin:.5rem"></div>
                    <div class="sk" style="width: 6.5rem; height: 9rem;margin:.5rem"></div>
                    <div class="sk" style="width: 6.5rem; height: 9rem;margin:.5rem"></div>
                    <div class="sk" style="width: 6.5rem; height: 9rem;margin:.5rem"></div>
                    <div class="sk" style="width: 6.5rem; height: 9rem;margin:.5rem"></div>
                    <div class="sk" style="width: 6.5rem; height: 9rem;margin:.5rem"></div>
                </div>
            </div>
        </div>
        <div class="loaded-page-content" v-if="!isLoading">
            <div class="news" v-if="!localOfflineMode && !$api.offlineMode">
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
        <modal title="Error" v-if="error.isError" width="28rem" :buttons="[
            {text: 'Close UNIVERSE Launcher', emit: 'exitApp'}, 
            {text: 'Activate offline mode', emit: 'activateOffline'}
        ]"
        v-on:exitApp="$root.exitApp()"
        v-on:activateOffline="localOfflineMode = true;render()"
        >
            An error occured while loading.<br>
            {{error.message}}
        </modal>
    </div>
</template>

<script>
import NewsSmall from '../components/NewsSmall.vue';
import FullList from '../components/FullList.vue';
import ModpackSmall from '../components/ModpackSmall.vue';
import Modal from "../components/Modal.vue";

export default {
    name: "Home",
    components: {
        NewsSmall,
        FullList,
        ModpackSmall,
        Modal
    },
    data() {
        return {
            isLoading: true,
            localOfflineMode: false,
            data: {
                news: [],
                recentlyPlayed: [],
                favorites: []
            },
            error: {
                isError: false,
                message: ""
            }
        }
    },
    methods: {
        async render() {
            try {
                this.error.isError = false;
                this.error.message = "";
                var result = await this.$api.getHome(this.localOfflineMode);
                this.data.news = result.news;
                this.data.recentlyPlayed = result.recentlyPlayed;
                this.data.favorites = result.favorites;
                this.isLoading = false;
            } catch(err) {
                this.error.isError = true;
                this.error.message = err;
                console.error("Error loading home:", err);
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.render();
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