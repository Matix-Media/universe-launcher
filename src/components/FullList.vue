<template>
    <div class="full-list">
        <h4>{{title}}</h4>
        <div class="content" :style="{padding: padding}">
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
            default: ".5rem"
        }
    }
}
</script>

<style scoped>
div.content {
    margin-top: 1rem;
    padding: .5rem;
    backdrop-filter: blur(30px);
    background-color: rgba(255, 255, 255, 0.02);
    overflow: hidden;
}

h4 {
    font-size: 1rem;
}
</style>