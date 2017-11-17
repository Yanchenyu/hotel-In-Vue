<template>
<div class="checkInRoom museOverride">
    <header>入住人</header>
    <article>
        <div class="cus-flexrow" v-for="item in dataList">
            <div>{{item.CustomerName}}</div>
            <div>{{item.Phone}}</div>
            <div></div>
        </div>
    </article>
    <section class="cus-flexrow" :class="{doorFocus: doorFocus1}" @touchstart="touchStart(1)" @touchend="touchEnd(1)" @click="openDoor">
        <div>打开房门</div>
        <icon name='turnRight' scale='2.4' style="color:#c8c8cd"></icon>
    </section>
    <section class="cus-flexrow" :class="{doorFocus: doorFocus2}" @touchstart="touchStart(2)" @click="sendDoorPassword">
        <div>发送门锁密码</div>
        <span class="countDown" v-show="doorFocus2">{{second+'S'}}</span>
        <icon name='turnRight' scale='2.4' style="color:#c8c8cd"></icon>
    </section>
    <div class="checkOutRoom" @click="checkOut">
        <mu-raised-button label="一键退房" class="login-raised-button" />
    </div>
</div>
</template>
<script>
import {openDoor, getHotelCustomers, hotelCheckOut, sendDoorPassword} from '@/services/axiosapi'
import {mapState} from 'vuex'
import {storeGet, storeSet} from '@/utils/localStorage'
export default {
  beforeMount () {
    this.$store.dispatch('setRouterTitle', this.roomNo);
    this.initialData();
    let timePassed = new Date().getTime() - storeGet('HotelMaster', 'CheckedInRoomCountDownNowTime');
    if (storeGet('HotelMaster', 'CheckedInRoomCountDown') * 1000 - timePassed > 0) {
      // 表示上一个倒计时还没有结束，此时再分情况讨论：如果此时是刚刚那个组件，倒计时继续，如果不是，则不展示倒计时，但是不会清空倒计时
      if (storeGet('HotelMaster', 'CheckedInCountDownStartRoomNo') == this.roomNo) {
        // 同一个房间或者回到之前的房间
        this.second = Math.round(storeGet('HotelMaster', 'CheckedInRoomCountDown') - timePassed / 1000);
        this.doorFocus2 = true;
        setTimeout(this.sended, 1000);
      }
    }
  },
  data () {
    return {
      phone: '',
      dataList: [],
      doorFocus1: false,
      doorFocus2: false,
      second: 60  // 倒计时秒数
    }
  },
  beforeDestroy () {
    if (storeGet('HotelMaster', 'CheckedInRoomCountDownStart')) {
      // 表示倒计时还没有结束，记录一下当前倒计时的时间
      storeSet('HotelMaster', 'CheckedInRoomCountDown', this.second);
      storeSet('HotelMaster', 'CheckedInRoomCountDownNowTime', new Date().getTime());
    }
  },
  methods: {
    initialData () {
      console.log('start');
      let option = {
        token: this.token,
        hotelRoomId: this.hotelRoomId,
        orderId: this.orderId
      };
      getHotelCustomers(option).then(response => {
        if (response.data.ResultCode === 0) {
          let dataList = response.data.Data;
          this.phone = dataList[0].Phone;
          dataList.forEach(item => {
            let phone = item.Phone;
            let phoneArr = phone.split('');
            phoneArr.splice(3, 4, '*', '*', '*', '*');
            let newPhone = phoneArr.join('');
            item.Phone = newPhone;
          });
          this.dataList = dataList;
        } else if (response.data.ResultCode === 2) {
          this.$store.dispatch('setDialog', [true, '会话已过期，请重新登录', 'login']);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    checkOut () {
      hotelCheckOut({roomId: this.hotelRoomId, orderId: this.orderId}).then(response => {
        if (response.data.Code == '0') {
          this.$router.replace({
            name: 'roomList'
          })
        } else {
          this.$store.dispatch('setDialog', [true, '网络异常，请稍后再试', '']);
        }
      }).catch(err => {
        console.log(err);
        this.$store.dispatch('setDialog', [true, '网络异常，请稍后再试', '']);
      })
    },
    touchStart (num) {
      let door = 'doorFocus' + num;
      this.$data[door] = true
    },
    touchEnd (num) {
      let door = 'doorFocus' + num;
      this.$data[door] = false
    },
    openDoor () {
      // 打开房门
      let roomId = this.hotelRoomId;
      openDoor({roomId: roomId}).then(response => {
        if (response.data.Code === 0) {
          console.log('open door success');
        } else {
          alert(response.data.Message);
        }
      }).catch(err => {
        console.log(err);
      })
    },
    sended () {
        // console.log('on sended')
      if (this.second == 1) {
        this.doorFocus2 = false
          // this.btnCaption = "获取验证码";
        this.second = 60;
        storeSet('HotelMaster', 'CheckedInRoomCountDownStart', false);
      } else {
        this.doorFocus2 = true
          // this.btnCaption = "重新发送(" + this.second + "s)";
        this.second--;
        setTimeout(this.sended, 1000)
      }
    },
    sendDoorPassword () {
      if (this.second === 60) {
        // 发送门锁密码
        let roomId = this.hotelRoomId;
        let token = this.token;
        let phone = this.phone;
        sendDoorPassword({roomId, token, phone}).then(response => {
          if (response.data.ResultCode === 0) {
            this.doorFocus2 = true;
          } else {
            console.log('error mess');
            clearTimeout(t);
          }
        }).catch(err => {
          console.log(err);
        });
        var t = setTimeout(this.sended, 1000);
        storeSet('HotelMaster', 'CheckedInRoomCountDownStart', true);
        storeSet('HotelMaster', 'CheckedInCountDownStartRoomNo', this.roomNo);
      }
    }
  },
  computed: {
    ...mapState({
      token: state => state.hotelRoomData.hotelRoomMes.token,
      hotelRoomId: state => state.hotelRoomData.hotelRoomMes.hotelRoomId,
      orderId: state => state.hotelRoomData.hotelRoomMes.orderId,
      roomNo: state => state.hotelRoomData.hotelRoomDataDetail.RoomNo
    })
  }
}
</script>
<style lang='stylus' scoped>
@import "../../styles/common/themeSettings.styl"
.checkInRoom
  margin-top 44px
header
    padding-left 10px
    height 34px
    line-height 34px
    font-size $ftSize2
    color #666
article
    border-top 0.7px solid #ddd
    border-bottom 0.7px solid #ddd
    background-color $panelColor
    padding-left 10px
    &>div
        align-items center
        justify-content space-between
        flex 1
        height 44px
        &:not(:last-child)
            border-bottom 0.7px solid #ddd
        &>div
            display inline-flex
            display -webkit-inline-flex
            flex 1
            font-size $ftSize2
            color #333
section
    margin-top 10px
    height 44px
    padding-left 10px
    align-items center
    border-top 0.7px solid #ddd
    border-bottom 0.7px solid #ddd
    background-color $panelColor
    justify-content space-between
    &>div
        color #333
        font-size $ftSize2
.doorFocus
  background-color $splitColor
.countDown
  position absolute
  right 50px
.checkOutRoom
    margin 30px auto
    width 355px
    .login-raised-button
        font-size $ftSize4
        height 44px
        width 100%
        border-radius 6px
        background-color $themeColor
        color $panelColor
</style>