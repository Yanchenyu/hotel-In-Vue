<template>
  <div class="contentwrap">
    <x-header v-if="titleBarFlag" class="xheader vux-override" style="background-color:#25c0b1;"
              :left-options="{preventGoBack: true,backText: '关闭'}" @on-click-back='onclose'>
      <span>获取客房码</span>
      <!--<x-icon slot="overwrite-left" style="color:#25c0b1;" type="ios-close" size="35" ></x-icon>-->
    </x-header>
    <div class="container">
      <group gutter="0px">
        <x-input class="cus-normal  vux-override" style="margin-top:20px;margin-left:10px;" v-model="mobile" keyboard="number" placeholder="请输入手机号">
        </x-input>
        <div class="thinLine"></div>
        <div class="content-Div">
          <div class="content"> 您的客房码会以短信方式通知，请注意查收。</div>
        </div>
      </group>

      <div class="nextbtn cus-h2" @click="generateRoomCode">获取客房码</div>
    </div>
  </div>
</template>

<script>
  import {is_weixin} from '@/utils/device'
  import {XHeader, Group, XInput} from 'vux'
  import {fetchGetRoomCodeWithCheckinIdAxios} from '@/services/axiosapi'
  import {mapState} from 'vuex'

  export default {
    name: 'GenerateRoomCode',
    beforeMount() {
      //微信浏览器隐藏导航栏
      if (is_weixin()) this.titleBarFlag = false
      this.queryInfo = {
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
          checkinId: ''
        },
        titleBarFlag: true,
        mobile: ''
      }
    },
    methods: {
      generateRoomCode () {
        //调用产生客房码的接口
        let params = {}
        params.checkinId = this.queryInfo.checkinId
        // params.hotelId='68dd0989-c67a-42a9-8d5c-58f7061a677'
        params.phone = this.mobile
        console.log("params:", params)
        fetchGetRoomCodeWithCheckinIdAxios(params).then(response => {
          // response TODO 添加异常失败情况检查
          console.log('generateRoomCode response:', response)
          if (response.data.Success == true) {
            // console.log("response:",response.data.Content)
            this.utils.toast({msg: "获取客房码请求已发送"})
          } else {
            // TODO 显示无查询数据
            this.utils.toast({msg: response.data.Message})
          }
        }).catch(err => {
          //alert('fetchGetRoomCodeAxios err:', err)
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
    background-color: @panelColor;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    .container {
      padding: 0 10px;
    }
  }

  .nextbtn {
    text-align: center;
    margin-top: 35px;
    background-color: @themeColor;
    color: white;
    border-radius: 5px;
    line-height: 44px;
  }

  .content-Div {
    position: relative;
    color: @ftColorBlack;
    background-color: @panelColor;
    font-size: @ftSize-small;
    height: 44px;
  }

  .content {
    line-height: 44px;
    padding-left: 10px
  }
</style>
