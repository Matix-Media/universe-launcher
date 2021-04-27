<template>
    <label class="checkbox-label checkbox">
        <p class="checkbox-text">
            {{label}}
        </p>
        <input class="checkbox-hidden" type="checkbox" :checked="isChecked" :value="value" @change="updateInput">
        <span class="checkmark"></span>
    </label>
</template>

<script>
export default {
    name: "Checkbox",
    model: {
        prop: 'modelValue',
        event: "change"
    },
    props: {
        value: {
            type: String
        },
        modelValue: {
            default: ""
        },
        label: {
            type: String,
            required: true
        },
        trueValue: {
            default: true
        },
        falseValue: {
            default: false
        }
    },
    computed: {
        isChecked() {
            if (this.modelValue instanceof Array) {
                return this.modelValue.includes(this.value)
            }

            return this.modelValue == this.trueValue;
        }
    },
    methods: {
        updateInput(event) {
            let isChecked = event.target.isChecked

            if (this.modelValue instanceof Array) {
                let newValue = [...this.modelValue]

                if (isChecked) {
                    newValue.push(this.value)
                } else {
                    newValue.splice(newValue.indexOf(this.value), 1)
                }

                this.$emit('change', newValue)
            } else {
                this.$emit('change', isChecked ? this.trueValue : this.falseValue)
            }
        }
    }
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
    background-color: transparent;
    transition: background-color .2s;
}

.checkbox-label:hover input ~ .checkmark,
.checkbox-label input:checked ~ .checkmark {
    background-color: rgba(255, 255, 255, 0.2);
}

.checkmark::after {
    content: "";
    position: absolute;
    display: none;
}

.checkbox-label input:checked ~ .checkmark::after {
    display: block;
}

.wrapper .checkmark::after {
    left: 7px;
    top: 0px;
    width: 5px;
    height: 13px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
}
</style>