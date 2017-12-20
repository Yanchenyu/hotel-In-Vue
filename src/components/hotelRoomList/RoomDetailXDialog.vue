<template>
  <!-- x-dialog实现酒店房间详情弹框 XDialog 20170420截至不支持混用Scroll，宽度由底层weiui-dialog控制，不支持用户自定义，暂放弃 -->
  <div v-transfer-dom>
    <x-dialog v-model="maskShow" class="roomdetail-dialog" :scroll='scroll'>
      <!--<div style="position: relative;top:0;left:0;width:100%;height:100%;overflow-y:scroll">   -->
      <!-- 内容 -->
      <div class="contentwrap">
        <!-- 封装一下banner -->
        <RoomDetailXDialogTop :roomDetailXDialogTopData="bannerImgData" :firstIn="isFirst"></RoomDetailXDialogTop>
        <!-- 正文 -->
        <div class="article">
          <!-- 封装一下quickDesc -->
          <RoomDetailXDialogMes :roomDetailXDialogMesData='detailMesData'></RoomDetailXDialogMes>
          <div class="thinLine"></div>
          <!-- 封装一下detailDesc -->
          <RoomDetailXDialogService :roomDetailXDialogServiceData='detailServiceData'></RoomDetailXDialogService>
          <div class="splitbar" style="margin-bottom:10px;"></div>
          <!-- 封装一下splitbar -->
          <RoomDetailXDialogRequire :roomDetailXDialogRequireData='detailRequireData'></RoomDetailXDialogRequire>
          <!-- 以简约、舒适、清新、淡雅为核心，搭配智慧化的现代科技，打造一个舒心明快又独具特色的简约苏式旅程休憩之地，让您享受全身心的愉悦！ -->
          <div style="width:100%;height:60px;"></div>
        </div>
      </div>
      <!-- 预订 -->
      <!-- 封装一下预定按钮部分 -->
      <RoomDetailXDialogOrderBtn :roomDetailXDialogOrderBtnData='detailOrderBtnData' v-on:closeDialog="closeClick"></RoomDetailXDialogOrderBtn>
      <!-- 关闭图标 -->

      <!--</div>-->

    </x-dialog>
    <div class="closeicon" v-show="maskShow">
      <x-icon type="ios-close-outline" size="50" class="cell-x-icon cus-panelColor" style="color: #fff" @click="closeClick"></x-icon>
    </div>
  </div>
</template>

<script>
  import {XDialog, TransferDomDirective as TransferDom} from 'vux'

  import {fetchHotelDetail} from '@/services/axiosapi'
  import RoomDetailXDialogTop from '@/components/hotelRoomList/roomDetailDialogModule/RoomDetailXDialogTop.vue'
  import RoomDetailXDialogMes from '@/components/hotelRoomList/roomDetailDialogModule/RoomDetailXDialogMes.vue'
  import RoomDetailXDialogService from '@/components/hotelRoomList/roomDetailDialogModule/RoomDetailXDialogService.vue'
  import RoomDetailXDialogRequire from '@/components/hotelRoomList/roomDetailDialogModule/RoomDetailXDialogRequire.vue'
  import RoomDetailXDialogOrderBtn from '@/components/hotelRoomList/roomDetailDialogModule/RoomDetailXDialogOrderBtn.vue'

  // 页面默认空数据
  const initialRoomData = {
    detailTagExpand: false,   // 详情展开
    imgList: [],        // 顶部宣传图片列表
    imgindex: 0,        // 当前展示图片index
    roomTypeName: '',   // 房间名称
    price: 0,            // 房间价格
    roomdesc: '',       // 房间描述
    serviceList: [],    // 模块1 服务标签
    detailServiceTag: [], // 模块2 详细说明
    extraTips: [],      // 模块3 补充提示
    extraStrongTips: [] // 模块3 补充提示[强调类型]
  }
  // 后台数据提取过滤
  const filterService = item => {
    return item !== undefined && item.Type == 1 && item.Display == true
  }
  const filterDetailService = item => {
    return item !== undefined && item.Type == 2 && item.Display == true
  }
  const filterExtraTips = item => {
    return item !== undefined && item.Display == true && item.Type == 3 && item.Mode != 3
  }
  const filterExtraStrongTips = item => {
    return item !== undefined && item.Display == true && item.Type == 3 && item.Mode == 3
  }

  export default {
    name: 'RoomDetailXDialog',
    props: {
      showRoomDetail: {
        type: Boolean,
        default: false
      },
      roomidx: {
        type: Number,
        default: 0
      },
      scroll: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        // 页面展示开关
        maskShow: false,
        roomData: initialRoomData,
        bannerImgData: {
          imgList: [],
          imgindex: 0,
        },
        detailMesData: {
          roomTypeName: '',
          serviceList: [],
          roomdesc: ''
        },
        detailServiceData: {
          detailServiceTag: [],
          detailTagExpand: false,
        },
        detailRequireData: {
          extraTips: [],
          extraStrongTips: []
        },
        detailOrderBtnData: {
          price: 0,
          fullHouse: false
        },
        isFirst: false
      }
    },
    directives: {
      TransferDom
    },
    components: {
      XDialog,
      RoomDetailXDialogTop,
      RoomDetailXDialogMes,
      RoomDetailXDialogService,
      RoomDetailXDialogRequire,
      RoomDetailXDialogOrderBtn
    },
    methods: {
      // 子组件跳转book2,通知同时关闭弹层
      // 通知父组件关闭弹层
      closeClick: function () {
        console.log('close click')
        this.$emit('closeClick');
      },
      resetData (){
        this.roomData = initialRoomData
      },
      updateData(content) {
        // 设定获取值用于页面显示
        this.roomData = {
          detailTagExpand: false,
          imgList: content.RoomTypePictures,
          imgindex: 0,
          roomTypeName: content.RoomTypeName,
          price: content.Price,
          roomdesc: content.Description,
          serviceList: content.ServiceTags.filter(filterService),
          detailServiceTag: content.ServiceTags.filter(filterDetailService),
          extraTips: content.ServiceTags.filter(filterExtraTips),
          extraStrongTips: content.ServiceTags.filter(filterExtraStrongTips),
        }
      },
    },

    watch: {
      // parent props变化主动触发
      showRoomDetail: {
        handler: function (val) {
          this.maskShow = val
          console.log('showRoomDetail watch', val)
          this.isFirst = true;
          if (val != false) {
            console.log('in', this.roomidx)
            // fetch room 详情
            this.resetData()
            if (this.$store.state.hotelRoomList.roomList[this.roomidx].asyncRoomDetail) {
              console.log("hasFound");
              let content = this.$store.state.hotelRoomList.roomList[this.roomidx].asyncRoomDetail
              this.updateData(content)
              this.bannerImgData = {
                imgList: content.RoomTypePictures,
                imgindex: 0
              }
              this.detailMesData = {
                roomTypeName: content.RoomTypeName,
                serviceList: content.ServiceTags.filter(filterService),
                roomdesc: content.Description
              }
              this.detailServiceData = {
                detailServiceTag: content.ServiceTags.filter(filterDetailService),
                detailTagExpand: false,
              }
              this.detailRequireData = {
                extraTips: content.ServiceTags.filter(filterExtraTips),
                extraStrongTips: content.ServiceTags.filter(filterExtraStrongTips),
              }
              this.detailOrderBtnData = {
                price: this.$store.state.hotelRoomList.roomList[this.roomidx].RoomRate,
                fullHouse: this.$store.state.hotelRoomList.roomList[this.roomidx].AvalibleRoomCount <= 0 ? true : false
              }
            } else {
              console.log("nofound")
              // TODO show loading！！！！
              // 没有查看过，则取请求数据接口

              let options = {}
              options.roomTypeId = this.$store.state.hotelRoomList.roomList[this.roomidx].Id
              fetchHotelDetail(options).then(response => {
                if (response.data.Success == true) {
                  let content = response.data.Content
                  this.updateData(content)
                  this.bannerImgData = {
                    imgList: content.RoomTypePictures,
                    imgindex: 0,
                  }
                  this.detailMesData = {
                    roomTypeName: content.RoomTypeName,
                    serviceList: content.ServiceTags.filter(filterService),
                    roomdesc: content.Description
                  }
                  this.detailServiceData = {
                    detailServiceTag: content.ServiceTags.filter(filterDetailService),
                    detailTagExpand: false,
                  }
                  this.detailRequireData = {
                    extraTips: content.ServiceTags.filter(filterExtraTips),
                    extraStrongTips: content.ServiceTags.filter(filterExtraStrongTips),
                  }
                  this.detailOrderBtnData = {
                    price: this.$store.state.hotelRoomList.roomList[this.roomidx].RoomRate,
                    fullHouse: this.$store.state.hotelRoomList.roomList[this.roomidx].AvalibleRoomCount <= 0 ? true : false
                  }
                  this.$store.dispatch('setRoomDetail', {id: this.roomidx, data: response.data.Content})
                }
              })
            }
          }
        },
        immediate: true
      },
      // mask关闭主动触发
      maskShow: function (val) {
        if (!val) {
          this.isFirst = false;
          this.$emit('closeClick')
        }
      },

    },

  }
</script>

<style lang="less" scoped>
  /* --- 覆盖vux样式 --- */
  /* XDialog使用需要 去除scoped限制，配合class缩小修饰范围 */
  @import '../../styles/common/themeSettings.less';

  .roomdetail-dialog {
    .weui-dialog {
      border-radius: 8px;
      padding-bottom: 0px;
      background-color: @popColor;
      width: 90% !important;
      max-width: 345px !important;
      top: 45%;
    }
    .dialog-title {
      line-height: 30px;
      color: #666;
    }
    .img-box {
      height: 350px;
      overflow: hidden;
    }
    .vux-close {
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }
</style>


<style lang="less" scoped>
  @import '../../styles/common/themeSettings.less';

  /* --- 组件内样式 --- */
  .closeicon {
    text-align: center;
    position: fixed;
    top: 88%;
    width: 100%;
    background: transparent;
    z-index: 5000;
    fill: #fff;
  }

  .cell-x-icon {
    fill: #fff;
  }

  .contentwrap {
    background: #ffffff;
    padding: 0;
    height: 80vh;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    // 图片展示

    // 正文
    .article {
      // padding: 15px 10px;
      // 简介部分

      // 详细部分
      background-color: #fff;
      .detailDesc {
        text-align: left;
        padding: 10px 10px 10px 10px;

        // 展开关闭
        .tagExpand {
          text-align: center;
          margin: 13px 0 15px 0;
          .cell-x-icon {
            fill: #fff;
          }
        }
      }

    }
  }


</style>
