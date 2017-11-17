<template>
  <div class="page-wrap museOverride">
    <div class="roomList cus-flexrow" :class="{listFocus: num === index}" v-for="(item,index) in roomList" @touchstart="touchStart(index)" @touchend="touchEnd" @click="handleClick(item)">
      <section class="listFocusHead" :class="{firstListFocus: num === 0}" v-show="num === index"></section>
      <div class="hotelRoom cus-flexcolumn">
        <div class="roomName" :class="{available1: item.RoomStatusName!='维修中',unavailable: item.RoomStatusName=='维修中'}">{{item.RoomName}}</div>
        <div class="roomNumber" :class="{available2: item.RoomStatusName!='维修中',unavailable: item.RoomStatusName=='维修中'}">{{item.RoomNo}}</div>
      </div>
      <div class="userMes">
        <div v-if="item.RoomStatusName == '已入住' || item.RoomStatusName == '已预订'" class="userMesDiv cus-flexrow">
          <icon name="telephone" scale="1.5"></icon>
          <div>{{item.CustomerName}}{{item.Phone}}</div>
        </div>
      </div>
      <div class="hotelRoomState">
        <icon name="raw-more" scale="2.6"></icon>
        <div :class="{outTime: item.ExpireFlag === 1}">{{item.RoomStatusName}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  import {hotelRoomList} from '@/services/axiosapi'
  import {mapState} from 'vuex'
  import {storeGet, storeSet} from '@/utils/localStorage'
  export default {
    beforeMount () {
      this.dataInitial();
    },
    data () {
      return {
        roomList: [],
        num: -1,
        reload: true
      }
    },
    methods: {
      dataInitial () {
        let option = {
          roomCharge: '',
          deposit: '',
          remarkText: ''
        };
        this.$store.dispatch('setOrderRemark', option);
        let token = this.token == '' ? storeGet('HotelMaster', 'UserData').Token : this.token;
        hotelRoomList({'token': token}).then(response => {
          if (response.data.ResultCode === 0) {
            let roomList = response.data.Data;
            roomList.forEach(item => {
              let phone = item.Phone;
              let phoneArr = phone.split('');
              phoneArr.splice(3, 4, '*', '*', '*', '*');
              let newPhone = phoneArr.join('');
              item.Phone = newPhone;
            });
            this.roomList = roomList;
          } else if (response.data.ResultCode === 2) {
            this.$store.dispatch('setDialog', [true, '会话已过期，请重新登录', 'login']);
          }
        }).catch(err => {
          console.log(err);
        })
      },
      touchStart (index) {
        this.num = index
      },
      touchEnd () {
        this.num = -1
      },
      handleClick (data) {
        if (this.roomNo != data.RoomNo) {
          this.reload = true;
          storeSet('HotelMaster', 'CheckedInRoomCountDownStart', false);
        } else {
          this.reload = false;
        }
        // 当进入已入住的界面，判断倒计时是否需要重载
        this.$store.dispatch('setHotelRoomData', data);
        this.$store.dispatch('reloadHotelRoomLoginData', true);
        this.$store.dispatch('setHotelRoomMes', {'hotelRoomId': data.Id, 'orderId': data.OrderId, 'roomStatus': data.Status, 'roomTypeId': data.RoomTypeId});
        if (data.RoomStatusName == '已入住') {
          this.$router.push({
            name: 'checkedInRoom',
            params: {reload: this.reload}
          })
        } else if (data.RoomStatusName == '维修中' || data.RoomStatusName == '已退房') {
          this.$router.push({
            name: 'maintenance'
          })
        } else if (data.RoomStatusName == '已预订') {
          this.$store.dispatch('setRoomStatus', 0);
          this.$store.dispatch('setLoginWayIndex', 0);
          this.$store.dispatch('isGoMaintain', false);  // 已预订的房间不能进入维修界面
          this.$router.push({
            name: 'hotelRoomLogin',
            params: {index: 0}
          })
        } else {
          this.$store.dispatch('setRoomStatus', 2);
          this.$store.dispatch('setLoginWayIndex', 2);
          this.$store.dispatch('isGoMaintain', true);
          this.$router.push({
            name: 'hotelRoomLogin',
            params: {index: 2}
          })
        }
      }
    },
    computed: {
      ...mapState({
        token: state => state.hotelRoomData.hotelRoomMes.token,
        roomNo: state => state.hotelRoomData.hotelRoomDataDetail.RoomNo
      })
    }
  }
</script>
<style lang="stylus" scoped>
@import "../../styles/common/themeSettings.styl"
.listFocusHead
  position absolute
  top -1px
  left -10px
  width 10px
  height 65px
  background-color $splitColor
.firstListFocus
  top 0
  height 64px
.page-wrap
  padding-left 10px
  background-color $panelColor
  border-bottom $borderBottom
  margin-top 44px
  // 客房列表
  .listFocus
    background-color $splitColor
  .roomList
    height 64px
    justify-content space-between
    align-items center
    flex 1
    position relative
    &:not(:last-child)
      border-bottom $borderBottom
    // 客房名和房间号
    .hotelRoom
      display flex
      display -webkit-flex
      flex 1
      overflow-x hidden
      justify-content center
      div
        line-height 1.3em
      .roomName
        font-size $ftSize3
        white-space nowrap
        overflow-x hidden
        text-overflow ellipsis
        margin-bottom 8px
      .available1
        color #333
      .available2
        color #666
      .unavailable
        color #999
      .split
        height 10px
      .roomNumber
        font-size $ftSize2
    // 入住人信息
    .userMes
      width 153px
      height 21px
      .userMesDiv
        display inline-flex
        display -webkit-inline-flex
        align-items flex-end
        padding-bottom 3px
        font-size $ftSize2
        color #666
        border-bottom 0.7px dashed #666
        div
          display inline-block
          line-height 1.3em
    // 客房状态
    .hotelRoomState
      display flex
      display -webkit-flex
      flex-direction row-reverse
      flex 1
      width 80px
      font-size $ftSize2
      color #666
      margin-right 2.5px
      div
        margin-right 2.5px
      .outTime
        color #ff7c8e
</style>
