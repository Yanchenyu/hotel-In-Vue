<!-- 会员信息页面 -->

<template>
  <div>
    <group label-width="5rem" label-margin-right="2rem" gutter='0px'>
      <div style="position: relative">
        <cell class="head-cell " :title="'头像'" is-link>
          <div>
            <img slot="icon" :src="avatar">
          </div>

        </cell>
        <input v-if="false" id="photo" type="file" accept="image/*" @change="onFileChange">
      </div>
      <!--<div>
          <ul class="list-ul" v-show="!isPhoto">
              <li class="list-li" v-for="(iu, index) in imgUrls">
                  <a class="list-link" @click='previewImage(iu)'>
                      <img :src="iu" />
                  </a>
              </li>
          </ul>
      </div>-->
      <div class="thinLine"></div>
      <div style="margin-top:0;position:relative" @touchstart="touchStart(1)" @touchend="touchEnd(1)">
        <cell class="cus-normal  vux-override" :class="{focus:num==1}" style="padding: 0 15px;" :title="'个人信息'" link="/membercenter/component/PersonalInfo" is-link>
        </cell>
        <div style="position: absolute;top:-2px;left:0;height:2px;width: 100%;background: #eee" v-show="num==1"></div>
      </div>
    </group>
    <!-- TODO 苹果审核 暂时屏蔽-->
    <div style="background-color:white;margin-top:0;" v-if="isAppleDisable()">
      <group gutter='10px'>
        <div @touchstart="touchStart(2)" @touchend="touchEnd(2)" style="position:relative">
          <cell class="cus-normal   vux-override" :class="{focus:num==2}" style="padding: 0 15px;" :title="'修改密码'" link="/membercenter/component/Authentication/3/身份验证"
                is-link>
          </cell>
          <div style="position: absolute;top:44px;left:0;height:2px;width: 100%;background: #eee" v-show="num==2"></div>
        </div>
        <div class="thinLine"></div>
        <div @touchstart="touchStart(3)" @touchend="touchEnd(3)" style="position:relative">
          <div style="position: absolute;top:-2px;left:0;height:2px;width: 100%;background: #eee" v-show="num==3"></div>
          <cell class="cus-normal   vux-override" :class="{focus:num==3}" style="padding: 0 15px;" :title="'更改绑定手机'" link="/membercenter/component/ReplaceBindingPhone"
                is-link :value="phone">
          </cell>
          <div style="position: absolute;top:44px;left:0;height:2px;width: 100%;background: #eee" v-show="num==3"></div>
        </div>
        <div @touchstart="touchStart(4)" @touchend="touchEnd(4)" style="position:relative" v-if="false">
          <cell v-if="bindflag" class="cus-normal   vux-override" :class="{focus:num==4}" style="padding: 0 15px;" :title="'账号绑定'" is-link>
          </cell>
          <div style="position: absolute;top:-2px;left:0;height:2px;width: 100%;background: #eee" v-show="num==4"></div>
        </div>
      </group>
    </div>
    <div style="padding:0px 10px;" v-if="btnFlag" class="btn_exit" @click="onClick">
      <span>安全退出</span>

    </div>
    <actionsheet v-model="show" :menus="menus2" @on-click-menu="click" show-cancel></actionsheet>
    <Cropper :fileUrl="imgCropper" @changeImg="changeImg"></Cropper>
    <!--<input id="photo" type="file" accept="image/*" @change="onFileChange" style="display: none">
    <input id="camera" type="file" capture="camera" @change="onFileChange" style="display: none">-->
    <!--<input type="file" accept="image/*" @change="onFileChange">
    <input type="file" capture="camera" @change="onFileChange">-->
  </div>
</template>

<script>
  import {XHeader, Cell, Group, XInput, XButton, PopupPicker, Datetime, Actionsheet} from 'vux'
  import {is_weixin} from '@/utils/device'
  import {storeGet,storeSet} from '@/utils/localStorage'
  import jq from 'jquery'
  import lrz from 'lrz'
  import Cropper from '@/components/memberCenter/headinfo/Cropper.vue'

  export default {
    name: 'MemInfo',
    components: {
      Group,
      Cell,
      XHeader,
      XInput,
      XButton,
      PopupPicker,
      Datetime,
      Actionsheet,
      Cropper
    },
    props: {
      outputSize: {
        type: Number,
        default: 1
      }
    },
    beforeMount() {
      var localmemberInfo = localStorage['memberInfo']
      // TODO 验证 MemberId, RoomId是否仍然有效
      if (localmemberInfo == undefined) {
        if (is_weixin()) {
          this.$router.replace({
            name: 'ReplaceBindingPhone'
          })
        } else {
          this.$router.replace({
            name: 'membercenter'
          })
        }
      }
      //微信浏览器隐藏导航栏
      if (is_weixin()) {
        this.bindflag = false;
        this.btnFlag = false;
        var db_avatar = storeGet('memberInfo', 'Avatar')
        var localwxheadimgurl = storeGet('SH_wxAuth', 'headimgurl');
        if (!(typeof localwxheadimgurl == "undefined")) {
          if (!(typeof db_avatar == "undefined")) {
            let res = db_avatar.replace(/(^\s*)|(\s*$)/g, "");
            if (res.length > 0) {
              this.avatar = res;
            } else {
              this.avatar = localwxheadimgurl;
            }
            console.log("headinfo getavatar this.db_avatar", db_avatar)
          } else {
            this.avatar = localwxheadimgurl;
            console.log("headinfo getavatar this.db_avatar1", db_avatar)
          }
        }

      } else {
        let headimg = storeGet('memberInfo', 'Avatar');
        console.log("MEMInfo beforeMount headimg", headimg)
        if (!(typeof headimg == "undefined") && !(headimg == null)) {
          let res = headimg.replace(/(^\s*)|(\s*$)/g, "");
          if (res.length > 0) this.avatar = res
        }
      }


      let phone = storeGet('memberInfo', 'Phone');
      if (phone !== null || phone !== undefined || phone !== '') {
        let tel1 = phone ? (phone.substr(0, 3) + '****' + phone.substr(7)) : "";
        this.phone = tel1;
      }


    },
    data() {
      return {

        bindflag: true,
        btnFlag: true,
        avatar: '../../../../static/images/defaultHead.png',
        mobile: '',
        phone: '',
        email: '',
        show: false,
        menus2: {
          menu1: '拍照',
          menu2: '从相册中选择'
        },
        imgSave: false,


        imgUrls: [],
        urlArr: [],
        isPhoto: true,
        btnTitle: '',
        isModify: false,
        previewImg: '',
        isPreview: false,
        imgCropper: "",
        cropper: '',
        fileType: "",
        num: ""
      }
    },
    methods: {
      testBt(){
        var file = document.getElementById("photo");
        file.click();
      },
      onClick() {
        console.log('on click');

        // 清空缓存数据，并推出页面到登陆页
        delete localStorage['memberInfo'];
        //同时退出发现
        storeSet("SH_RoomControl","VerifyInfo", {})
        localStorage.removeItem("firstIntoRoomControl");
        this.$store.dispatch('keepAlivePageDel', 'RoomControl')
        // 登陆成功 使用replace
        this.$router.push({
          name: 'membercenter'
        })

      },
      isAppleDisable() {
        return !this.utils.isAppleCheck()
      },
      handleClick() {
        // this.show = true
      },
      touchStart(e){
        this.num = e
      },
      touchEnd(e){
        this.num = ""
      },
      click(val) {

        if (val == "menu1") {
          //  camera
          this.fileType = 'camera';
          let file = document.getElementById("camera");
          file.value = "";
          let event = document.createEvent("MouseEvents");
          event.initMouseEvent("click", true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          file.dispatchEvent(event);
          // jq('file').trigger('click');
          return false;
        } else {
          // photo
          this.fileType = 'photo';
          let file = document.getElementById("photo");
          file.value = "";
          let event = document.createEvent("MouseEvents");
          event.initMouseEvent("click", true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          file.dispatchEvent(event);
          // jq('file').trigger('click');
          return false;
        }
      },
      onFileChange(e) {
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.createImage(files, e);
      },
      createImage(file, e) {
        let vm = this;
        this.imgCropper = this.getObjectURL(file[0]);
        // console.log(file[0]);
        // var reader = new FileReader();
        // reader.readAsDataURL(file[0]);
        // reader.onload = function (e) {
        //      console.log('imgurl:   ' + this.result);
        //      vm.imgUrls.push(this.result);
        //      vm.imgCropper = this.result;
        // }
        // lrz(file[0], { width: 480 }).then(function (rst) {
        //     vm.imgUrls.push(rst.base64);
        //     vm.imgCropper = rst.base64;
        //     // console.log(rst);
        //     vm.initCropper();
        //     return rst;
        // }).always(function () {
        //     // 清空文件上传控件的值
        //     e.target.value = null;
        // });
      },
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
      changeImg(val){
        this.avatar = val;
      },

      // initCropper(){
      //     // this.cropper = new Cropper(document.getElementById("container"), {
      //     //     aspectRatio: 1/1, //裁剪长宽比例1：1
      //     //     dragMode: 'move', //只允许移动图片不允许移动裁剪框的位置
      //     //     viewMode: 1, //裁剪框内不允许出现透明区域
      //     //     guides: false, //不要辅助线
      //     //     autoCropArea: 1, //裁剪框初始尺寸为100%图片宽度高度（取决于谁的值小）
      //     //     cropBoxMovable: false, //不允许移动裁剪框
      //     //     cropBoxResizable: false, //不允许缩放裁剪框
      //     //     toggleDragModeOnDblclick: false //不允许切换dragMode
      //     // });
      //     // this.cropper.setCropBoxData({
      //     //     width: 40,
      //     //     height: 40

      //     // })

      //     this.cropper = new Cropper(document.getElementById('container'), {
      //         ready: function(){

      //             console.log(1111);
      //         }
      //     })

      //     console.log(this.cropper.getData())
      // }
      // previewImage(url) {
      //     let vm = this;
      //     vm.isPreview = true;
      //     vm.previewImg = url;
      // },
    }
  }
</script>

<style lang="less" scoped>
  @import '../../../styles/common/themeSettings.less';

  .xheader {
    background-color: @ftColorBlack;
  }

  .head-cell {
    color: #353535;
    font-size: 14px;
    img {
      display: inline-block;
      margin-right: 5px; // margin-top: 5px;
      height: 49px;
      width: 49px;
      border-radius: 40px;
    }
  }

  .content-cell {
    line-height: 40px;
    padding-top: 5px;
    padding-bottom: 5px;
    font-family: 微软雅黑, 宋体;
    font-size: 14px;
  }

  .btn_exit {
    // TODO weex支持 flex only
    background-color: @themeColor;

    margin: 20px 10px;
    line-height: 44px;
    color: @panelColor;
    font-size: 18px;
    color: @panelColor;
    text-align: center;
    border-radius: 4px;
    border: 1px solid @themeColor;
  }

  .cropBox {
    width: 100%;
    height: 400px;
    background: #ccc;
  }

  #photo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 1;
  }

  .focus {
    background: #eee;
  }
</style>

