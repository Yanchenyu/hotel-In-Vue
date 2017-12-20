<template>
  <div class="bg">
    <DeviceCurtainTop></DeviceCurtainTop>
    <DeviceModel :deviceType="deviceType" @clickModule="clickModule" :deviceStatus="deviceStatus"></DeviceModel>
  </div>
</template>

<script>
  import DeviceCurtainTop from '@/components/roomControl/deviceModule/DeviceCurtainTop.vue'
  import DeviceModel from '@/components/roomControl/deviceModule/DeviceModel.vue'
  import {deviceType} from '@/utils/deviceType'
  import {typeId} from '@/utils/deviceTypeId'
  import {setWechatTitle} from '@/utils/setWechatTitle.js'
  import {getDeviceStatus} from '@/services/axiosapi'
  export default {
    name: 'Curtain',
    beforeMount(){
      this.initialState();      
    },
    components: {
      DeviceCurtainTop,
      DeviceModel,
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
              this.$store.dispatch("setDeviceContent", {'Curtain':response.data.Content});
            }).catch(err => {
              console.log(err);
            })
        this.deviceType = deviceType[this.deviceModule];
        this.typeId = typeId;
        // 此处写刚进控制器的时候，开关的状态
        setWechatTitle("窗帘控制器");
        document.title = "窗帘控制器";
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


