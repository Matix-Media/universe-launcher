<template>
    <div v-show="isActive" class="tab-view" :class="{ 'is-active': isActive }">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: "New tab",
        },
        closeable: {
            type: Boolean,
            default: true,
        },
        icon: {
            type: [String, null],
            default: null,
        },
    },
    data() {
        return {
            isActive: true,
        };
    },
    mounted() {
        this.$parent.addTab(this);
    },
    methods: {
        close() {
            this.$emit("close");
        },
    },
};
</script>
