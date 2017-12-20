/**
 * @author roy.wang
 * @email ma_thilda@126.com
 * @create date 2017-03-26 02:20:01
 * @desc 同Redux reducer作用
 */

import * as types from './mutation-types'

export default {

  /* --------- 酒店列表页面使用 --------- */
  // 设定获取到的酒店信息数据
  [types.SET_HOTEL_INFO] (state, payload) {
    state.hotelRoomList.hotelInfo = payload
    state.hotelRoomList.hotelInfoLoaded = true
  },
  [types.SET_SCROLL_TOP] (state, payload) {
    state.hotelRoomList.scrollTop = payload
  },
  [types.SET_BOX2_HEIGHT] (state, payload) {
    state.hotelRoomList.box2Height = payload
  },
  [types.SET_POSITION] (state, payload) {
    state.hotelRoomList.position = payload
  },
  [types.SET_SCROLL_TRUE] (state, payload) {
    state.hotelRoomList.scrollTopTrue = payload
  },
  [types.SET_PATH] (state, payload) {
    state.hotelRoomList.path = payload
  },
  // 打开关闭入住离店日历
  [types.SET_INLINE_CAL] (state, payload) {
    state.hotelRoomList.calendar.inlineCalShow = payload.value
  },
  // 设定入住还是出店状态
  [types.SET_CHECKOUT_STATUS] (state, payload) {
    state.hotelRoomList.calendar.checkStatus = payload.value
  },
  // 设定popupshow
  [types.SET_POPUP_SHOW] (state, payload) {
    state.hotelRoomList.calendar.popupshow = payload
  },
  // 设定入住日期
  [types.SET_CHECK_IN] (state, payload) {
    state.hotelRoomList.calendar.checkIn = payload.value
  },
  // 设定离店日期
  [types.SET_CHECK_OUT] (state, payload) {
    state.hotelRoomList.calendar.checkOut = payload.value
  },
  // 设定loadingshow
  [types.SET_LOADING_SHOW] (state, payload) {
    state.hotelRoomList.loadingShow = payload
  },
  // 设置接口查询房型列表   TODO 改成滚动加载的形式push数据
  [types.SET_HOTEL_ROOMLIST] (state, payload) {
    state.hotelRoomList.roomList = payload
  },
  // 设置房间总数
  [types.SET_ROOMLIST_TOTALRECORDS] (state, payload) {
    state.hotelRoomList.roomTotalRecords = payload
  },
  // 设置房间loading是否展示
  [types.SET_ROOMLIST_LOADINGSHOW] (state, payload) {
    state.hotelRoomList.roomLoadingShow = payload
  },
  // 设置房间高度
  [types.SET_ROOMLISTHEIGHT] (state, payload) {
    state.hotelRoomList.roomListHeight = payload
  },
  // 设置选择房间数组索引
  [types.SET_ROOM_SELECT_INDEX] (state, payload) {
    state.hotelRoomList.roomSelectIdx = payload.value
  },
  // 打开/关闭酒店房间详情
  [types.SET_ROOM_DETAIL_DISPLAY] (state, payload) {
    state.hotelRoomList.roomDetailDisplay = payload.value
  },
  // 获取banner图片的下标
  [types.SET_BANNER_IMG_INDEX] (state, payload) {
    state.hotelRoomList.bannerImgIndex = payload.value
  },
  // 设置房间详情
  [types.SET_ROOM_DETAIL] (state, payload) {
    state.hotelRoomList.roomList[payload.id].asyncRoomDetail = payload.data
  },
  // 第一次进入房间列表
  [types.HAS_ROOMLISTLOADING] (state, payload) {
    state.hotelRoomList.roomListLoadingFirst = payload
  },
  [types.SET_ROOMLIST_LOADINGSTART] (state, payload) {
    state.hotelRoomList.roomListLoadingStart = payload
  },

  /* --------- 房间控制页面使用 --------- */
  // 设置房间详情

  [types.SET_USERMOBILE] (state, payload){
    state.roomControl.userMobile = payload
  },
  [types.SET_ROOMNUMBER] (state, payload){
    state.roomControl.roomNumber = payload
  },
  [types.GET_ROOM_IDX] (state, payload){
    state.roomControl.currentRoomDeviceIdx = payload
  },
  [types.SET_ROOM_SCENE_ALL] (state, payload) {
    state.roomControl.roomInfo.sceneData = {
      memberScene: payload.MemberScenes,
      commonScene: payload.CommonScenes,
      eventScene: payload.EventScenes
    }
  },
  [types.SET_ANALOGDATA] (state, payload) {
    state.roomControl.roomInfo.sceneData.commonScene = payload
  },
  [types.SET_SCENCE_ARR] (state, payload){
    state.roomControl.roomInfo.scenceArr = payload
  },
  [types.SET_DEVICE_CONTENT] (state, payload){
    Object.assign(state.roomControl.Content, payload)
  },
  [types.SET_DEVICE_ONOFF] (state, payload){
    state.roomControl.Content.AC.Powered = payload
  },
  [types.SET_AC_MODE] (state, payload){
    state.roomControl.Content.AC.WorkMode = payload
  },
  [types.SET_AC_SPEED] (state, payload){
    state.roomControl.Content.AC.VentilationSpeed = payload
  },
  [types.SET_AC_TEMPERATURE] (state, payload){
    state.roomControl.Content.AC.Temperature = payload
  },
  [types.SET_CURTAIN_STATE] (state, payload){
    state.roomControl.Content.Curtain.Commands[0].Value = payload
  },

  // vvv 设备状态同步用温度、光线、窗帘
  [types.SET_SYNC_DEVICE] (state, payload){
    state.roomControl.shareDeviceData = payload
  },
  [types.SET_SYNC_DEVICE_AIRSTATE] (state, payload){
    state.roomControl.shareDeviceData.airState = payload
  },
  [types.SET_SYNC_DEVICE_TEMPERATURE] (state, payload){
    state.roomControl.shareDeviceData.temperature = payload
  },
  [types.SET_SYNC_DEVICE_CURTAIN] (state, payload){
    state.roomControl.shareDeviceData.isCurtainTobeClosed = payload
  },
  [types.SET_SYNC_DEVICE_LIGHT] (state, payload){
    state.roomControl.shareDeviceData.lightIdx = payload
  },
  // --- 舒适体验页多次进出使用 ---
  [types.SET_SYNC_DEVICE_WIND] (state, payload){
    state.roomControl.shareDeviceData.windSpeed = payload
  },
  [types.SET_SYNC_DEVICE_MUSIC] (state, payload){
    state.roomControl.shareDeviceData.musicName = payload
  },
  // --- 音乐播放状态同步 ---
  [types.SET_SYNC_DEVICE_MUSIC_PLAY_STATUS] (state, payload) {
    state.roomControl.shareDeviceData.musicIsPlaying = payload
  },
  // ^^^

  /* --------- 会员中心页面使用 --------- */
  // 设定获取到的会员信息数据
  [types.SET_MEMBER_INFO] (state, payload) {
    state.memberCenter.memberInfo = payload
  },
  [types.SET_MEMBER_HEAD_IMG] (state, payload) {
    state.memberCenter.memberHeadImg = payload
  },
  [types.SET_MEMBER_ORDERLIST] (state, payload) {
    state.memberCenter.orderList = payload
  },
  [types.SET_MEMBER_ORDERLIST_TOTALRECORDS] (state, payload) {
    state.memberCenter.orderListMes.totalRecords = payload
  },
  [types.SET_MEMBER_ORDERLIST_LOADINGSHOW] (state, payload) {
    state.memberCenter.orderListMes.orderLoadingShow = payload
  },
  [types.SET_MEMBER_ORDER_SHOW] (state, payload) {
    state.memberCenter.orderShow = payload
  },
  [types.SET_MEMBER_ORDERLIST_HEIGHT] (state, payload) {
    state.memberCenter.orderListMes.orderListHeight = payload
  },
  [types.SET_MEMBER_LOGIN_STATU] (state, payload) {
    state.memberCenter.memberLoginStatu = payload
  },
  // 能量数据
  [types.SET_MEMBER_SMARTENERGY] (state, payload) {
    state.memberCenter.smartEnegry = payload
  },
  [types.SET_MEMBER_BENEFITS] (state, payload) {
    state.memberCenter.memberBenefits = payload
  },

  /* --------- 微信授权使用 --------- */
  [types.SET_WXAUTH_USERINFO] (state, payload) {
    state.wxAuth = payload
  },

  /* --------- 共用组件控制 --------- */
  [types.SET_VUXTOAST_DISPLAY] (state, payload) {
    state.utils.vuxToast = payload
  },
  [types.SET_TOAST_SET_DISPLAY] (state, payload) {
    state.utils.vuxToast.display = payload
  },
  /* --------- 共用功能性state --------- */
  [types.KEEP_ALIVE_ADD] (state, payload) {
    let idx = state.routeIncludes.indexOf(payload)
    if (idx === -1) {
      state.routeIncludes.push(payload)
    }
  },
  [types.KEEP_ALIVE_DEL] (state, payload) {
    let idx = state.routeIncludes.indexOf(payload)
    if (idx !== -1) {
      state.routeIncludes.splice(idx,1)
    }
  },

  /* --------- smartHOTEL --------- */
  [types.SET_LOCAL_CITY] (state, payload) {
    state.smartHotel.chooseCity = payload
  },
  [types.SET_HOTEL_ALL_LIST] (state, payload) {
    state.smartHotel.hotelAllList = payload
  },
  [types.SET_LOCATION] (state, payload) {
    state.smartHotel.location = payload
  },
  [types.SET_HOTELNO] (state, payload) {
    state.smartHotel.hotelNo = payload
  },
  [types.SET_MAPURL] (state, payload) {
    state.smartHotel.mapurl = payload
  },
  [types.SET_LOADING_STATE] (state, payload) {
    state.loading = payload
  }
}
