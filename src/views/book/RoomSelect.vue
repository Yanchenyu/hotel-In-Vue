
<template>
  <div style="width: 100%;height: 100%">

    <RoomSelectContainer :isRoomSelectShow="true" ></RoomSelectContainer>

  </div>
</template>

<script type="text/babel">
  import RoomSelectContainer from '@/components/book/RoomSelectContainer'

  export default {
    name: 'RoomSelect',
    props:{
      // 配合Vux PopUp组件使用的
      isRoomSelectShow: {
        type: Boolean,
        default: false,
      }
    },
    components: {
      RoomSelectContainer
    },
    data() {
      return {
      }
    },
  }
</script>

<style lang="less" scoped>

</style>
