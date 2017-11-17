import * as types from './mutation-types'

export default {
  [types.SET_HOTEL_MASTER_USER_DATA] (state, payload) {
    state.hotelMasterUserData = payload
  },
  [types.SET_HOTEL_ROOM_DATA] (state, payload) {
    state.hotelRoomData.hotelRoomDataDetail = payload
  },
  [types.SET_ROUTER_TITLE] (state, payload) {
    state.routerTitle = payload
  },
  [types.SET_ROOM_STATUS] (state, payload) {
    state.hotelRoomData.hotelRoomStatus = payload
  },
  [types.SET_HOTEL_ROOM_ORDER_LIST] (state, payload) {
    state.hotelRoomData.hotelRoomDataAllList = payload
  },
  [types.SET_HOTEL_ROOM_ALREADY_ORDER] (state, payload) {
    state.hotelRoomData.hotelRoomDataAlready = payload
  },
  [types.SET_HOTEL_ROOM_DATE] (state, payload) {
    state.hotelRoomData.hotelRoomDate[payload.key] = payload.value
  },
  [types.SET_LOGIN_WAY_INDEX] (state, payload) {
    state.hotelRoomData.loginWayIndex = payload
  },
  [types.SET_ORDER_STATUS] (state, payload) {
    state.hotelRoomData.hotelOrderData.orderStatus = payload
  },
  [types.SET_ORDER_REMARK] (state, payload) {
    state.hotelRoomData.hotelOrderData.orderMessage = payload
  },
  [types.RELOAD_HOTEL_ROOM_LOGIN_DATA] (state, payload) {
    state.hotelRoomData.reloadHotelRoomLoginData = payload
  },
  [types.SET_HOTEL_ROOM_MES] (state, payload) {
    let roomMes = state.hotelRoomData.hotelRoomMes;
    for (var i in payload) {
      roomMes[i] = payload[i]
    };
    state.hotelRoomData.hotelRoomMes = roomMes
  },
  [types.GO_MAINTAIN] (state, payload) {
    state.hotelRoomData.isGoMaintain = payload
  },
  [types.MAINTEN_BACK] (state, payload) {
    state.hotelRoomData.maintenBack = payload
  },
  [types.SET_DIALOG] (state, payload) {
    state.muDialog = {
      open: payload[0],
      dialogText: payload[1],
      name: payload[2]
    }
  }
}
