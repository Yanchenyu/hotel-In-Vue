<template>
  <div>
    <div class="outer cus-flexcolumn-center">
      <div class="plus cus-flexrow-center" @click='clickPlus'>
        <icon name="plus" scale="12" class="svgicon" :class="{svgiconGray:num==maxNum}"></icon>
      </div>
      <div class="inner cus-flexrow-center cus-panelColor">{{num}}°</div>
      <div class="minus cus-flexrow-center" @click='clickMinus'>
        <icon name="minus" scale="10" class="svgicon" :class="{svgiconGray:num==miniNum}"></icon>
      </div>
      <div class="miniNum cus-borderColor">{{miniNum}}°</div>
      <div class="maxNum cus-borderColor">{{maxNum}}°</div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {changeDeviceStatus} from '@/services/axiosapi'
  import {storeSet, storeGet} from '@/utils/localStorage'

  export default {
    name: 'DeviceACTop',
    props: {
      deviceStatus: {
        type: Boolean
      },
      temperature: {
        type: Number
      }
    },
    computed: {
      ...mapState({
        num: state => Number(state.roomControl.Content.AC.Temperature),
        miniNum: state => state.roomControl.Content.AC.Commands[1].Min,
        maxNum: state => state.roomControl.Content.AC.Commands[1].Max,
      })
    },
    data(){
      return {
      }
    },
    watch: {},
    methods: {
      clickPlus(){
        if (this.deviceStatus) {
          let option = JSON.parse(storeGet('DeviceControl', 'option'));
          if (this.num < this.maxNum && this.num > this.miniNum-1) {
            let _num = this.num + 1;
            option['cmdId'] = '2';
            option['cmdValue'] = _num;
            changeDeviceStatus(option).then(response => {
              if (response.data.Success) {
                this.$store.dispatch('setACTemperature', _num);
                this.$store.dispatch('setSyncDeviceTemperature', _num)
              }
            }).catch(err => {
              console.log('err: ' + err);
            })
          }
        }
      },
      clickMinus(){
        if (this.deviceStatus) {
          let option = JSON.parse(storeGet('DeviceControl', 'option'));
          if (this.num < this.maxNum+1 && this.num > this.miniNum) {
            let _num = this.num - 1;
            option['cmdId'] = '2';
            option['cmdValue'] = _num;
            changeDeviceStatus(option).then(response => {
              if (response.data.Success) {
                this.$store.dispatch('setACTemperature', _num);
                this.$store.dispatch('setSyncDeviceTemperature', _num)
              }
            }).catch(err => {
              console.log('err: ' + err);
            })
          }
        }

      }
    }
  }
</script>

<style lang="less" scoped>
  .outer {
    width: 192px;
    height: 192px;
    border-radius: 50%;
    border: 2px solid #bfbfbf;
    margin: 80px auto 15px auto;
    position: relative;
  }

  .inner {
    width: 89px;
    height: 89px;
    border-radius: 50%;
    border: 0;
    background-color: #25c0b1;
    font-size: 45px
  }

  .plus {
    // position: absolute;
    // top: 8px;
    margin-bottom: 20px;
  }

  .minus {
    // position: absolute;
    // bottom: 8px;
    margin-top: 20px;
  }

  .miniNum {
    position: absolute;
    bottom: 20px;
    left: -15px;
    font-size: 15px;
  }

  .maxNum {
    position: absolute;
    bottom: 20px;
    right: -15px;
    font-size: 15px;
  }

</style>


