import {AppleChecking} from '@/services/config'
// import {Toast} from 'vux'
import store from '../store'
export default {
  install(Vue, options) {
    Vue.prototype.utils = {
      // 判断是否是用于苹果审核
      isAppleCheck: () => {
        return AppleChecking;
      },
      // 判断是否是微信
      is_weixin: () => {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          return true;
        } else {
          return false;
        }
      },

      // vux Toast统一管理显示控制
      toast: (options) => {
        // let toastTpl = Vue.extend({
        //     template: <toast v-model="toastFlag" type="text">{{toastText}}</toast>
        // })
        store.dispatch('showVuxToast', {
          msg: options.msg,
          display: true,
          timeout: options.timeout ? options.timeout : 2000,
          type: options.type ? options.type : 'text',
        })
      },
      showNetError: () => {
        alert('网络连接失败，请检查网络设置后再试试~')
      }
    }
  }
}
