<!-- 订单详情页面 -->
<template>
  <div>
    <div>
      <!-- 费用信息 -->
      <div class="feeDetailinfo_div ">
        <div class="itemwrap cus-flexrow" style="marging-bottom:15px;padding-left:10px;">
          <div class="cus-flexcolumn" style="flex:0.9" v-if="isAppleDisable()">
                <div class="orderStaus_div"> {{orderDetail.OrderStatusName}}</div>
                <div class="orderStaus_des_div"> {{this.orderDes}} </div>
          </div>
          <div class="cus-flexcolumn" style="flex:0.1">
             <div v-if="btntoPay" >
                    <span class="btn-toPay" @click="orderPay_click()">去支付</span>
             </div>
          </div>

        </div>
        <div class="thinLine" style="margin-top:15px;"></div>
        <div class="itemwrap cus-flexrow" style="padding-left:10px;" @click="toggleExpand()">
          <div class="cus-flexcolumn" style="flex:1;">
            <div>
              <!-- 左侧描述 -->
              <div class="cus-flexcolumn" style="flex:1; ">
                <div class="cus-h1">
                  <span> {{orderDetail.PayTypeName}}</span>
                  <span class="cus-h1 cus-priceColor">&nbsp;&nbsp;&nbsp;&nbsp;￥</span>
                  <span class="cus-h1 cus-priceColor">{{orderDetail.OrderAmount}}</span>
                </div>

              </div>
              <!-- 右侧价格&箭头-->
              <div class="feeDetailwrap">
                <span class="cus-small cus-ftColorBlack3">费用明细</span>
                <span style="position:relative;">
                    <span :class="linkClass(orderDetail.expand)"></span>
                </span>
              </div>
            </div>
          </div>
        </div>


        <!-- 展开后详细列表 -->
        <!-- TODO注意weex中不支持Vue的template方法；需要验证 -->
        <template v-if="orderDetail.expand == 'up'" v-for="(detail, index) in orderDetail.feellist">
          <div class="detailwrap" style="padding-left:10px;">
            <div class="cus-flexrow" style="justify-content: space-between">
              <div class="cus-normal feelistwap">
                <span>{{detail.DateTime}}</span>
              </div>
              <div class="cus-normal feelistwap">
                <span> {{detail.BreakFastType}} </span>
              </div>
              <div class="cus-normal feelistwap" style="padding-right:10px;">
                <span> ￥  {{detail.OriginalAmount}} X {{detail.TotalRooms}}间</span>
              </div>
            </div>
          </div>
        </template>
        <div v-if="orderDetail.promotionlist!=null" class="thinLine"></div>
        <template v-if="orderDetail.expand == 'up'" v-for="(detail, index) in orderDetail.promotionlist">
          <div class="detailwrap" style="padding-left:10px;">
            <div class="cus-flexrow" style="justify-content: space-between">
              <div class="cus-normal feelistwap">
                <span>{{detail.DateTime}}</span>
              </div>
              <div class="cus-normal feelistwap">
                <span> {{detail.PromotionMark}} </span>
              </div>
              <div class="cus-normal feelistwap" style="padding-right:10px;">
                <span> -￥  {{detail.ProtomtionPrice}} </span>
              </div>
            </div>
          </div>
        </template>
        <div class="thinLine"></div>
        <template v-if="orderDetail.expand == 'up'" v-for="(detail, index) in orderDetail.SelectRoomFeelist">
          <div class="detailwrap" style="padding-left:10px;">
            <div class="cus-flexrow" style="justify-content: space-between">
              <div class="cus-normal feelistwap">
                <span>{{detail.DateTime}}</span>
              </div>
              <div class="cus-normal feelistwap">
                <span> 自主选房费 </span>
              </div>
              <div class="cus-normal feelistwap" style="padding-right:10px;">
                <span> ￥  {{detail.SelectRoomFee}} </span>
              </div>
            </div>
          </div>
        </template>                

      </div>
      <!-- 操作按钮-->
      <!-- 苹果审核 暂时屏蔽 v-if="isAppleDisable()" -->
      <div class="operate_div" v-show="btnOrderFlag">
        <div>
          <span class="btn_book">再次预订</span>
        </div>
      </div>
      <!-- 房型信息 -->
      <div class="roomTypeinfo_div ">
        <div class="cus-flexcolumn">
          <div style="padding-top: 11px;color:#353535;font-size:16px;">{{orderDetail.RoomTypeName}}</div>
          <div style="padding-top: 6px;font-size:14px;">
            <span class="cus-normal">{{orderDetail.BookStartTime}}&nbsp;至&nbsp;{{orderDetail.BookEndTime}}</span>

            <span class="cus-normal"> &nbsp; {{orderDetail.BookingDays}}晚</span>
            <span class="cus-normal"> {{orderDetail.TotalRooms}}间</span>
          </div>
          <div style="padding-top: 6px;color:#7e7b7b;font-size:14px;">
            <span class="cus-normal">{{orderDetail.IntimateService}}</span>
          </div>
          <div style="padding-top: 6px;color:#7e7b7b;margin-bottom:15px;font-size:14px;">
            <span class="cus-normal"> 预计到店</span>
            <span class="cus-normal">&nbsp;{{orderDetail.ReservedTime}}</span>
          </div>
          <div class="thinLine"></div>
        </div>
        <div>
          <div class="cus-flexcolumn" style="flex:0.4" v-if="isAppleDisable()">
            <div class="map_nav_div">
              <icon name="map" scale="2" class="svgicon"
                    style="color:#25c0b1;padding-top:14px;margin-right:5px;"></icon>
              <span style="padding-top:12px;" @click="mapapimarker">地图导航 </span>
            </div>
          </div>
          <div class="split_div cus-flexcolumn-center" v-if="isAppleDisable()"></div>


          <div class="cus-flexcolumn-center" style="flex:0.6">
            <div class="tel_div">
              <icon name="tel" scale="2" class="svgicon" style="padding-top:14px;margin-right:5px;"></icon>
              <span style="padding-top:12px;">{{orderDetail.HotelPhone}} </span>
            </div>
          </div>

        </div>
      </div>
      <!-- 预定人信息 -->
      <div class="Bookerinfo_div ">
        <div class="item_div"><span style="color:#7e7b7b">预定人：</span><span>{{orderDetail.BookerName}}</span></div>
        <div class="item_div"><span style="color:#7e7b7b">联系人手机：</span><span>{{orderDetail.BookerPhone}}</span></div>
        <div class="item_div"><span style="color:#7e7b7b">支付方式：</span><span>{{orderDetail.PayTypeName}}</span></div>
        <div class="item_div"><span style="color:#7e7b7b">下单时间：</span><span>{{orderDetail.CreateTime}}</span></div>
        <div class="item_div"><span style="color:#7e7b7b">订单编号：</span><span>{{orderDetail.OrderNo}}</span></div>

      </div>
    </div>
  </div>
</template>


<script>
  import {XHeader, Group, XInput} from 'vux'
  import {fetchMemberOrderDetailAxios} from '@/services/axiosapi'
  import {formatDate} from '@/utils/timeUtil'  
  import {orderStatusName, payTypeName, breakfastTypeName, refundStatusName} from '@/utils/orderUtil'
  import {mapState} from 'vuex'


  export default {
    name: 'OrderDetail',
    components: {
      XHeader, Group, XInput
    },
    beforeMount () {
      this.btnOrderFlag = false;
      this.loadMemberOrderDetail()

    },
    data(){
      return {
        orderDetail: {},
        orderDes:"",
        btntoPay:false,
        btnOrderFlag: false
      }
    },
    methods: {
      isAppleDisable() {
        return !this.utils.isAppleCheck()
      },
      orderPay_click()
      {
        console.log("orderPay_click", this.orderDetail.OrderNo);

        let url = location.href;
        let index = url.indexOf("#") - 1;
        let baseUrl = url.split("").splice(0, index).join("");

        location.href = `${baseUrl}/#/hotel/book3preview/${this.orderDetail.OrderNo}`
      },
      // load会员订详情信息
      loadMemberOrderDetail()
      {
        let params = {}
        console.log(this.$route.params.orderNo)
        params.orderNo = this.$route.params.orderNo
        fetchMemberOrderDetailAxios(params).then(response => {
          // response TODO 添加异常失败情况检查
          console.log(response)
          if (response.data.Success == true) {
            // this.$store.dispatch('setMemberOrderList',response.data.Content)
            let detail = {}
            detail = this.filldata(response.data.Content)
            console.log("detail", detail)
            this.orderDetail = detail;

            if (this.orderDetail.OrderStatus=="N" && this.orderDetail.PayTypeName=="在线支付"){
              
                //当前时间大于订单预定结束时间,无需再显示多少分钟前完成支付了
                  var now = new Date;
                  var d = new Date(this.orderDetail.CreateTime);
                  // console.log("loadMemberOrderDetail EndTime", this.orderDetail.EndTime)
                  // console.log("loadMemberOrderDetail now", now)
                  var date3 = now.getTime() - new Date(d).getTime();   //时间差的毫秒数  
                  //计算出相差天数  
                  var days=Math.floor(date3/(24*3600*1000))   
                  console.log("loadMemberOrderDetail days", days)             
                  //计算出小时数  
                  var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数  
                  var hours=Math.floor(leave1/(3600*1000))  
                  console.log("loadMemberOrderDetail hours", hours)
                  //计算相差分钟数  
                  var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数  
                  var minutes=Math.floor(leave2/(60*1000))     
                  console.log("loadMemberOrderDetail minutes", minutes)
                  if (days==0 && hours==0 && minutes <= 15) {
                    let time=this.judgFailTime(this.orderDetail.CreateTime);
                    console.log("loadMemberOrderDetail time", time)
                    this.orderDes="请在"+time+"前完成支付，超时将自动取消";
                    this.btntoPay=true;                    
                  }
                  else {
                    this.orderDes="您的订单"+this.orderDetail.OrderStatusName;
                    this.btntoPay=false;
                  }
            } else {
                this.orderDes="您的订单"+this.orderDetail.OrderStatusName;
                this.btntoPay=false;
            }
            console.log("this.orderDetail", this.orderDetail)
          } else {
            // TODO 显示无查询数据
          }
        }).catch(err => {
          //alert('fetchMemberOrderDetailAxios err:')
          this.utils.showNetError();
          console.log('fetchMemberOrderDetailAxios err:', err)
        })
      },
      filldata(singleData){
        var obj = {}
        obj.OrderNo = singleData.OrderNo
        obj.HotelName = singleData.HotelName
        obj.RoomTypeName = singleData.RoomTypeName
        obj.BookingDays = singleData.BookingDays
        obj.OrderAmount = singleData.OrderAmount
        obj.TotalRooms = singleData.TotalRooms
        obj.OrderStatus = singleData.OrderStatus.Id
        obj.OrderStatusName = orderStatusName(singleData.OrderStatus.Id)
        obj.PayType = singleData.PayType.Text
        obj.PayTypeName = singleData.PayType.Text//payTypeName(singleData.PayType)
        console.log("singleData.BookStartTime:", singleData.BookStartTime);
        obj.BookStartTime = this.formatMMdd(singleData.BookStartTime)
        obj.BookEndTime = this.formatMMdd(singleData.BookEndTime)
        obj.StartTime = singleData.BookStartTime
        obj.EndTime=singleData.BookEndTime
        obj.BookerName = singleData.BookerName
        obj.BookerPhone = singleData.BookerPhone
        obj.HotelPhone = singleData.HotelPhone
        obj.CreateTime = singleData.CreateTime
        if (singleData.ReservedTime.length > 10) {
          let reservedTime = singleData.ReservedTime.split(" ")
          obj.ReservedTime = reservedTime[1]
        } else {
          obj.ReservedTime = "18:00"
        }

        obj.RefundStatus = refundStatusName(singleData.RefundStatus)
        // breakfastTypeName(singleData.BreakfastType)
        obj.IntimateService = singleData.Breakfast + ' | ' + singleData.BedType + ' | ' + singleData.BroadBand
        obj.expand = 'down'
       if (singleData.FeeDetail!=null)
       {
        obj.feellist = singleData.FeeDetail
          var newArr = singleData.FeeDetail.filter(function (obj) {
            return obj.Amount !== obj.OriginalAmount;
          });
          obj.promotionlist = this.handlerData(newArr);
       } else {
          obj.feellist = singleData.FeeDetail
          obj.promotionlist = singleData.FeeDetail
       }
       if (singleData.SelectRoomFee>0)
       { 
          let ls = new Array()
          let objSelectRoomFee = {}
          objSelectRoomFee.DateTime = this.formatYYYYMMdd(singleData.CreateTime);
          objSelectRoomFee.SelectRoomFee = singleData.SelectRoomFee;  
          ls.push(objSelectRoomFee)                  
          obj.SelectRoomFeelist=ls
       } else{
          let ls = new Array()
          let objSelectRoomFee = {}
          // objSelectRoomFee.DateTime =this.formatYYYYMMdd(singleData.CreateTime) ;
          // objSelectRoomFee.SelectRoomFee = 10;  
          // ls.push(objSelectRoomFee)                  
          obj.SelectRoomFeelist=ls         
       }

        if (singleData.RefundStatus == "RA" || singleData.RefundStatus == "RC"
          || singleData.RefundStatus == "RT" || singleData.RefundStatus == "RI") {
          obj.OrderStatusName = obj.RefundStatus;
        }
        if (singleData.PayType.Id == 1 && singleData.OrderStatus.Id == "N") {
          obj.OrderStatusName = "待消费"
        }
        return obj
      },
      handlerData(data){
        let list = data;
        let i = list.length;
        console.log("handlerData i:", i)
        var list1 = new Array()
        let j = 0
        while (j < i) {
          // console.log("item:",list[i]);
          list1.push(this.calcProtomtionPrice(list[j]))
          j++
        }
        // console.log(" handlerData this.orderlist", this.list1)
        return list1

      },
      calcProtomtionPrice(row) {
        let obj = {}
        obj.DateTime = row.DateTime;
        obj.PromotionMark = row.PromotionMark;
        obj.ProtomtionPrice = Math.abs(row.OriginalAmount - row.Amount) * row.TotalRooms;
        return obj;
      },
      formatMMdd(date){
        var d = new Date(date)
        return ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2)
      },
      formatYYYYMMdd(date){
        var d = new Date(date)
        return ('0' + d.getFullYear()).slice(-4) + '-' +('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2)
      },      
    judgFailTime(date) {
        var x = date
        var time = new Date(Date.parse(x.replace(/-/g, "/")));//new Date(x.replace("-","/"));

        var b = 15; //分钟数
        time.setMinutes(time.getMinutes() + b, time.getSeconds(), 0);
        // console.log(" judgFailTime time", time)
        let m=time.getHours(); //获取系统时，
        let s= time.getMinutes(); //分
        // console.log(" judgFailTime m", m)
        // console.log(" judgFailTime s", s)
        // console.log(" judgFailTime mm", ('0' + time.getHours()).slice(-2))
        // console.log(" judgFailTime ss", ('0' + time.getMinutes()).slice(-2))

        return ('0' + time.getHours()).slice(-2)+":"+('0' + time.getMinutes()).slice(-2);
    },
      // 动态计算是否要展开
      linkClass: function (isExpand) {
        return {
          "link-up": isExpand == 'up',
          "link-down": isExpand == 'down',
        }
      },
      // 点击展开对应费用明细
      toggleExpand: function () {
        this.orderDetail.expand = (this.orderDetail.expand == 'up') ? 'down' : 'up';
      },
      // 使用高德地图查看地图点位标注
      mapapimarker() {
        this.$router.push({
          name: 'mapapimarker'
        })
      }
    }

  }

</script>

<style lang="less" scoped>
  @import '../../../styles/common/themeSettings.less';

  @itemheight: 40px; // TODO 所有的变量可以提取到一个文件，方便配置和保存

  .itemwrap {
    background-color: #ffffff;
    padding-right: 15px;
    margin-top: 10px;
    height: @itemheight;

    /* Flex 布局 */
    align-items: center;
    * {
      display: flex;
      display: -webkit-flex;
    }

    /* 房间列表项箭头展开动画效果 */
    .link-up:after, .link-down:after {
      transition: transform 300ms;
    }
  }

  .detailwrap {
    background-color: #f8f9f8; //@popColor;
    // padding-right: 15px;
    height: 40px;

    /* Flex 布局*/
    align-items: center;
    * {
      display: flex;
      display: -webkit-flex;
    }
  }

  .feeDetailwrap {
    align-items: center;
    color: #7e7b7b;
  }

  .feelistwap {
    padding-top: 10px;
    color: #7e7b7b;
  }

  .orderStaus_div {

    font-size: @ftSize-h2;

  }

  .orderStaus_des_div {
    color: #7e7b7b;
    font-size: @ftSize-normal;
    margin-bottom: 5px;
    padding-bottom: 5px;

  }

  .map_nav_div {
    // padding-top:10px;
    margin-left: 20px;
    color: @themeColor;
    font-size: @ftSize-normal;
    img {
      padding-top: 14px;
      padding-left: 30px;
      margin-right: 15px;
      width: 20px;
      height: 20px;
    }
  }

  .split_div {
    margin-top: 10px;
    margin-left: 40px;
    width: 1px;
    background-color: @pageColor;

  }

  .tel_div {
    // padding-top:10px;
    margin-left: 10px;

    color: @ftColorBlack3;
    font-size: @ftSize-normal;
    img {
      padding-top: 14px;
      margin-right: 15px;
      width: 20px;
      height: 20px;
    }
  }

  .feeDetailinfo_div {
    background-color: #ffffff;
    padding-top: 10px;
    // padding-left: 10px;
    // padding-right: 5px;
    // margin-top: 10px;
    height: auto;

  }

  .operate_div {

    background-color: #ffffff;
    padding-left: 280px;
    padding-right: 5px;
    margin-top: 0px;
    height: 50px;

  }

  .roomTypeinfo_div {
    background-color: #ffffff;
    padding-left: 10px;
    padding-right: 5px;
    margin-top: 10px;
    height: 175px;

    /* Flex 布局 */
    align-items: center;
    * {
      display: flex;
      display: -webkit-flex;
    }
  }

  .Bookerinfo_div {
    background-color: #ffffff;
    padding-left: 10px;
    padding-right: 5px;
    margin-top: 10px;
    height: 169px;
    .item_div {
      padding-top: 10px;
      color: #353535;
      font-size: @ftSize-normal;
    }
  }

  .btn_book {
    display: table-cell; // TODO weex支持 flex only
    background-color: #ffffff;
    margin-top: 10px;
    // padding-top: 4px;
    // padding-bottom: 15px;
    height: 29px;
    line-height: 29px;
    width: 80px;
    font-size: @ftSize-small;
    color: @themeColor;
    text-align: center;
    border-radius: 20px;
    border: 0.5px solid @themeColor;
    vertical-align: middle;
    overflow: hidden;
  }
    .btn-toPay {
    display: table-cell; // TODO weex支持 flex only
    background-color: @themeColor;;
    margin-top: 10px;
    // padding-top: 4px;
    // padding-bottom: 15px;
    height: 28px;
    line-height: 28px;
    width: 80px;

    font-size: @ftSize-small;
    color: white;
    text-align: center;
    border-radius: 20px;
    border: 0.5px solid @themeColor;
    vertical-align: middle;
    overflow: hidden;
  }
</style>
