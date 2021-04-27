<template>
    <div class="sidebar">
        <router-link to="/home" content="Home">
            <i class="fas fa-home"></i>
        </router-link>
        <router-link to="/library" content="Library">
            <i class="fas fa-th-large"></i>
        </router-link>
        <router-link to="/discover" content="Discover">
            <i class="fas fa-compass"></i>
        </router-link>
        <router-link to="/play" content="Play">
            <i class="fas fa-play"></i>
        </router-link>
        <router-link to="/settings" content="Settings">
            <i class="fas fa-cog"></i>
        </router-link>
    </div>
</template>

<script>
export default {
    name: "Sidebar"
}
</script>

<style scoped>
    div.sidebar {
        color: white;
        background-color: rgba(37, 49, 55, 0.5);
        backdrop-filter: blur(15px);
        padding: 1rem;
        box-shadow: 1px 4px 9px -1px rgba(0,0,0,0.2);
        width: 40px;
        display: flex;
        flex-direction: column;
        font-size: 25px;
        align-items: center;
        z-index: 99999;
    }

    a {
        color: rgba(255, 255, 255, 0.6);
        padding: 35px 1rem;
        transition: color .2s, text-shadow .2s;
        width: 100%;
        text-align: center;
    }

    a:hover, a:focus, a.router-link-active {
        color: white;
        text-shadow: 0px 0px 28px rgba(255,255,255,0.2);
    }
</style>