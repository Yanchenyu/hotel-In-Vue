<!-- 修改密码页面 -->


<template>
  <div class="layout_div">
    <div style="padding: 0 30px;margin:0 auto;max-width: 315px;">
      <group gutter="0px">
        <x-input class="vux-override" style="margin-top:20px;font-size:16px;padding: 5px 0;" title=''
                 :type="currentValue?'text':'password'" :show-clear="false" :max="18"
                 v-model="password" placeholder="6-18位字母数字或字符">
          <div slot="right">
            <div class="vux-x-switch weui-cell weui-cell_switch_ext ">
              <div class="weui-cell__ft">
                <input class="weui-switch weui-switch_ext" type="checkbox" v-model="currentValue"/>
              </div>
            </div>
          </div>
        </x-input>
        <div class="thinLine"></div>
        <x-input class="vux-override" style="font-size:16px;padding: 5px 0;" title=''
                 :type="currentValue?'text':'password'" :show-clear="false" :min="6" :max="18"
                 v-model="newpassword" @on-blur="onBlur" placeholder="请重复一遍新密码">
        </x-input>
        <div class="thinLine"></div>
      </group>
    </div>
    <div style="padding: 0 30px;">
      <div class="btn_submit" @click="onClick">
        <span>提交</span>
      </div>
    </div>

    <div v-transfer-dom>
      <alert v-model="alertFlag" :title="''" :content="alertText" :button-text="'去登录'" @on-hide="onHide"></alert>
      <confirm v-model="modifyFailFlag"
               :title="''" :confirm-text="confirmText"
               @on-cancel="onCancel"
               @on-confirm="onConfirm"
               @on-show="onShow"
               @on-hide="confirmOnHide">
        <p style="text-align:center;">{{confirmInfo}}</p>
      </confirm>
    </div>
  </div>
</template>


<script>
  import {
    Confirm,
    Alert,
    XHeader,
    Cell,
    Group,
    XInput,
    XButton,
    PopupPicker,
    XSwitch,
    Datetime,
    TransferDomDirective as TransferDom
  } from 'vux'
  import {fetchChangePasswordAxios, fetchCreateMemberInfoAxios, fetchLoginAxios} from '@/services/axiosapi'
  import {mapState} from 'vuex'

  export default {
    name: 'ChangePassword',
    directives: {
      TransferDom
    },
    components: {
      Confirm,
      Alert,
      Group,
      Cell,
      XHeader,
      XInput,
      XButton,
      XSwitch,
      PopupPicker,
      Datetime
    },
    data () {
      return {
        password: '',
        newpassword: '',
        toastText: '',
        alertFlag: false,
        alertText: '设置密码成功',
        confirmText: "继续修改",
        confirmInfo: "密码修改失败",
        toastFlag: false,
        modifyFailFlag: false,
        currentValue: false,
        value1: true
      }
    },
    methods: {
      onCancel () {
        console.log('on cancel')
        if (this.$route.params.status == 2 || this.$route.params.status == 1) { //忘记密码密码
          this.$router.push({
            name: 'authentication',
            params: {status: 1, title: "注册"}
          });
        } else {
          this.$router.push({name: 'meminfo'})  // 跳转会员信息
        }

      },
      onConfirm () {

        console.log('on confirm')
      },
      onClick () {
        console.log('on click')
        console.log('修改密码', this.passwordvalid())
        if (!this.passwordvalid()) {
          return;
        }

        console.log('修改密码')
        let params = {}
        params.phone = this.$route.params.phone;
        params.password = this.password;
        if (this.$route.params.status == 2 || this.$route.params.status == 3) { //修改密码
          fetchChangePasswordAxios(params).then(response => {
            // response TODO 添加异常失败情况检查
            console.log(response)
            if (response.data.Success == true) {
              console.log("response.data.Success", response.data.Message)
              if (this.$route.params.status == 3) {
                this.utils.toast({msg: "修改成功"});


              }
              ;
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
              // this.alertText="设置密码成功";
              // this.alertFlag=true;
            } else {
              // TODO 显示无查询数据
              if (response.data.Code == "1") {
                this.confirmText = "继续修改";
                this.confirmInfo = "密码设置失败";
                this.modifyFailFlag = true;
              }
            }
          }).catch(err => {
            // alert('fetchChangePasswordAxios err:',err)
            this.confirmText = "继续修改";
            this.confirmInfo = "密码设置失败";
            this.modifyFailFlag = true;
          })
        } else { //注册
          fetchCreateMemberInfoAxios(params).then(response => {
            // response TODO 添加异常失败情况检查
            console.log(response)
            if (response.data.Success == true) {
              console.log("response.data.Success", response.data.Message)
              this.alertText = "注册成功";
              this.alertFlag = true;
            } else {
              // TODO 显示无查询数据
              if (response.data.Code == "1") {
                this.confirmText = "继续注册";
                this.confirmInfo = "注册失败";
                this.modifyFailFlag = true;
              }
            }
          }).catch(err => {
            // alert('fetchCreateMemberInfoAxios err:',err)
            this.confirmText = "继续注册";
            this.confirmInfo = "注册失败";
            this.modifyFailFlag = true
          })
        }
      },
      onHide () {
        console.log('on hide')
        this.$router.push({name: 'Login'})  // 跳转登录
      },
      confirmOnHide(){
        if (this.$route.params.status == 1) {
          this.$router.push({
            name: 'authentication',
            params: {status: 1, title: "注册"}
          });
        }
      },
      change(){
        console.log('on change')
      },
      onShow () {
        console.log('on show')
      },
      onLogin () {
        console.log('on onLogin')
      },
      onBlur (val) {

        if (!this.passwordvalid()) return
        console.log('on blur', this.passwordvalid())
        console.log('on blur', val)
      },
      passwordvalid(){
        if (this.password.length == 0 || this.newpassword.length == 0) {
          this.utils.toast({msg: '密码不能为空'});
          return false
        }
        if (this.password.length < 6) {
          this.utils.toast({msg: '密码长度不能少于6位'});
          return false
        }
        if (this.password.length != this.newpassword.length) {
          this.utils.toast({msg: '两次输入密码长度不一致'});
          return false
        }
        if (this.password != this.newpassword) {
          this.utils.toast({msg: '两次输入密码不一致'});
          return false
        }
        return true;
      }
    }
  }
</script>

<style lang="less">

  .weui-cell_switch_ext {
    padding-top: 0;
    padding-bottom: 0;
  }

  .weui-switch_ext:checked,
  .weui-switch-cp__input:checked ~ .weui-switch-cp__box {
    /** vux **/
    border-color: #25c0b1;
    background-color: #25c0b1;
    /** end vux **/
    &:before {
      transform: scale(0);
    }
    &:after {
      transform: translateX(20px);
    }
  }
</style>


<style lang="less" scoped>
  @import '../../../../styles/common/themeSettings.less';

  .xheader {
    background-color: @ftColorBlack;
  }

  //设置页面布局的颜色
  .layout_div {
    background-color: white;
    // position:fixed;
    // left:0; right:0;top:0;bottom:0;
    width: 100vw;
    height: 100%;
  }

  .btn_submit {
    // TODO weex支持 flex only
    background-color: @themeColor;
    margin: 30px auto;
    max-width: 315px;
    height: 44px;
    line-height: 44px;
    color: @panelColor;
    font-size: 18px;
    color: @panelColor;
    text-align: center;
    border-radius: 4px;
    border: 1px solid @themeColor;
  }

</style>
