// 计算日期转换成format格式
export const formatDate = (now) => {
  var nowYear = now.getFullYear();
  var nowMonth = now.getMonth();
  var nowDate = now.getDate();
  nowMonth = doHandleMonth(nowMonth + 1);
  nowDate = doHandleMonth(nowDate);
  return nowYear + '-' + nowMonth + '-' + nowDate;
}

export const doHandleMonth = (month) => {
  if (month.toString().length == 1) {
    month = '0' + month;
  }
  return month;
}

// 计算当天
export const getToday = formatDate(new Date());

// 计算某天的昨天
export const getYesterday = (date) => {
  date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
  return formatDate(date)
};

// 计算某天的明天
export const getTomorrow = (date) => {
  date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
  return formatDate(date)
}

