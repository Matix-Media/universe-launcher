<template>
    <full-list title="Overview">
        <vue-markdown :source="'# title\nSome content for the markdown file'"/>
    </full-list>
</template>

<script>
import FullList from "../../components/FullList.vue";
import VueMarkdown from "vue-markdown-render";

export default {
    name: "Overview",
    components: {
        FullList,
        VueMarkdown
    }
}
</script>