<template>
  <div>
    <div class="head_info">
      <blur :blur-amount="amount" :url="url" :height="150">
        <div v-if="is_weixin || loginStatu">
          <router-link to="/membercenter/component/meminfo">
            <p class="center"><img :src="avatar"></p>
          </router-link>
          <div class="mem-name">{{nickname}}</div>
          <div class="mem-signature">{{signature}}</div>
        </div>
        <div class="loginBlur" v-if="!is_weixin && !loginStatu">
          <p>登录好想住</p>
          <!--<div class="cus-flexrow-center" style="position: relative;top: 0;margin-top:20px;height:30px;width:100%">
            <section :class="{'touchBefore': touchBefore,'touchEnd': !touchBefore}" style="position: absolute;top:0;" @click="loginBtn"
                     @touchstart="touchstart" @touchend="touchend"></section>
            <section style="color: #fff;position: absolute;top:0;z-index: 100" @click="loginBtn" @touchstart="touchstart"
                     @touchend="touchend">登录/注册
            </section>
          </div>-->
          <button @click="loginBtn" :class="{'touchBefore': touchBefore,'touchEnd': !touchBefore}" @touchstart="touchstart" @touchend="touchend">登录/注册</button>
        </div>
      </blur>
    </div>
  </div>
</template>

<script>
  import {XHeader, Blur} from 'vux'
  import {mapState} from 'vuex'
  import {is_weixin} from '@/utils/device'
  import {storeGet} from '@/utils/localStorage'

  export default {
    name: 'HeadInfo',
    components: {
      XHeader,
      Blur
    },
    beforeMount () {
      // this.initData();
      //获取头像
        if (storeGet('memberInfo', 'Avatar')) {
          var db_avatar = storeGet('memberInfo', 'Avatar');
        } else {
          var db_avatar = this.$store.state.memberCenter.memberHeadImg;
        }
        ;
        if (!is_weixin()) {
          if (db_avatar == null){
            this.avatar = '../../../static/images/defaultHead.png';
          }
          let res = db_avatar.replace(/(^\s*)|(\s*$)/g, "");
          if (res.length > 0) {
            this.url = res;
            this.avatar = res;
          } else {
            this.avatar = '../../../static/images/defaultHead.png';
          }
          // this.avatar= db_avatar;
        } else {
          var localwxheadimgurl = storeGet('SH_wxAuth', 'headimgurl');
          if (!(typeof localwxheadimgurl == "undefined")) {
            if (!(typeof db_avatar == "undefined")) {
              let res = db_avatar.replace(/(^\s*)|(\s*$)/g, "");
              if (res.length > 0) {
                this.url = res;
                this.avatar = res;
              } else {
                this.url = localwxheadimgurl;
                this.avatar = localwxheadimgurl;
              }
            } else {
              this.url = localwxheadimgurl;
              this.avatar = localwxheadimgurl;
            }
          }
        }

    },
    data() {
      return {
        //url: '../../assets/temp/head_icon1.png'
        // nickname:'',
        // signature:'',
        // avatar:'../../../static/images/defaultHead.png',
        url: '../../../static/images/defautbackground.png',
        touchBefore: false,
        avatar: "",
        is_weixin: is_weixin() 
      }
    },
    computed: {

      //获取昵称
      nickname(){
        var db_nikename = this.$store.state.memberCenter.memberInfo.NickName;// storeGet('memberInfo', 'NickName');
        if (!is_weixin()) {
          return db_nikename;
        } else {
          var localwxnickname = storeGet('SH_wxAuth', 'nickname')
          if (!(typeof localwxnickname == "undefined")) {
            if (!(typeof db_nikename == "undefined")) {
              return db_nikename;
              // console.log("headinfo getnickname this.nickname",this.nickname)
            } else {
              return localwxnickname;
              // console.log("headinfo getnickname this.nickname1",this.nickname)
            }
          }
        }
      },
      //获取个人签名
      signature() {
        let db_signature = this.$store.state.memberCenter.memberInfo.Signature;
        if (db_signature == null) return "";
        return db_signature;
      },
      amount(){
        if(this.loginStatu){
          return 10
        }else{
          return 5
        }
      },
      ...mapState({
        loginStatu: state => state.memberCenter.memberLoginStatu
      })
    },
    methods: {
      loginBtn(){
        this.$router.push({
          name: 'Login'
        })
      },
      touchstart(){
        this.touchBefore = true
      },
      touchend(){
        this.touchBefore = false
      }
    }
  }
</script>

<style lang='less' scoped>
  @import '../../styles/common/themeSettings.less';

  .js_meminfo_wrapper {
    background-color: @pageColor;
    position: relative;
  }

  .head_info {
    height: 150px;
    width: 100%;
    position: relative;
    text-align: center;
  }

  .memicon {
    margin-left: auto;
    margin-right: auto;
    padding-top: 25px;
    position: relative;
    .icon-center {
      border-radius: 50px;
      width: 60px;
      height: 60px;
    }
  }

  .mem-name {
    padding-top: 5px;
    color: @panelColor;
    font-size: @ftSize-normal;
    line-height: 14px;
    text-shadow: 1px 1px 1px gray;
  }

  .mem-signature {
    padding-top: 10px;
    color: @panelColor;
    font-size: @ftSize-small;
    line-height: 12px;
    text-shadow: 1px 1px 1px gray;
  }

  .loginBlur {
    text-align: center;
    font-size: 18px;
    color: @panelColor;
    p {
      width: 100%;
      text-align: center;
      margin-top: 50px;
    }
    div {
      text-align: center;
    }
    button {
      margin: 20px auto;
      color: @panelColor;
      height: 31px;
      width: 120px;
      line-height: 29px;
      border: 1px solid @panelColor;
      border-radius: 16px;
    }
  }

  /* vux */
  .center {
    text-align: center;
    padding-top: 25px;
    color: @panelColor;
    font-size: 18px;
  }

  .center img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px solid #ececec;
  }

  .touchBefore {
    background-color: rgba(255,255,255,0.2);
  }

  .touchEnd {
    background-color: transparent
  }

</style>
