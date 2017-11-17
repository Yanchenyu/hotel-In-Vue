import * as types from './mutation-types'

// 设置客栈主人的信息
export const setHotelMasterUserData = ({commit}, payload) => {
  commit(types.SET_HOTEL_MASTER_USER_DATA, payload)
}
// 设置查看的房间信息
export const setHotelRoomData = ({commit}, payload) => {
  commit(types.SET_HOTEL_ROOM_DATA, payload)
}
// 设置页眉title
export const setRouterTitle = ({commit}, payload) => {
  commit(types.SET_ROUTER_TITLE, payload)
}
// 设置房间入住界面状态
export const setRoomStatus = ({commit}, payload) => {
  commit(types.SET_ROOM_STATUS, payload)
}
// 设置加载房间全部订单
export const setHotelRoomOrderList = ({commit}, payload) => {
  commit(types.SET_HOTEL_ROOM_ORDER_LIST, payload)
}
// 设置加载单个房间已预订订单
export const setHotelRoomAlreadyOrder = ({commit}, payload) => {
  commit(types.SET_HOTEL_ROOM_ALREADY_ORDER, payload)
}
// 设置入住或离店日期
export const setHotelRoomDate = ({commit}, payload) => {
  commit(types.SET_HOTEL_ROOM_DATE, payload)
}
// 设置登录方式index
export const setLoginWayIndex = ({commit}, payload) => {
  commit(types.SET_LOGIN_WAY_INDEX, payload)
}
// 设置支付状态
export const setOrderStatus = ({commit}, payload) => {
  commit(types.SET_ORDER_STATUS, payload)
}
// 设置备注页面信息
export const setOrderRemark = ({commit}, payload) => {
  commit(types.SET_ORDER_REMARK, payload)
}
// 是否重新请求登录入住界面
export const reloadHotelRoomLoginData = ({commit}, payload) => {
  commit(types.RELOAD_HOTEL_ROOM_LOGIN_DATA, payload)
}
// 设置酒店房间基本信息
export const setHotelRoomMes = ({commit}, payload) => {
  commit(types.SET_HOTEL_ROOM_MES, payload)
}
// 是否去维修界面
export const isGoMaintain = ({commit}, payload) => {
  commit(types.GO_MAINTAIN, payload)
}
// 是否返回到列表
export const maintenBack = ({commit}, payload) => {
  commit(types.MAINTEN_BACK, payload)
}
// 公共弹窗部分
export const setDialog = ({commit}, payload) => {
  commit(types.SET_DIALOG, payload)
}
