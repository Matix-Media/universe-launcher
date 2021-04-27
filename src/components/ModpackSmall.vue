<template>
    <div class="modpack-small" :style="cImage" v-on:click="followModpack">

    </div>
</template>

<script>
export default {
    name: "ModpackSmall",
    props: ["image", "target"],
    computed: {
        cImage() {
            return "background-image: url('" + this.image + + "');";
        }
    },
    methods: {
        followModpack() {
            this.$router.push(this.target);
        }
    }
}
</script>

<style scoped>
div.modpack-small {
    height: 8.5rem;
    width: 6.25rem;
    background-size: cover;
    background-position: center;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.17);
    cursor: pointer;
    box-shadow: 1px 4px 9px -1px rgba(0,0,0,0.05);
    transition: filter .2s, background-color .2s;
    position: relative;
    overflow: hidden;
}

div.modpack-small:after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    transition: background-color .2s;
}

div.modpack-small:hover:after {
    background-color: rgba(255, 255, 255, 0.205);
}
</style>