<template>
  <!-- 弹层显示价格日历 -->
  <popup v-model="inlineCalShow" height="100%" @on-first-show="resetScroller">
    <div class="fullPopup">
      <scroller height="100%" lock-x ref="calScroller">
        <group gutter="0px">
          <div v-for="i in calList">
            <divider>{{i[0]}} / {{i[1]}}</divider>
            <inline-calendar
              :render-month="i"
              hide-header
              :return-six-rows="false"
              v-model="setValue"
              :show-last-month="false"
              :show-next-month="false"
              :render-on-value-change="false"
              :replace-text-list="replaceTextList"
              :weeks-list="weeksList"
              :render-function="buildSlotFn"
              :disable-past="true">
            </inline-calendar>
          </div>
        </group>
      </scroller>

    </div>
  </popup>
</template>

<script>
  import {Popup, Scroller, Group, Divider, InlineCalendar} from 'vux'

  // vuex
  import {mapState} from 'vuex'

  /**
   * @desc 日期范围数据初始化,当前日期开始6个月份
   * @create 2017-05-04
   */
  function initialCalList() {
    var now = new Date();
    var retYearMonth = [];
    var target = null;
    for (var i = 0; i < 6; i++) {
      target = new Date(now.getFullYear(), now.getMonth() + i, 1)
      retYearMonth.push([target.getFullYear(), target.getMonth() + 1])
    }
    return retYearMonth;
  }

  export default {
    name: 'CheckInOutCal',
    props: {
      inlineCalShow: Boolean, // v-model 语法糖传给value
      checkInDate: String,
      checkOutDate: String
    },
    components: {
      Popup, Scroller,
      Group,
      Divider, InlineCalendar
    },
    data() {
      return {
        setValue: '',        // 当前选中值
        replaceTextList: {  // 日期替换规则
          'TODAY': '今'
        },
        weeksList: ['日', '一', '二', '三', '四', '五', '六 '],    // 星期替换规则
        calList: initialCalList(),  // 初始化日期范围
        setFlag: 0,     // 0：设定入住 1：设定离店
      }
    },
    methods: {
      resetScroller () {
        this.$nextTick(() => {
          this.$refs.calScroller.reset()

        })
      },
      // 通知父菜单关闭 暂时不用 TODO 待添加 确定/取消界面
      closeClick () {
        console.log('child calClose', this.checkInDate)
        this.$emit('closeClick'); //通知父 v-model发生变化
      },
      // 根据设定，页面直接反馈入住和离店日期
      buildSlotFn (line, index, data) {
        if (data.day === this.checkInFormat.date && data.month === (this.checkInFormat.month) && data.year === this.checkInFormat.year) {
          return '<div style="font-size:12px;text-align:center;">入住</div>';
        } else if (data.day === this.checkOutFormat.date && data.month === (this.checkOutFormat.month) && data.year === this.checkOutFormat.year) {
          return '<div style="font-size:12px;text-align:center;">离店</div>';
        }
        return '';
      },

      // 设定入住日期
      setCheckInDate() {
        this.$emit('setCheckInDate', this.setValue)
      },
      // 设定离店日期
      setCheckOutDate() {
        this.$emit('setCheckOutDate', this.setValue)
      }
    },
    watch: {
      // 日历点击设定入住离店时间
      setValue: function (val, oldVal) {
        if ((this.setFlag++ == 0) || (val <= this.checkInDate)) {
          this.setCheckInDate()
        } else {
          this.setCheckOutDate()
        }
      },
      // 关闭打开日历，重新计数
      inlineCalShow: function (val) {
        if (val) {
          // TODO this.setValue 再次打开日历时已经被选择，此时点击，不会触发watch导致不能设定离店时间为入住时间
          this.setFlag = 0
        }
      }
    },

    computed: {
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
    }
  }
</script>

<style lang="less" scoped>
  .fullPopup {
    width: 100%;
    height: 100%;
  }
</style>
