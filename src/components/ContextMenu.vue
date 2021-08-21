<template>
    <div
        class="context-menu"
        ref="popper"
        v-show="isVisible"
        tabindex="-1"
        v-click-outside="close"
        @contextmenu.capture.prevent
    >
        <ul>
            <slot :contextData="contextData" />
        </ul>
    </div>
</template>

<script>
import Popper from "popper.js";
import ClickOutside from "vue-click-outside";

export default {
    props: {
        boundariesElement: {
            type: String,
            default: "body",
        },
    },
    // eslint-disable-next-line vue/no-unused-components
    components: { Popper },
    data() {
        return {
            opened: false,
            contextData: {},
        };
    },
    directives: {
        ClickOutside,
    },
    computed: {
        isVisible() {
            return this.opened;
        },
    },
    methods: {
        open(evt, contextData) {
            this.opened = true;
            this.contextData = contextData;

            if (this.popper) {
                this.popper.destroy();
            }

            this.popper = new Popper(this.referenceObject(evt), this.$refs.popper, {
                placement: "right-start",
                modifiers: {
                    preventOverflow: {
                        boundariesElement: document.querySelector(this.boundariesElement),
                    },
                },
            });

            this.$nextTick(() => {
                this.popper.scheduleUpdate();
            });
        },
        close() {
            this.opened = false;
            this.contextData = null;
        },
        referenceObject(evt) {
            const left = evt.clientX;
            const top = evt.clientY;
            const right = left + 1;
            const bottom = top + 1;
            const clientWidth = 1;
            const clientHeight = 1;

            function getBoundingClientRect() {
                return {
                    left,
                    top,
                    right,
                    bottom,
                };
            }

            const obj = {
                getBoundingClientRect,
                clientWidth,
                clientHeight,
            };
            return obj;
        },
    },
    beforeDestroy() {
        if (this.popper !== undefined) {
            this.popper.destroy();
        }
    },
};
</script>

<style lang="scss" scoped>
.context-menu {
    position: fixed;
    z-index: 999;
    color: #fff;
    backdrop-filter: blur(15px);
    background-color: rgb(48, 61, 68);
    line-height: 2em;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
    border-radius: 3px;
    max-height: 15rem;
    width: max-content;
    overflow: auto;
    padding: 0.5rem 0;

    &:focus {
        outline: none;
    }

    ul {
        padding: 0px;
        margin: 0px;
        font-size: 0.9rem;
        font-weight: 300;
        li {
            color: #fff;
            padding: 0.2rem 1em;
            cursor: pointer;
            user-select: none;

            &:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
        }
    }
}
</style>
