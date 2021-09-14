<template>
    <div class="settings" v-if="isLoaded">
        <full-list title="Appearance">
            <checkbox
                label="Minimize to system tray after starting the game"
                v-model="settings.appearance.minimizeOnMcStartup"
                v-on:input="saveSettings()"
            />
            <checkbox
                label="Close UNIVERSE Launcher when exiting Minecraft"
                v-model="settings.appearance.closeOnMcExit"
                v-on:input="saveSettings()"
            />
        </full-list>
        <full-list title="Network">
            <checkbox
                label="Throttle Downloads"
                v-model="settings.connectivity.throttleDownloads.enabled"
                v-on:input="saveSettings()"
            />
            <div class="sub-settings" v-if="settings.connectivity.throttleDownloads.enabled">
                <input
                    class="text-box"
                    type="number"
                    min="0"
                    v-model="settings.connectivity.throttleDownloads.throttle"
                />
                <p class="text right">KB/s</p>
            </div>
            <checkbox
                label="Use proxy"
                v-model="settings.connectivity.proxy.enabled"
                v-on:input="saveSettings()"
            />
            <div class="sub-settings" v-if="settings.connectivity.proxy.enabled">
                <p class="text left">
                    Adress:
                </p>
                <input
                    type="text"
                    class="text-box"
                    v-model="settings.connectivity.proxy.host"
                    v-on:input="saveSettings()"
                />
                <p class="text left right">
                    Port:
                </p>
                <input
                    type="number"
                    class="text-box"
                    min="0"
                    style="width:3rem"
                    v-model="settings.connectivity.proxy.port"
                    v-on:input="saveSettings()"
                />
            </div>
        </full-list>

        <full-list title="Desktop-Notifications">
            <checkbox
                label="Display notifications when modpack is ready"
                v-model="settings.notifications.modpackReady"
                v-on:input="saveSettings()"
            />
            <checkbox
                label="Display notifications about news"
                v-model="settings.notifications.news"
                v-on:input="saveSettings()"
            />
        </full-list>

        <full-list title="Others" class="others">
            <a href="mailto:support@matix-media.net">Support</a>
            <a @click="openLog()">Show logs</a>
            <a @click="reloadWindow()">Reload window</a>
            <a @click="clearCache()" v-if="!cacheCleared">Clear cache</a>
        </full-list>
    </div>
</template>

<script>
import FullList from "../components/FullList.vue";
import Checkbox from "../components/controls/Checkbox.vue";
import _ from "lodash";
import { exec } from "child_process";
const { ipcRenderer } = require("electron");

export default {
    name: "Settings",
    components: { FullList, Checkbox },
    data() {
        return {
            isLoaded: false,
            cacheCleared: false,
            settings: {},
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.settings = this.$api.settings;
            this.isLoaded = true;
        });
    },
    methods: {
        saveSettings: _.debounce(function() {
            this.$api.settings = this.settings;
            this.$api.saveConfig();
        }, 1000),
        getCommandLine() {
            switch (process.platform) {
                case "darwin":
                    return "open";
                case "win32":
                    return "start";
                case "win64":
                    return "start";
                default:
                    return "xdg-open";
            }
        },
        openLog() {
            ipcRenderer.send("log_path");
            ipcRenderer.on("log_path", (e, args) => {
                exec(this.getCommandLine() + " " + args.logPath);
            });
        },
        clearCache() {
            if (!this.cacheCleared) {
                this.cacheCleared = true;
                this.$api.clearCache();
                ipcRenderer.send("clear_cache");
            }
        },
        reloadWindow() {
            location.reload();
        },
    },
};
</script>

<style scoped>
div.settings {
    padding: 2rem;
}

.sub-settings {
    margin-left: 0.7rem;
    margin-bottom: 1rem;
    padding: 0.5rem 0.8rem;
    border-left: 1px solid rgba(255, 255, 255, 0.37);
}

.sub-settings .text {
    font-size: 1.2em;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.6);
    display: inline-block;
}

.sub-settings .text.right {
    margin-left: 0.7rem;
}
.sub-settings .text.left {
    margin-right: 0.7rem;
}

.text-box {
    background-color: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 3px;
    color: white;
    padding: 0.3rem;
    font-family: "Roboto";
    font-size: 1.2em;
    transition: background-color 0.2s;
    -webkit-appearance: none;
    font-weight: 300;
}
.text-box::-webkit-outer-spin-button,
.text-box::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.text-box:focus {
    background-color: rgba(255, 255, 255, 0.3);
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
    padding: 0.8rem;
}

.others .content a {
    display: block;
    color: rgba(255, 255, 255, 0.75);
    text-decoration: none;
    font-size: 14px;
    font-weight: 300;
    margin: 0px 1rem;
    padding: 0.25rem 0;
    transition: color 0.2s;
}

.others .content a:hover {
    color: white;
}
</style>
