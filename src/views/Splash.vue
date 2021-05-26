<template>
    <div class="splash" :class="{ done: isDone }">
        <div class="box">
            <div class="logo">
                <img src="@/assets/images/branding/icon.svg" class="icon" style="width:5rem;" alt="">
                <img src="@/assets/images/branding/logo_text.png" style="width:18.106rem;" alt="">
            </div>

            <div class="text">
                <p>{{loadingText}}</p>
                <p class="version">v{{version}}</p>
            </div>

            <span :style="{ width: progress + '%' }"></span>
        </div>
        <modal v-if="errorText != ''" title="Error" width="20rem" :buttons="[{text: 'OK', 'emit': 'clicked'}]" v-on:clicked="buttonClick.set(true)">
            {{errorText}}
        </modal>
    </div>
</template>

<script>
import Modal from "../components/Modal.vue";
import { ipcRenderer } from "electron";
import ReactiveVar from "../classes/ReactiveVar";

export default {
    name: "Splash",
    components: {Modal},
    data() {
        return {
            loadingText: "Preparing rockets...",
            progress: 0,
            version: "...",
            isDone: false,
            errorText: "",
            buttonClick: null
        }
    },
    methods: {
        humanFileSize(bytes, si=false, dp=1) {
            const thresh = si ? 1000 : 1024;

            if (Math.abs(bytes) < thresh) {
                return bytes + ' B';
            }

            const units = si 
                ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
                : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
            let u = -1;
            const r = 10**dp;

            do {
                bytes /= thresh;
                ++u;
            } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


            return bytes.toFixed(dp) + ' ' + units[u];
        },
        timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    },
    async mounted() {
        this.$nextTick(() => {
            ipcRenderer.send("app_version")
            ipcRenderer.on("app_version", (event, args) => {
                const installedVersion = args.version
                this.version = installedVersion

                setTimeout(async () => {
                    // Checking API status
                    this.loadingText = "Phoneing home..."
                    this.progress = 10
                    try {
                        var res = await this.$api.checkConnection();
                        console.log("Successfully connected to API. Status: " + res.status);
                        if (this.$api.versionCompare(installedVersion, res.requiredClientVersion) >= 0) {
                            console.log(`Installed version OK. No update required (Client: ${installedVersion}, Required: ${res.requiredClientVersion}).`)
                        } else {
                            console.warn(`Client outdated! This can cause problems when using the API (Client: ${installedVersion}, Required: ${res.requiredClientVersion}).`)
                        }
                    } catch (err) {
                        console.warn("Can not reach API. Locale storage-use only!");
                        this.loadingText = "Can't reach API! You can only play installed modpacks.";
                        await this.timeout(1000);
                    }

                    // Checking for updates
                    this.loadingText = "Checking for updates..."
                    this.progress = 23

                    ipcRenderer.send("check_updates");
                    ipcRenderer.on("update_info", async (event, args) => {
                        if (args.updateAvailable) {
                            console.log("Update available!");
                            this.loadingText = "Downloading updates..."
                            ipcRenderer.on("update_download_progress", (event, args) => {
                                this.progress = args.percent;
                                this.loadingText = "Downloading updates... (" + this.humanFileSize(args.bytesPerSecond, true) + "/s)"
                            })
                            ipcRenderer.on("update_downloaded", () => {
                                this.loadingText = "Update downloaded. Restarting..."
                                setTimeout(() => {
                                    ipcRenderer.send("restart_app")
                                }, 1000);
                            })
                        } else {
                            console.log("No update available (" + installedVersion + ")");

                            // Reading configs
                            this.loadingText = "Loading library..."
                            this.progress = 40
                            try {
                                await this.$api.loadLibrary();
                                console.log("Library loaded");
                            } catch (err) {
                                console.error("Error loading library", err);
                                await new Promise((resolve) => {
                                    this.buttonClick = new ReactiveVar(false, () => {
                                        this.errorText = "";
                                        resolve();
                                    });
                                    this.errorText = "Error loading library: " + err;
                                });
                            }

                            this.loadingText = "Loading sessions..."
                            this.progress = 44
                            await this.$api.loadSessions()
                            console.log("Sessions loaded")

                            this.loadingText = "Loading config..."
                            this.progress = 48
                            try {
                                await this.$api.loadConfig();
                                console.log("Config loaded");
                            } catch(err) {
                                console.error("Error loading config", err);
                                await new Promise((resolve) => {
                                this.buttonClick = new ReactiveVar(false, () => {
                                    this.errorText = "";
                                    resolve();
                                });
                                this.errorText = "Error loading config: " + err;
                            });
                            }

                            // Checking saved accounts
                            this.loadingText = "Syncing profiles...";
                            this.progress = 75;
                            try {
                                await this.$api.loadProfiles();
                                console.log("Profiles loaded");
                            } catch (err) {
                                console.error("Error loading profiles", err);
                                await new Promise((resolve) => {
                                    this.buttonClick = new ReactiveVar(false, () => {
                                        this.errorText = "";
                                        resolve();
                                    });
                                    this.errorText = "Error loading profiles: " + err;
                                });
                            }

                            // Ready!
                            this.loadingText = "Ready to discover new universe!";
                            this.progress = 100;
                            
                            this.isDone = true;
                            setTimeout(() => {
                                this.$emit("loaded")
                            }, 1000)

                            setTimeout(() => {
                                this.$emit("done")
                            }, 2000)
                        }
                    })
                }, 1000)
            })
        })
    }
}
</script>

<style scoped>
div.splash {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 99999999;

    background-color: #263238;
}

div.box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;

    background-color: rgba(255, 255, 255, 0.05);
    box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.03);
    border-radius: 4px;
}

div.logo {
    margin: 1rem 1rem 1.5rem 1rem;

    animation-name: breathing;
    animation-duration: 2s;
    animation-iteration-count: infinite;
}

div.logo .icon {
    margin-right: 1rem;

    animation-name: spinning;
    animation-duration: 3s;
    animation-iteration-count: infinite;
}

.logo img {
    height: 5rem;
}

div.box .text {
    display: flex;
    justify-content: space-between;
}

div.box .text p {
    font-size: 1.1em;

    margin: 0 .4rem;
    margin-bottom: .3rem;
    transform: translateZ(0) translate3d(0,0,0);
    
    color: rgba(255, 255, 255, 0.40);
}

div.box .text p.version {
    color: rgba(255, 255, 255, 0.1);
}

div.box span {
    display: block;
    transition: width .2s;

    height: .3rem;

    background-color: rgba(98, 113, 126, 0.6);
}

div.splash.done {
    animation-name: fadeout;
    animation-duration: 1s;
    animation-delay: 1s;
    animation-fill-mode: forwards;
}

@keyframes breathing {
    0% {
        opacity: 1;
    }

    50% {
        opacity: .8;
    }

    100% {
        opacity: 1;
    }
}

@keyframes spinning {
    0% {
        transform: rotate(0deg);
    }
    20% {
        transform: rotate(360deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes fadeout {
    0% {
        opacity: 1;
        visibility: visible;
    }

    99% {
        opacity: 0;
        visibility: collapse;
    }
    100% {
        opacity: 0;
        visibility: collapse;
    }
}
</style>