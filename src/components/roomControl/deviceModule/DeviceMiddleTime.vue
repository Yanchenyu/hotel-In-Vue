<template>
  <div class="outer cus-small cus-ftColorBlack3">
    <div class="openTime">
      开启时间：
      <span>16:00</span>
    </div>
    <div class="closeTime">
      ，关闭时间：
      <span>23:00</span>
    </div>
    <span class="setTime cus-panelColor">定时</span>
    <DateTime></DateTime>
  </div>
</template>

<script>
  import DateTime from '@/components/roomControl/deviceModule/DateTime'
  export default {
    name: 'DeviceMiddleTime',
    components: {
      DateTime
    },
    data () {
      return {}
    },
    methods: {}
  }
</script>

<style lang="less" scoped>
  .outer {
    padding: 0 30px;
  }

  .openTime, .closeTime {
    display: inline-block;
  }

  .setTime {
    float: right;
    display: inline-block;
    width: 45px;
    height: 15px;
    line-height: 15px;
    background-color: #f4e328;
    text-align: center;
    border-radius: 2px;
  }
</style>


