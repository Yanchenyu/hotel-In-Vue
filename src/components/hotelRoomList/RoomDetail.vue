<template>
  <div>
    <popup v-model="showRoomDetail2" :hide-on-blur="true" height="100%" is-transparent>

      <div class="RoomPopup">
        <div
          style="text-align:right; position: fixed; top:0; right:0; width:100%; height:30px; background: transparent; z-index:9999; padding: 0 10px;">
          <x-icon type="ios-close-outline" class="cell-x-icon" @click="closeClick"></x-icon>
        </div>

        <div class=""
             style=" background:#25c0b2; height:90%;padding:0;overflow-x:hidden; overflow-y:scroll;-webkit-overflow-scrolling:touch;">
          <div class="img-box"
               style="background:green; height:185px;padding:15px 0;overflow-x:scroll; overflow-y:hidden;-webkit-overflow-scrolling:touch;">
            <div class="box1">
              <div class="box1-item" v-for="i in 7"><img src="../../assets/images/002.jpg" alt=""
                                                         style="width:100%; height:180px;"></div>
            </div>
          </div>

          <div>
            <div class="DescContent">
              <div class="cus-h1">
                智慧客房 (双份早餐)
              </div>
              <div class="cus-h1">
                <flexbox :gutter="0" wrap="wrap">
                  <flexbox-item :span="6">
                    早餐：双早
                  </flexbox-item>
                  <flexbox-item :span="6">
                    宽带：免费WiFi
                  </flexbox-item>
                  <flexbox-item :span="6">
                    面积：20m2
                  </flexbox-item>
                  <flexbox-item :span="6">
                    床型：大/双
                  </flexbox-item>
                </flexbox>
              </div>

              <div class="cus-normal">
                <span>以简约、舒适、清新、淡雅为核心，搭配智慧化的现代科技，打造一个舒心明快又独具特色的简约苏式旅程休憩之地，让您享受全身心的愉悦！</span>
              </div>

              <div class="cus-h1">
                <flexbox :gutter="0" wrap="wrap">
                  <flexbox-item :span="1/4">贴心服务:</flexbox-item>
                  <flexbox-item :span="3/4" class="">
                    <span>免费停车</span>
                    <span>雨伞</span>
                    <span>沙发</span>
                  </flexbox-item>

                </flexbox>
              </div>

              <div class="cus-normal">
                <span>以简约、舒适、清新、淡雅为核心，搭配智慧化的现代科技，打造一个舒心明快又独具特色的简约苏式旅程休憩之地，让您享受全身心的愉悦！</span>
              </div>
              <div class="cus-normal">
                <span>以简约、舒适、清新、淡雅为核心，搭配智慧化的现代科技，打造一个舒心明快又独具特色的简约苏式旅程休憩之地，让您享受全身心的愉悦！</span>
              </div>
              <div class="cus-normal">
                <span>以简约、舒适、清新、淡雅为核心，搭配智慧化的现代科技，打造一个舒心明快又独具特色的简约苏式旅程休憩之地，让您享受全身心的愉悦！</span>
              </div>
              <div class="cus-normal">
                <span>以简约、舒适、清新、淡雅为核心，搭配智慧化的现代科技，打造一个舒心明快又独具特色的简约苏式旅程休憩之地，让您享受全身心的愉悦！</span>
              </div>
            </div>
          </div>

        </div>


        <div style="position:fixed; bottom:20px; left:10px; width:100%">
          <span style="display: inline-block; width:45%; background: yellow;">￥358</span>
          <span style="display: inline-block; background: lightgreen;">预定</span>
        </div>

      </div>
    </popup>
  </div>


</template>

<script>
  import {Popup, Flexbox, FlexboxItem} from 'vux'

  export default {
    name: 'RoomDetail',
    props: ['showRoomDetail2'],
    components: {
      Popup,
      Flexbox,
      FlexboxItem,
    },
    methods: {
      // 通知父组件关闭弹层
      closeClick: function () {
        this.$emit('closeClick');
      }
    }
  }
</script>

<style lang="less" scoped>

  .RoomPopup {
    width: 95%;
    height: 95%;
    margin: 15px auto;
    background-color: #fff;
    border-radius: 5px;
    padding-top: 0px;
  }

  /* 复用 */
  .box1 {
    height: 185px;
    position: relative;
    width: 4000px;
  }

  .box1-item {
    width: 370px;
    height: 185px;
    background-color: #ccc;
    display: inline-block;
    margin-left: 15px;

    text-align: center;
    line-height: 100px;
    img {
      width: 100%;
    }
  }

  .box1-item:first-child {
    margin-left: 0;
  }
</style>
