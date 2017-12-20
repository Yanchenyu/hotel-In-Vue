
<template>
  <div class="containerWrap" :style="{height: wrapHeight + 'px'}">
    <div class="eWrap">
      <IEcharts :option="customSelf" :loading="loading" @ready="onReady" @click="roomClick"></IEcharts>
      <div class="compass cus-small">
        <div>北</div>
        <i class="img"></i>
      </div>

      <div class="floorSelect cus-small">
        <ul>
          <li class="cus-flexcolumn-center"><i>选择</i><i>楼层</i></li>
          <li v-for="(item, index) in floorArr" class="cus-flexrow-center"
              :class="{on: floorIdx == index}"
              @click="selectFloor(index)">{{item.HotelFloorNo}}F</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  import {viewportHeight} from '@/utils/device';
  import {clipRectByRect} from '@/utils/echartsUtils';
  import _ from 'lodash'
  import {queryHotelRoomMap, hotelRoomMapSelect, hotelRoomMapUnselect} from  '@/services/axiosapi';
  import {roomTypes} from '@/utils/echarts/roomTypes';
  import {storeSet, storeGet} from "@/utils/localStorage";

  // eCharts相关
  import IEcharts from 'vue-echarts-v3/src/lite.vue';
  import 'echarts/lib/component/dataZoom';
  import 'echarts/lib/chart/custom';
  import 'echarts/lib/chart/scatter.js';
  import 'echarts/lib/component/graphic';

  // 测试自化简单Rect
  // 原始坐标系中，左下为Z1,右上为Z2，左上为X1,右下X2
  // data格式，由于reverse翻转后是期望坐标，所以原始坐标data为[Z1x,Z2y,Z2x,Z1y]
  var eData = [
    {
      name:'',
      value: [0,0, 0, 0, 0],
    },
    // 最后加一个保持比例的max坐标
 ];

  // 坐标计算
  function renderRoom(params, api) {
    var start = api.coord([api.value(0),api.value(1)])
    var end = api.coord([api.value(2),api.value(3)])

    var xDist = api.value(2) - api.value(0);
    var yDist = api.value(1) - api.value(3);
    var height = api.size([xDist, yDist])[1] ;

//    console.log('2nd: api.size')
//    console.log(`xDist:${xDist}, yDist:${yDist}`)
//    console.log(`x:${start[0]}, y:${start[1]}, width: ${end[0] - start[0]}, height: ${height}`)
//    console.log(`Cut: x:${params.coordSys.x}, y:${params.coordSys.y}, width: ${params.coordSys.width}, height: ${params.coordSys.height}`)
    return {
      type: 'rect',
      shape: clipRectByRect({
        x: start[0],
        y: start[1],
        width: end[0] - start[0],
        height: height
      }, {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
      }),
      style: api.style()
    }
  }



  export default {
    name: 'SelectCharts',
    components: {
      IEcharts
    },
    props: {
      // 不可以用于绘制canvas的区域大小
      outerSpace: {
        type: Number,
        default: 0
      },
      HotelRoomInfo:{
        type: Object,
        default: function(){
          return {
            checkIn: '2017-08-11',  // 入住时间
            checkOut: '2017-08-12', // 离店时间
            roomTypeId: "6977981f-8a1f-435d-8d70-546b1eebad61",  // 房间类型
            hotelId: "68dd0989-c67a-42a9-8d5c-58f7061a677a",     // 酒店id
          }
        }
      },
      // 房间取消选择缩影index
      cancelRoomNotice: {
        type: Object,
        default(){
          return {
            needCancel: false,
            roomId: 0,
            floorId: 0,
          }
        }
      }
    },
    beforeMount() {

      // 设置canvas画布区域
      this.wrapHeight = viewportHeight() - this.outerSpace;
      // 清除历史超时缓存
      this.clearExpiredRoomInfo();
      // 数据加载
      this.loadHotelRoomMap(true, null);
    },
    data: () => ({
      wrapHeight: 0,  // canvas可以绘制的高度

      loading: false,

      // 楼层数据
      floorArr: null,
      floorIdx: 0,  // 当前选择楼层
      // 所有room的array
      allRoomArr: [],
      selectedRoomList: [], // 选中的房间列表


      // eCharts初始数据
      // 自定义echarts绘制内容
      customSelf: {
        grid: {
          left: '75px'
        },
        xAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          show: false
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          show:false
        },
        dataZoom: [{
          type: 'slider',
          filterMode: 'weakFilter',
          showDataShadow: false,
          xAxisIndex: 0,  // 控制x轴
          height: 5,
//          borderColor: 'transparent',
//          backgroundColor: '#e2e2e2',
        }, {
          type: 'slider',
          filterMode: 'weakFilter',
          showDataShadow: false,
          yAxisIndex: 0,
          left: '93%',
          width:5,
        }, {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'weakFilter'
        }, {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'weakFilter'
        }],
//        graphic:[
//          {
//            type: 'image',
//            id: 'logo',
//            right: 20,
//            top: 20,
//            z: 10,
//            bounding: 'raw',
//            origin: [75, 75],
//            style: {
//              image: 'http://echarts.baidu.com/images/favicon.png',
//              width: 30,
//              height: 30,
//              opacity: 0.1
//            }
//          }
//        ],
        series: [{
          type: 'custom',
          renderItem: renderRoom,
          itemStyle: {
            normal: {
              opacity: 1,
              color: '#fff'
            },
          },
          encode: {
            x: [0, 2],
            y: [1,3],
            //label: 4,
          },
          label: {
            normal: {
              show: true,
              textStyle:{
                color: '#666',    // 只能显示数字。
              },
              formatter:'{b}'
            }
          },
          data: eData
        }]
      }

    }),
    computed:{
      // 当前实际楼层号
      currentFloorNum() {
        return this.floorArr[this.floorIdx].HotelFloorNo;
      },

      // 当前楼层对应的房间map
      roomMap(){
        if(this.floorArr && this.floorArr.length > 0) {
          // filter 函数中一定要bind this
          return this.allRoomArr.filter(item => {
            return item.HotelFloorNo == this.currentFloorNum;
          })
        } else {
          return [];
        }
      }
    },
    methods: {
      onReady(instance) {
        console.log(instance);
      },
      // 楼层选择
      selectFloor(idx) {
        this.floorIdx = idx;
        this.loadHotelRoomMap(false, this.currentFloorNum)
      },

      // 刷新已被选择的房间列表
      refreshSelectedRoomList(){
        // 房型id匹配，未超时缓存 roomlist
        let cacheRoomlist = storeGet('SH_HOTEL_BOOK', 'ROOM_SELECTLIST')?storeGet('SH_HOTEL_BOOK', 'ROOM_SELECTLIST'):{};

        let rooms = [];
        console.log(this.HotelRoomInfo.roomTypeId)
        for (var key in cacheRoomlist ) {
          if(cacheRoomlist.hasOwnProperty(key)) {
            let room = cacheRoomlist[key]

            if(room.roomTypeId == this.HotelRoomInfo.roomTypeId && (new Date().getTime() < room.expireTime)) {
              rooms.push(room)
            }
          }
        }
        this.selectedRoomList = rooms;
      },

      /**
       * 清除缓存中超时的房间状态信息
       * */
      clearExpiredRoomInfo() {
        let cacheRoomlist = storeGet('SH_HOTEL_BOOK', 'ROOM_SELECTLIST')?storeGet('SH_HOTEL_BOOK', 'ROOM_SELECTLIST'):{};
        for(var key in cacheRoomlist) {
          if(new Date().getTime() > cacheRoomlist[key].expireTime) {
            delete cacheRoomlist[key];
          }
        }
        storeSet('SH_HOTEL_BOOK', 'ROOM_SELECTLIST',cacheRoomlist);
      },
      /**
       * 楼层数据加载
       * @param {Boolean} isAllFloor 是否是查询所有楼层
       * @param {Boolean} floorIndex 楼层索引编号
       */
      loadHotelRoomMap(isAllFloor, floorIndex) {
        let option = {
          HotelId: this.HotelRoomInfo.hotelId,
          HotelFloorNo: isAllFloor?'':floorIndex,
          RoomTypeId: this.HotelRoomInfo.roomTypeId,
          BookStartDate: this.HotelRoomInfo.checkIn,
          BookEndDate: this.HotelRoomInfo.checkOut
        }
        this.loading = true;
        queryHotelRoomMap(option)
          .then(response => {

            if (response.data.ResultCode == 0) {
              // 所有房间的数据信息
              this.allRoomArr = response.data.Data;
              // 楼层数据加载
              if (isAllFloor) {
                // 楼层信息
                this.floorArr = response.data.ExtendData.sort(function(a,b) {return b.HotelFloorNo - a.HotelFloorNo});
                // 找出第一个有有效房间数的楼层
                for (var idx = this.floorArr.length - 1; idx > 0 ; idx--) {

                  if(this.floorArr[idx].Count > 0) {
                    this.floorIdx = idx;
                    break;
                  }
                }
              }

              // 画布展示该层房间数据
              // debugger;验证此时eCharts组件还未渲染
              this.roomMapPaint();
            } else {
              this.utils.showNetError();
            }
            this.loading = false;
          })
          .catch(err => {
            // 网络错误, js错误 err为空 {}
            console.log(JSON.stringify(err))
            this.utils.showNetError();
          })
      },

      // 根据roomMap渲染显示
      roomMapPaint() {
        let cacheRoomlist = storeGet('SH_HOTEL_BOOK', 'ROOM_SELECTLIST')?storeGet('SH_HOTEL_BOOK', 'ROOM_SELECTLIST'):{};

        let drawData = this.roomMap.map( item => {
          let displayStyle;

          //  FeatureType 0 房间 1 过道 2 洗衣房 3 安全出口 4楼梯 5电梯 6游泳池 7健身房 8障碍物 9自定义
          if(item.FeatureType == 0) {
            // 显示样式 (SelectedStatus: 0 可选 1 已选 2不可选)
            if(item.SelectedStatus == 0) {
              displayStyle = {
                color: '#ffffff',
                borderColor: '#e0dfdd'
              }
            } else if (item.SelectedStatus == 1) {
              displayStyle = {
                color: '#25c0b1',
                borderColor: '#ffffff'
              }
            } else if (item.SelectedStatus == 2) {
              if(this.HotelRoomInfo.roomTypeId == item.RoomTypeId && cacheRoomlist.hasOwnProperty(item.HotelRoomId) && (new Date().getTime() < cacheRoomlist[item.HotelRoomId].expireTime)) {
                displayStyle = {
                  color: '#25c0b1',
                  borderColor: '#ffffff'
                }
              } else {
                displayStyle = {
                  color: '#cccccc',
                  borderColor: '#ffffff'
                }
              }
            } else {
              displayStyle = {
                color: '#999',
                borderColor: '#ffffff'
              }
            }
          } else {
            displayStyle = {
              color: '#999',
              borderColor: '#ffffff'
            }
          }

          return {
            name: item.FeatureName,
            // value内容顺序为: 左上坐标1，右下坐标2 [X1,Y1,X2,Y2, 房间类型, 房间选中状态(0 可选 / 1 已选 /2 不可选)]
            value: [item.X1,item.Y1, item.X2, item.Y2, item.FeatureType, item.SelectedStatus],
            itemStyle: {
              normal: displayStyle
            }
          }
        })
        this.customSelf.series[0].data = drawData;
        // 渲染时统一更新选择的状态
        this.refreshSelectedRoomList();
      },
      // 房间选择事件
      roomClick(event, instance, echarts) {
        console.log(event, event.dataIndex);
        let eventIdx = event.dataIndex

        // 0 房间 1 过道 2 洗衣房 3 安全出口 4楼梯 5电梯 6游泳池 7健身房 8障碍物 9自定义
        if(event.data.value[4] != 0) {
          // 0为房间
          return false;
        }
        // SelectedStatus: 0 可选，1已选 2 不可选
        // 根据房间状态处理click事件
        if (event.data.value[5] == 0) {
          // 调用选中接口
          this.roomSelect(eventIdx);

        } else if(event.data.value[5] == 2) {
          // 被自己选中的，并且未超时的, 执行房间取消命令
          this.cancelRoomSelect(eventIdx, false, null,null)
        }
      },
      // 房间选择功能
      roomSelect(roomIdx) {
        let option = {
          HotelId: this.HotelRoomInfo.hotelId,
          HotelFloorNo: this.currentFloorNum,
          RoomTypeId: this.roomMap[roomIdx].RoomTypeId,
          HotelRoomId: this.roomMap[roomIdx].HotelRoomId,
          BookStartDate: this.HotelRoomInfo.checkIn,
          BookEndDate: this.HotelRoomInfo.checkOut
        }

        console.log('call Room Select api')
        hotelRoomMapSelect(option)
          .then(response => {
            if (response.data.ResultCode == 0 && response.data.IntResult > 0) {
              // 成功选中
              let cacheRoomlist = storeGet('SH_HOTEL_BOOK', 'ROOM_SELECTLIST')?storeGet('SH_HOTEL_BOOK', 'ROOM_SELECTLIST'):{};
              let roomid = this.roomMap[roomIdx].HotelRoomId;
              cacheRoomlist[roomid] = {
                expireTime: (new Date().getTime() + 15*60*1000 - 4000),  // 15min超时(提前了4s)
                roomName: this.roomMap[roomIdx].FeatureName,     // 房间名称
                roomTypeId: this.roomMap[roomIdx].RoomTypeId,    // 房间类型id,
                hotelRoomId: this.roomMap[roomIdx].HotelRoomId,       // roomid
                eventIdx: roomIdx,                               // data中的索引index, 父组件通知使用
                // vvv 父组件取消房间，需要用时间，使用props提供数据
                hotelFloorNo: this.roomMap[roomIdx].HotelFloorNo,   // 房间所属楼层
                // ^^^
              }
              storeSet('SH_HOTEL_BOOK', 'ROOM_SELECTLIST',cacheRoomlist)
              // 更新楼层房间状态显示数据
              this.allRoomArr = response.data.Data;
              this.roomMapPaint();
            } else {
              console.log(response.data.StringResult);
              this.utils.toast({msg: `${response.data.StringResult}。 正在重新为您查询`});
              // 更新楼层房间状态显示数据
              this.loadHotelRoomMap(false, this.currentFloorNum)
            }
          })
          .catch(err => {
            this.utils.showNetError();
          })
      },

      /**
       * 房间取消选择功能
       * @param {Number} cancleIdx 取消的数组索引
       * @param {Boolean} isParentNotice true代表父组件通知
       * @param {Number} hotelRoomid 取消所在楼层索引编号，isParentNotice == false时生效
       */
      cancelRoomSelect(cancleIdx, isParentNotice, cancelFloorIdx, cancelRoomId) {
        let cacheRoomlist = storeGet('SH_HOTEL_BOOK', 'ROOM_SELECTLIST')?storeGet('SH_HOTEL_BOOK', 'ROOM_SELECTLIST'):{};
        let roomid,floorid;
        if(isParentNotice) {
          roomid =  cancelRoomId;
          floorid = cancelFloorIdx;
        } else {
          roomid =  this.roomMap[cancleIdx].HotelRoomId;
          floorid = this.currentFloorNum;
        }

        if(cacheRoomlist.hasOwnProperty(roomid) && cacheRoomlist[roomid].roomTypeId == this.HotelRoomInfo.roomTypeId) {
          if(new Date().getTime() < cacheRoomlist[roomid].expireTime) {
            console.log(`${cacheRoomlist[roomid].expireTime} still valid`)

            // 调用取消接口
            let option = {
              HotelFloorNo: floorid,
              HotelRoomId: roomid,
              HotelId: this.HotelRoomInfo.hotelId,
              RoomTypeId: this.HotelRoomInfo.roomTypeId,
              BookStartDate: this.HotelRoomInfo.checkIn,
              BookEndDate: this.HotelRoomInfo.checkOut
            }

            console.log('call Room unSelect api')
            hotelRoomMapUnselect(option)
              .then(response => {
                if (response.data.ResultCode == 0 && response.data.IntResult > 0) {
                  // 更新成功
                  // 1. 清除该房间的缓存
                  delete cacheRoomlist[roomid];
                  storeSet('SH_HOTEL_BOOK', 'ROOM_SELECTLIST',cacheRoomlist);
                  // 2. 是当前楼层就重新渲染页面
                  if(floorid == this.currentFloorNum) {
                    this.allRoomArr = response.data.Data;
                    this.roomMapPaint();
                  } else {
                    this.refreshSelectedRoomList();
                  }
                } else {
                  // 显示取消失败原因
                  this.utils.toast({msg: response.data.StringResult});
                }
              })
              .catch(err => {
                this.utils.showNetError();
              })

          } else {
            console.log(`${cacheRoomlist[roomid].expireTime} is exipired`)
            // 取消房间选择超时，重新查询房间状态
            // 1. 清除该房间的缓存
            delete cacheRoomlist[roomid];
            storeSet('SH_HOTEL_BOOK', 'ROOM_SELECTLIST',cacheRoomlist);
            // 2. 重新查询map接口进行页面渲染
            if(floorid == this.currentFloorNum) {
              this.loadHotelRoomMap(false, this.currentFloorNum)
            } else {
              this.refreshSelectedRoomList();
            }
          }
        }
      },

    },
    watch:{
      // 通知父组件，更新选中的房间的显示
      selectedRoomList: {
        handler: function(val) {
          this.$emit('refreshSelectedRooms', val)
        },
        //deep:true, // 由于每次都是赋值新的数组对象，所以不需要深度watch
      },
      cancelRoomNotice: {
        handler: function(notice) {

          if(notice.needCancel) {
            console.log('-----cancelRoomNotice watch changed: ',notice.needCancel,notice.roomId,notice.floorId)
            // 被自己选中的，并且未超时的, 执行房间取消命令
            this.cancelRoomSelect(null, true, notice.floorId, notice.roomId);
            this.$emit('cancelRoomHandleFinished')
          } else {
          }
        },
        immediate: true,
        deep:true
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "../../../styles/common/themeSettings";
  .containerWrap {
    width: 100vw;
    background-color: @pageColor ;
  }
  /* 限制echart绘制区域 */
  .eWrap {
    height: 100%;
    position: relative;
    /* 指南针绘制 */
    .compass {
      position: absolute;
      top:10px;
      left:30px;
      text-align: center;
      .img {
        display: block;
        width:11px;
        height:30px;
        background: url("../../../assets/images/book/compass.png") no-repeat 100% 100%;
        background-size: 100% 100%;
        margin-top: 8px;
      }
    }
    /* 楼层选择 */
    .floorSelect {
      position: absolute;
      left: 20px;
      bottom: 40px;
      li {
        width: 40px;
        height: 40px;
        i {
          display: block;
        }
        text-align: center;
        border: 1px solid @splitColor;
        border-bottom: none;
        background-color: white;
        color: @ftColorBlack;
      }

      li:first-child {
        height: 34px;
        /*padding: 5px 0;*/
        line-height: 1.2em;
        color: @ftColorBlack3;
      }
      li:last-child {
        border-bottom: 1px solid @splitColor;
      }
      li.on {
        border: 1px solid @themeColor;
        background-color: #92dfd8;
        color: @themeColor;
        &+li{
          border-top:none;
        }
      }
    }
  }

</style>
