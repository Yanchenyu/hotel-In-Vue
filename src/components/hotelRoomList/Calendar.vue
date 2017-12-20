<template>
  <div>
    <popup v-model="popupShow" @on-hide='hidePop' @on-show='hideShow' :checkStatus='checkStatus'>
      <div class="title cus-panelColor">
        <p class="cus-h1 chooseDate">{{status == 'in' ? '选择入住日期' : '选择离店日期'}}</p>
        <p class="cus-small titleDate">{{titleDate}}</p>
      </div>
      <inline-calendar
        :title="title"
        v-model="currentValue"
        :show-last-month="false"
        :show-next-month="false"
        :highlight-weekend="true"
        :replace-text-list="replaceTextList"
        :weeks-list='weeksList'
        :disable-past='true'
        class="cus-normal"
        :render-function="buildSlotFn"
        @on-change='onSelect'
        :start-date='startDate'
      ></inline-calendar>
    </popup>
  </div>
</template>

<script>
  import {InlineCalendar, Popup, Cell} from 'vux'
  import {mapState} from 'vuex'
  import {getNewDay, getToDay, getTomorrow} from '@/utils/timeUtil.js'
  export default {
    name: 'Calendar',
    components: {
      InlineCalendar,
      Popup,
      Cell
    },
    props: {
      title: {
        type: String,
      },
      inlineCalShow: {
        type: Boolean,
        default: false
      },
      checkStatus: {
        type: String,
      },
      weeksList: {
        type: Array,
        default: function () {
          return ['日', '一', '二', '三', '四', '五', '六']
        }
      }
    },
    computed: {
      ...mapState({
        status: state => state.hotelRoomList.calendar.checkStatus
      })
    },
    methods: {
      onSelect(val) {
        this.$store.dispatch("setRoomListLoadingStart",false);
        if (!this.$store.state.hotelRoomList.calendar.popupshow) {
          // 只要currentValue变化就会触发，为了防止第一次不会弹出日历，强行改变他的popupshow

          this.popupShow = true;
          this.currentValue = val;
          let arr = this.currentValue.split('-');
          this.titleDate = arr[0] + '年' + parseInt(arr[1]) + '月' + parseInt(arr[2]) + '日';
          this.$store.dispatch('setPopupShow', true);
        } else {
          // popupshow为true，表示当前已经是日历弹出来了，可以选择日期
          // let myDate = new Date();
          // let today = myDate.toLocaleDateString().split('-');
          // let chooseDate = val.split('-');
          // let isTrue = chooseDate.every((item,index) => {
          //     return (parseInt(item)==parseInt(today[index]))
          // })
          // if(this.$store.state.hotelRoomList.calendar.checkStatus=='out'&&isTrue){
          //     this.popupShow = true;
          //     this.currentValue = this.$store.state.hotelRoomList.calendar.checkOut;
          // }else{

          this.popupShow = false;
          this.currentValue = val;
          let arr = this.currentValue.split('-');
          this.titleDate = arr[0] + '年' + parseInt(arr[1]) + '月' + parseInt(arr[2]) + '日';
          // }


        }


      },
      hideShow(){
        let checkInDate = this.$store.state.hotelRoomList.calendar.checkIn;
        let checkOutDate = this.$store.state.hotelRoomList.calendar.checkOut;
        if (this.checkStatu == 'in') {
          this.startDate = getToDay();
          this.currentValue = checkInDate;
        } else if (this.checkStatu == 'out') {
          this.startDate = getTomorrow();
          this.currentValue = checkOutDate;
        }
        ;
      },
      hidePop() {
        this.$store.dispatch('setPosition', 'fixed');
        let checkStatus = this.$store.state.hotelRoomList.calendar.checkStatus;
        let indate = Number(this.$store.state.hotelRoomList.calendar.checkIn.split("-").join(""));
        let outdate = Number(this.$store.state.hotelRoomList.calendar.checkOut.split("-").join(""));
        let nowdate = this.currentValue.split("-").join("");
        let checkInDate = this.$store.state.hotelRoomList.calendar.checkIn;
        let checkOutDate = this.$store.state.hotelRoomList.calendar.checkOut;
        let myDate = new Date();
        let today = myDate.toLocaleDateString().split('-');


        if (this.currentValue != "") {
          if (checkStatus == 'in' && this.currentValue != checkInDate) {
            this.$store.dispatch('setLoadingShow', true);
            this.$emit('setIndate', this.currentValue);

            // 选择入住时间的时候，如果入住时间大于离店时间，那么离店时间自动变更
            if (nowdate >= outdate) {
              let newoutDate = getNewDay(this.currentValue, 1);
              this.$emit('setOutdate', newoutDate);
            }
            let clientHeight = document.body.clientHeight;
            if (clientHeight >= 670) {
              this.$store.dispatch('getHotelRoomList', {PageIndex: 0, PageSize: 6}) // TODO 下拉加载更多功能实施
              this.$store.dispatch('setBox2Height', '520px');
            } else {
              this.$store.dispatch('getHotelRoomList', {PageIndex: 0, PageSize: 5}) // TODO 下拉加载更多功能实施
              this.$store.dispatch('setBox2Height', '430px');
            }


          } else if (checkStatus == 'out' && this.currentValue != checkOutDate) {
            this.$store.dispatch('setLoadingShow', true);
            this.$emit('setOutdate', this.currentValue);
            let chooseDate = this.currentValue.split('-');
            let isTrue = chooseDate.every((item, index) => {
              return (parseInt(item) == parseInt(today[index]))
            });
            // 选择离店时间的时候，如果离店时间小于入住时间，那么入住时间自动变更
            if (nowdate <= indate && nowdate != today) {
              let newoutDate = getNewDay(this.currentValue, -1);
              this.$emit('setIndate', newoutDate);
            }

            let clientHeight = document.body.clientHeight;
            if (clientHeight >= 670) {
              this.$store.dispatch('getHotelRoomList', {PageIndex: 0, PageSize: 6}) // TODO 下拉加载更多功能实施
              this.$store.dispatch('setBox2Height', '520px');
            } else {
              this.$store.dispatch('getHotelRoomList', {PageIndex: 0, PageSize: 5}) // TODO 下拉加载更多功能实施
              this.$store.dispatch('setBox2Height', '430px');
            }

          }
          ;


        }


        this.$emit('closePopup');
      },
      buildSlotFn (line, index, data) {

        let checkStatus = this.$store.state.hotelRoomList.calendar.checkStatus;

        let checkInDate = this.$store.state.hotelRoomList.calendar.checkIn.split("-");
        if (data.day == parseInt(checkInDate[2]) && Number(data.month + 1) == parseInt(checkInDate[1]) && data.year == parseInt(checkInDate[0])) {
          return '<div class="cus-themeColor" style="font-size:12px;text-align:center;">入住</div>';
        }

        let checkOutDate = this.$store.state.hotelRoomList.calendar.checkOut.split("-");
        if (data.day == parseInt(checkOutDate[2]) && Number(data.month + 1) == parseInt(checkOutDate[1]) && data.year == parseInt(checkOutDate[0])) {
          return '<div class="cus-themeColor" style="font-size:12px;text-align:center;">离店</div>';
        }


        return '';
      },
    },
    watch: {
      inlineCalShow(val) {
        this.popupShow = val;
      },
      popupShow(val) {
        if (!val) {
          this.$emit('closePopup');
        }
      },
      checkStatus(val){
        this.checkStatu = val;
      }

    },
    data() {
      return {
        checkStatu: '',
        show: false,
        currentValue: '',
        replaceTextList: {
          'TODAY': '今'
        },
        popupShow: this.inlineCalShow,
        startDate: '',
        titleDate: ""
      }
    }
  }
</script>

<style lang="less" scoped>
@import '../../styles/common/themeSettings.less';
  .title {
    text-align: center;
    background-color: @themeColor;
    height: 60px;
  }

  .title p {
    height: 30px;
  }

  .inline-calendar td.current > span {
    background-color: @themeColor
  }

  .chooseDate {
    line-height: 40px
  }

  .titleDate {
    line-height: 25px
  }

</style>
