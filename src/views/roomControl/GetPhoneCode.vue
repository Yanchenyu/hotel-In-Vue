<!-- 身份验证页面 -->

<template>
  <div class="layout_div">
    <div style="margin:0 auto;max-width: 315px;padding: 0 30px;">
      <group gutter="0px">
        <x-input class="cus-normal vux-override register" style="margin-top:40px;font-size:16px;height: 59px" title='' keyboard="number"
                 is-type="china-mobile" v-model="phone" :disabled="phohedisabled" :show-clear="false"
                 placeholder="输入手机号码" @on-change="idCodeChange">
          <button slot="right" @click="sendSmsCode" :disabled="disabled" class="cus-normal getIdCode cus-placeholderColor" :class="{'cus-ftColorGray':disabled,'borderColor':disabled}">
            {{btnCaption}}
          </button>
        </x-input>
        <div class="thinLine" :class="{lineRed: phoneWrong}"></div>
        <x-input class="cus-normal vux-override register" title='' style="font-size:16px;height: 59px" keyboard="number" v-model="SmsCode"
                 :show-clear="false" placeholder="输入验证码" required @on-change="idCodeChange"></x-input>
        <div class="thinLine" :class="{lineRed: codeWrong}"></div>
      </group>

      <div class="btn_next" :class="{loginBtnSuccess: idCodeLoginBtn}" @click="onClick">
        <span>确认</span>
      </div>
      <div class="notification cus-h1">{{notification}}</div>
    </div>
  </div>
</template>

<script>
  import {XHeader, Cell, Group, XInput, XButton, PopupPicker, Datetime} from 'vux'
  import {
    fetchLoginByCodeAxios,
    fetchCreateVerificationCodeForRegisterAxios,
    fetchCreateVerificationCodeForPasswordAxios,
    fetchLoginByPhoneCodeAxios
  } from '@/services/axiosapi'
  import {is_weixin} from '@/utils/device'
  import {isMobile} from '@/utils/validateExp'
  import {mapState} from 'vuex'
  import {storeGet} from '@/utils/localStorage'

  export default {
    name: 'GetPhoneCode',
    components: {
      Group,
      Cell,
      XHeader,
      XInput,
      XButton,
      PopupPicker,
      Datetime
    },
    beforeMount () {
      //微信浏览器隐藏导航栏
      if (is_weixin()) this.titleBarFlag = false
      let mobile = storeGet('memberInfo', 'Phone');
      this.phone = mobile;
      if (this.$route.params.status == 3) this.phohedisabled = true;
    },
    data () {
      return {

        btnCaption: '获取验证码',
        disabled: false,
        titleBarFlag: true,
        second: 60,
        SmsCode: '',
        value1: true,
        showToast: false,
        toastText: '请输入验证码',
        phohedisabled: false,
        phone: '',
        notification: '',
        idCodeLoginBtn: true,
        phoneWrong: false,
        codeWrong: false
      }
    },
    methods: {
      idCodeChange(){
        if(this.phone==''||this.SmsCode==''){
          this.idCodeLoginBtn = true
        }else{
          this.idCodeLoginBtn = false
        }
      },
      onClick () {
        if(this.idCodeLoginBtn){
          return
        }
        // 验证手机号 TODO 代码多次使用，改成复用
        if (this.phone == "" || this.phone == undefined) {
          this.codeWrong = false;
          this.phoneWrong = true;
          this.notification = "请输入手机号码"
          return;
        } else if (!isMobile(this.phone)) {
          this.codeWrong = false;
          this.phoneWrong = true;
          this.notification = "请输入正确的手机号码"
          return;
        }

        //判断验证码不能为空
        if (this.SmsCode.length == 0) {
          this.phoneWrong = false;
          this.codeWrong = true;
          this.notification = "请输入验证码"
          return;
        }
        let params = {}
        params.phone = this.phone
        params.code = this.SmsCode
        fetchLoginByCodeAxios(params).then(response => {
          // response TODO 添加异常失败情况检查
          console.log(response)
          if (response.data.Success == true) {
              //免登陆
            let params = {};
            params.phone = this.phone;
            params.code = this.SmsCode;
            fetchLoginByPhoneCodeAxios(params).then(response => {
                if (response.data.Success == true) {
                    this.$store.dispatch('setMemberInfo', response.data.Content)
                    // localStorage 缓存数据
                    // TODO 封装一个localStorage带有效期时间设定
                    localStorage['memberInfo'] = JSON.stringify({value: response.data.Content});
                    this.$router.replace({
                        name: 'roomcontrol'
                    })  // 跳转 进入客房页面
                }
            }).catch(err => {
                console.log(err);
            });



          } else {
            // TODO 显示无查询数据
            this.notification = response.data.Message
          }
        }).catch(err => {
          //alert('fetchLoginByCodeAxios err:', err)
          this.utils.showNetError();
        })
        //   this.$router.push({name: 'changepassword'})  // 跳转下单页
      },
      sended() {
        // console.log('on sended')
        if (this.second <= 0) {
          this.disabled = false
          this.btnCaption = "获取验证码";
          this.second = 60;
          return;
        } else {
          this.disabled = true
          this.btnCaption = "重新发送(" + this.second + "s)";
          this.second--;
          setTimeout(this.sended, 1000)
        }
      },
      sendSmsCode()
      {
        console.log('on sendSmsCode', this.phone)

        // 验证手机号
        if (this.phone == "" || this.phone == undefined) {
          this.codeWrong = false;
          this.phoneWrong = true;
          this.notification = "请输入手机号码"
          return;
        } else if (!isMobile(this.phone)) {
          this.codeWrong = false;
          this.phoneWrong = true;
          this.notification = "请输入正确的手机号码"
          return;
        }
        var t = null;
        clearTimeout(t);  //清除定时
        this.disabled = true
        this.btnCaption = "重新发送(" + this.second + "s)";
        this.second--;
        let params = {}
        params.phone = this.phone
        console.log("this.$router.status", this.$route.params.status)
        if (this.$route.params.status == 1) //注册
        {
          fetchCreateVerificationCodeForRegisterAxios(params).then(response => {
            // response TODO 添加异常失败情况检查
            console.log(response)
            if (response.data.Success == true) {
              console.log("fetchCreateVerificationCodeForRegisterAxios response.data.Success", response.data.Message);
              this.codeWrong = false;
              this.phoneWrong = false;
              this.notification = "";
            } else {
              // TODO 显示无查询数据
              if (response.data.Code == "1") {
                this.codeWrong = false;
                this.phoneWrong = true;
                this.notification = "该手机号会员已存在，不能注册"
                this.disabled = false
                clearTimeout(t);  //清除定时
                this.btnCaption = "获取验证码";
              }
            }
          }).catch(err => {
            //alert('fetchCreateVerificationCodeForRegisterAxios err:', err)
            this.utils.showNetError();
          })
        } else {  //忘记密码或修改密码
          fetchCreateVerificationCodeForPasswordAxios(params).then(response => {
            // response TODO 添加异常失败情况检查
            console.log(response)
            if (response.data.Success == true) {
              console.log("fetchCreateVerificationCodeForPasswordAxios response.data.Success", response.data.Message)

            } else {
              // TODO 显示无查询数据
              if (response.data.Code == "1") {
                this.codeWrong = false;
                this.phoneWrong = true;
                this.notification = '该会员不存在，请输入正确的会员手机号'
                this.disabled = false;
                clearTimeout(t);  //清除定时
                this.btnCaption = "获取验证码";
              }
            }
          }).catch(err => {
            //alert('fetchCreateVerificationCodeForPasswordAxios err:', err)
            this.utils.showNetError();
          })
        }

        t = setTimeout(this.sended, 1000)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../styles/common/themeSettings.less';

  .xheader {
    background-color: @ftColorBlack;
  }

  //设置页面布局的颜色
  .layout_div {
    background-color: white;
    // position:fixed;
    // left:0; right:0;top:0;bottom:0;
    // TODO 实现背景全白，但是不用fixed position
    width: 100vw;
    height: 100%;
  }

  .btn_next {
    // TODO weex支持 flex only
    background-color: @themeColor;
    margin-top: 50px;
    // width: 335px;
    height: 44px;
    line-height: 44px;
    color: @panelColor;
    font-size: 16px;
    color: @panelColor;
    text-align: center;
    border-radius: 4px;
  }

  .getIdCode {
    border: 1px solid @splitColor;
    border-radius: 5px;
    height: 24px;
    text-align: center;
    line-height: 20px;
    padding-left: 5px;
    padding-right: 5px;
    background-color: #fff;
    margin-top: 5px;
  }

  .borderColor {
    border: 1px solid @placeholderColor;
  }
  .notification {
      width: 100%;
      text-align: center;
      margin-top: 15px;
      color: #ff7c8e;
  }
  .loginBtnSuccess {
      background-color: #92dfd8;
  }
  .lineRed {
      background-color: @priceColor;
    }
</style>
