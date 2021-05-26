<template>
    <div>
        <div class="skeleton-loader" v-if="!loaded">
            <div class="sk sk-header"></div>
            <div class="sk-bg sk-box">
                <div class="sk sk-header"></div>
                <div class="sk-lines">
                    <div class="sk sk-line line-1"></div>
                    <div class="sk sk-line line-2"></div>
                    <div class="sk sk-line line-3"></div>
                </div>
            </div>
        </div>

        <header-list title="News" v-if="loaded">
            <p class="error" v-if="error">
                The news could not be loaded.
            </p>
            <p class="empty" v-if="news.length == 0">
                There are currently no news available.
            </p>
            <div class="news-box" v-for="item in news" :key="item.ID" @click="$root.showNews(item.ID)">
                <div class="header">
                    <h4>{{item.title}}</h4>
                    <p class="date">{{$luxon(item.created, "relative")}}</p>
                </div>
                <p class="content">{{item.shortened}}</p>
            </div>
    </header-list>
    </div>
</template>

<script>
import HeaderList from "../../components/HeaderList.vue";

export default {
    name: "Overview",
    components: {
        HeaderList
    },
    data() {
        return {
            loaded: false,
            error: false,
            news: {}
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.$api.getNews(this.$route.params.id).then((res) => {
                this.news = res;
                this.loaded = true;
            }).catch(() => {
                this.error = true;
                this.loaded = true;
            })
        });
    }
}
</script>

<style scoped>

div.news-box {
    backdrop-filter: blur(30px);
    background-color: rgba(255, 255, 255, 0.02);
    padding: .5rem;
    width: 100%;
    margin-bottom: 1rem;
    overflow: hidden;
    transition: background .2s, box-shadow .2s;
    cursor: pointer;
}

div.news-box:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

div.news-box * {
    cursor: pointer;
}

div.news-box h4 {
    text-transform: none;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.60);
}

div.news-box h4::after {
    display: none;
}

div.news-box div.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

div.news-box p.date {
    color: rgba(255, 255, 255, 0.20);
}

div.news-box .content {
    color: rgba(255, 255, 255, 0.75);
    font-weight: 300;
    margin-top: .5rem;
    font-size: .85rem;
}

p.error, p.empty {
    font-size: 1rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.85);
}


/* SKELETON LOADER */

div.skeleton-loader .sk {
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.10);
}

div.skeleton-loader .sk-bg {
    background-color: rgba(47, 54, 61, 0.80);
    backdrop-filter: blur(15px);
    border-radius: 8px;
    overflow: hidden;
}

div.skeleton-loader .sk-bg::after {
    content: "";
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(90deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0) 60%);
    background-position: -150% 0;
    background-size: 90% 100%;
    background-repeat: no-repeat;
    animation: moving 2s infinite;
}

@keyframes moving {
    from {
        background-position: -650% 0;
    }
    to {
        background-position: 650% 0;
    }
}

div.skeleton-loader > div.sk-header {
    height: 1.5rem;
    width: 5rem;
    margin-bottom: 1.5rem;
}

div.skeleton-loader > div.sk-box {
    padding: .5rem;
    margin-bottom: 1rem;
}

div.skeleton-loader > div.sk-box div.sk-header {
    height: 1.2rem;
    width: 12rem;
}

div.skeleton-loader > div.sk-box div.sk-lines {
    margin-top: .5rem;
}

div.skeleton-loader > div.sk-box div.sk-line {
    height: 1rem;
    width: 20rem;
    margin-top: .3rem;
}

div.skeleton-loader > div.sk-box div.sk-line.line-1 {
    width: 17rem;
}


div.skeleton-loader > div.sk-box div.sk-line.line-3 {
    width: 15rem;
}

</style>