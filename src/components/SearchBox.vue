<template>
    <div class="search-box" :class="{open: open}">
        <i class="fas fa-search" @click="submit"></i>
        <input placeholder="Search" type="text" @blur="open = false" @focus="open = true" @keyup.enter="submit" @keyup="keypress" v-model="content" />
    </div>
</template>

<script>
import _ from "lodash"

export default {
    name: "SearchBox",
    data() {
        return {
            open: false,
            content: "",
        }
    },
    computed: {
        keypress: function() {return _.debounce(this.submit, 1000);}
    },
    methods: {
        submit() {
            this.$emit("submit", this.content);
            this.keypress.cancel();
        }
    }
}
</script>

<style scoped>
.search-box {
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.12);
    border-radius: 2px;
    overflow: hidden;
    font-size: inherit;
    transition: background-color .2s;
}

.search-box.open {
    background-color: rgba(255, 255, 255, 0.18);
}

i {
    color: rgba(255, 255, 255, 0.5);
    padding: .3rem;
    padding-left: .5rem;
    cursor: pointer;
    font-size: inherit;
    transition: color .2s;
}

i:hover {
    color: rgba(255, 255, 255, 0.8);
}

input {
    border: none;
    background-color: transparent;
    padding: .3rem;
    padding-right: .5rem;
    color: white;
    font-size: inherit;
    font-weight: inherit;
    flex: 1;
}

input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}
</style>