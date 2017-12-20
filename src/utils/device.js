/**
 * 判断浏览环境是否处于微信之中
 */
// import {titleContent} from '@/utils/headerTitle'
// import {tabShowRoute} from '@/utils/tabRule'
// import _ from 'lodash'


export const is_weixin = () => {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    return false;
  }
}

export const viewportHeight = () => {
  return Math.max(window.innerHeight, document.documentElement.clientHeight, document.body.clientHeight, 0)
}

// function xheadShow(routeName) {
//     //微信浏览器隐藏导航栏
//     if (is_weixin() || !titleContent.hasOwnProperty(routeName)){
//         return false
//     } else {
//         return true  
//     }
// }
// function isTabHide(routeName) {
//     return _.indexOf(tabShowRoute,routeName) == -1;
// }

// export const layoutHeight = () => {

// }
