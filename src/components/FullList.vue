<template>
    <div class="full-list">
        <div class="header" :class="{ 'has-content': $slots.header }">
            {{ title }}
            <div class="header-content" v-if="$slots.header">
                <slot name="header"></slot>
            </div>
        </div>
        <div
            class="content"
            :style="{
                padding: padding,
                overflow: overflowHidden ? 'hidden' : 'visible',
                'overflow-y': overflowY,
                height: height,
            }"
        >
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: "FullList",
    props: {
        title: String,
        padding: {
            default: ".5rem",
        },
        overflowHidden: {
            default: true,
        },
        overflowY: {
            default: "hidden",
        },
        height: {
            default: "auto",
        },
    },
};
</script>

<style scoped>
div.content {
    margin-top: 1rem;
    padding: 0.5rem;
    backdrop-filter: blur(30px);
    background-color: rgba(255, 255, 255, 0.02);
}

.header {
    display: flex;
    align-items: center;
    text-transform: uppercase;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.75);
    font-size: 1rem;
}

.header::after {
    content: "";
    border-top: 1px solid rgba(69, 90, 100, 0.65);
    margin-left: 1rem;
    flex: 1 0 20px;
}

.header.has-content {
    display: flex;
    align-items: center;
}

div.header-content {
    margin-left: 1rem;
    display: flex;
    align-items: center;
}
</style>
