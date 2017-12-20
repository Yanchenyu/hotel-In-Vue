<template>
<div class="smartBanner hotelBanner">
  <swiper loop auto dots-position="center" height="110px" :duration=800
          :index="bannerIndex" :list="imgList" @on-index-change="bannerIndexChange"
          @on-click-list-item='imgClick'></swiper>
</div>
</template>

<script>

  import {Swiper} from 'vux'
  import {mapState} from 'vuex'       // TODO 暂时未用

  export default {
    name: 'Banner',
    components: {
      Swiper
    },
    beforeUpdate(){
      // 使得banner的图片下标和下方房情信息一致
      let hotelRoomList = this.$store.state.hotelRoomList.roomList;
      let banners = this.$store.state.hotelRoomList.hotelInfo.Banners;
      let bannerMes = [];
      // if(hotelRoomList.length<banners.length){
      this.bannerMesArr = banners;
      // }else{
      //     banners.forEach(function(item,index) {
      //         hotelRoomList.forEach(function(value,num){
      //             if(item.Id==value.Id){
      //                 bannerMes[index] = {
      //                     Id: item.Id,
      //                     num: num
      //                 }
      //             }
      //         });
      //     });
      //     this.bannerMesArr = bannerMes;
      // }

    },
    data () {
      return {
        bannerIndex: 0,
        bannerMesArr: []
      }
    },
    computed: {
      imgList() {
        if (this.utils.isAppleCheck()) {
          return this.$store.getters.hotelInfo_bannerList.map((item, idx) => {
            item.url = '';
            return item;
          })
        } else {
          return this.$store.getters.hotelInfo_bannerList
        }

      }
    },
    methods: {
      // 活动轮播改变选中index
      bannerIndexChange (index) {
        this.bannerIndex = index;
        let bannerMesArr = this.bannerMesArr;
        // let num = bannerMesArr[this.bannerIndex].num;

        this.$emit("showIndex", index);
      },
      imgClick(){
        this.$store.dispatch('setRoomSelectIdx', {value: this.bannerIndex});
      }
    }

  }
</script>

<style lang="less" scoped>

</style>
