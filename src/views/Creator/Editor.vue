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
                    <!--<ul class="menu">
                        <li>
                            Project
                            <ul>
                                <li>Settings</li>
                            </ul>
                        </li>
                        <li>
                            Git
                            <ul>
                                <li>Commit</li>
                                <li>Push</li>
                            </ul>
                        </li>
                    </ul>-->
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
        </div>

        <modal
            v-if="modalVisible"
            width="20rem"
            :closeable="modalCloseable"
            class="popup-box"
            @close="errors.popup.show = false"
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
import Modal from "../../components/Modal.vue";
import StripMenu from "../../components/StripMenu.vue";
import fsb from "../../classes/Helpers/fsb";

export default {
    components: { Modal, StripMenu },
    name: "Creator-Editor",
    data() {
        return {
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
                    text: "Project",
                    children: [{ text: "Settings" }],
                },
                {
                    text: "Git",
                    children: [{ text: "Commit" }, { text: "Push" }, {text: "Test", children: [
                        {text: "test1"}
                    ]}],
                },
            ];
        },
    },
    async mounted() {
        this.$nextTick(async () => {
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
                this.project.editor = new Editor(this.project.location);
                this.modalVisible = true;
                await this.project.editor.load((status) => (this.loadingProject.status = status));
                this.loadingProject.status = "Preparing workspace...";
                this.loadingProject.editorVisible = true;
                console.log("Project loaded. Loading workspace...");
                await new Promise((resolve) => setTimeout(() => resolve(), 1000));
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
        });
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
    div.toolbar {
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
                cursor: default;
                &:focus {
                    cursor: text;
                }
            }

            .menu {
                list-style-type: none;
                padding: 0;
                margin: 0;
                font-size: 0.9rem;

                > li {
                    display: inline-block;
                    padding: 0.5rem 0.5rem;
                    cursor: pointer;

                    &:first-of-type {
                        padding-left: 0;
                    }

                    ul {
                        display: none;
                        padding: 0;
                        margin: 0;
                        list-style-type: none;
                        background-color: rgb(48, 61, 68);
                        overflow: auto;
                        padding: 0.5rem 0;
                        box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
                            rgba(0, 0, 0, 0) 0px 0px 0px 0px,
                            rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
                        border-radius: 3px;
                        max-height: 15rem;
                        line-height: 1.2em;
                        color: #fff;
                        position: absolute;
                    }

                    li {
                        position: relative;
                        cursor: pointer;
                        color: #fff;
                        padding: 0.2rem 1em;
                        cursor: pointer;
                        user-select: none;
                        &:hover {
                            background-color: rgba(255, 255, 255, 0.1);
                        }
                    }
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
}
</style>
