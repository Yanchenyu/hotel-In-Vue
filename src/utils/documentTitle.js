import {titleContent} from '@/utils/headerTitle'

let titleSpecial = {
  hotelroomlist: '酒店房型列表',
  membercenter: '个人中心',
  authentication: '身份验证',
  roomcontrol: '掌上客房',
  SmartHotel: '好想住',
  orderlist: '订单列表',
  GenerateRoomCode: '获取客房码',
  ConfirmTransfer: '客房码转交',
  hotel: '好想住',
  BecomeMemberInfo:'好想住会员',
  SmartEnergyInfo:'智慧能量',
  CityNames: "选择城市",
  CurrentLocation: "当前定位"
}

export const documentTitle = Object.assign({}, titleSpecial, titleContent);
