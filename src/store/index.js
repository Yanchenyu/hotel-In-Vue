import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

import {formatDate, daysLater} from '../utils/timeUtil'
import {keepIncludes} from '@/utils/keepAliveIncludes'

Vue.use(Vuex)

// 入住离店日期初始辅助
const now = new Date()
const startDate = now
const endDate = daysLater(now, 1)

const initialState = {
  hotelRoomList: {
    calendar: { // 入住离店时间
      checkIn: formatDate(startDate),
      checkOut: formatDate(endDate),
      // 内联设定日历是否显示
      inlineCalShow: false,
      // 当前是选择入住时间还是离店时间
      checkStatus: "",
      popupshow: false
    },
    // 酒店信息
    hotelInfo: {},
    // 酒店设施详情
    hotelDetails: {},
    hotelInfoLoaded: false,
    // 酒店房型列表
    roomList: [],
    roomSelectIdx: 0,   // roomList选择index
    roomDetailDisplay: false,   // 打开/关闭详情
    bannerImgIndex: 0,   //banner的图片下标
    roomLoadingShow: true,  // 房间loading动画是否展示
    roomListHeight: '',
    loadingShow: false,
    scrollTop: 0,
    scrollTopTrue: true,
    path: '',
    box2Height: 'auto',
    position: 'fixed',
    roomListLoadingFirst: true,
    roomListLoadingStart: false,
  },
  roomControl: {
    roomInfo: {
      // 早期场景
      sceneData: {    // 房间场景信息
        memberScene: [],    // 用户偏好场景
        commonScene: [],    // 通用场景
        eventScene: []      // 节日活动场景
      },
      scenceArr: []
    },
    // 发现页房间共享设备信息数据 (温度、窗帘、光线);需要多处同步
    shareDeviceData: {
      airState: false,  // 空调状态
      temperature: 23,  // 温度
      isCurtainTobeClosed: false, // 窗帘
      lightIdx: 0,  // 光线

      // 舒适体验页多次进入使用
      windSpeed: 2, // 0： 自动 1：高速 2:中速 3: 低速 (suyu不支持自动设定)
      musicName:'', // 歌曲
      musicIsPlaying: false,  // 歌曲是否正在播放（false： 停止／暂停）
    },
    // 设备控制列表页使用
    Content: {
      AC: {
        Temperature: 25,
        Commands: [
          {},
          {
            Min: 19,
            Max: 30
          }
        ],
        Powered: 0,
        VentilationSpeed: 0,
        WorkMode: 1
      },
      Curtain: {},
      Music: {
        Status:{
          Status: {
            data: {
              isPlaying: "false"
            },
            message: ''
          }
        }
      }
    },        // 房间设备的信息
    roomNumber: "",
    userMobile: "",
    currentRoomDeviceIdx: ""
  },
  memberCenter: {
    //个人信息
    memberInfo: {},
    //用户头像，单独拉出来一个
    memberHeadImg: "",
    //订单列表
    orderList: {},
    //订单详情
    orderDetail: {},
    smartEnegry: {   // 会员能量信息
      SmartEnergy: '',
      OverCount: ''
    },
    orderListMes: {
      orderListHeight: '',       //全部订单的高度
      orderLoadingShow: true,    //下拉的loading是否展示
      totalRecords: 0             //全部订单的个数
    },
    memberBenefits: [],
    memberLoginStatu: false,
    orderShow: false
  },
  smartHotel: {
    chooseCity: "",
    hotelAllList: [],
    location: {
      lng: "",
      lat: ""
    },
    mapurl: "",
    hotelNo: ""
  },
  // 微信授权获取相关信息配置
  wxAuth: {},
  // 共用组件状态控制
  utils: {
    // toast显示
    vuxToast: {
      display: false,
      msg: '',
      timeout: 2000,
      type: 'text'
    }
  },
  // keep-alive 缓存页面
  routeIncludes: keepIncludes,
  // 页面的加载动画
  loading: false
}

const store = new Vuex.Store({
  state: initialState,
  getters,
  actions,
  mutations,
  modules: {
    // TO be add
  }
})

if (module.hot) {
  // 使 actions 和 mutations 成为可热重载模块
  /*module.hot.accept(['./mutations', './modules/a'], () => {
   // 获取更新后的模块
   // 因为 babel 6 的模块编译格式问题，这里需要加上 .default
   const newMutations = require('./mutations').default
   //const newModuleA = require('./modules/a').default
   // 加载新模块
   store.hotUpdate({
   mutations: newMutations,
   // modules: {
   //     a: newModuleA
   // }
   })
   })*/

  // TODO check 到底是否要添加require('xx').default
  module.hot.accept([
    './getters',
    './actions',
    './mutations'
  ], () => {
    store.hotUpdate({
      getters: require('./getters'),
      actions: require('./actions'),
      mutations: require('./mutations')
    })
  })
}


export default store
