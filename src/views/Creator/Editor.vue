<template>
    <div class="creator-editor">
        <div class="project-editor"></div>

        <modal
            width="20rem"
            v-if="loadingProject.loading || errors.popup.show"
            :closeable="errors.popup.show"
            class="popup-box"
            @close="errors.popup.show = false"
        >
            <div class="loading-project" v-if="!errors.popup.show">
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
            <div class="popup-error" v-if="errors.popup.show">
                <i class="fas fa-times"></i>

                <p>{{ errors.popup.error }}</p>
            </div>
        </modal>
    </div>
</template>

<script>
import Editor from "../../classes/Creator/editor";
import Modal from "../../components/Modal.vue";
import fsb from "../../classes/Helpers/fsb";

export default {
    components: { Modal },
    name: "Creator-Editor",
    data() {
        return {
            loadingProject: {
                loading: true,
                status: "Opening files...",
            },
            errors: {
                popup: {
                    error: null,
                    show: false,
                },
            },
            project: {
                location: null,
                editor: null,
            },
        };
    },

    async mounted() {
        this.$nextTick(async () => {
            if (!this.$route.params.projectLocation) {
                console.error("No project specified.");
                this.errors.popup.error = new Error("No project location specified.");
                this.errors.popup.show = true;
                this.loadingProject.loading = false;
                return;
            }

            this.project.location = this.$route.params.projectLocation;
            let projectExists = await fsb.isFile(this.project.location);
            console.log("Project file found:", projectExists);
            if (!projectExists) {
                console.error("The project was not found.");
                this.errors.popup = {
                    error: new Error("The project was not found."),
                    show: true,
                };
                this.loadingProject.loading = true;
                return;
            }

            try {
                this.project.editor = new Editor(this.project.location);
                this.project.editor.load((status) => (this.loadingProject.status = status));
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
</style>
