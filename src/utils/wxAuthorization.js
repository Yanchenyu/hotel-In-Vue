import {getTicket, genJsSignature} from '@/services/axiosapi'
import {storeSet, storeGet} from '@/utils/localStorage'

export const checkJsAccessTokenValid = () => {
  var gAccesstoken = getParameter('GlobalAccesstoken');
  var TokenExpireTime = getParameter('GTokenExpireTime');

  // 需要判断Gtoken是否有值,和是否过期

  if (!TokenExpireTime) { // 没有缓存, 直接获取token和有效期并保存
    getJsAccessToken();
  } else {
    // 有缓存，判断是否过期(快过期)
    var currentTime = new Date().getTime();
    currentTime = parseInt(currentTime / 1000); // 时间单位由毫秒统一为秒

    if (currentTime > TokenExpireTime) {
      getJsAccessToken();
    }
    else {
      // 还能用, 提供令牌以便需要时换取ticket （需要检查，确保ticket获取成功，因判断条件单一，只有currentTime > TokenExpireTime）
      checkJsApiTicketValid(gAccesstoken);
    }
  }
};

// 获取全局唯一令牌到localStorage，有效期2小时
function getJsAccessToken() {

  // getAccessToken('').then(response => {
  //     if(response.data){
  //         var res = JSON.parse(response.data.Data);
  //         if (!res.errcode) {
  //             // 成功捞取到信息
  //             //console.log(res);
  //             var expireTime = new Date().getTime();
  //             expireTime = parseInt(expireTime / 1000) + res.expires_in - 400; // 单位-秒 (+7200-400)


  //             storeSet('Wx_CommonStore', 'GlobalAccesstoken', res.access_token);
  //             storeSet('Wx_CommonStore', 'GTokenExpireTime', expireTime);

  //             // 提供令牌以便需要时换取ticket
  //             checkJsApiTicketValid(res.access_token);
  //         } else {
  //         }
  //     }
  // })
};

// 检查ApiTicket是否可用
function checkJsApiTicketValid(acToken) {
  var jsApiTicket = getParameter('JsApiTicket');
  var apiTicketExpireTime = getParameter('TicketExpireTime');


  if (!apiTicketExpireTime) {   // 没有缓存, 拉取ticket和有效期并保存
    getJsApiTicket(acToken);
  } else {
    // 有缓存，判断是否过期(快过期)

    var currentTime = new Date().getTime();
    currentTime = parseInt(currentTime / 1000); // 时间单位由毫秒统一为秒

    if (currentTime > apiTicketExpireTime) {    // 过期
      getJsApiTicket(acToken);
    } else {    // 未过期，ticket可直接用， 生成签名算法
      jsGenerateSignPackage(jsApiTicket);
    }
  }


}

// 使用accessToken, 换取JS-SDK的jsApiTicket
function getJsApiTicket(aToken) {
  let option = {accessToken: aToken}
  getTicket(option).then(response => {
    if (response.data) {
      var res = JSON.parse(response.data.Data);
      if (!res.errcode) {
        // 成功捞取到用户的信息

        // 设置
        var expireTime = new Date().getTime();
        expireTime = parseInt(expireTime / 1000) + res.expires_in - 400; // 单位-秒 (+7200-400)
        storeSet('Wx_CommonStore', 'JsApiTicket', res.ticket);
        storeSet('Wx_CommonStore', 'TicketExpireTime', expireTime);

        // 使用ticket + 时间戳 + 16位随机字符，配置文档
        jsGenerateSignPackage(res.ticket);
      } else {
      }
    }
  })
}

// 生产签名算法
function jsGenerateSignPackage(apiTicket) {
  var timeStamp = new Date().getTime();
  timeStamp = parseInt(timeStamp / 1000);
  var ourl = decodeURIComponent(location.href);
  var sUrl = ourl.split('#')[0];
  var option = {signTime: timeStamp, signTicket: apiTicket, signUrl: encodeURIComponent(sUrl)};

  genJsSignature(option).then(response => {
    if (response.data) {
      // 当直接返回string，而非JSON数组时，不可用JSON.parse
      var res = JSON.parse(response.data.Data);
      // 将timestamp,nonceStr,signature缓存进LocalStorage
      storeSet('Wx_CommonStore', 'sign_timestamp', res.signTime);
      storeSet('Wx_CommonStore', 'sign_nonceStr', res.randstr);
      storeSet('Wx_CommonStore', 'sign_signature', res.signature);
      storeSet('Wx_CommonStore', 'sign_appId', res.appid);
      //weixinGenConfig();
    }

  })
}

function getParameter(para, callback) {
  var res = getUrlParam(para);
  if (res) {
    storeSet('Wx_CommonStore', para, res);
    return res;
  }
  var value = storeGet('Wx_CommonStore', para);
  if (!value && callback) {
    return callback();
  }
  return value ? value : "";
};

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
