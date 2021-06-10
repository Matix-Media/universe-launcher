<template>
    <div class="play">
        <full-list title="Accounts" class="accounts" :padding="0">
            <div class="accounts-list">
                <account username="MindOfMatix" email="example@gmail.com" :microsoft="false" :default="true" />
                <account username="TheSecondAnton" email="example@web.de" :microsoft="true" :default="false" />
            </div>
        </full-list>
        <full-list title="Sessions" class="sessions" :padding="0">
            <div class="sessions-list">
                <session 
                    v-for="(session, i) in $api.sessions" :key="i" 
                    :name="session.name" 
                    :icon="session.cover" 
                    :username="session.username" 
                    :email="session.email"
                    :active="session.ended ? false : true"
                    :length="session.ended ? millisecondsToStr(new Date(session.ended) - new Date(session.started)) : millisecondsToStr(new Date() - new Date(session.started))"
                />
                <session name="Survival Default Kit" icon="https://imgur.com/eiuJs3z.png" :active="true" username="MindOfMatix" email="example@gmail.com" length="10 min" />
            </div>
        </full-list>
    </div>
</template>

<script>
import FullList from '../components/FullList.vue';
import Account from '../components/Play/Account.vue';
import Session from '../components/Play/Session.vue';

export default {
    name: "Play",
    components: {FullList, Account, Session},
    mounted() {
        new Date() - (new Date() - new Date());
    },
    methods: {
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
    height: 14rem;
    overflow-y: auto;
}

div.full-list .content {
    padding: 0;
}

.sessions {
    flex: 1;
}
</style>