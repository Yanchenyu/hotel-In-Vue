<template>
  <div class="outerDiv">
    <!--<div class="bg"></div>-->
    <div class="outer">
      <section v-show="hotel">
        <nav class="first-nav cus-ftColorBlack cus-huge">酒店基本设施</nav>
        <div class="cus-flexwrap iconOut">
          <div class="iconList cus-small cus-ftColorBlack3" v-for="item in hotelInfrastructure">
            <icon :name="item.icon.name" :scale="item.icon.size*18" class="svgicon"></icon>
            <p>{{item.name}}</p>
          </div>
        </div>
      </section>
      <!--<section v-show="business">
          <nav class="second-nav cus-ftColorBlack">商务设施</nav>
          <div class="cus-flexwrap iconOut">
              <div class="iconList cus-small cus-ftColorBlack3 cus-flexwrap" v-for="item in businessFacilities">
                  <icon :name="item.icon.name" :scale="item.icon.size*18" class="svgicon"></icon>
                  <p>{{item.name}}</p>
              </div>
          </div>
      </section>-->
      <section v-show="service">
        <nav class="second-nav cus-ftColorBlack cus-huge">贴心服务</nav>
        <div class="cus-flexwrap iconOut">
          <div class="iconList cus-small cus-ftColorBlack3 cus-flexwrap" v-for="item in intimateService">
            <icon :name="item.icon.name" :scale="item.icon.size*18" class="svgicon"></icon>
            <p>{{item.name}}</p>
          </div>
        </div>
      </section>
      <section v-show="play">
        <nav class="second-nav cus-ftColorBlack cus-huge">娱乐设施</nav>
        <div class="cus-flexwrap iconOut">
          <div class="iconList cus-small cus-ftColorBlack3 cus-flexwrap" v-for="item in amusementFacility">
            <icon :name="item.icon.name" :scale="item.icon.size*18" class="svgicon"></icon>
            <p>{{item.name}}</p>
          </div>
        </div>
      </section>
      <section v-show="surrounding">
        <nav class="second-nav cus-ftColorBlack cus-huge">周边生活</nav>
        <div class="cus-flexwrap iconOut">
          <div class="iconList cus-small cus-ftColorBlack3 cus-flexwrap" v-for="item in surroundingLife">
            <icon :name="item.icon.name" :scale="item.icon.size*18" class="svgicon"></icon>
            <p>{{item.name}}</p>
          </div>
        </div>
      </section>
      <section v-show="introduction">
        <nav class="third-nav cus-ftColorBlack cus-huge">酒店简介</nav>
        <div class="message cus-normal cus-ftColorBlack3">{{message}}</div>
        <nav class="forth-nav cus-ftColorBlack cus-flexrow cus-huge">
          交通信息
          <div class="checkMap cus-flexrow-center">
            <icon name='location' scale='10' class="svgiconGray"></icon>
            <div class="cus-themeColor cus-normal" @click="mapapimarker">查看地图</div>
          </div>
        </nav>
        <div class="extendData" v-for="item in extendData">{{item.Name}}</div>
      </section>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FacilitiesDetails',
    methods: {
      // 使用高德地图查看地图点位标注
      mapapimarker() {
        this.$router.push({
          name: 'mapapimarker'
        })
      }
    },
    computed: {
      hotelInfrastructure(){
        return this.$store.getters.hotelInfo_serviceIcons
      },
      // businessFacilities(){
      //     return this.$store.getters.businessFacilities
      // },
      intimateService(){
        return this.$store.getters.intimateService
      },
      amusementFacility(){
        return this.$store.getters.amusementFacility
      },
      surroundingLife(){
        return this.$store.getters.surroundingLife
      }

    },
    data() {
      return {
        hotel: this.$store.state.hotelRoomList.hotelInfo.HotelInfrastructure.length == 0 ? false : true,
        business: this.$store.state.hotelRoomList.hotelInfo.BusinessFacilities.length == 0 ? false : true,
        service: this.$store.state.hotelRoomList.hotelInfo.IntimateService.length == 0 ? false : true,
        play: this.$store.state.hotelRoomList.hotelInfo.AmusementFacility.length == 0 ? false : true,
        introduction: this.$store.state.hotelRoomList.hotelInfo.Description.length == 0 ? false : true,
        surrounding: this.$store.state.hotelRoomList.hotelInfo.SurroundingLife.length == 0 ? false : true,
        message: this.$store.state.hotelRoomList.hotelInfo.Description,
        extendData: this.$store.state.hotelRoomList.hotelInfo.ExtendData
      }
    },
  }
</script>

<style lang="less" scoped>
  @import '../../styles/common/themeSettings.less';
  .outerDiv {
    padding: 20px 0;
    margin: 0;
    background-color: @panelColor;
  }

  .bg {
    background: rgba(255, 255, 255, 1);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
  }

  .outer {
    margin: 0 10px;
  }

  nav {
    height: 27px;
    line-height: 27px;
    text-overflow: hidden;
  }

  .first-nav {
    margin-top: 0;
    margin-bottom: 13px;
  }

  .second-nav {
    margin-top: 12px;
    margin-bottom: 13px;
  }

  .third-nav {
    margin-top: 12px;
    margin-bottom: 20px;
  }

  .forth-nav {
    margin-top: 20px;
    margin-bottom: 14px;
    justify-content: space-between;
    align-items: flex-end;
    vertical-align: bottom;
  }

  .iconList {
    width: 71px;
    height: 55px;
    text-align: center;
    margin-top: 7px;
    margin-bottom: 8px;
    position: relative;
    p {
      width: 100%;
      text-align: center;
    }
  }

  .iconOut {
    justify-content: flex-start;
    align-items: flex-end;
  }

  .svgicon {
    margin: 0 auto;
  }

  .checkMap {
    align-items: center;
  }

</style>


