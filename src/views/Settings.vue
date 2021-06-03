<template>
    <div class="settings">
        <full-list title="Settings">
            <checkbox label="Throttle Downloads" v-model="$api.settings.connectivity.throttleDownloads.enabled" />
            <checkbox label="Use proxy" v-model="$api.settings.connectivity.proxy.enabled" />
        </full-list>

        <full-list title="Desktop-Notifications">
            <checkbox label="Display notifications when modpack is ready" v-model="$api.settings.notifications.modpackReady" />
            <checkbox label="Display notifications about news" v-model="$api.settings.notifications.news" />
        </full-list>

        <full-list title="Others" class="others">
            <a href="mailto:support@matix-media.net">Support</a>
            <a @click="openLog()">Show logs</a>
            <a @click="clearCache()" v-if="!cacheCleared">Clear cache</a>
        </full-list>
    </div>
</template>

<script>
import FullList from '../components/FullList.vue'
import Checkbox from '../components/controls/Checkbox.vue'
import { exec } from "child_process";
const { ipcRenderer } = require("electron")

export default {
    name: "Settings",
    components: {FullList, Checkbox},
    data() {
        return {
            cacheCleared: false,
            settings: {}
        }
    },
    methods: {
        getCommandLine() {
            switch (process.platform) { 
                case 'darwin' : return 'open';
                case 'win32' : return 'start';
                case 'win64' : return 'start';
                default : return 'xdg-open';
            }
        },
        openLog() {
            ipcRenderer.send("log_path");
            ipcRenderer.on("log_path", (e, args) => {
                exec(this.getCommandLine() + " " + args.logPath)
            })
        },
        clearCache() {
            if (!this.cacheCleared) {
                this.cacheCleared = true;
                this.$api.clearCache();
                ipcRenderer.send("clear_cache");
            }
        }
    }
}
</script>

<style scoped>
div.settings {
    padding: 2rem;
}

.checkbox {
    margin-bottom: 1rem;
    opacity: 0.75;
}

.checkbox:last-child {
    margin-bottom: 0;
}

.full-list {
    margin-top: 1rem;
}

.full-list:first-of-type {
    margin-top: 0;
}

.full-list .content {
    padding: .8rem;
}

.others .content a {
    display: block;
    color: rgba(255, 255, 255, 0.75);
    text-decoration: none;
    font-size: 14px;
    font-weight: 300;
    margin: 0px 1rem;
    padding: .25rem 0;
    transition: color .2s;
}

.others .content a:hover {
    color: white;
}
</style>