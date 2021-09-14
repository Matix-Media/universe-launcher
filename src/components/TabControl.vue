<template>
    <div class="tab-control">
        <ul class="header">
            <draggable v-model="tabs">
                <li
                    v-for="(tab, index) in tabs"
                    :key="index"
                    @click="selectTab(index)"
                    class="header-item"
                    :class="{ active: index == selectedIndex }"
                >
                    <i class="tab-icon" :class="tab.icon" v-if="tab.icon"></i>
                    <span class="title"> {{ tab.title }}</span>
                    <i class="fas fa-times close" @click="closeTab(index)"></i>
                </li>
            </draggable>
        </ul>
        <div class="tabs">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
    components: { draggable },
    data() {
        return {
            tabs: [],
            selectedIndex: 0,
        };
    },
    methods: {
        addTab(elem) {
            this.tabs.push(elem);
            this.selectTab(this.tabs.length - 1);
        },
        selectTab(i) {
            this.selectedIndex = i;
            // eslint-disable-next-line no-unused-vars
            this.tabs.forEach((tab, index) => {
                tab.isActive = index === i;
            });
        },
        closeTab(i) {
            this.tabs.forEach((tab, index) => {
                if (index === i) {
                    tab.close();
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.tab-control {
    .tabs {
        height: 100%;
        background-color: rgba(38, 50, 56, 1);
    }

    .header {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        background-color: rgba(38, 50, 56, 0.6);
        backdrop-filter: blur(30px);

        .header-item {
            color: rgba(255, 255, 255, 0.8);
            font-size: 1rem;
            font-weight: 300;
            padding: 0.5rem 1rem;
            cursor: pointer;
            transition: background 0.2s;
            display: inline-flex;
            align-items: center;

            user-select: auto !important;
            -webkit-user-drag: element !important;
            -webkit-app-region: initial !important;

            &:hover {
                background-color: rgba(255, 255, 255, 0.04);
            }

            &.active {
                background-color: rgba(255, 255, 255, 0.1);
            }

            i.tab-icon {
                font-style: normal;
                margin-right: 0.3rem;
            }

            .close {
                margin-left: 0.6rem;
                height: 0.6rem;
                width: 0.6rem;
                padding: 0.3rem;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                font-size: 0.6rem;
                transition: color 0.1s, background 0.1s;

                &:hover {
                    color: white;
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
            }
        }
    }
}
</style>
