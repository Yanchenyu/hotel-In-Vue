// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import FastClick from 'fastclick'
import store from './store'
//视频播放插件
import VueVideoPlayer from 'vue-video-player'
import Icon from 'vue-svg-icon/Icon.vue'      // a solution for multicolor svg icons in vue2
// mount with global
Vue.use(VueVideoPlayer)
// // If used in Nuxt.js/SSR, you should keep it only in browser build environment
// if (process.BROWSER_BUILD) {
//   const VueVideoPlayer = require('vue-video-player/ssr')
//   Vue.use(VueVideoPlayer)
// }
// require('some-videojs-plugin')

// TODO 选定唯一插件后，删除其它部分
// 自定义常用插件
import utilplugin from '@/utils/utilplugin'

Vue.use(utilplugin)

Vue.component('icon', Icon)


// 兼容低版本浏览器(caniuse)
require('es6-promise').polyfill()

Vue.config.productionTip = false

// 添加Fastclick移除移动端点击延迟
FastClick.attach(document.body)



/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {App}
})
