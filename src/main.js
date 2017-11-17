// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import FastClick from 'fastclick'
// import store from './store'

// 兼容低版本浏览器(caniuse)
require('es6-promise').polyfill()
Vue.config.productionTip = false

// 添加Fastclick移除移动端点击延迟
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body)
  }, false)
}

// vvv muse-ui 按需使用組件
// import 'muse-components/styles/base.less'
// import appBar from 'muse-components/appBar'
// ^^^
// vvv muse-ui全部加載
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import Icon from 'vue-svg-icon/Icon.vue'
Vue.use(MuseUI)
Vue.component('icon', Icon)
// ^^^

//
// Vue.use(VueRouter)
// const router = new VueRouter({
//   routes,
//   mode: routerMode,
//   strict: process.env.NODE_ENV !== 'production',
//   scrollBehavior (to, from, savedPosition) {
//     if (savedPosition) {
//       return savedPosition
//     } else {
//       if (from.meta.keepAlive) {
//         from.meta.savedPosition = document.body.scrollTop;
//       }
//       return { x: 0, y: to.meta.savedPosition ||0}
//     }
//   }
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
