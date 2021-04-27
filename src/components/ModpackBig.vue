<template>
    <div class="modpack-big" @click="followModpack">
        <div class="image-wrapper">
            <div class="image" :style="cImage">

            </div>
        </div>
        <div class="details">
            <p class="name">
                {{name}}
            </p>
            <div class="row row-space infos">
                <p>by {{author}}</p>
                <div class="row">
                    <i class="fas fa-gamepad"></i>
                    <p>{{gameVersion}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ModpackBig",
    props: ["image", "target", "name", "author", "gameVersion"],
    computed: {
        cImage() {
            return "background-image: url('" + this.image + "');";
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
.modpack-big {
    width: 13rem;
    min-width: 13rem;
    backdrop-filter: blur(15px);
    box-shadow: 1px 4px 9px -1px rgba(0,0,0,0.05);
    background-color: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    perspective: 1000px;
    transition: background-color .2s;
    z-index: 0;
}

.modpack-big:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% + 3rem);
    background: linear-gradient(203deg, rgba(255,255,255,1) 35%, rgba(255,255,255,0.2) 40%);
    opacity: .01;
    margin-top: -3rem;
    transition: margin .2s, opacity .2s;
    transition-timing-function: ease;
}

.modpack-big:hover:after {
    margin-top: 0;
    opacity: .1;
}

.modpack-big:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

p { 
    cursor: pointer;
}


div.image-wrapper {
    width: 100%;
    height: 17rem;
    
    border-radius: 8px 8px 3px 3px;
    position: relative;
    overflow: hidden;
}

div.image {
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center;
    transition: transform .2s;
}

.modpack-big:hover div.image {
    transform: scale(1.03);
}

div.details {
    color: rgba(255, 255, 255, 0.8);
    padding: .5rem;
}

p.name {
    font-size: 1rem;
    margin-bottom: .2rem;
}

div.infos {
    font-weight: 200;
    font-size: .9rem;
}

div.infos i {
    margin-right: .5rem;
}

div.row {
    display: flex;
    align-items: center;
}

div.row-space {
    justify-content: space-between;
}
</style>