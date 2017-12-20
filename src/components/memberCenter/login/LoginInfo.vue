<!-- 登录页面 -->
<template>
  <div class="layout_div">
    <x-header :left-options="{showBack: false}" class="xheader vux-override" style="background-color:#25c0b1;">登录
    </x-header>
    <div style="padding: 0 10px;">
      <group style="margin-top:0px" gutter="0px">

        <x-input class="cus-normal vux-override" style="margin-top:20px;" title='' keyboard="number" v-model="phone"
                 :show-clear="false" placeholder="请输入手机号">
        </x-input>
        <div class="thinLine"></div>
        <x-input class="cus-normal vux-override" title='' :type="currentValue?'text':'password'" v-model="password"
                 :show-clear="false" placeholder="请输入密码">
          <div slot="right">
            <div class="vux-x-switch weui-cell weui-cell_switch_ext ">
              <div class="weui-cell__ft">
                <input class="weui-switch weui-switch_ext vux-override" type="checkbox" v-model="currentValue"/>
              </div>
            </div>
          </div>
        </x-input>
        <div class="thinLine"></div>
      </group>
    </div>


    <div>
      <div style="padding:0px 10px;" class="btn_login" @click="onClick">
        <span>登 录</span>
      </div>
      <div class="regist_div cus-flexrow-center">
        <div>
          <div class="cus-flexcolumn">
            <div class="register_div" @click="registerclick">
              <span style="text-align: right;">注册 </span>
            </div>
          </div>
          <div class="split_div"></div>
          <div class="cus-flexcolumn">
            <div class="forget_div" @click="forgetPassWordclick">
              <span style="">忘记密码 </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {XHeader, Cell, Group, XInput, XButton, PopupPicker, Datetime} from 'vux'
  import {fetchLoginAxios} from '@/services/axiosapi'  
  import {mapState} from 'vuex'
  import {isMobile} from '@/utils/validateExp'

  export default {
    name: 'LoginInfo',
    components: {
      Group,
      Cell,
      XHeader,
      XInput,
      XButton,
      PopupPicker,
      Datetime
    },
    data () {
      return {
        phone: '',
        email: '',
        password: '',

        currentValue: false,
      }
    },
    beforeMount() {
      var localmemberInfo = localStorage['memberInfo']
      // TODO 验证 MemberId, RoomId是否仍然有效
      if (localmemberInfo !== undefined) {
        this.$router.push({
          name: 'membercenter'
        })
      }
    },
    methods: {
      onClick () {
        console.log('on click')
        // 验证手机号 TODO 代码多次使用，改成复用
        if (this.phone == "" || this.phone == undefined) {
          this.utils.toast({msg: '请输入手机号码'});
          return;
        } else if (!isMobile(this.phone)) {
          this.utils.toast({msg: '请输入正确的手机号码'});
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
            this.utils.toast({msg: response.data.Message});
          }
        }).catch(err => {
          //alert('fetchLoginAxios err:', err)
          this.utils.showNetError();
        })
      },
      sendSmsCode()
      {
        console.log('on sendSmsCode')

      },
      change(){
        console.log('on change')
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
      passwordvalid(){
        if (this.password.length == 0) {
          this.utils.toast({msg: '密码不能为空'});
          return false
        }
        if (this.password.length < 6) {
          this.utils.toast({msg: '密码长度不能少于6位'});
          return false
        }
        if (this.password.length > 18) {
          this.utils.toast({msg: '密码长度不能大于18位'});
          return false
        }
        return true;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../../styles/common/themeSettings.less';

  .xheader {
    background-color: @ftColorBlack;
  }

  .xbutton {
    background-color: @themeColor;
  }

  //设置页面布局的颜色
  .layout_div {
    background-color: white;
    // margin:0px 0px;
    // position:fixed;
    //  left:0; right:0;top:0;bottom:0;
    width: 100vw;
    height: 100%;

  }

  .btn_login {
    // TODO weex支持 flex only
    background-color: @themeColor;
    margin-top: 30px;
    margin-left: 10px;
    margin-right: 10px;

    line-height: 44px;
    color: @panelColor;
    font-size: 18px;
    color: @panelColor;
    text-align: center;
    border-radius: 4px;
    border: 1px solid @themeColor;

  }

  .btn_login_a {
    // TODO weex支持 flex only
    background-color: #25c0b1;
    margin-top: 30px;
    margin: 0px 10px;

    line-height: 44px;
    color: @panelColor;
    font-size: 18px;
    color: @panelColor;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #25c0b1;
  }

  .regist_div {
    background-color: white;
    /* Flex 布局*/
    align-items: center;
    * {
      display: flex;
      display: -webkit-flex;
    }

    .register_div {
      padding-top: 10px;
      padding-bottom: 10px;
      font-size: @ftSize-normal;

    }

    .split_div {
      margin-top: 10px;
      margin-left: 10px;
      margin-bottom: 10px;
      width: 1px;
      background-color: @pageColor;

    }

    .forget_div {
      padding-top: 10px;
      padding-bottom: 10px;
      margin-left: 10px;
      font-size: @ftSize-normal;

    }

  }


</style>
