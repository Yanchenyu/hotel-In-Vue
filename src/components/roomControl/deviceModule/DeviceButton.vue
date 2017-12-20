<template>
  <div class="outer cus-flexrow-center">
    <div class="inner cus-small cus-flexrow-center" @click="checkButton">
      <img :src="airCondition" />
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {changeDeviceStatus} from '@/services/axiosapi'
  import {storeSet, storeGet} from '@/utils/localStorage'

  export default {
    name: 'DeviceButton',
    props: {
      status: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapState({
        buttonState: state => state.roomControl.Content.AC.Powered
      }),
      airCondition(){
        return this.buttonState=='1'? '@/../static/images/openAirCondition.png' : '@/../static/images/closeAirCondition.png'
      }
    },
    data(){
      return {

      }
    },
    methods: {
      checkButton(){
        if (this.buttonState == "0") {
          this.open();
        } else {
          this.close();
        }
      },
      open(){
        let option = JSON.parse(storeGet('DeviceControl', 'option'));
        option['cmdId'] = '1';
        option['cmdValue'] = '1';

        changeDeviceStatus(option).then(response => {
          if (response.data.Success) {
            this.$store.dispatch('switchButton', '1');
            this.$store.dispatch('setSyncDeviceACState', true);
            this.$emit("deviceStatus", true);
          }
        }).catch(err => {
          console.log('err: ' + err);
        })

      },
      close(){
        let option = JSON.parse(storeGet('DeviceControl', 'option'));
        option['cmdId'] = '1';
        option['cmdValue'] = '0';
        changeDeviceStatus(option).then(response => {
          if (response.data.Success) {
            this.$store.dispatch('switchButton', '0');
            this.$store.dispatch('setSyncDeviceACState', false);
            this.$emit("deviceStatus", false);
          }
        }).catch(err => {
          console.log('err: ' + err);
        })


      }
    }
  }
</script>

<style lang="less" scoped>
  .outer {
    margin-top: 55px;
  }

  .inner {
    border-radius: 4px;
    text-align: center;
    img {
      width: 50px;
      height: 50px;
    }
  }

</style>


