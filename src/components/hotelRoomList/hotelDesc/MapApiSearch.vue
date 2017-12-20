<template>
  <div class="wrap">
    <iframe :src="mapurl" frameborder="0" style="overflow:hidden;height:100%;width:100%" height="100%"
            width="100%"></iframe>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    name: 'MapApiSearch',
    computed: {
      ...mapState({
        gps: state => state.hotelRoomList.hotelInfo.Coordinate[1],
        hotelName: state => state.hotelRoomList.hotelInfo.Name
      }),
      mapurl () {
        // 高德数据接口
        return "https://uri.amap.com/navigation?from=&to="
          + this.gps.Longitude + "," + this.gps.Latitude
          + "," + this.hotelName + "&src=mypage"
      },

    }
  }
</script>

<style lang="less" scoped>
  .wrap {
    width: 100vw;
    height: 100vh;
  }
</style>
