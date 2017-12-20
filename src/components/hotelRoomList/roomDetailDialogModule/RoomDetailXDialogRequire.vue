<template>
  <div class="extraTips cus-small">
    <div class="flexGroup" v-for="item in roomDetailXDialogRequireData.extraTips">
      <div class="flex3span">{{item.Name}}</div>
      <div class="flex9span">{{item.Content}}</div>
    </div>
    <div class="flexGroup" v-for="item in roomDetailXDialogRequireData.extraStrongTips ">
      <div class="flex3span ">
        <span class="roomType">{{item.Name}}</span>
      </div>
      <div class="flex9span">{{item.Content}}</div>
    </div>
  </div>
</template>

<script>
  const initData = {
    extraTips: [],      // 模块3 补充提示
    extraStrongTips: [] // 模块3 补充提示[强调类型]
  }
  export default {
    props: {
      roomDetailXDialogRequireData: {
        type: Object,
        default: initData
      }
    },
    name: 'RoomDetailXDialogRequire',
    methods: {}
  }
</script>

<style lang="less" scoped>
  @import '../../../styles/common/themeSettings.less';
  // 说明
  .extraTips {
    padding: 0 10px 10px 10px;
    text-align: left;
  }

  .roomType {
    padding: 0 5px;
    border: 1px solid @themeColor;
    border-radius: 3px;
    color: @themeColor;
  }
</style>
