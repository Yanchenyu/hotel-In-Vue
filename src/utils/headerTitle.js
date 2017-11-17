/**
 * 根据router.name获取页面标题
 * name表示title名
 * back表示是否有返回按钮
 * maintain表示是否有维修按钮
 * */
export const pageTitle = {
  // login: '登陆',
  // home: '',
  roomList: {
    name: '我的客房',
    back: true,
    maintain: false
  },
  hotelRoomLogin: {
    name: '',
    back: true,
    maintain: true
  },
  remark: {
    name: '备注',
    back: true,
    maintain: false
  },
  maintenance: {
    name: '',
    back: true,
    maintain: false
  },
  checkedInRoom: {
    name: '',
    back: true,
    maintain: false
  }
}
