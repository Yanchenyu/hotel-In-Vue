// const baseIp = 'http://106.15.56.108'
const baseIp = 'http://101.132.17.98'
const baseHost = 'http://www.thinkia.club'
const baseHosts = 'https://www.thinkia.club'

// 中间层接口
export const serviceMiddle = baseHosts + '/VueMiddleService/workload'  // 微信授权等使用
export const AppleChecking = false;

/* ------------------------------------ 苏遇测试用配置（2017-8.21已暂停使用）------------------------------------------- */

// // 苏遇测试用配置
// export const serviceIpHotel = baseIp + ':8011'
// export const serviceIpPay = baseHosts + '/testpay'
// // export const serviceIpPay = baseHost + ':8016'      // 支付替换成域名接口，微信屏蔽
// // 会员中心服务请求
// export const serviceIPMember = baseIp + ':8012'      //会员接口
// export const serviceIPOrder = baseIp + ':8013'       //订单接口

// //TODO  临时
// export const syHotelId = 'JP0001'

// // 微信授权开关
// export const wxAuthEnable = true;

/* ------------------------------- 测试用配置（2017-8-21替换原苏遇版本，该配置正式启用）------------------------------------ */

// 羡家测试用配置
export const serviceIpHotel = baseIp + ':7011'
export const serviceIpPay = baseHosts + '/testpay'
// export const serviceIpPay = baseIp + ':7016'       //原羡家测试支付接口配置
// export const serviceIpPay = baseHost + ':8016'      // 支付替换成域名接口，微信屏蔽
// 会员中心服务请求
export const serviceIPMember = baseIp + ':7012'      //会员接口
export const serviceIPOrder = baseIp + ':7013'       //订单接口

//TODO  临时
export const syHotelId = 'JP0001'
// 微信授权开关
export const wxAuthEnable = true;
// 免支付开关
export const prodOnline = false;

/* ----------------------------------------------- 苏遇正式环境配置----------------------------------------------- */

// 苏遇正式环境配置 https
// export const serviceIpHotel = baseHosts + '/HotelService'
// export const serviceIpPay = baseHosts + '/pay'      // 支付替换成域名接口，微信屏蔽
// // 会员中心服务请求
// export const serviceIPMember = baseHosts +'/MemberService'      //会员接口
// export const serviceIPOrder = baseHosts + '/OrderService'       //订单接口

// //正式蘇遇酒店編號SY001
// export const syHotelId = 'SY001'

// // 微信授权开关
// export const wxAuthEnable = true;
// // 正式上线开关
// export const prodOnline = true;

/* ----------------------------------------------- ***************----------------------------------------------- */

// 缓存清除版本控制，注意！ 如果变化会清掉用户端所有缓存信息
export const appVersion = '2017083101'

// 平台id定义
export const AppIdList = {
  SY001: 'wxcd825c72e53abff4',
  thinkia: 'wxc07d126a829a1649',
}
