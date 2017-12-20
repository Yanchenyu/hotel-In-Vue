/**
 * @desc 根据订单状态编码返回订单状态中文描述
 */
export const orderStatusName = (orderstatus) => {
  //N 正常  C 已取消  P 已支付  HC 酒店已确认 F 订单完成 E 异常单 PC 订单改价状态 R 已退款
  let res = ''
  switch (orderstatus) {
    case 'N':
      res = '待支付'
      break;
    case 'C':
      res = '已取消'
      break;
    case 'P':
      res = '已支付'
      break;
    case 'HC':
      res = '酒店已确认'
      break;
    case 'I':
      res = '已入住'
      break;
    case 'O':
      res = '已完成'
      break;

    case 'F':
      res = '订单完成'
      break;
    case 'E':
      res = '异常单'
      break;
    case 'PC':
      res = '订单改价状态'
      break;
    case 'R':
      res = '已退款'
      break;
    case 'CS':
    res = '已消费'
    break;
    default:
      break;
  }
  return res
}

/**
 * @desc 根据订单退款状态编码返回订单退款状态中文描述
 */
export const refundStatusName = (refundstatus) => {
  //RA 申请退款 RC 酒店审核通过  RT  退款被驳回  RI 退款中 R已退款
  let res = ''
  switch (refundstatus) {
    case 'RA':
      res = '退款中'
      break;
    case 'RC':
      res = '酒店审核通过'
      break;
    case 'RT':
      res = '退款被驳回'
      break;
    case 'R':
      res = '已退款'
      break;

    default:
      res = '';
      break;
  }
  return res
}

/**
 * @desc 根据订单支付类型返回订单支付类型中文描述
 */
export const payTypeName = (paytype) => {
  //支付类型	PayType	支付类型 1 在线支付 2到店付	
  let res = ''
  switch (paytype) {
    case 1:
      res = '在线支付'
      break;
    case 2:
      res = '到店付'
      break;
    default:
      break;
  }
  return res
}

/**
 * @desc 获得早餐类型描述
 */
export const breakfastTypeName = (breakfastType) => {
  //支付类型	0 无 1  含早 2 单早 3 双早	
  let res = ''
  switch (breakfastType) {
    case 0:
      res = '无早'
      break;
    case 1:
      res = '含早'
      break;
    case 2:
      res = '单早'
      break;
    case 3:
      res = '双早'
      break;
    default:
      break;
  }
  return res
}
