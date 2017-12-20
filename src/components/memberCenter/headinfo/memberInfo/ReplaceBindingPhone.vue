<!-- 更换绑定手机页面 -->

<template>
  <div class="layout_div">
    <div style="margin:0 auto;max-width: 315px;padding: 0 30px;">
      <group gutter="0px">
        <x-input class="cus-normal vux-override register" style="margin-top:20px;font-size:16px;height: 59px" title='' type="tel" keyboard="number"
                 is-type="china-mobile" v-model="phone" @on-change="idCodeChange" :show-clear="false" required placeholder="输入新手机">
          <!--<x-button slot="right" mini @click.native="sendSmsCode" :disabled="disabled">{{btnCaption}}</x-button>-->
          <button slot="right" @click="sendSmsCode" :disabled="disabled" class="cus-normal getIdCode cus-ftColorBlack3" :class="{'cus-placeholderColor':disabled,'borderColor':disabled}">
            {{btnCaption}}
          </button>
        </x-input>
        <div class="thinLine" :class="{lineRed: phoneWrong}"></div>
        <x-input class="cus-normal vux-override register" title='' style="font-size:16px;height: 59px" title='' keyboard="number" v-model="SmsCode" @on-change="idCodeChange" :show-clear="false"
                 placeholder="请输入验证码" required></x-input>
        <div class="thinLine" :class="{lineRed: codeWrong}"></div>
      </group>
      <div style="padding:0px 10px;" class="btn_verify" :class="{loginBtnSuccess: idCodeLoginBtn}" @click="onClick">
        <span>提交</span>
      </div>
      <div class="notification cus-h1">{{notification}}</div>
    </div>

    <div v-transfer-dom>
      <alert v-model="tipShow" :title="''" :content="contentInfo" :button-text="btnTipCaption"
             @on-hide="onHide"></alert>
    </div>
  </div>
</template>

<script>
  import {
    XHeader,
    Cell,
    Group,
    XInput,
    XButton,
    PopupPicker,
    Alert,
    Datetime,
    TransferDomDirective as TransferDom
  } from 'vux'
  import {
    fetchBindingMemberPhoneAxios,
    fetchBindingMemberPhoneByWeChatAxios,
    fetchCreateVerificationCodeAxios,
    fetchLoadMemberDetailViewByBindIdAxios
  } from '@/services/axiosapi'
  import {is_weixin} from '@/utils/device'
  import {mapState} from 'vuex'
  import {isMobile} from '@/utils/validateExp'
  import {storeSet, storeGet} from '@/utils/localStorage'

  import {ls_unionId} from '@/utils/localStorage'

  export default {
    name: 'ReplaceBindingPhone',
    directives: {
      TransferDom
    },
    components: {
      Group,
      Cell,
      XHeader,
      XInput,
      XButton,
      PopupPicker,
      Alert,
      Datetime
    },
    data () {
      return {
        phone: '',
        btnCaption: '获取验证码',
        showToast: false,
        toastText: '',
        disabled: false,
        second: 60,
        SmsCode: '',
        show: false,
        tipShow: false,
        bindSuccFlag: false,
        contentInfo: '',
        btnTipCaption: '确认',
        notification: "",
        phoneWrong: false,
        codeWrong: false,
        idCodeLoginBtn: true,
      }
    },
    beforeMount () {
      if (!is_weixin()) {
        // 清空缓存数据，并推出页面到登陆页
        // delete localStorage['memberInfo']
        var localmemberInfo = localStorage['memberInfo']
        // TODO 验证 MemberId, RoomId是否仍然有效
        if (localmemberInfo == undefined) {
          this.$router.replace({
            name: 'membercenter'
          })
        }

      } else {
        this.findMember();
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
        };
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
          return
        }

        if (is_weixin()) {
          this.wxBindPone();
        } else {
          this.appBindPone();
        }

      },
      wxBindPone()
      {
        let params = {}
        params.UnionId = ls_unionId();
        params.Phone = this.phone
        params.Code = this.SmsCode
        params.NickName = storeGet('SH_wxAuth', 'nickname');
        let sex = storeGet('SH_wxAuth', 'sex');
        params.Sex = sex == "1" ? "M" : "F"
        params.Avatar = storeGet('SH_wxAuth', 'headimgurl');
        let province = storeGet('SH_wxAuth', 'province');
        let city = storeGet('SH_wxAuth', 'city')
        var l_province = "";
        var l_city = "";
        //处理直辖市
        if (province == "北京" || province == "重庆" || province == "上海" || province == "天津") {
          l_province = province + "市 ";
          l_city = "市辖区";
        }
        //自治区
        if (province == "西藏" || province == "内蒙古") {
          l_province = province + "自治区 ";
          l_city = city + "市";
        }
        if (province == "广西") {
          l_province = province + "壮族自治区 ";
          l_city = city + "市";
        }
        if (province == "宁夏" || province == "新疆") {
          l_province = province + "回族自治区 ";
          l_city = city + "市";
        }
        if (province == "新疆") {
          l_province = province + "维吾尔自治区 ";
          l_city = city + "市";
        } else {
          l_province = province + "省 ";
          l_city = city + "市";
        }

        let location = l_province + l_city;
        console.log("wxBindPone l_province", l_province)
        console.log("wxBindPone l_city", l_city)
        console.log("wxBindPone location", location)
        params.Location = location;
        console.log("wxBindPone params.Location", params.Location)
        fetchBindingMemberPhoneByWeChatAxios(params).then(response => {
          // response TODO 添加异常失败情况检查
          console.log(response)
          if (response.data.Success == true) {
            console.log("response.data.Success", response.data.Message)
            this.findMember();
            this.$router.back();
          } else {
            // TODO 显示无查询数据
            this.notification = response.data.Message;
          }
        }).catch(err => {
          this.bindSuccFlag = false
          this.tipShow = true
          this.contentInfo = '绑定失败'
          this.btnTipCaption = '继续绑定'
          // alert('fetchBindingMemberPhoneAxios err:',err)
          this.utils.showNetError();
        })

      },
      findMember(){
        let params = {}
        params.BindId = ls_unionId();
        params.BindWay = "W";

        fetchLoadMemberDetailViewByBindIdAxios(params).then(response => {
          // response TODO 添加异常失败情况检查
          console.log(response)
          if (response.data.Success == true) {
            console.log(" findMember response.data.Success", response.data.Message)
            this.$store.dispatch('setMemberInfo', response.data.Content)
            let obj = response.data.Content;
            storeSet('memberInfo', 'Id', obj.Id);
            storeSet('memberInfo', 'Phone', obj.Phone);
            storeSet('memberInfo', 'NickName', obj.NickName);
            storeSet('memberInfo', 'Avatar', obj.Avatar);
            storeSet('memberInfo', 'BindId', obj.BindId);
          } else {
            // TODO 显示无查询数据
            console.log("findMember fail: ", response.data.Message)
          }
        }).catch(err => {

        })

      },
      appBindPone(){
        let memberId = storeGet('memberInfo', 'Id');
        let params = {}
        params.memberId = memberId;
        params.phone = this.phone
        params.code = this.SmsCode
        fetchBindingMemberPhoneAxios(params).then(response => {
          // response TODO 添加异常失败情况检查
          console.log(response)
          if (response.data.Success == true) {
            console.log("response.data.Success", response.data.Message)

            storeSet('memberInfo', 'Phone', this.phone);

            this.$router.back();
          } else {
            // TODO 显示无查询数据
            this.notification = response.data.Message;

          }
        }).catch(err => {
          this.bindSuccFlag = false
          this.tipShow = true
          this.contentInfo = '绑定失败'
          this.btnTipCaption = '继续绑定'
          // alert('fetchBindingMemberPhoneAxios err:',err)
          this.utils.showNetError();
        })

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
        console.log('on sendSmsCode')

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
        fetchCreateVerificationCodeAxios(params).then(response => {
          // response TODO 添加异常失败情况检查
          console.log(response)
          if (response.data.Success == true) {
            console.log("response.data.Success", response.data.Message)

          } else {
            // TODO 显示无查询数据
            this.notification = response.data.Message
          }
        }).catch(err => {
          //alert('fetchCreateVerificationCodeAxios err:', err)
          this.utils.showNetError();
        })
        t = setTimeout(this.sended, 1000)
      },
      onHide () {
        console.log('on hide')
        if (this.bindSuccFlag)  //绑定成功返回父页面
        {
          this.$router.back()
        }
      },
    }
  }
</script>

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

  .btn_verify {
    // TODO weex支持 flex only
    background-color: @themeColor;
    margin-top: 30px;
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
    border: 1px solid @ftColorBlack3;
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
