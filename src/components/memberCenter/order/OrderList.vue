<!-- 订单列表页面 -->

<template>
  <div>
    <x-header v-if="titleBarFlag" class="xheader vux-override" style="background-color:#25c0b1;">
      {{$route.params.title}}
    </x-header>
    <scroller lock-x scrollbar-y use-pullup :pullup-config="pullupConfig2" @on-pullup-loading="onScrollBottom"
              ref="scrollerBottom" class="cus-normal">
      <div class="box2">
        <div v-for="(item, idx) in orderlist">

          <div class="orderlist_div ">
            <!-- 酒店 -->
              <div class="Hotel_div cus-flexrow">
                <icon name="hotel" scale="2" :class="{'svgiconGray': item.cancelflag,'svgicon': item.normalflag}"
                      style="padding-top:14px;margin-right:5px;"></icon>
                <div style="padding-top: 11px" class="cus-h1" :class="{'svgiconGrayInvalid':item.cancelflag,'cus-ftColorBlack3':item.normalflag}"> {{item.HotelName}}</div>
              </div>

              <div class="thinLine" style="height:0.7px"></div>


              <div class="middleDiv cus-flexrow" @click="orderdetail_click(idx)">
                <!-- 左侧描述 -->
                <div class="cus-flexcolumn" :class="{'svgiconGrayInvalid':item.cancelflag,'cus-ftColorBlack':item.normalflag}">
                  <div class="cus-h1 standardLine">{{item.RoomTypeName}}</div>
                  <div class="cus-small" style="padding-top: 3px;">
                    入住时间：{{item.StartTime}}&nbsp;至&nbsp;{{item.EndTime}} {{item.BookingDays}}晚
                  </div>
                  <div class="cus-small" style="padding-top: 1px;">入住间数：{{item.TotalRooms}}间 </div>
                </div>



                <!-- 右侧价格&状态-->
                <div class="cus-flexcolumn">
                  <span class="pricewrap standardLine"
                        style="text-align:right;display:block;" :class="{svgiconGrayInvalid:item.cancelflag,'cus-priceColor':item.normalflag}"> ￥{{item.OrderAmount}} </span>
                  <span class="orderStatuwrap" style="text-align:right;display:block;" :class="{svgiconGrayInvalid:item.cancelflag,'cus-ftColorBlack3':item.normalflag}">{{item.OrderStatusName}}</span>
                </div>

              </div>

               
              <!-- <div v-for="(detail, index) in item.RoomCodeOwners" class="detailwrap cus-flexrow" :class="{borderTop: index==0}">
                      <div @click="OrderBookerLogin_click(idx,index,detail.originalPhone)" >
                        <div class="cus-normal" >{{detail.RoomNo}}</div>
                        <div class="cus-normal phoneNumber cus-ftColorBlack3" :class="{'cus-normal phoneNumber cus-ftColorBlack3': detail.Online,'cus-normal nophoneNumber cus-ftColorBlack3':!detail.Online}"  >{{detail.Online? detail.Phone : ""}}</div>
                      </div>
                      <div v-show="detail.roomFlag" class="cus-normal" :class="{'btn-Exit': detail.Online,'btn-Transfer':!detail.Online}" @click="OrderBookerExit_click(idx,index,detail.Online)">{{detail.Online? '退出':'转交' }}</div>  
                      <div v-show="detail.roomFlag" class="cus-normal" :class="{'btn-Exit': detail.Online,'btn-Transfer':false}" @click="OrderBookerExit_click(idx,index,detail.Online)">{{detail.Online? '退出':'' }}</div>  

              </div> -->

            <!-- 操作按钮-->
            <!-- 苹果审核 暂时屏蔽 -->
            <div class="btn-div cus-flexrow" v-if="isAppleDisable()">
              <div>
                <div class="btn_cancel" v-show="item.btnCancelFlag" @click="orderCancel_click(idx)">取消订单</div>
                <div class="btn_refund" v-show="item.btnRefundFlag" @click="orderRefund_click(idx)">申请退款</div>
                <div class="btn_topay" v-show="item.btnPayFlag"  @click="orderPay_click(idx)">去支付</div>
                <div class="btn_del" v-show="item.btnDelFlag" @click="orderDelete_click(idx)">删除</div>
              </div>
            </div>

          </div>
        </div>
        <load-more class="loading" tip="努力加载中" v-show="orderLoadingShow"></load-more>
        <p class="noRoom cus-small cus-ftColorBlack3" v-show="!orderLoadingShow && orderListTotalRecords==0
">没有相关订单</p>
        <p class="noRoom cus-small cus-ftColorBlack3" v-show="!orderLoadingShow && orderListTotalRecords>0
">没有更多订单</p>
      </div>
    </scroller>
    <div v-transfer-dom>
      <confirm v-model="confirmFlag" class="vux-override"
               :title="''" :confirm-text="confirmText" :cancel-text="cancelText"
               @on-cancel="onCancel"
               @on-confirm="onConfirm"
               @on-show="onShow"
               @on-hide="confirmOnHide">
        <p style="text-align:center;">{{confirmInfo}}</p>
      </confirm>
    </div>
        <!-- 弹层-进入客房 -->
    <Popup v-model="showLoginRoom">
      <div class="roomLogin cus-flexcolumn-center cus-h2">
        <div class="cus-h2"  style="padding-top:20px;font-size:16px;">{{poptitle}}</div>
        <div :class="loginRoomRight?'Tips cus-small':'Tips cus-small cus-priceColor'">{{poptext}}</div>
         <div class="split-div-h"></div>
        <div class="cus-flexrow">
            <!-- <div class="CancelBtn cus-h1 cus-flexcolumn" style="flex:0.5" @click="LoginRoom_cancel()" >放弃</div> -->
            <a href="javascript:;" class="CancelBtn cus-h1 cus-flexcolumn"  @click="LoginRoom_cancel()" >放弃</a>
            <div class="split-div-v"></div>
            <a href="javascript:;" :class="loginRoomRight?'LoginBtn cus-h1 cus-flexcolumn':'LoginBtn1 cus-h1 cus-flexcolumn'"  @click="OrderRoomLogin_click()">进入客房</a>
        </div> 
      </div>
    </Popup>
    <!-- 弹层-再次预订 -->
    <Popup v-model="showOrderAgain">
      <div class="roomLogin cus-flexcolumn-center cus-h2">
        <div class="cus-h2"  style="margin-top:20px;font-size:16px;"></div>
        <div :class="loginRoomRight?'Tips cus-small':'Tips cus-small cus-priceColor'" style="text-align: center;">{{poptext}}</div>
         <div class="split-div-h"></div>
        <div class="cus-flexrow">
            <!-- <div class="CancelBtn cus-h1 cus-flexcolumn" style="flex:0.5" @click="LoginRoom_cancel()" >放弃</div> -->
            <a href="javascript:;" class="CancelBtn cus-h1 cus-flexcolumn"  @click="OrderAgain_cancel()" >我知道了</a>
            <div class="split-div-v1"></div>
            <a href="javascript:;" class="LoginBtn cus-h1 cus-flexcolumn"  @click="OrderAgagin_click()">去订一间</a>
        </div> 
      </div>
    </Popup>
    <!-- 弹层-提示去发现 -->
    <Popup v-model="showRoomControl">
      <div class="roomLogin cus-flexcolumn-center cus-h2">
        <div class="cus-h2"  style="padding-top:20px;font-size:16px;">{{poptitle}}</div>
        <div class="Tips cus-small" style="text-align: center;">{{poptext}}</div>
         <div class="split-div-h"></div>
        <div class="cus-flexrow">
            <a href="javascript:;" class="CancelBtn cus-h1 cus-flexcolumn"  @click="RoomControl_cancel()" >取消</a>
            <div class="split-div-v1"></div>
            <a href="javascript:;" class="LoginBtn cus-h1 cus-flexcolumn"  @click="RoomControl_click()">去发现</a>
        </div> 
      </div>
    </Popup>         
    <OrderDialog :hotelId="hotelId" :checkInId="checkInId" :dialogShow="dialogShow" :transmit="transmit" :roomNumber="roomNumber" :selfControl="true" @dialogHide="dialogHide" ></OrderDialog>

  </div>
</template>

<script>
  import Popup from '@/components/roomControl/Popup.vue'
  import OrderDialog from "@/views/roomControl/OrderDialog.vue"
  import {
    Confirm,
    XHeader,
    Scroller,
    Divider,
    Spinner,
    XButton,
    Group,
    Cell,
    LoadMore,
    TransferDomDirective as TransferDom
  } from 'vux'
  import {
    fetchMemberOrderListAxios,
    fetchMemberOrdersAxios,
    fetchCanOrderBookerLoginAxios,
    fetchOrderBookerLoginAxios,
    fetchOrderBookerLogoutAxios,
    fetchRoomCodeDistributeAxios,
    fetchMemberOrderDeleteAxios,
    fetchMemberOrderCancelAxios,
    fetchMemberOrderRefundAxios,
    fetchMemberInfoAxios
  } from '@/services/axiosapi'
  import {formatDate} from '@/utils/timeUtil'
  import {orderStatusName, refundStatusName} from '@/utils/orderUtil'
  import {is_weixin} from '@/utils/device'
  import {ls_unionId} from '@/utils/localStorage'
  import {mapState} from 'vuex'
  import {setWechatTitle} from '@/utils/setWechatTitle.js'
  import {storeSet, storeGet} from '@/utils/localStorage'
  export default {
    name: 'OrderList',
    directives: {
      TransferDom
    },
    components: {
      Confirm,
      XHeader,
      Scroller,
      Divider,
      Spinner,
      XButton,
      Group,
      Popup,
      OrderDialog,
      Cell,
      LoadMore
    },
    beforeCreate(){
      switch (this.$route.params.querymode) {
        case 0:
          setWechatTitle('全部订单');
          break;
        case 1:
          setWechatTitle('待支付订单');
          break;
        case 2:
          setWechatTitle('待消费订单');
          break;
        case 3:
          setWechatTitle('售后订单');
          break;
        default:
          break;
      };
    },
    beforeMount () {
      this.$store.dispatch('setMemberOrderListLoadingShow', true);
      this.$store.dispatch('setMemberOrderShow', true);
      //微信浏览器隐藏导航栏
      if (is_weixin()) this.titleBarFlag = false
      this.loadMemberOrderList();
      switch (this.$route.params.querymode) {
        case 0:
          document.title = '全部订单'
          break;
        case 1:
          document.title = '待支付订单'
          break;
        case 2:
          document.title = '待消费订单'
          break;
        case 3:
          document.title = '售后订单'
          break;
        default:
          break;
      };

    },
    data(){
      return {
        titleBarFlag: true,
        orderlist: {},
        onFetching: false,
        index: 0,
        transmit: true,
        pullupConfig2: {
          content: '',
          downContent: '',
          upContent: '',
          loadingContent: '',
        },
        orderListNum: 0,
        orderListTotalRecords: 0,
        confirmText: "确认删除",
        cancelText: "放弃",
        confirmInfo: "删除后将无法复原和查看订单，是否确认删除？",
        confirmFlag: false,
        selectedIdx: 0,
        delflag: false,
        cancelflag: false,
        showRoomControl:false,
        showOrderAgain:false,
        showLoginRoom:false,
        loginRoomRight:false,
        roomRightDesc:"如果你不是该房间的入住人，进入客房后你还可以回到当前页面退出，再转交客房码给实际入住人。",
        poptext:"8月8日18:00以后为你开放客房控制权",
        poptitle:"带你进入智慧客房吗？",
        orderSelectedIdx:0,
        roomSelectedIndex:0,
        dialogShow:false,
        hotelId:"",
        checkInId:"",
        roomNumber:"",
        LoggedInRoomId:"",
        LoggedInFlag:false,
        RoomFlag:false,
        checkInPhone: ""
      }
    },
    computed: {
      ...mapState({
        orderLoadingShow: state => state.memberCenter.orderListMes.orderLoadingShow,
        orderListHeight: state => state.memberCenter.orderListMes.orderListHeight,
        orderShow: state => state.memberCenter.orderShow,
      })
    },
    methods: {
      isAppleDisable() {
        return !this.utils.isAppleCheck()
      },
      // load会员订单列表信息
      loadMemberOrderList()
      {
        //此时处于加载中，不能下拉
        let params = {}
        params.memberid = this.$store.state.memberCenter.memberInfo.Id //"616D16F7-A143-41D8-87F0-10C9DE960698"
        params.UnionId = ls_unionId();
        params.pageindex = 0
        params.pagesize = 3
        params.orderstatus = this.$route.params.orderstatus
        params.QueryMode = this.$route.params.querymode
        // fetchMemberOrderListAxios(params).then(response => {
        fetchMemberOrdersAxios(params).then(response => {          
           console.log("loadMemberOrderList response",response)  
          // response TODO 添加异常失败情况检查
          if (response.data.Success == true) {
            this.$store.dispatch('setMemberOrderList', response.data.Content);
            this.$store.dispatch('setMemberOrderListTotalRecords', response.data.TotalRecords);
            this.orderListNum = this.$store.state.memberCenter.orderList.length;
            this.orderListTotalRecords = response.data.TotalRecords;
            if (this.orderListTotalRecords > this.orderListNum) {
              this.$store.dispatch('setMemberOrderListLoadingShow', true);

                var num = 3*(this.index+1);


                if(num<this.orderListTotalRecords){
                  this.onScrollBottom();  //继续请求页面
                }
            } else {
              this.$store.dispatch('setMemberOrderListLoadingShow', false);
            }
            ;
            
            

            this.handlerData(response.data.Content)

          } else {
            this.$store.dispatch('setMemberOrderListLoadingShow', false);
            // TODO 显示无查询数据
          }
        }).catch(err => {
          //alert('fetchMemberOrderListAxios err:', err)
          this.utils.showNetError();
        })
      },
      handlerData(data){
        let list = data;
        let i = list.length;
        var list1 = new Array()
        let j = 0
        while (j < i) {
          list1.push(this.filldata(list[j]))
          j++
        }
        this.orderlist = list1
        // console.log("handlerData this.orderlist",this.orderlist) 
      },
      handlerRoomCodeOwnersData(roomCodeOwner,roomflag){

         let objOwner={}
         objOwner.CheckinId=roomCodeOwner.CheckinId
         objOwner.RoomNo=roomCodeOwner.RoomNo
         objOwner.RoomId==roomCodeOwner.RoomId
         objOwner.IsBooker=roomCodeOwner.IsBooker
         objOwner.Online =roomCodeOwner.Online
         objOwner.originalPhone = roomCodeOwner.Phone
         objOwner.roomFlag=true  
         if (roomflag==false) {
           objOwner.roomFlag=false
         } else {
            let mobile1 =storeGet('memberInfo', 'Phone');
            if (mobile1!== undefined)
                if ((mobile1!=roomCodeOwner.Phone) && objOwner.Online) {
                   objOwner.roomFlag=false 
                } else {
                  if(roomCodeOwner.IsValid==0) {
                    objOwner.roomFlag=false
                  } else {
                    objOwner.roomFlag=true
                  }
                }
         }



         let tel=roomCodeOwner.Phone
          if (tel !== null || tel !== undefined || tel !== '') {
            let tel1 = tel ? (tel.substr(0, 3) + '****' + tel.substr(7)) : "";
            objOwner.Phone = tel1;
          } else { objOwner.Phone=roomCodeOwner.Phone }
          return objOwner;
      },

      filldata(singleData){
        var obj = {}

        obj.OrderNo = singleData.OrderNo
        obj.HotelName = singleData.HotelName
        obj.HotelId=singleData.HotelId
        obj.RoomTypeName = singleData.RoomTypeName
        obj.BookingDays = singleData.BookingDays
        obj.OrderAmount = singleData.OrderAmount
        obj.TotalRooms = singleData.TotalRooms
        obj.OrderStatus = singleData.OrderStatus

        // obj.RoomCodeOwners= singleData.RoomCodeOwners

        if (singleData.OrderStatus == "C") {
          obj.cancelflag = true;
          obj.normalflag = false;
        } else {
          obj.cancelflag = false;
          obj.normalflag = true;
        }

        
        obj.PayType = singleData.PayType
        obj.OrderStatusName = orderStatusName(singleData.OrderStatus)

        obj.BookStartTime = singleData.BookStartTime
        obj.BookEndTime = singleData.BookEndTime
        obj.StartTime = this.formatMMdd(singleData.BookStartTime)
        obj.EndTime = this.formatMMdd(singleData.BookEndTime)
        obj.RefundStatus = refundStatusName(singleData.RefundStatus)
        obj.RoomFlag=true

        if (singleData.OrderStatus == "N") {
          if (obj.PayType == "1") {
            obj.btnPayFlag = false
          } else {
            obj.btnPayFlag = true
          }

          obj.btnCancelFlag = true
          obj.btnDelFlag = false
          obj.btnRefundFlag = false

        }
        if (singleData.OrderStatus == "P" || singleData.OrderStatus == "HC") {
          obj.btnPayFlag = false
          obj.btnCancelFlag = false
          obj.btnDelFlag = false
          obj.btnRefundFlag = true
        }
        if (singleData.OrderStatus == "C" || singleData.OrderStatus == "O" || singleData.OrderStatus == "CS"
          || singleData.OrderStatus == "R") {
          obj.btnPayFlag = false
          obj.btnCancelFlag = false
          obj.btnDelFlag = true
          obj.btnRefundFlag = false
          obj.RoomFlag=false
          //   obj.btnPayFlag=true
          //  obj.btnCancelFlag=true
          //  obj.btnDelFlag=true
          //  obj.btnRefundFlag=true
        }
        if (singleData.OrderStatus == "CS") {
          obj.btnPayFlag = false
          obj.btnCancelFlag = false
          obj.btnDelFlag = true
          obj.btnRefundFlag = false
          obj.RoomFlag=true
        }        
        if (singleData.RefundStatus == "RA" || singleData.RefundStatus == "RC"
          || singleData.RefundStatus == "RT" || singleData.RefundStatus == "RI") {
          obj.btnPayFlag = false
          obj.btnCancelFlag = false
          obj.btnDelFlag = false
          obj.btnRefundFlag = false
          obj.RoomFlag=false
          obj.OrderStatusName = obj.RefundStatus;
        }
        if (singleData.PayType == 1 && singleData.OrderStatus == "N") {
          obj.OrderStatusName = "待消费"
        }
        //当前时间大于订单预定结束时间,设置房间操作标志为false
          var now = new Date;
          var d = new Date(singleData.BookEndTime);
          if (now > d) {
              if (obj.RoomFlag) obj.RoomFlag=false;
              obj.btnPayFlag = false
              obj.btnCancelFlag = false
              obj.btnDelFlag = true
              obj.btnRefundFlag = false              
          } 
          // else if (now < d) {
          // } 
          else {
            // obj.RoomFlag=true;
          }        
        //处理手机号带有*隐藏
        // if (singleData.RoomCodeOwners.length>0)
        // {
        //   let list = singleData.RoomCodeOwners;
        //   let i = list.length;
        //   var ls = new Array()
        //   let j = 0
        //   while (j < i) {
        //     // console.log("filldata list[j]",list[j]) 
        //     ls.push(this.handlerRoomCodeOwnersData(list[j],obj.RoomFlag))
        //     j++
        //   }
        //   //  console.log("filldata ls",ls) 
        //   obj.RoomCodeOwners=ls;
        // } else { obj.RoomCodeOwners= singleData.RoomCodeOwners }        
        return obj
      },
      formatMMdd(date){
        var d = new Date(date)
        return ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2)
      },
      orderdetail_click(idx)
      {
        this.$store.dispatch('setMemberOrderShow', false);
        this.$router.push({name: 'orderdetail', params: {orderNo: this.orderlist[idx].OrderNo}})
      },
      orderCancel_click(idx)
      {
        this.selectedIdx = idx;
        this.cancelflag = true;
        // var orderno=this.orderlist[idx].OrderNo;
        this.confirmText = "确认取消";
        this.cancelText = "放弃";
        this.confirmInfo = "是否取消订单？";
        this.confirmFlag = true;
      },
      orderRefund_click(idx)
      {
        let params = {}
        params.orderNo = this.orderlist[idx].OrderNo
        var orderno = this.orderlist[idx].OrderNo;
        fetchMemberOrderRefundAxios(params).then(response => {
          // response TODO 添加异常失败情况检查
          if (response.data.Success == true) {
            this.utils.toast({msg: "退款申请已提交"});
            //刷新订单列表
           // this.loadMemberOrderList()
              //刷新订单列表
                var newArr = this.orderlist
              for (var j = 0; j < newArr.length; j++) {
                let obj=newArr[j];
                if (orderno== obj.OrderNo) {
                    newArr[j].OrderStatus = "RA";
                    newArr[j].OrderStatusName="退款中"
                    newArr[j].btnPayFlag = false
                    newArr[j].btnCancelFlag = false
                    newArr[j].btnDelFlag = false
                    newArr[j].btnRefundFlag = false
                    newArr[j].cancelflag = false;
                    newArr[j].normalflag = true;
                    newArr[j].RoomFlag=false;
                    //处理手机号带有*隐藏
                    // if (newArr[j].RoomCodeOwners.length>0)
                    // {
                    //   let list = newArr[j].RoomCodeOwners;
                    //   let i = list.length;
                    //   var ls = new Array()
                    //   let n = 0
                    //   while (n < i) {
                    //     // console.log("filldata list[j]",list[j]) 
                    //     ls.push(this.handlerRoomCodeOwnersData(list[n],newArr[j].RoomFlag))
                    //     n++
                    //   }
                    //   //  console.log("filldata ls",ls) 
                    //   newArr[j].RoomCodeOwners=ls;
                    // }     

                  break;
                }
              }
              this.orderlist = newArr;
               this.$store.dispatch('setMemberOrderList', newArr);
          } else {
            // TODO 显示无查询数据
            this.utils.toast({msg: response.data.Message});
          }
        }).catch(err => {
          //alert('fetchMemberOrderCancelAxios err:', err)
          this.utils.showNetError();
        })
      },
      orderPay_click(idx)
      {

        let url = location.href;
        let index = url.indexOf("#") - 1;
        let baseUrl = url.split("").splice(0, index).join("");

        location.href = `${baseUrl}/#/hotel/book3preview/${this.orderlist[idx].OrderNo}`
      },
      orderDelete_click(idx)
      {
        this.selectedIdx = idx;
        this.delflag = true;
        // var orderno=this.orderlist[idx].OrderNo;
        this.confirmText = "确认删除";
        this.cancelText = "放弃";
        this.confirmInfo = "删除后将无法复原和查看订单，是否确认删除？";
        this.confirmFlag = true;

      },
      ready()
      {
      },
      onScrollBottom () {
        if (this.$store.state.memberCenter.orderListMes.orderLoadingShow) {


          this.index = this.index + 1;
          // setTimeout(() => {
          let params = {}
          let oldOrderList = this.$store.state.memberCenter.orderList;
          params.memberid = this.$store.state.memberCenter.memberInfo.Id //"616D16F7-A143-41D8-87F0-10C9DE960698"
          params.UnionId = ls_unionId();
          params.pageindex = this.index
          params.pagesize = 3
          params.orderstatus = this.$route.params.orderstatus
          params.QueryMode = this.$route.params.querymode
          // fetchMemberOrderListAxios(params).then(response => {
          fetchMemberOrdersAxios(params).then(response => {            
            // response TODO 添加异常失败情况检查fetchMemberOrdersAxios
            if (response.data.Success == true) {
              let newOrderList = oldOrderList.concat(response.data.Content)
              this.$store.dispatch('setMemberOrderList', newOrderList);
              this.$store.dispatch('setMemberOrderListTotalRecords', response.data.TotalRecords);
              this.orderListNum = this.$store.state.memberCenter.orderList.length;
              this.orderListTotalRecords = response.data.TotalRecords;
              if (this.orderListTotalRecords > this.orderListNum) {
                
                
                if(this.orderShow){
                  this.$store.dispatch('setMemberOrderListLoadingShow', true);
                  var num = 3*(this.index+1);
                  if(num<this.orderListTotalRecords){
                    this.onScrollBottom();  //继续请求页面
                  }
                }else{
                  this.$store.dispatch('setMemberOrderListLoadingShow', false);
                }
              } else {
                this.$store.dispatch('setMemberOrderListLoadingShow', false);
              }
              ;
              let thisHeight = this.orderListNum * 179 + 'px';
              this.$store.dispatch('setMemberOrderListHeight', thisHeight);
              this.handlerData(newOrderList);

                setTimeout(() => {
                  if(this.$refs.scrollerBottom){
                    this.$refs.scrollerBottom.donePullup()
                  }
                  
                }, 100);

            } else {
              // TODO 显示无查询数据
            }
          }).catch(err => {
            //alert('fetchMemberOrderListAxios err:', err)
            this.utils.showNetError();
          });
          if (this.orderListNum == this.orderListTotalRecords) { // unload plugin
            setTimeout(() => {
              this.$refs.scrollerBottom.disablePullup();
            }, 100)
          }
          // }, 1500)
        }

      },
      onCancel () {


      },
      confirmOnHide(){

      },
      onConfirm () {
        var orderno = this.orderlist[this.selectedIdx].OrderNo;
        let params = {}
        params.orderNo = orderno;
        if (this.delflag) {
          fetchMemberOrderDeleteAxios(params).then(response => {
            // response TODO 添加异常失败情况检查
            if (response.data.Success == true) {
              this.utils.toast({msg: "订单已删除"});
              //刷新订单列表
              var newArr = this.orderlist.filter(function (obj) {
                return orderno !== obj.OrderNo;
              });
              this.orderlist = newArr;
               this.$store.dispatch('setMemberOrderList', newArr);

              this.$store.dispatch('setMemberOrderListLoadingShow', true);
              this.onScrollBottom();
              // this.loadMemberOrderList()
            } else {
              // TODO 显示无查询数据
              this.utils.toast({msg: response.data.Message});
            }
          }).catch(err => {
            //alert('fetchMemberOrderDeleteAxios err:', err)
            this.utils.showNetError();
          })
          this.delflag = false;
        }
        if (this.cancelflag) {
          fetchMemberOrderCancelAxios(params).then(response => {
            // response TODO 添加异常失败情况检查
            if (response.data.Success == true) {
              this.utils.toast({msg: "订单已取消"});
            //   //刷新订单列表
            //   this.loadMemberOrderList()
              //刷新订单列表
            var newArr = this.orderlist
          for (var j = 0; j < newArr.length; j++) {
            let obj=newArr[j];
            if (orderno== obj.OrderNo) {
                newArr[j].OrderStatus = "C";
                newArr[j].OrderStatusName="已取消"
                newArr[j].btnPayFlag = false
                newArr[j].btnCancelFlag = false
                newArr[j].btnDelFlag = true
                newArr[j].btnRefundFlag = false
                newArr[j].cancelflag = true;
                newArr[j].normalflag = false;
                newArr[j].RoomFlag=false;
                //处理手机号带有*隐藏
                // if (newArr[j].RoomCodeOwners.length>0)
                // {
                //   let list = newArr[j].RoomCodeOwners;
                //   let i = list.length;
                //   var ls = new Array()
                //   let n = 0
                //   while (n < i) {
                //     // console.log("filldata list[j]",list[j]) 
                //     ls.push(this.handlerRoomCodeOwnersData(list[n],newArr[j].RoomFlag))
                //     n++
                //   }
                //   //  console.log("filldata ls",ls) 
                //   newArr[j].RoomCodeOwners=ls;
                // }                 
              break;
            }
          }
              this.orderlist = newArr;
               this.$store.dispatch('setMemberOrderList', newArr);
            } else {
              // TODO 显示无查询数据
              this.utils.toast({msg: response.data.Message});
            }
          }).catch(err => {
            //alert('fetchMemberOrderCancelAxios err:', err)
            this.utils.showNetError();
          })

          this.cancelflag = false;
        }
      },
      onShow () {
      },
       OrderBookerLogin_click(idx,index,phone){

        this.orderSelectedIdx=idx;
        this.roomSelectedIndex=index;
        this.checkInPhone = phone;

        let mobile =storeGet('memberInfo', 'Phone');
        let loginmobile=phone;//this.orderlist[idx].RoomCodeOwners[index].Phone;
        // console.log("OrderBookerLogin_click mobile",mobile)
        // console.log("OrderBookerLogin_click loginmobile",loginmobile)
        // if (this.orderlist[idx].RoomFlag || this.orderlist[idx].RefundStatus == "退款中" || this.orderlist[idx].OrderStatusName=="退款中") {
        //       this.LoggedInFlag=false;
        //       this.poptext="客房"+this.orderlist[idx].RoomCodeOwners[index].RoomNo+"的控制权已失效或过期";
        //       this.loginRoomRight=false;
        //       this.showLoginRoom=true;  
        //       this.orderlist[idx].RoomFlag =false
        //       return;         
        // }
        if (loginmobile!== undefined)
            if (mobile!=loginmobile) {
                  this.LoggedInFlag=false;
                  this.poptitle="带你进入智慧客房吗？";
                  this.poptext="客房"+this.orderlist[idx].RoomCodeOwners[index].RoomNo+"的控制权已转交，无权进入客房";
                  this.loginRoomRight=false;
                  this.showLoginRoom=true;   
                  // this.orderlist[idx].RoomFlag =false
                  return;         
            }




        let params = {}
        // params.memberid = this.$store.state.memberCenter.memberInfo.Id //"616D16F7-A143-41D8-87F0-10C9DE960698"
        this.checkInId=this.orderlist[idx].RoomCodeOwners[index].CheckinId;

        params.CheckinId = this.checkInId; 
        
        fetchCanOrderBookerLoginAxios(params).then(response => {    
          console.log("OrderBookerLogin_click response",response)       
         // response TODO 添加异常失败情况检查
          if (response.data.Success == true) {
              this.poptitle="带你进入智慧客房吗？";
              this.poptext=this.roomRightDesc;
              this.loginRoomRight=true;
              this.showLoginRoom=true;

          } else {
            // TODO 显示无查询数据
              if (response.data.Code=="21006")
              {
                this.LoggedInRoomId=response.data.Content;
                if (this.LoggedInRoomId==this.checkInId){
                    this.poptext="已进入该房间，请去“发现”页面体验";
                    this.poptitle="带你进入智慧客房吗？";
                    this.LoggedInFlag=true;
                    this.loginRoomRight=false;
                    this.showRoomControl=true;
                } else {
                    this.poptext="已登录其他房间，是否确认登录该房间";
                    this.LoggedInFlag=true;
                    this.poptitle="带你进入智慧客房吗？";
                    this.loginRoomRight=true;
                    this.showLoginRoom=true;                      
                }
              }
              if (response.data.Code=="21004")
              {
                let strDate=response.data.Content;
                console.log("OrderBookerLogin_click response.data.content",response.data.Content)  
                this.LoggedInFlag=false;
                this.poptitle="带你进入智慧客房吗？";
                this.poptext=this.formatMMddHHMi(strDate)+"后为你开放客房控制权";
                this.loginRoomRight=false;
                this.showLoginRoom=true;  
              }          
              if (response.data.Code=="21005") {
                console.log("OrderBookerLogin_click response.data.Code",response.data.Code)     
                    this.LoggedInFlag=false;
                    // this.poptext="客房"+this.orderlist[idx].RoomCodeOwners[index].RoomNo+"的控制权已过期";
                    // this.poptitle="                                          ";
                    this.poptext="您已失去客房控制权";
                    this.loginRoomRight=false;

                    this.showOrderAgain=true;   
              }
          }
        }).catch(err => {

          this.utils.showNetError();
        })


       }, 
      formatMMddHHMi(date){
        var x = date
        var d = new Date(Date.parse(x.replace(/-/g, "/")));
        return ('' + (d.getMonth() + 1)).slice(-2) + '月' + ('0' + d.getDate()).slice(-2)+'日'+('0' + d.getHours()).slice(-2)+':'+('0' + d.getMinutes()).slice(-2)
      },   
      RoomControl_click(){
          this.showRoomControl=false;
          this.$router.push({
            name: 'roomcontrol'
          })
      },         
      OrderAgagin_click(){
          this.showOrderAgain=false;
          this.$router.push({
            name: 'SmartHotel'
          })
      },            
      OrderRoomLogin_click(){
        // if (!this.loginRoomRight) return;
      
        let params = {}
         console.log("OrderRoomLogin_click this.checkInId",this.checkInId)
         console.log("OrderRoomLogin_click this.LoggedInFlag",this.LoggedInFlag)
         console.log("OrderRoomLogin_click this.LoggedInRoomId",this.LoggedInRoomId)
        // params.memberid = this.$store.state.memberCenter.memberInfo.Id //"616D16F7-A143-41D8-87F0-10C9DE960698"
        params.CheckinId = this.checkInId;
        if (this.LoggedInFlag)  params.LogoutId =this.LoggedInRoomId;
        console.log("OrderRoomLogin_click params",params)
        fetchOrderBookerLoginAxios(params).then(response => { 
         // response TODO 添加异常失败情况检查
          if (response.data.Success == true) {
            //处理手机号带有*隐藏
            // if (response.data.Content.length>0)
            // {
            //   let list = response.data.Content;
            //   let i = list.length;
            //   var ls = new Array()
            //   let j = 0
            //   while (j < i) {
            //     // console.log("filldata list[j]",list[j]) 
            //     ls.push(this.handlerRoomCodeOwnersData(list[j],this.orderlist[this.orderSelectedIdx].RoomFlag))
            //     j++
            //   }
            //   // console.log("filldata ls",ls) 
            //   this.orderlist[this.orderSelectedIdx].RoomCodeOwners=ls;
            // } else { this.orderlist[this.orderSelectedIdx].RoomCodeOwners= response.data.Content }
            let loginInfo = JSON.parse(response.data.ExtendData.LoginInfo);
            console.log(loginInfo);
            storeSet("SH_RoomControl","VerifyInfo", loginInfo);
            let RoomNumber = loginInfo.RoomNumber;
            this.$store.dispatch("setRoomNumber", RoomNumber);
            let params = {};
            params.phone = this.checkInPhone;
            this.$store.dispatch("setUserMobile", this.checkInPhone);
            fetchMemberInfoAxios(params).then(response => {
                // 设置头像
                if (response.data.Success == true) {
                  let obj = response.data.Content;
                  storeSet('SH_RoomControl', 'Avatar', obj.Avatar);
                } 
              }).catch(err => {
                //alert('fetchMemberInfoAxios err:', err)
                this.utils.showNetError();
              })
            
            // this.orderlist[this.orderSelectedIdx].RoomCodeOwners=response.data.Content;
            this.LoggedInFlag=false;
            this.loginRoomRight=false;
            this.showLoginRoom=false;  
          } else {
            // TODO 显示无查询数据
              if (response.data.Code=="21006")
              {
                this.LoggedInRoomId=response.data.Content;
                if (this.LoggedInRoomId==this.checkInId){
                    this.poptext="已进入该房间，请去“发现”页面体验";
                    this.poptitle="带你进入智慧客房吗？";
                    this.LoggedInFlag=true;
                    this.loginRoomRight=false;
                    this.showRoomControl=true;
                } else {
                    this.poptext="已登录其他房间，是否确认登录该房间";
                    this.LoggedInFlag=true;
                    this.poptitle="带你进入智慧客房吗？";
                    this.loginRoomRight=true;
                    this.showLoginRoom=true;                      
                }
              }            
                if (response.data.Code=="21004")
                {
                  let strDate=response.data.Content;
                  console.log("OrderBookerLogin_click response.data.content",response.data.Content)  
                  this.LoggedInFlag=false;
                  this.poptitle="带你进入智慧客房吗？";
                  this.poptext=this.formatMMddHHMi(strDate)+"后为你开放客房控制权";
                  this.loginRoomRight=false;
                  this.showLoginRoom=true;  
                }  
              if (response.data.Code=="21005") {
                console.log("OrderBookerLogin_click response.data.Code",response.data.Code)     
                    this.LoggedInFlag=false;
                    // this.poptext="客房"+this.orderlist[idx].RoomCodeOwners[index].RoomNo+"的控制权已过期";
                    // this.poptitle="                                          ";
                    this.poptext="您已失去客房控制权";
                    this.loginRoomRight=false;

                    this.showOrderAgain=true;   
              }                
          }
        }).catch(err => {

          this.utils.showNetError();
        })

      },
      OrderBookerExit_click(idx,index,online){
        if(online){
            //退出功能
            let params = {}

            this.checkInId=this.orderlist[idx].RoomCodeOwners[index].CheckinId;
            params.CheckinId = this.checkInId; 
            
            fetchOrderBookerLogoutAxios(params).then(response => {          
            // response TODO 添加异常失败情况检查
              if (response.data.Success == true) {
                  console.log("OrderBookerExit_click response.data.Content",response.data.Content)
                  //处理手机号带有*隐藏
                  // if (response.data.Content.length>0)
                  // {
                  //   let list = response.data.Content;
                  //   let i = list.length;
                  //   var ls = new Array()
                  //   let j = 0
                  //   while (j < i) {
                  //     // console.log("filldata list[j]",list[j]) 
                  //     ls.push(this.handlerRoomCodeOwnersData(list[j],this.orderlist[idx].RoomFlag))
                  //     j++
                  //   }
                  //   // console.log("filldata ls",ls) 
                  //   this.orderlist[idx].RoomCodeOwners=ls;
                  // } else { this.orderlist[idx].RoomCodeOwners= response.data.Content }
                  storeSet("SH_RoomControl","VerifyInfo", {})
                  localStorage.removeItem("firstIntoRoomControl");
                this.$store.dispatch('keepAlivePageDel', 'RoomControl')
              } else {
                // TODO 显示无查询数据
              }
            }).catch(err => {

              this.utils.showNetError();
            })
        }else{
            this.hotelId = this.orderlist[idx].HotelId //"616D16F7-A143-41D8-87F0-10C9DE960698"
            this.checkInId = this.orderlist[idx].RoomCodeOwners[index].CheckinId;  
            this.roomNumber= this.orderlist[idx].RoomCodeOwners[index].RoomNo; 
              
            this.dialogShow=true;
        }
        

      },
      LoginRoom_cancel(){
        this.showLoginRoom=false;
      },
      RoomControl_cancel(){
          this.showRoomControl=false;
      },
      OrderAgain_cancel(){
        this.showOrderAgain=false;
      },      
      dialogHide(){
        this.dialogShow=false;
      },
    }

  }

</script>

<style lang="less" scoped>
  @import '../../../styles/common/themeSettings.less';

  @itemheight: 288px; // TODO 所有的变量可以提取到一个文件，方便配置和保存

  .pricewrap {
    font-size: @ftSize-hl;
  }

  .orderStatuwrap {
    font-size: @ftSize-small;
    text-align: right
  }

  .orderlist_div {
    background-color: #ffffff;
    padding-left: 10px;
    padding-bottom: 15px;
    margin-bottom: 10px;
    // height: 250px; 
    //169px
    // height: auto;
    // position:relative;
    /* Flex 布局 */
    * {
      display: flex;
      display: -webkit-flex;
    }

    .Hotel_div {
      height: 44px;
      padding: 0 0px;
      text-align: center;
      .hotelname_div {
        font-size: @ftSize-hl;

        padding-top: 14px;

      }
    }

  }

  .icon {
    margin-top: 14px;
    margin-right: 15px;
  }

  .btn-div {
    // position: relative;
    margin-top: 18px;
    justify-content: flex-end;
  }

  .btn_cancel {
    display: inline-block; // TODO weex支持 flex only
    background-color: #ffffff;
    margin-right: 10px;
    height: 25px;
    line-height: 25px;
    width: 80px;
    color: @panelColor;
    font-size: @ftSize-small;
    color: @themeColor;
    text-align: center;
    border-radius: 25px;
    border: 0.7px solid @themeColor;
    // -webkit-transform: translateX(-50%) translateY(-50%);
    vertical-align: middle;
    overflow: hidden;
  }

  .btn_refund {
    display: inline-block; // TODO weex支持 flex only
    background-color: #ffffff;
    margin-right: 10px;
    height: 25px;
    line-height: 25px;
    width: 80px;
    color: @panelColor;
    font-size: @ftSize-small;
    color: @themeColor;
    text-align: center;
    border-radius: 25px;
    border: 0.7px solid @themeColor;
    vertical-align: middle;
    overflow: hidden;
  }

  .btn_topay {
    display: inline-block; // TODO weex支持 flex only
    background-color: @themeColor;
    // margin-left: 10px;
    // padding-left: 6px;
    margin-right: 10px;
    height: 25px;
    line-height: 25px;
    width: 80px;
    color: @panelColor;
    font-size: @ftSize-small;
    text-align: center;
    border-radius: 25px;
    border: 0.7px solid @themeColor;
    // -webkit-transform: translateX(-50%) translateY(-50%);
    vertical-align: middle;
    overflow: hidden;
  }

  .btn_del {
    display: inline-block; // TODO weex支持 flex only  inline-block
    // margin-left: 10px;
    // padding-left: 4px;
    margin-right: 10px;
    height: 25px;
    line-height: 25px;
    width: 60px;
    color: @themeColor;
    font-size: @ftSize-small;
    text-align: center;
    border-radius: 25px;
    border: 0.7px solid @themeColor;
    vertical-align: middle;
    overflow: hidden;
  }

  .box2-wrap {
    height: 300px;
    overflow: hidden;
  }

  .loading {
    margin: 10px auto;
  }

  .noRoom {
    text-align: center;
    margin-top: 10px;
  }

  .temp {
    padding-right: 10px;
    height: 44px;
  }

  .detailwrap {
    background-color: @panelColor; //@popColor;
    // padding-right: 15px;
    // padding-top: 10px;
    height: 44px;
    margin-right: 10px;
    /* Flex 布局*/
    align-items: center;
    justify-content: space-between;
    border-bottom: 0.7px solid #e0dfdd;
    div {
      display: inline-block;
      
    }
    .phoneNumber {
      margin-left: 60px;
      // padding-left: 60px;
       width: 160px;
    }

    .nophoneNumber {
      width: 170px;
    }
  }

  .borderTop {
    border-top: 0.7px solid #e0dfdd;
  }

  .feelistwap {
    padding-top: 10px;
    color: #7e7b7b;
  }

  .btn-Exit {
    display: table-cell; // TODO weex支持 flex only
    // background-color: @themeColor;;
    height: 25px;
    line-height: 25px;
    width: 60px;
    font-size: @ftSize-small;
    color: @themeColor;
    text-align: center;
    border-radius: 25px;
    border: 0.7px solid @themeColor;
    vertical-align: middle;
    overflow: hidden;
  }
    .btn-Transfer {
    display: table-cell; // TODO weex支持 flex only
    // background-color: @themeColor;;
    height: 25px;
    line-height: 25px;
    width: 60px;
    font-size: @ftSize-small;
    color: @themeColor;
    text-align: center;
    border-radius: 25px;
    border: 0.7px solid @themeColor;
    vertical-align: middle;
    overflow: hidden;
  }

  /* 登录房间弹层 */
  .roomLogin {
    width: 70vw;
    border-radius: 8px;
    background-color: @popColor;

    // padding: 20px 10px;
    // display: flex;

    .Tips {
      text-align: left;
      font-size: 14px;
     // color: #7e7b7b;
      width: 240px;
      margin-top:10px;
    }
    .CancelBtn {
      color: @themeColor;
      display: table-cell;
      // background-color: @themeColor;
      //  padding: 5px 30px;
      // border-radius: 5px;
      text-align: center;
      margin-top: 10px;
      padding-top: 5px;
      padding-left: 20px;
      margin-right: 10px;
      text-align: center;
    }

    .LoginBtn {
      color: @themeColor;
      display: table-cell;
      // background-color: @themeColor;
      //  padding: 5px 30px;
      padding-top: 5px;
      padding-left: 35px;
      text-align: center;
      margin-top: 10px;
    }

    .LoginBtn1 {
      color: #cccccc;
      display: table-cell;
      // background-color: @themeColor;
      //  padding: 5px 30px;
      padding-top: 5px;
      padding-left: 35px;
      text-align: center;
      margin-top: 10px;
    }
  .split-div-h {
    margin-top: 39px;
    height: 2px;
    width:70vw;
    background-color: @pageColor;
  }

   .split-div-v {
    margin-top: 1px;
    margin-left:25px;
    height: 49px;
    width:2px;
    background-color: @pageColor;
  } 

     .split-div-v1 {
    margin-top: 1px;
    margin-left:15px;
    height: 49px;
    width:2px;
    background-color: @pageColor;
  } 
    .weui-dialog__btn {
      font-size: @ftSize-hl;
      color: @themeColor;
    }

    .dp-header .dp-item {
      color: #ccc
    }

    .colorGrey {
      color: #a2a2a2
    }

    .borderStyle {
      border-bottom: 1px solid @pageColor;
    }

  }

  .middleDiv {
    padding-right: 10px;
    padding-top: 15px;
    margin-bottom: 13px;
    justify-content: space-between;
  }
</style>
