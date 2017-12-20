<template>
  <div>
    <!-- 信息预览 -->
    <div class="orderInfo">
      <div class="cus-h1">
        {{orderInfo.RoomTypeName}}
      </div>
      <div class="cus-small cus-ftColorBlack2">
        <div>{{orderInfo.RoomTypeDescription}}</div>
        <div><span>入住时间：</span>{{orderInfo.BookStartTime}}</div>
        <div><span>离店时间：</span>{{orderInfo.BookEndTime}} <span>&nbsp;&nbsp;共{{daycount}}晚</span></div>
        <div><span>预定{{orderInfo.TotalRooms}}间房</span></div>
      </div>
    </div>
    <!-- 支付选择 -->

    <div class="paychoice cus-normal">
      <div class="cus-flexrow rowwrap " v-show="is_weixin" @click="setPayChoice(2)">
        <span class="cus-flexrow payrow"><icon name="pay-wechat" scale="18" class="svgicon"
                                               style="color:#00c800"></icon><span>微信支付</span></span>
        <icon v-if="paychoice==2" name="raw-checked" scale="2" class="svgicon" style="color:#00c800"></icon>
        <icon v-else name="raw-unchecked" scale="2" class="svgicon" style="color:#a5a2a2"></icon>
      </div>
      <div class="thinLine"></div>
      <div class="cus-flexrow rowwrap " @click="setPayChoice(1)">
        <span class="cus-flexrow payrow"><icon name="pay-ali" scale="18" class="svgicon"
                                               style="color:#00aaef"></icon><span>支付宝支付</span></span>
        <icon v-if="paychoice==1||!is_weixin" name="raw-checked" scale="2" class="svgicon" style="color:#00c800"></icon>
        <icon v-else name="raw-unchecked" scale="2" class="svgicon" style="color:#a5a2a2"></icon>
      </div>
      <!--<div class="thinLine"></div>
       <div class="cus-flexrow rowwrap " @click="setPayChoice(3)">
          <span class="cus-flexrow payrow"><icon name="pay-wechat" scale="18" class="svgicon" style="color:#00c800"></icon><span>微信扫码支付</span></span>
          <icon v-if="paychoice==3" name="raw-checked" scale="2" class="svgicon" style="color:#00c800"></icon>
          <icon v-else name="raw-unchecked" scale="2" class="svgicon" style="color:#a5a2a2"></icon>
      </div>-->
    </div>
    <div class="testSkipPay cus-normal" v-if="skipPay" @click="finishSkipPay">
      <div>免支付完成订单</div>
    </div>

    <!-- 预订 -->
    <div class="orderwrap cus-flexrow">
      <div class="prcicewrap cus-small" style="flex:3;">
        <span class="cus-ftColorBlack2">总额：</span><span class="cus-small cus-priceColor">￥</span><span
        class="cus-h1 cus-priceColor">{{orderInfo.OrderAmount}}</span>
      </div>
      <div class="orderbtn cus-h1" style="flex:2;" @click="payment">
        <span class="cus-h1">支付</span>
      </div>
    </div>
    <div class="AliCover" v-if="aliPayHint" @click="aliPayHint = false">
      <img src="../../assets/images/pay/weixin_alipay.jpg" alt="">
    </div>

    <!-- 离开弹层 -->
    <div v-transfer-dom>
      <confirm v-model="showLeaveConfirm" class="vux-override"
               title=""
               confirm-text="离开" cancelText="继续支付"
               @on-confirm="confirmLeave">
        <div style="text-align:center;">
          <div style="line-height: 1.8em">确定要放弃支付?</div>
          <div class="cus-small cus-ftColorBlack3">超过支付时效后订单将被取消</div>
        </div>
      </confirm>
    </div>
  </div>
</template>

<script>
  import {TransferDomDirective as TransferDom, Checklist, Group, Cell, Radio, Confirm} from "vux"
  import {
    fetchMemberOrderDetailAxios,
    wxScanPay,
    AliPayApi,
    getJsApiParaInfo,
    checkFullHouse,
    book3SkipPay,   // 免支付 测试接口
  } from "@/services/axiosapi"
  import {calcDayscount} from "@/utils/timeUtil.js"
  import {is_weixin} from "@/utils/device"
  import {checkJsAccessTokenValid} from "@/utils/wxAuthorization.js"
  import wx from "weixin-js-sdk"
  import {storeSet, storeGet} from "@/utils/localStorage"
  // 产品未上线前，下单测试白名单
  import {offlineWhiteList} from '@/utils/offlineQAList'
  import {prodOnline} from '@/services/config'

  export default {
    name: 'Book3Preview',
    directives: {
      TransferDom
    },
    components: {
      Checklist,
      Group, Cell,
      Radio,
      Confirm
    },
    beforeMount() {
      this.dataInitial()
      this.loadOrderDetail();
    },

    beforeRouteLeave(to,from,next) {
      if (!this.book3LeaveConfirm && (to.name == 'book2page' || to.name == 'orderlist' || (to.name == 'orderdetail' && !this.skipPayRouterLeave))) {
        console.log('not allowed to leave book2 page')
        this.showLeaveConfirm = true;
        next(false);
        return false;
      }
      next();
    },
    data() {
      return {
        // 订单信息，通过路由 parameters传递订单id，再去查询订单支付详细
        orderId: "",
        Id: "", // 数据库ID
        paychoice: 2,  // 1 支付宝 2 微信JSSDK支付 3 微信扫码支付
        is_weixin: is_weixin(),
        orderInfo: {
          RoomTypeName: "",
          OrderAmount: 0,
          TotalRooms: 1,
          BookStartTime: "2010-01-01",
          BookEndTime: "2010-01-01",
          BookerPhone: "",
          RoomTypeDescription: "",
          payType: 1,     // TODO 结合payType和OrderStatus展示
          OrderStatus: "N",
          HotelName: "",
          PlatId: "", // 订单创建时的信息数据， 与下面的platId 不一定是同一个
          OpenId: "", // 订单openid

          dataLoaded: false,
        },
        aliPayHint: false,
        dayNum: 0,
        // 测试用，必须是白名单成员才可
        skipPay: false, // 免付款直接创建订单
        skipPayRouterLeave: false,  // 免付款导致的页面跳转
        platId: '',     // 用于后台识别入口来源，分情况调用支付接口

        // 页面离开确认用辅助标识
        showLeaveConfirm: false,      // 显示提示框
        book3LeaveConfirm: false,
      }
    },
    methods: {
      // 数据初始化
      dataInitial(){
        this.orderId = this.$route.params.orderId
        console.log("book3 beforeMount", this.orderId)
        this.platId = storeGet('SH_CommonStore', 'PlatId') ? storeGet('SH_CommonStore', 'PlatId'):"";
      },
      // 加載
      loadOrderDetail(){
        let option = {
          orderNo: this.orderId
        };
        fetchMemberOrderDetailAxios(option)
          .then(response => {
            if (response.data.Success == true) {
              let content = response.data.Content;
              this.Id = content.Id;
              this.orderInfo = {
                HotelName: content.HotelName,
                OrderAmount: content.OrderAmount,
                TotalRooms: content.TotalRooms,
                BookStartTime: content.BookStartTime,
                BookEndTime: content.BookEndTime,
                BookerPhone: content.BookerPhone,
                RoomTypeName: content.RoomTypeName,
                RoomTypeDescription: content.RoomTypeDescription,
                payType: content.PayType.Id,            // 1：在线支付
                OrderStatus: content.OrderStatus.Id,    // N: 新建，待支付
                PlatId: content.PlatId,
                OpenId: content.OpenId,
                dataLoaded: true
              };
              this.dayNum = calcDayscount(this.orderInfo.BookStartTime, this.orderInfo.BookEndTime);
              if (prodOnline == false && offlineWhiteList.indexOf(this.orderInfo.BookerPhone) != -1) {
                this.skipPay = true;
              }
            }
          })
          .catch(err => {
            //alert("fetchMemberOrderDetailAxios err:", err)
            this.utils.showNetError();
            console.log("err:", err)
          })
      },
      setPayChoice(val) {
        this.paychoice = val
      },

      // 支付点击，条件检查
      payment() {
        if (!this.is_weixin) {
          this.paychoice = 1
        }
        if (prodOnline == false && offlineWhiteList.indexOf(this.orderInfo.BookerPhone) == -1) {
          this.utils.toast({msg: '产品内测中，敬请期待！'});
          return;
        }
        if (this.orderInfo.dataLoaded == false) {
          console.log("data not loaded yet ")
          this.utils.toast({msg: '正在加载订单信息...'});
          return   // 直接返回    //TODO 提示完善
        }
        if (this.paychoice == 1 && is_weixin()) {
          this.aliPayHint = true
        } else {
          this.paySubmit()
        }
      },

      // 跳转支付页
      paySubmit() {
        let paras = {
          order_no: this.orderId,
          order_subject: this.orderInfo.RoomTypeName,
          order_fee: this.orderInfo.OrderAmount,
          account_no: this.orderInfo.PlatId
        }
        let option = {
          para: JSON.stringify(paras),
          callback: "a"
        }
        if (this.paychoice == 1) {
          AliPayApi(option)
        } else if (this.paychoice == 2) {
          let paras = {
            order_no: this.orderId,
            order_subject: this.orderInfo.RoomTypeName,
            order_fee: this.orderInfo.OrderAmount * 100,
            order_desc: "",   // TODO 替换需要的动态描述
            account_no: this.orderInfo.PlatId      // platid， 商户号
          };
          let option = {
            para: JSON.stringify(paras),
            //openid: storeGet("SH_wxAuth", openidKey)
            openid: this.orderInfo.OpenId
          };
          // 定义需要传给支付之后的参数
          let message = {
            checkIn: this.$store.state.hotelRoomList.calendar.checkIn,
            checkOut: this.$store.state.hotelRoomList.calendar.checkOut,
            order_fee: this.orderInfo.OrderAmount,
            order_no: this.orderId,
            queryInfo: {
              code: '',
              orderNo: this.orderId,
              orderFee: this.orderInfo.OrderAmount,
              orderSubject: this.orderInfo.RoomTypeName,
              orderDesc: ''
            }
          };
          getJsApiParaInfo(option).then(response => {
            let jsApiParameters = response.data.JsApiParameters;
            console.log(jsApiParameters)
            this.wxJsPay(jsApiParameters, message);
          }).catch(err => {
            // TODO 添加err处理
          });
        } else if (this.paychoice == 3){
          let paras = {
            order_no: this.orderId,
            order_subject: this.orderInfo.RoomTypeName,
            order_fee: this.orderInfo.OrderAmount,
            order_desc:'',
            account_no: this.orderInfo.PlatId
          }
          let option = {
            para: JSON.stringify(paras),
            callback: 'a'
          }
          wxScanPay(option);
        }
      },

      // 免支付完成订单、内部测试用
      finishSkipPay() {
        let paras = {
          out_trade_no: this.orderId,
          total_fee: this.orderInfo.OrderAmount,
          trade_no: "Test00000001", trade_status: "sss", pay_method: "1"
        }
        let options = {
          para: JSON.stringify(paras),
          callback: "a"
        }

        this.utils.toast({msg: '订单完成中...'});
        book3SkipPay(options).then(response => {
          this.skipPayRouterLeave = true;
          this.$router.push({
            name: 'orderdetail',
            params: {orderNo: this.orderId}
          })
        }).catch(err => {
          console.log('finishSkipPay catch err:', JSON.stringify(err))
        })
      },
      // 调用微信JS API支付接口
      wxJsPay(para, message){

        if (typeof WeixinJSBridge == "undefined") {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', jsApiCall);
            document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
          }
        } else {
          jsApiCall(para, message).bind(this);
        }

        function jsApiCall(para, message) {
          WeixinJSBridge.invoke(
            'getBrandWCPayRequest',
            para,
            function (res) {
              WeixinJSBridge.log(res.err_msg);
              let url = location.href;
              let index = url.indexOf("#") - 1;
              let baseUrl = url.split("").splice(0, index).join("");
              let queryInfo = message.queryInfo;
              let checkIn = message.checkIn;
              let checkOut = message.checkOut;
              let order_fee = message.order_fee;
              let order_no = message.order_no;

              if (res.err_msg == "get_brand_wcpay_request:ok") {
                // 订单支付成功
                queryInfo.code = 'S';
              } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                // 订单支付失败
                queryInfo.code = 'F';
              } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                // 订单支付取消
                queryInfo.code = 'C';
              } else {
                queryInfo.code = 'E';
              }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。

              if(queryInfo.code != 'C') {
                // 取消支付
                location.href = `${baseUrl}/#/hotel/book4result?Code=${queryInfo.code}&order_no=${queryInfo.orderNo}&order_fee=${queryInfo.orderFee}&order_subject=${queryInfo.orderSubject}&order_desc=${queryInfo.orderDesc}`;
              }

            }
          );
        }
      },

      // 页面离开确认
      confirmLeave(){
        console.log('confirmLeave')
        this.book3LeaveConfirm = true;
        this.$router.replace({
          name: 'membercenter'
        })
      },

    },
    computed: {
      daycount: function () {
        return calcDayscount(this.orderInfo.BookStartTime, this.orderInfo.BookEndTime);
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../styles/common/themeSettings.less";

  .orderInfo {
    padding: 15px 10px 10px 10px;
    background-color: @panelColor;
  }

  // 支付选择
  .paychoice {
    margin-top: 10px;
    background-color: @panelColor;
    padding: 0 10px;
    .rowwrap {
      align-items: center;
      .payrow {
        height: 44px;
        align-items: center;
        flex: 1;
        svg {
          margin-right: 15px;
        }
      }
    }

  }

  .testSkipPay {
    background-color: @panelColor;
    margin-top: 10px;
    line-height: 2em;
    font-size: 18px;
    text-align: center;
    color: white;
    background-color: #25c0b1;
  }

  // 价格和订购
  .orderwrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #ffffff;
    text-align: center;

    .prcicewrap {
      line-height: 50px;
      border-top: 1px solid @pageColor;
    }
    .orderbtn {
      background-color: @themeColor;
      color: #ffffff;
      line-height: 50px;
    }
  }

  .AliCover {
    z-index: 100;
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    background-color: rgba(0, 0, 0, 0.8);
    img {
      width: 100%;
      position: absolute;
      top: 0px;
    }
  }
</style>
