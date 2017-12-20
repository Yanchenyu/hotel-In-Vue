<template>
  <div class="componentwrap">
    <!-- 第一行 -->
    <div class="cus-flexrow firstrow">
      <div style="flex:1">
        <a :href="`tel:${phone}`">
          <span class="icon"><x-icon type="iphone" class="cell-x-icon" size="15"></x-icon></span>
          <span class="cus-normal" style="color: #666">{{phone}}</span>
        </a>
      </div>
      <div style="flex:1" id="secChild" @click="details">
                <span style="flex:1" class="iconarea">
                    <span v-for="(ico, idx) in serviceIconList" v-if="idx < 5">
                        <icon :name="ico.icon.name" :scale="ico.icon.size*11" class="svgicon"></icon>
                    </span>
                </span>
        <span>
                    <span class="cus-normal" style="position:relative;">
                        <span class="link-right cus-min cus-ftColorBlack3">详情</span>
                    </span>
                </span>
      </div>
    </div>
    <!-- 第2行 -->
    <div class="thinLine" style="margin-left:10px;"></div>
    <div class="cus-flexrow firstrow secondrow">
      <div style="flex:1">
        <span class="icon"><x-icon type="ios-location-outline" class="cell-x-icon" size="15"></x-icon></span>
        <span class="cus-normal" style="color: #666">{{location}}</span>
      </div>
      <div id="shortSplitLine">
        <span class="iconarea"><icon name="goThere" class="cus-ftColorBlack3" scale="12"></icon></span>
        <span class="cus-min cus-ftColorBlack3" @click="mapiApiSearch">到这去</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'HotelDesc',
    data () {
      return {}
    },
    computed: {
      serviceIconList(){
        return this.$store.getters.hotelInfo_serviceIcons
      },
      ...mapState({
        phone: state => state.hotelRoomList.hotelInfo.Phone,
        location: state => state.hotelRoomList.hotelInfo.Location
      })
    },
    methods: {
      // 跳转至详情页
      details(){
        this.$router.push({
          name: 'FacilitiesDetails'
        })
      },
      // 使用高德地图进行线路规划
      mapiApiSearch() {
        this.$router.push({
          name: 'mapapisearch'
        })
      }
    }

  }
</script>

<style lang="less" scoped>
  @import '../../styles/common/themeSettings.less';

  @rowHeight: 44px;

  .componentwrap {
    margin-top: 10px;
    background-color: @panelColor;
  }

  .firstrow {
    padding: 0 10px;
    height: @rowHeight;
    align-items: center;
    /* 参考weex，所有display使用 flex*/
    * {
      display: flex;
      display: -webkit-flex;
    }
    /*成员*/
    span {
      align-items: center;
      &.icon {
        margin-right: 5px;
      }
    }
    /* 间隔线条 */
    #secChild::before {
      content: "";
      width: 1px;
      height: @rowHeight;
      background-color: @pageColor;
    }
    /* 图标间隔 */
    .iconarea {
      svg {
        padding: 0 3px;
      }
    }
  }

  .secondrow {
    /* 短分隔线 */
    #shortSplitLine {
      span:nth-child(1) {
        padding-left: 10px;
      }

      &::before {
        content: "";
        width: 1px;
        background-color: @pageColor;
      }
    }
  }
</style>
