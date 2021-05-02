<template>
    <div class="modpack">
        <div class="banner" :style="{ backgroundImage: 'url(\'https://imgur.com/43RMwht.png\')' }">
            <img class="logo" src="https://imgur.com/eiuJs3z.png" alt="">
            <div class="info-bar">
                <div>
                    <button class="action">Play</button>
                    <div class="info">
                        <p class="name">Survival Default Kit</p>
                        <p class="author">by <span>Matix</span></p>
                    </div>
                </div>
                <div class="big-stats">
                    <div>
                        <i class="fas fa-cloud-download-alt"></i>
                        2.2K
                    </div>
                    <div>
                        <i class="fas fa-gamepad"></i>
                        1.16.4
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
                <full-list title="Latest news" class="latest-news"></full-list>
            </div>
        </div>
    </div>
</template>

<script>
import FullList from "../components/FullList.vue";

export default {
    name: "Modpack",
    components: {
        FullList
    }
}
</script>

<style scoped>
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

.banner .logo {
    height: 12rem;
    margin-top: 4rem;
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
    padding: 0 3rem;
    margin: .2rem 0;
    color: white;
    background-color: rgba(53, 66, 75, .9);
    box-shadow: 1px 4px 15px -1px rgba(0,0,0, .3);
    cursor: pointer;
    font-family: 'Roboto';
    text-transform: uppercase;
    font-size: .8rem;
    font-weight: 300;
    transition: background-color .2s;
}

.banner .info-bar .action:hover {
    background-color: rgba(53, 66, 75, 0.6);
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
</style>