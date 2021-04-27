import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            redirect: "/home",
        },
        {
            path: "/home",
            name: "home",
            component: Home,
        },
        {
            path: "/library",
            name: "library",
            component: () => import("./views/Library.vue"),
        },
        {
            path: "/library/:id",
            name: "modpack",
            component: () => import("./views/Modpack.vue"),
        },
        {
            path: "/discover",
            name: "discover",
            component: () => import("./views/Discover.vue"),
        },
        {
            path: "/discover/:id",
            name: "modpack",
            component: () => import("./views/Modpack.vue"),
        },
        {
            path: "/settings",
            name: "settings",
            component: () => import("./views/Settings.vue"),
        },
        {
            path: "/play",
            name: "play",
            component: () => import("./views/Play.vue"),
        },
    ],
});
