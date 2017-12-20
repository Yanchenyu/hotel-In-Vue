<template>
  <div id="chooseDate">
    <group gutter="10px">
      <div class="cus-flexrow groupInner">
        <div class="cus-flexrow-center calendarIcon">
          <icon name="calendar" scale='2'></icon>
        </div>
        <div class="cus-flexrow chooseDateTime">

          <div class="liveIn cus-flexrow">
            <div class="cus-flexcolumn">
              <span class="cus-min cus-ftColorBlack3">入住</span>
              <span class="inblock" @click="showCalIn">
                      <span class="cus-h2 standardLine">{{checkInFormat.month + 1}}月{{checkInFormat.date}}日</span>
                      <span class="cus-min cus-ftColorBlack3 standardLine">{{calcDateAliasName(checkInDate)}}</span>

                </span>
            </div>
            <div class="cus-flexrow turnRightIcon">
              <icon name='turnRight' scale='1.6' style="color:#c8c8cd"></icon>
            </div>
          </div>
          <div class="nighty cus-flexrow">
            <div class="cus-small">{{daycount}}晚</div>
          </div>
          <div class="liveOut cus-flexrow">
            <div class="cus-flexcolumn">
              <span class="cus-min cus-ftColorBlack3 liveOut">离店</span>
              <span class="inblock" @click="showCalOut">
                      <span class="cus-h2 standardLine">{{checkOutFormat.month + 1}}月{{checkOutFormat.date}}日</span>
                      <span class="cus-min cus-ftColorBlack3 standardLine">{{calcDateAliasName(checkOutDate)}}</span>

                </span>
            </div>
            <div class="cus-flexrow turnRightIcon">
              <icon name='turnRight' scale='1.6' style="color:#c8c8cd"></icon>
            </div>
          </div>

        </div>
      </div>
      <!--</cell>-->
    </group>
  </div>
</template>
<script>
  import {Group, Cell, Flexbox, FlexboxItem} from 'vux'
  import {calcDayscount, calcDateAliasName} from '@/utils/timeUtil.js'

  import {mapState, mapGetters} from 'vuex'

  export default {
    name: 'CheckInOutArea',
    data() {
      return {
        scrolled: false
      }
    },
    components: {
      Group, Cell,
      Flexbox, FlexboxItem
    },
    mounted () {

    },
    methods: {
      // 显示入住价格日历
      showCalIn: function () {
        this.$store.dispatch('setPosition', 'absolute');
        if (this.$store.state.hotelRoomList.calendar.checkStatus == "out" || this.$store.state.hotelRoomList.calendar.checkStatus == "") {
          this.$store.dispatch('setPopupShow', false)
        } else {
          this.$store.dispatch('setPopupShow', true)
        }
        this.$emit('showCalIn');
      },
      // 显示离店价格日历
      showCalOut: function () {
        this.$store.dispatch('setPosition', 'absolute');
        if (this.$store.state.hotelRoomList.calendar.checkStatus == "in" || this.$store.state.hotelRoomList.calendar.checkStatus == "") {
          this.$store.dispatch('setPopupShow', false)
        } else {
          this.$store.dispatch('setPopupShow', true)
        }
        this.$emit('showCalOut')
      },
      calcDateAliasName: function (dateStr) {
        return calcDateAliasName(dateStr);
      },
      handleScroll () {
        this.scrolled = window.scrollY > 0;
      }

    },
    computed: {
      ...mapState({
        checkInDate: state => state.hotelRoomList.calendar.checkIn,
        checkOutDate: state => state.hotelRoomList.calendar.checkOut,
      }),

      // vvv TODO 以下computed 可以独立到 mapGetters/(module中去)
      // 入住晚上数
      daycount: function () {
        return calcDayscount(this.checkInDate, this.checkOutDate);
      },
      // 入住日期格式成年，月，日
      checkInFormat: function () {
        var time = new Date(this.checkInDate)
        return {year: time.getFullYear(), month: time.getMonth(), date: time.getDate()}
      },
      // 离店日期格式成年，月，日
      checkOutFormat: function () {
        var time = new Date(this.checkOutDate)
        return {year: time.getFullYear(), month: time.getMonth(), date: time.getDate()}
      },
      // ^^^
    }

  }
</script>

<style lang="less" scoped>
@import '../../styles/common/themeSettings.less';
  @rowheight: 64px;
.groupInner {
  margin-left: 10px;
  margin-right:7px;
}

.calendarIcon {
  margin-right:10px;
}

.inblock {
  line-height: 1.2em
}


.chooseDateTime {
  justify-content: space-between;
  width: 100%;
  margin-top:15px;
  margin-bottom:20px;
  .liveIn,.liveOut {
    align-items: flex-end;
  }
}

.turnRightIcon {
  margin-bottom: 0.5px;
}

.nighty div {
  padding-top:24px;
}

.liveOut {
  justify-content: flex-start;
}

</style>
