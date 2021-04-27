import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueLuxon from "vue-luxon";
import VueMeta from "vue-meta";

const VueTitlebar = require("@wuild/vue-titlebar");

Vue.use(VueTitlebar);

Vue.use(VueLuxon, {
    output: {
        locale: "en-US",
    },
});

Vue.use(VueMeta);

Vue.config.productionTip = false;

new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");
