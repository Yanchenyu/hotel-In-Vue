<template>
  <div id="demo">
    <!-- 遮罩层 -->
    <div class="container" v-show="panel">
      <div class="cus-flexrow-center" style="width: 100%;height: 100%;">
        <img id="image" :src="url" alt="Picture">
      </div>

      <div id="button" @click="crop">选取</div>
      <div id="cancel" @click="cancel">取消</div>
    </div>

    <!--<div style="padding:20px;">
        <div class="show">
          <div class="picture" :style="'backgroundImage:url('+headerImage+')'">
          </div>
        </div>
        <div style="margin-top:20px;">
          <input type="file" id="change" accept="image" @change="change">
          <label for="change"></label>
        </div>

    </div>  -->
  </div>
</template>

<script>
  import Cropper from 'cropperjs'
  import {saveMemberHeadImgUpload, saveMemberHeadImg} from '@/services/axiosapi'
  import {storeGet, storeSet} from '@/utils/localStorage'
  export default {
    name: 'Cropper',
    props: {
      fileUrl: {
        type: String,
        default: ""
      }
    },
    components: {},
    data () {
      return {
        headerImage: '',
        picValue: '',
        cropper: '',
        croppable: false,
        panel: false,
        url: ''
      }
    },
    mounted () {
      //初始化这个裁剪框
      var self = this;
      var image = document.getElementById('image');
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        background: false,
        guides: false,
        highlight: false,
        resizable: false,
        dragCrop: false,
        dragCrop: false,
        autoCropArea: 1,
        touchDragZoom: false,
        zoomable: false,
        ready: function () {
          self.croppable = true;
        }
      });
      // var height = window.screen.availHeight;
      // var width = window.screen.availWidth;
      // this.cropper.setData({
      //     width: width,
      //     height: height
      // })
    },
    watch: {
      fileUrl(val){

        this.url = val;
        if (this.cropper) {
          this.cropper.replace(this.url);
        }
        this.panel = true;
      }
    },
    methods: {
      getObjectURL (file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
          url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file);
        }
        return url;
      },
      change (e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.panel = true;
        this.picValue = files[0];

        this.url = this.getObjectURL(this.picValue);
        //每次替换图片要重新得到新的url
        if (this.cropper) {
          this.cropper.replace(this.url);
        }
        this.panel = true;

      },
      crop () {
        this.panel = false;
        var croppedCanvas;
        var roundedCanvas;

        if (!this.croppable) {
          return;
        }
        // Crop
        croppedCanvas = this.cropper.getCroppedCanvas();
        // Round
        roundedCanvas = this.getRoundedCanvas(croppedCanvas);

        this.headerImage = roundedCanvas.toDataURL();
        this.$emit('changeImg', this.headerImage);
        this.postImg()

      },
      getRoundedCanvas (sourceCanvas) {

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var width = sourceCanvas.width;
        var height = sourceCanvas.height;

        canvas.width = width;
        canvas.height = height;

        context.imageSmoothingEnabled = true;
        context.drawImage(sourceCanvas, 0, 0, width, height);
        context.globalCompositeOperation = 'destination-in';
        context.beginPath();
        context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
        context.fill();

        return canvas;
      },
      postImg () {
        //这边写图片的上传
        console.log('imgCropped');
        var a = this.headerImage;
        var b = a.slice(a.indexOf(',') + 1, a.length);
        let option = {
          fileName: storeGet('memberInfo', 'Id') + '.jpg',
          content: b
        };
        localStorage.setItem("changeMemberHeadImg", true);
        storeSet('SH_wxAuth', 'headimgurl', a);
        saveMemberHeadImg(option).then(response => {
          if (response.data.Success) {
            let imgUrl = response.data.Content;
            let memberId = storeGet('memberInfo', 'Id');
            let option = {
              memberId: memberId,
              avatar: imgUrl
            };
            storeSet('memberInfo', 'Avatar', imgUrl);
            this.$store.dispatch("setMemberHeadImg", imgUrl);
            saveMemberHeadImgUpload(option).then(response => {
              if (response.data.Success) {
                storeSet('memberInfo', 'Avatar', imgUrl);
                this.$store.dispatch("setMemberHeadImg", imgUrl);
              }
            }).catch(err => {
              console.log(err);
            })
          }
        }).catch(err => {
          console.log(err);
        });
      },
      cancel(){
        this.panel = false;

      }
    }
  }
</script>

<style scroped>
  * {
    margin: 0;
    padding: 0;
  }

  #demo #button, #demo #cancel {
    font-size: 16px;
    border-bottom: 1px solid #fff;
    color: #fff;
  }

  #demo #button {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }

  #demo #cancel {
    position: absolute;
    left: 20px;
    bottom: 20px;
  }

  #demo .show {
    width: 100px;
    height: 100px;
    overflow: hidden;
    position: relative;
    border-radius: 50%;
    border: 1px solid #d5d5d5;
  }

  #demo .picture {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  #demo .container {
    z-index: 101;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 1);
  }

  #demo #image {
    max-width: 100%;
  }

  .cropper-view-box, .cropper-face {
    border-radius: 50%;
  }

  /*!
   * Cropper.js v1.0.0-rc
   * https://github.com/fengyuanchen/cropperjs
   *
   * Copyright (c) 2017 Fengyuan Chen
   * Released under the MIT license
   *
   * Date: 2017-03-25T12:02:21.062Z
   */

  .cropper-container {
    font-size: 0;
    line-height: 0;

    position: relative;

    -webkit-user-select: none;

    -moz-user-select: none;

    -ms-user-select: none;

    user-select: none;

    direction: ltr;
    -ms-touch-action: none;
    touch-action: none
  }

  .cropper-container img {
    /* Avoid margin top issue (Occur only when margin-top <= -height) */
    display: block;
    min-width: 0 !important;
    max-width: none !important;
    min-height: 0 !important;
    max-height: none !important;
    width: 100%;
    height: 100%;
    image-orientation: 0deg
  }

  .cropper-wrap-box,
  .cropper-canvas,
  .cropper-drag-box,
  .cropper-crop-box,
  .cropper-modal {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .cropper-wrap-box {
    overflow: hidden;
  }

  .cropper-drag-box {
    opacity: 0;
    background-color: #fff;
  }

  .cropper-modal {
    opacity: .5;
    background-color: #000;
  }

  .cropper-view-box {
    display: block;
    overflow: hidden;

    width: 100%;
    height: 100%;

    outline: 1px solid #fff;
    outline-color: rgba(51, 153, 255, 0.75);
  }

  .cropper-dashed {
    position: absolute;

    display: block;

    opacity: .5;
    border: 0 dashed #eee
  }

  .cropper-dashed.dashed-h {
    top: 33.33333%;
    left: 0;
    width: 100%;
    height: 33.33333%;
    border-top-width: 1px;
    border-bottom-width: 1px
  }

  .cropper-dashed.dashed-v {
    top: 0;
    left: 33.33333%;
    width: 33.33333%;
    height: 100%;
    border-right-width: 1px;
    border-left-width: 1px
  }

  .cropper-center {
    position: absolute;
    top: 50%;
    left: 50%;

    display: block;

    width: 0;
    height: 0;

    opacity: .75
  }

  .cropper-center:before,
  .cropper-center:after {
    position: absolute;
    display: block;
    content: ' ';
    background-color: #eee
  }

  .cropper-center:before {
    top: 0;
    left: -3px;
    width: 7px;
    height: 1px
  }

  .cropper-center:after {
    top: -3px;
    left: 0;
    width: 1px;
    height: 7px
  }

  .cropper-face,
  .cropper-line,
  .cropper-point {
    position: absolute;

    display: block;

    width: 100%;
    height: 100%;

    opacity: .1;
  }

  .cropper-face {
    top: 0;
    left: 0;

    background-color: #fff;
  }

  .cropper-line {
    background-color: #fff
  }

  .cropper-line.line-e {
    top: 0;
    right: -3px;
    width: 5px;
    cursor: e-resize
  }

  .cropper-line.line-n {
    top: -3px;
    left: 0;
    height: 5px;
    cursor: n-resize
  }

  .cropper-line.line-w {
    top: 0;
    left: -3px;
    width: 5px;
    cursor: w-resize
  }

  .cropper-line.line-s {
    bottom: -3px;
    left: 0;
    height: 5px;
    cursor: s-resize
  }

  .cropper-point {
    width: 1px;
    height: 1px;

    opacity: .75;
    background-color: #fff
  }

  .cropper-point.point-e {
    top: 50%;
    right: -3px;
    margin-top: -3px;
    cursor: e-resize
  }

  .cropper-point.point-n {
    top: -3px;
    left: 50%;
    margin-left: -3px;
    cursor: n-resize
  }

  .cropper-point.point-w {
    top: 50%;
    left: -3px;
    margin-top: -3px;
    cursor: w-resize
  }

  .cropper-point.point-s {
    bottom: -3px;
    left: 50%;
    margin-left: -3px;
    cursor: s-resize
  }

  .cropper-point.point-ne {
    top: -3px;
    right: -3px;
    cursor: ne-resize
  }

  .cropper-point.point-nw {
    top: -3px;
    left: -3px;
    cursor: nw-resize
  }

  .cropper-point.point-sw {
    bottom: -3px;
    left: -3px;
    cursor: sw-resize
  }

  .cropper-point.point-se {
    right: -3px;
    bottom: -3px;
    width: 1px;
    height: 1px;
    cursor: se-resize;
    opacity: 1
  }

  @media (min-width: 768px) {

    .cropper-point.point-se {
      width: 15px;
      height: 15px
    }
  }

  @media (min-width: 992px) {

    .cropper-point.point-se {
      width: 10px;
      height: 10px
    }
  }

  @media (min-width: 1200px) {

    .cropper-point.point-se {
      width: 5px;
      height: 5px;
      opacity: .75
    }
  }

  .cropper-point.point-se:before {
    position: absolute;
    right: -50%;
    bottom: -50%;
    display: block;
    width: 100%;
    height: 100%;
    content: ' ';
    opacity: 0;
    background-color: #fff
  }

  .cropper-invisible {
    opacity: 0;
  }

  .cropper-bg {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
  }

  .cropper-hide {
    position: absolute;

    display: block;

    width: 0;
    height: 0;
  }

  .cropper-hidden {
    display: none !important;
  }

  .cropper-move {
    cursor: move;
  }

  .cropper-crop {
    cursor: crosshair;
  }

  .cropper-disabled .cropper-drag-box,
  .cropper-disabled .cropper-face,
  .cropper-disabled .cropper-line,
  .cropper-disabled .cropper-point {
    cursor: not-allowed;
  }


</style>
