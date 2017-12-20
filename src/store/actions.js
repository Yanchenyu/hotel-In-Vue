/**
 * created by roy.wang on 2017/03/24.
 * 作用类同redux actions
 */

import * as types from './mutation-types'

// ------ 酒店房型列表页 ------
// 动态添加可以被缓存的页面
export const keepAlivePageAdd = ({commit}, payload) => {
  commit(types.KEEP_ALIVE_ADD, payload)
}
// 动态删除可以被缓存的页面
export const keepAlivePageDel = ({commit}, payload) => {
  commit(types.KEEP_ALIVE_DEL, payload)
}
// ------ 酒店房型列表页 ------
// TODO 独立到module
// 设置酒店信息
export const setHotelInfo = ({commit}, payload) => {
  commit(types.SET_HOTEL_INFO, payload)
}

export const setScrollTop = ({commit}, payload) => {
  commit(types.SET_SCROLL_TOP, payload)
}

export const setBox2Height = ({commit}, payload) => {
  commit(types.SET_BOX2_HEIGHT, payload)
}

export const setPosition = ({commit}, payload) => {
  commit(types.SET_POSITION, payload)
}


export const setScrollTopTrue = ({commit}, payload) => {
  commit(types.SET_SCROLL_TRUE, payload)
}


export const setPath = ({commit}, payload) => {
  commit(types.SET_PATH, payload)
}

// 打开/关闭checkinOut 内联设定日历
export const setInlineCal = ({commit}, payload) => {
  commit(types.SET_INLINE_CAL, payload)
}

// 打开/关闭loadingshow
export const setLoadingShow = ({commit}, payload) => {
  commit(types.SET_LOADING_SHOW, payload)
}

// 设置入住还是出店状态
export const setCheckStatus = ({commit}, payload) => {
  commit(types.SET_CHECKOUT_STATUS, payload)
}

// 设置popupshow
export const setPopupShow = ({commit}, payload) => {
  commit(types.SET_POPUP_SHOW, payload)
}


// 设置入住日期
export const setCheckIn = ({commit}, payload) => {
  commit(types.SET_CHECK_IN, payload)
}

// 设置出店日期
export const setCheckOut = ({commit}, payload) => {
  commit(types.SET_CHECK_OUT, payload)
}

// 开始加载房型列表
export const setRoomListLoadingStart = ({commit}, payload) => {
  commit(types.SET_ROOMLIST_LOADINGSTART, payload)
}


// 异步获获取酒店房型列表
import {fetchHotelRoomList} from '../services/axiosapi'
import {ls_unionId} from '@/utils/localStorage'
const calcTotalAverage = (arr) => {
  let ret = {}
  ret.totalPrice = 0;
  ret.averagePrice = 0;
  arr.forEach(item => {
    ret.totalPrice += +item.BasePrice  // string to number | ''->0, parseInt('') -> NaN
  })
  ret.averagePrice = Math.floor(ret.totalPrice / arr.length)
  return ret
}
export const getHotelRoomList = ({commit, state}, payload) => {
  let option = {
    PageIndex: payload.PageIndex,
    PageSize: payload.PageSize,
    HotelId: state.hotelRoomList.hotelInfo.Id,
    StartTime: state.hotelRoomList.calendar.checkIn,
    EndTime: state.hotelRoomList.calendar.checkOut,
    UnionId: ls_unionId()
  }

  fetchHotelRoomList(option).then(response => {
    if (response.data.Success == true) {
      commit(types.SET_ROOMLIST_TOTALRECORDS, response.data.TotalRecords);
      var asyncRoomDetail = {};
      commit(types.SET_HOTEL_ROOMLIST,
        response.data.Content.map(item => { // 解决getters不能检测到属性新增的问题
          return Object.assign(item, asyncRoomDetail)
        })
      )
      let roomListNum = state.hotelRoomList.roomList.length;
      let roomTotalRecords = state.hotelRoomList.roomTotalRecords;
      let roomListHeight = roomListNum * 90 + 'px';
      commit(types.SET_ROOMLISTHEIGHT, roomListHeight);
      if (roomListNum == roomTotalRecords) {
        commit(types.SET_ROOMLIST_LOADINGSHOW, false);
      } else {
        commit(types.SET_ROOMLIST_LOADINGSHOW, true);
        commit(types.SET_ROOMLIST_LOADINGSTART, true);
      }
      ;
      commit(types.SET_LOADING_SHOW, false);
    } else {
      // load Fail
    }
  }).catch(err => {
    console.log(err);
    //alert('fetchHotelRoomList err2:', err)
    this.utils.showNetError();
  })
}
// 获取新的roomlist信息，并且添加在原数组下面
export const getNewHotelRoomList = ({commit, state}, payload) => {
  let option = {
    PageIndex: payload.PageIndex,
    PageSize: payload.PageSize,
    HotelId: state.hotelRoomList.hotelInfo.Id,
    StartTime: state.hotelRoomList.calendar.checkIn,
    EndTime: state.hotelRoomList.calendar.checkOut,
    UnionId: ls_unionId()
  }

  fetchHotelRoomList(option).then(response => {
    if (response.data.Success == true) {
      let oldRoomList = state.hotelRoomList.roomList;
      var asyncRoomDetail = {};
      let newRoomList = response.data.Content.map(item => { // 解决getters不能检测到属性新增的问题
        return Object.assign(item, 'asyncRoomDetail')
      });
      let roomList = oldRoomList.concat(newRoomList);
      commit(types.SET_HOTEL_ROOMLIST, roomList);
      let roomListNum = state.hotelRoomList.roomList.length;
      let roomTotalRecords = state.hotelRoomList.roomTotalRecords;
      let roomListHeight = roomListNum * 90 + 'px';
      commit(types.SET_ROOMLISTHEIGHT, roomListHeight);
      console.log(roomListNum);
      console.log(roomTotalRecords)
      if (roomListNum == roomTotalRecords) {
        commit(types.SET_ROOMLIST_LOADINGSHOW, false)
      } else {
        commit(types.SET_ROOMLIST_LOADINGSHOW, true);
        commit(types.SET_ROOMLIST_LOADINGSTART, true);
      }
    } else {
      // load Fail
    }
  }).catch(err => {
    //alert('fetchHotelRoomList err3:', err)
    this.utils.showNetError();
  })
}
// 设定用户选择的酒店房间所属roomlist的index
export const setRoomSelectIdx = ({commit}, payload) => {
  commit(types.SET_ROOM_SELECT_INDEX, payload)
}
// 设定酒店房间详情内容
export const setRoomDetail = ({commit}, payload) => {
  commit(types.SET_ROOM_DETAIL, payload)
}
// 打开/关闭酒店房间详情
export const setRoomDetailDisplay = ({commit}, payload) => {
  commit(types.SET_ROOM_DETAIL_DISPLAY, payload)
}
// banner图片的下标
export const changeBannerImgIndex = ({commit}, payload) => {
  commit(types.SET_BANNER_IMG_INDEX, payload)
}
// 下拉新增action
export const setHotelRoomList = ({commit}, payload) => {
  commit(types.SET_HOTEL_ROOMLIST, payload)
}

export const setRoomListHeight = ({commit}, payload) => {
  commit(types.SET_ROOMLISTHEIGHT, payload)
}

export const setRoomListLoadingShow = ({commit}, payload) => {
  commit(types.SET_ROOMLIST_LOADINGSHOW, payload)
}

export const hasRoomListLoading = ({commit}, payload) => {
  commit(types.HAS_ROOMLISTLOADING, payload)
}

// ------ 房间控制页 ------

// 设置用户手机号
export const setUserMobile = ({commit}, payload) => {
  commit(types.SET_USERMOBILE, payload)
}

// 设置房间号
export const setRoomNumber = ({commit}, payload) => {
  commit(types.SET_ROOMNUMBER, payload)
}

// 设置用户头像
export const setMemberHeadImg = ({commit}, payload) => {
  commit(types.SET_MEMBER_HEAD_IMG, payload)
}

// 设置房间场景数据
export const setRoomScene = ({commit}, payload) => {
  commit(types.SET_ROOM_SCENE_ALL, payload)
}

// 设置房间假的场景数据
export const setAnalogDataCommonScenes = ({commit}, payload) => {
  let data = [
    {
      Enabled: true,
      Locked: false,
      SceneName: '睡觉了',
      SceneNo: 'Sleeping',
      SceneType: 'S'
    },
    {
      Enabled: true,
      Locked: false,
      SceneName: '阅读',
      SceneNo: 'Reading',
      SceneType: 'S'
    },
    {
      Enabled: true,
      Locked: false,
      SceneName: '听歌',
      SceneNo: 'Music',
      SceneType: 'S'
    },
    {
      Enabled: true,
      Locked: false,
      SceneName: '早上叫我',
      SceneNo: 'Morning',
      SceneType: 'S'
    },
  ];
  commit(types.SET_ANALOGDATA, data)
}

// 获得当前设备界面
export const getCurrentRoomIdx = ({commit}, payload) => {
  commit(types.GET_ROOM_IDX, payload)
}

// 设置房间设备状态信息
export const setDeviceContent = ({commit}, payload) => {
  commit(types.SET_DEVICE_CONTENT, payload)
}

// 设置开关
export const switchButton = ({commit}, payload) => {
  commit(types.SET_DEVICE_ONOFF, payload)
}

//设置空调模式
export const setACMode = ({commit}, payload) => {
  commit(types.SET_AC_MODE, payload)
}

//设置空调风速
export const setACWindSpeed = ({commit}, payload) => {
  commit(types.SET_AC_SPEED, payload)
}

//设置空调温度
export const setACTemperature = ({commit}, payload) => {
  commit(types.SET_AC_TEMPERATURE, payload)
}

//设置窗帘状态
export const setCurtainState = ({commit}, payload) => {
  commit(types.SET_CURTAIN_STATE, payload)
}

//设置场景状态
export const setScenceArr = ({commit}, payload) => {
  commit(types.SET_SCENCE_ARR, payload)
}

// vvv 设备状态同步用温度、光线、窗帘
export const setSyncDevice = ({commit}, payload) => {
  commit(types.SET_SYNC_DEVICE, payload)
}
export const setSyncDeviceACState = ({commit}, payload) => {
  commit(types.SET_SYNC_DEVICE_AIRSTATE, payload)
}
export const setSyncDeviceTemperature = ({commit}, payload) => {
  commit(types.SET_SYNC_DEVICE_TEMPERATURE, payload)
}
export const setSyncDeviceCurtain = ({commit}, payload) => {
  commit(types.SET_SYNC_DEVICE_CURTAIN, payload)
}
export const setSyncDeviceLight = ({commit}, payload) => {
  commit(types.SET_SYNC_DEVICE_LIGHT, payload)
}
// --- 舒适体验页多次进出使用 ---
export const setSyncDeviceWind =  ({commit}, payload) => {
  commit(types.SET_SYNC_DEVICE_WIND, payload)
}
export const setSyncDeviceMusic =  ({commit}, payload) => {
  commit(types.SET_SYNC_DEVICE_MUSIC, payload)
}
export const setSyncDeviceMusicIsPlaying = ({commit}, payload) => {
  commit(types.SET_SYNC_DEVICE_MUSIC_PLAY_STATUS, payload)
} 
// ^^^
// ------ 会员中心 ------
export const setMemberInfo = ({commit}, payload) => {
  commit(types.SET_MEMBER_INFO, payload)
}

export const setMemberOrderList = ({commit}, payload) => {
  commit(types.SET_MEMBER_ORDERLIST, payload)
}

export const setMemberOrderListTotalRecords = ({commit}, payload) => {
  commit(types.SET_MEMBER_ORDERLIST_TOTALRECORDS, payload)
}

export const setMemberOrderListLoadingShow = ({commit}, payload) => {
  commit(types.SET_MEMBER_ORDERLIST_LOADINGSHOW, payload)
}

export const setMemberOrderShow = ({commit}, payload) => {
  commit(types.SET_MEMBER_ORDER_SHOW, payload)
}

export const setMemberOrderListHeight = ({commit}, payload) => {
  commit(types.SET_MEMBER_ORDERLIST_HEIGHT, payload)
}

// 设置会员信息
import {fetchMemberInfoAxios} from '../services/axiosapi'
export const getMemberInfo = ({commit, state}, payload) => {
  fetchMemberInfoAxios(option).then(response => {
    if (response.data.Success == true) {
      console.log('fetchMemberInfoAxios get:', response)
      commit(types.SET_MEMBER_INFO, response.data.Content)
    } else {
      // load Fail
    }
  }).catch(err => {
    //alert('fetchMemberInfoAxios err:', err)
    this.utils.showNetError();
  })
}

// 设置会员订单列表信息
import {fetchMemberOrderListAxios} from '../services/axiosapi'
export const getMemberOrderList = ({commit, state}, payload) => {
  fetchMemberOrderListAxios(option).then(response => {
    if (response.data.Success == true) {
      console.log('fetchMemberOrderListAxios get:', response)
      commit(types.SET_MEMBER_ORDERLIST, response.data.Content)
    } else {
      // load Fail
    }
  }).catch(err => {
    //alert('setMemberOrderList err:', err)
    this.utils.showNetError();
  })
}

// 设置会员订单列表信息
import {fetchMemberOrdersAxios} from '../services/axiosapi'
export const getMemberOrders = ({commit, state}, payload) => {
  fetchMemberOrdersAxios(option).then(response => {
    if (response.data.Success == true) {
      console.log('fetchMemberOrdersAxios get:', response)
      commit(types.SET_MEMBER_ORDERLIST, response.data.Content)
    } else {
      // load Fail
    }
  }).catch(err => {
    //alert('setMemberOrderList err:', err)
    this.utils.showNetError();
  })
}



// 设置会员能量
export const setSmartEnergy = ({commit, state}, payload) => {
  commit(types.SET_MEMBER_SMARTENERGY, payload)
}

// 设置会员的利益
export const setMemberBenefits = ({commit, state}, payload) => {
  commit(types.SET_MEMBER_BENEFITS, payload)
}

// 设置会员的登录状态
export const setMemberLoginStatu = ({commit, state}, payload) => {
  commit(types.SET_MEMBER_LOGIN_STATU, payload)
}


/* --------- 微信授权使用 --------- */
export const setwxAuthUserInfo = ({commit}, payload) => {
  commit(types.SET_WXAUTH_USERINFO, payload)
}

/* --------- 共用组件控制 --------- */
export const showVuxToast = ({commit}, payload) => {
  commit(types.SET_VUXTOAST_DISPLAY, payload)
}
export const vuxToastSetDisplay = ({commit}, payload) => {
  commit(types.SET_TOAST_SET_DISPLAY, payload)
}

/* --------- smartHotel页面 --------- */

export const setLocalCity = ({commit}, payload) => {
  commit(types.SET_LOCAL_CITY, payload)
}

export const setHotelAllList = ({commit}, payload) => {
  commit(types.SET_HOTEL_ALL_LIST, payload)
}

export const setLocation = ({commit}, payload) => {
  commit(types.SET_LOCATION, payload)
}

export const setHotelNo = ({commit}, payload) => {
  commit(types.SET_HOTELNO, payload)
}

export const setMapurl = ({commit}, payload) => {
  commit(types.SET_MAPURL, payload)
}

export const setLoadingState = ({commit}, payload) => {
  commit(types.SET_LOADING_STATE, payload)
}




