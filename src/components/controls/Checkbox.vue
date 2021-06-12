<template>
    <label class="checkbox-label checkbox">
        <p class="checkbox-text">
            {{label}}
        </p>
        <input class="checkbox-hidden" type="checkbox" v-bind:checked="value" @input="$emit('input', $event.target.checked)">
        <span class="checkmark"></span>
    </label>
</template>

<script>
export default {
    name: "Checkbox",
    props: {
        value: {
            type: Boolean
        },
        label: {
            type: String,
            required: true
        }
    },
}
</script>

<style scoped>
.checkbox-label {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 6px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 16px;
    color: white;
    font-weight: 300;
}

.checkbox-label .checkbox-text {
    padding-top: 3px;
    cursor: pointer;
    width: auto;
}

input.checkbox-hidden {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    border: 2px solid #fff;
    border-radius: 2px;
    background-color: transparent;
    transition: background-color .15s, box-shadow .15s;
}

.checkbox-label:hover input ~ .checkmark {
    background-color: rgba(255,255,255,0.26);
    box-shadow: 0px 0px 5px 1px rgba(255,255,255,0.26);
}

.checkbox-label input:checked ~ .checkmark {
    background-color: #fff;
}

.checkmark::after {
    content: "";
    position: absolute;
    display: block;
    opacity: 0;
    transition: opacity .1s;
}

.checkbox-label input:checked ~ .checkmark::after {
    opacity: 1;
}

.wrapper .checkmark::after {
    left: 7px;
    top: 0px;
    width: 5px;
    height: 13px;
    border: solid #263238;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}
</style>