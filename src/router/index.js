import Vue from 'vue'
import Router from 'vue-router'
// ------ 房型列表页 ------
import HotelRoomList from '@/views/HotelRoomList'
import Book2Page from '@/views/book/Book2Page'
import Book3Preview from '@/views/book/Book3Preview'
import Book4Result from '@/views/book/Book4Result'
import RoomSelect from '@/views/book/RoomSelect'
import FacilitiesDetails from '@/components/hotelRoomList/FacilitiesDetails'
import RoomDetailMes from '@/components/hotelRoomList/RoomDetailMes'
import RoomDetailActivity from '@/components/hotelRoomList/RoomDetailActivity'
import MapApiSearch from '@/components/hotelRoomList/hotelDesc/MapApiSearch'
import MapApiMarker from '@/components/hotelRoomList/hotelDesc/MapApiMarker'
// ------ 会员页 ------
import MemberCenter from '@/views/MemberCenter'
import MemInfo from '@/components/memberCenter/headinfo/MemInfo'
import PersonalInfo from '@/components/memberCenter/headinfo/memberInfo/PersonalInfo'
import Authentication from '@/components/memberCenter/headinfo/memberInfo/Authentication'
import ChangePassword from '@/components/memberCenter/headinfo/memberInfo/ChangePassword'
import ReplaceBindingPhone from '@/components/memberCenter/headinfo/memberInfo/ReplaceBindingPhone'
import SmartEnergyInfo from '@/components/memberCenter/smartEnergy/SmartEnergyInfo'
import BecomeMemberInfo from '@/components/memberCenter/becomeMember/BecomeMemberInfo'
import OrderList from '@/components/memberCenter/order/OrderList'
import OrderDetail from '@/components/memberCenter/order/OrderDetail'
import Login from '@/components/memberCenter/login/Login'
import LoginInfo from '@/components/memberCenter/login/LoginInfo'
import MemberPrivilege from '@/components/memberCenter/becomeMember/MemberPrivilege'
// ------ 酒店控制页 ------
import IdVerify from '@/views/roomControl/IdVerify'
import Room15Mins from '@/views/roomControl/Room15Mins'
import RoomControl from '@/views/roomControl/RoomControl'
import DoorKey from '@/views/roomControl/DoorKey'
import RoomCode from '@/views/roomControl/RoomCode'
import ControlDeviceList from '@/views/roomControl/ControlDeviceList'
import GenerateRoomCode from '@/views/roomControl/GenerateRoomCode'
import ConfirmTransfer from '@/views/roomControl/ConfirmTransfer'
import GetPhoneCode from '@/views/roomControl/GetPhoneCode'
import DeviceControl from '@/components/roomControl/DeviceControl'
import Music from '@/components/roomControl/Music'
import Curtain from '@/components/roomControl/Curtain'
import AirConditioner from '@/components/roomControl/AirConditioner'
// ------ 智慧酒店 ------
import SmartHotel from '@/views/SmartHotel'
import CityNames from '@/components/smartHotel/CityNames'
import CurrentLocation from '@/components/smartHotel/CurrentLocation'
import HowToPlay from '@/components/smartHotel/HowToPlay'

// ------ 微信授权过渡页 ------
import wxAuth from '@/views/wxAuth'

import {documentTitle} from '@/utils/documentTitle'
import {setWechatTitle} from '@/utils/setWechatTitle.js'
import {is_weixin} from '@/utils/device'

// --- 其它定义 ---
import {prodOnline, appVersion, wxAuthEnable} from '@/services/config'
import {storeSet, storeGet, resetAppStorage} from '@/utils/localStorage'

Vue.use(Router)


//  TODO， 添加require.ensure的使用，参考 vue-router懒加载 https://router.vuejs.org/zh-cn/advanced/lazy-loading.html
// require.ensure 是 Webpack 的特殊语法，用来设置 code-split point
// const Home = resolve => {
//     require.ensure(['./views/index.vue'], () => {
//         resolve(require('./views/index.vue'));
//     });
// };

const routers = new Router({
  routes: [
    // ------ 智慧酒店 临时添加 apple审核用 ------
    { // 智慧酒店
      path: '/',
      name: 'default',
      component: SmartHotel
    },
    // ------ 房型列表页 ------
    { // 房型选择列表页
      path: '/hotel/',
      name: 'hotelroomlist',
      component: HotelRoomList,
    }, {  // 订单填写book2页面
      path: '/hotel/book2page',
      name: 'book2page',
      component: Book2Page
    }, {  // 支付book3页面
      path: '/hotel/book3preview/:orderId',
      name: 'book3preview',
      component: Book3Preview
    }, {  // 支付结果页book4
      path: '/hotel/book4result',
      name: 'Book4Result',
      component: Book4Result
    }, {  // 房间自主选择页
      path: '/hotel/roomselect',
      name: 'roomselect',
      component: RoomSelect
    }, {  // 设施详情页面
      path: '/hotel/component/FacilitiesDetails',
      name: 'FacilitiesDetails',
      component: FacilitiesDetails
    }, {   // 房间详情信息页面
      path: '/hotel/component/RoomDetailMes',
      name: 'RoomDetailMes',
      component: RoomDetailMes
    }, {   // 活动信息页面
      path: '/hotel/component/RoomDetailActivity',
      name: 'RoomDetailActivity',
      component: RoomDetailActivity
    }, {   // uri地图导航页
      path: '/hotel/component/mapapisearch',
      name: 'mapapisearch',
      component: MapApiSearch
    }, {   // 地图点位标注
      path: '/hotel/component/mapapimarker',
      name: 'mapapimarker',
      component: MapApiMarker
    },
    // ------ 会员页 ------
    {  // 会员中心
      path: '/membercenter',
      name: 'membercenter',
      component: MemberCenter
    }, {  // 会员信息页
      path: '/membercenter/component/meminfo',
      name: 'meminfo',
      component: MemInfo
    }, {  // 个人信息页
      path: '/membercenter/component/PersonalInfo',
      name: 'PersonalInfo',
      component: PersonalInfo
    }, {  // 身份验证页
      path: '/membercenter/component/Authentication/:status/:title',
      name: 'authentication',
      component: Authentication
    }, {  // 修改密码页
      path: '/membercenter/component/ChangePassword/:status/:phone',
      name: 'changepassword',
      component: ChangePassword
    }, {  // 更换绑定手机页
      path: '/membercenter/component/ReplaceBindingPhone',
      name: 'ReplaceBindingPhone',
      component: ReplaceBindingPhone
    }, {  // 智慧能量页
      path: '/membercenter/component/SmartEnergyInfo',
      name: 'SmartEnergyInfo',
      component: SmartEnergyInfo
    }, {  // 好想住会员页
      path: '/membercenter/component/BecomeMemberInfo',
      name: 'BecomeMemberInfo',
      component: BecomeMemberInfo
    }, {  // 订单列表
      path: '/membercenter/component/OrderList/:title/:orderstatus/:querymode',
      name: 'orderlist',
      component: OrderList
    }, {  // 订单详情
      path: '/membercenter/component/OrderDetail/:orderNo',
      name: 'orderdetail',
      component: OrderDetail
    }, {  // 新登录界面
      path: '/membercenter/Login',
      name: 'Login',
      component: Login
    }, {  // 登录信息
      path: '/membercenter/component/LoginInfo/',
      name: 'logininfo',
      component: LoginInfo
    }, {  // 登录信息
      path: '/membercenter/component/MemberPrivilege',
      name: 'MemberPrivilege',
      component: MemberPrivilege
    },
    // ------ 酒店控制页 ------
    { // 客房码验证
      path: '/roomcontrol/',
      name: 'idverify',
      component: IdVerify
    }, {  // 酒店控制主页
      path: '/roomcontrol/index/',
      name: 'roomcontrol',
      component: RoomControl,
    },{  // 房间密码页面
      path: '/roomcontrol/doorKey/',
      name: 'DoorKey',
      component: DoorKey,
    },{  // 客房码解释页面
      path: '/roomcontrol/roomCode/',
      name: 'RoomCode',
      component: RoomCode,
    }, {  // 酒店控制 15min回归舒适体验
      path: '/roomcontrol/comfort15mins/',
      name: 'comfort15mins',
      component: Room15Mins,
    }, { // 控制设备列表页
      path: '/roomcontrol/devicelist',
      name: 'devicelist',
      component: ControlDeviceList
    }, { // 获取客房码
      path: '/roomcontrol/GenerateRoomCode',
      name: 'GenerateRoomCode',
      component: GenerateRoomCode
    },
    { // 确认客房码转交
      path: '/roomcontrol/ConfirmTransfer',
      name: 'ConfirmTransfer',
      component: ConfirmTransfer
    },
    {  // 所有设备控制页面
      path: '/roomcontrol/DeviceControl',
      name: 'DeviceControl',
      component: DeviceControl
    },
    {  // 窗帘控制页面
      path: '/roomcontrol/Curtain',
      name: 'Curtain',
      component: Curtain
    },
    {  // 音响控制页面
      path: '/roomcontrol/Music',
      name: 'Music',
      component: Music
    },
    {  // 空调控制页面
      path: '/roomcontrol/AirConditioner',
      name: 'AirConditioner',
      component: AirConditioner
    },
    {  // 获取验证码
      path: '/roomcontrol/GetPhoneCode/',
      name: 'GetPhoneCode',
      component: GetPhoneCode
    },
    // ------ 智慧酒店 ------
    { // 智慧酒店
      path: '/SmartHotel/',
      name: 'SmartHotel',
      component: SmartHotel
    },
    { // 选择城市界面
      path: '/CityNames/',
      name: 'CityNames',
      component: CityNames
    },
    { // 当前定位
      path: '/CurrentLocation/',
      name: 'CurrentLocation',
      component: CurrentLocation
    },
    { // 怎么玩
      path: '/HowToPlay/',
      name: 'HowToPlay',
      component: HowToPlay
    },
    // ------ 微信授权过渡页 ------
    {
      path: '/wxauth/',
      name: 'wxauth',
      component: wxAuth
    }

  ]
});


routers.beforeEach((to, from, next) => {
  console.log(`routers.beforeEach. to: ${to.name}, from: ${from.name}`)
  // 正式环境每次重新发布版本，都会更新用户缓存
  resetAppStorage(prodOnline, appVersion);

  // 优先覆盖platid
  if(to.query.platid) {
    storeSet('SH_CommonStore', 'PlatId', to.query.platid);
  }

  // 配置wx授权
  if (is_weixin() && wxAuthEnable) {
    // 获取openid 键值
    let platId = storeGet('SH_CommonStore', 'PlatId');
    let openidKey = 'openid';
    if (platId) {
      openidKey = `openid_${platId}`
    }

    // 完成授权后页面重定向
    if (to.name == 'wxauth') {
      if(storeGet('SH_wxAuth', openidKey)){
        next({name: 'hotelroomlist'})
        return false
      }
    } else { // 还没有授权的情况
      if(!storeGet('SH_wxAuth', 'unionid') || (location.href.indexOf('?code=') != -1 || location.href.indexOf('&code=') != -1)) {
        console.log('wxAuth 001')
        //记录第一次进入的页面url，用于授权完成后，重新跳转
        if (location.href.indexOf('?code=') == -1 && location.href.indexOf('&code=') == -1) {
          console.log(`set beforeloginUrl, ${to.path }`);
          storeSet('SH_CommonStore', 'beforeloginUrl', location.href);
        }
        next({name: 'wxauth'})
        return false
      } else if(to.query.platid) {
        console.log('wxAuth 002')
        if (!storeGet('SH_wxAuth', openidKey)) {
          //记录第一次进入的页面url，用于授权完成后，重新跳转
          if (location.href.indexOf('?code=') == -1 && location.href.indexOf('&code=') == -1) {
            console.log(`set beforeloginUrl, ${to.path }`);
            storeSet('SH_CommonStore', 'beforeloginUrl', location.href);
          }
          next({name: 'wxauth'})
          return false
        }
      }
    }

    // vvv 单公众号，授权方法
    if (false) {
      // 完成授权后页面重定向
      if (to.name == 'wxauth' && storeGet('SH_wxAuth', 'unionid')) {
        next({name: 'hotelroomlist'})
        return false
      }
      // 还没有授权的情况
      if (!storeGet('SH_wxAuth', 'unionid') && to.name != 'wxauth') {
        //记录第一次进入的页面url，用于授权完成后，重新跳转
        if (location.href.indexOf('?code=') == -1 && location.href.indexOf('&code=') == -1) {
          storeSet('SH_CommonStore', 'beforeloginUrl', location.href);
        }
        next({name: 'wxauth'})
        return false
      }
    }
    // ^^^ 单公众号，授权方法
    next();

  } else {
    next();
  }

  // 页面重定向和标题设定
  if (to.path == '/' || to.name == 'SmartHotel') {
    setWechatTitle('好想住')
    let platId = storeGet('SH_CommonStore', 'PlatId')?storeGet('SH_CommonStore', 'PlatId'):'';
    if (is_weixin() && platId != 'thinkia') {
      next('/hotel/');
    } else {
      next();
    }
  } else {
    if (!!documentTitle[to.name]) {
      let content = documentTitle[to.name];
      setWechatTitle(content)
    }
    next();
  }

})


export default routers
