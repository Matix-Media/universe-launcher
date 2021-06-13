<template>
    <div class="account">
        <div class="info">
            <img :src="'https://crafatar.com/avatars/' + uuid + '?size=32&overlay'" alt="">
            <div class="details">
                <div class="first-line">
                    <p class="username">{{username}}</p>
                    <span class="default" :class="{enabled: $api.defaultAccount == id}">default</span>
                </div>
                <p class="second-line">
                    {{microsoft ? "Microsoft" : "Mojang"}}
                </p>
            </div>
        </div>
        <div class="remove-button" :class="{removing: removing}" @click="remove()">
            <i class="fas fa-times" v-if="!removing"></i>
            <i class="fas fa-circle-notch fa-spin" v-if="removing"></i>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "Account",
    props: {
        microsoft: Boolean,
        username: String,
        uuid: String,
        id: String
    },
    data() {
        return {
            removing: false
        }
    },
    methods: {
        async remove() {
            if (this.removing) return;

            this.removing = true;
            try {
                await this.$api.removeProfile(this.id);
                this.$emit("removed");
            } catch (err) {
                //
            }
        }
    }
}
</script>

<style scoped>
div.account {
    display: flex;
    width: 100%;
    align-items: center;
    padding-left: .7rem;
    transition: background .2s;
    box-sizing: border-box;
    justify-content: space-between;
}

div.account:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

div.info {
    display: flex;
    align-items: center;
}

img {
    width: 2rem;
    height: 2rem;
    margin-right: .7rem;
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

.username {
    font-size: 15px;
}

.default {
    display: none;
    background-color: rgb(39, 174, 96);
    margin-left: .7rem;
    border-radius: 4px;
    text-transform: uppercase;
    font-size: 9px;
    padding: 0.05rem .2rem;
}

.default.enabled {
    display: block;
}

.second-line {
    color: rgba(255, 255, 255, 0.25);
}

.remove-button {
    cursor: pointer;
    width: 3.5rem;
    height: 3.5rem;
    justify-self: flex-end;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.10);
    color: rgba(255, 255, 255, 0.15);
    opacity: 0;
    transition: opacity .2s, background-color .1s;
}

.account:hover .remove-button {
    opacity: 1;
}

.remove-button.removing {
    cursor: default;
    opacity: 1;
    background-color: rgba(139, 139, 139, 0.5);
    font-size: 1.2rem;
}
</style>