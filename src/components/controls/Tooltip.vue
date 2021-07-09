<template>
    <div class="tooltip-box">
        <slot name="content" />
        <div class="tooltip">
            <slot name="tooltip" />
        </div>    
    </div>    
</template>

<script>
export default {
    name: "Tooltip"
}
</script>

<style scoped>
.tooltip-box {
    position: relative;
    display: inline-block;
    z-index: 1;
}

.tooltip-box:hover .tooltip {
    visibility: visible;
    opacity: 1;
    transform: translateX(0) scale(1);
}

.tooltip {
    color: #fff;
    border-radius: 3px;

    top: 0;
    left: calc(100% + .5rem);
    overflow: hidden;

    opacity: 0;
    visibility: hidden;
    transform: translateX(-.5rem) scale(.95);
    transition: opacity .2s, transform .2s;
    transition-delay: .4s;

    position: absolute;
    z-index: 5;
    
    backdrop-filter: blur(30px);
    background-color: rgba(37, 49, 55, 0.4);
    box-shadow: 1px 4px 9px -1px rgba(0,0,0,0.2);
}
</style>