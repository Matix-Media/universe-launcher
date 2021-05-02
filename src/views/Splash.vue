<template>
    <div class="splash" :class="{ done: isDone }">
        <div class="box">
            <div class="logo">
                <img src="@/assets/images/branding/icon.svg" class="icon" alt="">
                <img src="@/assets/images/branding/logo_text.png" alt="">
            </div>

            <p>{{loadingText}}</p>

            <span :style="{ width: progress + '%' }"></span>
        </div>
    </div>
</template>

<script>
//import ipcRenderer from "electron"
const { ipcRenderer } = require("electron")

export default {
    name: "Splash",
    data() {
        return {
            loadingText: "Preparing rockets...",
            progress: 0,
            isDone: false
        }
    },
    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {

                // Checking for updates
                this.loadingText = "Checking for updates..."
                this.progress = 5
                ipcRenderer.send("app_version")
                ipcRenderer.on("app_version", (event, args) => {
                    const installedVersion = args.version
                    console.log("Installed version: " + installedVersion)
                    ipcRenderer.send("check_updates");
                    ipcRenderer.on("update_info", (event, args) => {
                        if (args.updateAvailable) {
                            console.log("Update available!");
                            this.loadingText = "Downloading updates..."
                            ipcRenderer.on("update_downloaded", () => {
                                this.loadingText = "Update downloaded. Restarting..."
                                setTimeout(() => {
                                    ipcRenderer.send("restart_app")
                                }, 1000);
                            })
                        } else {
                            console.log("No update available");

                            // Reading configs
                            this.loadingText = "Loading library..."
                            this.progress = 40

                            this.loadingText = "Loading sessions..."
                            this.progress = 46

                            this.loadingText = "Loading config..."
                            this.progress = 48

                            // Checking saved accounts
                            this.loadingText = "Syncing profiles..."
                            this.progress = 50

                            // Ready!
                            this.loadingText = "Ready to discover new universe!"
                            this.progress = 100
                            this.isDone = true

                            setTimeout(() => {
                                this.$emit("done")
                            }, 2000)
                        }
                    })
                })
            }, 1000)
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

div.box p {
    font-size: 1.1em;

    margin-left: .4rem;
    margin-bottom: .3rem;
    transform: translateZ(0) translate3d(0,0,0);
    
    color: rgba(255, 255, 255, 0.40);
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