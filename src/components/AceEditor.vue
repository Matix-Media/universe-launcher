<template>
    <ace-editor
        :value="content"
        @input="$emit('change', $event)"
        @init="init"
        :lang="language"
        theme="monokai"
    />
</template>

<script>
import AceEditor from "vue2-ace-editor";
import "brace/theme/monokai";

export default {
    components: { AceEditor },
    props: {
        content: {
            type: String,
            default: "",
        },
        language: {
            type: String,
            default: "text",
        },
    },
    model: {
        prop: "content",
        event: "change",
    },
    methods: {
        init(editor) {
            editor.renderer.setScrollMargin(6, 0);
            editor.setOptions({
                wrap: true,
                scrollPastEnd: 0.5,
            });
        },
    },
};
</script>
