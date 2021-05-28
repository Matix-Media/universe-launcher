<template>
    <div class="discover">
        <div class="skeleton-loader" v-if="isLoading">

        </div>
        <div class="loaded-page-content" v-if="!isLoading">
            <div class="content">
                <carousel :slides="data.slides" />

                    <header-list title="New Modpacks" class="new list" height="21rem">
                        <modpack-big 
                            v-for="modpack in data.newModpacks" :key="modpack.ID" 
                            :image="modpack.cover" 
                            :name="modpack.name" 
                            :author="modpack.author.name" 
                            :gameVersion="modpack.game_version" 
                            :target="'/discover/' + modpack.ID" 
                        />
                    </header-list>

                    <header-list title="Popular Modpacks" class="new list" height="21rem">
                        
                        <modpack-big 
                            v-for="modpack in data.popularModpacks" :key="modpack.ID" 
                            :image="modpack.cover" 
                            :name="modpack.name" 
                            :author="modpack.author.name" 
                            :gameVersion="modpack.game_version" 
                            :target="'/discover/' + modpack.ID" 
                        />
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
        
        <modal v-if="error.isError" title="Error" width="20rem" :buttons="[{text: 'Back', emit: 'back'}, {text: 'Home', emit: 'home'}]" 
            v-on:back="$router.go(-1)" 
            v-on:home="$router.push({name: 'home'})"
        >
            <p class="error-dialog">
                An error occurred while loading.<br>
                {{error.message}}
                </p>
        </modal>
    </div>
</template>

<script>
import Dropdown from '../components/controls/Dropdown.vue'
import SearchBox from '../components/SearchBox.vue'
import MultiSelect from '../components/controls/MultiSelect.vue'
import Carousel from '../components/Carousel.vue'
import ModpackBig from '../components/ModpackBig.vue'
import HeaderList from "../components/HeaderList.vue"
import Modal from "../components/Modal.vue";

export default {
    components: { 
        Dropdown, 
        SearchBox,
        MultiSelect,
        Carousel,
        ModpackBig,
        HeaderList,
        Modal
    },
    name: "Discover",
    data() {
        return {
            isLoading: true,
            data: {
                slides: [],
                newModpacks: [],
                popularModpacks: []
            },
            error: {
                isError: false,
                message: ""
            }
        }
    },
    mounted() {
        this.$nextTick(async () => {
            try {
                var result = await this.$api.getDiscover();
                for (var elem of result.slides) {
                    this.data.slides.push({
                        modpack: elem.modpack.name, 
                        title: elem.title, 
                        icon: elem.modpack.cover, 
                        banner: elem.banner, 
                        category: elem.category, 
                        text: elem.text,
                        button: elem.button,
                        target: '/discover/' + elem.modpack.ID
                    });
                }
                this.data.newModpacks = result.newModpacks;
                this.data.popularModpacks = result.popularModpacks;
                this.isLoading = false;
            } catch (err) {
                this.error.isError = true;
                this.error.message = err;
            }
        });
    }
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