<template>
  <div class="banner">
    <div class="imgList cus-flexrow" :style="{left: imgLeft+'%', 'transition-duration': duration+'s'}" @touchstart="touchStart" @touchend="touchEnd">
      <img :src='roomDetailXDialogTopData.imgList[this.roomDetailXDialogTopData.imgList.length-1]'>
      <img :src='roomDetailXDialogTopData.imgList[index]' v-for="(item, index) in roomDetailXDialogTopData.imgList">
      <img :src='roomDetailXDialogTopData.imgList[0]'>
    </div>
    <span
      class="indexTip cus-small">{{roomDetailXDialogTopData.imgList.length == 0 ? 0 : imgNum}}/{{roomDetailXDialogTopData.imgList.length}}</span>
  </div>
</template>

<script>
  const initialRoomData = {
    imgList: [],        // 顶部宣传图片列表
    imgindex: 0,        // 当前展示图片index
  }
  export default {
    props: {
      roomDetailXDialogTopData: {
        type: Object,
        default: initialRoomData
      },
      firstIn: {
        type: Boolean
      } 
    },
    name: 'RoomDetailXDialogTop',
    data(){
      return {
        imgLeft: -100,  // 轮播图的left坐标
        touchStartX: 0,
        imgIndex: 0,
        duration: 0.5,
        imgNum: 1
    }
    },
    watch: {
      firstIn(val){
        // 初始化数据
        if(val){
          this.imgNum = this.roomDetailXDialogTopData.imgList.length == 0 ? 0 : 1;
          this.imgIndex = 0;
          this.imgLeft = -100;
          this.touchStartX = 0;
          this.duration = 0.5;
        }
      },
      imgIndex(){
        if (this.imgIndex>0 && this.imgIndex<this.roomDetailXDialogTopData.imgList.length) {
          this.imgNum = this.imgIndex+1
        } else {
          this.imgNum = 1
        }
      }
    },
    methods: {
      bannerImgClick() {
        // TODO load后可以执行操作
        if (this.roomDetailXDialogTopData.imgList.length > 0) {
          if (this.roomDetailXDialogTopData.imgindex == this.roomDetailXDialogTopData.imgList.length - 1) {
            this.roomDetailXDialogTopData.imgindex = 0
          } else {
            this.roomDetailXDialogTopData.imgindex++
          }
        }
      },
      touchStart(event){
        this.touchStartX = event.touches[0].clientX;
      },
      touchEnd(event){
        var touchEndX = event.changedTouches[0].clientX;
        if (touchEndX-this.touchStartX < 0) {
          // 左滑
          if (this.imgIndex>=0 && this.imgIndex<this.roomDetailXDialogTopData.imgList.length) {
            if (this.imgIndex == this.roomDetailXDialogTopData.imgList.length-1) {
              var that = this;
              setTimeout(function() {
                that.duration = 0
                that.imgIndex = 0
                that.imgLeft = -100
              }, 500);
            }
            this.duration = 0.5
            this.imgIndex += 1
            this.imgLeft = -100 -100 * this.imgIndex;
          }
          
        } else {
          // 右滑
          if (this.imgIndex>=0 && this.imgIndex<=this.roomDetailXDialogTopData.imgList.length) {
            if (this.imgIndex == 0) {
              var that = this;
              setTimeout(function() {
                that.duration = 0
                that.imgIndex = that.roomDetailXDialogTopData.imgList.length-1
                that.imgLeft = -100 -100 * (that.roomDetailXDialogTopData.imgList.length-1)
              }, 500);
            }
            this.duration = 0.5
            this.imgIndex -= 1
            this.imgLeft = -100 -100 * this.imgIndex;
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .banner {
    width: 100%;
    height: 185px;
    position: relative; // 子元素absolute
    .imgList {
      position: relative;
      top: 0;
      height: 100%;
      flex-wrap: nowrap;
    }
    img {
      width: 100%;
      height: 100%;
    }
    .indexTip {
      position: absolute;
      left: 10px;
      bottom: 10px;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      display: inline-block;
      padding: 1px 8px 2px 8px;
      border-radius: 8px;
    }
  }
</style>

