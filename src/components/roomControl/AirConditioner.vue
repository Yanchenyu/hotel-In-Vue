<template>
  <div class="bg">
    <DeviceACTop :deviceStatus="deviceStatus"></DeviceACTop>
    <DeviceModel :deviceType="deviceType" @clickModule="clickModule" :deviceStatus="deviceStatus"></DeviceModel>
    <DeviceButton  @deviceStatus="changeDeviceType" :status="deviceStatus"></DeviceButton>
  </div>
</template>

<script>
  import DeviceACTop from '@/components/roomControl/deviceModule/DeviceACTop.vue'
  import DeviceModel from '@/components/roomControl/deviceModule/DeviceModel.vue'
  import DeviceButton from '@/components/roomControl/deviceModule/DeviceButton.vue'
  import {deviceType} from '@/utils/deviceType'
  import {typeId} from '@/utils/deviceTypeId'
  import {setWechatTitle} from '@/utils/setWechatTitle.js'
  import {getDeviceStatus} from '@/services/axiosapi'
  export default {
    name: 'AirConditioner',
    beforeMount(){
      this.initialState();

    },
    components: {
      DeviceACTop,
      DeviceModel,
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
              this.$store.dispatch("setDeviceContent", {'AC':response.data.Content});
            }).catch(err => {
              console.log(err);
            })
        let content = this.$store.state.roomControl.Content;
        this.deviceStatus = content.AC.Powered === '1';
        this.deviceType = deviceType[this.deviceModule];
        this.typeId = typeId;
        // 此处写刚进控制器的时候，开关的状态

        setWechatTitle("空调控制器");
        document.title = "空调控制器";
        
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


