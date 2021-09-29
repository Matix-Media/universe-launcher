<template>
    <li class="tree-view-item">
        <div :class="{ closed: isFolder, 'is-folder': isFolder }" @click="action" class="item-info">
            <span v-if="isFolder" class="folder-indicator">
                <i class="fas fa-chevron-right" v-show="!isOpen"></i>
                <i class="fas fa-chevron-down" v-show="isOpen"></i>
            </span>
            <span class="tree-view-item-icon custom-icon" v-if="item.icon && !isFolder">
                <div :class="iconClass"></div>
            </span>
            <span class="tree-view-item-icon folder-icon" :class="iconColor" v-if="isFolder">
                <svg
                    class="folder"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 24 24"
                >
                    <path
                        v-if="!isOpen"
                        fill="currentColor"
                        d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"
                    />
                    <path
                        v-if="isOpen"
                        fill="currentColor"
                        d="M19,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10L12,6H19A2,2 0 0,1 21,8H21L4,8V18L6.14,10H23.21L20.93,18.5C20.7,19.37 19.92,20 19,20Z"
                    />
                </svg>
                <div class="custom-icon" :class="iconClass" v-if="item.icon"></div>
            </span>
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
        iconColor() {
            if (this.item.icon) return this.item.icon.colour[0];
            return null;
        },
        iconClass() {
            if (this.item.icon) return this.item.icon.getClass(0);
            return null;
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
        &:hover {
            .name {
                color: white;
            }
        }
        &:not(.is-folder) {
            margin-left: 1rem;
        }

        .name {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        .tree-view-item-icon {
            margin-right: 0.25rem;
            width: 1rem;
            height: 1rem;

            &.custom-icon {
                font-style: normal;
                font-size: 1rem;
                font-size: 1rem;

                display: flex;
                align-items: center;
                justify-content: center;
            }
            &.folder-icon {
                position: relative;

                .custom-icon {
                    position: absolute;
                    bottom: -0.1rem;
                    right: 0;
                    &::before {
                        color: rgba(255, 255, 255, 0.8);
                        font-size: 0.5rem;
                    }
                }
            }
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
