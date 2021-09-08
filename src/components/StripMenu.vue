<template>
    <ul class="strip-menu">
        <li v-for="(item, index) in menu" :key="index" @click="click(item)">
            {{ item.text }}

            <strip-menu-popout v-if="item.children && item.open" :menu="item.children" />
        </li>
    </ul>
</template>

<script>
import StripMenuPopout from "./StripMenuPopout.vue";

export default {
    name: "StripMenu",
    components: { StripMenuPopout },
    props: {
        menu: {
            type: Array,
            required: true,
        },
    },
    methods: {
        click(item) {
            item.open = !item.open;
            this.$forceUpdate();
        },
    },
};
</script>

<style lang="scss" scoped></style>
