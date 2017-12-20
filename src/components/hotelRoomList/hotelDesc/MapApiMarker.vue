<template>
  <div class="wrap">
    <iframe v-if="hotelInfoLoaded==true" :src="mapurl" frameborder="0" style="overflow:hidden;height:100%;width:100%"
            height="100%" width="100%"></iframe>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import {syHotelId} from '@/services/config.js'
  import {fetchHotelInfoAxios} from '@/services/axiosapi'

  export default {
    name: 'MapApiMarker',
    beforeMount() {
      this.initialData();
    },

    methods: {
      initialData() {
        if (this.hotelInfoLoaded == false) {
          let params = {hotelNo: syHotelId};    // TODO 添加多酒店支持
          fetchHotelInfoAxios(params).then(response => {
            if (response.data.Success == true) {
              this.$store.dispatch('setHotelInfo', response.data.Content)
            }
          }).catch(err => {
            //alert('fetchHotelInfoAxios err:', err)
            this.utils.showNetError();
          })
        }
      }
    },
    computed: {
      ...mapState({
        hotelInfoLoaded: state => state.hotelRoomList.hotelInfoLoaded,
        gps: state => state.hotelRoomList.hotelInfo.Coordinate[1],
        hotelName: state => state.hotelRoomList.hotelInfo.Name
      }),
      mapurl () {

        // 高德数据接口
        return "https://uri.amap.com/marker?position="
          + this.gps.Longitude + "," + this.gps.Latitude
          + "&name=" + this.hotelName
          + "&src=mypage&coordinate=gaode&callnative=0"
      }
    }
  }
</script>
<style lang="less" scoped>
  .wrap {
    width: 100vw;
    height: 100vh;
  }
</style>
