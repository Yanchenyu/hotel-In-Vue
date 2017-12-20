<template>
  <div id="app" style="height:100%;">

    <div v-transfer-dom>
      <loading v-model="isLoading"></loading>
    </div>
    <toast v-model="vuxtoast.display" :type="vuxtoast.type" :time="vuxtoast.timeout">{{vuxtoast.msg}}</toast>
    <view-box id="viewBox" ref="viewBox" :body-padding-top="xheadShow?'64px':'0px'"
              :body-padding-bottom="isTabHide?'0px':'50px'">
      <!--<div :style="xheadShow?'padding:46px 0 55px 0':'padding: 0 0 55px 0;'">-->
      <!--<x-header v-if="xheadShow" slot="header" class="vux-override"-->
      <!-- 使用slot会导致下面的keep-alive失效-->
      <x-header v-if="xheadShow" class="vux-override"
                style="width:100%;position:absolute;left:0;top:0;z-index:100;background-color:#25c0b1;"
                :title="xHeadTitle"
                :transition="headerTransition"></x-header>
      <keep-alive :include="routeIncludes">
        <router-view></router-view>
      </keep-alive>
      <tabbar slot="bottom" v-if="!isTabHide" id="tabbarPart" style="position: fixed" :class="{appTabbarShow: tabshow}">
        <tabbar-item :link="{name:'SmartHotel'}" :selected="isHotel">
          <img slot="icon" src="./assets/images/tabbar/hotel.png">
          <img slot="icon-active" src="./assets/images/tabbar/hotelActive.png">
          <span slot="label" class="vux-override">智慧酒店</span>
        </tabbar-item>

        <tabbar-item :link="{name:'roomcontrol'}" :selected="isRoomControl" v-if="isFindBeautyShow">
          <img slot="icon" src="./assets/images/tabbar/faxian.png">
          <img slot="icon-active" src="./assets/images/tabbar/faxianActive.png">
          <span slot="label" class="vux-override">掌上客房</span>
        </tabbar-item>
        <tabbar-item :link="{name:'membercenter'}" :selected="isMember">
          <img slot="icon" src="./assets/images/tabbar/member.png">
          <img slot="icon-active" src="./assets/images/tabbar/memberActive.png">
          <span slot="label" class="vux-override">我</span>
        </tabbar-item>
      </tabbar>
      <!--</div>-->
    </view-box>
    <Load></Load>
  </div>
</template>

<script>
  import {Tabbar, TabbarItem, Loading, TransferDomDirective as TransferDom, ViewBox, XHeader, Toast} from 'vux'
  import {mapState, mapActions} from 'vuex'
  import {is_weixin} from '@/utils/device'
  import {titleContent} from '@/utils/headerTitle'
  import {tabShowRoute} from '@/utils/tabRule'
  import _ from 'lodash'
  import {keepIncludes} from '@/utils/keepAliveIncludes'
  import Load from '@/components/utils/Loading.vue'
  export default {
    name: 'app',
    directives: {
      TransferDom
    },
    components: {
      Tabbar,
      TabbarItem,
      Loading,
      ViewBox,
      XHeader,
      Toast,
      Load
    },
    data() {
      return {
        isLoading: false,
        vuxtoast: {
          display: false,
          msg: '',
          timeout: 2000,
          type: 'text'
        },
        box: '',
        inputFocus: {},
        scrollHeight: document.body.scrollHeight,
        tabshow: false,
      }
    },

    beforeMount() {
      this.$store.dispatch('setPath', '/hotel/');
      var tabbarPart = document.getElementById("tabbarPart");
      console.log(tabbarPart);
    },
    mounted() {
      var h = this.scrollHeight;
      window.onresize = () => {
        if (document.body.scrollHeight < h) {
            this.tabshow = true;
            document.body.style.background = "#fff"
        }else{
            this.tabshow = false;
            document.body.style.background = "#eee"
        }
      }
    },
    methods: {
      getScrollTop () {
        console.log(this.$refs.viewBox.scrollTop)
      },
      handler(){
        console.log(1231231);
        if (this.path === '/hotel/') {
          console.log(11111111);
          this.box = document.querySelector('#chooseDate')
          this.$store.dispatch('setScrollTop', this.box.scrollTop);
        }
      }
    },
    computed: {
      isHotel () {
        return /^\/$|\/hotel\/|\/SmartHotel\//.test(this.$route.path)
      },
      isMember() {
        return /\/membercenter\/?/.test(this.$route.path)
      },
      isRoomControl() {
        return /\/roomcontrol\/?/.test(this.$route.path)
      },
      // 首页显示tab，其它页面隐藏
      isTabHide() {
        return _.indexOf(tabShowRoute, this.$route.name) == -1;
      },
      // Xhead使用配置
      headerTransition () {
        // return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
        return 'vux-header-fade-in-right'
      },
      xHeadTitle () {
        if (this.$route.name == 'DeviceControl') {
          return this.deviceName
        } else {
          return titleContent[this.$route.name]
        }
      },
      deviceName () {
          let currentRoomDeviceIdx = this.$store.state.roomControl.currentRoomDeviceIdx;
          switch (currentRoomDeviceIdx) {
            case '3':
              return '电视控制器'
              break;
            case '4':
              return '窗帘控制器'
              break;
            case '6':
              return '蓝牙音箱控制器'
              break;
            case '9':
              return '空调控制器'
              break;
            default:
              break;
          }
      },
      // 苹果app标题显示
      xheadShow() {
        // TODO 1. 检测是否处于IOS App/Android APP 2. 从beforeMount移动到router.beforeEach
        //微信浏览器隐藏导航栏
        if (is_weixin() || !titleContent.hasOwnProperty(this.$route.name)) {
          return false
        } else {
          return true
        }
      },
      // 非微信环境才显示发现页面
      isFindBeautyShow() {
        return true;  // 微信屏蔽解除
        // if (is_weixin()) {
        //   return false
        // } else {
        //   return true
        // }
      },

      ...mapState({
        stateToast: state => state.utils.vuxToast,
        path: state => state.hotelRoomList.path,
        scrollTop: state => state.hotelRoomList.scrollTop,
        // keep-alive 动态缓存页面
        routeIncludes: state => state.routeIncludes
      })
    },
    watch: {
      // 监听来自外部的vuex的数据变化
      stateToast: {
        handler: function (val) {
          this.vuxtoast = val
        },
        immediate: true,
        deep: true
      },
      // 内部变化，通知外部进行更新
      'vuxtoast.display': function (val) {
        this.$store.dispatch('vuxToastSetDisplay', val)
      },
      path: (path) => {
        if (path === '/hotel/') {
          setTimeout(() => {
            this.box = document.querySelector('#chooseDate')
            if (this.box) {
              this.box.removeEventListener('scroll', this.handler, false)
              this.box.addEventListener('scroll', this.handler, false);
              console.log(2222);
            }
          }, 1000)
        } else {
          this.box && this.box.removeEventListener('scroll', this.handler, false)
        }
      },

    },
  }
</script>


<!-- 重置样式 -->
<!-- @import './styles/common/reset.less'; -->
<style lang="less">

  @import './styles/common/basic.less';
  @import './styles/common/vuxoverride.less';

  .appTabbarShow {
    display: none !important;
  }

  .xheadercus {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    background-color: red;
  }

  // 下面是覆盖vux的默认组件样式，不可以放在有scoped属性下的style里面

  .dp-header .dp-item.dp-right {
    color: #25c0b1 !important
  }

  .dp-header .dp-item.dp-left, .dp-header .dp-item.dp-center {
    color: #a2a2a2 !important
  }

  .inline-calendar td.current > span.vux-calendar-each-date {
    background-color: #25c0b1 !important
  }

  .inline-calendar td.is-today, .inline-calendar td.is-today.is-disabled {
    color: #25c0b1 !important
  }

  .vux-prev-icon, .vux-next-icon {
    border: 1px solid #25c0b1 !important;
    border-top: none !important;
    border-right: none !important;
  }

  .weui-cell:before {
    border: 0 !important;
  }

  .weui-dialog {
    border-radius: 8px !important;
  }

  .roomdetail-dialog .weui-dialog {
    // overflow-y:scroll !important;
  }

  .roomdetail-dialog .weui-dialog {
    width: 93% !important;
    max-width: 345px !important;
    top: 45% !important;
    height: 85% !important;
    max-height: 540px !important;
    background-color: transparent !important;
  }

  .switchButton .weui-cell {
    padding: 10px !important;
  }

  .switchButton .weui-label {
    display: inline-block !important;
    width: 80px !important;
  }

  .weui-switch:checked {
    border-color: @themeColor !important;
    background-color: @themeColor !important;
  }

</style>
