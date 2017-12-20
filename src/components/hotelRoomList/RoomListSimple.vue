<template>
  <div>
    <scroller v-show="scrollerShow" lock-x scrollbar-y use-pullup :scroll-bottom-offset="offsetValue"
              :pullup-config="pullupConfig2" @on-scroll="onScroll" @on-pullup-loading="onScrollBottom"
              ref="scrollerBottom" class="cus-normal" :height="box2Height">
      <div class="box2" id="box2">
        <div v-for="(item, idx) in roomList">
          <div class="itemwrap cus-flexrow" @click="roomDetailShow(idx)">
            <!-- 左侧图标-->
            <div class="leftIcon">
              <img :src='item.Picuture' v-if="trim(item.Picuture)">
              <img v-else src="@/../static/images/001.png">
            </div>
            <!-- 左侧描述 -->
            <div class="cus-flexcolumn leftDescription">

              <div class="cus-h1" style="line-height: 1">{{item.Name}}</div>
              <div class="cus-small cus-ftColorBlack3 cus-flexcolumn description">{{item.Description}}</div>

              <!-- 标签 -->
              <div class="secondrow cus-small" v-if="item.IsRecommended || item.IsSmartRoom" style="">
                <span v-if="item.IsRecommended" class="roomType">推荐</span>
                <span v-if="item.IsSmartRoom" class="smartRoom cus-panelColor">智慧客房</span>
                <span v-if="0" class="roomType">特惠</span>
              </div>
            </div>

            <!-- 右侧价格区域 -->
            <div style="padding-top: 10px">
                <span class="pricewrap">
                  <span :class="{'cus-priceColor':true,'payText': item.AvalibleRoomCount<=0}"
                        style="font-size: 11px">￥</span><span
                  :class="{'cus-priceColor':true,'cus-h1':true,'payText': item.AvalibleRoomCount<=0}">{{item.RoomRate}}</span><span
                  v-if="oneNight" :class="{'cus-priceColor':true,'cus-small':true,'payText': item.AvalibleRoomCount<=0}"
                  style="margin-right: 5px;margin-left: 2px">均</span>
                </span>
              <div class="roomMes cus-flexcolumn">
                <div :class="{'btn-order':true,'btn-full': item.AvalibleRoomCount<=0}"
                     @click.stop="toBook2(idx,item.AvalibleRoomCount<=0)"><!-- weex不支持.stop 不支持冒泡、事件捕获 -->
                  <div class="cus-h1 reserve" v-if="item.AvalibleRoomCount>0">预订</div>
                  <div class="cus-h1 fullHouse" v-if="item.AvalibleRoomCount<=0">满房</div>
                  <div
                    :class="{'cus-small':true,'cus-priceColor': item.PayType.Name=='在线支付','cus-ftColorBlack3': item.PayType.Name=='到店付','payText': item.AvalibleRoomCount<=0}">
                    {{item.PayType.Name == "在线支付" ? "在线付" : "到店付"}}
                  </div> <!-- TODO需要修改后台数据格式改用type-->
                </div>
                <div class="remainRoom cus-flexcolumn-center"
                     v-if="item.AvalibleRoomCount <= 2 && item.AvalibleRoomCount > 0">
                  <div>仅剩<span>{{item.AvalibleRoomCount}}</span>间</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <load-more class="loading" tip="努力加载中" v-show="loadingShow"></load-more>
        <p class="noRoom cus-small cus-ftColorBlack3" v-show="!loadingShow">没有更多房间</p>
      </div>
    </scroller>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {Scroller, LoadMore} from 'vux'
  import {calcDayscount, calcDateAliasName} from '@/utils/timeUtil.js'
  import {fetchHotelRoomList} from '@/services/axiosapi'
  import {ls_unionId} from '@/utils/localStorage'
  import {is_weixin} from '@/utils/device'
  export default {
    name: 'RoomListSimple',
    components: {
      Scroller,
      LoadMore
    },
    data() {
      return {
        onFetching: false,
        index: 0,
        pullupConfig2: {
          content: '',
          downContent: '',
          upContent: '',
          loadingContent: '',
        },
        scrollerShow: true,
        scrollState: true,
        bounce: false,
        offsetValue: 100,
        clientHeight: 0,
        roomListShowHeight: 0
      }
    },
    props: {
      roomListLoadingStart: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      box2Height(){
        let scrollTop = this.$store.state.hotelRoomList.scrollTop;
        if(scrollTop==0){
          return ('auto')
        }else{
          let box2Height = document.body.clientHeight - 345 + Math.abs(this.$store.state.hotelRoomList.scrollTop);
          return (box2Height+'px')
        }

      },
      ...mapState({
        roomList: state => state.hotelRoomList.roomList,
        loadingShow: state => state.hotelRoomList.roomLoadingShow,
        roomListHeight: state => state.hotelRoomList.roomListHeight,
        checkInDate: state => state.hotelRoomList.calendar.checkIn,
        checkOutDate: state => state.hotelRoomList.calendar.checkOut,
        // box2Height: state => state.hotelRoomList.box2Height,
        scrollTopTrue: state => state.hotelRoomList.scrollTopTrue
      }),
      oneNight(){
        return calcDayscount(this.checkInDate, this.checkOutDate) == 1 ? false : true
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.$refs.scrollerBottom.reset({top: 0});
      });
    },
    updated(){
      this.$nextTick(() => {
        this.$refs.scrollerBottom.reset();
      })
    },
    watch: {
      checkInDate(){
        this.index = 0;
        this.$nextTick(() => {
          let scrollTop = Math.abs(this.$store.state.hotelRoomList.scrollTop);
          this.$refs.scrollerBottom.reset({top: 0});
          this.$store.dispatch('setScrollTopTrue', false);
        })
        setTimeout(() => {
          this.$refs.scrollerBottom.donePullup()
        }, 100)
      },
      checkOutDate(){
        this.index = 0;
        this.$nextTick(() => {
          let scrollTop = Math.abs(this.$store.state.hotelRoomList.scrollTop);
          this.$refs.scrollerBottom.reset({top: 0});
          this.$store.dispatch('setScrollTopTrue', false);
        })
        setTimeout(() => {
          this.$refs.scrollerBottom.donePullup()
        }, 100)
      },
      roomListLoadingStart(val){
        if(val){
          this.onScrollBottom();
        }
      }
    },
    methods: {
      trim(s){
        return s.replace(/(^\s*)|(\s*$)/g, "");
      },
      // 弹层显示房间详细信息
      roomDetailShow (idx) {
        console.log('roomDetailShow', idx)
        this.$store.dispatch('setRoomSelectIdx', {value: idx})
        this.$store.dispatch('setRoomDetailDisplay', {value: true})
      },
      // 跳转预定页
      toBook2 (idx, isTrue) {
        console.log('Yo book1')
        if (!isTrue) {
          this.$store.dispatch('setRoomSelectIdx', {value: idx})
          this.$router.push({
            name: 'book2page'
          })  // 跳转下单页
        }
      },
      onScroll(position){
        var scrollTop = position.top;
        // console.log(scrollTop);
        // var index = Number(this.index+1);
        // var isFn = true;


        // if(index==1 && scrollTop>20){
        //     if(isFn){
        //       this.onScrollBottom();
        //       isFn = false
        //     }
        // }else if(index>1 && scrollTop>140){

        // }
        var lastTop = this.$store.state.hotelRoomList.scrollTop;
        if (scrollTop == Math.abs(lastTop)) {
          this.$store.dispatch('setScrollTopTrue', true);
        }
        if (this.scrollTopTrue) {
          if (scrollTop < 0) {
            scrollTop = 0
          } else if (scrollTop > 220) {
            scrollTop = 220
          }
          ;
          if (scrollTop != 0) {
            scrollTop = '-' + scrollTop;
          }
          ;
          this.$store.dispatch('setScrollTop', scrollTop);
        } else {


          //下拉
          if (scrollTop <= 0) {
            var newTop = Number(lastTop) - Number(scrollTop);
            if (newTop < 0 && newTop >= -220) {
              this.$store.dispatch('setScrollTop', newTop);
            } else {
              this.$store.dispatch('setScrollTopTrue', true);
            }
          } else {
            // 上拉
            var newTop = Number(lastTop) - Number(scrollTop);
            if (newTop > -220) {
              this.$store.dispatch('setScrollTop', newTop);
            } else {
              this.$store.dispatch('setScrollTop', -220);
            }
          }


        }
        ;


        // if(scrollTop==index*)


        // if(scrollTop>0 && scrollState){
        //     this.$store.dispatch('scrollUpAnimate', true);
        //     this.scrollState = false
        // }else if(scrollTop<0 ){

        // }

      },
      onScrollBottom () {
        if (this.$store.state.hotelRoomList.roomLoadingShow) {
          this.index = this.index + 1;
          // setTimeout(() => {
          // this.$store.dispatch('getNewHotelRoomList',{PageIndex:this.index, PageSize:4});

          const calcTotalAverage = (arr) => {
            let ret = {}
            ret.totalPrice = 0;
            ret.averagePrice = 0;
            arr.forEach(item => {
              ret.totalPrice += +item.BasePrice  // string to number | ''->0, parseInt('') -> NaN
            })
            ret.averagePrice = Math.floor(ret.totalPrice / arr.length)
            return ret
          }

          let option = {
            PageIndex: this.index,
            PageSize: '',
            HotelId: this.$store.state.hotelRoomList.hotelInfo.Id,
            StartTime: this.$store.state.hotelRoomList.calendar.checkIn,
            EndTime: this.$store.state.hotelRoomList.calendar.checkOut,
            UnionId: ls_unionId()
          };
          let clientHeight = document.body.clientHeight;
          if (clientHeight >= 670) {
            option.PageSize = 6
          } else {
            option.PageSize = 5
          }
          ;

          fetchHotelRoomList(option).then(response => {
            if (response.data.Success == true) {
              let oldRoomList = this.$store.state.hotelRoomList.roomList;
              var asyncRoomDetail = {};
              let newRoomList = response.data.Content.map(item => { // 解决getters不能检测到属性新增的问题
                return Object.assign(item, asyncRoomDetail)
              });
              let roomList = oldRoomList.concat(newRoomList);
              this.$store.dispatch('setHotelRoomList', roomList);
              let roomListNum = this.$store.state.hotelRoomList.roomList.length;
              let roomTotalRecords = this.$store.state.hotelRoomList.roomTotalRecords;
              let roomListHeight = roomListNum * 90 + 'px';

              this.$store.dispatch('setRoomListHeight', roomListHeight);
              console.log(roomListNum);
              console.log(roomTotalRecords)
              if (roomListNum == roomTotalRecords) {
                this.$store.dispatch('setRoomListLoadingShow', false);
                this.bounce = true;

                let clientHeight = document.body.clientHeight;
                // if (clientHeight >= 670) {
                //   //先区分分辨率是多大的，这里分界为iphone6和6plus
                //   if(is_weixin()){
                //     //再区分是否是微信

                //   }else{
                //     this.$store.dispatch('setBox2Height', '600px');
                //   }

                // } else {

                //   if(is_weixin()){

                //   }else{
                //     this.$store.dispatch('setBox2Height', '540px');
                //   }

                // }

              } else {
                this.$store.dispatch('setRoomListLoadingShow', true);
                let clientHeight = document.body.clientHeight;

                // if (clientHeight >= 670) {
                //   this.$store.dispatch('setBox2Height', '600px');
                // } else {
                //   this.$store.dispatch('setBox2Height', '550px');
                // }
                // ;
                if (clientHeight >= 670) {
                  var num = 6*(this.index+1)
                } else {
                  var num = 5*(this.index+1)
                };

                if(num<roomTotalRecords){
                  this.onScrollBottom();  //继续请求页面
                }
              }
              setTimeout(() => {
                this.$refs.scrollerBottom.donePullup()
              }, 100)
              // setTimeout(() => {
              //     this.$nextTick(() => {
              //   this.$refs.scrollerBottom.reset({top: 0})
              // })
              // }, 2000)

            } else {
              // load Fail
            }
          }).catch(err => {
            //alert('fetchHotelRoomList err1:', err)
            this.utils.showNetError();
          })


          // setTimeout(() => {
          //     this.$refs.scrollerBottom.donePullup()
          // }, 100)
          if (this.$store.state.hotelRoomList.roomList.length == this.$store.state.hotelRoomList.roomTotalRecords) { // unload plugin
            setTimeout(() => {
              this.$refs.scrollerBottom.disablePullup();
            }, 100)
          }
          // }, 1500)
        }


      },
    },
  }
</script>

<style lang="less" scoped>
  @import '../../styles/common/themeSettings.less';

  @itemheight: 80px; // TODO 所有的变量可以提取到一个文件，方便配置和保存

  .itemwrap {
    background-color: #ffffff;
    padding: 0 10px;
    margin-top: 10px;
    min-height: @itemheight;
    // align-items: center;
    /* Flex 布局 */
    // align-items: center;
    * {
      display: flex;
      display: -webkit-flex;
    }

    /* 房间列表项icon */
    img {
      margin-right: 10px;
      width: 60px;
      height: 60px;
    }
    /* 房间列表项箭头展开动画效果 */
    .link-up:after, .link-down:after {
      transition: transform 300ms;
    }
  }

  .leftIcon {
    padding-top: 10px
  }

  .leftDescription {
    flex:1;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .description {
    width:140px;
    line-height:14px;
    margin-top:2px;
    margin-bottom:2px
  }

  /* 标签行 itemwrap detailwrap 共用*/
  .secondrow {
    height: 18px;
    .roomType {
      display: inline-block;
      width: 32px;
      margin-right: 5px;
      text-align: center;
      border: 1px solid @themeColor;
      border-radius: 3px;
      color: @themeColor;
    }
    .smartRoom {
      display: inline-block;
      width: 64px;
      margin-right: 5px;
      text-align: center;
      border-radius: 3px;
      background-color: #25c0b1;
    }
  }

  .pricewrap {
    align-items: center;
    height: 20px;
    margin-top: 14px;
  }

  /* 预定按钮 flex布局版 */
  .btn-order {
    display: inline-block; // TODO weex支持 flex only
    border: 1px solid @priceColor;
    text-align: center;
    border-radius: 5px;
    width: 51px;
    height: 44px;
    .reserve {
      height: 28px;
      line-height: 28px;
      background: @priceColor;
      color: #fff;
      justify-content: center; // flex
    }
    .fullHouse {
      height: 28px;
      line-height: 28px;
      background: #ccc;
      color: #fff;
      justify-content: center; // flex
    }
    div:last-child {
      height: 16px;
      justify-content: center; // flex
    }
  }

  .btn-full {
    border: 1px solid #ccc;
  }

  .payText {
    color: #ccc
  }

  .box2-wrap {
    height: 300px;
    overflow: hidden;
  }

  .noRoom {
    text-align: center;
    margin-top: 10px;
  }

  .roomMes {
    margin-left: 5px;
  }

  .remainRoom {
    font-size: 11px;
    color: #fea04c;
    text-align: center;
  }

</style>
