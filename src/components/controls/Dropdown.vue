<template>
    <div class="custom-select" :tabindex="tabindex" @blur="open = false">
        <div class="selected" :class="{ open: open }" @click="open = !open">
        {{ selected }}
        </div>
        <div class="items" :class="{ selectHide: !open }">
            <div
                v-for="(option, i) of options"
                :key="i"
                @click="selected = option;open = false;$emit('input', option);"
            >
                {{ option }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    default: {
      type: String,
      required: false,
      default: null,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      selected: this.default
        ? this.default
        : this.options.length > 0
        ? this.options[0]
        : null,
      open: false,
    };
  },
  mounted() {
    this.$emit("input", this.selected);
  },
};
</script>

<style scoped>
.custom-select {
  position: relative;
  text-align: left;
  outline: none;
  width: auto;
  z-index: 99999;
}

.custom-select .selected {
  border-radius: 6px;
  padding-left: 1em;
  padding-right: 2.5em;
  cursor: pointer;
  user-select: none;
}

.custom-select .selected:after {
  position: absolute;
  content: "";
  top: .5em;
  right: 1em;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-color: #fff transparent transparent transparent;
  transition: transform .2s , margin .2s;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.353, 1);
}

.custom-select .selected.open:after {
    transform: rotate(-180deg);
    margin-top: -.4em;
}

.custom-select .items {
  color: #fff;
  z-index: 999999;
  overflow: hidden;
  position: absolute;
  backdrop-filter: blur(15px);
  background-color: rgb(48, 61, 68);
  top: calc(100% + .2rem);
  left: 0;
  right: 0;
  z-index: 1;
  line-height: 2em;
  box-shadow: 1px 4px 9px -1px rgba(0,0,0,0.08);
  border-radius: 3px;
}

.custom-select .items div {
  color: #fff;
  padding-left: 1em;
  cursor: pointer;
  user-select: none;
}

.custom-select .items div:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.selectHide {
  display: none;
}
</style>