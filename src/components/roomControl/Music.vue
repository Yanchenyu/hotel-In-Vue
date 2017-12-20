<template>
  <div class="bg">
    <DeviceMusicTop></DeviceMusicTop>

    <!-- 音乐控制部分 -->
    <div class='currentPlayMusic cus-normal cus-ftColorBlack2'>
      {{recentPlayMusic}}
    </div>
    <div class="cus-flexrow-center">
      <div class="iconItem cus-flexcolumn-center" v-for="(item,idx) in iconList" @click='iconClick(idx)' :key='idx'>        
        <icon :name="item.name" :scale="item.size" :class="{'svgicon': (idx==1 && item.type=='musicPause')}"></icon>
        <p class="cus-small cus-ftColorBlack3">{{item.title}}</p>
      </div>
    </div>
    <DeviceMusicVolume :vol='parseInt(vol*100)' @volumeChangedTo='volumeChangedTo'></DeviceMusicVolume>
  </div>
</template>

<script>
  import DeviceMusicTop from '@/components/roomControl/deviceModule/DeviceMusicTop.vue'  
  import DeviceMusicVolume from '@/components/roomControl/deviceModule/DeviceMusicVolume.vue'
  import {deviceType} from '@/utils/deviceType'  
  import {setWechatTitle} from '@/utils/setWechatTitle.js'
  import {getDeviceStatus, changeDeviceStatus} from '@/services/axiosapi'

  import {mapState} from 'vuex'
  import _ from 'lodash'
  import {storeGet,storeSet} from '@/utils/localStorage'
  import {comfort15minsRandomMusicMap} from '@/utils/musicRandomMap'
  export default {
    name: 'Music',
    beforeMount(){
      this.initialState();
    },
    components: {
      DeviceMusicTop,      
      DeviceMusicVolume,
    },
    data(){
      return {
        iconList: [],   // 控制按钮图形集合
        playOption: {}, // 音乐播放接口参数
        recentPlayIdx: 5, // 默认播放musicRandomMap的第5首
        playEndIdx: null,  // 计算音乐播放结束时间的timeout的句柄
        // 音乐暂停使用的
        diffTime: 0,
        isPaused: false,  // 音乐是否被暂停了，（单页面状态，不需要用vuex)
        // 音乐音量
        vol: 0.5,       // 音量默认为0.5
        volUserAdjust: false, // 是否为用户设定
      }
    },
    computed: {
      ...mapState({
        musicStatus: state => _.isEmpty(state.roomControl.Content.Music) ? {} : state.roomControl.Content.Music.Status.Status, // 音乐播放状态，接口获取的数据
        recentPlayMusic: state => state.roomControl.shareDeviceData.musicName, // 最近播放过的音乐
        musicIsPlaying: state => state.roomControl.shareDeviceData.musicIsPlaying,  // 当前是否有音乐正在播放（非暂停／停止状态)
      })
    },
    beforeDestroy(){      
      if(this.playEndIdx) {
        clearTimeout(this.playEndIdx)
      }
    },
    watch: {
      // 查看音乐播放状态，更新界面显示
      'musicStatus.data.isPlaying': function(val){

      },
      // 更新播放Btn状态
      musicIsPlaying(val) {
        console.log(`musicIsPlaying value changed:${val}`)
        this.updatePlayBtnStatus();        
      },

      // 更新音量
      vol(val) {
        if (this.volUserAdjust) {
          this.apiSetVolume()
        }
      },
    },
    methods: {
      initialState(){                
        this.iconList = deviceType[this.$route.params.deviceType];  // 6为音乐
        this.playOption = JSON.parse(storeGet('DeviceControl', 'option'));
        this.refreshMusicStatus();
        this.updatePlayBtnStatus(); // watch 若值再进来之前就变完了，就不会再调用更新函数        
        // 此处写刚进控制器的时候，开关的状态
        setWechatTitle("蓝牙音响控制器");
        document.title = "蓝牙音响控制器";
      },
      
      // 刷新music播放信息
      refreshMusicStatus() {
        let option = this.$route.params.option
        getDeviceStatus(option)
          .then(response => {
            // 后台传递的status字段为JSON.stringfy格式，提取后再存
            let musicResult = response.data.Content;
            musicResult.Status.Status = JSON.parse(musicResult.Status.Status)
            // 音量设置
            this.vol = musicResult.Status.Status.data.volume; // 初始化音量信息
            // 更新歌曲播放信息
            this.$store.dispatch("setDeviceContent", {'Music': musicResult});
            // 更新播放／暂停／停止状态
            this.calcIsPlayingStatus()
          })
          .catch(err => {
            console.log(err);
          })
      },
      // 计算播放／暂停／停止状态，再更新
      calcIsPlayingStatus(){
        if(this.musicStatus.data.isPlaying == 'false') {
          this.$store.dispatch('setSyncDeviceMusicIsPlaying', false)
        } else {
          if(this.musicStatus.message.indexOf('Paused: false') != -1) {
            this.$store.dispatch('setSyncDeviceMusicIsPlaying', true)
            // 缓存歌曲结束时间戳
            var now = new Date().getTime()
            // string to object
            let msgObj = eval('({' + this.musicStatus.message + '})');
            let timeDiff = parseInt((msgObj.Duration - msgObj.Position)/1000);  // 时间差
            let endTime = now + timeDiff;   //计算出的播放结束时间
            var that = this;
            // 定时任务
            if(this.playEndIdx) {
              // 若存在之前的定时器，需要重新设置
              clearTimeout(this.playEndIdx)
              this.playEndIdx = null;
            }
            // 设置定时器
            console.log(`${timeDiff}ms后播放结束`)
            this.playEndIdx = setTimeout(function(){
              that.$store.dispatch('setSyncDeviceMusicIsPlaying', false)
              that.playEndIdx = null;
            }, timeDiff)
            storeSet("SH_RoomControl","musicPlay", {endTime:endTime})
          } else {
            this.$store.dispatch('setSyncDeviceMusicIsPlaying', false)
          }
        }
      },
      
      // 播放暂停按钮状态更新
      updatePlayBtnStatus() {
        if (this.musicIsPlaying) {
          this.iconList[1].name = "roomcontrol/pause";
          this.iconList[1].title = "暂停";
          this.iconList[1].type = "musicPause";
        } else {
          this.iconList[1].name = "roomcontrol/play";
          this.iconList[1].title = "播放";
          this.iconList[1].type = "musicPlay";
        }
      },

      // 控制图标点击事件控制图标点击事件
      iconClick(idx) {        
        switch (idx) {
          // 上一首
          case 0:
            this.musicPlayPrev();
            break;
          // 下一首
          case 2: 
            this.musicPlayNext();
            break;

          // 播放/暂停
          case 1:
            // 再通过watch根据最新状态，触发音乐播放， 这样做需要播放／暂停 同时现实，不区分状态，因为没法实时更新播放状态
            if(this.musicIsPlaying) {
              this.$store.dispatch('setSyncDeviceMusicIsPlaying', false)
              this.musicPausePlay()
            } else {
              if(this.isPaused){  // isPaused
                this.$store.dispatch('setSyncDeviceMusicIsPlaying', true)
                this.musicPausePlay()
              } else {  // 没有任何音乐播放
                this.$store.dispatch('setSyncDeviceMusic', comfort15minsRandomMusicMap[this.recentPlayIdx].displayName)                
                this.playMusic()  // 接口调用
              }
            }
            break;

          default:
            break;
        }
      },

      // 上一首音乐播放
      musicPlayPrev() {        
        // 计算前一首索引
        if (this.recentPlayMusic != '') {        
          let idx = _.findIndex(comfort15minsRandomMusicMap, {displayName:this.recentPlayMusic})
          this.recentPlayIdx = idx == -1 ? this.recentPlayIdx : idx;
        }
        if (this.recentPlayIdx == 0) {
          this.recentPlayIdx = 9
        } else {
          this.recentPlayIdx--
        }

        // 更新vuex
        this.$store.dispatch('setSyncDeviceMusic', comfort15minsRandomMusicMap[this.recentPlayIdx].displayName)        
        this.playMusic()  // 接口调用
      },

      // 下一首音乐播放
      musicPlayNext() {        
        // 计算前一首索引
        if (this.recentPlayMusic != '') {        
          let idx = _.findIndex(comfort15minsRandomMusicMap, {displayName:this.recentPlayMusic})
          this.recentPlayIdx = idx == -1 ? this.recentPlayIdx : idx;
        }
        if (this.recentPlayIdx == 9) {
          this.recentPlayIdx = 0
        } else {
          this.recentPlayIdx++
        }

        // 更新vuex
        this.$store.dispatch('setSyncDeviceMusic', comfort15minsRandomMusicMap[this.recentPlayIdx].displayName)
        this.playMusic()  // 接口调用
      },

      // 音乐播放接口，debounce调用机制
      playMusic: _.debounce(function(){
        // 设置播放内容
        let playName = comfort15minsRandomMusicMap[this.recentPlayIdx].name        
        this.playOption['cmdId'] = '1';
        this.playOption['cmdValue'] = encodeURIComponent(`name=${playName}&folder=001.randomlist`);
        var that = this;
        changeDeviceStatus(this.playOption).then(response => {
            if(response.data.Success){
                console.log(response.data)                
                try{
                  let ret = JSON.parse(response.data.Content)
                  this.vol = parseFloat(ret.data.volume)
                }catch(ex){
                  console.log('vol parseFloat error!!!')
                }
                that.refreshMusicStatus();  // 切新歌后，需要更新状态
            } else {
              console.log('play fail')
            }
        }).catch(err => {
            console.log('err: '+err);
        })
      }, 1500),   // 超时时间同步后台限制频率

      // 暂停／继续命令
      musicPausePlay() {
        this.playOption['cmdId'] = '3';
        this.playOption.cmdValue = 0;
        var that = this;
        changeDeviceStatus(this.playOption).then(response => {
            if(response.data.Success){
                console.log(response.data)
                // 更新状态和定时器
                this.isPaused = !this.isPaused
                // 连续快速按暂停有可能会有问题，（第二次的接口先返回结果）
                if (this.isPaused) {  // 执行了暂停                  
                  let now = new Date().getTime()
                  let endTime = storeGet("SH_RoomControl","musicPlay").endTime
                  let diffTime = endTime - now;
                  console.log(`execute paused: endT:${endTime}, now:${now}, diffTime:${diffTime}`)
                  // 可能会存在误差，导致最后几s时间内判断不准确                  
                  this.diffTime = diffTime                  
                  // 清除之前的定时器
                  clearTimeout(this.playEndIdx)
                  this.playEndIdx = null;                  
                } else {
                  if(this.diffTime > 0) {
                    // 更新缓存
                    let now = new Date().getTime()
                    let endTime = now + this.diffTime
                    storeSet("SH_RoomControl","musicPlay", {endTime:endTime})

                    // 重设定时器
                    var that = this;
                    this.playEndIdx = setTimeout(function(){
                      that.$store.dispatch('setSyncDeviceMusicIsPlaying', false)
                      that.playEndIdx = null;
                    }, this.diffTime)
                  }
                }
            } else {
              console.log('play pause fail')
            }
        }).catch(err => {
            console.log('err: '+err);
        })
      },

      // 监听音量调节
      volumeChangedTo(val) {
        this.volUserAdjust = true;
        this.vol = val/100
      },
      apiSetVolume: _.debounce(function(){
        console.log('APi Set Volume ----')
        this.volUserAdjust = false;
        this.playOption['cmdId'] = '6';
        this.playOption['cmdValue'] = this.vol;
        var that = this;
        changeDeviceStatus(this.playOption).then(response => {
            if(response.data.Success){
                console.log('vol update success')                
            } else {
              console.log('vol update fail')
            }
        }).catch(err => {
            console.log('err: '+err);
        })
      }, 600)
    }
  }
</script>

<style lang="less" scoped>
@import '../../styles/common/themeSettings.less';

  .bg {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
  }

  .currentPlayMusic {
    text-align: center;
    margin: 10px 0 20px 0;
  }
  // 播放控制按钮布局
  .iconItem {
    flex: 1;
    height: 90px;    
    p {
      margin-top: 1em;
    }
    border-top: 1px solid @splitColor;
    border-bottom: 1px solid @splitColor;
    &:nth-child(2) {
      border: 1px solid @splitColor;
    }
  }
  
</style>


