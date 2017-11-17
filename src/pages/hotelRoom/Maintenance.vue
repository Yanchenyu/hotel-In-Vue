<template>
<div class="hotelRoomLogin museOverride">
  <article>
    <div class="cus-flexrow">
      <div class="menuTitle">电器总开关</div>
      <mu-switch class="demo-switch" />
    </div>
    <div class="cus-flexrow">
      <div class="menuTitle">维修中</div>
      <mu-switch class="demo-switch" v-model="valueS" @input="updateRoomStatus" />
    </div>
    <div class="cus-flexrow">
      <div class="menuTitle" style='width:100px'>房间准备就绪</div>
      <mu-switch class="demo-switch" :disabled="upDateR" v-model="valueR" @input="updateAlreadyRoomStatus" />
    </div>
  </article>
</div>
</template>
<script>
import {upDateHotelRoomStatus, updateHostelRoomStatusReady} from '@/services/axiosapi'
import {mapState} from 'vuex'
export default {
  beforeMount () {
    let RoomNo = this.$store.state.hotelRoomData.hotelRoomDataDetail.RoomNo;
    let routerTitle = RoomNo + '维护';
    this.$store.dispatch('setRouterTitle', routerTitle);
    if (this.roomStatus == 'S') {
      // 已维修
      this.valueS = true;
      this.valueR = false;
    } else if (this.roomStatus == 'O') {
      // 已退房
      this.valueS = false;
      this.valueR = false;
    } else if (this.roomStatus == 'R') {
      // 已预订
      this.valueS = false;
      this.valueR = true;
    }
  },
  data () {
    return {
      valueS: false,
      valueR: false
    }
  },
  computed: {
    ...mapState({
      token: state => state.hotelRoomData.hotelRoomMes.token,
      hotelRoomId: state => state.hotelRoomData.hotelRoomMes.hotelRoomId,
      roomStatus: state => state.hotelRoomData.hotelRoomMes.roomStatus,
      hotelRoomDataDetail: state => state.hotelRoomData.hotelRoomDataDetail
    }),
    upDateR () {
      if (this.roomStatus == 'S') {
        // 如果是维修中状态，可预订按钮不可点
        return true
      } else if (this.roomStatus == 'R') {
        // 如果是可预订，同上
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    valueR (val) {
      // 可预订
      if (val) {
        this.valueS = false
      }
    },
    valueS (val) {
      // 维修中
      if (val) {
        this.valueR = false
      } else {
        if (this.roomStatus == 'S' || this.roomStatus == 'R') {
          this.valueR = true
        }
      }
    }
  },
  methods: {
    updateRoomStatus (val) {
      let option = {
        token: this.token,
        hotelRoomId: this.hotelRoomId
      };
      if (val) {
        // 维修状态
        option['roomStatus'] = 'S';
        this.$store.dispatch('maintenBack', false);
      } else {
        // 非维修
        option['roomStatus'] = 'R';
        this.$store.dispatch('maintenBack', true);
      }
      console.log(option);
      upDateHotelRoomStatus(option).then(response => {
        if (response.data.ResultCode === 0) {
          console.log(response.data.StringResult);
        } else if (response.data.ResultCode === 2) {
          this.$store.dispatch('setDialog', [true, '会话已过期，请重新登录', 'login']);
        }
      }).catch(err => {
        console.log(err);
      })
    },
    updateAlreadyRoomStatus (val) {
      if (val) {
        // 可预订
        let option = {
          token: this.token,
          hotelRoomId: this.hotelRoomId
        };
        updateHostelRoomStatusReady(option).then(response => {
          if (response.data.ResultCode === 0) {
            console.log(response.data.StringResult);
          } else if (response.data.ResultCode === 2) {
            this.$store.dispatch('setDialog', [true, '会话已过期，请重新登录', 'login']);
          }
        }).catch(err => {
          console.log(err);
        })
      }
    }
  }
}
</script>
<style lang='stylus' scoped>
@import "../../styles/common/themeSettings.styl"
.hotelRoomLogin
  margin-top 44px
article
  &>div
    justify-content space-between
    &>label
      margin-right 10px
</style>