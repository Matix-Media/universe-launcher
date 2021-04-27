<template>
    <div class="header-list">
        <h4 class="title">{{title}}</h4>
        <div class="content" :style="{height: height}">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: "HeaderList",
    props: {
        title: {
            tpye: String,
            required: true
        },
        height: {
            required: false,
            default: "auto"
        }
    }
}
</script>

<style scoped>

h4.title {
    font-size: 1rem;
}

div.content {
    margin-top: 1rem;
    overflow: hidden;
    display: flex;
    flex-flow: row wrap;
    overflow: hidden;
}
</style>