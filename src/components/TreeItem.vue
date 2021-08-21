<template>
    <li>
        <div :class="{ closed: isFolder }" @click="toggle">
            <span v-if="isFolder">
                <i class="fas fa-chevron-right" v-show="!isOpen"></i>
                <i class="fas fa-chevron-down" v-show="isOpen"></i>
            </span>
            {{ item.name }}
        </div>
        <ul v-show="isOpen" v-if="isFolder">
            <tree-item
                class="item"
                v-for="(child, index) in item.children"
                :key="index"
                :item="child"
                @make-folder="$emit('make-folder', $event)"
            ></tree-item>
        </ul>
    </li>
</template>

<script>
export default {
    name: "tree-item",
    props: {
        item: Object,
    },
    data() {
        return {
            isOpen: false,
        };
    },
    computed: {
        isFolder() {
            return this.item.children && this.item.children.length;
        },
    },
    methods: {
        toggle() {
            if (this.isFolder) {
                this.isOpen = !this.isOpen;
            }
        },
    },
};
</script>
