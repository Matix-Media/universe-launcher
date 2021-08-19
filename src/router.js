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
            alias: "/discover/:id",
            component: () => import("./views/Modpack.vue"),
            children: [
                {
                    path: "",
                    alias: "overview",
                    name: "modpack-overview",
                    component: () => import("./views/Modpack/Overview.vue"),
                },
                {
                    path: "mods",
                    name: "modpack-mods",
                    component: () => import("./views/Modpack/Mods.vue"),
                },
                {
                    path: "news",
                    name: "modpack-news",
                    component: () => import("./views/Modpack/News.vue"),
                },
                {
                    path: "comments",
                    name: "modpack-comments",
                    component: () => import("./views/Modpack/Comments.vue"),
                },
            ],
        },
        {
            path: "/discover",
            name: "discover",
            component: () => import("./views/Discover.vue"),
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
        {
            path: "/creator",
            component: () => import("./views/Creator.vue"),
            children: [
                {
                    path: "",
                    name: "creator",
                    component: () => import("./views/Creator/Home.vue"),
                },

                {
                    path: "new",
                    name: "creator-new",
                    component: () => import("./views/Creator/New.vue"),
                },
                {
                    path: "new/import",
                    name: "creator-import",
                    component: () => import("./views/Creator/Import.vue"),
                },
                {
                    path: "new/clone",
                    name: "creator-clone",
                    component: () => import("./views/Creator/Clone.vue"),
                },
                {
                    path: "editor",
                    name: "creator-editor",
                    component: () => import("./views/Creator/Editor.vue")
                }
            ],
        },
    ],
});
