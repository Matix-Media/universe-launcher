<template>
    <div class="modpack" :class="{isLoading: isLoading}">
        <div class="skeleton-loader" v-if="isLoading">
            <div class="sk-bg sk-banner">
                <div class="sk sk-logo"></div>
                <div class="sk-info">
                    <div>
                        <div class="sk sk-button"></div>
                        <div class="sk-text">
                            <div class="sk sk-name"></div>
                            <div class="sk sk-author"></div>
                        </div>
                    </div>
                    <div>
                        <div class="sk sk-box"></div>
                        <div class="sk sk-box"></div>
                    </div>
                </div>
            </div>

            <div class="sk-content">
                <div class="sk-bg sk-description">
                    <div class="sk sk-title"></div>
                    <div class="sk-text">
                        <div class="sk sk-line sk-line-1"></div>
                        <div class="sk sk-line sk-line-2"></div>
                        <div class="sk sk-line sk-line-3"></div>
                    </div>
                </div>
                <div class="sk-sidebar">
                    <div class="sk-bg sk-stats">
                        <div class="sk sk-title"></div>
                        <div class="sk-boxes">
                            <div class="sk sk-box"></div>
                            <div class="sk sk-box"></div>
                        </div>
                        <div class="sk-boxes">
                            <div class="sk sk-box"></div>
                            <div class="sk sk-box"></div>
                        </div>
                    </div>
                    <div class="sk-bg sk-news">
                        <div class="sk sk-title"></div>
                        <div class="sk-text">
                            <div class="sk sk-line sk-line-1"></div>
                            <div class="sk sk-line sk-line-2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="loaded-page-content" v-if="!isLoading">
            <div class="banner" :style="{ backgroundImage: 'url(\'' + modpack.banner + '\')' }">
                <div class="logo-wrapper">
                    <img class="logo" :src="modpack.logo" alt="">
                </div>
                <div class="info-bar" :style="{backgroundColor: backgroundColor}">
                    <div>
                        <button class="action">
                            <i v-if="!isInstalled" class="fas fa-arrow-alt-circle-down"></i>
                            <i v-if="isInstalled" class="fas fa-play"></i>
                            {{ isInstalled ? "Play" : "Install" }}
                            </button>
                        <div class="info">
                            <p class="name">{{ modpack.name }}</p>
                            <p class="author">by <span>{{ modpack.author.name }}</span></p>
                        </div>
                    </div>
                    <div class="big-stats">
                        <div v-if="!$api.offlineMode">
                            <i class="fas fa-cloud-download-alt"></i>
                            {{nFormatter(modpack.downloads)}}
                        </div>
                        <div>
                            <i class="fas fa-gamepad"></i>
                            {{modpack.game_version}}
                        </div>
                    </div>
                </div>
            </div>

            <div class="nav">
                <div>
                    <router-link :to="{ name: 'modpack-overview', params: { id: this.$route.params.id }}">
                        <i class="fas fa-bars"></i>
                        Overview
                    </router-link>
                    <router-link :to="{ name: 'modpack-news', params: { id: this.$route.params.id }}">
                        <i class="far fa-newspaper"></i>
                        News
                    </router-link>
                    <router-link :to="{ name: 'modpack-mods', params: { id: this.$route.params.id }}">
                        <i class="fas fa-cubes"></i>
                        Mods
                    </router-link>
                    <router-link :to="{ name: 'modpack-comments', params: { id: this.$route.params.id }}">
                        <i class="far fa-comments"></i>
                        Comments
                    </router-link>
                </div>
                <a class="more">
                    <i class="fas fa-ellipsis-h"></i>
                </a>
            </div>

            <div class="content">
                <router-view class="sub-page"></router-view>
                <div class="sub-sidebar">
                    <full-list title="Stats" class="stats"></full-list>
                    <full-list title="Latest news" class="latest-news" v-if="!$api.offlineMode"></full-list>
                </div>
            </div>
        </div>
        <modal v-if="isError" title="Error" width="20rem" :buttons="[{text: 'Back', emit: 'back'}, {text: 'Home', emit: 'home'}]" v-on:back="$router.go(-1)" v-on:home="$router.push({name: 'home'})">
            <p class="error-dialog">{{errorMessage}}</p>
        </modal>
    </div>
</template>

<script>
import FullList from "../components/FullList.vue";
import Modal from "../components/Modal.vue";

export default {
    name: "Modpack",
    components: {
        FullList,
        Modal,
    },
    data() {
        return {
            isLoading: true,
            modpack: {},
            isInstalled: false,
            isInstalling: false,
            isRunning: false,
            isStarting: false,
            errorMessage: `This modpack does not exist.`,
            isError: false
        }
    },
    computed: {
        backgroundColor: function() {
            return this.modpack.banner_style == "dark" ? 'none' : 'rgba(40, 45, 48, 0.2)';
        }
    },
    methods: {
        nFormatter(num, digits) {
            var si = [
                { value: 1, symbol: "" },
                { value: 1E3, symbol: "K" },
                { value: 1E6, symbol: "M" },
                { value: 1E9, symbol: "G" },
                { value: 1E12, symbol: "T" },
                { value: 1E15, symbol: "P" },
                { value: 1E18, symbol: "E" }
            ];
            var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
            var i;
            for (i = si.length - 1; i > 0; i--) {
                if (num >= si[i].value) {
                    break;
                }
            }
            return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$api.getModpack(this.$route.params.id).then((res) => {
                this.modpack = res;
                this.isInstalled = this.$api.inLibrary(this.$route.params.id);
                this.isLoading = false;
            }).catch((found, err) => {
                if (!found) {
                    this.isError = true;
                    console.log("Modpack with ID", this.$route.params.id, "was not found.");
                } else {
                    this.errorMessage = "Unknown error occurred while loading modpack with the ID " + this.$route.params.id + ".";
                    this.isError = true;
                    console.error("Error loading modpack with ID", this.$route.params.id, err);
                }
            })
        });
    }
}
</script>

<style scoped>
/* LOADED CONTENT */

p.error-dialog {
    font-weight: 300;
    font-size: .8rem;
}

.banner {
    height: 22rem;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.10);
    position: relative;
    z-index: 1;
    
    backdrop-filter: blur(15px);
    background-color: rgba(40, 45, 48, 0.9);
}

.banner .logo-wrapper {
    height: 19rem;
    display: flex;
    align-items: center;
}

.banner .logo {
    max-height: 12rem;
    max-width: 28rem;
}

.banner .info-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 1rem 1rem 1rem;
    box-sizing: border-box;
    width: calc(100% - 2rem);
    backdrop-filter: blur(30px);
    padding: .2rem .5rem;
    border-radius: 8px;
}

.banner .info-bar > div {
    display: flex;
}

.banner .info-bar .action {
    border: none;
    border-radius: 4px;
    margin: .2rem 0;
    width: 8rem;
    color: white;
    background-color: rgba(53, 66, 75, .9);
    box-shadow: 1px 4px 15px -1px rgba(0,0,0, .3);
    cursor: pointer;
    font-family: 'Roboto';
    text-transform: uppercase;
    font-size: .8rem;
    font-weight: 300;
    transition: background-color .2s;
    position: relative;
}

.banner .info-bar .action:hover {
    background-color: rgba(53, 66, 75, 0.6);
}

.banner .info-bar .action i {
    color: transparent;
    position: absolute;
    left: .5rem;
    top: 50%;
    transform: translateY(-50%);

    transition: color .2s, margin .2s, left .2s;
}

.banner .info-bar .action:hover i {
    color: rgba(255, 255, 255, 0.7);
    margin-right: .3rem;
    left: 1rem;
}

.banner .info-bar .info {
    color: rgba(255, 255, 255, 0.75);
    margin-left: .7rem;
}

.banner .info-bar .info .name {
    font-size: 1.2rem;
}

.banner .info-bar .info .author {
    font-size: .9rem;
    font-weight: 300;
    margin-top: -.4rem;
}

.banner .info-bar .big-stats {
    color: rgba(255, 255, 255, 0.75);
    font-size: 1.2rem;
}

.banner .info-bar .big-stats > div {
    margin-left: 2rem;
}

.nav {
    z-index: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: .9rem;
    font-weight: 300;
    backdrop-filter: blur(15px);
    background-color: rgba(45, 61, 68, 0.6);
}

.nav > div {
    display: flex;
    align-items: center;
}

.nav a {
    padding: 1.2rem;
    transition: background .2s, color .15s, text-shadow .15s;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
}

.nav a.router-link-exact-active,
.nav a:not(.more):hover {
    color: white;
    text-shadow: 0px 0px 28px rgba(255,255,255,0.2);
}

.nav a.more:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

.content {
    margin: 0 1rem;
    margin-top: 1.5rem;
    margin-bottom: 5rem;
    display: flex;
    width: clac(100% - 2rem);
}

.content .sub-page {
    width: 100%;
    margin-right: 5rem;
}

.content .sub-sidebar {
    width: 30rem;
}

.content .sub-sidebar > div {
    margin-bottom: 1.5rem;
}
/*.nav > a:hover {
    background-color: rgba(255, 255, 255, 0.15);
}*/


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

div.skeleton-loader .sk-banner {
    height: 22rem;
    width: 100%;
    border-radius: 0;

    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
}

div.skeleton-loader .sk-banner .sk-logo {
    height: 10rem;
    width: 10rem;
    border-radius: 100%;
    margin-top: 4rem;
}

div.skeleton-loader .sk-banner .sk-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 1rem 1rem 1rem;
    box-sizing: border-box;
    width: calc(100% - 2rem);
}

div.skeleton-loader .sk-banner .sk-info > div {
    display: flex;
}

div.skeleton-loader .sk-banner .sk-info .sk-button {
    width: 7rem;
    height: 2rem;
}

div.skeleton-loader .sk-banner .sk-info .sk-text {
    margin-left: .7rem;
}

div.skeleton-loader .sk-banner .sk-info .sk-name {
    width: 10rem;
    height: 1rem;
}
div.skeleton-loader .sk-banner .sk-info .sk-author {
    width: 4rem;
    height: .7rem;
    margin-top: .2rem;
}

div.skeleton-loader .sk-banner .sk-info .sk-box {
    width: 5rem;
    height: 1.8rem;
    margin-left: 2rem;
}

div.skeleton-loader .sk-content {
    margin: 0 1rem;
    margin-top: 5rem;
    display: flex;
    width: clac(100% - 2rem);
}

div.skeleton-loader .sk-content .sk-description {
    margin-right: 5rem;
    height: 15rem;
    width: 100%;
    padding: .5rem;
}

div.skeleton-loader .sk-content .sk-description .sk-title {
    height: 1.5rem;
    width: 10rem;
}

div.skeleton-loader .sk-content .sk-description .sk-text {
    margin-top: 1rem;
}

div.skeleton-loader .sk-content .sk-description .sk-text .sk-line {
    width: 20rem;
    height: 1rem;
    margin: .5rem 0;
}

div.skeleton-loader .sk-content .sk-description .sk-text .sk-line.sk-line-1 {
    width: 28rem;
}
div.skeleton-loader .sk-content .sk-description .sk-text .sk-line.sk-line-2 {
    width: 18rem;
}
div.skeleton-loader .sk-content .sk-description .sk-text .sk-line.sk-line-3 {
    width: 22rem;
}

div.skeleton-loader .sk-content .sk-sidebar {
    width: 30rem;
}

div.skeleton-loader .sk-content .sk-sidebar .sk-stats {
    padding: .5rem;
    margin-bottom: 1.5rem;
}

div.skeleton-loader .sk-content .sk-sidebar .sk-stats .sk-title {
    height: 1.5rem;
    width: 7rem;
}

div.skeleton-loader .sk-content .sk-sidebar .sk-stats .sk-boxes {
    display: flex;
    margin: -.5rem;
    margin-top: 1rem;
    margin-bottom: 0;
}

div.skeleton-loader .sk-content .sk-sidebar .sk-stats .sk-boxes .sk-box {
    height: 2rem;
    width: 100%;
    margin: 0 .5rem;
}

div.skeleton-loader .sk-content .sk-sidebar .sk-news {
    padding: .5rem;
}

div.skeleton-loader .sk-content .sk-sidebar .sk-news .sk-title {
    height: 1.5rem;
    width: 10rem;
}

div.skeleton-loader .sk-content .sk-sidebar .sk-news .sk-text {
    margin-top: 1rem;
    margin-bottom: -.5rem;
}

div.skeleton-loader .sk-content .sk-sidebar .sk-news .sk-text .sk-line {
    width: 6rem;
    height: 1rem;
    margin: .5rem 0;
}

div.skeleton-loader .sk-content .sk-sidebar .sk-news .sk-text .sk-line.sk-line-2 {
    width: 8rem;
}

</style>