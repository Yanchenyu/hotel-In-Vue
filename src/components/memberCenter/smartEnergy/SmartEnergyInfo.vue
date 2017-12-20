<!-- 智慧能量页面 -->
<template>
  <div>
    <x-header v-if="titleBarFlag" class="xheader vux-override" style="background-color:#333;">智慧能量</x-header>
    <div class="head_info">
      <div>
        <div class="circle_div cus-flexcolumn-center">
          <!--<div  style="margin-top:20px;">
              <span style="font-size:39px;text-align:center;margin-top:10px;padding-top:30px;" >{{SmartEnergy}}</span>
              <br>

           </div>

           <div style="float: left; margin-left: 13px;font-size:12px;">
              <span style="font-size:12px;">你已超过{{OverCount}}人</span>
           </div>-->
          <div class="cus-giant">{{SmartEnergy}}</div>
          <div class="cus-small">你超过{{OverCount}}人</div>
        </div>
        <div class="btn-share">炫耀一下</div>
      </div>
      <!--<blur :blur-amount=10 :url="url" :height="220">
        <p class="center"><img :src="url">
                <div class="Energy-Div">
                {{energy}}
                <br>
                你已超过{{totalNumber}}人
            </div>
        </p>
        <div class="mem-name" >炫耀一下</div>

      </blur>-->
    </div>

    <div class="question-Div">
      <div class="content" style="line-height:44px;"> 智慧能量怎么使用</div>
    </div>
    <div class="content-Div">
      <div class="content" style="line-height:40px;"> 根据智慧能量值解锁超级功能</div>
    </div>
    <div class="question-Div">
      <div class="content" style="line-height:44px;"> 如何获得智慧能量</div>
    </div>
    <div class="content-Div1">
      <div class="content" style="padding:5px 10px;">
        1. 入住智慧酒店房间一夜，+10点；若入住为超过500元/间夜智慧酒店房间，再+5点
      </div>
      <div class="content">
        2. 通过好想住®购买合作伙伴智能产品，+1点/元
      </div>
      <div class="content" style="padding:5px 10px;">
        3. 使用智能设备，+1点/分钟
      </div>

    </div>
  </div>
</template>

<script>
  import {XHeader, Cell, Group, XInput, Blur, Datetime} from 'vux'
  import {fetchLoadSmartEnergyAxios} from '@/services/axiosapi'
  import {mapState} from 'vuex'
  import {is_weixin} from '@/utils/device'
  import {storeGet} from '@/utils/localStorage'

  export default {
    name: 'SmartEnergyInfo',
    components: {
      Group,
      Cell,
      XHeader,
      XInput,
      Blur,
      Datetime
    },
    beforeMount () {
      //微信浏览器隐藏导航栏
      if (is_weixin()) this.titleBarFlag = false


      var localmemberInfo = localStorage['memberInfo']
      // TODO 验证 MemberId, RoomId是否仍然有效
      if (localmemberInfo == undefined) {
        if (is_weixin()) {
          this.$router.replace({
            name: 'ReplaceBindingPhone'
          })
        } else {
          this.$router.replace({
            name: 'membercenter'
          })
        }

      }

      this.LoadSmartEnergy()

    },
    data () {
      return {
        titleBarFlag: true,
        url: 'https://o3e85j0cv.qnssl.com/tulips-1083572__340.jpg',
        OverCount: '1000',
        SmartEnergy: '950'

      }
    },
    methods: {
      onClick () {
        console.log('on click')
      },
      LoadSmartEnergy(){

        let memberId = storeGet('memberInfo', 'Id');//this.$store.state.memberCenter.memberInfo.Id
        let params = {}
        params.memberId = memberId
        fetchLoadSmartEnergyAxios(params).then(response => {
          // response TODO 添加异常失败情况检查
          console.log('LoadSmartEnergy response:', response)
          if (response.data.Success == true) {

            let obj = {}
            obj = response.data.Content
            this.OverCount = obj.OverCount
            this.SmartEnergy = obj.SmartEnergy
            // console.log("detail:",obj)

          } else {
            // TODO 显示无查询数据
          }
        }).catch(err => {
          //alert('fetchLoadSmartEnergyAxios err:', err)
          this.utils.showNetError();
        })
      }
    }
  }
</script>


<style lang="less" scoped>
  @import '../../../styles/common/themeSettings.less';

  .xheader {
    background-color: @ftColorBlack;
  }

  .head_info {
    background-color: #333;
    //   background-image: url('http://106.15.56.108:9050/Images/memberlevel/background.png');
    height: 220px;
    width: 100%;
    position: relative;
    text-align: center;
    background-size: 100% 100%;

  }

  .memicon {
    margin-left: auto;
    margin-right: auto;
    padding-top: 85px;
    position: relative;
    .icon-center {
      border-radius: 50px;
      width: 80px;
      height: 80px;
    }
  }

  .btn-share {
    float: left;
    color: #ececec;
    font-size: 12px;
    line-height: 22px;
    text-align: center;
    margin-top: 10px;
    margin-left: 137px;
    border-radius: 20px;
    width: 88px;
    border: 1px solid #ececec;
    display: none;
  }

  .circle_div {
    margin: 0px auto;
    position: relative;
    top: 48px;
    color: white;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    border: 2px solid white;
  }

  .Energy-Div {
    position: relative;
    color: #ececec;
    padding-bottom: 5px;
    font-size: 12px;
    line-height: 20px;
  }

  .content {
    //  line-height:24px;
    font: 14px/1.5;
    padding-left: 10px
  }

  .question-Div {
    position: relative;
    color: @ftColorBlack;
    background-color: @pageColor;
    font-size: @ftSize-hl;
    height: 44px;
  }

  .content-Div {
    position: relative;
    color: @ftColorBlack;
    background-color: @panelColor;
    font-size: @ftSize-small;
    height: 44px;
  }

  .content-Div1 {
    position: relative;
    color: @ftColorBlack;
    background-color: @panelColor;
    font-size: @ftSize-small;
    height: auto;
  }

  /* vux */
  .center {
    text-align: center;
    padding-top: 45px;
    color: #fff;
    font-size: 18px;
  }

  .center img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid #ececec;
  }

</style>
