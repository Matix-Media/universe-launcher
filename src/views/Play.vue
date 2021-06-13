<template>
    <div class="play">
        <full-list title="Accounts" class="accounts" :padding="0">
            <div class="accounts-list">
                <account 
                    v-for="(profile, i) in $api.accounts" :key="i" 
                    :username="profile.username"
                    :uuid="profile.UUID"
                    :microsoft="profile.type == 'Xbox'"
                    :id="profile.id"
                    @removed="$forceUpdate()"
                />
                <div class="empty-list" v-if="Object.keys($api.accounts).length == 0">
                    <p>
                        You haven't added any accounts. Click on the plus to add one.
                    </p>
                </div>
            </div>
            <template v-slot:header>
                <button class="play-add-button" @click="addAccountInfo.isVisible = true"><i class="fas fa-plus"></i></button>
            </template>
        </full-list>
        <full-list title="Sessions" class="sessions" :padding="0">
            <div class="sessions-list">
                <session 
                    v-for="(session, i) in $api.sessions" :key="i" 
                    :name="session.name" 
                    :icon="session.cover" 
                    :username="session.username"
                    :active="session.ended ? false : true"
                    :length="session.ended ? millisecondsToStr(new Date(session.ended) - new Date(session.started)) : millisecondsToStr(new Date() - new Date(session.started))"
                />
                <div class="empty-list" v-if="$api.sessions.length == 0">
                    <p>
                        You haven't played a modpack yet. Play a modpack to see some sessions in here.
                    </p>
                </div>
            </div>
        </full-list>
        <add-profile-wrapper 
            :visible="addAccountInfo.isVisible" 
            @cancel="addAccountInfo.isVisible = false"
            @loggedIn="addAccountInfo.isVisible = false;"
        />
    </div>
</template>

<script>
import FullList from '../components/FullList.vue';
import Account from '../components/Play/Account.vue';
import Session from '../components/Play/Session.vue';
import AddProfileWrapper from "../components/AddProfileWrapper.vue";

export default {
    name: "Play",
    components: {FullList, Account, Session, AddProfileWrapper},
    data() {
        return {
            addAccountInfo: {
                isVisible: false
            }
        }
    },
    methods: {
        async addAccount() {
            this.addAccountInfo.isVisible = true;
        },
        millisecondsToStr (milliseconds) {
            // TIP: to find current time in milliseconds, use:
            // var  current_time_milliseconds = new Date().getTime();

            function numberEnding (number) {
                return (number > 1) ? 's' : '';
            }

            var temp = Math.floor(milliseconds / 1000);
            var years = Math.floor(temp / 31536000);
            if (years) {
                return years + ' year' + numberEnding(years);
            }
            var days = Math.floor((temp %= 31536000) / 86400);
            if (days) {
                return days + ' day' + numberEnding(days);
            }
            var hours = Math.floor((temp %= 86400) / 3600);
            if (hours) {
                return hours + ' hour' + numberEnding(hours);
            }
            var minutes = Math.floor((temp %= 3600) / 60);
            if (minutes) {
                return minutes + ' min';
            }
            var seconds = temp % 60;
            if (seconds) {
                return seconds + ' sec';
            }
            return 'now'; //'just now' //or other string you like;
        }
    }
}
</script>

<style>

.empty-list {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}

.play-add-button {
    border: none;
    border-radius: 3px;
    background-color: rgba(255,255,255,0.2);
    color: rgba(255, 255, 255, 0.8);
    font-size: 10px;
    width: 1.3rem;
    height: 1.0rem;
    cursor: pointer;
    text-align: center;
    transition: background-color .2s;
    box-shadow: 1px 4px 10px -1px rgb(0 0 0 / 10%);
    backdrop-filter: blur(15px);
} 
.play-add-button:hover {
    background-color:rgba(255,255,255,0.3);
}
</style>

<style scoped>
div.play {
    padding: 3rem;
    display: flex;
    flex-direction: row;
}

.accounts {
    flex: 1;
    margin-right: 4rem;
}

.accounts-list, .sessions-list {
    height: max(14rem, 35vh);
    overflow-y: auto;
}

div.full-list .content {
    padding: 0;
}

.sessions {
    flex: 1;
}
</style>