/**
 * @desc: 计算两个日期间隔多少天
 */
export function calcDayscount(firstDay, secondDay) {
  var oneDay = 24 * 60 * 60 * 1000;
  var firstDate = new Date(firstDay);
  var secondDate = new Date(secondDay);
  return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
}

/**
 * @desc 计算日期别名(今天、明天、后天、其它显示星期几)
 */
const dayArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
export const calcDateAliasName = (dateStr) => {
  const now = new Date()
  var dt = new Date(dateStr)
  if (dt.getDate() == now.getDate()
    && dt.getMonth() == now.getMonth()
    && dt.getFullYear() == now.getFullYear()) {
    return "今天"
  } else {
    return dayArr[dt.getDay()]
  }
}

/**
 * Js Date format YYYY-MM-DD
 * 也可以使用原生方法 .toLocaleDateString() -> 2010/01/01
 * date.toISOString().split('T')[0]
 */
export const formatDate = (date) => {
  var d = new Date(date)
  return [
    d.getFullYear(),
    ('0' + (d.getMonth() + 1)).slice(-2),
    ('0' + d.getDate()).slice(-2)
  ].join('-')
}


/**
 * @desc 计算n天后的时间
 */
export const daysLater = (date, n) => {
  return new Date(new Date(date).getTime() + n * 24 * 60 * 60 * 1000)
}

/**
 * @desc 计算n天后的时间，转换成标准形式
 */
// export const getNewDay = (dateTemp, days) => {
//     var dateTemp = dateTemp.split("-");
//     var nDate = new Date(dateTemp[1] + ',' + dateTemp[2] + ',' + dateTemp[0]);
//     var millSeconds = Math.abs(nDate) + (days * 24 * 60 * 60 * 1000);
//     var rDate = new Date(millSeconds);
//     var year = rDate.getFullYear();
//     var month = rDate.getMonth() + 1;
//     if (month < 10) month = "0" + month;
//     var date = rDate.getDate();
//     if (date < 10) date = "0" + date;
//     return (year + "-" + month + "-" + date);
// }
export const getNewDay = (date, days) => {
  var nd = new Date(date);
  nd = nd.valueOf();
  nd = nd + days * 24 * 60 * 60 * 1000;
  nd = new Date(nd);
  //alert(nd.getFullYear() + "年" + (nd.getMonth() + 1) + "月" + nd.getDate() + "日");
  var y = nd.getFullYear();
  var m = nd.getMonth() + 1;
  var d = nd.getDate();
  if (m <= 9) m = "0" + m;
  if (d <= 9) d = "0" + d;
  var cdate = y + "-" + m + "-" + d;
  return cdate;
};

export const getToDay = () => {
  var now = new Date();
  var nowYear = now.getFullYear();
  var nowMonth = now.getMonth();
  var nowDate = now.getDate();
  nowMonth = doHandleMonth(nowMonth + 1);
  nowDate = doHandleMonth(nowDate);
  return nowYear + "-" + nowMonth + "-" + nowDate;
}

export const getTomorrow = () => {
  var now = new Date();
  var nowYear = now.getFullYear();
  var nowMonth = now.getMonth();
  var nowDate = now.getDate();
  nowMonth = doHandleMonth(nowMonth + 1);
  nowDate = doHandleMonth(nowDate + 1);
  return nowYear + "-" + nowMonth + "-" + nowDate;
}

export const doHandleMonth = (month) => {
  if (month.toString().length == 1) {
    month = "0" + month;
  }
  return month;
}
