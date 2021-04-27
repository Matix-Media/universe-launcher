<template>
    <div class="news-small">
        <p class="date">{{cDate}}</p>
        <div class="modpack-info" v-on:click="followModpack">
            <div :style="cIcon" alt="" class="icon"></div>
            <p>{{modpack}}</p>
        </div>
        <h5>{{title}}</h5>
        <p class="content">{{content}}</p>
    </div>
</template>

<script>
export default {
    name: "NewsSmall",
    props: ["icon", "modpack", "title", "content", "date", "target", "modpackTarget", "newsId"],
    computed: {
        cIcon() {
            return "background-image: url('" + this.icon + + "');";
        },
        cDate() {
            return this.$luxon(this.date, "relative");
        }
    },
    methods: {
        followModpack() {
            this.$router.push(this.modpackTarget);
        }
    }
}
</script>

<style scoped>
div.news-small {
    width: 250px;
    cursor: pointer;
}

div.news-small:hover h5 {
    color: rgba(255, 255, 255, 0.8);
}

div.news-small:hover p.content {
    background-color: rgba(255, 255, 255, 0.2);
}

p.date {
    font-size: .72rem;
    color: rgba(255, 255, 255, 0.35);
    margin-bottom: .4rem;
    cursor: pointer;
}

div.modpack-info {
    display: inline-flex;
    align-items: center;
    background-color: rgba(38, 50, 56, 0.19);
    width: auto;
    border-radius: 4px;
    margin-bottom: .4rem;
    cursor: pointer;
    transition: background-color .2s;
}

div.modpack-info:hover {
    background-color: rgba(236, 239, 241, 0.19);
}

div.modpack-info div.icon {
    width: 23px;
    height: 23px;
    background-size: cover;
    background-position: center;
    border-radius: 4px;
    background-color: rgba(55, 71, 79, 0.25);
    margin-right: .2rem;
}

div.modpack-info p {
    font-weight: 300;
    color: rgba(255, 255, 255, 0.4);
    margin-right: .4rem;
    cursor: pointer;
    font-size: .8rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

h5 {
    font-size: .97rem;
    font-weight: 300;
    margin-bottom: .3rem;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: color .2s;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

p.content {
    background-color: rgba(255, 255, 255, 0.14);
    padding: .3rem;
    border-radius: 2px;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.75);
    cursor: pointer;
    transition: background-color .2s;
    font-size: .8rem;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 97px;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
}

</style>