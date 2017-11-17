import axios from 'axios'
import {serviceIpHotelMaster, serviceIpHotelRoom, serviceIpCheckout} from './config.js'
// 检查状态
function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}
// 客栈主人登录
export const hotelMasterLogin = params => {
  return axios.get(`${serviceIpHotelMaster}/HostelAccount/Login?UserName=${params.userName}&PassWord=${params.password}&callback`, {})
    .then(checkStatus)
    .then(response => {
      return response
    })
}
// 客房列表
export const hotelRoomList = params => {
  return axios.get(`${serviceIpHotelMaster}/HostelRoom/QueryHostelRoomList?Token=${params.token}`, {})
    .then(checkStatus)
    .then(response => {
      return response
    })
}
// 单个房间状态为空的时候获取全部订单
export const hotelRoomOrderList = params => {
  return axios.get(`${serviceIpHotelMaster}/HostelOrder/QueryHostelOrderList?Token=${params.token}&RoomTypeId=${params.roomTypeId}`, {})
    .then(checkStatus)
    .then(response => {
      return response
    })
}
// 单个房间状态为已预订的时候获取订单
export const hotelRoomAlreadyOrderList = params => {
  return axios.get(`${serviceIpHotelMaster}/HostelOrder/GetHostelSingleOrder?Token=${params.token}&OrderId=${params.orderId}`, {})
    .then(checkStatus)
    .then(response => {
      return response
    })
}
// 登记入住接口
export const hotelCheckIn = params => {
  return axios.get(`${serviceIpHotelMaster}/HostelOrder/HostelCheckIn`, {
    params: params
  })
    .then(checkStatus)
    .then(response => {
      return response
    })
}
// 远程开门接口
export const openDoor = params => {
  return axios.get(`${serviceIpHotelRoom}/room/RemoteOpenDoor?roomid=${params.roomId}`, {})
    .then(checkStatus)
    .then(response => {
      return response
    })
}
// 发送门锁密码
export const sendDoorPassword = params => {
  return axios.get(`${serviceIpHotelMaster}/HostelOrder/SendDoorPassManual?HotelRoomId=${params.roomId}&Token=${params.token}&PhoneNo=${params.phone}`, {})
    .then(checkStatus)
    .then(response => {
      return response
    })
}
// 房间维修状态
export const upDateHotelRoomStatus = params => {
  return axios.get(`${serviceIpHotelMaster}/HostelRoom/UpdateHostelRoomStatus?Token=${params.token}&HotelRoomId=${params.hotelRoomId}&RoomStatus=${params.roomStatus}`, {})
    .then(checkStatus)
    .then(response => {
      return response
    })
}
// 房间可预订状态
export const updateHostelRoomStatusReady = params => {
  return axios.get(`${serviceIpHotelMaster}/HostelRoom/UpdateHostelRoomStatusReady?Token=${params.token}&HotelRoomId=${params.hotelRoomId}`, {})
    .then(checkStatus)
    .then(response => {
      return response
    })
}
// 房间入住人信息列表
export const getHotelCustomers = params => {
  return axios.get(`${serviceIpHotelMaster}/HostelRoom/QueryHostelRoomCustomerList?Token=${params.token}&HotelRoomId=${params.hotelRoomId}&OrderId=${params.orderId}`, {})
    .then(checkStatus)
    .then(response => {
      return response
    })
}
// 一键退房功能
export const hotelCheckOut = params => {
  return axios.get(`${serviceIpCheckout}/HotelCheckin/Checkout?RoomId=${params.roomId}&OrderId=${params.orderId}`, {})
    .then(checkStatus)
    .then(response => {
      return response
    })
}
