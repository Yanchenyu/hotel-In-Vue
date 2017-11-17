import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import {getToday, getYesterday, getTomorrow} from '../utils/timeUtil'
Vue.use(Vuex);

const initialState = {
  hotelMasterUserData: {},  // 客栈主人信息
  hotelRoomData: {
    hotelRoomDataDetail: {
      RoomNo: 0
    },  // 房间信息明细
    hotelRoomStatus: 0, // 当前房间状态
    loginWayIndex: 0, // 当前登录方式index
    reloadHotelRoomLoginData: true, // 是否重新请求登记入住页面
    hotelRoomDataAlready: {}, // 已预订的房间信息
    hotelRoomDataAllList: [],  // 加载房间全部订单
    hotelRoomDate: {
      checkInMiniDate: getYesterday(new Date()),  // 入住日期最小值
      checkInMaxDate: getToday,  // 入住日期最大值
      checkInDate: getToday,  // 入住日期
      checkOutDate: getTomorrow(new Date()),  // 离店日期
      checkOutMiniDate: getTomorrow(new Date()) // 离店最小日期
    },
    hotelOrderData: { // 酒店订单备注页面信息以及状态
      orderStatus: 'N', // N代表未确认，P代表已确认
      orderMessage: {
        roomCharge: '',
        deposit: '',
        remarkText: ''
      }
    },
    hotelRoomMes: { // 一些基本的信息
      hotelRoomId: '',
      orderId: '',
      token: '',
      roomStatus: '',
      roomTypeId: ''
    },
    isGoMaintain: true,  // 是否去维修界面
    maintenBack: true // 是否返回到列表页面
  },
  routerTitle: '',
  muDialog: {
    open: false,
    dialogText: '',
    name: ''
  }
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
