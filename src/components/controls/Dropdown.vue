<template>
    <div class="custom-select" :tabindex="tabindex" @blur="open = false">
        <div class="selected" :class="{ open: open }" @click="open = !open">
            <p class="text">
                {{ selected }}
            </p>
            <span class="arrow"></span>
        </div>
        <div class="items" :class="{ selectHide: !open }">
            <div
                v-for="(option, i) of options"
                :key="i"
                @click="
                    customSelected = option;
                    open = false;
                    $emit('input', option);
                "
                :class="{ 'item-selected': selected == option }"
            >
                {{ option }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            required: true,
        },
        default: {
            type: String,
            required: false,
            default: null,
        },
        tabindex: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    data() {
        return {
            customSelected: null,
            open: false,
        };
    },
    computed: {
        selected() {
            if (this.customSelected) return this.customSelected;
            if (this.default) return this.default;
            if (this.options.length > 0) return this.options[0];
            return null;
        },
    },
    watch: {
        default: function() {
            this.$emit("input", this.selected);
        },
        options: function() {
            if (
                !this.options.includes(this.default) ||
                !this.options.includes(this.customSelected)
            ) {
                this.customSelected = null;
            }
        },
    },
    mounted() {
        this.$emit("input", this.selected);
    },
};
</script>

<style scoped>
.custom-select {
    position: relative;
    text-align: left;
    outline: none;
    width: auto;
    z-index: 99999;
}

.custom-select .selected {
    border-radius: 6px;
    padding: 0 0.3rem;
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
}

.custom-select .selected p {
    flex: 1;
    cursor: pointer;
}

.custom-select .selected .arrow {
    margin-left: 0.5rem;
    margin-top: 5px;
    content: "";
    top: 0.5em;
    right: 1em;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-color: #fff transparent transparent transparent;
    transition: transform 0.1s, margin 0.1s;
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.353, 1);
}

.custom-select .selected.open .arrow {
    transform: rotate(-180deg);
    margin-top: -0.4em;
}

.custom-select .items {
    color: #fff;
    overflow: hidden;
    position: absolute;
    backdrop-filter: blur(15px);
    background-color: rgb(48, 61, 68);
    top: calc(100% + 0.2rem);
    left: 0;
    z-index: 1;
    line-height: 2em;
    box-shadow: 1px 4px 9px -1px rgba(0, 0, 0, 0.08);
    border-radius: 3px;
    max-height: 15rem;
    min-width: 100%;
    width: max-content;
    overflow: auto;
}

.custom-select .items div {
    color: #fff;
    padding: 0 1em;
    cursor: pointer;
    user-select: none;
}

.custom-select .items div.item-selected {
    background-color: rgba(255, 255, 255, 0.08);
}

.custom-select .items div:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.selectHide {
    display: none;
}
</style>
