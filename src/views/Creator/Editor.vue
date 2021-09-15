<template>
    <div class="creator-editor">
        <div class="project-editor" v-if="loadingProject.editorVisible">
            <div class="toolbar">
                <div class="toolbar-menu">
                    <input
                        type="text"
                        class="project-name"
                        v-bind:value="project.editor.meta.project.name"
                        @focus="$event.target.select()"
                    />
                    <strip-menu :menu="menu" />
                </div>
                <ul class="quick-access">
                    <li>
                        <i class="fas fa-play"></i>
                        Debug
                    </li>
                    <li>
                        <i class="fas fa-cloud-upload-alt"></i>
                        Publish
                    </li>
                    <li>
                        <i class="fas fa-file-export"></i>
                        Export
                    </li>
                </ul>
            </div>

            <div class="workspace">
                <splitpanes>
                    <pane size="15" min-size="5">
                        <full-list
                            title="Explorer"
                            height="86vh"
                            class="project-explorer"
                            padding="0"
                            overflowY="auto"
                        >
                            <ul class="tree-view">
                                <tree-item
                                    v-for="child of project.filesList"
                                    :key="child.path"
                                    :item="child"
                                />
                            </ul>
                        </full-list>
                    </pane>
                    <pane min-size="10">
                        <tab-control>
                            <tab
                                v-for="(tab, index) of project.openTabs"
                                :key="index"
                                :title="tab.title"
                                :icon="tab.icon"
                                :class="{ 'tab-view-code': tab.type == 'code' }"
                            >
                                <ace-editor
                                    v-if="tab.type == 'code'"
                                    class="code-editor"
                                    :content="tab.contains.file.content"
                                    :language="tab.contains.language"
                                    @change="tab.contains.file.updateContent($event)"
                                    line-numbers
                                />
                            </tab>
                            <!--<tab title="Editor.vue" icon="medium-green text-icon">
                                <ace-editor
                                    class="code-editor"
                                    v-model="project.openFiles.testFile1.content"
                                    :language="project.openFiles.testFile1.language"
                                    :options="{
                                        automaticLayout: true,
                                    }"
                                />
                            </tab>-->
                        </tab-control>
                    </pane>
                </splitpanes>
            </div>
        </div>

        <modal
            v-if="modalVisible"
            width="20rem"
            :closeable="modalCloseable"
            class="popup-box"
            @close="
                errors.popup.show = false;
                closePopup();
            "
            ref="modal"
        >
            <div class="loading-project" v-if="!errors.popup.error">
                <img
                    src="@/assets/images/branding/icon.svg"
                    class="icon"
                    style="width: 5rem"
                    alt=""
                />
                <p>
                    Loading project...
                    <span>{{ loadingProject.status }}</span>
                </p>
            </div>
            <div class="popup-error" v-if="errors.popup.error">
                <i class="fas fa-times"></i>

                <p>{{ errors.popup.error }}</p>
            </div>
        </modal>
    </div>
</template>

<script>
import Editor from "../../classes/Creator/editor";
import fsb from "../../classes/Helpers/fsb";
import { sep as pathSeperator, basename, join as joinPaths } from "path";
// eslint-disable-next-line no-unused-vars
import { getClassWithColor as getFileIcon } from "file-icons-js";
import { Splitpanes, Pane } from "splitpanes";
import FullList from "../../components/FullList.vue";
import TreeItem from "../../components/TreeItem.vue";
import Modal from "../../components/Modal.vue";
import StripMenu from "../../components/StripMenu.vue";
import TabControl from "../../components/TabControl.vue";
import Tab from "../../components/Tab.vue";
import AceEditor from "../../components/AceEditor.vue";
import aceHelper from "../../classes/Helpers/ace-helper";

export default {
    components: {
        Splitpanes,
        Pane,
        Modal,
        StripMenu,
        FullList,
        TreeItem,
        TabControl,
        Tab,
        AceEditor,
    },
    name: "Creator-Editor",
    data() {
        return {
            states: {
                initalFileScanComplete: false,
            },
            modalVisible: false,
            loadingProject: {
                loading: true,
                editorVisible: false,
                status: "Opening files...",
            },
            errors: {
                popup: {
                    error: null,
                },
            },
            project: {
                location: null,
                editor: null,
                filesList: {},
                openTabs: [],
            },
        };
    },
    computed: {
        modalCloseable() {
            return !this.loadingProject.loading;
        },
        menu() {
            return [
                {
                    text: "File",
                    children: [
                        {
                            text: "New",
                            children: [
                                {
                                    text: "File",
                                },
                                {
                                    text: "Directory",
                                },
                            ],
                        },
                        { text: "Import into project..." },
                        { text: "Project settings..." },
                        { text: "QUIT modpack editor" },
                    ],
                },
                {
                    text: "Git",
                    children: [{ text: "Commit" }, { text: "Push" }],
                },
            ];
        },
    },
    async mounted() {
        this.$nextTick(async () => {
            await this.load();
        });
    },
    methods: {
        closePopup() {
            if (
                !this.loadingProject.loading &&
                !this.loadingProject.editorVisible &&
                this.errors.popup.error
            ) {
                this.$router.push({ name: "creator" });
            }
        },
        async load() {
            if (!this.$route.params.projectLocation) {
                console.error("No project specified.");
                this.errors.popup.error = new Error("No project location specified.");
                this.modalVisible = true;
                this.loadingProject.loading = false;
                return;
            }

            this.project.location = this.$route.params.projectLocation;
            let projectExists = await fsb.isFile(this.project.location);
            if (!projectExists) {
                console.error("The project was not found.");
                this.errors.popup = {
                    error: new Error("The project was not found."),
                    show: true,
                };
                this.loadingProject.loading = false;
                return;
            }

            try {
                this.modalVisible = true;

                // Initialize editor
                this.project.editor = new Editor(this.project.location);

                // Hook into file update events
                this.project.editor.on("fileUpdates", this.handleFileUpadate);

                // Load project into editor with update hook
                await this.project.editor.load((status) => (this.loadingProject.status = status));

                // Enable editor window
                this.loadingProject.status = "Preparing workspace (step 1/2)...";
                this.loadingProject.editorVisible = true;

                console.log("Project loaded. Loading workspace...");

                // Wait for file listiner to complete initialization
                if (!this.states.initalFileScanComplete) {
                    console.log("Waiting for completion of inital file scan...");
                    await new Promise((resolve) => {
                        this.project.editor.fileWatcher.on("ready", () => {
                            console.log("Initial file scan completed");
                            resolve();
                        });
                    });
                }
                this.$forceUpdate();

                // Do heay tasks

                // Reopen tabs
                console.log("Reopening tabs...");
                this.loadingProject.status = "Preparing workspace (step 2/2)...";

                /*
                    test tab
                    this.project.openTabs.push({
                        title: ,
                        type: "code",
                        icon: "medium-green text-icon",
                        contains: {
                            path: this.project.location,
                            language: AceHelper.getLanguageByPath(this.project.location),
                            content: fs.readFileSync(this.project.location, "utf-8"),
                        },
                    });
                */
                this.$forceUpdate();

                // Slight timeout
                await new Promise((resolve) => setTimeout(() => resolve(), 500));

                // Cleanup
                console.log("Loaded workspace");
                this.loadingProject.loading = false;
                this.$nextTick(() => {
                    this.$refs.modal.close();
                });
            } catch (err) {
                console.error("Error loading project.", err);
                this.errors.popup.error = err;
                this.errors.popup.show = true;
                this.loadingProject.loading = false;
            }
        },
        handleFileUpadate(event, filePath) {
            const parsedPath = filePath.substring(this.project.editor.getPath("instance").length);

            switch (event) {
                case "add":
                    {
                        this.updateFileTree("add", "file", parsedPath);
                    }
                    break;
                case "addDir":
                    {
                        this.updateFileTree("add", "dir", parsedPath);
                    }
                    break;
                case "unlink":
                    {
                        this.updateFileTree("remove", "file", parsedPath);
                    }
                    break;
                case "unlinkDir":
                    {
                        this.updateFileTree("remove", "dir", parsedPath);
                    }
                    break;
                case "error":
                    {
                        console.error(filePath);
                    }
                    break;
                case "ready":
                    {
                        this.states.initalFileScanComplete = true;
                    }
                    break;
                default: {
                    console.warn("Unknown file event:", event);
                }
            }
        },
        updateFileTree(action, type, path) {
            if (path == "" || path == null) return;

            if (path.startsWith(pathSeperator)) {
                path = path.substring(1);
            }

            var pathParts = path.split(pathSeperator);

            var currentLevel = this.project.filesList;
            var i = -1;
            for (let part of pathParts) {
                i++;

                if (currentLevel[part] == null) {
                    var currentPath = joinPaths(
                        this.project.editor.getPath("instance"),
                        pathParts.slice(0, i + 1).join(pathSeperator)
                    );
                    var currentIcon = "medium-green text-icon"; // getFileIcon(part);

                    var partIsDir = false;
                    if (type == "dir") partIsDir = true;
                    else partIsDir = i + 1 < pathParts.length;

                    if (action == "add") {
                        if (partIsDir)
                            currentLevel[part] = {
                                name: part,
                                path: currentPath,
                                icon: currentIcon,
                                children: {},
                            };
                        else {
                            var openFile = this.openFile;
                            currentLevel[part] = {
                                name: part,
                                path: currentPath,
                                icon: currentIcon,
                                click(item) {
                                    openFile(item.path);
                                },
                            };
                        }
                    } else {
                        break;
                    }
                } else {
                    if (action == "remove") {
                        delete currentLevel[part];
                    }
                }

                if (i < pathParts.length) currentLevel = currentLevel[part].children;
            }
        },
        async openFile(path) {
            let filename = basename(path);
            let icon = "medium-green text-icon";
            let language = aceHelper.getLanguageByPath(path);
            let file = await this.project.editor.getFileEditor(path);
            this.project.openTabs.push({
                title: filename,
                icon: icon,
                type: "code",
                contains: {
                    file: file,
                    language: language,
                },
            });
        },
    },
};
</script>

<style scoped lang="scss">
div.popup-box {
    div.loading-project,
    div.popup-error {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        p {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 0.5rem;
        }
    }
    div.loading-project {
        animation-name: breathing;
        animation-duration: 2s;
        animation-iteration-count: infinite;
        img {
            margin: 0.5rem 0;
            opacity: 0.65;

            animation-name: spinning;
            animation-duration: 3s;
            animation-iteration-count: infinite;
        }
        p {
            margin-top: 1rem;
            display: flex;
            align-items: center;
            flex-direction: column;
            span {
                color: rgba(255, 255, 255, 0.5);
                margin-top: 0.5rem;
                display: block;
                font-size: 0.9em;
            }
        }
    }
    div.popup-error {
        animation: fadeIn ease-in-out 0.4s;
        i {
            color: rgba(231, 77, 60, 0.6);
            font-size: 100px;
            margin-bottom: 1rem;
        }
    }
}

div.project-editor {
    display: flex;
    flex-direction: column;
    height: 100vh;

    div.toolbar {
        z-index: 1;
        backdrop-filter: blur(30px);
        background-color: rgba(255, 255, 255, 0.02);
        position: relative;
        display: flex;
        justify-content: center;
        color: rgba(255, 255, 255, 0.65);
        height: 4.5rem;

        .toolbar-menu {
            position: absolute;
            top: 0;
            left: 0.7rem;

            .project-name {
                padding: 0;
                width: max-content;
                color: rgba(255, 255, 255, 0.65);
                background: none;
                border: none;
                margin-top: 0.5rem;
                font-size: 1.5rem;
                color: rgba(255, 255, 255, 0.75);
                cursor: text;
                transition: color 0.1s, border 0.1s;
                border-bottom: 1px solid transparent;
                &:focus {
                    cursor: text;
                    color: white;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.8);
                }
            }
        }
        .quick-access {
            list-style-type: none;
            display: flex;
            font-size: 1rem;
            margin: 1.5rem 0;

            li {
                display: flex;
                align-items: center;
                padding: 0.2rem 0.8rem;
                cursor: pointer;
                border-right: 2px solid rgba(69, 90, 100, 0.65);
                transition: color 0.2s;
                &:last-of-type {
                    border-right: none;
                }
                i {
                    margin-right: 0.5rem;
                    font-size: 1.2rem;
                    color: rgba(255, 255, 255, 0.5);
                    transition: color 0.2s;
                }
                &:hover {
                    color: rgba(255, 255, 255, 0.9);
                    i {
                        color: rgba(255, 255, 255, 0.8);
                    }
                }
            }
        }
    }

    div.workspace {
        z-index: 0;
        margin: 1rem;
        height: calc(100vh - 6.5rem);

        .project-explorer {
            .tree-view {
                list-style: none;
                margin: 0 0 0 0.5rem;
                padding: 0;
            }
        }

        .tab-control {
            height: 100%;

            .tab-view {
                height: 100%;

                &.tab-view-code {
                    position: relative;
                }
            }
        }
    }
}
</style>

<style lang="scss">
.splitpanes {
    .splitpanes__splitter {
        margin: 0 1rem 0 1rem;
        width: 0.2rem;
        backdrop-filter: blur(30px);
        background-color: rgba(255, 255, 255, 0.025);
    }
}
</style>
