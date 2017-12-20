<template>
  <div class="wrap">
    <iframe :src="mapurl" frameborder="0" style="overflow:hidden;height:100%;width:100%"
            height="100%" width="100%"></iframe>
  </div>
</template>
<script>
  import {mapState} from 'vuex'

  export default {
    name: 'CurrentLocation',
    computed: {
      ...mapState({
        mapurl: state => state.smartHotel.mapurl
      })
    }
  }
</script>
<style lang="less" scoped>
  .wrap {
    width: 100vw;
    height: 100vh;
  }
</style>
