<template>
  <div class="bg">
    <DeviceACTop v-if="deviceModule == typeId['Air-conditioner']" :deviceStatus="deviceStatus"></DeviceACTop>
    <DeviceCurtainTop v-if="deviceModule == typeId['Curtain']"></DeviceCurtainTop>
    <DeviceTVTop v-if="deviceModule == typeId['TV']" :deviceStatus="deviceStatus"></DeviceTVTop>
    <DeviceMusicTop v-if="deviceModule == typeId['Music']" :deviceStatus="deviceStatus"></DeviceMusicTop>
    <!--<DeviceMiddleTime></DeviceMiddleTime>-->
    <DeviceModel :deviceType="deviceType" @clickModule="clickModule" :deviceStatus="deviceStatus"></DeviceModel>
    <DeviceMusicVolume v-if="deviceModule == typeId['Music']"></DeviceMusicVolume>
    <DeviceButton v-if="deviceModule == typeId['Air-conditioner'] || deviceModule == typeId['TV']" @deviceStatus="changeDeviceType"
                  :status="deviceStatus"></DeviceButton>
  </div>
</template>

<script>
  import DeviceACTop from '@/components/roomControl/deviceModule/DeviceACTop.vue'
  import DeviceTVTop from '@/components/roomControl/deviceModule/DeviceTVTop.vue'
  import DeviceCurtainTop from '@/components/roomControl/deviceModule/DeviceCurtainTop.vue'
  import DeviceMusicTop from '@/components/roomControl/deviceModule/DeviceMusicTop.vue'
  // import DeviceMiddleTime from '@/components/roomControl/deviceModule/DeviceMiddleTime.vue'
  import DeviceModel from '@/components/roomControl/deviceModule/DeviceModel.vue'
  import DeviceMusicVolume from '@/components/roomControl/deviceModule/DeviceMusicVolume.vue'
  import DeviceButton from '@/components/roomControl/deviceModule/DeviceButton.vue'
  import {deviceType} from '@/utils/deviceType'
  import {typeId} from '@/utils/deviceTypeId'
  import {setWechatTitle} from '@/utils/setWechatTitle.js'
  import {getDeviceStatus} from '@/services/axiosapi'
  export default {
    name: 'deviceControl',
    beforeMount(){
      this.initialState();

    },
    components: {
      DeviceACTop,
      DeviceTVTop,
      DeviceCurtainTop,
      DeviceMusicTop,
      // DeviceMiddleTime,
      DeviceModel,
      DeviceMusicVolume,
      DeviceButton
    },
    data(){
      return {
        deviceType: [],
        typeId: {},
        deviceStatus: false,
        deviceModule: this.$route.params.deviceType,
        option: this.$route.params.option
      }
    },
    methods: {
      initialState(){
        let option = this.option;
        getDeviceStatus(option).then(response => {
              this.$store.dispatch("setDeviceContent", response.data.Content);
            }).catch(err => {
              console.log(err);
            })
        let content = this.$store.state.roomControl.Content;
        this.deviceStatus = content.Powered == '1' ? true : false;
        this.deviceType = deviceType[this.deviceModule];
        this.typeId = typeId;
        // 此处写刚进控制器的时候，开关的状态


        switch (this.deviceModule) {
          case typeId['TV']:
            setWechatTitle("电视控制器");
            document.title = "电视控制器";
            break;
          case typeId['Curtain']:
            setWechatTitle("窗帘控制器");
            document.title = "窗帘控制器";
            break;
          case typeId['Air-conditioner']:
            setWechatTitle("空调控制器");
            document.title = "空调控制器";
            break;
          case typeId['Music']:
            setWechatTitle("蓝牙音响控制器");
            document.title = "蓝牙音响控制器";
            break;
          default:
            break;
        }
      },
      changeDeviceType(val){
        this.deviceStatus = val;
        var newType = this.deviceType,
          otherType = [];
        if (!val) {
          newType.forEach((item) => {
            item.state = val;
            otherType.push(item)
          });
          this.deviceType = otherType
        }

      },
      clickModule(val){
        this.deviceType = val;
      }
    }
  }
</script>

<style lang="less" scoped>
  .bg {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
  }
</style>


