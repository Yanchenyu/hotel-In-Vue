
<template>
  <div class="view-wrap">
    <!-- 房型描述部分 -->
    <div class="roomDesc cus-flexrow">
      <div>
        <div class="cus-h1">{{roomDate.name}}</div>
        <div class="cus-small cus-ftColorBlack3"><span>40㎡ 大床</span><span class="highlight">{{roomDate.extra}}</span></div>
      </div>
    </div>
    <div class="SelectDesc cus-normal cus-flexrow-center cus-ftColorBlack3">
      <div class="cus-flexrow"><i></i><span>可选</span></div>
      <div class="cus-flexrow"><i></i><span>不可选</span></div>
      <div class="cus-flexrow"><i></i><span>已选</span></div>
    </div>

    <!-- canvas 房间选择操作区域 -->
    <SelectCharts v-if="startPaintCharts" :outerSpace="222" :cancelRoomNotice="cancelRoomNotice"
                  :HotelRoomInfo="roomDate"
                  v-on:refreshSelectedRooms="refreshSelRooms" v-on:cancelRoomHandleFinished="cancelNoticeDone" ></SelectCharts>
    <!-- 结果说明 -->
    <div class="chooseResult">

    </div>
    <div class="stickBottom ">
      <!-- 已选提示 -->
      <div class="selectResult cus-small cus-ftColorBlack3">
        <div style="line-height: 30px;">已选房间</div>
        <div>
          <div class="selRow" v-for="room in selRoomList" @click="cancelRoom(room.hotelRoomId, room.hotelFloorNo)">
            <div class="roomBtn cus-flexrow">
              <div>{{room.roomName}}</div> <icon name="book/close" scale="1.2" class="svgicon"></icon>
            </div>

          </div>
        </div>
      </div>

      <!-- 价格计算-->
      <div class="priceLine cus-flexrow">
        <div>
          <span class="cus-ftColorBlack2 cus-small">总额：</span><span class="cus-small cus-priceColor">￥</span><span
          class="cus-h2 cus-priceColor">{{totalPrice}}</span>
        </div>
        <div class="cus-h1 " id="submitBtn" @click="selectConfirm">
          {{selRoomList.length>0?'确认':'取消'}}选房
        </div>
      </div>

    </div>

  </div>
</template>

<script type="text/babel">
  import SelectCharts from '@/components/book/roomSelect/SelectCharts'
  import { batchUnSelectRoomFloorMap} from  '@/services/axiosapi';
  import {storeSet, storeGet} from "@/utils/localStorage";
  export default {
    name: 'RoomSelectContainer',
    props:{
      // vvv 配合Vux PopUp组件使用的
      // 显示界面
      isRoomSelectShow: {
        type: Boolean,
        default: false,
      },
      // 外界要清空自主选房
      showRoomSwitch: {
        type: Boolean,
        default: false,
      },
      // ^^^
      // 入住离店日期 TODO
      roomDate: {
        type: Object,
        default: () => {
          return {
            checkIn: '2017-08-11',  // 入住时间
            checkOut: '2017-08-12', // 离店时间
            name: '智慧客房',
            extra: '智慧客房',
            price: 128,   // 房间单价
            roomTypeId: "6977981f-8a1f-435d-8d70-546b1eebad61",  // 房间类型
            hotelId: "68dd0989-c67a-42a9-8d5c-58f7061a677a",     // 酒店id
          }
        }
      }
    },
    beforeMount(){
      this.dataInitial();
    },
    components: {
      SelectCharts
    },
    data() {
      return {
        selRoomList: [],    // 被选中的房间，由子组件提供
        cancelRoomNotice: { // 通知子组件取消房间选择
          needCancel: false,
          roomId:0,
          floorId:0
        },
        startPaintCharts: false,  // 延迟到页面打开之后，再渲染，不让canvas绘图会缩在一起
      }
    },
    methods: {
      //数据初始化
      dataInitial(){
        // 是否允许绘制canvas
        this.startPaintCharts = this.isRoomSelectShow;

      },
      // 子组件通知渲染页面
      refreshSelRooms(val) {
        this.selRoomList = val;
      },

      // 取消选择房间
      cancelRoom(room,floor) {
        console.log('cancle : ',room,floor )
        // 指向新的对象地址，导致子组件watch到状态变化
        this.cancelRoomNotice = {
          needCancel: true,
          roomId:room,
          floorId:floor
        }
      },
      // 更新完成，状态回切,以下函数未能正常触发子组件watch
      cancelNoticeDone() {
        this.cancelRoomNotice.needCancel = false;
      },

      // 确认选房点击事件
      selectConfirm() {
        this.$emit('selectConfirmed',this.selRoomList)
      },

    },
    computed: {
      totalPrice(){
        return this.selRoomList.length * this.roomDate.price;
      }
    },
    watch: {
      // 显示后，才开始绘制canvas
      isRoomSelectShow(val){
        this.startPaintCharts = val;
      },
      showRoomSwitch(val){
        console.log(`Co watch showRoomSwitch changed: ${val}`)

        // 关闭switch并且没有正在绘制的canvas
        if(!val && !this.startPaintCharts) {
          // switch关闭后，若存在被占的房间，需要手动关闭
          if(this.selRoomList.length){
            console.log('more than one room need to be canceled')
            let options = {
              HotelId: '68dd0989-c67a-42a9-8d5c-58f7061a677a',
              HotelRoomId: this.selRoomList.map(function(item){
                return item.hotelRoomId
              }).join(','),
              BookStartDate: this.roomDate.checkIn,
              BookEndDate: this.roomDate.checkOut
            }

            batchUnSelectRoomFloorMap(options)
              .then(response => {
                if (response.data.ResultCode == 0) {
                  if(response.data.IntResult > 0) {
                    console.log('batchUnSelectRoomFloorMap success')
                    // 清除缓存
                    let cacheRoomlist = storeGet('SH_HOTEL_BOOK', 'ROOM_SELECTLIST')?storeGet('SH_HOTEL_BOOK', 'ROOM_SELECTLIST'):{};
                    this.selRoomList.forEach( item => {
                      if(cacheRoomlist.hasOwnProperty(item.hotelRoomId)) {
                        delete cacheRoomlist[item.hotelRoomId];
                      }
                    })
                    storeSet('SH_HOTEL_BOOK', 'ROOM_SELECTLIST',cacheRoomlist);

                    // 清空data
                    this.selRoomList = [];
                    // 通知外层组件更新数量
                    this.selectConfirm();
                  } else {
                    // 失败 todo 处理， 稍后再试，开关仍处于打开状态？
                    console.log('batchUnSelectRoomFloorMap fail')
                  }
                } else {
                  // 失败 todo 处理， 稍后再试，开关仍处于打开状态？
                  console.log('batchUnSelectRoomFloorMap fail')
                }

              })
              .catch(err => {
                // 失败 todo 处理， 稍后再试，开关仍处于打开状态？
                console.log('batchUnSelectRoomFloorMap fail')
              })

          }
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "../../styles/common/themeSettings";
  .view-wrap {
    background-color: white;
    width: 100%;
    height: 100%;

    /* 房间信息描述 */
    .roomDesc {
      margin: 0 10px;
      border-bottom: 1px solid @splitColor ;
      height: 64px;
      align-items: center;
    }

    /* 图表说明 */
    .SelectDesc {

      i{
        display: inline-block;
        width: 24px;
        height:15px;
        margin-right: 8px;
      }
      &>div {
        /*flex:1;*/
        line-height: 44px;
        align-items: center;
        width: 25vw;
        max-width: 120px;
      }
      &>div:nth-child(1)>i {
        background-color: white;
        border: 1px solid @ftColorGray;
      }
      &>div:nth-child(2)>i {
        background-color: @ftColorGray;
      }
      &>div:nth-child(3)>i {
        background-color: @themeColor;
      }
      /* 底部样式 */
      /*box-shadow: 0 2px 5px #333;*/
      border-bottom: 1px solid @splitColor;
    }


    /* 底部价格总额 */
    .stickBottom {
      width: 100%;

      position: fixed;
      left: 0;
      bottom:0;
      background-color: white;

      /* 选择结果 */
      .selectResult {
        margin:  0 10px;
        border-bottom: 1px solid @splitColor;
        min-height: 55px; /* 64 - margin bottom 9*/
        padding-bottom: 6px;
        .selRow {
          display: inline-block;
          margin-right: 5px;
          margin-bottom: 3px;
        }
        .roomBtn {
          display: inline-flex;
          width: 70px;
          line-height: 24px;
          text-align: center;
          border: 1px solid @splitColor;
          border-radius: 3px;
          justify-content: space-between;
          align-items: center;
          padding: 0 5px 0 10px;
          box-sizing:border-box;
        }
      }
      /* 价格和确认*/
      .priceLine {
        height:46px;
        justify-content: space-between;
        align-items: center;
        margin: 0 10px;

        #submitBtn {
          padding: 0 23px;
          line-height: 34px;
          background-color: @themeColor;
          color: white;
          border-radius: 5px;

        }
      }
    }
  }

  /* 主题强调色 */
  .highlight {
    color: white;
    background-color: @themeColor;
    margin-left: 10px;
    padding: 0 5px;
    border-radius: 3px;
  }
</style>
