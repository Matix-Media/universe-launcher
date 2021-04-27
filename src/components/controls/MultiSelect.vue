<template>
    <div class="multi-select" :tabindex="tabindex">
        <p
                v-for="(option, i) of options"
                :key="i"
                :class="{selected: selected.includes(option)}"
                @click="
                if (selected.includes(option)) {
                    selected.remove(option);
                } else {
                    selected.push(option);
                }
                $emit('input', selected);
                "
            >
                {{ option }}
            </p>
    </div>
</template>

<script>
export default {
    name: "MultiSelect",
    created() {
        this.selected = [];
    },
    props: {
        options: {
            type: Array,
            required: true,
        },
        tabindex: {
            type: Number,
            required: false,
            default: 0
        }
    },
    mounted() {
        this.$emit("input", this.selected);
    }
}
</script>

<style scoped>
div.multi-select {
    background-color: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, .5);
    margin-top: .7rem;
    border-radius: 2px;
    overflow: hidden;
    padding: .5rem 0;
}

div.multi-select p {
    padding: .1rem .7rem;
    cursor: pointer;
}


div.multi-select p:hover,
div.multi-select p.selected {
    background-color: rgba(255, 255, 255, 0.178);
}
</style>