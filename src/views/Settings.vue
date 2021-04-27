<template>
    <div class="settings">
        <full-list title="Settings">
            <checkbox label="Throttle Downloads" />
            <checkbox label="Use proxy" />
        </full-list>

        <full-list title="Desktop-Notifications">
            <checkbox label="Display notifications when modpack is ready" />
            <checkbox label="Display notifications about news" />
        </full-list>

        <full-list title="Others" class="others">
            <a href="mailto:support@matix-media.net">Support</a>
            <a href="">Show logs</a>
        </full-list>
    </div>
</template>

<script>
import FullList from '../components/FullList.vue'
import Checkbox from '../components/controls/Checkbox.vue'

export default {
    name: "Settings",
    components: {FullList, Checkbox}
}
</script>

<style scoped>
div.settings {
    padding: 2rem;
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
    padding: .8rem;
}

.others .content a {
    display: block;
    color: rgba(255, 255, 255, 0.75);
    text-decoration: none;
    font-size: 14px;
    font-weight: 300;
    margin: .5rem 1rem;
    transition: color .2s;
}

.others .content a:hover {
    color: white;
}
</style>