<template>
  <div class="contentwrap">
    <x-header v-if="titleBarFlag" class="xheader vux-override" style="background-color:#25c0b1;"
              :left-options="{preventGoBack: true,backText: '关闭'}" @on-click-back='onclose'>
      <span>客房码转交</span>
      <!--<x-icon slot="overwrite-left" type="ios-close" size="35" ></x-icon>-->
    </x-header>
    <div class="container">
      <div class="content-Div">
        <div class="content"> 您的客房码确认转交给{{queryInfo.phone}}。</div>
      </div>
      <div class="btn_div">
        <div class="cus-flexcolumn" style="flex:1;">
          <div>
            <div class="cus-normal cus-flexcolumn feelistwap">
              <span class="confirmbtn " @click="onConfirm">确认转交</span>
            </div>
            <div class="cus-normal feelistwap">
              <span class="unconfirmbtn " @click="onRefuse">不转交</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {is_weixin} from '@/utils/device'
  import {XHeader, Group, XInput} from 'vux'
  import {fetchConfirmRoomCodeAxios, fetchRefuseRoomCodeAxios} from '@/services/axiosapi'

  export default {
    name: 'ConfirmTransfer',
    beforeMount() {
      //微信浏览器隐藏导航栏
      if (is_weixin()) this.titleBarFlag = false
      this.queryInfo = {
        recordId: this.$route.query.recordId,
        phone: this.$route.query.phone,
        checkinId: this.$route.query.checkinId
      }
      console.log(this.queryInfo)
    },
    components: {
      XHeader, Group, XInput
    },
    data () {
      return {
        queryInfo: {
          recordId: '',
          phone: '',
          checkinId: ''
        },
        titleBarFlag: true,
      }
    },
    methods: {
      onConfirm () {
        //确认转交客房码
        let params = {}
        params.checkinId = this.queryInfo.checkinId
        params.recordId = this.queryInfo.recordId
        params.phone = this.queryInfo.phone
        fetchConfirmRoomCodeAxios(params).then(response => {
          // response TODO 添加异常失败情况检查
          // console.log('generateRoomCode response:',response)
          if (response.data.Success == true) {
            console.log("response:", response.data.Content)
            this.utils.toast({msg: "客房码确认转交请求已发送"});
          } else {
            // TODO 显示无查询数据
            this.utils.toast({msg: response.data.Message})
          }
        }).catch(err => {
          //alert('fetchConfirmRoomCodeAxios err:', err)
          this.utils.showNetError();
        })
      },
      onRefuse () {
        //拒绝转交客房码
        let params = {}
        params.checkinId = this.queryInfo.checkinId
        params.recordId = this.queryInfo.recordId
        fetchRefuseRoomCodeAxios(params).then(response => {
          // response TODO 添加异常失败情况检查
          // console.log('onRefuse response:',response)
          if (response.data.Success == true) {
            console.log("response:", response.data.Content)
            this.utils.toast({msg: "客房码不转交请求已发送"});
          } else {
            // TODO 显示无查询数据
            this.utils.toast({msg: response.data.Message})
          }
        }).catch(err => {
          //alert('fetchRefuseRoomCodeAxios err:', err)
          this.utils.showNetError();
        })
      },
      onclose() {
        var userAgent = navigator.userAgent;
        // console.log("userAgent:",userAgent)
        if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
          window.location.href = "about:blank";
        } else if (userAgent.indexOf('Android') > -1 || userAgent.indexOf('Windows') > -1) {
          window.opener = null;
          window.open('about:blank', '_self', '').close();
        } else {
          window.opener = null;
          window.open("about:blank", "_self");
          window.close();
        }
        console.log("onclose")

      }
    }

  }

</script>

<style lang="less" scoped>
  @import '../../styles/common/themeSettings';

  .contentwrap {
    background-color: white;
    // margin:0px 0px;
    // position:fixed;
    //  left:0; right:0;top:0;bottom:0;
    width: 100vw;
    height: 100%;
    // position: fixed;
    // top:0;
    // left:0;
    // bottom:0;
    // right:0;
    .container {
      padding: 0 10px;
    }
  }

  .btn_div {
    text-align: center;
    margin: 0, 0, 40px, 40px;
    /* Flex 布局 */
    align-items: center;
    * {
      display: flex;
      display: -webkit-flex;
    }

  }

  .confirmbtn {
    text-align: center;
    margin-top: 35px;
    margin-left: 10px;
    padding-left: 50px;
    background-color: @themeColor;
    color: white;
    width: 100px;
    border-radius: 5px;
    line-height: 44px;
  }

  .unconfirmbtn {
    text-align: center;
    margin-top: 35px;
    margin-left: 20px;
    padding-left: 50px;
    background-color: @themeColor;
    color: white;
    width: 100px;
    border-radius: 5px;
    line-height: 44px;
  }

  .content-Div {
    position: relative;
    color: @ftColorBlack;
    background-color: @panelColor;
    font-size: 18px;
    height: 44px;
    margin-top: 20px;
  }

  .content {
    line-height: 44px;
    padding-left: 10px
  }
</style>
