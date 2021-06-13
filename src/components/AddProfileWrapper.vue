<template>
    <modal 
        v-if="visible"
        title="Add Account" :closeable="true"
        width="20rem"
        @close="cancel()"
        :height-animation="true"
        :content-style="contentStyle"
    >
        <add-profile v-model="accountData" 
        @loggedIn="cascade" />
    </modal>
</template>

<script>
import Modal from '../components/Modal.vue';
import AddProfile from '../components/AddProfile.vue';

export default {
    name: "AddProfileWrapper",
    components: {Modal, AddProfile},
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            loggingIn: false,
            accountData: {}
        }
    },
    computed: {
        contentStyle() {
            if (!this.accountData.accountType && this.accountData.accountType == "mojang") {
                return {paddingBottom: 0};
            }
            return {};
        }
    },
    methods: {
        cascade(result) {
            this.$emit("loggedIn", result);
        },
        cancel() {
            this.accountData.accountType = null;
            this.$emit("cancel");
        }
    }
}
</script>

<style scoped>
</style>