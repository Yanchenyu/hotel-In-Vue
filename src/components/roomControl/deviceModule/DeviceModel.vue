<template>
  <div class="outer cus-flexwrap">
    <div class="inner cus-flexcolumn-center" v-for="(item,idx) in deviceModule" @click='handleClick(idx+1)'
         @touchstart="touchstart" @touchend="touchend">
      <div style="height:14px"></div>
      <icon :name="item.name" :scale="item.size" :ref="item.type"
            :class="{'iconBefore': idx+1!=workMode && buttonState!='1','iconAfter': idx+1==workMode && buttonState=='1'}"></icon>
      <p class="posiOut cus-small cus-ftColorBlack3">{{item.title}}</p>
      <div class="windySpeed cus-themeColor" v-if="item.type=='ACWindy'" v-show="false">{{4 - speed}}X</div>
      <div class="blog" :title='item.type'></div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {changeDeviceStatus} from '@/services/axiosapi'
  import {storeSet, storeGet} from '@/utils/localStorage'
  import {deviceTypes} from '@/utils/roomControl'

  export default {
    name: 'DeviceModel',
    props: {
      deviceType: {
        type: Array
      },
      deviceStatus: {
        type: Boolean
      }
    },
    beforeMount(){
      if (this.$store.state.roomControl.Content.AC.VentilationSpeed == null) {
        this.$store.dispatch('setACWindSpeed', 3);
      }
      ;
    },
    computed: {
      ...mapState({
        speed: state => Number(state.roomControl.Content.AC.VentilationSpeed),
        workMode: state => state.roomControl.Content.AC.WorkMode,
        buttonState: state => state.roomControl.Content.AC.Powered,
      })
    },
    data(){
      return {
        deviceModule: this.deviceType,
        roomDeviceIndex: this.$store.state.roomControl.currentRoomDeviceIdx,
        deviceMode: this.$store.state.roomControl.Content.AC.WorkMode,        
      }
    },
    methods: {
      touchstart(e){
        let refs = this.$refs;
        let title = e.target.title;
        let ref = refs[title];
        let classList = ref[0].$el.classList;
        if (this.$store.state.roomControl.currentRoomDeviceIdx == '4') {
          classList.remove('iconBefore');
          classList.add('iconAfter');
        }
      },
      touchend(e){
        let refs = this.$refs;
        let title = e.target.title;
        let ref = refs[title];
        let classList = ref[0].$el.classList;
        if (this.$store.state.roomControl.currentRoomDeviceIdx == '4') {
          classList.remove('iconAfter');
          classList.add('iconBefore');
        }
      },
      handleClick(idx){
        let option = JSON.parse(storeGet('DeviceControl', 'option'));
        if (this.roomDeviceIndex == deviceTypes.AIR_CONDITIONER) {
          // 表示当前为空调设备界面
          if (idx != this.deviceMode) {
            if (idx == '3') {
              option['cmdId'] = '4';
              let _speed = this.speed;
              _speed = _speed > 1 ? _speed - 1 : 3;
              option['cmdValue'] = _speed;
              changeDeviceStatus(option).then(response => {
                if (response.data.Success) {
                  this.$store.dispatch('setACWindSpeed', _speed);
                }
              }).catch(err => {
                console.log('err: ' + err);
              })
            } else {
              option['cmdId'] = '3';
              option['cmdValue'] = idx;
              changeDeviceStatus(option).then(response => {
                if (response.data.Success) {
                  this.$store.dispatch('setACMode', idx);
                  this.deviceMode = idx;
                }
              }).catch(err => {
                console.log('err: ' + err);
              })
            }

          }
        } else if (this.roomDeviceIndex == deviceTypes.CURTAIN) {
          //当前为窗帘设备界面
          switch (idx) {
            case 1: // 开
              option['cmdValue'] = 0;
              break;
            case 2: // 暂停
              option['cmdValue'] = 2;
              break;
            case 3: // 关
              option['cmdValue'] = 1;
              break;
            default:
              break;
          }
          ;
          option['cmdId'] = '1';

          changeDeviceStatus(option).then(response => {
            if (response.data.Success) {
              this.$store.dispatch('setCurtainState', idx - 1);

              // 状态同步，此处关闭，外面则变成点击打开
              if(idx != 2) {
                this.$store.dispatch('setSyncDeviceCurtain',!option['cmdValue'])
              }
            }
          }).catch(err => {
            console.log('err: ' + err);
          })
        } else if (this.roomDeviceIndex == deviceTypes.MUSIC_SYSTEM) {
          //当前为蓝牙音箱设备界面
          // 不在此处实现
        }
      },

      // ACCold(refs){
      //     //制热和制冷模式不能同时开启
      //     let ref =  refs['ACHot'];
      //     let classList = ref[0].$el.classList;
      //     if(classList.contains('iconAfter')){
      //         classList.remove('iconAfter');
      //         classList.add('iconBefore');
      //     };

      // },
      // ACHot(refs){
      //     let ref =  refs['ACCold'];
      //     let classList = ref[0].$el.classList;
      //     if(classList.contains('iconAfter')){
      //         classList.remove('iconAfter');
      //         classList.add('iconBefore');
      //     };
      // },
      // ACWindy(classList){
      //     if(this.speed == 1||this.speed==2){
      //         classList.remove('iconAfter');
      //     }
      //     this.speed = this.speed<3 ? this.speed+1 : 1;
      // },
      // curtainOpen(refs){
      //     let curtainClose =  refs['curtainClose'];
      //     let classListClose = curtainClose[0].$el.classList;
      //     if(classListClose.contains('iconAfter')){
      //         classListClose.remove('iconAfter');
      //         classListClose.add('iconBefore');
      //     };
      //     let curtainPause =  refs['curtainPause'];
      //     let classListPause = curtainPause[0].$el.classList;
      //     if(classListPause.contains('iconAfter')){
      //         classListPause.remove('iconAfter');
      //         classListPause.add('iconBefore');
      //     };
      // },
      // curtainPause(refs){
      //     let curtainClose =  refs['curtainClose'];
      //     let classListPause = curtainClose[0].$el.classList;
      //     if(classListPause.contains('iconAfter')){
      //         classListPause.remove('iconAfter');
      //         classListPause.add('iconBefore');
      //     };
      //     let curtainOpen =  refs['curtainOpen'];
      //     let classListOpen = curtainOpen[0].$el.classList;
      //     if(classListOpen.contains('iconAfter')){
      //         classListOpen.remove('iconAfter');
      //         classListOpen.add('iconBefore');
      //     };
      // },
      // curtainClose(refs){
      //     let curtainOpen =  refs['curtainOpen'];
      //     let classListOpen = curtainOpen[0].$el.classList;
      //     if(classListOpen.contains('iconAfter')){
      //         classListOpen.remove('iconAfter');
      //         classListOpen.add('iconBefore');
      //     };
      //     let curtainPause =  refs['curtainPause'];
      //     let classListPause = curtainPause[0].$el.classList;
      //     if(classListPause.contains('iconAfter')){
      //         classListPause.remove('iconAfter');
      //         classListPause.add('iconBefore');
      //     };
      // },
      // TVMenu(){

      // },
      // TVSilence(){

      // },
      // TVBack(){

      // },
    }

  }
</script>

<style lang="less" scoped>
  .outer {
    width: 100%;
    height: 90px;
    border-bottom: 1px solid #e0dfdd;
    border-top: 1px solid #e0dfdd;
    margin-top: 50px;
    align-items: center;
    justify-content: space-around;
  }

  .inner {
    display: inline-block;
    text-align: center;
    width: 33%;
    height: 100%;
    border-right: 1px solid #e0dfdd;
    position: relative;
  }

  .inner:last-child {
    border: 0;
  }

  .blog {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .iconBefore {
    color: #353535;
  }

  .iconAfter {
    color: #25c0b1;
  }

  .windySpeed {
    display: inline-block;
    position: absolute;
    top: 13px;
    width: 14px;
    height: 8px;
    text-align: center;
    line-height: 8px;
    font-size: 8px;
    border-radius: 8px;
    border: 1px solid #fff;
    background-color: #353535;
  }

</style>


