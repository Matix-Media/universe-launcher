<template>
    <div class="creator-new">
        <div class="project-creator">
            <full-list class="options" title="Create new Project" :overflowHidden="false">
                <label class="option" :class="{ error: isEmpty(project.name) }">
                    <p class="name">Project name</p>
                    <input
                        type="text"
                        class="text-box"
                        v-model="project.name"
                        placeholder="<Enter a project name>"
                        @input="
                            updateLocation();
                            checkValidLocation();
                        "
                    />
                    <p class="description">
                        This name is not the name of the modpack.
                    </p>
                </label>
                <label class="option" :class="{ error: !isValidLocation }">
                    <p class="name">Location</p>
                    <div class="options-group">
                        <input
                            type="text"
                            class="text-box"
                            v-model="getLocation"
                            placeholder="<Select a location>"
                        />
                        <button
                            class="options-button"
                            :class="{ disabled: dialogOpen }"
                            @click="selectLocation()"
                        >
                            ...
                        </button>
                    </div>
                    <p class="description">
                        This is where your project is getting saved.
                    </p>
                </label>
                <label class="option" :class="{ error: isEmpty(project.modpackName) }">
                    <p class="name">Modpack name</p>
                    <input
                        type="text"
                        class="text-box"
                        v-model="project.modpackName"
                        placeholder="<Enter a modpack name>"
                    />
                    <p class="description">
                        This name can be changed later on.
                    </p>
                </label>
                <label class="option">
                    <p class="name">Minecraft version</p>
                    <dropdown
                        :options="availableVersion"
                        :default="latestVersion"
                        v-model="project.version"
                    />
                    <p class="description">The version can <b>NOT</b> be changed later on.</p>
                </label>
            </full-list>

            <div class="controls">
                <router-link class="control" :to="{ name: 'creator' }">
                    Back
                </router-link>
                <button
                    class="control"
                    :class="{ disabled: !canCreate }"
                    :disabled="!canCreate"
                    @click="createProject()"
                >
                    Create
                </button>
            </div>
        </div>
        <modal width="20rem" v-if="creatingProject">
            <div class="creating-project">
                <img
                    src="@/assets/images/branding/icon.svg"
                    class="icon"
                    style="width: 5rem"
                    alt=""
                />
                <p>Your project is beeing created...</p>
            </div>
        </modal>
    </div>
</template>

<script>
import Dropdown from "../../components/controls/Dropdown.vue";
import FullList from "../../components/FullList.vue";
import MCLauncherAPI from "../../classes/MCLauncherAPI";
import _ from "lodash";
import path from "path";
import fs from "fs";
import { ipcRenderer } from "electron";
import Modal from "../../components/Modal.vue";

export default {
    components: { FullList, Dropdown, Modal },
    name: "Creator-New",
    data() {
        return {
            loadingVersion: true,
            availableVersion: ["Loading..."],
            latestVersion: "Loading...",
            isValidLocation: true,
            lastName: "ModpackProject",
            dialogOpen: false,
            creatingProject: false,
            project: {
                name: "ModpackProject",
                modpackName: "Modpack",
                location: null,
                version: null,
            },
        };
    },
    mounted() {
        this.$nextTick(async () => {
            var i = 0;
            while (fs.existsSync(this.getLocation) && i < 100) {
                i++;
                let name = "ModpackProject" + i;
                this.project.name = name;
                this.latestVersion = name;
                this.project.modpackName = "Modpack" + i;
            }

            try {
                var res = await new MCLauncherAPI().getVersions();
                this.availableVersion = res.versions;
                this.latestVersion = res.latest;
                this.loadingVersion = false;
            } catch (err) {
                console.error("Error getting versions", err);
                this.availableVersion[0] = err.message;
                this.latestVersion = err.message;
            }
        });
    },
    computed: {
        canCreate() {
            if (
                _.isEmpty(this.project.name) ||
                !this.isValidLocation ||
                _.isEmpty(this.project.modpackName) ||
                !this.availableVersion.includes(this.project.version)
            ) {
                return false;
            }
            return true;
        },
        getLocation: {
            get() {
                if (this.project.location != null) return this.project.location;
                return path.join(this.$creator.getProjectsRoot(), this.project.name);
            },
            set(val) {
                this.project.location = val;
                this.checkValidLocation();
            },
        },
    },
    methods: {
        isEmpty: _.isEmpty,
        updateLocation() {
            if (this.project.location && path.basename(this.project.location) == this.lastName) {
                this.project.location = path.join(
                    path.dirname(this.project.location),
                    this.project.name
                );
            }
            this.lastName = this.project.name;
        },
        async checkValidLocation() {
            this.isValidLocation = await this.$creator.checkProjectLocation(this.getLocation);
        },
        selectLocation() {
            if (this.dialogOpen) return;

            this.dialogOpen = true;
            ipcRenderer.send("open-file-dialog", {
                title: "Select project location...",
                properties: ["openDirectory"],
            });
            ipcRenderer.once("open-file-dialog_result", (event, result) => {
                this.dialogOpen = false;
                if (result && !result.canceled) {
                    this.project.location = result.filePaths[0];
                    if (
                        this.project.name &&
                        path.basename(this.project.location) != this.project.name
                    ) {
                        this.project.location = path.join(this.project.location, this.project.name);
                    }
                    this.checkValidLocation();
                }
            });
        },

        async createProject() {
            if (!this.canCreate) return;

            this.creatingProject = true;

            try {
                await this.$creator.createProject(
                    this.getLocation,
                    this.project.name,
                    this.project.modpackName,
                    this.project.version
                );
                await new Promise((resolve) => setTimeout(resolve(), 1000));
            } catch (err) {
                console.error("Error creating modpack:", err);
            }
        },
    },
};
</script>

<style scoped>
div.creator-new {
    display: flex;
    justify-content: center;
}

div.creating-project {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    animation-name: breathing;
    animation-duration: 2s;
    animation-iteration-count: infinite;
}

div.creating-project img {
    margin: 0.5rem 0;
    opacity: 0.65;

    animation-name: spinning;
    animation-duration: 3s;
    animation-iteration-count: infinite;
}

div.creating-project p {
    font-size: 1rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}

div.options {
    position: relative;
    z-index: 2;
}

div.controls {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
    z-index: 0;
    position: relative;
}

div.controls .control,
.options-button {
    border: none;
    border-radius: 4px;
    padding: 0.5rem 2rem;
    color: rgba(255, 255, 255, 0.9);
    background-color: rgba(53, 66, 75, 0.9);
    backdrop-filter: blur(15px);
    cursor: pointer;
    font-family: "Roboto";
    text-transform: uppercase;
    font-size: 0.8rem;
    font-weight: 300;
    transition: background-color 0.2s;
    margin-left: 0.5rem;
    text-align: start;
    display: flex;
    text-decoration: none;
}

div.controls .control:hover,
.options-button:hover {
    background-color: rgba(53, 66, 75, 0.6);
}

div.controls .control.disabled,
.options-button.disabled {
    background-color: rgba(53, 66, 75, 0.4);
    color: rgba(255, 255, 255, 0.5);
    cursor: default;
}

.options-button {
    padding: 0.5rem;
}

div.project-creator {
    flex: 1;
    margin: 5rem 5rem 1rem 5rem;
    max-width: 40rem;
}

.options-group {
    display: flex;
}

label.option {
    display: block;
    margin-left: 0.7rem;
    margin-right: calc(0.7rem + 2px);
    margin-bottom: 1rem;
    margin-top: 1rem;
    padding: 0.5rem 0.8rem;
    border-left: 2px solid rgba(255, 255, 255, 0.2);
    transition: border-color 0.2s;
}

label.option.error {
    border-color: rgba(231, 77, 60, 0.2);
}

label.option p.name {
    font-size: 1.2em;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 0.5rem;
}

label.option p.description {
    font-size: 1em;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 0.5rem;
}

.text-box,
.custom-select {
    background-color: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 3px;
    color: white;
    padding: 0.3rem 0.6rem;
    font-family: "Roboto";
    font-size: 1.2em;
    transition: background-color 0.2s;
    -webkit-appearance: none;
    font-weight: 300;
    width: 100%;
    box-sizing: border-box;
}
.text-box::-webkit-outer-spin-button,
.text-box::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
.text-box:focus {
    background-color: rgba(255, 255, 255, 0.3);
}

.text-box:read-only {
    background-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.5);
}

label.option.error .text-box {
    background-color: rgba(231, 77, 60, 0.2);
}

label.option.error .text-box:focus {
    background-color: rgba(231, 77, 60, 0.3);
}

label.option.error .text-box:read-only {
    background-color: rgba(231, 77, 60, 0.1);
}

.custom-select {
    padding: 0.3rem;
    z-index: 9999;
}
</style>
