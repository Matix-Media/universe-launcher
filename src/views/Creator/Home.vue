<template>
    <div class="creator-home">
        <div class="projects-manager">
            <full-list title="Recent projects" class="recent-projects">
                <p class="no-projects">
                    You haven't opened any projects.<br> 
                    Click on one of the buttons on the right to get started.
                </p>
            </full-list>
            <div class="controls">
                <router-link :to="{name: 'creator-new'}">
                    <i class="fas fa-file-medical"></i>
                    <div>
                        <p class="name">New Modpack</p>
                        <p class="description">
                            Create a new modpack and get started
                        </p>
                    </div>
                </router-link>
                <router-link :to="{name: 'creator-import'}">
                    <i class="fas fa-file-download"></i>
                    <div>
                        <p class="name">Import</p>
                        <p class="description">
                            Import a project using a .ulmp file
                        </p>
                    </div>
                </router-link>
                <router-link :to="{name: 'creator-clone'}">
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
import FullList from '../../components/FullList.vue'
export default {
    components: { FullList },
    name: "Creator-Home"
}
</script>
<style scoped>
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
}

.recent-projects .no-projects {
    color: rgba(255, 255, 255, 0.5);
    font-size: .9rem;
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
    background-color: rgba(53, 66, 75, .9);
    backdrop-filter: blur(15px);
    cursor: pointer;
    font-family: 'Roboto';
    text-transform: uppercase;
    font-size: .9rem;
    font-weight: 300;
    transition: background-color .2s;
    margin-bottom: .5rem;
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