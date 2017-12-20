<template>
  <div class="componentwrap" style="font: 14px/1.5;">
    <!-- 第0行 -->
    <div class="cus-flexrow firstrow0">
      <div style="flex:0.7">

        <span class="cus-normal" style="font-size:18px;line-height:1.5em;margin-top:10px;">苏遇精品酒店(苏站路店)</span>

      </div>
      <div style="flex:0.3;float:right;">
        <div style="font-size:16px;line-height:18px;float:right;margin-top:10px;padding-left:25px;">
            <span style="color:red;text-align:right;padding-right:0px;display:block;">  ￥169 </span>
            <span style="">  &nbsp;起 </span>
        </div>

      </div>
    </div>
    <!-- 第一行 -->
    <div class="cus-flexrow firstrow">
      <div style="flex:0.7">
        <a :href="`tel:${phone}`">
          <span class="icon"><x-icon type="iphone" class="cell-x-icon" size="15"></x-icon></span>
          <span class="cus-normal">{{phone}}</span>
        </a>
      </div>
      <div style="flex:0.4" id="secChild">
                <span style="flex:1" class="iconarea">
                    <span v-for="(ico, idx) in serviceIconList" v-if="idx < 5">
                        <icon :name="ico.icon.name" :scale="ico.icon.size*11" class="svgiconGray"></icon>
                    </span>
                </span>

      </div>
    </div>
    <!-- 第2行 -->
    <!--<div class="thinLine" style="margin-left:10px;"></div>-->
    <div class="cus-flexrow firstrow secondrow">
      <div style="flex:1">
        <span class="icon"><x-icon type="ios-location-outline" class="cell-x-icon" size="15"></x-icon></span>
        <span class="cus-normal">{{location}}</span>
      </div>
    </div>
    <!-- 第3行 -->
    <!--<div class="thinLine" style="margin-left:10px;"></div>-->
    <div style="padding-left:10px;padding-right:10px;">
      <div style="flex:1;">
                <span class="cus-normal">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;以简约、舒适、清新、淡雅为核心，搭配智慧化的现代科技，打造一个舒心明快又独具特色的简约苏式旅程休憩之地，让您享受全身心的愉悦！
                </span>

      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'SmartHotelDesc',
    data () {
      return {
        phone: "0512-85551666",
        location: "苏州市姑苏区苏站路1688号",
        serviceIconList: [{icon: {name: "park", size: "1"}, name: "停车"}, {
          icon: {name: "restaurant", size: "1"},
          name: "餐厅"
        }, {icon: {name: "wifi", size: "1"}, name: "免费WIFI"},
          {icon: {name: "blower", size: "0.18"}, name: "吹风机"}, {icon: {name: "monitor", size: "1"}, name: "公共监控"}]
      }
    },
    computed: {
      // serviceIconList(){
      //     return [{icon:{name:"park",size:"1"},name:"停车"},{icon:{name:"restaurant",size:"1"},name:"餐厅"},{icon:{name:"wifi",size:"1"},name:"免费WIFI"},
      //             {icon:{name:"blower",size:"0.18"},name:"吹风机"},{icon:{name:"monitor",size:"1"},name:"公共监控"}]
      // },
      // ...mapState({
      //     phone: "0512-77778888",
      //     location: "姑苏区苏站路尚城街6号"
      // })
    },
    methods: {}

  }
</script>

<style lang="less" scoped>
  @import '../../styles/common/themeSettings.less';

  @rowHeight: 30px;

  .componentwrap {
    // margin-top:10px;
    background-color: @panelColor;
  }

  .firstrow0 {
    padding: 0 15px;
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
    // #secChild::before {
    //     content:"";
    //     width:1px;
    //     height: @rowHeight;
    //     background-color: @pageColor;
    // }
    /* 图标间隔 */
    .iconarea {

      svg {
        padding: 0 3px;
      }
    }
  }

  .secondrow {
    /* 短分隔线 */
    // #shortSplitLine {
    //     span:nth-child(1) {
    //         padding-left: 10px;
    //     }

    //     &::before {
    //         content: "";
    //         width: 1px;
    //         background-color: @pageColor ;
    //     }
    // }
  }

  .thirdrow {
    /* 短分隔线 */
    // #shortSplitLine {
    //     span:nth-child(3) {
    //         padding-left: 10px;
    //     }

    //     &::before {
    //         content: "";
    //         width: 1px;
    //         background-color: @pageColor ;
    //     }
    // }

  }
</style>
