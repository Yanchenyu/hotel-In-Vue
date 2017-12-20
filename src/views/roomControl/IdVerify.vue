<template>
  <div class="contentwrap">
    <!--<x-header :left-options="{showBack: false}" class="xheader vux-override" style="background-color:#25c0b1;">登录</x-header> -->
    <div class="container">
      <div class="title"></div>
      <nav>进入客房</nav>
      <group gutter="0px">
        <button v-if="isAppleDisable()" :disabled="disabled" class="getIdCode cus-normal cus-placeholderColor"
                @click="getRoomCode" :class="{'cus-ftColorGray':disabled,'borderColor':disabled}">{{btnCaption}}
          </button>
        <x-input class="cus-normal xInput" v-model="roomCode" @on-change="idCodeChange" keyboard="number" placeholder="请输入客房码">
        </x-input>
        <div class="thinLine" :class="{lineRed: codeWrong}"></div>
      </group>

      <div class="nextbtn" :class="{loginBtnSuccess: idCodeLoginBtn}" @click="codeVerify">发现{{hotelName}}之美</div>
      <div class="notification cus-h1">{{notification}}</div>
    </div>
    <footer class="cus-normal cus-ftColorBlack3" :style="{'margin-top': marginTop+'px'}">
        <div>
          <span>没有订客房？</span>
          <span class="lo-dotted" @click="nowOrderOne">现在去订一间</span>
        </div>
        <div>
          <span class="lo-dotted" style="margin-top:20px;" @click="jumpToRoomControl">我就看看，我不动</span>
        </div>

      </footer>
  </div>
</template>

<script>
  import {XHeader, Group, XInput, XButton} from 'vux'
  import {roomControlIdVerify, fetchGetRoomCodeAxios, fetchMemberInfoAxios} from '@/services/axiosapi'
  import {mapState} from 'vuex'
  import {isMobile} from '@/utils/validateExp'
  import {storeGet, storeSet} from '@/utils/localStorage'
  import {is_weixin} from '@/utils/device'
  import _ from 'lodash'
  export default {
    name: 'IdVerify',
    components: {
      XHeader, Group, XInput, XButton
    },
    beforeMount() {
      document.title = '身份验证';
      var clientHeight = document.body.clientHeight;
      var heightDiff = clientHeight-529;
      if(heightDiff>0){
        this.marginTop = heightDiff
      }

      if(!_.isEmpty(storeGet("SH_RoomControl","VerifyInfo"))) {
       this.$router.replace({
         name: 'roomcontrol'
       })
      }

      if(localStorage["memberInfo"]){
        this.mobile = storeGet("memberInfo","Phone");
        this.isLogin = true;
      }

      //接口还在测试，测试完成后开放


    },
    beforeDestroy(){
      clearInterval(this.t);
    },
    data () {
      return {
        mobile: '',
        roomCode: '',
        hotelName: '智慧',
        btnCaption: '获取客房码',
        disabled: false,
        second: 60,
        marginTop: 0,
        idCodeLoginBtn: true,
        notification: "",
        phoneWrong: false,
        codeWrong: false,
        isLogin: false,
        t:0,
      }
    },
    methods: {
      isAppleDisable() {
        return !this.utils.isAppleCheck()
      },
      sended() {
        // console.log('on sended')
        if (this.second <= 0) {

          this.disabled = false
          this.btnCaption = "获取客房码";
          this.second = 60;
          // clearTimeout(this.t);  //清除定时
          clearInterval(this.t);
          return;
        } else {
          this.disabled = true
          this.btnCaption = "重新发送(" + this.second + "s)";
          this.second--;
         
        }
      },
      idCodeChange(){
        if(this.roomCode==''){
          this.idCodeLoginBtn = true
        }else{
          this.idCodeLoginBtn = false
        }
      },
      getRoomCode(){
        if(!this.isLogin){
            this.$router.push({
              path: "/roomcontrol/GetPhoneCode/"
            })
        }else{
            // var t = null;
            // clearTimeout(this.t);  //清除定时
                this.disabled = true
                this.btnCaption = "重新发送(" + this.second + "s)";
                this.second--;
                this.phoneWrong = false;
                this.notification = "";
                // this.sended();
                this.t= setInterval(this.sended, 1000)
                //this.t = //setTimeout(this.sended, 1000)
            //调用产生客房码的接口
            let params = {};

            //暂时写死，后面不能写死
            params.hotelId = '68dd0989-c67a-42a9-8d5c-58f7061a677a';

            params.phone = this.mobile
            console.log("params:", params)
            fetchGetRoomCodeAxios(params).then(response => {
              // response TODO 添加异常失败情况检查
              console.log('generateRoomCode response:', response)
              console.log('generateRoomCode clearTimeout t:', this.t)

              if (response.data.Code == '0') {
                // console.log("response:",response.data.Content)
                // this.disabled = true
                // this.btnCaption = "重新发送(" + this.second + "s)";
                // this.second--;
                // this.phoneWrong = false;
                // this.notification = "";
                // this.t = setTimeout(this.sended, 1000)
              } else if (response.data.Code == '21004') {
                this.notification = '入住前一天才能获取客房码哦';
              } else {
                // TODO 显示无查询数据
                // toast可选参数 msg/timeout/type

                // if (response.data.Code=="1") {
                this.notification = response.data.Message;
               // clearTimeout(this.t);  //清除定时
                clearInterval(this.t);
                this.disabled = false
                this.btnCaption = "获取客房码";
                this.second = 60;
                // }
              }
            }).catch(err => {
              // clearTimeout(this.t);  //清除定时
              this.disabled = false
              this.btnCaption = "获取客房码";
              this.second = 60;
              //alert('fetchGetRoomCodeAxios err:', err)
              this.utils.showNetError();
            })
        }



      },
      codeVerify () {
        // 测试代码用于辅助清缓存
        if (this.roomCode == '09876543210') {
          this.utils.toast({msg: '正在清除所有缓存'})
          return;
        }

        if(this.idCodeLoginBtn){
          return
        }

        if(!this.isLogin){
          this.$router.push({
              path: "/roomcontrol/GetPhoneCode/"
            })
        }else{
          // TODO 接口验证.then中push
          var id;
            if(this.$store.state.hotelRoomList.hotelInfo.Id){
              id = this.$store.state.hotelRoomList.hotelInfo.Id
            }else{
              id = '68dd0989-c67a-42a9-8d5c-58f7061a677a';
            }
          let options = {
            phone: this.mobile,
            roomCode: this.roomCode
          }
          this.notification = "验证中..."
          roomControlIdVerify(options).then(response => {
            console.log('roomControlIdVerify:', response.data);
            if (response.data.Code == '0') {
              let params = {}
              params.phone = this.mobile;
              this.$store.dispatch("setUserMobile", this.mobile);
              let content = response.data.Content;

              storeSet("SH_RoomControl","VerifyInfo", content);
              let RoomNumber = response.data.Content.RoomNumber;
              this.$store.dispatch("setRoomNumber", RoomNumber);
              fetchMemberInfoAxios(params).then(response => {
                // 设置头像
                if (response.data.Success == true) {
                  let obj = response.data.Content;
                  storeSet('SH_RoomControl', 'Avatar', obj.Avatar);

                  // 页面跳转
                  this.$router.replace({
                    name: 'roomcontrol'
                  })
                  this.$router.push({
                    name: 'DoorKey'
                  });
                  document.title = RoomNumber;
                } else {
                  // TODO 显示无查询数据

                }
              }).catch(err => {
                //alert('fetchMemberInfoAxios err:', err)
                this.utils.showNetError();
              })


            } else {
              if(response.data.Message == "客房码不正确"){
                this.phoneWrong = false;
                this.codeWrong = true;
              }else{
                this.codeWrong = false;
                this.phoneWrong = true;
              }

              this.notification = response.data.Message
            }
          })
        }




      },
      jumpToRoomControl(){
        this.$router.replace({
          name: 'roomcontrol'
        })
      },
      nowOrderOne(){
        if(is_weixin()) { // 暂时只支持微信中预定
          this.$router.push({
            name: 'hotelroomlist'
          })
        }else {
          //this.utils.toast({msg: '请到微信公众号中订购'});
          this.$router.push({
            name: 'SmartHotel'
          })
        }

      }
    },
    computed: {
      ...mapState({
        stateToast: state => {
          return state.utils.vuxToast.msg + state.utils.vuxToast.display
        }
      })
    },
    watch: {
      // 用于辅助清楚微信和手机app缓存
      stateToast: function (val) {
        if (val == '正在清除所有缓存false') {
          console.log('正在清除所有缓存false condition')
          localStorage.clear()
        }
      }
    }

  }

</script>

<style lang="less" scoped>
  @import '../../styles/common/themeSettings';

  .contentwrap {
    background-color: @panelColor;
    width: 100%;
    height: 100%;
    // position: fixed;
    // top:0; left:0; bottom:0; right:0;
    .title {
      width: 100%;
      height: 90px;
    }
    .container {
      margin: 0 auto;
      padding: 20px 30px 0 30px;
      max-width: 315px;
      height: 350px;
    }
  }

  .xInput {
    padding:16px 0;
    font-size: @ftSize-hl;
  }

  .nextbtn {
    text-align: center;
    margin-top: 50px;
    background-color: @themeColor;
    color: @panelColor;
    border-radius: 5px;
    line-height: 44px;
    font-size: @ftSize-hl;
  }

  nav {
    width: 100%;
    text-align: center;
    margin-bottom: 56px;
    font-size: @ftSize-h2;
  }

  footer {
    width: 100%;
    text-align: center;
    .lo-dotted {
      border-bottom: 1px dotted @ftColorBlack3;
    }
    span{
      display: inline-block;
      line-height: 1.5em;
    }
  }

  .getIdCode {
      position: absolute;
      top: 15px;
      right: 0;
      padding-left: 5px;
      padding-right: 5px;
      border: 1px solid @splitColor;
      border-radius: 5px;
      // width: 80px;
      height: 24px;
      text-align: center;
      line-height: 23px;
      background-color: @panelColor;
      z-index: 100;
    }

    .borderColor {
      border: 1px solid @placeholderColor;
    }

    .loginBtnSuccess {
      background-color: #92dfd8;
    }

    .notification {
      width: 100%;
      text-align: center;
      margin-top: 15px;
      color: #ff7c8e;
    }
    .lineRed {
      background-color: @priceColor;
    }

</style>
