import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueLuxon from "vue-luxon";
import VueMeta from "vue-meta";
import API from "./classes/API";
const remote = require("electron").remote;

Vue.use(VueLuxon, {
    output: {
        locale: "en-US",
    },
});

Vue.use(VueMeta);

Vue.config.productionTip = false;

Vue.prototype.$api = new API();

new Vue({
    router,
    render: (h) => h(App),
    data: {
        newsPopup: {
            visible: false,
            loading: false,
            error: {
                error: false,
                message: "",
            },
            news: {
                title: "",
                content: "",
                modpack: {
                    ID: -1,
                    icon: "",
                    name: "",
                },
            },
        },
    },
    methods: {
        exitApp() {
            remote.getCurrentWindow().close();
        },
        async showNews(id) {
            if (this.$root.newsPopup.loading) return;

            this.$root.newsPopup.loading = true;
            this.$root.newsPopup.visible = true;
            try {
                const res = await this.$api.getNewsArticle(id);

                this.$root.newsPopup.news = res;
                this.$root.newsPopup.loading = false;

                console.log("Loaded news article " + id);
            } catch (err) {
                var err_message = "Error loading news article: " + err;
                if (err === false) {
                    err_message = "This article does not exist.";
                }
                console.log("Error loading news article " + id + ": " + err_message);
                this.$root.newsPopup.visible = false;
                this.$root.newsPopup.error.message = err_message;
                this.$root.newsPopup.error.error = true;
                this.$root.newsPopup.loading = false;
            }
        },
    },
}).$mount("#app");
