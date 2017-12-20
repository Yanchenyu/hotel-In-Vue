<template>
<div class="outer">
  <div class="bg" :class="{isWx: isWeixin}">
    <!-- 信息说明 -->
    <div class="bookInfo">
      <div class="roomdesc cus-normal cus-flexcolumn">
        <div><span class="roomName">{{roomName}}</span></div>
        <div class="cus-small cus-ftColorBlack2">{{roomDesc}}</div>
      </div>
      <div class="thinLine"></div>
      <div class="daterange cus-small cus-flexrow">
        <div>
          <span class="cus-ftColorBlack3">入住时间:</span>
          <span>{{checkIn}}</span>
          <span class="cus-ftColorBlack3 outRoom">离店时间:</span>
          <span>{{checkOut}}</span>
        </div>
        <div class="cus-themeColor">
          {{dayCount}}晚
        </div>
      </div>
    </div>

    <!-- 订单填写区域 -->
    <div class="orderform ">
      <group gutter="0" class="vuxoverride">
        <x-number class="cus-normal xnumber vux-override" :title="roomcounttitle" v-model="roomcount" :min="1"
                  :max="roomMax>0?roomMax:0" width="30px"></x-number>
        <div class="thinLine"></div>
        <x-input class="cus-normal vux-override" v-model="orderform.bookname" label-width="80px" title="预订人"
                 placeholder="填写姓名"></x-input>
        <div class="thinLine"></div>
        <x-input class="cus-normal vux-override" v-model="orderform.bookmobile" label-width="80px" title="手机号"
                 keyboard="number" placeholder="用于接收短信">
        </x-input>
        <div class="thinLine"></div>
        <popup-picker class="vux-override cus-normal" title="最晚抵店" label-width="80px"
                      valueTextAlign="left"
                      :data="[deadTime]" v-model="choseTime"></popup-picker>
      </group>
    </div>

    <!-- 优惠 折扣选择 -->
    <div class="discountSelectArea cus-normal vux-override-v1" v-if="discountDataList.length > 0">
      <group gutter="10px">
        <cell  class="cus-normal" title="优惠"  is-link  @click.native="showMemberDiscount = true">
          <span slot="after-title">{{discountDisplay}}</span>
        </cell>
      </group>
    </div>
    <!-- 自主选房部分 -->
    <div class="roomSelectArea  cus-normal " v-if="syHotelId != HotelId && this.payType != '到店付'">
      <div class="selWrap cus-flexrow">
        <div>
          <div class="cus-ftColorBlack">
            <span>自主选房</span><span class="price cus-normal cus-priceColor">￥{{roomSelectFee}}</span>
          </div>
          <div class="cus-uncheckedColor">
            选中自主选房你可以像电影院选座一样选择你心仪的房间
          </div>
        </div>
        <div>
          <group gutter="0">
            <x-switch title="" class="vux-override" v-model="showRoomSwitch"></x-switch>
          </group>
        </div>
      </div>
      <template v-if="selfSelectRoomStr">
        <div class="thinLine"></div>
        <div class="selResult">
          <group gutter="0">
            <cell title="已选房间" class="vux-override cus-normal" is-link @click.native="showRoomSelect = true">
              <span slot="after-title">{{selfSelectRoomStr}}</span>
            </cell>
          </group>
        </div>
      </template>

    </div>

    <!-- 扣款说明 -->
    <div class="cus-normal feeNote" v-if="orderPayName=='在线支付'"><span class="cus-ftColorBlack">扣款说明：</span><span class="cus-ftColorBlack3">该订单确认后，入住日期（<span>{{checkIn}}&nbsp;00:00</span>）前可以申请退款，逾期或未入住将收取你首日全额房费RMB<span>{{finalPrice}}</span>。酒店会根据你的付款方式扣除房费，如订单不确认将全额退款至你的付款账户中。附加服务费用将与房费同时扣除或退还。</span></div>


    <!-- 折扣优惠 - 选择折扣弹层 -->
    <div v-transfer-dom>
      <popup v-model="showMemberDiscount" width="100vw" height="100vh">
        <DiscountSelect v-on:confirmCouponSelect="confirmCouponSelect" :coupons="discountDataList"></DiscountSelect>
      </popup>
    </div>
    <!-- 自主选房 - 房间选择页面弹层 -->
    <div v-transfer-dom>
      <popup v-model="showRoomSelect" width="100vw" height="100vh">
        <RoomSelectContainer :isRoomSelectShow="showRoomSelect" :showRoomSwitch="showRoomSwitch"
                             :roomDate="subRoomSelectData"
                             v-on:selectConfirmed="selectConfirmed" ></RoomSelectContainer>
      </popup>
    </div>

    <!-- 价格明细 -->
    <div class="priceDetailList" v-show="showDetails">
      <div class="priceDetailDiv">
        <div class="originalPrice" v-for="(item,index) in dailyPrice">
          <div class="cus-flexrow detailEach">
            <span>{{item.Date}}</span>
            <span class="breakfast">{{item.Breakfast}}</span>
            <span>￥{{item.DailyRate}}×{{roomcount}}间</span>
          </div>
          <div style="width:100%;height:15px" v-if="index < (dailyPrice.length - 1)"></div>
        </div>
      </div>
      <div class="thinLine" style="margin: 0 10px;" v-if="discountIndex != -1"></div>
      <div style="padding-top: 18px;padding-bottom:18px;" v-if="discountIndex != -1">
        <div class="discountPrice" v-for="(item,index) in discountPriceList">
          <div class="cus-flexrow detailEach">
            <span>{{item.Date}}</span>
            <span class="promotionDescription">{{item.discountDesc}}</span>
            <span v-if="item.discountValue < 0">-￥{{-item.discountValue}}x{{roomcount}}间</span>
            <span v-else>+￥{{item.discountValue}}x{{roomcount}}间</span>
          </div>
          <div style="width:100%;height:15px"
               v-if="index < (Content.length - 1) && item.PromotionalRate<item.RackRate"></div>
        </div>
      </div>
      <div class="selectClass" v-show="showRoomSwitch">
        <div class="cus-flexrow detailEach">
          <span>{{checkIn}}</span>
          <span class="breakfast">自主选房</span>
          <span>￥{{roomSelectFee}}</span>
        </div>
      </div>
    </div>

    <div class="shadow" @click="hideDetails" v-show="showDetails"></div>

    <!-- 提交失败 -->
    <x-dialog
      v-model="showValue"
      :hide-on-blur="false">
      <div class="weui-dialog__bd">
        <slot>
          <div>订单提交失败</div>
        </slot>
      </div>
      <div class="weui-dialog__ft">
        <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" @click="_onCancel">取消</a>
        <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click="_onConfirm">重新提交</a>
      </div>
    </x-dialog>

    <!-- 离开页面确认提示 -->
    <div v-transfer-dom>
      <confirm v-model="showLeaveConfirm" class="vux-override"
               title=""
               confirm-text="离开" cancelText="继续填写"
               @on-confirm="confirmLeave">
        <p style="text-align:center;" class="cus-normal">订单即将完成，你确定要离开吗?</p>
      </confirm>
    </div>
  </div>
  <!-- 预订 -->
    <div class="orderwrap cus-flexrow" :class="{appTabbarShow: tabshow}">
      <div class="prcicewrap cus-small" style="flex:3;" @click="showPriceDetails">
        <!-- 价格明细 -->
        <span class="priceLeft cus-flexcolumn">
            <p class="cus-small cus-priceColor"><span class="cus-ftColorBlack2">总额：</span> ￥<span class="cus-h1 cus-priceColor">{{finalPrice}}</span></p>
            <p class="cus-uncheckedColor" v-if="discountIndex != -1">{{totalDiscount}}元</p>
          </span>
        <!-- 费用明细 -->
        <span class="priceRight cus-flexrow-center cus-uncheckedColor">
            费用明细
            <img src="@/../static/images/downIcon.png" :class="{'turnUP':showDetails}" width="15px;"/>
          </span>
      </div>

      <div class="orderbtn cus-h1" style="flex:2;" @click="book2submit">
        <span class="cus-h1">{{submitBtnTxt}}</span>
      </div>

    </div>
</div>
</template>

<script>
  import {calcDayscount, daysLater, formatDate} from '@/utils/timeUtil'
  import {TransferDomDirective as TransferDom,Popup, XInput, Group, XNumber, PopupPicker, XDialog, XSwitch, Cell, Confirm } from 'vux'
  import RoomSelectContainer from '@/components/book/RoomSelectContainer'
  import DiscountSelect from '@/components/book/DiscountSelect'
  import {mapState, mapGetters} from 'vuex'
  import {
    book2SubmitCreateOrder, getHotelPriceData,
    getRoomSelectFee
  } from '@/services/axiosapi'
  import {ls_unionId} from '@/utils/localStorage'
  import * as validate from '@/utils/validateExp'
  import {storeSet, storeGet} from "@/utils/localStorage"
  import _ from 'lodash'
  import {is_weixin} from '@/utils/device'

  /**
   * 计算生成最晚到店时间数组
   * @param {string} dtStr 格式YYYY-MM-DD HH:MM // TODO 需要后台删掉YYYY-MM-DD
   */
  const calcDeadTime = (dtStr) => {
    const time = dtStr.split(/:| /)
    let retArr = []

    for (var startHH = 17; startHH < time[1]; startHH++) {
      retArr.push(startHH + ':00')
    }
    retArr.push(time[1] + ":" + time[2])
    return retArr
  }

  export default {
    name: 'Book2Page',
    directives: {
      TransferDom
    },
    components: {
      XInput, Group, XNumber, PopupPicker, XDialog, XSwitch, Popup,Cell,Confirm,
      RoomSelectContainer,
      DiscountSelect
    },

    beforeMount() {
      console.log('选择数组的长度: '+this.testRoomListLength);
      console.log('选择数组的索性：'+this.testIdx);
      console.log('选择数组元素的Name：'+this.roomName);
      console.log(this.testRoomListEach);
      this.isWeixin = is_weixin();
      this.dataInitial();
      // 获取自主选房附加费价格
      this.getHotelRoomSelectFee();
      // 酒店房间基本价格信息和折扣信息
      this.getHotelRoomPriceInfoData();
    },
    mounted() {
      var h = this.scrollHeight;
      window.onresize = () => {
        if (document.body.scrollHeight < h) {
            this.tabshow = true;
            document.body.style.background = "#fff"
        }else{
            this.tabshow = false;
            document.body.style.background = "#eee"
        }
      }
    },
    beforeDestroy(){
    },
    beforeRouteLeave(to,from,next){
      // 离开功能屏蔽
      if(false && !this.book2LeaveConfirm && to.name == 'hotelroomlist') {
        console.log('not allowed to leave book2 page')
        this.showLeaveConfirm = true;
        next(false);
        return false;
      }
      // 通知子组件取消已选中的房间
      if(to.name == 'hotelroomlist' && this.showRoomSwitch) {
        console.log('book2 beforeRouteLeave need to cancel room 1st')
        this.showRoomSwitch = false;
        this.$nextTick(() => {
          // watcher更新之后，再销毁
          next();
        })
      } else {
        console.log('book2 beforeRouteLeave gogogo')
        next();
      }
    },
    data() {
      return {
        isWeixin: false, // 判断是否在微信环境
        orderform: {
          bookname: '',
          bookmobile: '',

        },
        roomcount: 1,
        choseTime: ['18:00'],

        toastText: '正在提交订单...',
        toastFlag: false,
        isSubmitting: false,
        queryInfo: {
          orderNo: ''
        },
        showValue: false,   // 提交失败

        // TO delete
        Content: [],
//        totalPrice: 0,
        allPriceSingle: 0,
        RackRate: 0,
        showDetails: false,
        benefit: 0,
        benefitSingle: 0,
        benefitOpen: true,
        // 价格和折扣数据获取
        dailyPrice: [],
        // vvv 折扣价格
        showMemberDiscount: false,  // 弹层开关
        discountIndex: -1,    // 折扣选择的索引
        discountRate:1,       // 折扣率, 规则 0-2为乘法(折扣率)，其它数字为加法(单位元)
        discountDataList:[],    // 用户可以选择的折扣列表
        discountLoaded: false,  // 加载结束标识
        // ^^^ 折扣价格
        // 价格计算辅助数据
        accDiscountValue: 0,
        // vvv 自主选房部分
        showRoomSwitch: false,  // 加钱自主选房功能是否开启
        showRoomSelect: false,  // 弹出房间选择开关
        selfSelRoomList: [],        // 自主选房房间总数
        subRoomSelectData:{      // TODO 条件可以时放开，使用真实数据
          checkIn: '2017-08-11',  // 入住时间
          checkOut: '2017-08-12', // 离店时间
          name: '智慧客房',
          extra: '智慧客房',
          price: 128,
          roomTypeId: "6977981f-8a1f-435d-8d70-546b1eebad61",  // 房间类型
          hotelId: "68dd0989-c67a-42a9-8d5c-58f7061a677a",     // 酒店id , this.HotelId
        },
        roomSelectFee: 10, // 自主选房收取费用
        platId: '',   // 平台id，商户号
        payType: '',  // 支付类型获取
        syHotelId: '',    // suyu的酒店id，用于屏蔽功能
        // ^^^
        // 页面离开确认用辅助标识
        book2LeaveConfirm: false,     // true时，可以回到前一个页面
        showLeaveConfirm: false,      // 显示提示框
        scrollHeight: document.body.scrollHeight,
        tabshow: false
      }
    },
    methods: {
      // 数据初始化
      dataInitial(){
        // 子组件使用数据更新
        this.subRoomSelectData.name = this.roomName;
        this.subRoomSelectData.roomTypeId=this.roomTypeId;
        this.subRoomSelectData.hotelId=this.HotelId;
        this.subRoomSelectData.checkIn=this.checkIn;
        this.subRoomSelectData.checkOut=this.checkOut;
        //this.subRoomSelectData.price=this.totalPrice; // 房间单价格此时赋值过早
        this.platId = storeGet('SH_CommonStore', 'PlatId')?storeGet('SH_CommonStore', 'PlatId'):''; // 'SY001'
        this.syHotelId = storeGet('SH_CommonStore', 'syHotelId')    // suyu的酒店id
        this.payType = this.$store.state.hotelRoomList.roomList[this.$store.state.hotelRoomList.roomSelectIdx].PayType.Name;
      },
      // 获取房间价格和折扣信息
      getHotelRoomPriceInfoData() {
        let mobile =storeGet('memberInfo', 'Phone');
        let option = {
          HotelId: this.HotelId,
          RoomTypeId: this.roomTypeId,
          StartTime: this.checkIn,
          EndTime: this.checkOut,
          UnionId: ls_unionId(),
          OrderOwnerPhone :mobile,  // APP中下单时，持有人有登陆的情况下，传递自己的手机号
        };
        getHotelPriceData(option).then(response => {
          if (response.data.Code == '0') {
            this.dailyPrice = response.data.Content.DailyRates
            this.discountDataList = response.data.Content.Promotions
            this.discountLoaded = true;

            // 价格计算, watch， computed去做
          }
        }).catch(err => {
          console.log(err);
        })
      },
      // 自主选房价格获取
      getHotelRoomSelectFee() {
        getRoomSelectFee()
          .then(response => {
            if (response.data.Code == '0') {
              this.roomSelectFee = response.data.Content.SelectRoomFee;
            }
          })
          .catch(err => {
          })
      },
      // 填写信息验证
      formValidate() {
        if (this.orderform.bookname == "") {
          console.log()
          this.utils.toast({msg: '请填写姓名'});
          return false
        }

        if (this.orderform.bookmobile == "") {
          console.log()
          this.utils.toast({msg: '请填写手机号'});
          return false
        } else if (!validate.isMobile(this.orderform.bookmobile)) {
          this.utils.toast({msg: '请填写正确的手机号'});
          return false
        }

        return true
      },
      book2submit() {
        if (this.isSubmitting == true) {
          return;
        }
        if (this.formValidate()) {
          let _platid = ''
          let _openid = ''
          if(is_weixin()) {
            let openidKey = "openid";
            if (this.platId) {
              openidKey = `openid_${this.platId}`;
            }
            _openid = storeGet("SH_wxAuth", openidKey)?storeGet("SH_wxAuth", openidKey):''
            _platid = this.platId
          } else {
            _platid = this.PayAccountNo
          }


          let mobile =storeGet('memberInfo', 'Phone');
          let options = {
            HotelId: this.HotelId,
            RoomTypeId : this.roomTypeId,
            BookerPhone: this.orderform.bookmobile,
            TotalRooms: this.roomcount,
            BookerName: this.orderform.bookname,
            StartTime: this.checkIn,
            EndTime: this.checkOut,
            Amounts: this.finalPrice,
            ReservedTime: this.choseTime[0],
            UnionId: ls_unionId(),
            OpenId: _openid,
            // vvv 20170822 接口调整
            PlatId: _platid,
            SelectedRoomIds:this.selfSelectRoomIdStr,       // 选择的房间列表 用空格间隔
            SelectedRoomFee: this.showRoomSwitch?this.roomSelectFee:0,        // 自主选房的价格
            PromotionName: encodeURI(this.discountDisplay),
            OrderOwnerPhone:mobile,     // TODO app添加
            // ^^^
          }

          console.log('Submit book2')
          console.log('Submit book2 this.selfSelectRoomIdStr',this.selfSelectRoomIdStr)

          this.isSubmitting = true;
          this.utils.toast({msg: '正在提交订单...'});

          book2SubmitCreateOrder(options).then(response => {
            this.isSubmitting = false;
            console.log('create order res:', response)

            if (response.data.Code == '0') {
              let content = response.data.Content
              this.toastFlag = false;

              // IOS 使用landing page作为支付和复制地址，此处只能用location.href不能用history.pushState
              console.log(content);
              if (this.payType == '在线支付') {
                let url = location.href;
                let index = url.indexOf("#") - 1;
                let baseUrl = url.split("").splice(0, index).join("");
                storeSet('SH_HOTEL_BOOK', 'ROOM_SELECTLIST',{});
                location.href = `${baseUrl}/#/hotel/book3preview/${response.data.Content.OrderNo}`
              } else if (this.payType == '到店付') {
                this.queryInfo.orderNo = content.OrderNo;
                this.$router.push({
                  name: 'orderdetail',
                  params: {orderNo: this.queryInfo.orderNo}
                })
              }
            } else {
              if (response.data.Code == '20001') {
                this.utils.toast({msg: '房间配额不足'});
              } else if (response.data.Code == '20002') {
                this.utils.toast({msg: '存在未支付订单'});
              } else if (response.data.Code == '20003') {
                this.utils.toast({msg: '订单金额不匹配'});
              } else {
                this.utils.toast({msg: response.data.Message});
              }
            }
            //this.showValue = true;
          }).catch(err => {
            this.isSubmitting = false;
            // TODO 添加更多错误提示信息
          })
        }


      },
      _onConfirm () {
        this.showValue = false;
        this.book2submit();
      },
      _onCancel () {
        this.showValue = false;
        this.isSubmitting = false;
      },
      showPriceDetails(){
        this.showDetails = !this.showDetails;
      },
      hideDetails(){
        this.showDetails = false;
      },

      // 优惠券确认选择
      confirmCouponSelect(idx, rate) {
        console.log(idx,rate)
        this.showMemberDiscount = false;
        this.discountIndex = idx;
        this.discountRate = rate;
      },
      // 自主选房确认选择
      selectConfirmed(roomlist) {

        this.selfSelRoomList = roomlist;
          console.log("selectConfirmed this.selfSelRoomList",this.selfSelRoomList)
        this.roomcount = roomlist.length || 1;
        this.showRoomSelect = false;
        if(roomlist.length == 0) {
          this.showRoomSwitch = false;
        }
      },

      // 页面离开确认
      confirmLeave(){
        console.log('confirmLeave')
        this.book2LeaveConfirm = true;
        this.$router.go(-1)

      },
    },
    watch: {
      // 自动选房，需要帮用户自动打开弹层
      showRoomSwitch(val){
        if(val) {
          this.showRoomSelect = true;
          this.subRoomSelectData.price = this.accUnitRoomPromotionPrice;
        } else {
          // 关闭，需要取消已经选择的房间
        }
      },

      discountIndex(val) {
        if(val == -1) {
          this.accDiscountValue = 0;
        }
      },
    },
    computed: {
      dayCount: function () {
        return calcDayscount(this.checkIn, this.checkOut);
      },
      // v-html语法 传递给title动态显示，TODO 1.需要注意roomcount验证  2. width动态同步
      roomcounttitle: function () {
        return `<span style="display:inline-block; width:75px;">房间数</span>
              <span style="">${this.roomcount}间</span>`;
      },
      submitBtnTxt (){
        return this.isSubmitting ? '提交中' : '提交订单 '
      },

      deadTime () {
        // if (this.ReservedTime.Display) {
        //   return calcDeadTime(this.ReservedTime.Content)
        // }
        return ['18:00','19:00','20:00','21:00','22:00']
      },
      // 用户折扣选择显示
      discountDisplay() {
        if(!this.discountLoaded) {
          console.log('discountDisplay 01')
          return ''
        }
        if(this.discountDataList.length > 0 && this.discountIndex != -1 && this.discountIndex < this.discountDataList.length) {
          console.log('discountDisplay 02')
          return this.discountDataList[this.discountIndex].Name
        } else {
          console.log('discountDisplay 03')
          return ''
        }
      },
      // 折扣有效期和入住离店混合计算后的折扣详细列表
      discountPriceList() {
        if(this.discountIndex == -1) {
          return []
        } else {
          // 用户选择的折扣规则
          let discountRule = this.discountDataList[this.discountIndex]

          // 优惠显示文字
          let discountDesc = ''
          if(discountRule.Rate > 0 && discountRule.Rate < 2) {
            discountDesc = `${(discountRule.Rate * 100)%10?discountRule.Rate * 100:discountRule.Rate * 10}折`
          } else if(discountRule.Rate > 0) {
            discountDesc = `加${discountRule.Rate}元`
          } else {
            discountDesc = `减${-discountRule.Rate}元`
          }

          // 起始、结束日期选择
          let minDay = new Date(this.checkIn).getTime() > new Date(discountRule.StartDate).getTime()? this.checkIn: discountRule.StartDate;
          let checkoutDate = formatDate(daysLater(this.checkOut,-1))
          let maxDay = new Date(checkoutDate).getTime() < new Date(discountRule.EndDate).getTime() ? checkoutDate : discountRule.EndDate;
          // 日期遍历，交集计算折扣
          let retArr = []
          let totalSingleDiscount = 0; // 单间房间的累计折扣金额
          for (var i = minDay; new Date(i).getTime() <= new Date(maxDay).getTime(); i = formatDate(daysLater(i,1))) {
            // 优惠金额计算
            let discountValue = 0;    // 绝对值，单位元，带正负号
            let originalPriceIndex = _.findIndex(this.dailyPrice, function(o) { return o.Date == i; });

            if (discountRule.Rate > 0 && discountRule.Rate < 2) {
              if (originalPriceIndex != -1) { // 原价寻找
                // 取整 正负数Math.floor规则不一样； 一定要加toFixed. 不然会出现浮点运算结果不正确的问题
                if(discountRule.Rate < 1) {
                  discountValue = Math.floor(this.dailyPrice[originalPriceIndex].DailyRate * (discountRule.Rate - 1).toFixed(3));
                } else {
                  discountValue = Math.ceil(this.dailyPrice[originalPriceIndex].DailyRate * (discountRule.Rate - 1).toFixed(3));
                }
              }
            } else {
              discountValue = discountRule.Rate
            }
            totalSingleDiscount += discountValue;   // 累计折扣金额
            retArr.push({
              Date: i,
              discountDesc:discountDesc,
              discountValue: discountValue,
            })
          }
          // 房间单价累加，折扣累加
          this.accDiscountValue = totalSingleDiscount;
          return retArr
        }
      },

      // 单间房价（入住到离店）累计[不含折扣]
      accRoomPrice() {
        let ret = 0;
        this.dailyPrice.forEach(item => {
          ret += item.DailyRate
        })
        return ret;
      },

      //单间房价累计[含折扣]
      accUnitRoomPromotionPrice() {
        return this.accRoomPrice + this.accDiscountValue;
      },
      // 房间总价计算 [折扣后的]房间累计单价*房间数
      totalPrice() {
        return this.accUnitRoomPromotionPrice * this.roomcount;
      },
      // 优惠总额
      totalDiscount() {
        if(this.accDiscountValue > 0) {
          return `涨价${this.accDiscountValue*this.roomcount}`
        } else {
          return `已优惠${-this.accDiscountValue*this.roomcount}`
        }

      },
      // 自主选房的房名列表字符串
      selfSelectRoomStr(){
        if(this.selfSelRoomList.length < 1) {
          return ''
        } else {
          return this.selfSelRoomList.map((item)=>{
            return item.roomName
          }).join(',')
        }
      },
      selfSelectRoomIdStr(){
        // console.log('selfSelectRoomIdStr this.selfSelRoomList',this.selfSelRoomList)
        if(this.selfSelRoomList.length < 1) {
          return ''
        } else {
          return this.selfSelRoomList.map((item)=>{
            return item.hotelRoomId
          }).join(',')
        }
      },
      // 加上自主选房后的总价， 前面totablPrice计算的地方过滤散乱
      finalPrice() {
        if(this.showRoomSwitch) {
          // 自主选房时加钱
          return parseInt(this.totalPrice) + parseInt(this.roomSelectFee);
        } else {
          return this.totalPrice;
        }
      },
      ...mapState({
        HotelId: state => state.hotelRoomList.hotelInfo.Id,
        PayAccountNo: state => state.hotelRoomList.hotelInfo.PayAccountNo,
        roomName: state => state.hotelRoomList.roomList[state.hotelRoomList.roomSelectIdx].Name,
        roomDesc: state => state.hotelRoomList.roomList[state.hotelRoomList.roomSelectIdx].Description,
        ReservedTime: state => state.hotelRoomList.roomList[state.hotelRoomList.roomSelectIdx].ReservedTime,
        RoomRate: state => state.hotelRoomList.roomList[state.hotelRoomList.roomSelectIdx].RoomRate,
        checkIn: state => state.hotelRoomList.calendar.checkIn,
        checkOut: state => state.hotelRoomList.calendar.checkOut,
        roomTypeId: state => state.hotelRoomList.roomList[state.hotelRoomList.roomSelectIdx].Id,
        roomMax: state => state.hotelRoomList.roomList[state.hotelRoomList.roomSelectIdx].AvalibleRoomCount,
        orderPayName: state => state.hotelRoomList.roomList[state.hotelRoomList.roomSelectIdx].PayType.Name,
        testRoomListLength: state => state.hotelRoomList.roomList.length,
        testIdx: state => state.hotelRoomList.roomSelectIdx,
        testRoomListEach: state => state.hotelRoomList.roomList[state.hotelRoomList.roomSelectIdx]
      }),
    }
  }
</script>

<style lang="less" scoped>
  @import '../../styles/common/themeSettings.less';

  .bg {
    // margin-bottom: 60px;
    position: absolute;
    top: 64px;
    left: 0;
    bottom: 50px;
    right: 0;
    overflow-y: scroll;
  }

  .isWx {
    top: 0;
  }

  /* 订单描述 */
  .bookInfo {
    border-top: 15px solid @themeColor;
    border-bottom: 15px solid @themeColor;
    border-left: 10px solid @themeColor;
    border-right: 10px solid @themeColor;

    background-color: @panelColor;
    .roomdesc {
      height: 46px;
      padding: 0 10px;
      justify-content: center;
    }

    .daterange {
      padding: 0 10px;
      height: 32px;
      line-height: 32px;
      justify-content: space-between;
    }
    .roomName {
      font-weight: 500
    }
    .outRoom {
      padding-left:5px;
    }
  }

  .feeNote {
    margin-top: 12px;
    padding: 0 10px;
  }

  /* 订单填写 */
  .orderform {
    margin-top: 10px;
    background-color: @panelColor;
    padding: 0 10px;
  }
  /* 房型选择开关区域 */
  .roomSelectArea {
    margin: 10px 0;
    background-color: white;

    /* 开关区域 */
    .selWrap {
      padding: 10px;
      /* 左边的div */
      &>div:first-child {
        flex: 1;
        padding-top: 1px;
        padding-bottom: 1px;
        /* 第一行的div*/
        &>div:first-child {
          margin-bottom: 10px;
        }
      }
      /* 右边的div */
      &>div:last-child {
        width: 135px;
      }
      .price {
        display: inline-block;
        margin-left:24px;
      }
    }

    /* 跳转选择和结果区域 */
    .selResult {
      padding: 0 10px;
    }
    .thinLine {
      margin-left: 10px;
    }
  }

  // 价格和订购
  .orderwrap {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: @panelColor;
    // text-align: center;
    z-index: 101;

    .prcicewrap {
      // line-height:50px;
      // border-top: 1px solid @pageColor;
      position: relative;
    }
    .priceLeft {
      position: absolute;
      left: 10px;
      height: 100%;
      justify-content: center;
    }
    .priceRight {
      position: absolute;
      right: 10px;
      line-height: 50px;
    }
    .orderbtn {
      background-color: @themeColor;
      color: @panelColor;
      text-align: center;
      line-height: 50px;
    }
  }

  .shadow {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.4;
    z-index: 100;
  }

  .turnUP {
    transform: rotate(180deg);
    -ms-transform: rotate(180deg); /* IE 9 */
    -moz-transform: rotate(180deg); /* Firefox */
    -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
    -o-transform: rotate(180deg);
  }

  .priceDetailList {
    position: fixed;
    bottom: 49px;
    left: 0;
    width: 100%;
    font-size: @ftSize-normal;
    color: @uncheckedColor;
    z-index: 101;
    max-height: 330px;
    overflow: auto;
    background: @popColor;
  }

  .priceDetailDiv {
    margin-top: 18px;
    margin-bottom:18px;
  }

  .breakfast {
    position: absolute;
    width: 100%;
    text-align:center;
    top:0;
    left:0
  }

  .selectClass {
    margin-bottom: 18px;
    padding: 0 10px;
  }

  .promotionDescription {
    position: absolute;
    width: 100%;
    text-align:center;
    top:0;
    left:0
  }

  .originalPrice {

  }

  .originalPrice, .discountPrice {
    padding: 0 10px;
  }

  .detailEach {
    justify-content: space-between;
    position: relative;
  }

  /* 折扣价格区域 */
  .discountSelectArea {
    /* 此处不能覆盖 vux自组件的样式 */
  }

  .appTabbarShow {
    display: none !important;
  }
</style>
