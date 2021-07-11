<template>
  <div id="app" :style="backgroundImage">
    <div class="wrapper">
      <Sidebar v-if="ready"></Sidebar>
      <div>
        <transition name="fade" mode="out-in">
          <router-view v-if="ready" />
        </transition>
        <modal 
          v-if="$root.newsPopup.visible" 
          :title="$root.newsPopup.loading ? '' : $root.newsPopup.news.title" 
          width="60rem"
          :closeable="!$root.newsPopup.loading" 
          v-on:visitModpack="$router.push({name: 'modpack-overview', params: {id: $root.newsPopup.news.modpack.ID}});$root.newsPopup.visible = false"
          v-on:close="$root.newsPopup.visible = false"
        >
            <div class="skeleton-loader" v-show="$root.newsPopup.loading">
              <div class="sk-bg" style="width:20rem;height:1rem;margin-bottom:.5rem;"></div>
              <div class="sk-bg" style="width:23rem;height:1rem;margin-bottom:.5rem;"></div>
              <div class="sk-bg" style="width:13rem;height:1rem;margin-bottom:2rem;"></div>
              <div class="sk-bg" style="width:18rem;height:1rem;margin-bottom:1rem;"></div>
              <div class="sk-bg" style="width:25rem;height:1rem;margin-bottom:1rem;"></div>
            </div>
            <markdown-it-vue 
              v-show="!$root.newsPopup.loading" 
              class="markdown-content" 
              :content="$root.newsPopup.news.content" 
              style="margin: 1rem .5rem;" 
              :options="MarkdownOptions" 
            />
            <template v-slot:header>
              <div class="skeleton-loader" v-show="$root.newsPopup.loading">
                <div class="sk-bg" style="width:10rem;height:1rem;"></div>
              </div>
              <div 
                class="modpack-badge" 
                v-if="!$root.newsPopup.loading" 
                v-on:click="$router.push({name: 'modpack-overview', params: {id: $root.newsPopup.news.modpack.ID}});$root.newsPopup.visible = false"
              >
                <div :style="{backgroundImage: 'url(\'' + $root.newsPopup.news.modpack.icon + '\')'}" alt="" class="icon"></div>
                <p class="article">{{$root.newsPopup.news.modpack.name}}</p>
              </div>
            </template>
        </modal>
        <modal
          v-if="$root.newsPopup.error.error"
          title="Error"
          width="20rem"
          :closeable="true"
          :buttons="[{text: 'OK', emit: 'close'}]"
          v-on:close="$root.newsPopup.error.error = false"
        >
          <p>{{$root.newsPopup.error.message}}</p>
        </modal>
      </div>
    </div>
    <splash v-if="loading" v-on:done="loading=false" v-on:loaded="ready=true" />
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import Splash from "./views/Splash.vue"
import Modal from "./components/Modal.vue"
import MarkdownItVue from "markdown-it-vue"
import MarkdownOptions from "./classes/markdownOptions"

export default {
  name: 'App',
  components: {
    Sidebar,
    Splash,
    Modal,
    MarkdownItVue
  },
  created() {
    Array.prototype.remove = function() {
      var what, a = arguments, L = a.length, ax;
      while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
          this.splice(ax, 1);
        }
      }
      return this;
    };
  },
  data() {
    return {
      loading: true,
      ready: false,
      MarkdownOptions: MarkdownOptions
    }
  },
  computed: {
    backgroundImage() {
      var images = [
        "background-1.jpg",
        "background-2.jpg",
        "background-3.jpg",
        "background-4.jpg",
        "background-5.jpg",
      ];
      var image = images[Math.floor(Math.random()*images.length)];
      var path = require('./assets/images/backgrounds/' + image);
      return "background-image: url('" + path + "');";
    }
  },
  metaInfo() {
    return {
      title: "UNIVERSE Launcher"
    }
  }
}
</script>

<style>
@font-face {
  font-family: "Roboto";
  src: url("./assets/fonts/Roboto/Roboto-Black.ttf");
  font-weight: 900;
  font-style: normal;
}

@font-face {
  font-family: "Roboto";
  src: url("./assets/fonts/Roboto/Roboto-Bold.ttf");
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: "Roboto";
  src: url("./assets/fonts/Roboto/Roboto-Medium.ttf");
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: "Roboto";
  src: url("./assets/fonts/Roboto/Roboto-Regular.ttf");
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: "Roboto";
  src: url("./assets/fonts/Roboto/Roboto-Light.ttf");
  font-weight: 300;
  font-style: normal;
}


@font-face {
  font-family: "Roboto";
  src: url("./assets/fonts/Roboto/Roboto-Thin.ttf");
  font-weight: 100;
  font-style: normal;
}

html {
  scrollbar-face-color: transparent;
  scrollbar-base-color: transparent;
  scrollbar-3dlight-color: transparent;
  scrollbar-highlight-color: transparent;
  scrollbar-track-color: transparent;
  scrollbar-arrow-color: transparent;
  scrollbar-shadow-color: transparent;
  scrollbar-dark-shadow-color: transparent;
  overflow: overlay;
}
/*  #64646434 **/
::-webkit-scrollbar { width: 8px; height: 6px;}
::-webkit-scrollbar-button {  background-color: transparent; display: none;}
::-webkit-scrollbar-track {  background-color:transparent;}
::-webkit-scrollbar-track-piece { background-color:transparent}
::-webkit-scrollbar-thumb { height: 50px; background-color: rgba(255, 255, 255, 0.2); border-radius: 3px;}
::-webkit-scrollbar-corner { background-color: transparent;}
::-webkit-resizer { background-color: transparent;}

body {
  font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
}

#app {
  font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
  font-size: 12px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #263238;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  min-height: 100vh;
  min-width: 100%;
  color: white;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  transition: backgrounde 1s;
}

.markdown-content {
    font-weight: 300;
    font-size: .9rem;
    overflow: hidden;
}

.markdown-content a:link,
.markdown-content a:visited {
    color: rgb(132, 185, 235);
    font-weight: 500;
    text-decoration: none;
}

.markdown-content a:link:hover,
.markdown-content a:visited:hover {
    text-decoration: underline;
}

div.skeleton-loader .sk {
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.10);
}

div.skeleton-loader .sk-bg {
    background-color: rgba(47, 54, 61, 0.80);
    backdrop-filter: blur(15px);
    border-radius: 8px;
    overflow: hidden;
}

div.skeleton-loader .sk-bg::after {
    content: "";
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(90deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0) 60%);
    background-position: -150% 0;
    background-size: 90% 100%;
    background-repeat: no-repeat;
    animation: sk-moving 2s infinite;
}

@keyframes sk-moving {
    from {
        background-position: -650% 0;
    }
    to {
        background-position: 650% 0;
    }
}

@keyframes breathing {
    0% {
        opacity: 1;
    }

    50% {
        opacity: .8;
    }

    100% {
        opacity: 1;
    }
}

@keyframes spinning {
    0% {
        transform: rotate(0deg);
    }
    20% {
        transform: rotate(360deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

h1, h2, h3, h4, h5, h6, a, p {
  margin: 0;
  cursor: default;
}

*, *::after, *::before {
  -webkit-user-select: none;
  -webkit-user-drag: none;
  -webkit-app-region: no-drag;
  outline: none;
}

input {
  font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
  font-size: 12px;
}

h3 {
    display: flex;
    align-items: center;
    text-transform: uppercase;
    font-weight: 300;
    color: white;
    font-size: 1.1rem;
}

h3:after {
    content: '';
    border-top: 1px solid rgba(255, 255, 255, 0.13);
    margin-left: 1rem;
    flex: 1 0 20px;
}

h4 {
    display: flex;
    align-items: center;
    text-transform: uppercase;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.75);
    font-size: .95rem;
}

h4:after {
    content: '';
    border-top: 1px solid rgba(69, 90, 100, 0.65);
    margin-left: 1rem;
    flex: 1 0 20px;
}

a {
  cursor: pointer;
}


div.modpack-badge {
    display: inline-flex;
    align-items: center;
    background-color: rgba(38, 50, 56, 0.19);
    width: auto;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color .2s;
}

div.modpack-badge:hover {
    background-color: rgba(236, 239, 241, 0.19);
}

div.modpack-badge div.icon {
    width: 23px;
    height: 23px;
    background-size: cover;
    background-position: center;
    border-radius: 4px;
    background-color: rgba(55, 71, 79, 0.25);
    margin-right: .2rem;
}

div.modpack-badge p {
    font-weight: 300;
    color: rgba(255, 255, 255, 0.4);
    margin-right: .4rem;
    cursor: pointer;
    font-size: .8rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

div.wrapper {
  overflow: auto;
  background: rgba(38, 50, 56, 0.9);
  box-sizing: border-box;
  padding-left: calc(40px + 2rem);
  min-height: 100vh;
  min-width: 100%;
}

div.sidebar {
  height: 100%;
  position: fixed;
  top: 0;
  left: 0
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .05s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}


</style>