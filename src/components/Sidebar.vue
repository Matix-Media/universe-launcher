<template>
    <div class="sidebar">
        <div class="main-icons">
            <router-link to="/home" content="Home">
                <i class="fas fa-home"></i>
            </router-link>
            <router-link to="/library" content="Library">
                <i class="fas fa-th-large"></i>
            </router-link>
            <router-link to="/discover" content="Discover" :class="{unavailable: $api.offlineMode}">
                <i class="fas fa-compass"></i>
            </router-link>
            <router-link to="/play" content="Play">
                <i class="fas fa-play"></i>
            </router-link>
            <router-link to="/creator" content="Creator">
                <i class="fas fa-puzzle-piece"></i>
            </router-link>
        </div>
        <div class="settings-icon">
            <router-link to="/settings" content="Settings">
                <i class="fas fa-cog"></i>
            </router-link>
        </div>
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
        box-shadow: 1px 4px 9px -1px rgba(0,0,0,0.2);
        width: 40px;
        display: flex;
        flex-direction: column;
        font-size: 25px;
        align-items: center;
        z-index: 1;
        padding: 1rem;
    }


    a {
        color: rgba(255, 255, 255, 0.6);
        padding: 35px 1rem;
        transition: color .2s, text-shadow .2s;
        width: 100%;
        text-align: center;
        box-sizing: border-box;
    }

    a:hover:not(.unavailable), 
    a:focus:not(.unavailable), 
    a.router-link-active:not(.unavailable) {
        color: white;
        text-shadow: 0px 0px 28px rgba(255,255,255,0.2);
    }

    a.unavailable {
        color: rgba(255, 255, 255, 0.1) !important;
        cursor: default;
        pointer-events: none;
    }

    .main-icons,
    .settings-icon {
        display: flex;
        flex-direction: column;
    }
    .main-icons {
        flex: 1;
    }

    .settings-icon {
        margin-bottom: 2rem;
    }
</style>