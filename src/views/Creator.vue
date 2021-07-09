<template>
    <div class="creator" :class="{loaded: isLoaded}">
        <div class="creator-loading">
            <div class="box">
                <div class="logo">
                    <img src="@/assets/images/branding/icon.svg" class="icon" style="width:5rem;" alt="">
                    <div class="text">
                        <h1>Creator</h1>
                        <p>is loading...</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="creator-loaded">
            <router-view v-if="isLoaded" />
        </div>
    </div>
</template>

<script>
export default {
    name: "Creator",
    data() {
        return {
            isLoaded: false,
        }
    },
    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {
                this.isLoaded = true;
            }, 1000);
        });
    }
}
</script>

<style scoped>

.creator-loaded {
    visibility: hidden;
    opacity: 0;
    transition: opacity .5s;
}

.creator.loaded .creator-loaded {
    opacity: 1;
    visibility: visible;
}

.creator.loaded .creator-loading {
    display: none;
}

.creator-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.creator-loading .box {
    background-color: rgba(37, 49, 55, 0.5);
    box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.03);
    backdrop-filter: blur(15px);
    padding: 1rem 1.5rem;
    border-radius: 8px;
}

.creator-loading .box .logo {
    display: flex;

    animation-name: breathing;
    animation-duration: 2s;
    animation-iteration-count: infinite;
}

.creator-loading .box .logo .icon {
    margin-right: 1rem;

    animation-name: spinning;
    animation-duration: 3s;
    animation-iteration-count: infinite;
}

.creator-loading .box .logo .text h1 {
    font-size: 3rem;
    font-weight: 800;
    text-transform: uppercase;
}

.creator-loading .box .logo .text p {
    font-size: 1rem;
    font-weight: 300;
    margin-top: -.5rem;
}

@keyframes breathing {
    0% {
        opacity: 1;
    }

    50% {
        opacity: .8;
    }

    100% {
        opacity: 1;
    }
}

@keyframes spinning {
    0% {
        transform: rotate(0deg);
    }
    20% {
        transform: rotate(360deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>