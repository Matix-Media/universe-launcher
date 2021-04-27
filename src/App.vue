<template>
  <div id="app" :style="backgroundImage">

    <div class="wrapper">
      <Sidebar></Sidebar>
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'App',
  components: {
    Sidebar
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
      title: "Matix's Mod Installer - RN"
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
  background-color: rgb(38, 50, 56);
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

.tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  color: white;
  padding: .5rem 1rem .5rem;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
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
