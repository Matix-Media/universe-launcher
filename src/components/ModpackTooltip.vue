<template>
    <div class="modpack-tooltip">
        <div class="content">
            <p class="title">{{ modpack.name }}</p>
            <div class="banner" :style="{backgroundImage: 'url(\'' +modpack.banner + '\''}">
                <img class="logo" :src="modpack.logo" alt="">
            </div>
        </div>

        <div class="bg" :style="{backgroundImage: 'url(\'' +modpack.banner + '\''}" />
    </div>
</template>

<script>
export default {
    name: "ModpackTooltip",
    props: {
        modpack: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>
.modpack-tooltip {
    width: 14rem;
}

.bg {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;

    background-color: rgba(37, 49, 55, 1);
    background-size: cover;
    background-position: center;
    margin: -30px;
    filter: blur(30px);

    z-index: 1;
}

.content {
    position: relative;
    z-index: 2;
}

.title {
    font-size: .85rem;
    font-weight: 300;
    padding: .8rem;
    background-color: rgba(37, 49, 55, 0.4);
}

.banner {
    width: 100%;
    height: 5rem;
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo {
    max-height: 3rem;
    max-width: 10rem;
}
</style>