<template>
    <ul class="strip-menu-popout">
        <li
            class="strip-menu-item"
            v-for="(item, index) of menu"
            :key="index"
            @click.prevent="click($event, item)"
            @mouseenter="hover(item)"
        >
            <span v-if="item.icon">
                {{ item.icon }}
            </span>
            {{ item.text }}

            <strip-menu-popout v-if="item.children" v-show="item.open" :menu="item.children" />
        </li>
    </ul>
</template>

<script>
export default {
    name: "StripMenuPopout",
    props: {
        menu: {
            type: Array,
            required: true,
        },
    },
    methods: {
        click(e, item) {
            if (item.click && !item.disabled) {
                item.click(e);
            } else {
                e.stopPropagation();
            }
        },
        hover(item) {
            if (!item.children) return;

            for (let i of this.menu) {
                i.open = false;
            }
            item.open = true;
            this.$forceUpdate();
        },
        closeAll() {
            
        }
    },
};
</script>

<style lang="scss" scoped></style>
