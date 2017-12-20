// 手机号正则表达式
export const isEmail = function (e) {
  var t = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return t.test(e)
}
export const isPassword = e => {
  var t = /^[a-zA-Z0-9]{6,20}$/;
  return t.test(e)
}
export const isMobile = e => {
  var t = /^(1[3-8][0-9])\d{8}$/;
  return t.test(e)
}
export const isChinese = e => {
  var t = /^[\u4e00-\u9fff]{0,}$/;
  return t.test(e)
}
export const isEnglish = e => {
  var t = /^[A-Za-z]+$/;
  return t.test(e)
}
export const isZip = e => {
  var t = /^\d{6}$/;
  return t.test(e)
}
export const isDateStr = e => {
  var t = /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229)$/;
  return t.test(e) ? !0 : !1
}
export const isIdCard = e => {
  var t = e.toLowerCase().match(/\w/g);
  if (e.match(/^\d{17}[\dx]$/i)) {
    var n = 0,
      r = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    for (var i = 0; i < 17; i++) n += parseInt(t[i], 10) * r[i];
    return '10x98765432'.charAt(n % 11) != t[17] ? !1 : !!e.replace(/^\d{6}(\d{4})(\d{2})(\d{2}).+$/, '$1-$2-$3')
  }
  return e.match(/^\d{15}$/) ? !!e.replace(/^\d{6}(\d{2})(\d{2})(\d{2}).+$/, '19$1-$2-$3') : !1
}
export const isQq = e => {
  return /^[1-9]\d{4,}$/.test(e)
}
export const isUrl = e => {
  return /^http(s)?:\/\/[A-Za-z0-9\-]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\:+!]*([^<>])*$/.test(e)
}
export const isIP = e => {
  if (!e || result.isNull(e)) return !1;
  var t = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g;
  return t.test(e) && RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256 ? !0 : !1
}
export const isCharsLenWithinRange = (e, t) => {
  if (!result.isString(e)) return !1;
  var n = e.match(/\W/g),
    r = n == null ? e.length : e.length + n.length,
    i = r >= 0 && r <= t;
  return i ? (this.cutLen = e.length, !0) : !1
}
export const trim = (s) => {
  return s.replace(/(^\s*)|(\s*$)/g, "");
}

