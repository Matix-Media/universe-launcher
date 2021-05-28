<template>
    <div class="library">
        <div class="skeleton-loader" v-if="isLoading">
            <div style="margin: 4.5rem 2rem;display:flex;">
                <div class="sk-bg" style="height:20.5rem;width:13rem;margin-right:1rem;">
                    <div class="sk" style="width:7rem;height:1.2rem;margin-top:17.25rem;margin-left:.5rem;"></div>
                    <div class="sk" style="height:1rem;width:4rem;margin-left:.5rem;margin-top:.5rem;"></div>
                </div>
                <div class="sk-bg" style="height:20.5rem;width:13rem;margin-right:1rem;">
                    <div class="sk" style="width:7rem;height:1.2rem;margin-top:17.25rem;margin-left:.5rem;"></div>
                    <div class="sk" style="height:1rem;width:4rem;margin-left:.5rem;margin-top:.5rem;"></div>
                </div>
                <div class="sk-bg" style="height:20.5rem;width:13rem;margin-right:1rem;">
                    <div class="sk" style="width:7rem;height:1.2rem;margin-top:17.25rem;margin-left:.5rem;"></div>
                    <div class="sk" style="height:1rem;width:4rem;margin-left:.5rem;margin-top:.5rem;"></div>
                </div>
                <div class="sk-bg" style="height:20.5rem;width:13rem;margin-right:1rem;">
                    <div class="sk" style="width:7rem;height:1.2rem;margin-top:17.25rem;margin-left:.5rem;"></div>
                    <div class="sk" style="height:1rem;width:4rem;margin-left:.5rem;margin-top:.5rem;"></div>
                </div>
            </div>
        </div>
        <div class="loaded-page-content" v-show="!isLoading">
            <div class="filter-top-bar">
                <div class="control-group">
                    <p class="description">Order by:</p>
                    <dropdown class="control" :options="['Alphabetical', 'Relevance', 'Release date']" default="Alphabetical" v-on:input="onOrderChange" />
                </div>
                <search-box v-on:submit="onSearchSubmit" />
            </div>

            <div class="results">
                <modpack-big v-for="modpack in modpacks" :key="modpack.ID" :image="modpack.cover" :target="'/library/' + modpack.ID" :name="modpack.name" :author="modpack.author.name" :gameVersion="modpack.game_version" />
            </div>
        </div>
        
        <modal title="Error" v-if="error.isError" width="28rem" :buttons="[{text: 'Show offline modpacks', emit: 'activateOffline'}]"
            v-on:activateOffline="localOfflineMode = true;getLibrary()"
        >
            An error occurred while loading.<br>
            {{error.message}}
        </modal>
    </div>
</template>

<script>
import Dropdown from '../components/controls/Dropdown.vue'
import SearchBox from '../components/SearchBox.vue'
import ModpackBig from '../components/ModpackBig.vue'
import Modal from "../components/Modal.vue";

export default {
    components: { Dropdown, SearchBox, ModpackBig, Modal },
    name: "Library",
    data() {
        return {
            isLoading: true,
            localOfflineMode: false,
            modpacks: [],
            query: null,
            order: "Alphabetical",
            error: {
                isError: false,
                message: ""
            }
        }
    },
    methods: {
        onOrderChange(value) {
            var newVal = null;
            if (value != "") newVal = value;

            if (newVal != this.order) {
                this.order = newVal;
                this.getLibrary(this.order, this.value);
            }
        },
        onSearchSubmit(value) {
            var newVal = null;
            if (value != "") newVal = value;

            if (newVal != this.query) {
                this.query = newVal;
                this.getLibrary(this.order, this.value);
            }
        },
        async getLibrary() {
            try {
                this.error.isError = false;
                this.error.message = "";
                this.isLoading = true;
                var res = await this.$api.getLibrary(this.order, this.query, this.localOfflineMode);
                this.modpacks = res;
                this.isLoading = false;
            } catch (err) {
                this.error.isError = true;
                this.error.message = err;
                console.log("Error loading library:", err);
            }
        }
    },
    mounted() {
        this.$nextTick(async () => {
            await this.getLibrary();
        });
    }
}
</script>

<style scoped>
.filter-top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .4rem;
    padding-left: 2rem;
    padding-right: 2rem;
    font-size: .9rem;
    font-weight: 300;

    backdrop-filter: blur(15px);
    background-color: rgba(255, 255, 255, 0.02);
}

.control-group {
    display: flex;
    align-items: center;
}

.filter-top-bar p.description {
    color: rgba(255, 255, 255, 0.5);
}

.filter-top-bar .control {
    color: rgba(255, 255, 255, 0.8);
    transition: color .2s;
    margin-right: 2rem;
}

.filter-top-bar .control:hover, .control:focus {
    color: white;
}

.search-box {
    width: 30%;
}

div.results {
    display: flex;
    flex-direction: row;
    align-content: top;
    margin: 2rem;
    margin-top: 2rem;
    z-index: -1;
}

div.results div.modpack-big {
    margin-right: 2rem;
    margin-bottom: 2rem;
}
</style>