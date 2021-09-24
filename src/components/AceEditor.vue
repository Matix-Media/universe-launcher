<template>
    <ace-editor
        :value="content"
        @input="update"
        @init="init"
        :lang="language"
        theme="monokai"
        :class="{ readonly: readonly }"
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
        readonly: {
            type: Boolean,
            default: false,
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
                fontFamily: "Roboto Mono",
                fontSize: "12px",
                showPrintMargin: false,
                readOnly: this.readonly,
            });
        },
        update(event) {
            this.$emit("change", event);
        },
    },
};
</script>

<style lang="scss">
.ace_editor {
    background-color: transparent !important;

    .ace_gutter {
        background: #2d383e !important;
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;

        .ace_gutter-cell {
            .ace_fold-widget {
                box-shadow: none !important;
            }
            .ace_error {
                background-image: url("../assets/images/editor/code/error.png");
            }
        }

        .ace_gutter-active-line {
            background: transparent !important;
            color: white;
        }
    }

    .ace_scroller {
        .ace_cursor-layer .ace_cursor {
            transition: opacity 0.1s;
        }

        .ace_marker-layer {
            .ace_active-line {
                background: #303d44 !important;
            }
            .ace_selection {
                background: #515b60;
            }
            .ace_selected-word {
                border: none;
            }
            .ace_bracket {
                border-radius: 4px;
                border-color: rgba(255, 255, 255, 0.3);
            }
        }

        .ace_text-layer .ace_line .ace_invalid {
            background-color: #662e4a;
        }
    }

    .ace_tooltip {
        z-index: 999;
        color: #fff;
        background-color: rgb(48, 61, 68);
        box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 8px 0px;
        border-radius: 3px;
        border: none;
        max-height: 15rem;
        font-family: "Roboto Mono";
        overflow: auto;
        padding: 0.5rem 0.6rem;
    }
}

.ace_editor.readonly {
    .ace_scroller {
        .ace_cursor-layer .ace_cursor {
            display: none;
        }
        .ace_marker-layer {
            .ace_active-line,
            .ace_bracket {
                display: none;
            }
        }
    }
}
</style>
