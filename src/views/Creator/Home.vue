<template>
    <div class="creator-home">
        <context-menu ref="menu">
            <template slot-scope="{ contextData }">
                <li
                    @click="
                        $refs.menu.close();
                        removeProjectFromList(contextData);
                    "
                >
                    Remove from list
                </li>
                <li
                    @click="
                        $refs.menu.close();
                        openProjectInExplorer(contextData);
                    "
                >
                    Open in file explorer...
                </li>
            </template>
        </context-menu>

        <div class="projects-manager">
            <full-list title="Recent projects" class="recent-projects" :padding="0">
                <p
                    class="no-projects"
                    v-if="recentProjects.projects.length == 0 && recentProjects.loading == false"
                >
                    You haven't opened any projects.<br />
                    Click on one of the buttons on the right to get started.
                </p>
                <div class="recent-projects-wrapper">
                    <div
                        class="project"
                        v-for="(project, i) in recentProjects.projects"
                        :key="i"
                        @click="openProject(project)"
                        @contextmenu.prevent="$refs.menu.open($event, project)"
                    >
                        <div class="info">
                            <div class="first-line">
                                <p class="name">{{ project.name }}</p>
                                <span class="error" v-if="!project.available">not found</span>
                            </div>
                            <p class="location">{{ project.root }}</p>
                        </div>
                        <div class="right">
                            <span v-if="project.lastOpened">
                                {{ project.lastOpened | luxon("med") }}
                            </span>
                        </div>
                    </div>
                </div>
            </full-list>
            <div class="controls">
                <router-link :to="{ name: 'creator-new' }">
                    <i class="fas fa-file-medical"></i>
                    <div>
                        <p class="name">New Modpack</p>
                        <p class="description">
                            Create a new modpack and get started
                        </p>
                    </div>
                </router-link>
                <a>
                    <i class="fas fa-file-upload"></i>
                    <div>
                        <p class="name">Open</p>
                        <p class="description">
                            Open a local modpack project directory
                        </p>
                    </div>
                </a>
                <router-link :to="{ name: 'creator-import' }">
                    <i class="fas fa-file-download"></i>
                    <div>
                        <p class="name">Import</p>
                        <p class="description">
                            Import a project using a .unv file
                        </p>
                    </div>
                </router-link>
                <router-link :to="{ name: 'creator-clone' }">
                    <i class="fab fa-git-alt"></i>
                    <div>
                        <p class="name">Clone with git</p>
                        <p class="description">
                            Get a project from an online repository like GitHub
                        </p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import FullList from "../../components/FullList.vue";
import ContextMenu from "../../components/ContextMenu.vue";
import { shell } from "electron";

export default {
    components: { FullList, ContextMenu },
    name: "Creator-Home",
    data() {
        return {
            recentProjects: {
                loading: true,
                projects: [],
            },
        };
    },
    mounted() {
        this.$nextTick(async () => {
            this.recentProjects.projects = await this.$creator.getRecentProjects();
            this.recentProjects.loading = false;
        });
    },
    methods: {
        openProject(project) {
            this.$creator.setLastUsedProject(project.location);
            this.$router.push({
                name: "creator-editor",
                params: { projectLocation: project.location },
            });
        },
        async removeProjectFromList(project) {
            await this.$creator.removeUsedProject(project.location);
            this.recentProjects.projects = await this.$creator.getRecentProjects();
        },
        openProjectInExplorer(project) {
            setTimeout(() => {
                shell.showItemInFolder(project.root);
            }, 100);
        },
    },
};
</script>

<style scoped lang="scss">
div.creator-home {
    display: flex;
    justify-content: center;
}

div.projects-manager {
    flex: 1;
    margin: 5rem 5rem 1rem 5rem;
    display: flex;
    max-width: 60rem;
}

.recent-projects {
    flex: 1;

    .recent-projects-wrapper {
        max-height: calc(100vh - 15rem);
        overflow-y: auto;
    }

    .project {
        display: flex;
        width: 100%;
        align-items: center;
        padding-left: 0.7rem;
        transition: background 0.2s;
        box-sizing: border-box;
        justify-content: space-between;
        cursor: pointer;
        * {
            cursor: pointer;
        }
        &:hover {
            background-color: rgba(255, 255, 255, 0.05);
        }
        .info {
            display: flex;
            flex-direction: column;
            font-weight: 300;
            color: rgba(255, 255, 255, 0.75);
            .first-line {
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                .name {
                    font-size: 15px;
                }
                .error {
                    display: block;
                    background-color: rgb(192, 57, 43);
                    margin-left: 0.7rem;
                    border-radius: 4px;
                    text-transform: uppercase;
                    font-size: 9px;
                    padding: 0.05rem 0.2rem;
                }
            }
            .location {
                color: rgba(255, 255, 255, 0.25);
            }
        }
        .right {
            cursor: pointer;
            height: 3.5rem;
            padding-right: 0.7rem;
            justify-self: flex-end;
            display: flex;
            justify-content: center;
            align-items: center;
            color: rgba(255, 255, 255, 0.15);
        }
    }
}

.recent-projects .no-projects {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
    margin: 1rem;
    text-align: center;
}

.controls {
    display: flex;
    flex-direction: column;
    width: 17rem;
    margin-left: 4rem;
}

.controls a {
    border: none;
    border-radius: 4px;
    padding: 1rem 1rem;
    color: white;
    background-color: rgba(53, 66, 75, 0.9);
    backdrop-filter: blur(15px);
    cursor: pointer;
    font-family: "Roboto";
    text-transform: uppercase;
    font-size: 0.9rem;
    font-weight: 300;
    transition: background-color 0.2s;
    margin-bottom: 0.5rem;
    text-align: start;
    display: flex;
    text-decoration: none;
}

.controls a:hover {
    background-color: rgba(53, 66, 75, 0.6);
}

.controls a * {
    cursor: pointer;
}

.controls a i {
    font-size: 1.5rem;
    width: 1.5rem;
    margin-right: 1rem;
}

.controls a .name {
    font-size: 1rem;
}

.controls a .description {
    text-transform: none;
    color: rgba(255, 255, 255, 0.8);
}
</style>
