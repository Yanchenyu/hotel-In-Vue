/**
 * localStorage setItem
 * @param {*} store
 * @param {*} key
 * @param {*} value
 */
export const storeSet = (store, key, value) => {
  let common = localStorage[store];
  common = (common ? JSON.parse(common) : {});
  common.value = common.value ? common.value : {};

  common.value[key] = value;
  localStorage[store] = JSON.stringify(common);
}

export const storeGet = (store, key) => {
  let common = localStorage[store];
  common = (common ? JSON.parse(common) : {});
  common.value = common.value ? common.value : {};

  return common.value[key];
}

/* ------------ 具体方法 ------------
 /**
 * 获取用户授权localStorage中的unionId
 */
import {is_weixin} from '@/utils/device'
export const ls_unionId = () => {
  if (is_weixin()) {
    return storeGet('SH_wxAuth', 'unionid') ? storeGet('SH_wxAuth', 'unionid') : '';
  } else {
    // 此处不可以使用假uniondid, 必须为空！
    return ''
  }
};

export const resetAppStorage = (prodOnline, appVersion) => {
  // 缓存检测, 每次正式发布，会清掉用户所有缓存信息
  if (true && (!storeGet('SH_CommonStore', 'appversion') || (storeGet('SH_CommonStore', 'appversion') != appVersion))) {
    localStorage.clear();
    storeSet('SH_CommonStore', 'appversion', appVersion)
    console.log('App updated, clear all cache!')
    // TODO
    // 不清除用户登录信息， 还有哪些信息需要保留
  }
}
