<template>
    <div class="creator-home">
        <div class="projects-manager">
            <full-list title="Recent projects" class="recent-projects">

            </full-list>
            <div class="controls">
                <button>
                    <i class="fas fa-file-medical"></i>
                    <div>
                        <p class="name">New Modpack</p>
                        <p class="description">
                            Create a new Modpack and get started
                        </p>
                    </div>
                </button>
                <button>
                    <i class="fas fa-file-download"></i>
                    <div>
                        <p class="name">Import</p>
                        <p class="description">
                            Import a project using a .ulmp file
                        </p>
                    </div>
                </button>
                <button>
                    <i class="fab fa-git-alt"></i>
                    <div>
                        <p class="name">Clone with git</p>
                        <p class="description">
                            Get a project from an online repository like GitHub
                        </p>
                    </div>
                </button>
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

.controls {
    display: flex;
    flex-direction: column;
    width: 18rem;
    margin-left: 3rem;
}

.controls button {
    border: none;
    border-radius: 4px;
    padding: 1rem 1rem;
    margin-left: 1rem;
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
}

.controls button:hover {
    background-color: rgba(53, 66, 75, 0.6);
}

.controls button * {
    cursor: pointer;
}

.controls button i {
    font-size: 1.5rem;
    width: 1.5rem;
    margin-right: 1rem;
}

.controls button .name {
    font-size: 1rem;
}

.controls button .description {
    text-transform: none;
    color: rgba(255, 255, 255, 0.8);
}
</style>