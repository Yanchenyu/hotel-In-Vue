<template>
  <div class="bg">
    <!-- 内容 -->
    <div class="contentwrap" :style="{'height': contentHeight+'px'}">
      <!-- 封装一下banner -->
      <RoomDetailXDialogTop :roomDetailXDialogTopData="bannerImgData"></RoomDetailXDialogTop>
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
      </div>
    </div>
    <!-- 预订 -->
    <!-- 封装一下预定按钮部分 -->
    <RoomDetailXDialogOrderBtn :roomDetailXDialogOrderBtnData='detailOrderBtnData'></RoomDetailXDialogOrderBtn>

  </div>
</template>

<script>
  import {fetchHotelDetail} from '@/services/axiosapi'
  import RoomDetailXDialogTop from '@/components/hotelRoomList/roomDetailDialogModule/RoomDetailXDialogTop.vue'
  import RoomDetailXDialogMes from '@/components/hotelRoomList/roomDetailDialogModule/RoomDetailXDialogMes.vue'
  import RoomDetailXDialogService from '@/components/hotelRoomList/roomDetailDialogModule/RoomDetailXDialogService.vue'
  import RoomDetailXDialogRequire from '@/components/hotelRoomList/roomDetailDialogModule/RoomDetailXDialogRequire.vue'
  import RoomDetailXDialogOrderBtn from '@/components/hotelRoomList/roomDetailDialogModule/RoomDetailXDialogOrderBtn.vue'
  import {is_weixin} from '@/utils/device'
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
    name: 'RoomDetailMes',
    beforeMount(){

      this.resetData();
      var clientHeight = document.body.clientHeight;
      if(is_weixin()){
        var heightDiff = clientHeight-52
      }else{
        var heightDiff = clientHeight-99
      };

      this.contentHeight = heightDiff;
      if (this.$store.state.hotelRoomList.roomList[this.bannerIndex].asyncRoomDetail) {
        console.log("hasFound");
        let content = this.$store.state.hotelRoomList.roomList[this.bannerIndex].asyncRoomDetail
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
          price: content.Price,
          fullHouse: this.$store.state.hotelRoomList.roomList[this.bannerIndex].AvalibleRoomCount <= 0 ? true : false
        }
      } else {
        console.log("nofound")
        // TODO show loading！！！！
        // 没有查看过，则取请求数据接口

        let options = {}
        options.roomTypeId = this.$store.state.hotelRoomList.roomList[this.bannerIndex].Id
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
              price: content.Price,
              fullHouse: this.$store.state.hotelRoomList.roomList[this.bannerIndex].AvalibleRoomCount <= 0 ? true : false
            }
            this.$store.dispatch('setRoomDetail', {id: this.bannerIndex, data: response.data.Content})
          }
        })
      }
    },
    data () {
      return {
        bannerIndex: this.$store.state.hotelRoomList.bannerImgIndex,
        roomData: initialRoomData,
        contentHeight: "auto",
        roomStyle: {
          "position": "fixed",
          "bottom": "0",
          "left": "0"
        },
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
        }
      }
    },
    components: {
      RoomDetailXDialogTop,
      RoomDetailXDialogMes,
      RoomDetailXDialogService,
      RoomDetailXDialogRequire,
      RoomDetailXDialogOrderBtn
    },
    name: 'RoomDetailMes',
    methods: {
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
      }
    },
  }
</script>

<style lang="less" scoped>
  @import '../../styles/common/themeSettings.less';

  .bg {
    width: 100%;
    height: 100%;
    position: relative;
  }

  /* --- 组件内样式 --- */
  .closeicon {
    text-align: right;
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 30px;
    background: transparent;
    z-index: 9999;
    padding: 0 10px;
  }

  .contentwrap {
    background: #ffffff;
    width: 100%;
    padding: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    // margin-bottom: 53px;
    // position: absolute;
    // top: 0;
    // left: 0;
    // 图片展示

    // 正文
    .article {
      // padding: 15px 10px;
      // 简介部分

      // 详细部分
      .detailDesc {
        text-align: left;
        padding: 10px 10px 10px 10px;

        // 展开关闭
        .tagExpand {
          text-align: center;
          margin: 13px 0 15px 0;
          .cell-x-icon {
            fill: @hintColor;
          }
        }
      }

    }
  }


</style>
