
import {is_weixin} from './device'

export const setWechatTitle = (title) => {
  if(is_weixin()) {
    setTimeout(function () {
      //利用iframe的onload事件刷新页面
      document.title = title;
      var iframe = document.createElement('iframe');
      // iframe.style.visibility = 'hidden';
      iframe.src = '/static/logo.png';
      iframe.style.display = 'none';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.onload = function () {
        setTimeout(function () {
          document.body.removeChild(iframe);
        }, 0);
      };
      document.body.appendChild(iframe);
    }, 0);
  }
}
