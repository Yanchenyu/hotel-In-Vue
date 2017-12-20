<template>
  <div class="contentWrap cus-flexcolumn-center">
    <div class="cus-giant">好想住</div>
    <div class="cus-h1">
      <span>居智慧</span>
      <span>住天下</span>
    </div>
  </div>
</template>

<script>
  import {storeSet, storeGet} from '@/utils/localStorage'
  import {CheckUnionIDExist, middleServiceGetOpenID, middleServiceGetUserInfoByOpenId} from '@/services/axiosapi'
  import {AppIdList} from '@/services/config'
  // 微信授权过渡页面
  // 参考 - https://segmentfault.com/a/1190000009493199?_ea=1968346

  export default {
    name: 'wxAuth',
    created() {
      this.dataInitial();
      this.handleWxAuthCode();
    },
    data() {
      return {
        platId: "",     // 获取换成平台id信息, 默认为空
        openidKey: "openid"   // 微信openid 键值, 默认为openid
      }
    },
    methods: {
      // 数据初始化
      dataInitial(){
        // 根据不同平台来源，使用不同openid
        this.platId = storeGet('SH_CommonStore', 'PlatId') ? storeGet('SH_CommonStore', 'PlatId'):"";
        if (this.platId) {
          this.openidKey = `openid_${this.platId}`;
        }
      },
      // wx网页授权code处理
      handleWxAuthCode() {
        var codeidx = location.href.indexOf('?code=');      // 普通情况
        codeidx = (codeidx != -1) ? codeidx : location.href.indexOf('&code=');  // 微信消息模板转发后的情形

        if (codeidx != -1) {
          let code = location.href.slice(codeidx).split(/\?|=|&|#/)[2]
          console.log('code:', code)
          console.log('wxAuth code case:', this.platId)
          this.getOpenID(code, this.platId)

        } else {
          console.log('this.platId:',this.platId)
          if (storeGet('SH_wxAuth', this.openidKey)) {
            console.log('has openid',this.openidKey)
          } else {
            console.log('no openid',this.openidKey)
            // 数据没有缓存openid，需要请求授权
            this.applyweixinOAuth()
          }
        }
      },

      // 跳转至进入授权页面之前的初始页面
      redirect_beforeloginurl() {
        var beforeLoginUrl = storeGet('SH_CommonStore', 'beforeloginUrl');
        location.href = beforeLoginUrl
      },

      // 请求微信授权
      applyweixinOAuth() {
        var redirect_uri = encodeURI(location.href);
        // 微信授权redirect_uri路径中不能带有#， 所以临时去除
        // TODO 后续需要更改路由模式为abstract或者其他解决方案
        let hashIdx = redirect_uri.indexOf('#')
        if (hashIdx > -1) {
          redirect_uri = redirect_uri.slice(0, hashIdx)
        }

        // 根据不同平台来源，调用appid对应微信授权
        let appid = '';
        if (this.platId && AppIdList.hasOwnProperty(this.platId) ){
          appid = AppIdList[this.platId];
        } else {
          appid = AppIdList['thinkia']
        }
        location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      },


      // 请求用户openid和详细信息
      // 根据wxAuth拿到的Code，换取accessToken
      getOpenID(code, platId) {
        let option = {
          Code: code,
          platId: platId
        }
        middleServiceGetOpenID(option).then(response => {
          console.log('middelGetOpenID result:', response)
          if (response.data) {
            var res = JSON.parse(response.data.Data)
            console.log('getOpenID success:', this.openidKey)
            if (!res.errcode) {
              storeSet('SH_CommonStore', this.openidKey, res.openid);
              storeSet('SH_CommonStore', 'accesstoken', res.access_token);
              storeSet('SH_CommonStore', 'refreshtoken', res.refresh_token);

              // 根据code换取到的access_token拉取用户信息
              console.log("pull user info(code)");
              this.pullWeChatUserInfo(res.access_token, res.openid);

            } else {
              console.log(res.errcode)
            }
          }
        })
          .catch(err => {
            console.log(err)
          })
      },

      // 使用accessToken加openid获取用户信息
      pullWeChatUserInfo(aToken, openid) {
        console.log('pull user info')
        let option = {
          accessToken: aToken,
          openId: openid
        }
        var that = this;
        middleServiceGetUserInfoByOpenId(option).then(response => {
          // TODO 判断当前用户是否已登陆
          console.log(response)
          //if(手机号登陆 || checkMemberOpenId在User表中exist)
          // 谁的优先级更高的问题
          //else {
          //仅保存用户信息，用于显示
          // localStorage和Vuex都存起来
          // MemberCenter页加载显示时，会同步下localStorage数据到wxUserInfo中去
          // 然后在根据用户是否处于已经登陆状态，显示数据用户信息，or wx用户信息
          //@new：Member页判断时，先checkOpenId是否有关联的会员Id，有则自动登录，并显示对应数据库设定信息

          //@结论： 此处临时只要记录用户信息到localStorage和Vuex中去即可
          // TODO 后续考虑 Expire7200问题和 RefreshToken问题
          if (response.data) {
            var res = JSON.parse(response.data.Data);
            if (!res.errcode) {
              // 成功捞取到用户信息,缓存并设定到vuex中
              console.log('wxUserInfo', res)
              this.$store.dispatch('setwxAuthUserInfo', res)

              // 数据格式
              // city/country/headimgurl/nickname/openid/privilege{Array[]}/province/sex/unionid
              storeSet('SH_wxAuth', this.openidKey, res.openid);
              storeSet('SH_wxAuth', 'unionid', res.unionid);
              storeSet('SH_wxAuth', 'headimgurl', res.headimgurl);
              storeSet('SH_wxAuth', 'nickname', res.nickname);
              storeSet('SH_wxAuth', 'sex', res.sex);
              storeSet('SH_wxAuth', 'city', res.city);
              storeSet('SH_wxAuth', 'province', res.province);

              // 记录信息过期时间，
              // TODO 后续该称动态刷新, accesstoken 7200s有效期， 但可以用refresh token刷新，暂未使用相关机制
              var now = new Date().getTime()
              storeSet('SH_CommonStore', 'wxAuthExpire', now + 6800 * 1000);  // 设置过期时间 (7200s-400s之后)

              //重新跳转到原先进入页面
              console.log('wxAuth: that == this:', that === this)

              that.redirect_beforeloginurl()
            }
          }
        })
          .catch(err => {
            // TODO 改成 TOAST错误信息
            console.log()
          })

      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../styles/common/themeSettings.less';

  .contentWrap {
    width: 100vw;
    height: 100vh;
    background-color: @themeColor;
    color: white;
    // background-image: linear-gradient(to)

    div {
      margin: 6px 0;
    }
    span {
      margin: 10px;
    }
  }
</style>

