import Vue from 'vue'
import Router from 'vue-router'

// ------ 测试页  ------
import {setSpecifiedStyle, removeSpecifiedStyle} from '@/utils/setSpecifiedPageStyle'
// 登录页
const Login = r => require.ensure(['../pages/login/Login.vue'], () => r(require('../pages/login/Login.vue')))
const RoomList = r => require.ensure(['../pages/roomlist/RoomList.vue'], () => r(require('../pages/roomlist/RoomList.vue')))
const HotelRoomLogin = r => require.ensure(['../pages/hotelRoom/HotelRoomLogin.vue'], () => r(require('../pages/hotelRoom/HotelRoomLogin.vue')))
const Remark = r => require.ensure(['../pages/hotelRoom/Remark.vue'], () => r(require('../pages/hotelRoom/Remark.vue')))
const Maintenance = r => require.ensure(['../pages/hotelRoom/Maintenance.vue'], () => r(require('../pages/hotelRoom/Maintenance.vue')))
const CheckedInRoom = r => require.ensure(['../pages/hotelRoom/CheckedInRoom.vue'], () => r(require('../pages/hotelRoom/CheckedInRoom.vue')))
Vue.use(Router)

const routers = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Login,
      meta: {title: '客栈主人'}
    }, {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {title: '客栈主人'}
    }, {
      path: '/roomlist',
      name: 'roomList',
      component: RoomList,
      meta: {title: '客房列表'}
    }, {
      path: '/hotelRoomLogin',
      name: 'hotelRoomLogin',
      component: HotelRoomLogin,
      meta: {keepAlive: true, title: '登记入住'}
    }, {
      path: '/remark',
      name: 'remark',
      component: Remark,
      meta: {title: '备注'}
    }, {
      path: '/maintenance',
      name: 'maintenance',
      component: Maintenance,
      meta: {title: '维护'}
    }, {
      path: '/checkedInRoom',
      name: 'checkedInRoom',
      component: CheckedInRoom,
      meta: {title: '用户入住'}
    }
  ]
})

routers.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  if (to.name == 'login' || to.name == 'home') {
    // 调用覆盖样式
    setSpecifiedStyle()
  } else {
    // 去除样式覆盖
    removeSpecifiedStyle()
  }
  next()
});

export default routers
