/*
 * 通信数据接口文件
 */

import Vue from 'vue'

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

//var rootp = 'http://jsonplaceholder.typicode.com'
var rootp = 'http://localhost:3000'
export const axiosApi = () => {
  console.log('axiosApi:', Vue.http)

  return Vue.http.get(`${rootp}/posts/2`)
    .then(checkStatus)
    .then(response => {
      return response
    })
}



