<template>
    <ul class="strip-menu" v-click-outside="close">
        <li
            v-for="(item, index) in menu"
            :key="index"
            @click="click(item)"
            @mouseenter="hover(item)"
            :class="{ open: item.open }"
        >
            {{ item.text }}

            <strip-menu-popout v-if="item.children && item.open" :menu="item.children" />
        </li>
    </ul>
</template>

<script>
import StripMenuPopout from "./StripMenuPopout.vue";
import ClickOutside from "vue-click-outside";

export default {
    name: "StripMenu",
    components: { StripMenuPopout },
    props: {
        menu: {
            type: Array,
            required: true,
        },
    },
    directives: {
        ClickOutside,
    },
    methods: {
        click(item) {
            item.open = !item.open;
            this.$forceUpdate();
        },
        hover(item) {
            var anyOpen = false;
            for (let i of this.menu) {
                if (i.open === true) {
                    anyOpen = true;
                    break;
                }
            }
            if (!anyOpen) return;

            for (let i of this.menu) i.open = false;
            item.open = true;
            this.$forceUpdate();
        },
        close() {
            var anyOpen = false;
            for (let i of this.menu)
                if (i.open === true) {
                    anyOpen = true;
                    break;
                }
            if (!anyOpen) return;

            for (let i of this.menu) i.open = false;
            this.$forceUpdate();
        },
    },
};
</script>

<style lang="scss" scoped>
.strip-menu {
    list-style-type: none;
    padding: 0;
    margin: 0;
    font-size: 0.9rem;

    > li {
        display: inline-block;
        padding: 0.5rem 0.5rem;
        cursor: pointer;
        transition: color 0.2s;

        &:hover,
        &.open {
            color: rgba(255, 255, 255, 0.9);
        }
        &.open {
            background-color: rgb(48, 61, 68);
            border-radius: 3px 3px 0 0;
            transition: color 0.2s, background-color 0.2s;
        }
    }
}
</style>
