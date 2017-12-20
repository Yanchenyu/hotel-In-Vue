<template>
  <div>
    <!-- 视屏介绍 -->
    <div class="topVideo"></div>
    <div class="smartEnergy">
      <div class="cus-flexrow cus-normal itemDesc" style="align-items:center">
        <icon name="roomcontrol/list-energy1" scale="22" class="svgicon energyIcon"></icon>
        <div class="cus-normal cus-ftColorBlack">我的智慧能量{{smartEnergy}}</div>
        <!--<div class="txtcontent cus-flexcolumn-center">

        </div>-->
        <div style="width:1px; height:44px;"></div>
      </div>
    </div>
    <!-- 设备列表 -->
    <div class="deviceList" v-if="isAppleDisable()">
      <div v-for="(item,idx) in devices">
        <div class="cus-flexrow cus-normal itemDesc" @click="deviceJmp(item.DeviceTypeId,item.Id)">
          <icon :name="!!getImgIcons(item.DeviceTypeId) ? getImgIcons(item.DeviceTypeId).icon : getImgIcons(3).icon"
                :scale="!!getImgIcons(item.DeviceTypeId) ? getImgIcons(item.DeviceTypeId).size : getImgIcons(3).size"
                class="svgicon"></icon>
          <div>{{item.Name}}</div>
          <icon name="raw-more" scale="2.6" class="svgiconGray "></icon>
        </div>
        <div class="thinLine"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import {fetchroomDeviceList, getDeviceStatus} from '@/services/axiosapi'
  import {deviceIcons} from '@/utils/roomControl'
  import {typeId} from '@/utils/deviceTypeId'
  import {mapState} from 'vuex'
  import {storeSet, storeGet} from '@/utils/localStorage'
  import _ from 'lodash'
  export default {
    name: 'ControlDeviceList',
    beforeMount() {
      this.loading = true;
      this.userInfo = storeGet("SH_RoomControl","VerifyInfo")?storeGet("SH_RoomControl","VerifyInfo"):{};

      if (!_.isEmpty(this.userInfo)) {
        this.loadDeviceList()        
      } else {
        this.$router.push({
          name: 'roomcontrol'
        })
      }
    },
    data () {
      return {
        devices: [],
        userInfo: {}
      }
    },
    methods: {
      // 接口请求设备列表
      loadDeviceList: function () {
        let params = {
          roomId: this.userInfo.RoomId
          // roomId: 'ce448750-2d2e-49b1-a8eb-a81d82a41db1'
        };
        fetchroomDeviceList(params).then(response => {
          console.log('fetchroomDeviceList', response)
          if (response.data.Success == true) {
            this.devices = response.data.Content
          }
        })
          .catch(err => {
            //alert('fetchroomDeviceList err:' + err)
            this.utils.showNetError();
          })
      },

      deviceJmp (DeviceTypeId, Id) {
        let roomId = this.userInfo.RoomId;
        // let roomId = 'ce448750-2d2e-49b1-a8eb-a81d82a41db1';
        let deviceId = Id;
        let option = {
          'deviceId': deviceId,
          'roomId': roomId
        };
        var userInfo = storeGet("SH_RoomControl","VerifyInfo");
        let options = {
          "MemberId": userInfo.MemberId,
          "Id": Id
        }
        storeSet('DeviceControl', 'option', JSON.stringify(options));
        // let isTrue = idx == '4' || idx == '9' || idx == '6' ? true : false;
        let params = {
                'option': option,
                'deviceType': DeviceTypeId,
                'roomId': roomId,
                'deviceId': deviceId
        };
        this.$store.dispatch('getCurrentRoomIdx', DeviceTypeId);
        // let isTrue = DeviceTypeId == typeId['Curtain'] || DeviceTypeId == typeId['Air-conditioner'] || DeviceTypeId == typeId['Music'];
        // if (isTrue) {
          
        //   this.$router.push({
        //       name: 'DeviceControl',
        //       params: params
        //     });
        // };

        if (DeviceTypeId == typeId['Curtain']) {
          this.$router.push({
              name: 'Curtain',
              params: params
            });
        } else if (DeviceTypeId == typeId['Air-conditioner']) {
          this.$router.push({
              name: 'AirConditioner',
              params: params
            });
        } else if (DeviceTypeId == typeId['Music']) {
          this.$router.push({
              name: 'Music',
              params: params
            });
        };



      },
      getImgIcons (item) {
        return deviceIcons[item]
      },
      // apple审核
      isAppleDisable() {
        return !this.utils.isAppleCheck()
      },
    },
    computed: {
      ...mapState({
        smartEnergy: state => state.memberCenter.smartEnegry.SmartEnergy,
        OverCount: state => state.memberCenter.smartEnegry.OverCount,
      })
    }
  }
</script>
<style lang="less" scoped>
  @import "../../styles/common/themeSettings";

  .smartEnergy {
    margin-top: 10px;
    background-color: @panelColor;
    padding: 0 10px;

    .txtcontent {
      flex: 1;
      // margin-left: 10px;
      height: 64px;
      justify-content: center;
    }
  }

  .energyIcon {
    margin-right: 10px;
  }

  .deviceList {
    margin-top: 10px;
    background-color: @panelColor;

    padding: 0 6px 0 10px;
    .itemDesc {
      align-items: center;
      line-height: 44px;
      div {
        flex: 1;
      }
      svg:first-child {
        margin-right: 10px;
      }
    }
  }

</style>
