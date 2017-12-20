import fetch from 'isomorphic-fetch'
import {serviceIpHotel} from './config.js'
const GET_OPTION = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

/**
 * @param Object params 查询参数
 * @return Promise      接口返回JSON格式数据
 */
export const fetchHotelInfo = (params) => {
  console.log('serviceIpHotel', serviceIpHotel);
  return fetch(`${serviceIpHotel}/Hotel/LoadHotelView`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
    .then(checkStatus)
    .then(response => {
      return response.json()
    })
}
export const fetchHotelInfoGet = (params) => {
  console.log('serviceIpHotel', serviceIpHotel);
  return fetch(`${serviceIpHotel}/Hotel/LoadHotelView?hotelNo=jp0001`, GET_OPTION)
    .then(checkStatus)
    .then(response => {
      return response.json()
    })
}

/**
 * @param Object params 查询参数
 * @return Promise      接口返回JSON格式数据
 */
export const fetchHotelRoomList = (params) => {

}

