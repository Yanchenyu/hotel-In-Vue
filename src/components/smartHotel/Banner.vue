<template>
  <swiper loop :auto="isAuto" dots-position="center" height="260px"
           :list="imgListArr"></swiper>
  <!--<img style="height:220px;with:100%" :src="imgUrl">-->
  <!--<div class="head-div"></div>-->
</template>

<script>

  import {Swiper} from 'vux'
  import {mapState} from 'vuex'       // TODO 暂时未用

  export default {
    name: 'SmartBanner',
    components: {
      Swiper
    },
    props: {
      imgList: {
        type: Array
      },
      isAuto: {
        type: Boolean
      }
    },
    data () {
      return {
        // bannerIndex: 0,
        // imgUrl: 'http://www.thinkia.club:9050/Images/Hotel/01/suyuhotel.png',
        // bannerMesArr: [],
        // imgList: [{
        //   id: "6977981f-8a1f-435d-8d70-546b1eebad61",
        //   img: "http://www.thinkia.club:9050/Images/Hotel/01/suyuhotel.png",
        //   type: "1"
        // }]
      }
    },
    computed: {
       imgListArr(){
          let imgList = this.imgList;
          let imgListArr = [];
          imgList.forEach(function(item){
            imgListArr.push({
              img: item,
              url: ''
            })
          });
          return imgListArr
       }
    },
    methods: {
      // 活动轮播改变选中index
      bannerIndexChange (index) {
        this.bannerIndex = index;

      }
    }

  }
</script>

<style lang="less" scoped>
  // .head-div {
  //   height: 220px;
  //   background-image: url('http://www.thinkia.club:9050/Images/Hotel/01/suyuhotel.png');
  //   background-size: 100% 100%;
  // }
</style>
