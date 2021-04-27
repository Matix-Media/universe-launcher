<template>
    <div class="play">
        <full-list title="Accounts" class="accounts" :padding="0">
            <div class="accounts-list">
                <account username="MindOfMatix" email="account.raketengamelp@web.de" :microsoft="false" :default="true" />
                <account username="TheSecondAnton" email="matix.skype@web.de" :microsoft="true" :default="false" />
            </div>
        </full-list>
        <full-list title="Sessions" class="sessions" :padding="0">
            <div class="sessions-list">
                <session name="Survival Default Kit" icon="https://imgur.com/eiuJs3z.png" :active="true" username="MindOfMatix" email="account.raketengamelp@web.de" length="10 min" />
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
    components: {FullList, Account, Session}
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