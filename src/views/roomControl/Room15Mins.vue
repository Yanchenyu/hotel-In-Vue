<template>
  <div class="comfortWrap">
    <group gutter="10px">
      <x-switch title="『舒适体验』自主学习" v-model="smartStudy" :disabled="dataLoadCount < 2"></x-switch>
    </group>
    <div class="desc cus-normal cus-ftColorBlack3">
      <span>
        {{descText}}
      </span>
      <span>
        『舒适体验』是一个自主学习的智慧系统，它能够不断地依赖你入住智慧房间的调整来找到你感觉舒适的环境。
      </span>
      <span>
        在每一次你入住智慧房间的时候，你只需点击“舒适体验”，去快速获得一个舒适的室内环境。
      </span>
    </div>
    <div class="cus-normal cus-ftColorBlack ctitle ">
      舒适度
    </div>
    <div class="controlArea cus-normal ">
      <!-- 第1行 空调调节 -->
      <div class="ctlrow cus-flexrow">
        <span style="display: inline-block; width: 44px; height: 44px;  margin-right: 15px;">
          <icon name="roomcontrol/airconditioner0807" scale ="24" :class="{svgicon: userAdjustEnable, svgiconGrayInvalid:!userAdjustEnable }" ></icon>
        </span>
        <!-- 使用span包裹的目的是为了增大触控面积 -->
        <span class="incTouchArea tempMinus cus-flexrow-center" @click="temperatureDesc">
          <icon name="minus" scale ="12" :class="{svgicon: tempVal>19&&userAdjustEnable , svgiconGrayInvalid: tempVal == 16||!userAdjustEnable }" ></icon>
        </span>
        <span id="temperature" :class="{smartStudy:!userAdjustEnable}">{{tempVal}}℃</span>
        <span class="incTouchArea tempPlus cus-flexrow-center" @click="temperatureAdd">
          <icon name="plus" scale ="12" :class="{svgicon: tempVal<30&&userAdjustEnable, svgiconGrayInvalid: tempVal == 30||!userAdjustEnable }"  ></icon>
        </span>
        <span  class="rightFlex cus-flexrow" @click="adjustwindSpeed">
          <icon name="windy" scale="12" :class="{svgiconBlack:userAdjustEnable, svgiconGrayInvalid:!userAdjustEnable}"></icon>
          <span style="margin-left: 5px;" :class="{smartStudy:!userAdjustEnable}">{{speedDesc}}</span>
        </span>
      </div>
      <!-- 第2行 光线调节 -->
      <div class="ctlrow cus-flexrow">
        <span style="display: inline-block; width: 44px; height: 44px;  margin-right: 15px;">
          <icon name="roomcontrol/bright0807" scale ="24" :class="{svgicon:userAdjustEnable, svgiconGrayInvalid:!userAdjustEnable}" ></icon>
        </span>
        <div class="lightsubrow" :class="{smartStudy:!userAdjustEnable}">
          <ul class="cus-flexrow">
            <li @click="lightSelect(2)"><i :class="{on: lightIdx==2}"></i></li>
            <li @click="lightSelect(3)"><i :class="{on: lightIdx==3}"></i></li>
            <li @click="lightSelect(4)"><i :class="{on: lightIdx==4}"></i></li>
            <li @click="lightSelect(5)"><i :class="{on: lightIdx==5}"></i></li>
          </ul>
          <ul class="cus-flexrow cus-normal cus-ftColorBlack">
            <li @click="lightSelect(2)"><i :class="{on: lightIdx==2}">睡眠</i></li>
            <li @click="lightSelect(3)"><i :class="{on: lightIdx==3}">微光</i></li>
            <li @click="lightSelect(4)"><i :class="{on: lightIdx==4}">中度</i></li>
            <li @click="lightSelect(5)"><i :class="{on: lightIdx==5}">明亮</i></li>
          </ul>
        </div>
      </div>

      <!-- 窗帘控制 -->
      <!-- TODO 暂时屏蔽窗帘功能(20170911 会议决定，先收集用户对窗帘操作的数据，分析后再考虑能否添加), -->
      <div class="ctlrow cus-flexrow" v-if="false" :class="{smartStudy:!userAdjustEnable}">
        <span style="display: inline-block; width: 44px; height: 44px;  margin-right: 15px;">
          <!--<icon name="roomcontrol/curtain0807" scale ="24" class="svgicon" ></icon>-->
          <icon name="roomcontrol/curtain0807" scale ="24" :class="{svgicon:userAdjustEnable, svgiconGrayInvalid:!userAdjustEnable}" ></icon>
        </span>
        <div style="flex: 1;">
          <group gutter="0px">
            <x-switch title="窗帘状态" v-model="closeCurtain" :disabled="!userAdjustEnable"></x-switch>
          </group>
        </div>
      </div>

      <!-- 音乐播放 -->
      <div class="ctlrow cus-flexrow" :class="{smartStudy:!userAdjustEnable}" @click="popMusicDetail">
        <span style="display: inline-block; width: 44px; height: 44px;  margin-right: 15px;">
          <icon name="roomcontrol/music0807" scale ="24"  :class="{svgicon:userAdjustEnable, svgiconGrayInvalid:!userAdjustEnable}" ></icon>
        </span>
          <div style="flex: 1;">
            <group gutter="0px">
              <cell :title="musicName" is-link></cell>
            </group>
          </div>
      </div>
    </div>

    <!-- 音乐选择 -->
    <div v-transfer-dom>
      <popup v-model="showMusicSelect" width="100vw" height="100vh">
        <MusicSelect :musicList="musicList" v-on:confirmMusicSelect="confirmMusicSelect"></MusicSelect>
      </popup>
    </div>
  </div>

</template>

<script>
import {TransferDomDirective as TransferDom, XSwitch, Group, Cell, Popup} from 'vux'
import MusicSelect from '@/components/roomControl/MusicSelect'
import {comfort15minsRandomMusicMap} from '@/utils/musicRandomMap'
import {
  comfortableStudyStatusGet,  // 自主学习开关获取
  comfortableStudyStatusSet,  // 自主学习开关设置
  comfortableSettingsGet,   // 设备数据获取
  comfortableDeviceSet,     // 设备控制
} from '@/services/axiosapi'
import _ from 'lodash'
import {storeGet, storeSet} from '@/utils/localStorage'
import {mapState} from 'vuex'

var speedDescription = ["自动", "低速", "中速", "高速"]
export default {
  name: 'Room15Mins',
  directives: {
    TransferDom
  },
  components: {
    XSwitch, Group, Cell, Popup,
    MusicSelect
  },
//  name: 'Room15Mins',
  beforeMount(){
    // 数据初始化
    this.loadInitialData()
  },

  activated(){
    //TODO
  },
  data(){
    return  {
      smartStudy: false,
      //tempVal: -1,    // 温度方位
      //lightIdx: -1,  // 光线调节, 0 关 1 开 2，3，4，5 光线强度
      //closeCurtain: false,  // 是否关闭窗帘   // API true -> 0是开，false -> 1是关
      //windSpeed: 2,     // 0： 自动 1：高速 2:中速 3: 低速 (suyu不支持自动设定)
      //musicName: '',

      // 接口数据加载标识
      dataLoading: false,
      dataLoadCount: 0,

      // TODO add loaded, 数据为完成加载时，提示，并且不让操作界面
      // 用户信息
      userInfo: {},

      // 音乐播放
      musicList: [],    // 音乐列表
      showMusicSelect: false,   // 音乐选择弹层
      musicSetValue: '',  // 用于存储到数据库的音乐信息
    }
  },
  methods:{
    // 房间数据 初始化
    loadInitialData(){
      console.log(this.$route.query.isReset)
      // 缓存用户数据提取
      this.userInfo = storeGet("SH_RoomControl","VerifyInfo")?storeGet("SH_RoomControl","VerifyInfo"):{};
      this.musicList = comfort15minsRandomMusicMap

      // 判断是否触发十五分钟设定
      if(this.$route.query.isReset) {
        if(!_.isEmpty(this.userInfo)) {
          console.log('...load data')
          this.loadSmartStudy();
          this.loadSettingData();
        } else {
          console.log('...no data')
        }
      } else {
        this.smartStudy = storeGet("SH_RoomControl","smartStudy") ==  true;
        this.dataLoadCount = 2;
      }
    },
    // 学习开关获取
    loadSmartStudy(){
      let option = {
        memberId: this.userInfo.MemberId
      }
      comfortableStudyStatusGet(option)
        .then(response => {
          console.log(response)
          if(response.data.Success) {
            // 数据load标识
            this.dataLoading = true;
            this.dataLoadCount++;
            this.smartStudy = response.data.Content;
          } else {
          }
        })
        .catch(err => {
        })
    },
    // 获取偏好设定数据
    loadSettingData() {
      let option = {
        memberId: this.userInfo.MemberId,
        RoomId: this.userInfo.RoomId
      }
      comfortableSettingsGet(option)
        .then(response => {
          console.log('loadSettingData.... ')
          console.log(response)
          if(response.data.Success) {
            // 数据load标识+1
            this.dataLoading = true;
            this.dataLoadCount++;

            response.data.Content.forEach( item => {
              if(item.KeyName == 'Temperature') {   // TODO 替换成typeKey
                this.$store.dispatch('setSyncDeviceTemperature', parseInt(item.IndicateValue))
              } else if(item.KeyName == 'Wind') {
                this.$store.dispatch('setSyncDeviceWind', parseInt(item.IndicateValue))
              } else if(item.KeyName == "Light") {
                this.$store.dispatch('setSyncDeviceLight', parseInt(item.IndicateValue))
              } else if(item.KeyName == 'Curtain') {
                // TODO check 是否统一为 10-0 percent
                this.$store.dispatch('setSyncDeviceCurtain', item.IndicateValue == 0)
              } else if(item.KeyName == 'Music') {
                this.musicSetValue = item.IndicateValue;
                this.$store.dispatch('setSyncDeviceMusic', item.IndicateValue.split('|')[0])
                this.$store.dispatch('setSyncDeviceMusicIsPlaying', true)
              }
            })
          } else {
          }
        })
        .catch(err => {
        })
    },

    // 光线设定
    lightSelect(idx) {
      if(!this.userAdjustEnable) {
        return;
      }
      this.dataLoading = false;
      this.$store.dispatch('setSyncDeviceLight', idx)
    },
    // 温度调节 -
    temperatureDesc() {
      if(!this.userAdjustEnable) {
        return;
      }
      this.dataLoading = false;
      let temperature = this.tempVal

      if (--temperature < 19) {
        temperature = 19;
        //this.utils.toast({msg: "温度不能再低了"});
      }
      this.$store.dispatch('setSyncDeviceTemperature', temperature)
    },
    // 温度调节 +
    temperatureAdd() {
      if(!this.userAdjustEnable) {
        return;
      }
      this.dataLoading = false;
      let temperature = this.tempVal
      if (++temperature > 30) {
        temperature = 30;
        //this.utils.toast({msg: "温度不能再高了"});
      }
      this.$store.dispatch('setSyncDeviceTemperature', temperature)
    },
    // 风速调节
    adjustwindSpeed() {
      if(!this.userAdjustEnable) {
        return;
      }
      this.dataLoading = false;
      let windspeed = this.windSpeed;
      if(++windspeed > 3) {
        windspeed = 0;
      }
      // suyu不支持 自动速 0
      if(windspeed == 0) {
        windspeed = 1;
      }
      this.$store.dispatch('setSyncDeviceWind', parseInt(windspeed))
    },
    // 打开音乐选择列表页
    popMusicDetail(){
      if(!this.userAdjustEnable) {
        return;
      }
      this.showMusicSelect = true
    },

    // ------ 调节接口 ------
    // 自主学习开关
    smartStudyAPISet: _.debounce(function() {
      console.log('_debounce set smartStudyAPISet', this.smartStudy)

      let option = {
        memberId: this.userInfo.MemberId,
        enable: this.smartStudy
      }
      comfortableStudyStatusSet(option)
        .then(response => {
          if(response.data.Success == true) {
            // update success
          } else {
            this.utils.toast({msg: "设置失败，请稍后再试"})
            // TODO add more to recover correct v-model smartStudy value
          }
        }).catch(err => {
          this.utils.showNetError();
        })
    }, 500),
    // 温度
    APISetTemp: _.debounce(function() {
      console.log('_debounce set APISetTemp', this.tempVal)
      let option = {
        memberId: this.userInfo.MemberId,
        RoomId: this.userInfo.RoomId,
        KeyName: 'Temperature',
        Value: this.tempVal
      }
      this.deviceControlSet(option);
    }, 500),
    // 风速
    APISetWindSpeed: _.debounce(function() {
      console.log('_debounce set APISetWindSpeed', this.windSpeed)
      let option = {
        memberId: this.userInfo.MemberId,
        RoomId: this.userInfo.RoomId,
        KeyName: 'Wind',
        Value: this.windSpeed
      }
      this.deviceControlSet(option);
    }, 500),
    // 光线
    APISetLight: _.debounce(function() {
      console.log('_debounce set APISetLight', this.lightIdx)
      let option = {
        memberId: this.userInfo.MemberId,
        RoomId: this.userInfo.RoomId,
        KeyName: 'Light',
        Value: this.lightIdx
      }
      this.deviceControlSet(option);
    }, 500),
    // 窗帘
    APISetCurtain: _.debounce(function() {
      console.log('_debounce set APISetCurtain', this.closeCurtain)
      let option = {
        memberId: this.userInfo.MemberId,
        RoomId: this.userInfo.RoomId,
        KeyName: 'Curtain',
        Value: this.closeCurtain?0:1
      }
      this.deviceControlSet(option);
    }, 500),
    // 音乐
    APISetMusic: _.debounce(function() {
      console.log('_debounce set APISetMusic', this.musicName)
      let option = {
        memberId: this.userInfo.MemberId,
        RoomId: this.userInfo.RoomId,
        KeyName: 'Music',
        Value: this.musicSetValue,  // 音乐信息拼接值
      }
      this.deviceControlSet(option);
    }, 500),

    // 设备控制restAPI请求复用
    deviceControlSet(option){
      comfortableDeviceSet(option)
        .then(response => {
          if(response.data.Success == true) {
            // update success
          } else {
            this.utils.toast({msg: "设置失败，请稍后再试"})
            // TODO add more to recover correct v-model smartStudy value
          }
        })
        .catch(err => {
          this.utils.showNetError();
        })
    },

    // ------ 关闭音乐选择 ------
    confirmMusicSelect(musicSetValue, musicName){
      if (musicName != '') {
        this.dataLoading = false;
        this.musicSetValue = musicSetValue;
        //this.musicName = musicName;
        this.$store.dispatch('setSyncDeviceMusic', musicName)
        this.$store.dispatch('setSyncDeviceMusicIsPlaying', true) // 可以考虑加到借口调用的地方
      }
      this.showMusicSelect = false;
    },

  },
  computed: {
    // 描述文字
    descText(){
      if(!this.smartStudy) {
        return "开启后『舒适体验』通过学习你的设置为你找到最佳舒适度。"
      } else {
        return "关闭后你可以自行设置舒适度。"
      }
    },

    // 风速对应文字
    speedDesc() {
//      return speedDescription[this.windSpeed]
      return '风速'
    },

    // 用户操作允许条件
    userAdjustEnable() {
      return !(this.smartStudy || this.dataLoadCount < 2)
    },
    ...mapState({
      tempVal: state => state.roomControl.shareDeviceData.temperature,
      lightIdx: state => state.roomControl.shareDeviceData.lightIdx,
      closeCurtain: state => state.roomControl.shareDeviceData.isCurtainTobeClosed,
      windSpeed: state => state.roomControl.shareDeviceData.windSpeed,
      musicName: state => state.roomControl.shareDeviceData.musicName,
    })
  },
  watch: {
    //comfortableStudyStatusSet
    // 自主学习开关触发
    smartStudy(val){
      storeSet("SH_RoomControl","smartStudy", val)
      // TODO 有没有好的办法，限制数据初始化导致的值变化，避免此情况触发接口设置
      // TODO v-model 拆分成 @click事件
      //if(this.dataLoadCount == 2)
      this.smartStudyAPISet()
    },
    // 设备设置
    windSpeed(val) {
      if(!this.dataLoading) { // 用户操作的情况下，才允许接口调用
        this.APISetWindSpeed(this.windSpeed)
      }
    },
    tempVal(val) {
      if(!this.dataLoading) { // 用户操作的情况下，才允许接口调用
        this.APISetTemp()
      }
    },
    lightIdx(val) {
      if(!this.dataLoading) { // 用户操作的情况下，才允许接口调用
        this.APISetLight()
      }
    },
    closeCurtain(val) {
      if(!this.dataLoading) { // 用户操作的情况下，才允许接口调用
        this.APISetCurtain()
      }
    },
    musicName(val) {
      if(!this.dataLoading) { // 用户操作的情况下，才允许接口调用
        this.APISetMusic()
      }
    },
  }
}
</script>
<style lang="less" scoped>
  @import "../../styles/common/themeSettings";
  @invalidThemeColor:#92dfd8;
  /* 文字描述 */
  .desc {
    padding: 7px 10px;
    line-height: 1.5em;
    span{
      display: block;
      &:first-child{
        margin-bottom: 13px;
      }
      &:nth-child(2)
      {
        margin-bottom:3px;
      }
    }
  }

  /* 控制标题 */
  .ctitle {
    padding-left:10px;
    margin-top:17px; /* 30 - 10 - 3*/
    margin-bottom:7px;
  }
  /* 控制部分 */
  @rowheight:64px;
  .controlArea {
    background-color: white;

    /* 每一行的样式 */
    .ctlrow {
      height:@rowheight;
      margin-left:10px;
      padding-right: 10px;
      border-bottom: 1px solid @splitColor;
      &:last-child{
        border-bottom:none;
      }
      align-items: center;
      span {
        display: inline-block;
      }
      /* span inline-block 会覆盖cus-flexrow*/

      /* smartStudy开关打开时， 所有字体默认灰色#ccc */
      .smartStudy {
        color:@ftColorGray;
      }
      /* 第一行 温度调节 */
      span.rightFlex {
        display: inline-flex;
        height: @rowheight;
      }
      .rightFlex {
        flex: 1;
        align-items: center;
        justify-content: flex-end;
      }
      .incTouchArea {
        display: flex;
        height: @rowheight;

        &.tempMinus {
          padding-right:25px;
        }
        &.tempPlus {
          padding-left:25px;
          padding-right: 25px;
        }
      }
      #temperature {
        font-size: 28px;
        color: @ftColorBlack;
        &.smartStudy {
          color: @ftColorGray;
        }
      }

      /* 第二行 光线调节 */
      .lightsubrow {
        flex: 1;
        &>ul {
          li {
            display: inline-flex;
            align-items: center;
            i.on {
              color: @themeColor;
            }
          }
          li:nth-child(1) {
            flex:5;
          }
          li:nth-child(2) {
            flex:8;
          }
          /* 第二行 第2，3个文字偏移*/
          &:nth-child(2)>li:nth-child(2),&:nth-child(2)>li:nth-child(3) {
            position: relative;
            left:-5px;
          }
          li:nth-child(3) {
            flex:8;
          }
          li:nth-child(4) {
            flex:5;
            justify-content: flex-end;
          }
        }

        &>ul:first-child {
          background: linear-gradient(to right, @themeColor, @themeColor) no-repeat center center;
          background-size: 100% 2px;
          margin-bottom: 3px;
          li {
            i {
              display: inline-block;
              width: 12px;
              height: 12px;
              border: 1px solid #ccc;
              border-radius:7px;
              background-color: white;
            }
            i.on {
              width: 14px;
              height: 14px;
              border: 1px solid @themeColor;
              border-radius:8px;
              background-color: @themeColor;
            }
          }
        }

        // 灰化时的设定
        &.smartStudy>ul {
          color: @ftColorGray;
          li {
            i.on {
              color: @invalidThemeColor;
            }
          }
        }
        &.smartStudy>ul:first-child {
          background: linear-gradient(to right, @invalidThemeColor, @invalidThemeColor) no-repeat center;
          background-size: 100% 2px;
          li {
            i {
              background-color: @ftColorGray;
            }
            i.on {
              border: 1px solid @invalidThemeColor;
              background-color: @invalidThemeColor;
            }
          }
        }
      }

      /* 第4行 音乐播放 */
    }

    /* 第三行，窗帘控制，覆盖vux样式 */
    .ctlrow .weui-cell {
      padding-left:0;
      padding-right:0;
      font-size:16px;
    }
    .ctlrow.smartStudy .weui-cell {
      color: @ftColorGray;
    }

  }
</style>
