<template>
        <div class="modal-mask" :class="{closing: isClosing}" v-on:click.self="close()">
            <div class="modal-container" :style="{width: width}" :class="{'height-animation': heightAnimation}">
                <div class="modal-header">
                    <h3>
                        {{ title }}
                    </h3>
                    <div class="header-buttons">
                        <slot name="header"></slot>
                        <i v-if="closeable" @click="close()" class="close-button fas fa-times"></i>
                    </div>
                </div>
                <div class="modal-content" :style="contentStyle">
                    <slot></slot>
                </div>
                <div class="modal-footer" v-if="buttons.length > 0">
                    <button v-for="button in buttons" :key="button.text" @click="$emit(button.emit)" :class="{primary: button.primary}">{{ button.text }}</button>
                </div>
            </div>
        </div>
</template>

<script>
export default {
    name: "Modal",
    props: {
        title: {default: ""}, 
        width: {default: "50%"},
        heightAnimation: {default: false},
        buttons: {default: () => []}, 
        closeable: {default: false},
        contentStyle: {default: () => {}}
    },
    data() {
        return {
            isClosing: false
        }
    },
    methods: {
        async close() {
            if (this.closeable) {
                this.isClosing = true;
                await new Promise(resolve => setTimeout(resolve, 100));
                this.$emit("close");
            }
        }
    }
}
</script>

<style scoped>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0, 0.5);
    transition: opacity .3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn linear .1s;
}
.modal-mask.closing {
    animation: fadeOut linear .1s;
    animation-fill-mode: forwards;
}

@keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
}
@keyframes fadeOut {
  0% {opacity:1;}
  100% {opacity:0;display: none;}
}

.modal-container {
    padding-top: 1rem;
    background-color: rgba(47, 54, 61, 0.50);
    backdrop-filter: blur(15px);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    max-height: calc(100% - 5rem);
    overflow: hidden;
}

.modal-header {
    margin: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3::after {
    display: none;
}

.modal-header .header-buttons .close-button {
    font-size: .9rem;
    color: rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: color .2s;
    margin-left: 1rem;
}

.modal-header .header-buttons .close-button:hover {
    color: rgba(255, 255, 255, 0.65);
}

.modal-header .header-buttons {
    display: flex;
    align-items: center;
}



.modal-content {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 1rem 1rem;
    margin-top: 1rem;
    overflow: auto;
    max-height: 100%;
    max-width: 100%;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    margin: 1rem 1rem;
}

.modal-footer button {
    border: none;
    border-radius: 4px;
    padding: .5rem 2rem;
    margin-left: 1rem;
    color: white;
    background-color: rgba(53, 66, 75, .9);
    cursor: pointer;
    font-family: 'Roboto';
    text-transform: uppercase;
    font-size: .8rem;
    font-weight: 300;
    transition: background-color .2s;
}

.modal-footer button:hover {
    background-color: rgba(53, 66, 75, 0.6);
}

.modal-footer button.primary {
    background-color: rgba(41, 56, 66, 0.9);
}

.modal-footer button.primary:hover {
    background-color: rgba(41, 56, 66, 0.6);
}

.modal-footer button:first-child {
    margin-left: 0;
}
</style>