<template>
  <div class="quickDesc">
    <div class="cus-h1 title">
      {{roomDetailXDialogMesData.roomTypeName}}
    </div>
    <div class="cus-normal servicetag">
      <!-- Flex布局 parent wrap，item flex-basis-->
      <div class="flex6span" v-for="item in roomDetailXDialogMesData.serviceList">
        {{item.Name}}: {{item.Content}}
      </div>
    </div>
    <div class="cus-small cus-ftColorBlack3">
      <span>{{roomDetailXDialogMesData.roomdesc}}</span>
    </div>
  </div>
</template>

<script>
  const initData = {
    roomTypeName: '',
    serviceList: [],
    roomdesc: ''
  }
  export default {
    props: {
      roomDetailXDialogMesData: {
        type: Object,
        default: initData
      }
    },
    name: 'RoomDetailXDialogMes'
  }
</script>

<style lang="less" scoped>
  .quickDesc {
    text-align: left;
    padding: 15px 10px 10px 10px;
    .title {
      padding-bottom: 8px;
    }
    .servicetag {
      // Flex布局
      display: flex;
      display: -webkit-flex;
      flex-direction: row;
      flex-wrap: wrap; // Flex布局自动换行

      div {
        padding-bottom: 8px; // 4px效果更好看，但spec计算是8px
      }
    }
  }

</style>
