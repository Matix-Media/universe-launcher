<template>
    <li class="tree-view-item">
        <div :class="{ closed: isFolder, 'is-folder': isFolder }" @click="action" class="item-info">
            <span v-if="isFolder" class="folder-indicator">
                <i class="fas fa-chevron-right" v-show="!isOpen"></i>
                <i class="fas fa-chevron-down" v-show="isOpen"></i>
            </span>
            <i :class="item.icon" v-if="item.icon"></i>
            <span class="name">
                {{ item.name }}
            </span>
        </div>
        <ul v-if="isFolder && isOpen" class="tree-view-children">
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
            return this.item.children;
        },
    },
    methods: {
        action() {
            if (this.isFolder) {
                this.isOpen = !this.isOpen;
            }
            if (this.item.click) {
                this.item.click(this.item);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
ul.tree-view-children {
    list-style: none;
    margin: 0 0 0 0;
    padding: 0 0 0 1rem;
    border-left: 1px solid transparent;
    transition: border 0.2s;

    &:hover {
        border-left: 1px solid rgba(255, 255, 255, 0.1);
    }
}

li.tree-view-item {
    margin: 0;
    padding: 0;

    .item-info {
        cursor: pointer;
        padding: 0.15rem 0;
        font-size: 0.9rem;
        font-weight: 400;
        display: flex;
        align-items: center;
        color: rgba(255, 255, 255, 0.6);
        transition: color 0.1s;
        &:hover {
            color: white;
        }
        &:not(.is-folder) {
            margin-left: 1rem;
        }

        .name {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        i {
            font-style: normal;
            margin-right: 0.15rem;
        }

        .folder-indicator {
            width: 1rem;
            min-width: 1rem;
            font-size: 0.7rem;
            color: rgba(255, 255, 255, 0.3);
        }
    }
}
</style>
