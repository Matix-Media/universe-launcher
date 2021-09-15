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
                scrollPastEnd: 0.9,
                vScrollBarAlwaysVisible: true,
            });
        },
    },
};
</script>

<style lang="scss">
.ace_editor {
    .ace_gutter-cell.ace_error {
        background-image: url("../assets/images/editor/code/error.png");
    }

    .ace_tooltip {
        z-index: 999;
        color: #fff;
        background-color: rgb(48, 61, 68);
        box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 8px 0px;
        border-radius: 3px;
        border: none;
        max-height: 15rem;
        font-family: Roboto;
        overflow: auto;
        padding: 0.5rem 0.6rem;
    }
}
</style>
