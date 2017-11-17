<template>
<div class="hotelRoomLogin museOverride">
    <header class="cus-flexrow">
      <div class="cus-flexrow-center" :class="{loginWay: index===0}" @click="switchLoginWay(0)">好想住</div>
      <div class="cus-flexrow-center" :class="{loginWay: index===1, hasOrdered: hotelRoomStatus===0}" @click="switchLoginWay(1)">OTA</div>
      <div class="cus-flexrow-center" :class="{loginWay: index===2, hasOrdered: hotelRoomStatus===0}" @click="switchLoginWay(2)">前台</div>
    </header>
    <article>
      <div class="cus-flexrow">
        <div v-show="index === 0" class="cus-flexrow orderNumberMenu">
          <div class="cus-flexrow">
            <div class="menuTitle">订单号</div>
            <div class="orderNumber" :class="{placeHolder: orderNumber == ''}" @click="openOrderBottomSheet">{{orderNumber == '' ? '输入订单号' : orderNumber}}</div>
          </div>
          <div class="notOrderMan cus-flexrow" @click="change">
            <!--<mu-checkbox label="非预定人入住" iconClass="iconClass" :value="false" @change="change"/>-->
            <img width="14px" height="14px" :src="chosedIn" />
            <div>非预定人入住</div>
          </div>
        </div>
        <div class="cus-flexrow" v-show="index === 1">
          <div class="menuTitle">订单来源</div>
          <div class="orderSourceBefore" :class="{orderSource: orderSource == ''}" @click="openOTABottomSheet">{{orderSource == '' ? '输入订单来源' : orderSource}}</div>
        </div>
        <div class="cus-flexrow" v-show="index === 2">
          <div class="menuTitle">酒店名称</div>
          <div class="hotelName">{{hotelMasterUserData.HotelName}}</div>
        </div>
      </div>
      <div class="cus-flexrow">
        <div class="menuTitle">入住人</div>
        <mu-text-field hintText="输入姓名" v-model="userName" @input="userNameChange" :underlineShow='underlineShow' hintTextClass='hintTextClass' inputClass='inputClass'/>
      </div>
      <div class="cus-flexrow">
        <div class="menuTitle">手机号</div>
        <mu-text-field hintText="输入手机号" v-model="userPhone" @input="userPhoneChange" :underlineShow='underlineShow' hintTextClass='hintTextClass' inputClass='inputClass'/>
      </div>
      <div class="cus-flexrow">
        <div class="menuTitle">入住时间</div>
        <mu-date-picker :underlineShow="underlineShow" :minDate="checkInMiniDate" :maxDate="checkInMaxDate" :value="checkInDate" @change="checkInDateChange" :disabled="true" hintText="入住时间"/>
        <div class="toWhen">至</div>
        <mu-date-picker :underlineShow="underlineShow" :minDate="checkOutMiniDate" :value="checkOutDate" @change="checkOutDateChange" :disabled="datePickDisabled" hintText="离店时间"/>
      </div>
      <div class="remark cus-flexrow" :class="{remarkFocus: remarkFocus}">
        <div class="remarkFocusHead" v-show="remarkFocus"></div>
        <div class="menuTitle">备注</div>
        <div class="cus-flexrow" @touchstart="touchStart" @touchend="touchEnd" @click="jumpToRemark">
          <div class="orderStatus">{{orderStatusName}}</div>
          <icon name='turnRight' scale='2.4' style="color:#c8c8cd"></icon>
        </div>
      </div>
    </article>
    <div class="confirm" @click="checkIn">
      <mu-raised-button label="登记入住" class="login-raised-button" />
    </div>
    <div class="notification">{{notification}}</div>
    <mu-bottom-sheet sheetClass="HXZsheet" :open="orderBottomSheet" @close="closeOrderBottomSheet">
      <mu-list @itemClick="closeOrderBottomSheet">
        <mu-list-item v-for="(item,index) in hotelRoomAllList" :title="item.BookerWorkedPhone" :default="index">
          <mu-icon :value="item.BookerName" slot="left"/>
        </mu-list-item>
        <mu-list-item title="取消" class="cancelChoose" default='取消'/>
      </mu-list>
    </mu-bottom-sheet>
    <mu-bottom-sheet sheetClass="OTAsheet" :open="OTABottomSheet" @close="closeOTABottomSheet">
      <mu-list @itemClick="closeOTABottomSheet">
        <mu-list-item title="携程" :class="{choose: orderSource=='携程'}" default='携程'/>
        <mu-list-item title="同程" :class="{choose: orderSource=='同程'}" default='同程'/>
        <mu-list-item title="飞猪" :class="{choose: orderSource=='飞猪'}" default='飞猪'/>
        <mu-list-item title="艺龙" :class="{choose: orderSource=='艺龙'}" default='艺龙'/>
        <mu-list-item title="去哪儿" :class="{choose: orderSource=='去哪儿'}" default='去哪儿'/>
        <mu-list-item title="途家" :class="{choose: orderSource=='途家'}" default='途家'/>
        <mu-list-item title="爱彼迎" :class="{choose: orderSource=='爱彼迎'}" default='爱彼迎'/>
        <mu-list-item title="小猪" :class="{choose: orderSource=='小猪'}" default='小猪'/>
        <mu-list-item title="美团" :class="{choose: orderSource=='美团'}" default='美团'/>
        <mu-list-item title="其他" style="border-bottom:0" :class="{choose: orderSource=='其他'}" default='其他'/>
        <mu-list-item title="取消" class="cancelChoose" default='取消'/>
      </mu-list>
    </mu-bottom-sheet>
</div>
</template>
<script>
import {mapState} from 'vuex'
import {hotelRoomOrderList, hotelRoomAlreadyOrderList, hotelCheckIn} from '@/services/axiosapi'
import {storeGet} from '@/utils/localStorage'
export default {
  activated () {
    // 设置title
    this.$store.dispatch('setRouterTitle', this.hotelRoomDataDetail.RoomNo);
    if (this.reload) {
      // 如果是从客房页面过来，则初始化数据，否则keepalive
      Object.assign(this.$data, this.$options.data());
      this.initialData();
    }
  },
  data () {
    return {
      underlineShow: false, // 是否用下划线
      userName: '', //  页面上显示的用户名
      userPhone: '',  // 页面上显示的手机号
      hxzUserName: '',  // 好想住
      hxzUserPhone: '',
      OTAUserName: '', // OTA
      OTAUserPhone: '',
      qtUserName: '', // 前台
      qtUserPhone: '',
      orderNumber: '',
      orderBottomSheet: false,
      OTABottomSheet: false,
      defaultValue: '',
      orderSource: '',
      chooseHotelRoomOrder: {},
      hotelRoomAllListOriginal: [], // 房间信息列表初始值
      notification: '',  // 错误信息提示,
      hotelRoomAllList: [],
      OTAType: '',
      chosedIn: '../../static/images/chooseOut.png',
      chooseIn: false,
      remarkFocus: false
    }
  },
  methods: {
    initialData () {
      if (this.hotelRoomStatus === 0) {
        // 调用已预订的订单
        this.getHasAlreadyOrder();
      } else if (this.hotelRoomStatus === 2) {
        // 调用全部订单
        this.getAllOrder();
      }
    },
    getHasAlreadyOrder () {
      let token = this.token;
      let id = this.hotelRoomDataDetail.OrderId;
      let params = {
        token: token,
        orderId: id
      };
      hotelRoomAlreadyOrderList(params).then(response => {
        if (response.data.ResultCode === 0) {
          let data = response.data.Data;
          this.$store.dispatch('setHotelRoomAlreadyOrder', data[0]);
          // 下面开始绑定选择的订单数据
          this.orderNumber = data[0].OrderNo;
          this.userName = data[0].BookerName;
          this.userPhone = data[0].BookerPhone;
          this.$store.dispatch('setOrderStatus', data[0].OrderStatus);
          let payload1 = {
            key: 'checkInDate',
            value: data[0].BookStartTime
          }
          this.$store.dispatch('setHotelRoomDate', payload1);
          let payload2 = {
            key: 'checkOutDate',
            value: data[0].BookEndTime
          }
          this.$store.dispatch('setHotelRoomDate', payload2);
        } else if (response.data.ResultCode === 2) {
          this.$store.dispatch('setDialog', [true, '会话已过期，请重新登录', 'login']);
        };
      }).catch(err => {
        console.log(err);
      });
    },
    getAllOrder () {
      let token = this.token;
      let roomTypeId = this.roomTypeId;
      this.$store.dispatch('setOrderStatus', '');
      hotelRoomOrderList({'token': token, 'roomTypeId': roomTypeId}).then(response => {
        if (response.data.ResultCode === 0) {
          this.hotelRoomAllListOriginal = response.data.Data;
          this.$store.dispatch('setHotelRoomOrderList', response.data.Data);
        } else if (response.data.ResultCode === 2) {
          this.$store.dispatch('setDialog', [true, '会话已过期，请重新登录', 'login']);
        }
      }).catch(err => {
        console.log(err);
      })
    },
    switchLoginWay (a) {
      if (this.hotelRoomStatus === 0) {
        // 如果此时为已预订，则OTA和前台都无法选择
        return
      } else {
        this.$store.dispatch('setLoginWayIndex', a);
      }
    },
    change () {
      this.chooseIn = !this.chooseIn;
      if (!this.chooseIn) {
        this.chosedIn = '../../static/images/chooseOut.png'
      } else {
        this.userName = '';
        this.userPhone = '';
        this.chosedIn = '../../static/images/chooseIn.png';
      }
    },
    openOrderBottomSheet () {
      if (this.hotelRoomStatus === 2) {
        // 处理数据
        var allList = this.hotelRoomAllListOriginal;
        allList.forEach(item => {
          let phone = item.BookerPhone;
          let phoneArr = phone.split('');
          phoneArr.splice(3, 4, '*', '*', '*', '*');
          let newPhone = phoneArr.join('');
          item.BookerWorkedPhone = newPhone;
        });
        this.hotelRoomAllList = allList;
        this.orderBottomSheet = true;
      }
    },
    openOTABottomSheet () {
      this.OTABottomSheet = true
    },
    closeOrderBottomSheet (reason) {
      // 选中好想住的bottomSheet
      console.log(reason);
      if (reason.$attrs != undefined) {
        if (reason.$attrs.default != '取消') {
          let index = reason.$attrs.default;
          let hotelRoomAllList = this.hotelRoomAllListOriginal;
          let chooseHotelRoomOrder = hotelRoomAllList[index];
          this.chooseHotelRoomOrder = chooseHotelRoomOrder;
          // 下面开始绑定选择的订单数据
          this.orderNumber = chooseHotelRoomOrder.OrderNo;
          this.hxzUserName = chooseHotelRoomOrder.BookerName;
          this.hxzUserPhone = chooseHotelRoomOrder.BookerPhone;
          this.userName = this.hxzUserName;
          this.userPhone = this.hxzUserPhone;
          this.$store.dispatch('setOrderStatus', chooseHotelRoomOrder.OrderStatus);
        }
      }
      this.orderBottomSheet = false
    },
    closeOTABottomSheet (reason) {
      // 选中OTA的bottomSheet
      if (reason.$attrs != undefined) {
        if (reason.$attrs.default != '取消') {
          this.orderSource = reason.$attrs.default;
        }
      }
      this.OTABottomSheet = false
    },
    checkInDateChange (value) {
      //  修改入住日期
      let payload = {
        key: 'checkInDate',
        value: value
      }
      this.$store.dispatch('setHotelRoomDate', payload);
    },
    checkOutDateChange (value) {
      //  修改离店日期
      let payload = {
        key: 'checkOutDate',
        value: value
      }
      this.$store.dispatch('setHotelRoomDate', payload);
    },
    userNameChange (value) {
      // 用户名修改
      if (this.index === 0) {
        this.hxzUserName = value;
      } else if (this.index === 1) {
        this.OTAUserName = value;
      } else if (this.index === 2) {
        this.qtUserName = value;
      }
    },
    userPhoneChange (value) {
      // 手机号修改
      if (this.index === 0) {
        this.hxzUserPhone = value;
      } else if (this.index === 1) {
        this.OTAUserPhone = value;
      } else if (this.index === 2) {
        this.qtUserPhone = value;
      }
    },
    touchStart () {
      this.remarkFocus = true
    },
    touchEnd () {
      this.remarkFocus = false
    },
    jumpToRemark () {
      // 跳转至备注界面
      this.$router.push({
        name: 'remark'
      })
    },
    checkIn () {
      // 登记入住
      if (this.index === 0) {
        // 好想住入住，如果此时为已预订状态，则不用判断，因为数据唯一且确定，如果状态为空，则需要判断是否选择了订单
        if (this.hotelRoomStatus === 2) {
          if (this.chooseHotelRoomOrder.OrderNo === undefined) {
            this.notification = '请选择订单号';
            return
          }
        }
      };
      if (this.index === 1) {
        if (this.orderSource === '') {
          this.notification = '请选择订单来源';
          return
        }
      };
      if (this.userName == '') {
        this.notification = '入住人不能为空';
        return
      };
      if (this.userPhone == '') {
        this.notification = '手机号不能为空';
        return
      };
      if (this.userPhone.length != 11 || isNaN(this.userPhone)) {
        this.notification = '请输入正确的手机号';
        return
      };
      if (this.orderStatusName != '已支付') {
        this.notification = '请在备注确认支付状态';
        return
      };
      let option = {
        Token: this.token,
        Resident: this.userName,
        PhoneNo: this.userPhone,
        HotelRoomId: this.hotelRoomId,
        RoomNo: this.hotelRoomDataDetail.RoomNo,
        OffLineRoomFee: this.orderMessage.roomCharge,
        Deposit: this.orderMessage.deposit,
        Remark: this.orderMessage.remarkText
      }
      if (this.index === 0) {
        // 好想住登记入住
        if (this.hotelRoomStatus === 0) {
          // 如果当前订单状态为已预订
          option['OrderId'] = this.hotelRoomDataDetail.OrderId;
          option['OrderStatus'] = this.hotelRoomDataAlready.OrderStatus;
        } else if (this.hotelRoomStatus === 2) {
          // 如果当前订单状态为空，则取值从选择的订单列表里面取
          option['OrderId'] = this.chooseHotelRoomOrder.Id;
          option['OrderStatus'] = this.chooseHotelRoomOrder.OrderStatus;
        }
        option['SourceType'] = 0;
        console.log(option);
        hotelCheckIn(option).then(response => {
          if (response.data.ResultCode === 0) {
            this.$router.replace({
              name: 'roomList'
            });
          } else {
            this.notification = response.data.ErrorMessage;
          }
        }).catch(err => {
          console.log(err.ErrorMessage);
        });
      } else if (this.index === 1) {
        // OTA入住
        option['SourceType'] = 2;
        let type = this.orderSource;
        switch (type) {
          case '携程':
            this.OTAType = 1;
            break;
          case '同程':
            this.OTAType = 2
            break;
          case '飞猪':
            this.OTAType = 3
            break;
          case '去哪儿':
            this.OTAType = 4
            break;
          case '艺龙':
            this.OTAType = 5
            break;
          case '途家':
            this.OTAType = 6
            break;
          case '爱彼迎':
            this.OTAType = 7
            break;
          case '小猪':
            this.OTAType = 8
            break;
          case '美团':
            this.OTAType = 9
            break;
          case '其他':
            this.OTAType = 10
            break;
          default: ''
            break;
        };
        option['OTAType'] = this.OTAType;
        option['CheckInTime'] = this.checkInDate;
        option['CheckOutTime'] = this.checkOutDate;
        console.log(option);
        hotelCheckIn(option).then(response => {
          if (response.data.ResultCode === 0) {
            this.$router.replace({
              name: 'roomList'
            });
          } else {
            this.notification = response.data.ErrorMessage;
          }
        }).catch(err => {
          console.log(err.ErrorMessage);
        });
      } else if (this.index === 2) {
        // 前台入住
        option['SourceType'] = 1;
        option['CheckInTime'] = this.checkInDate;
        option['CheckOutTime'] = this.checkOutDate;
        console.log(option);
        hotelCheckIn(option).then(response => {
          if (response.data.ResultCode === 0) {
            this.$router.replace({
              name: 'roomList'
            });
          } else {
            this.notification = response.data.ErrorMessage;
          }
        }).catch(err => {
          console.log(err.ErrorMessage);
        });
      }
    }
  },
  computed: {
    ...mapState({
      roomTypeId: state => state.hotelRoomData.hotelRoomMes.roomTypeId,
      hotelRoomId: state => state.hotelRoomData.hotelRoomMes.hotelRoomId,
      reload: state => state.hotelRoomData.reloadHotelRoomLoginData,
      index: state => state.hotelRoomData.loginWayIndex,
      hotelMasterUserData: state => state.hotelMasterUserData,
      hotelRoomDataDetail: state => state.hotelRoomData.hotelRoomDataDetail,
      hotelRoomDataAlready: state => state.hotelRoomData.hotelRoomDataAlready,
      hotelRoomStatus: state => state.hotelRoomData.hotelRoomStatus,
      checkInMiniDate: state => state.hotelRoomData.hotelRoomDate.checkInMiniDate,
      checkInMaxDate: state => state.hotelRoomData.hotelRoomDate.checkInMaxDate,
      checkOutMiniDate: state => state.hotelRoomData.hotelRoomDate.checkOutMiniDate,
      checkInDate: state => state.hotelRoomData.hotelRoomDate.checkInDate,
      checkOutDate: state => state.hotelRoomData.hotelRoomDate.checkOutDate,
      orderMessage: state => state.hotelRoomData.hotelOrderData.orderMessage,
      orderStatus: state => state.hotelRoomData.hotelOrderData.orderStatus
    }),
    token () {
      let token = this.$store.state.hotelRoomData.hotelRoomMes.token;
      if (token != '') {
        return token
      } else {
        return storeGet('HotelMaster', 'UserData').Token
      }
    },
    datePickDisabled () {
      if (this.hotelRoomStatus === 0) {
        return true
      } else {
        return false
      }
    },
    orderStatusName () {
      switch (this.orderStatus) {
        case 'N':
          return '待支付'
        case 'P':
          return '已支付'
        case 'HC':
          return '已支付'
        default:
          return ''
      }
    }
  },
  watch: {
    index (val) {
      if (val === 0) {
        this.userName = this.hxzUserName;
        this.userPhone = this.hxzUserPhone;
      } else if (val === 1) {
        this.userName = this.OTAUserName;
        this.userPhone = this.OTAUserPhone;
      } else if (val === 2) {
        this.userName = this.qtUserName;
        this.userPhone = this.qtUserPhone;
      }
    }
  }
}
</script>
<style lang='stylus' scoped>
@import "../../styles/common/themeSettings.styl"
.hotelRoomLogin
  margin-top 44px
header
  height 44px
  background-color $panelColor
  padding 10px 0
  line-height 44px
  flex 1
  border-bottom $borderBottom
  div
    flex 1
    text-align center
    font-size $ftSize2
    color #666
    &:not(:last-child)
      border-right $borderBottom
  .loginWay
    color $themeColor
  .hasOrdered
    color $placeholderColor
article
  margin-top 10px
  border-top $borderBottom
  &>div
    .menuTitle
      display inline-block
      color #666
      font-size $ftSize2
      width 80px
      line-height 44px
      height 44px
    .orderSourceBefore
      color #333
      font-size $ftSize2
      width 256px
      line-height 44px
    .hotelName
      color #333
      font-size $ftSize2
      display inline-block
      line-height 44px
    .orderSource
      display inline-block
      color $placeholderColor
      font-size $ftSize2
  .orderNumberMenu
    justify-content space-between
    width 100%
    &>div
      align-items center
    .orderNumber
      display inline-block
      color #333
      font-size $ftSize2
    .placeHolder
      color $placeholderColor
      font-size $ftSize2
    .notOrderMan
      color $placeholderColor
      font-size 13px
      margin-right 10px
      div
        margin-left 6px
        line-height 1em
  .toWhen
    display inline-block
    font-size $ftSize2
    color $placeholderColor
    width 34px
    line-height 1em
  .remarkFocus
    background-color $splitColor
  .remark
    justify-content space-between
    position relative
    &>div:last-child
      height 44px
      line-height 44px
      align-items center
      padding-right 5px
      width 100%
      justify-content flex-end
      .orderStatus
        color #333
        font-size $ftSize2
        display inline-block
        margin-right 5px
    .remarkFocusHead
      position absolute
      top -1px
      left -10px
      width 10px
      height 45px
      background-color $splitColor
.confirm
  margin 30px auto 0 auto
  width 355px
  .login-raised-button
    font-size $ftSize4
    height 44px
    width 100%
    border-radius 6px
    background-color $themeColor
    color $panelColor
.notification
  margin-top 10px
  text-align center
  color $priceColor
  font-size $ftSize2
</style>