<template>
    <div class="session">
        <div class="info">
            <img :src="icon" alt="">
            <div class="details">
                <div class="first-line">
                    <p class="name">{{name}}</p>
                    <span class="active" :class="{enabled: this.active}">Active</span>
                </div>
                <p class="second-line">
                    {{username}} &mdash; {{email}}
                </p>
            </div>
        </div>
        <div class="time">
            <p>
                {{length}}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: "Session",
    props: {
        name: String,
        icon: String,
        active: Boolean,
        username: String,
        email: String,
        length: String
    }
}
</script>

<style scoped>
div.session {
    display: flex;
    width: 100%;
    align-items: center;
    padding-left: .7rem;
    transition: background .2s;
    box-sizing: border-box;
    justify-content: space-between;
}

div.session:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

img {
    width: 2rem;
    height: 2rem;
    margin-right: .7rem;
}

div.info {
    display: flex;
    align-items: center;
}

.name {
    font-size: 15px;
}

.details {
    display: flex;
    flex-direction: column;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.75);
}

.first-line {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
}

.active {
    display: none;
    background-color: rgb(39, 174, 96);
    margin-left: .7rem;
    border-radius: 4px;
    text-transform: uppercase;
    font-size: 9px;
    padding: 0.05rem .2rem;
}

.active.enabled {
    display: block;
}

.second-line {
    color: rgba(255, 255, 255, 0.25);
}

.time {
    height: 3.5rem;
    justify-self: flex-end;
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.15);
    font-size: 15px;
    padding-right: 1rem;
}
</style>