<template>
    <div class="library">
        <div class="filter-top-bar">
            <div class="control-group">
                <p class="description">Order by:</p>
                <dropdown class="control" :options="['Alphabetical', 'Relevance', 'Release date']" default="Alphabetical" />
            </div>
            <search-box />
        </div>

        <div class="results">
            <modpack-big image="https://imgur.com/eiuJs3z.png" target="/library/0" name="Survival Default Kit" author="Matix" game-version="1.16.4" />
            <modpack-big image="https://imgur.com/u1B1co3.png" target="/library/1" name="OptiFine for Forge 1.16.4" author="Matix" game-version="1.16.4" />
        </div>
    </div>
</template>

<script>
import Dropdown from '../components/controls/Dropdown.vue'
import SearchBox from '../components/SearchBox.vue'
import ModpackBig from '../components/ModpackBig.vue'

export default {
    components: { Dropdown, SearchBox, ModpackBig },
    name: "Library",
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