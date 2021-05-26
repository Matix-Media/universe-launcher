<template>
    <div class="news-small" @click="openPopup()">
        <p class="date">{{cDate}}</p>
        <div class="modpack-badge" v-on:click="followModpack">
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
        },
        openPopup() {
            this.$root.showNews(this.newsId);
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

div.modpack-badge {
    margin-bottom: .4rem;
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
    border-radius: 3px;
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