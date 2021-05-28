<template>
    <full-list title="Description">
        <markdown-it-vue class="description-markdown markdown-content" :content="content" :options="MarkdownOptions" />
    </full-list>
</template>

<script>
import FullList from "../../components/FullList.vue";
import MarkdownItVue from "markdown-it-vue"
import MarkdownOptions from "../../classes/markdownOptions"

export default {
    name: "Overview",
    components: {
        FullList,
        MarkdownItVue
    },
    data() {
        return {
            content: "",
            MarkdownOptions: MarkdownOptions
        }
    },
    methods: {
        postRender(source) {
            const LINK_REGEX = /\[(.+?)\]\(((?:(http[s]?|ftp):\/{2})?[\w\\/\-+?#=.:!%&]+)\)/g;

            return source.replace(LINK_REGEX, "<a href=\"$2\" target=\"_blank\">$1</a>");
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$api.getModpack(this.$route.params.id).then((res) => {
                this.content = res.description;
            })
        })
    }
}
</script>

<style>
.description-markdown {
    font-weight: 300;
    font-size: .9rem;
    padding: .7rem;
}
</style>