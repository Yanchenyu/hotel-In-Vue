
<template>
  <div class="view-wrap">
    <x-header  :left-options="{showBack: false}"
               class="xheader vux-override" style="background-color:#25c0b1;" >
      播放列表
      <span slot="left" style="color: white;" @click="handleClose"><div class="left-arrow"></div>&nbsp;&nbsp;&nbsp;&nbsp;返回</span>
      <span slot="right" style="color: white;" @click="handleClose">完成</span>
    </x-header>

    <div class="cus-flexrow musicItem" v-for="(item, index) in musicList" @click="musicHandleClick(index, item.displayName)">
      <div>
        <div class="cus-h1 cus-ftColorBlack">{{item.displayName}}</div>
      </div>
      <div>
        <icon v-if="musicIndex == index" name="raw-checked" scale="2" class="svgicon" style="color:#25c0b1"></icon>
        <icon v-else name="raw-unchecked" scale="2" class="svgicon" style="color:#a5a2a2"></icon>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import {XHeader} from 'vux'
  export default {
    name: 'MusicSelect',
    props:{
      // 优惠券
      musicList: {
        type: Array,
        default(){
          return [{
            name: 'kankan-wuzhenzhilian.mp3',
            folder: '001.randomlist',
            displayName:'乌镇之恋',
          },{
            name: 'Kim Taylor - I Am You.mp3',
            folder: '001.randomlist',
            displayName:'I Am You',
          }]
        }
      }
    },
    components: {
      XHeader
    },
    data() {
      return {
        musicIndex: -1,
        playName: '',   // 音乐播放的现实名称
        musicSetValue:'',   // 用于存储到数据库的音乐信息
      }
    },

    methods: {
      // 优惠券点击选择/取消选择
      musicHandleClick(idx, name) {
        if(this.musicIndex == idx) {
          this.musicIndex =  -1;
          this.playName = '';
          this.musicSetValue = '';
        } else {
          this.musicIndex = idx;
          this.playName = name;
          this.musicSetValue = this.musicList[idx].displayName + '|' + this.musicList[idx].name + '|' + this.musicList[idx].folder;
        }
      },
      // 关闭选择
      handleClose() {
        this.$emit('confirmMusicSelect', this.musicSetValue, this.playName)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../styles/common/themeSettings";
  .view-wrap {

    /* 歌单 */
    .musicItem {
      background-color: white;
      margin: 10px 10px 0;
      border-radius: 8px;
      padding: 10px;
      &>div {
        line-height: 0.5em;
      }

      /* 左边文字 */
      &>div:first-child {

        /*line-height: 1em;*/
        flex:1;
      }

    }
  }
</style>
