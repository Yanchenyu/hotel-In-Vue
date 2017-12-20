import axios from 'axios'
import jsonp from 'jsonp'
import {
  serviceIpHotel, serviceIpPay, serviceIPMember, serviceIPOrder,
  serviceMiddle
} from './config.js'

// 检查状态
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

/* --------- 酒店页面使用 --------- */
/**
 * @desc 获取酒店信息简介
 */
export const fetchHotelInfoAxios = (params) => {
  console.log('serviceIpHotel', serviceIpHotel);
  return axios.get(`${serviceIpHotel}/Hotel/LoadHotelView`, {
    params: {
      hotelNo: params.hotelNo
    }
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 获取酒店列表信息
 */
export const getHotelList = (params) => {
  return axios.get(`${serviceIpHotel}/HotelQuery/QueryHotelsList`, {
    params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}
/**
 * @desc 获取房型列表
 */
// export const fetchHotelRoomList = (params) => {
//   return axios.get(`${serviceIpHotel}/Hotel/LoadHotelRoomTypePriceView`,{
//     params: params
//   })
//   .then(checkStatus)
//   .then(response => {
//     return response
//   })
// }
export const fetchHotelRoomList = (params) => {
  return axios.get(`${serviceIpHotel}/HotelRates/list`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 获取房间信息详情
 */
export const getHotelPriceData = (params) => {
  return axios.get(`${serviceIpHotel}/HotelRates/Detail`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 获取房间详情
 */
export const fetchHotelDetail = params => {
  return axios.get(`${serviceIpHotel}/Hotel/LoadHotelRoomTypeView`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}
/**
 * 订单创建
 * @param {Object} params TODO 改用axios JSONP应对策略 - https://github.com/mzabriskie/axios/blob/master/COOKBOOK.md#jsonp
 */
export const book2SubmitCreateOrder = params => {
  // TODO 后续改成Post
  return axios.get(`${serviceIPOrder}/HotelOrder/Create`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * 阿里支付接口调用
 * @param {Object} params
 */
export const AliPayApi = params => {
  console.log(`${serviceIpPay}/Ali_Service.aspx?para=${params.para}&callback=${params.callback}`)
  window.location.href = `${serviceIpPay}/Ali_Service.aspx?para=${params.para}&callback=${params.callback}`
}
/**
 * 微信扫码支付接口调用
 * @param {Object} params
 */
export const wxScanPay = params => {

  window.location.href = `${serviceIpPay}/WeiXin_Service.aspx?para=${params.para}&callback=${params.callback}`

  // return axios.get(`${serviceIpPay}/WeiXin_Service.aspx?para=${params.para}&callback=${params.callback}`)
  // .then(checkStatus)
  // .then(response => {
  //   return response
  // })
}
/**
 * 支付结果查询接口
 */
export const getPayResult = params => {
  return axios.get(`${serviceIpPay}/GetPayResult.aspx`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}
/**
 * 内部白名单面免密支付
 */
export const book3SkipPay = params => {
  return axios.get(`${serviceIPOrder}/AliPayBack/HotelOrderPayCallBack`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}



// 自主选房页面，楼层房间map查询
export const queryHotelRoomMap = params => {
  return axios.get(`${serviceIpHotel}/HotelFloorMapQuery/QueryHotelFloorMapList`, {
    params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

// 房间选择接口
export const hotelRoomMapSelect = params => {
  return axios.get(`${serviceIpHotel}/HotelFloorMapQuery/SelectRoomFloorMap`, {
    params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

// 房间取消选择接口
export const hotelRoomMapUnselect = params => {
  return axios.get(`${serviceIpHotel}/HotelFloorMapQuery/UnSelectRoomFloorMap`, {
    params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}
// 房间批量取消选择接口，无需考虑渲染页面更新
export const batchUnSelectRoomFloorMap = params => {

  return axios.get(`${serviceIpHotel}/HotelFloorMapQuery/BatchUnSelectRoomFloorMap`, {
    params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}
// 自主选房价格查询
export const getRoomSelectFee = params => {
  return axios.get(`${serviceIPOrder}/HotelOrder/QuerySelectRoomFee`, {
    params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/* --------- 酒店控制页面 --------- */

/**
 * 房间控制前，身份验证
 * @param {Object} params
 */
export const roomControlIdVerify = params => {
  return axios.get(`${serviceIPOrder}/HotelRoomCode/HotelRoomLogin`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * 捞取可控制的房间
 * @param {Object} params
 */
export const getControlRoom = params => {
  return axios.get(`${serviceIPOrder}/HotelCheckin/LoginRoom?phone=${params.phone}`, {})
    .then(checkStatus)
    .then(response => {
      return response
    })
}
/**
 * 验证身份
 * @param {Object} params
 */
export const userInfoCheck = params => {
  return axios.get(`${serviceIPOrder}/HotelCheckin/QueryCheckin?checkinId=${params.checkInId}`, {})
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * 一键退房
 * @param {Object} params
 */
export const hotelCheckOut = params => {
  return axios.get(`${serviceIPOrder}/HotelCheckin/Checkout?checkinId=${params.checkInId}`, {})
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * 加载房间基本数据
 * @param {Object} params
 */
export const roomControlLoadRoomData = params => {
  return axios.get(`${serviceIpHotel}/Room/LoadCustomerRoom`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}
/**
 * 加载房间环境数据
 * @param {Object} params
 */
export const roomControlLoadEvnData = params => {
  return axios.get(`${serviceIpHotel}/Scene/LoadCurrentEnvironment`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}
/**
 * 加载房间场景
 * @param {Object} params
 */
export const roomControlLoadScene = params => {
  return axios.get(`${serviceIpHotel}/Scene/LoadRoomScenes`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}
/**
 * 获取开锁密码
 * @param {Object} params
 */
export const roomControlLoadDoorKey = params => {
  return axios.get(`${serviceIpHotel}/Room/LoadRoomOpeningCode`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * 修改开锁密码
 * @param {Object} params
 */
export const changeRoomDoorKey = params => {
  return axios.get(`${serviceIpHotel}/Room/ChangeRoomOpeningCode?roomId=${params.roomId}&password=${params.password}`, {})
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * 获取房间设备列表
 * @param {Object} params
 */
export const fetchroomDeviceList = params => {
  return axios.get(`${serviceIpHotel}/Device/RoomDevicesList`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * 设定房间场景（自定义部分）
 * @param {Object} params
 */
export const setRoomSceneCustom = params => {
  return axios.get(`${serviceIpHotel}/Scene/ApplyScene`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * 获取当前房间住客
 * @param {Object} params
 */
export const getHotelRoomCheckinCustomers = params => {
  return axios.get(`${serviceIPOrder}/HotelCheckin/GetHotelRoomCheckinCustomers`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * 获得房间设备状态
 * @param {Object} params
 */
export const getDeviceStatus = params => {
  return axios.get(`${serviceIpHotel}/Device/Status?roomId=${params.roomId}&deviceId=${params.deviceId}`, {}
  )
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * 设备状态变化接口
 * @param {Object} params
 */
export const changeDeviceStatus = params => {
  return axios.get(`${serviceIpHotel}/Device/Command?MemberId=${params.MemberId}&DeviceId=${params.Id}&cmdId=${params.cmdId}&cmdValue=${params.cmdValue}`, {}
  )
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * 设备定时场景开启
 * @param {Object} params
 */
export const openTimeScene = params => {
  return axios.get(`${serviceIpHotel}/Scene/EnableTimeScene?sceneId=${params.sceneId}&dateTime=${params.dateTime}`, {}
  )
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * 设备定时场景关闭
 * @param {Object} params
 */
export const closeTimeScene = params => {
  return axios.get(`${serviceIpHotel}/Scene/DisableTimeScene?sceneId=${params.sceneId}`, {}
  )
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * 查询是否满房
 * @param {Object} params
 */
export const checkFullHouse = params => {
  return axios.get(`${serviceIpHotel}/HotelRates/OrderRoomCount?orderId=${params.orderId}`, {}
  )
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * 获取发现界面设备状态
 * @param {Object} params
 */
export const loadDevicesInRoomPanel = params => {
  return axios.get(`${serviceIpHotel}/device/DevicesInRoomPanel?roomid=${params.roomId}`, {}
  )
    .then(checkStatus)
    .then(response => {
      return response
    })
}



/**
 * 15分钟回归舒适体验
 * @param {Object} params
 */
export const set15minsComfortableEnv = params => {
  return axios.get(`${serviceIpHotel}/Scene/SetComfortableEnvironment`, {
    params: params  // ?roomId=ce448750-2d2e-49b1-a8eb-a81d82a41db1&memberId=123
    })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * 舒适体验自主学习开关getter
 */
export const comfortableStudyStatusGet = params => {
  return axios.get(`${serviceIPMember}/HotelEnvGather/Status`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}
/**
 * 舒适体验自主学习开关setter
 */
export const comfortableStudyStatusSet = params => {
  return axios.get(`${serviceIPMember}/HotelEnvGather/EnableGather`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}
/**
 * 舒适体验偏好数据getter
 */
export const comfortableSettingsGet = params => {
  return axios.get(`${serviceIPMember}/HotelEnvGather/MemberHotelEnvIndicators`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * 舒适体验偏好数据setter; 温度、风速、光线、窗帘、音乐
 */


export const comfortableDeviceSet = params => {
  return axios.get(`${serviceIpHotel}/HotelRoomEnv/SetHotelRoomEnv`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}


/* --------- 会员中心页面使用 --------- */
/**
 * @desc 获取会员信息
 */
export const fetchLoadMemberDetailViewByIdAxios = (params) => {
  return axios.get(`${serviceIPMember}/Member/LoadMemberDetailViewById`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 获取会员信息
 */
export const fetchMemberInfoAxios = (params) => {
  return axios.get(`${serviceIPMember}/Member/LoadMemberDetailView`, {
    params: {
      phone: params.phone
    }
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 根据绑定ID获取会员信息
 */
export const fetchLoadMemberDetailViewByBindIdAxios = (params) => {
  return axios.get(`${serviceIPMember}/Member/LoadMemberDetailViewByBindId`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 注册会员信息
 */
export const fetchCreateMemberInfoAxios = (params) => {
  return axios.get(`${serviceIPMember}/Member/Create`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 保存会员信息
 */
export const fetchSaveMemberInfoAxios = (params) => {
  return axios.get(`${serviceIPMember}/Member/Save`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 将会员头像上传到图片服务器
 */
export const saveMemberHeadImg = (params) => {
  return axios.post(`${serviceIPMember}/MemberImage/UploadFile`, params)
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 将图片服务器返回的图片链接上传到后台数据库
 */
export const saveMemberHeadImgUpload = (params) => {
  return axios.post(`${serviceIPMember}/Member/SaveAvatar`, params)
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc App绑定会员手机号
 */
export const fetchBindingMemberPhoneAxios = (params) => {
  console.log('serviceIPMember', serviceIPMember);
  return axios.get(`${serviceIPMember}/Member/BindingMemberPhone`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 微信绑定会员手机号
 */
export const fetchBindingMemberPhoneByWeChatAxios = (params) => {
  console.log('serviceIPMember', serviceIPMember);
  return axios.get(`${serviceIPMember}/Member/BindingMemberPhoneByWeChat`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 生成短信验证码
 */
export const fetchCreateVerificationCodeAxios = (params) => {
  console.log('serviceIPMember', serviceIPMember);
  return axios.get(`${serviceIPMember}/Member/CreateVerificationCode`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}


/**
 * @desc 注册获取成短信验证码
 */
export const fetchCreateVerificationCodeForRegisterAxios = (params) => {
  return axios.get(`${serviceIPMember}/Member/CreateVerificationCodeForRegister`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 修改密码获取成短信验证码
 */
export const fetchCreateVerificationCodeForPasswordAxios = (params) => {
  return axios.get(`${serviceIPMember}/Member/CreateVerificationCodeForPassword`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}


/**
 * @desc 短信验证码验证或登录
 */
export const fetchLoginByCodeAxios = (params) => {
  return axios.get(`${serviceIPMember}/Member/LoginByCode`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 登录
 */
export const fetchLoginAxios = (params) => {
  return axios.get(`${serviceIPMember}/Member/Login`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 通过短信验证码登录
 */
export const fetchLoginByPhoneCodeAxios = (params) => {
  return axios.get(`${serviceIPMember}/Member/LoginByPhoneCode`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 修改密码
 */
export const fetchChangePasswordAxios = (params) => {
  return axios.get(`${serviceIPMember}/Member/ChangePassword`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 获取智慧能量
 */
export const fetchLoadSmartEnergyAxios = (params) => {
  return axios.get(`${serviceIPMember}/Member/LoadSmartEnergy`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 获取会员等级及权益
 */
export const fetchLoadMemberLevelAndBenefitsAxios = (params) => {
  return axios.get(`${serviceIPMember}/Member/LoadMemberLevelAndBenefits`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}


/**
 * @desc 获取会员订单列表信息
 */
export const fetchMemberOrderListAxios = (params) => {
  return axios.get(`${serviceIPOrder}/HotelOrder/LoadMemberOrders`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 获取会员订单列表信息
 */
export const fetchMemberOrdersAxios = (params) => {
  return axios.get(`${serviceIPOrder}/HotelOrder/MemberOrders`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 预定人检查是否登录房间的权限
 */
export const fetchCanOrderBookerLoginAxios = (params) => {
  return axios.get(`${serviceIPOrder}/HotelCheckin/CanOrderBookerLogin`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}


/**
 * @desc 预定人登录房间
 */
export const fetchOrderBookerLoginAxios = (params) => {
  console.log('serviceIPOrder', serviceIPOrder);
  return axios.get(`${serviceIPOrder}/HotelCheckin/OrderBookerLogin`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 预定人退出房间
 */
export const fetchOrderBookerLogoutAxios = (params) => {
  console.log('serviceIPOrder', serviceIPOrder);
  return axios.get(`${serviceIPOrder}/HotelCheckin/OrderBookerLogout`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 客房码转交给当前房间同住人
 */
export const fetchRoomCodeTransferAxios = (params) => {
  console.log('serviceIPOrder', serviceIPOrder);
  return axios.get(`${serviceIPOrder}/HotelRoomCode/Transfer`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 客房码分发给其他人接口
 */
export const fetchRoomCodeDistributeAxios = (params) => {
  console.log('serviceIPOrder', serviceIPOrder);
  return axios.get(`${serviceIPOrder}/HotelRoomCode/Distribute`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}


/**
 * @desc 获取会员订单详情信息
 */
export const fetchMemberOrderDetailAxios = (params) => {
  console.log('serviceIPOrder', serviceIPOrder);
  return axios.get(`${serviceIPOrder}/HotelOrder/OrderDetail`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 获取会员订单删除
 */
export const fetchMemberOrderDeleteAxios = (params) => {
  console.log('serviceIPOrder', serviceIPOrder);
  return axios.get(`${serviceIPOrder}/HotelOrder/Delete`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 获取会员订单取消
 */
export const fetchMemberOrderCancelAxios = (params) => {
  console.log('serviceIPOrder', serviceIPOrder);
  return axios.get(`${serviceIPOrder}/HotelOrder/Cancel`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 发现登录页面获取客房码
 */
export const fetchGetRoomCodeAxios = (params) => {
  console.log('serviceIPOrder', serviceIPOrder);
  return axios.get(`${serviceIPOrder}/HotelRoomCode/GetHotelRoomCode`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 产生客房码页面获取客房码
 */
export const fetchGetRoomCodeWithCheckinIdAxios = (params) => {
  console.log('serviceIPOrder', serviceIPOrder);
  return axios.get(`${serviceIPOrder}/HotelRoomCode/GetRoomCodeByCheckinId`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}


/**
 * @desc 确认客房码
 */
export const fetchConfirmRoomCodeAxios = (params) => {
  console.log('serviceIPOrder', serviceIPOrder);
  return axios.get(`${serviceIPOrder}/HotelRoomCode/Confirm`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 拒绝客房码
 */
export const fetchRefuseRoomCodeAxios = (params) => {
  console.log('serviceIPOrder', serviceIPOrder);
  return axios.get(`${serviceIPOrder}/HotelRoomCode/Refuse`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 * @desc 获取会员订单去支付
 */


/**
 * @desc 获取会员订单申请退款
 */
export const fetchMemberOrderRefundAxios = (params) => {
  console.log('serviceIPOrder', serviceIPOrder);
  return axios.get(`${serviceIPOrder}/HotelOrder/Refund`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}

// 会员授权用
/**
 * 判断用户是否存在
 * @param {Object} params
 */
export const CheckUnionIDExist = (params) => {

  return axios.get(`${serviceIPMember}/Member/FindMember`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}


/* --------- 中间层数据请求 --------- */
/**
 * 中间层根据code获取用户opendID信息
 * @param {Object} params
 */
export const middleServiceGetOpenID = (params) => {

  return axios.post(`${serviceMiddle}/load/GetOpenID`, {
    Code: params.Code,
    platId: params.platId
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}
/**
 * 中间层使用opendID信息
 * @param {Object} params
 */
export const middleServiceGetUserInfoByOpenId = (params) => {
  return axios.post(`${serviceMiddle}/load/WeChatGetUserInfo`, params)
    .then(checkStatus)
    .then(response => {
      return response
    })
}


/* --------- 微信部分接口调试 --------- */
// getAccessToken 取消前端调用权限，全部后台调用和存储
/**
 *
 * @param {Object} params
 */
export const getTicket = (params) => {
  return axios.post(`${serviceMiddle}/load/WeXinGetJsApiTicket`, params)
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 *
 * @param {Object} params
 */
export const genJsSignature = (params) => {
  return axios.post(`${serviceMiddle}/load/WeXinGenJsSignature`, params)
    .then(checkStatus)
    .then(response => {
      return response
    })
}

/**
 *
 * @param {Object} params serviceIpPay
 */
export const getJsApiParaInfo = (params) => {
  return axios.get(`${serviceIpPay}/GetJsApiParaInfo.aspx?para=${params.para}&openid=${params.openid}`, {})
    .then(checkStatus)
    .then(response => {
      return response
    })
}


/* --------- 微信推送接口 --------- */

/**
 * 中间层调用消息推送接口
 * @param {Object} params
 */












