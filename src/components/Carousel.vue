<template>
    <div class="carousel-view">
        <div class="list">
            <div
                v-for="(slide, i) in slides"
                class="list-element"
                :class="{active: currentIndex == i}"
                :key="i"
                @click="moveTo(i)"
            >
                <div class="modpack-cover" :style="{ backgroundImage: 'url(\'' + slide.icon + '\')' }">
                </div>
                <div class="info">
                    <p class="name">
                        {{slide.modpack}}
                    </p>
                    <p class="title">
                        {{slide.title}}
                    </p>
                </div>
            </div>
        </div>
        <transition-group
            class="carousel"
            tag="div"
        >
            <div
                v-for="(slide, i) in slides"
                class="slide"
                :class="{active: currentIndex == i}"
                :key="i"
                :style="{ backgroundImage: 'url(\'' + slide.banner + '\')' }"
            >
                <div class="infos">
                    <p class="category">{{slide.category}}</p>
                    <p class="text">{{slide.text}}</p>

                    <button @click="followTarget(i)">{{slide.button}}</button>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script>
export default {
    name: "Carousel",
    props: {
        slides: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            currentIndex: 0,
            timer: 0,
            isStopped: false
        }
    },
    created() {
        this.cycle();
    },
    methods: {
        followTarget(i) {
            this.$router.push(this.slides[i].target);
        },
        cycle() {
            if (this.isStopped) return;

            if (this.timer) clearInterval(this.timer);
            this.timer = setInterval(() => {
                if (this.currentIndex + 1 > this.slides.length - 1) {
                    this.currentIndex = 0;
                } else {
                    this.currentIndex ++;
                }
            }, 7000);
        },
        moveTo(index) {
            if (this.currentIndex == index) return;

            this.currentIndex = index;
            this.cycle();
        }
    }
}
</script>

<style scoped>
@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes slideIn {
    0% {
        transform: translateX(30%);
    }
    100% {
        transform: translateX(0);
    }
}

@keyframes moveRight {
    0% {
        width: 0;
    }
    100% {
        width: 100%;
    }
}

div.carousel-view {
    width: 100%;
    position: relative;
    padding-top: 40%;

    backdrop-filter: blur(15px);
    background-color: rgba(38, 50, 56, 0.6);
    
    border-radius: 4px;
}

div.list {
    border-radius: 0 4px 4px 0;
    position: absolute;
    top: 0;
    left: calc(82% - 4px);
    width: calc(18% + 4px);
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

div.list div.list-element {
    position: relative;
    flex: 1;
    display: flex;
    padding: 2% 0;
    padding-left: calc(2% + 4px);
    transition: background-color .2s ease-in-out;
    cursor: pointer;
    max-height: 20%;
}

div.list div.list-element * {
    cursor: pointer;
}

div.list div.list-element:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

div.list div.list-element.active {
    background-color: rgba(255, 255, 255, 0.05);
}

div.list div.list-element::after {
    z-index: -1;
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background-color: rgba(255, 255, 255, 0.6);
    opacity: 0;
    transition: opacity .2s ease-in-out;
}

div.list div.list-element.active::after {
    animation: moveRight 7s linear;
    animation-fill-mode: forwards;
    opacity: 1;
}

div.list div.list-element div.modpack-cover {
    box-sizing: border-box;
    border-radius: 4px;
    width: 30%;
    height: 100%;
    position: relative;
    background-color: rgba(255, 255, 255, 0.075);
    background-position: center;
    background-size: cover;
}

div.list div.list-element div.info {
    width: 60%;
    margin-top: 5%;
    margin-bottom: 5%;
    margin-left: 2%;
    max-height: 90%;
    height: 90%;
    overflow: hidden;
}

div.list div.list-element div.info p.name {
    font-weight: 300;
    font-size: .9rem;
    text-overflow: ellipsis;
    overflow: hidden; 
    white-space: nowrap;
}

div.list div.list-element div.info p.title {
    font-size: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    -webkit-box-orient: vertical;
}

div.carousel {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(82%);
    height: 100%;
    background-color: rgba(38, 50, 56, 1);
    box-shadow: 1px 4px 9px -1px rgba(0,0,0,0.2);
    border-radius: 4px;
    overflow: hidden;
}

div.slide {
    display: none;
    height: 100%;
    width: 100%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    align-items: flex-end;
    overflow: hidden;
}

div.slide::before {
    position: absolute;
    content: "";
    bottom: 0;
    left: 0;
    width: 100%;    
    height: 100%;
    background: radial-gradient(circle at bottom left, rgba(0,0,0,.8) 0%, rgba(255,255,255,0) 40%);
}

div.slide.active {
    display: flex;
    animation: fadeIn ease-in-out .5s;
}

div.slide div.infos {
    z-index: 1;
    padding-left: 5%;
    padding-bottom: 5%;
    width: 40rem;
}

div.slide div.infos * {
}

div.slide.active div.infos * {
    animation: slideIn ease-in-out .2s;
}

div.slide.active div.infos button {
    animation: slideIn ease-in-out .4s;
}

div.slide div.infos button {
    border: none;
    border-radius: 4px;
    padding: 1rem 4rem;
    color: white;
    background-color: rgba(53, 66, 75, .9);
    box-shadow: 1px 4px 15px -1px rgba(0,0,0, .3);
    cursor: pointer;
    backdrop-filter: blur(15px);
    font-family: 'Roboto';
    text-transform: uppercase;
    font-size: .8rem;
    font-weight: 300;
    transition: background-color .2s;
}

div.slide div.infos button:hover {
    background-color: rgba(53, 66, 75, 0.6);
}

div.slide div.infos p.text {
    margin-bottom: 2rem;
    font-size: 1.2rem;
    line-height: 2rem;
    font-weight: 300;
    width: 50%;
}

div.slide div.infos p.category {
    color: rgba(255, 255, 255, 0.8);
    text-transform: uppercase;
    margin-bottom: 1rem;
    font-size: .9rem;
}

@media (max-width: 1380px) {
    div.list div.list-element div.info p.title {
        font-size: .8rem;
    }

    div.list div.list-element div.info p.name {
        font-size: .7rem;
    }

    div.slide div.infos p.text {
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }

    div.slide div.infos p.category {
        margin-bottom: .5rem;
        font-size: .8rem;
    }
}

@media (max-width: 1160px) {
    div.list div.list-element div.info {
        margin-top: 0;
    }
    div.list div.list-element div.info p.title {
        font-size: .7rem;
    }
    div.slide div.infos p.text {
        font-size: 1rem;
    }
    div.slide div.infos p.category {
        font-size: .7rem;
    }
    div.slide::before {
        background: radial-gradient(circle at bottom left, rgba(0,0,0,.8) 0%, rgba(255,255,255,0) 60%);
    }
}

</style>