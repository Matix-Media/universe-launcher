<template>
    <ul class="strip-menu-popout" :class="{ 'sub-menu': isSubmenu }">
        <li
            class="strip-menu-item"
            :class="{ open: item.open }"
            v-for="(item, index) of menu"
            :key="index"
            @click.prevent="click($event, item)"
            @mouseenter="hover(item)"
        >
            <div class="content" v-if="!item.seperator">
                <div>
                    <span class="icon" v-if="item.icon">
                        {{ item.icon }}
                    </span>

                    <span class="text">
                        {{ item.text }}
                    </span>
                </div>

                <i class="fas fa-chevron-right expandable" v-if="item.children"></i>
            </div>

            <span class="seperator" v-if="item.seperator"></span>

            <strip-menu-popout
                v-if="item.children"
                v-show="item.open"
                :menu="item.children"
                :isSubmenu="true"
            />
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
        isSubmenu: {
            type: Boolean,
            required: false,
            default: false,
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
            for (let i of this.menu) {
                i.open = false;
            }
            if (item.children) item.open = true;
            this.$forceUpdate();
        },
    },
};
</script>

<style lang="scss" scoped>
.strip-menu-popout {
    cursor: default;
    animation: fadeIn 0.2s;
    padding: 0;
    margin: 0;
    margin-left: -0.5rem;
    list-style-type: none;
    background-color: rgb(48, 61, 68);
    padding: 0.5rem 0;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
    border-radius: 3px;
    line-height: 1.2em;
    color: #fff;
    position: absolute;

    li {
        font-weight: 300;
        position: relative;
        cursor: pointer;
        color: #fff;
        padding: 0.3rem 1em;
        cursor: pointer;
        user-select: none;

        &:hover,
        &.open {
            background-color: rgba(255, 255, 255, 0.1);
        }

        .content {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .icon {
            }

            .text {
                margin-right: 1rem;
            }

            .expandable {
                font-size: 0.8rem;
                color: rgba(255, 255, 255, 0.8);
            }
        }

        .strip-menu-popout {
            top: -0.5rem;
            left: calc(100% + 0.7rem);
            width: max-content;
        }
    }
}
</style>
