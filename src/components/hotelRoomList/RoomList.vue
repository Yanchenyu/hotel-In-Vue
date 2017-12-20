<template>
  <div>
    <div v-for="(item, idx) in roomlist" style="">
      <div class="itemwrap cus-flexrow" @click="toggleExpand(idx)">
        <!-- 左侧图标-->
        <img src="http://placeholder.qiniudn.com/60x60/3cc51f/ffffff" alt="">
        <div class="cus-flexcolumn" style="flex:1;">
          <div>
            <!-- 左侧描述 -->
            <div class="cus-flexcolumn" style="flex:1; ">
              <div class="cus-h1">{{item.roomtype}}</div>
              <div class="cus-small cus-ftColorBlack3">{{item.roomdesc}}</div>
            </div>
            <!-- 右侧价格&箭头-->
            <div class="pricewrap">
              <span class="cus-small cus-priceColor">￥</span><span
              class="cus-h1 cus-priceColor">{{item.lowPrice}}</span><span class="cus-small cus-ftColorBlack3">起</span>
              <span style="position:relative;">
                <span :class="linkClass(item.expand)"></span>
              </span>
            </div>
          </div>
          <!-- 标签 -->
          <div class="secondrow cus-small">
            <span v-for="mark in item.roomTypes" class="roomType">{{mark}}</span>
          </div>
        </div>
      </div>

      <!-- 展开后详细列表 -->
      <!-- TODO注意weex中不支持Vue的template方法；需要验证 -->
      <template v-if="item.expand == 'up'" v-for="(detail, index) in item.detailList">
        <div class="detailwrap cus-flexrow" @click="roomDetailShow">
          <div class="cus-flexcolumn" style="flex:1;">
            <div class="cus-normal">
              {{detail.title}}
            </div>
            <div class="cus-small">
              {{detail.desc}}
            </div>
            <div class="secondrow cus-small">
              <span v-for="types in detail.roomTypes" class="roomType">{{types}}</span>
            </div>
          </div>
          <!-- 右侧价格区域 -->
          <div>
            <div class="pricewrap"><span class="cus-min cus-priceColor">￥</span><span class="cus-normal cus-priceColor">380</span>
            </div>
            <div class="cus-btn-order" @click.stop="toBook1"><!-- weex不支持.stop 不支持冒泡、事件捕获 -->
              <div class="cus-h1">预定</div>
              <div class="cus-small">在线付</div>
            </div>
          </div>
        </div>
      </template>
    </div>

  </div>
</template>

<script>
  //import RoomDetailXDialog from '@/components/hotelRoomList/RoomDetailXDialog.vue'


  export default {
    name: 'RoomList',
    props: [],
    // components: {
    //   RoomDetailXDialog
    // },
    data() {
      return {
        // 房型列表
        roomlist: [{
          roomtype: "智慧客房",
          roomdesc: "40m² 大/双",
          roomTypes: ["推荐", "热销"],
          lowPrice: 380,
          expand: 'up',
          detailList: [{
            title: '双份/早饭',
            desc: "无窗 不可取消",
            roomTypes: ["推荐", "热销"]
          }, {
            title: '双份/早饭',
            desc: "无窗 不可取消",
            roomTypes: ["推荐", "爆款"]
          }
          ]
        }, {
          roomtype: "女神房",
          roomdesc: "40m² 大/双",
          roomTypes: [],
          lowPrice: 410,
          expand: 'up',
          detailList: [{
            title: '双份/早饭',
            desc: "无窗 不可取消",
            roomTypes: []
          }
          ]
        }
        ]
      }
    },
    computed: {},
    methods: {
      // 动态计算是否要展开
      linkClass: function (isExpand) {
        return {
          "link-up": isExpand == 'up',
          "link-down": isExpand == 'down',
        }
      },
      // 点击展开对应详细房间
      toggleExpand: function (idx) {
        this.roomlist[idx].expand = (this.roomlist[idx].expand == 'up') ? 'down' : 'up';
      },

      // 弹层显示房间详细信息
      roomDetailShow () {
        console.log('CK detail'); // TODO
        this.$emit('showRoomDetail')  // id 后续传入
      },
      // 跳转预定页
      toBook1 () {
        console.log('Yo book1')
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '../../styles/common/themeSettings.less';

  @itemheight: 80px; // TODO 所有的变量可以提取到一个文件，方便配置和保存

  .itemwrap {
    background-color: #ffffff;
    padding: 0 15px;
    margin-top: 10px;
    height: @itemheight;

    /* Flex 布局 */
    align-items: center;
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

  .detailwrap {
    background-color: @popColor;
    padding: 0 15px;
    margin-bottom: 1px; // TODO 改用v-show thin-line
    height: 74px;

    /* Flex 布局*/
    align-items: center;
    * {
      display: flex;
      display: -webkit-flex;
    }
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
  }

  .pricewrap {
    align-items: center;
  }

  /* 预定按钮 flex布局版 */
  .cus-btn-order {
    display: inline-block; // TODO weex支持 flex only
    margin-left: 5px;
    border: 1px solid @priceColor;
    text-align: center;
    border-radius: 5px;
    width: 51px;
    div:first-child {
      height: 28px;
      line-height: 28px;
      background: @priceColor;
      color: #fff;
      justify-content: center; // flex
    }
    div:last-child {
      height: 16px;
      color: @priceColor;
      justify-content: center; // flex
    }
  }
</style>
