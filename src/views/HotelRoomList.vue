<template>
<div>
  <div class="goBack" v-show="!is_weixin" @click="goBack">
    <img src="@/../static/images/back.png" height="25px" width="20px" />
  </div>
  <div :style="{position: thisPosition,top: scrollTop+'px',left:'0',width: '100%',background: '#EEE'}">
    <!-- 轮播活动展示区域 -->
    <Banner @showIndex='changeIndex'></Banner>
    <!-- 酒店信息描述 -->
    <HotelDesc></HotelDesc>
    <!-- 预定日期选择 -->
    <div>
      <CheckInOutArea @showCalIn='showCalIn' @showCalOut='showCalOut'
                      @setCheckInDate="setCheckInDate">
      </CheckInOutArea>
      <!-- 房型列表展示 -->
      <RoomListSimple :roomListLoadingStart="roomListLoadingStart"></RoomListSimple>
    </div>
    <!-- Popup实现 入住离店日期 -->
    <!--<CheckInOutCal  :inlineCalShow="inlineCalShow" @closeClick="inlineCalClose" @setCheckInDate="setCheckInDate" @setCheckOutDate="setCheckOutDate"
                    :checkInDate="checkIn" :checkOutDate="checkOut">
    </CheckInOutCal>-->
    <!--入住离店日期选择 -->
    <Calendar :inlineCalShow="inlineCalShow" :checkStatus='checkStatus' @setIndate='indate' @setOutdate='outdate'
              @closePopup='closeThisPopup'></Calendar>
    <!-- XDialog实现 酒店房间详情  -->
    <RoomDetailXDialog :showRoomDetail="roomDetailDisplay" :roomidx="roomSelectIdx"
                       @closeClick="handleRoomDetailClose"></RoomDetailXDialog>
    <Loading :value='loadingShow'></Loading>
  </div>
</div>
</template>

<script>
  import Banner from '@/components/hotelRoomList/Banner.vue'
  import HotelDesc from '@/components/hotelRoomList/HotelDesc.vue'
  import RoomDetailXDialog from '@/components/hotelRoomList/RoomDetailXDialog.vue'  // TODO 后续删除一个
  import CheckInOutCal from '@/components/hotelRoomList/CheckInOutCal.vue'
  import CheckInOutArea from '@/components/hotelRoomList/CheckInOutArea.vue'
  import RoomListSimple from '@/components/hotelRoomList/RoomListSimple.vue'
  import Calendar from '@/components/hotelRoomList/Calendar.vue'
  import Loading from '@/components/hotelRoomList/Loading.vue'

  // 数据接口
  import {syHotelId} from '@/services/config.js'
  import {fetchHotelInfo, fetchHotelInfoGet} from '@/services'
  import {fetchHotelInfoAxios} from '@/services/axiosapi'
  import {EventUtil} from '@/utils/event'
  import {storeSet, storeGet} from "@/utils/localStorage";
  import {is_weixin} from '@/utils/device'
  // vuex
  import {mapState} from 'vuex'

  export default {
    components: {
      Banner,
      HotelDesc,
      RoomDetailXDialog,
      CheckInOutArea,
      CheckInOutCal,
      RoomListSimple,
      Calendar,
      Loading
    },
    name: 'HotelRoomList',
    beforeMount () {
      // 每次初始化组件，重置销毁开关
      this.$store.dispatch("keepAlivePageAdd", 'HotelRoomList');
      this.loading = true
      this.loadHotelInfo()
      // TODO 如果已经load过，不重新load
      this.$store.dispatch('changeBannerImgIndex', {value: 0});
    },

    beforeDestroy(){
      console.log('hotelroomlist is being destroyed!')
    },
    data () {
      return {
        loading: false,
        scroll: '',
        loadingRoomList: false,
        is_weixin: is_weixin()
      }
    },
    computed: {
      // box2Height(){
      //   let box2Height = document.body.clientHeight - 355 + Math.abs(this.$store.state.hotelRoomList.scrollTop);
      //   return (box2Height+'px')
      // },
      ...mapState({
        // 日历
        inlineCalShow: state => state.hotelRoomList.calendar.inlineCalShow,
        checkStatus: state => state.hotelRoomList.calendar.checkStatus,
        checkIn: state => state.hotelRoomList.calendar.checkIn,
        checkOut: state => state.hotelRoomList.calendar.checkOut,
        // 酒店房间
        roomDetailDisplay: state => state.hotelRoomList.roomDetailDisplay,
        roomSelectIdx: state => state.hotelRoomList.roomSelectIdx,
        loadingShow: state => state.hotelRoomList.loadingShow,
        scrollTop: state => state.hotelRoomList.scrollTop,
        thisPosition: state => state.hotelRoomList.position,
        roomListLoadingStart : state => state.hotelRoomList.roomListLoadingStart,
      })
    },
    watch: {
      scrollTop(val){
        if(val==0){
          this.$store.dispatch('setBox2Height', 'auto');
        }else{
          let box2Height = document.body.clientHeight - 345 + Math.abs(val);
          this.$store.dispatch('setBox2Height', box2Height+'px');
        }

      }
    },
    methods: {
      // load酒店基本信息
      loadHotelInfo () {
        this.loading = true
        // TODO 根据选择性条件load苏遇酒店数据
        let params = {};
        let hotelNo = this.$store.state.smartHotel.hotelNo;
        if(hotelNo==""){
          params.hotelNo = syHotelId
        }else{
          params.hotelNo = hotelNo
        }
        fetchHotelInfoAxios(params).then(response => {
          if (response.data.Success == true) {
            this.$store.dispatch('setHotelInfo', response.data.Content)
            if(params.hotelNo == syHotelId) {
              storeSet('SH_CommonStore', 'syHotelId', response.data.Content.Id);
            }

            // 使用获取到的hotel
            this.loadRoomList();

          } else {
            // TODO 显示无查询数据
          }
          this.loading = false;

        }).catch(err => {
          //alert('fetchHotelInfoAxios err:', err)
          this.utils.showNetError();
        })
      },
      // loadRoomList
      loadRoomList() {
        // TODO 滚动加载

        let clientHeight = document.body.clientHeight;
        if (clientHeight >= 670) {
          this.$store.dispatch('getHotelRoomList', {PageIndex: 0, PageSize: 6}) // TODO 下拉加载更多功能实施
          // this.$store.dispatch('setBox2Height', '520px');
        } else {
          this.$store.dispatch('getHotelRoomList', {PageIndex: 0, PageSize: 5}) // TODO 下拉加载更多功能实施
          // this.$store.dispatch('setBox2Height', '430px');
        }
      },
      // 内联日历关闭
      inlineCalClose() {
        this.$store.dispatch('setInlineCal', {value: false})
      },
      closeThisPopup() {
        this.$store.dispatch('setInlineCal', {value: false})
      },
      // 显示入住价格日期
      showCalIn () {
        this.$store.dispatch('setInlineCal', {value: true});
        this.$store.dispatch('setCheckStatus', {value: 'in'});
      },
      // 显示离店价格日期
      showCalOut () {
        this.$store.dispatch('setInlineCal', {value: true});
        this.$store.dispatch('setCheckStatus', {value: 'out'});
      },

      // 设定入住日期
      setCheckInDate(val) {
        this.$store.dispatch('setCheckIn', {value: val});
        this.$store.dispatch("hasRoomListLoading", true);
        if (val >= this.checkOut) {
          this.$store.dispatch('setCheckOut', {value: '3000-01-01'})   // 清空离店标注
        }
      },
      indate(val) {
        this.$store.dispatch('setCheckIn', {value: val});
      },
      // 设定离店日期并关闭日历
      setCheckOutDate(val) {
        this.$store.dispatch('setCheckOut', {value: val})
        this.$store.dispatch('setInlineCal', {value: false});
        this.$store.dispatch("hasRoomListLoading", true);
        this.$store.dispatch('getHotelRoomList', {PageIndex: 1, PageSize: 6}) // TODO 下拉加载更多功能实施
      },
      outdate(val){
        this.$store.dispatch('setCheckOut', {value: val});
      },
      // 关闭详情
      handleRoomDetailClose () {
        this.$store.dispatch('setRoomDetailDisplay', {value: false})
      },
      //此时滚动图片的下标
      changeIndex(num) {
        this.$store.dispatch('changeBannerImgIndex', {value: num});
      },
      menu() {
        this.scroll = document.body.scrollTop;
        console.log(this.scroll)
      },
      goBack () {
        this.$router.push({
          name: 'default'
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.goBack {
  background-color: rgba(0, 0, 0, .5);
  position: fixed;
  top: 32px;
  left: 12px;
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  border-radius: 25px;
  z-index: 1000;
}
</style>
