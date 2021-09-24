<template>
    <div class="multi-select" :tabindex="tabindex">
        <p
            v-for="(option, i) of options"
            :key="i"
            :class="{ selected: selected.includes(option) }"
            @click="toggleItem(option)"
        >
            {{ option }}
        </p>
    </div>
</template>

<script>
export default {
    name: "MultiSelect",
    data() {
        return {
            selected: [],
        };
    },
    props: {
        options: {
            type: Array,
            required: true,
        },
        tabindex: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    mounted() {
        this.$emit("input", this.selected);
    },
    methods: {
        toggleItem(option) {
            if (this.selected.includes(option)) {
                var index = this.selected.indexOf(option);
                if (index > -1) {
                    this.selected.splice(index, 1);
                }
            } else {
                this.selected.push(option);
            }
            this.$emit("input", this.selected);
        },
    },
};
</script>

<style scoped>
div.multi-select {
    background-color: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.5);
    margin-top: 0.7rem;
    border-radius: 2px;
    overflow: hidden;
    padding: 0.5rem 0;
}

div.multi-select p {
    padding: 0.1rem 0.7rem;
    cursor: pointer;
}

div.multi-select p:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

div.multi-select p.selected {
    background-color: rgba(255, 255, 255, 0.2);
}
</style>
