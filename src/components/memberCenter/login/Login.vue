<template>
<div class="outside">
<div class="outerDiv">
  <x-header class="xheader vux-override"><span>好想住会员登录</span></x-header>
  <div class="bg">
    <nav>
      <div @click="checkLoginWay(true)" id="password"
           :class="{'cus-ftColorBlack': passwordWay,'cus-uncheckedColor': !passwordWay}">
        <span>密码登录</span>
      </div>
      <div @click="checkLoginWay(false)" id="identify"
           :class="{'cus-ftColorBlack': !passwordWay,'cus-uncheckedColor': passwordWay}">
        <span>验证码登录</span>
      </div>
    </nav>
    <article>
      <section class="passwordLogin" :class="{transitionClass: transition}" id="passwordLogin" :style="{left: loginMoveX + 'px'}" @touchstart="loginTouchstart" @touchend="loginTouchEnd" @touchmove="loginTouchMove">
        <group>
          <x-input :show-clear='false' class="userInput cus-h1" :class="{lineRed: loginPhoneWrong}" @on-change="passwordChange" v-model="loginPhone" :placeholder='enterPhone' keyboard="number"></x-input>
          <x-input :show-clear='false' class="userInput cus-h1" :class="{lineRed: passwordWrong}" @on-change="passwordChange" v-model="loginPassword" :placeholder='enterLoginPassword' :type='passwordShow' keyboard="number" :pattern="pattern"></x-input>
          <SwitchCustom @on-change='onChange' v-model="value2" class="switchBut"></SwitchCustom>
        </group>
        <div class="forgetPassword cus-normal cus-ftColorBlack3"
              @click="forgetPassWordclick"><span>忘记密码</span></div>
        <button @click="loginClick" class="loginBtn cus-h1" :class="{loginBtnSuccess: passwordLoginBtn}">登录</button>
        <div class="notification cus-h1" :class="{'notificateTransition': passwordLoginFalse}" id="passwordLoginNotification">{{passwordLoginNotification}}</div>
      </section>
      <section class="idCodeLogin" :class="{transitionClass: transition}" id="idCodeLogin" :style="{left: idCodeMoveX + 'px'}" @touchstart="idCodeTouchstart" @touchend="idCodeTouchEnd" @touchmove="idCodeTouchMove">
        <group>
          <x-input :show-clear='false' class="userInput cus-h1" :class="{lineRed: idPhoneWrong}" @on-change="idCodeChange" v-model="idLogin" :placeholder='enterPhone' keyboard="number"></x-input>
          <x-input :show-clear='false' class="userInput cus-h1" :class="{lineRed: codeWrong}" @on-change="idCodeChange" v-model="idPassword" :placeholder='enterIdCodePassword' :type='passwordIdCodeShow' keyboard="number"></x-input>
          <button  :disabled="disabled" class="getIdCode cus-normal cus-placeholderColor"
                  @click="sendSmsCode" :class="{'cus-ftColorGray':disabled,'borderColor':disabled}">{{btnCaption}}
          </button>
        </group>
        <button @click="loginClick" class="loginBtn" :class="{loginBtnSuccess: idCodeLoginBtn}">登录</button>
        <div class="notification cus-h1" :class="{'notificateTransition': idCodeLoginFalse}" id="idCodeLoginNotification">{{idCodeLoginNotification}}</div>
      </section>
    </article>
    <footer :style="{'margin-top': marginTop+'px'}">
      <section class="cus-flexrow-center">
        <!--<img src="@/../static/images/weixin.png" />
        <span class="cus-uncheckedColor cus-normal">微信登录</span>-->
      </section>
      <div class="cus-normal cus-ftColorBlack3">
        <span>还没有账号？</span>
        <span @click="registerclick" class="register">注册好想住账号</span>
      </div>
    </footer>
  </div>
</div>
</div>
</template>
<script>
  import {Group, XInput,XHeader} from 'vux'
  import SwitchCustom from '@/components/utils/SwitchCustom'
  import {isMobile} from '@/utils/validateExp'
  import {fetchLoginAxios, fetchCreateVerificationCodeAxios, fetchLoginByPhoneCodeAxios} from '@/services/axiosapi'
  import {fixedWatch} from '@/utils/inputFocus'
  export default {
    name: 'Login',
    props: {
      enterPhone: {
        type: String,
        default: '输入手机号'
      },
      enterPassword: {
        type: String,
        default: ''
      },
      switchTitle: {
        type: String,
        default: ''
      },
    },
    components: {
      XHeader,
      Group,
      XInput,
      SwitchCustom  // 自定义
    },
    beforeMount(){
      this.clientWidth = document.body.clientWidth;
      var clientHeight = document.body.clientHeight;
      var heightDiff = clientHeight-561;
      if(heightDiff>0){
        this.marginTop = heightDiff
      };
    },
    computed: {
      idCodeMoveX(){
          return Number(this.loginMoveX+this.clientWidth)
      }
    },
    watch: {
      // loginMoveX(val){
      //   console.log(val+this.clientWidth);
      //   if(val==0){
      //     this.passwordWay = true
      //   }else if(val== -Number(this.clientWidth)){
      //     this.passwordWay = false
      //   }
      // }
    },
    data(){
      return {
        btnCaption: '获取验证码',
        passwordWay: true,
        value2: false,
        passwordShow: 'password',
        enterLoginPassword: '输入密码',
        enterIdCodePassword: '输入验证码',
        passwordLoginShow: 'password',
        passwordIdCodeShow: 'text',
        phone: '',
        password: '',
        loginPhone: '',
        loginPassword: '',
        idLogin: '',
        idPassword: '',
        disabled: false,
        second: 60,
        touchStartX: 0,
        touchEndX: 0,
        clientWidth: 0,
        loginMoveX: 0,
        transition: false,
        inputFocus: {},
        marginTop: 0,
        passwordLoginNotification: "",
        idCodeLoginNotification: "",
        passwordLoginFalse: false,
        idCodeLoginFalse: false,
        passwordLoginBtn: true,
        idCodeLoginBtn: true,
        pattern: '[0-9]*',
        loginPhoneWrong: false,
        passwordWrong: false,
        idPhoneWrong: false,
        codeWrong: false
      }
    },
    methods: {
      checkLoginWay(val){
        this.transition = true;
        var passwordLogin = document.getElementById("passwordLogin");
        var idCodeLogin = document.getElementById("idCodeLogin");
        if (this.passwordWay == val) {
          return
        } else {
          this.passwordWay = val;
          if (val) {
            passwordLogin.style.left="0";
            idCodeLogin.style.left=Number(this.clientWidth+30)+"px";
          } else {
            passwordLogin.style.left="-"+Number(this.clientWidth+30)+"px";
            idCodeLogin.style.left="0";
          }
        }
      },
      onChange(val){
        this.value2 = val;
        if (val) {
          this.passwordShow = 'text'
        } else {
          this.passwordShow = 'password'
        }
      },
      loginClick(){
        if (this.passwordWay) {
          this.passwordLogin();
        } else {
          this.idCodeLogin();
        }
      },
      passwordLogin(){
        if(this.passwordLoginBtn){
          return
        }
        // 验证手机号 TODO 代码多次使用，改成复用
        this.phone = this.loginPhone;
        this.password = this.loginPassword;
        if (this.phone == "" || this.phone == undefined) {
          this.passwordWrong = false;
          this.loginPhoneWrong = true;
          this.passwordLoginNotice('请输入手机号码');
          return;
        } else if (!isMobile(this.phone)) {
          this.passwordWrong = false;
          this.loginPhoneWrong = true;
          this.passwordLoginNotice('请输入正确的手机号码');
          return;
        }
        if (!this.passwordvalid()) {
          return
        }
        console.log('Login onClick:', this.phone)
        let params = {}
        params.phone = this.phone
        params.password = this.password
        fetchLoginAxios(params).then(response => {
          // response TODO 添加异常失败情况检查
          console.log('Login response:', response)
          if (response.data.Success == true) {
            this.$store.dispatch('setMemberInfo', response.data.Content)
            // localStorage 缓存数据
            // TODO 封装一个localStorage带有效期时间设定
            localStorage['memberInfo'] = JSON.stringify({value: response.data.Content})

            // 登陆成功 使用replace
            this.$router.replace({
              name: 'membercenter'
            })
          } else {
            // TODO 显示无查询数据
            // this.utils.toast({msg: response.data.Message});
            if(response.data.Message=="密码不正确"){
              this.loginPhoneWrong = false;
              this.passwordWrong = true;
            }
            this.passwordLoginNotice(response.data.Message);
          }
        }).catch(err => {
          //alert('fetchLoginAxios err:', err)
          // this.utils.showNetError();
        })
      },
      idCodeLogin(){
        if(this.idCodeLoginBtn){
          return
        }
        this.phone = this.idLogin;
        this.password = this.idPassword;
        if (this.phone == "" || this.phone == undefined) {
          this.idPhoneWrong = true;
          this.codeWrong = false;
          this.idCodeLoginNotice('请输入手机号码');
          return;
        } else if (!isMobile(this.phone)) {
          this.idPhoneWrong = true;
          this.codeWrong = false;
          this.idCodeLoginNotice('请输入正确的手机号码');
          return;
        }
        if (!this.idCodevalid()) {
          return
        }
        let params = {};
        params.phone = this.phone;
        params.code = this.password;
        fetchLoginByPhoneCodeAxios(params).then(response => {
          if (response.data.Success == true) {
            this.$store.dispatch('setMemberInfo', response.data.Content)
            // localStorage 缓存数据
            // TODO 封装一个localStorage带有效期时间设定
            localStorage['memberInfo'] = JSON.stringify({value: response.data.Content})

            // 登陆成功 使用replace
            this.$router.replace({
              name: 'membercenter'
            })
          }else {
            if(response.data.Message=="验证码不正确或已失效"){
              this.idPhoneWrong = false;
              this.codeWrong = true;
            }
            this.idCodeLoginNotice(response.data.Message);
          }
        }).catch(err => {
          console.log(err);
        })
      },
      sended() {
        // console.log('on sended')
        if (this.second == 0) {
          this.disabled = false
          this.btnCaption = "获取验证码";
          this.second = 60;
        } else {
          this.disabled = true
          this.btnCaption = "重新发送(" + this.second + "s)";
          this.second--;
          setTimeout(this.sended, 1000)
        }
      },
      passwordvalid(){
        if (this.password.length == 0) {
          this.loginPhoneWrong = false;
          this.passwordWrong = true;
          this.passwordLoginNotice('密码不能为空');
          return false
        }
        if (this.password.length < 6) {
          this.loginPhoneWrong = false;
          this.passwordWrong = true;
          this.passwordLoginNotice('密码长度不能少于6位');
          return false
        }
        if (this.password.length > 18) {
          this.loginPhoneWrong = false;
          this.passwordWrong = true;
          this.passwordLoginNotice('密码长度不能大于18位');
          return false
        }
        return true;
      },
      idCodevalid(){
        if (this.password.length == 0) {
          this.idCodeLoginNotice('验证码不能为空');
          return false
        }
        return true;
      },
      registerclick(){
        this.$router.push({
          name: 'authentication',
          params: {status: 1, title: "注册"}
        });
      },
      forgetPassWordclick(){
        this.$router.push({
          name: 'authentication',
          params: {status: 2, title: "身份验证"}
        });
      },
      sendSmsCode(){
        this.phone = this.idLogin;
        this.password = this.idPassword;
        // 验证手机号
        if (this.phone == "" || this.phone == undefined) {
          this.codeWrong = false;
          this.idPhoneWrong = true;
          this.idCodeLoginNotice('请输入手机号码');
          return;
        } else if (!isMobile(this.phone)) {
          this.codeWrong = false;
          this.idPhoneWrong = true;
          this.idCodeLoginNotice('请输入正确的手机号码');
          return;
        }
        this.disabled = true
        this.btnCaption = "重新发送(" + this.second + "s)";
        this.second--;
        let params = {};
        params.phone = this.phone
        fetchCreateVerificationCodeAxios(params).then(response => {
          // response TODO 添加异常失败情况检查
          console.log(response)
          if (response.data.Success == true) {
            this.codeWrong = false;
            this.idPhoneWrong = false;
            this.idCodeLoginNotice("");
          } else {
            // TODO 显示无查询数据
            if (response.data.Code == "1") {
              this.idCodeLoginNotice('出错了，请重新发送');
              this.disabled = false
              clearTimeout(t);  //清除定时
              this.btnCaption = "获取验证码";
            }
          }
        }).catch(err => {
          console.log(err)
        })


        var t = setTimeout(this.sended, 1000)
      },

      //滑动屏幕切换
      loginTouchstart(event){
        this.transition = false;
        this.touchStartX = event.touches[0].clientX;
      },
      loginTouchMove(event){
        if(event.changedTouches[0].clientX < this.touchStartX){
          this.loginMoveX =   event.changedTouches[0].clientX - this.touchStartX;
        }

      },
      loginTouchEnd(event){
        var passwordLogin = document.getElementById("passwordLogin");
        var idCodeLogin = document.getElementById("idCodeLogin");
        this.touchEndX = event.changedTouches[0].clientX;
        if(this.touchStartX-this.touchEndX > this.clientWidth*1/3){
            this.transition = true;
            passwordLogin.style.left="-"+Number(this.clientWidth+30)+"px";
            idCodeLogin.style.left="0";
            this.passwordWay = false
        }else{
            this.transition = true;
            passwordLogin.style.left="0";
            idCodeLogin.style.left=Number(this.clientWidth+30)+"px";
            this.passwordWay = true;
        }
      },
      idCodeTouchstart(event){
        this.transition = false;
        this.touchStartX = event.touches[0].clientX;
      },
      idCodeTouchMove(event){
        if(event.changedTouches[0].clientX > this.touchStartX){
          this.loginMoveX =   event.changedTouches[0].clientX - this.touchStartX - this.clientWidth;
        }

      },
      idCodeTouchEnd(event){
        var passwordLogin = document.getElementById("passwordLogin");
        var idCodeLogin = document.getElementById("idCodeLogin");
        this.touchEndX = event.changedTouches[0].clientX;
        if(this.touchEndX-this.touchStartX > this.clientWidth*1/3){
            this.transition = true;
            passwordLogin.style.left="0";
            idCodeLogin.style.left=Number(this.clientWidth+30)+"px";
            this.passwordWay = true;
        }else{
            this.transition = true;
            passwordLogin.style.left="-"+Number(this.clientWidth+30)+"px";
            idCodeLogin.style.left="0";
            this.passwordWay = false;
        }
      },
      passwordLoginNotice(val){
        this.passwordLoginNotification = val;
          // this.passwordLoginFalse = false;
          // this.passwordLoginNotification = '';
          // document.getElementById("passwordLoginNotification").style.opacity = 1;
          // var that = this;
          // setTimeout(function(){
          //   that.passwordLoginFalse = true;
          //   that.passwordLoginNotification = val;
          //   document.getElementById("passwordLoginNotification").style.opacity = 0;
          // },10);
      },
      idCodeLoginNotice(val){
        this.idCodeLoginNotification = val;
          // this.idCodeLoginFalse = false;
          // this.idCodeLoginNotification = '';
          // document.getElementById("idCodeLoginNotification").style.opacity = 1;
          // var that = this;
          // setTimeout(function(){
          //   that.idCodeLoginFalse = true;
          //   that.idCodeLoginNotification = val;
          //   document.getElementById("idCodeLoginNotification").style.opacity = 0;
          // },10);
      },
      passwordChange(){
        if(this.loginPhone==""||this.loginPassword==""){
          this.passwordLoginBtn = true
        }else{
          this.passwordLoginBtn = false
        }
      },
      idCodeChange(){
        if(this.idLogin==""||this.idPassword==""){
          this.idCodeLoginBtn = true
        }else{
          this.idCodeLoginBtn = false
        }
      }
    }
  }
</script>
<style lang='less' scoped>
@import '../../../styles/common/themeSettings.less';
  .outside {
    width: 100%;
    height: 100%;
  }
  .outerDiv {
    // position: absolute;
    // top: 0;
    // left: 0;
    width: 100%;
    height: 100%;
    background-color: @panelColor;
    overflow-x: hidden;
  }
  .xheader {
      background-color: @themeColor;
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 100;
      span {
        font-size: 20px;
      }
  }
  .bg {
    // position: fixed;
    // top: 0;
    // left: 0;
    // right: 0;
    // bottom: 0;
    background-color: @panelColor;
    padding-top: 116px;
  }

  nav {
    width: 100%;
    text-align: center;
    div {
      display: inline-block;
      font-size: @ftSize-h2;
      width: 150px;
      height: 50px;
      line-height: 50px;
    }
    #password span {
      border-right: 1px solid #eee;
      display: inline-block;
      width: 100%;
      height: 22px;
      line-height: 22px;
    }
  }

  article {
    position: relative;
    margin: 0 30px;
    height: 280px;
    .passwordLogin {
      position: absolute;
      top: 0;
      // left: 0;
      width: 100%;
      // margin: 0 auto;
      // padding: 0 30px;
      // max-width: 315px;

    }

    .transitionClass {
      transition: all 0.5s;
    }

    .idCodeLogin {
      position: absolute;
      top: 0;
      // left: 100%;
      width: 100%;
      // margin: 0 auto;
      // padding: 0 30px;
      // max-width: 315px;
    }

    .userInput {
     border-bottom: 1px solid @pageColor;
     padding:20px 0 14px 0;
    }
    .lineRed {
      border-bottom: 1px solid @priceColor;
    }
    .switchBut {
        position: absolute;
        bottom: 5px;
        right:0;
        padding-right: 0;
    }

    .forgetPassword {
      margin-top: 14px;
      span {
        display: inline-block;
        border-bottom: 1px dotted @ftColorBlack3;
        line-height: 1.5em;
      }
    }

    .getIdCode {
      position: absolute;
      top: 20px;
      right: 0;
      padding-left: 5px;
      padding-right: 5px;
      border: 1px solid @splitColor;
      border-radius: 5px;
      // width: 80px;
      height: 24px;
      text-align: center;
      line-height: 20px;
      background-color: @panelColor;
    }

    .borderColor {
      border: 1px solid @placeholderColor;
    }
  }

  .loginBtn {
      width: 100%;
      height: 44px;
      line-height: 44px;
      text-align: center;
      background: @themeColor;
      color: @panelColor;
      border-radius: 5px;
      margin-top: 56px;
      font-size: 18px;
    }

  footer {
    // position: absolute;
    // bottom: 15%;
    width: 100%;
    text-align: center;
    section {
      height: 30px;
      img {
          width:30px;
          height:30px;
      }
      span {
          margin-left: 10px
      }
    }
    div {
      margin-top: 20px;
      .register {
        border-bottom: 1px dotted #7e7b7b;
        line-height: 1.5em;
        display: inline-block;
      }
    }
  }

  .notification {
    width: 100%;
    text-align: center;
    margin-top: 15px;
    color: #ff7c8e;
  }

  .notificateTransition {
    transition: all 2.5s;
  }

  .loginBtnSuccess {
    background-color: #92dfd8;
  }

</style>
