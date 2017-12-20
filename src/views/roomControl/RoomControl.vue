<template>
  <div class="bg">
    <div class="topEnviro " :style="imageStyle">
      <div class="cus-flexrow bgMask">
        <div class="textwrap">
          <div class="cus-flexrow airQuality cus-normal">
            <span class="cus-huge">室内空气质量{{inDoorAir}}</span>
            <span class="aqi">AQI:&nbsp;{{this.envData.AQI}}/500</span>
          </div>
          <div class="cus-huge standardLine">
            <span>室温{{this.envData.Temperature}}℃,</span><span>湿度{{this.envData.Humidity}}%{{humidity}},</span><span>{{light}}</span>
          </div>
        </div>
        <div class="circleBtn cus-flexcolumn-center" :class="{'timeBegin': press15mins}"
             @click="handle15mins">
          <div class="cus-flexcolumn-center circleInner" v-if="press15mins">
            <div class="experience">舒适体验</div>
          </div>
          <div class="cus-flexcolumn-center" v-else>
            <!--<div>15mins</div>-->
            <div class="cus-normal">舒适体验</div>
          </div>

        </div>
        <div class="shadow" v-if="press15mins"></div>
      </div>

    </div>

    <div class="centerMenu">
      <div class="cus-flexrow rowitem normalHeight" :class="{touchBefore: touchNum=='0'}" @click="getDoorKey" @touchstart="touchStartDoorKey(0)" @touchend="touchEndDoorKey(0)">
        <!--<icon name="roomcontrol/key" scale="5" class="svgicon"></icon>      -->
        <img v-if="!is_weixin && !loginMember" src="@/../static/images/defaultHead.png"/>
        <img v-if="is_weixin && !loginMember" :src="imgUrl"/>
        <img v-if="!!loginMember" :src="loginMember"/>
        <div class="cus-flexcolumn cus-normal desc">
          <div class="cus-h1">
            <span class="roomTypeName">{{userInfo.RoomTypeName}}</span>
            <span>房间号： {{userInfo.RoomNumber}}</span>
          </div>
          <div class="cus-small cus-ftColorBlack3 standardLine">
            <span>点击获取开门密码</span>
          </div>
        </div>
        <icon name="raw-more" scale="2" class="svgiconGray getMore"></icon>
      </div>
      <div class="thinLine"></div>

      <div class="basedControl cus-flexrow normalHeight cus-ftColorBlack3 cus-small">
        <div class="basedCurtain cus-flexcolumn-center sameStyle" :class="{touchBefore: touchNum=='3'}" @click="changeCurtainState" @touchstart="touchStartDoorKey(3)" @touchend="touchEndDoorKey(3)">
          <icon name='roomcontrol/list-curtain' scale="11.2" :class="{svgicon: curtainState,svgiconGray:!curtainState}"></icon>
          <div class="fontItem">{{curtainStateFont}}窗帘</div>
        </div>
        <div class="basedAir cus-flexrow">
          <div class="cus-flexrow-center" @click="minusAir">
            <icon name="minus" scale="11.2" :class="{svgicon: airTem!=MinAir,svgiconGray: airTem<=MinAir}"></icon>
          </div>
          <div class="middleTem sameStyle cus-flexcolumn-center">
            <div class="temperature" :class="{svgiconGrayInvalid: !airState,svgiconBlack : airState}">{{airTem}}℃</div>
            <div class="setTem">设置温度</div>
          </div>
          <div class="cus-flexrow-center" @click="addAir">
            <icon name="plus" scale="11.2" :class="{svgicon: airTem!=MaxAir,svgiconGray: airTem>=MaxAir}"></icon>
          </div>
        </div>
        <div class="basedLight cus-flexcolumn-center sameStyle" :class="{touchBefore: touchNum=='4'}" @click="changeLightState" @touchstart="touchStartDoorKey(4)" @touchend="touchEndDoorKey(4)">
          <icon name='blingbling' scale="13.5" :class="{svgicon: lightState != 0,svgiconGray:!lightState}"></icon>
          <div class="fontItem">{{lightStateFont}}灯</div>
        </div>
      </div>

      <div class="thinLine"></div>
      <div class="cus-flexrow rowitem normalHeight" :class="{touchBefore: touchNum=='1'}" @click="playerControl" @touchstart="touchStartDoorKey(1)" @touchend="touchEndDoorKey(1)">
        <icon name="roomcontrol/experience" scale="25.6" class="svgicon"></icon>

        <div class="cus-flexcolumn cus-normal desc">
            <span class="cus-h1">智能遥控</span>
        </div>
        <icon name="raw-more" scale="2" class="svgiconGray getMore"></icon>
      </div>
      <div v-if="!is_weixin" class="thinLine specialLine" :class="{newStyle: touchNum=='1'||touchNum=='2'}"></div>
      <div v-if="!is_weixin" class="cus-flexrow rowitem normalHeight" :class="{touchBefore: touchNum=='2'}" @touchstart="touchStartDoorKey(2)" @touchend="touchEndDoorKey(2)" @click="jumpToPlay()">
        <icon name="perimeter" scale="25.6" class="svgicon"></icon>

        <div class="cus-flexcolumn cus-normal desc">
          <div>
            <span class="cus-h1">周边</span>
          </div>
          <div class="cus-small cus-ftColorBlack3 standardLine">
            <span>停车，景区，公交，便利店，餐馆</span>
          </div>
        </div>
        <icon name="raw-more" scale="2" class="svgiconGray getMore"></icon>
      </div>
    </div>
    <div class="thinLine"></div>
    <div class="controlScene normalHeight cus-flexrow-center">

      <div class="roomSceneOuter cus-flexcolumn-center" v-if="item.Enabled||item.SceneNo=='Morning'" v-for="(item, idx) in commonScene" :class="{'bgFocus': item.SceneNo==index}"  @click="handleSceneSet(item.SceneNo,idx,false)" @touchstart="touchstart(item.SceneNo)">
        <div v-show="item.SceneNo==index" class="borderLeft"></div>
        <div v-show="item.SceneNo==index" class="borderRight"></div>
        <div class="presetNormal" :class="{'borderStyle': item.SceneNo!=borderNum}">

              <div class="sceneImg">
                <img :src="roomSceneNo[item.SceneNo].src" :width="roomSceneNo[item.SceneNo].width"  :height="roomSceneNo[item.SceneNo].height"/>
              </div>
              <div class="cus-normal itemDesc cus-ftColorBlack3">{{item.SceneName}}</div>

        </div>
      </div>

      <div class="festival">
        <div class="imgwrap" v-for="(item, idx) in eventScene" @click="handleSceneSet(item.SceneNo)">
          <div class="cus-normal itemDesc" :style="`background-image: url(${item.ScenePictures});`">
            <div>{{item.SceneName}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="thinLine"></div>
    <div class="roomButton">
      <a :href="dialPhone">
        <div class="urgency cus-flexrow-center">
          <div class="cus-huge">前台服务</div>
        </div>
      </a>
      <a v-if="false" @click="checkout">
        <div class="checkoutRoom cus-flexrow-center">
          <div class="cus-huge">一键退房</div>
        </div>
      </a>
      <div class="footerBottom"></div>
    </div>
    <x-dialog
      :title="''"
      v-model="confirmShow"
      :hide-on-blur="true">
      <div class="weui-dialog__bd callMorning">
        <p v-if="Enabled" class="callYouWakeUp">早上{{morningTime}}叫你起床</p>
        <p class="callYouWakeUp">
          {{Enabled == true ? "是否重新设置叫早时间" : "是否开启叫早服务"}}
        </p>
      </div>
      <div class="weui-dialog__ft noYourRoom">
        <a v-if="!Enabled" href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default cus-h1" @click="onCancel">取消</a>
        <a v-if="Enabled" href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default cus-h1" @click="onCancel">不，关闭叫早</a>
        <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default cus-h1" @click="onConfirm">{{Enabled == true ? '是，重新设置' : '开启'}}</a>
      </div>
    </x-dialog>


    <datetime v-show="timeShow" v-model="value2" clear-text='设置叫早时间' confirmText='保存'
              :minute-list="['00', '10', '20', '30', '40', '50']" cancelText='取消' :min-hour=3
              :max-hour=11 format='HH:mm' @on-change="timeChange" title='' :show.sync="timeShow"
              @update:show="update"></datetime>

    <div class="mengceng" @click="handleClick" v-show="isVisitor"></div>

    <x-dialog
      :title="''"
      v-model="orderRoom"
      :hide-on-blur="true">
      <div class="weui-dialog__bd"><p class="ftSize-hl" style="text-align:center;">{{isLogin?message:(is_weixin?'亲，你还没有绑定手机哟':'亲，你还没有登录哟')}}</p></div>
      <div class="weui-dialog__ft noYourRoom">
        <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default cus-h1 cus-themeColor" @click="nowOrderOne" v-show="isLogin&&!isQuery">{{message=='没有你的房间，只能看看'?'现在去订一间':'知道了'}}</a>
        <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default cus-h1 cus-themeColor" @click="goLogin" v-show="!isLogin&&!isQuery">{{is_weixin?'去绑定':'去登录'}}</a>
        <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default cus-h1 cus-themeColor" @click="goOut" v-show="isQuery">退房了</a>
        <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default cus-h1 cus-themeColor" @click="changeRoom" v-show="isQuery">我订了另一间</a>
      </div>
    </x-dialog>

    <!-- 弹层-酒店入住办理提醒 -->
    <!-- TODO popup实现-->
    <!-- 场景无法设定时-->
  </div>
</template>

<script>
  import Popup from '@/components/roomControl/Popup.vue'
  import {
    roomControlLoadRoomData,
    roomControlLoadEvnData,
    roomControlLoadScene,
    fetchLoadSmartEnergyAxios,
    roomControlLoadDoorKey,
    setRoomSceneCustom,
    changeRoomDoorKey,
    openTimeScene,
    closeTimeScene,
    userInfoCheck,
    set15minsComfortableEnv,  // 15分钟回归场景设定
    loadDevicesInRoomPanel,
    changeDeviceStatus,
    hotelCheckOut,
    getControlRoom,
    fetchMemberInfoAxios,
    fetchLoadMemberDetailViewByBindIdAxios
  } from '@/services/axiosapi'

  import {
    XDialog,
    Datetime,
    Toast,
    XInput,
    Confirm,
    Group,
    XSwitch,
    XButton,
    TransferDomDirective as TransferDom
  } from 'vux'
  import {mapState} from 'vuex'
  import {is_weixin} from '@/utils/device'
  import {storeSet, storeGet} from '@/utils/localStorage'
  import {isMobile} from '@/utils/validateExp'
  import {doHandleMonth} from '@/utils/timeUtil'
  import {roomScene} from '@/utils/roomControlScene'
  import _ from 'lodash'
  import {deviceTypes} from '@/utils/roomControl'
  import {ls_unionId} from '@/utils/localStorage'
  export default {
    name: 'RoomControl',
    beforeMount() {
      // 依据用户信息加载房间数据
      if (localStorage["memberInfo"]){
        this.dataInital()
      } else {
        if(is_weixin()) {
          // 请求用户数据
          this.$store.dispatch('setLoadingState', true);
          this.initialMemInfo()
        } else {
          this.$store.dispatch('setAnalogDataCommonScenes',{});
          this.$store.dispatch('setLoadingState', false);
        }        
      }
      this.initialDT = true;  // beforeMount刚初始化了，activated就不做了
    },
    // keep-alive 激活用
    activated(){
      console.log('002.roomcontrol activated')

      if(!this.initialDT) {
        if(!this.isVisitor) {
          this.startRefreshEnvData(); // 再次回来，重新启用定时刷新环境数据
        }
        //校验 是否仍是合法用户，并且页面加上loading图标
        this.checkUserValid(false);
      }

    },
    deactivated() {
      // visitor退出组件后，需要销毁，保证用户登录能正常触发信息验证和数据加载。
      console.log('roomcontrol deactivated')
      if(this.isVisitor) {
        this.$store.dispatch('keepAlivePageDel', 'RoomControl')
      } else {
        this.initialDT = false;
        clearInterval(this.changeScene);
      }
    },

    beforeDestroy(){
      console.log('004.roomcontrol beforeDestroy');
      this.$store.dispatch('setLoadingState', false);
      clearInterval(this.changeScene);
    },
    components: {
      Datetime,
      Popup,
      Toast,
      XInput,
      Confirm,
      Group,
      XSwitch,
      XButton,
      XDialog
    },
    data() {
      return {
        isLoading: true,  // 是否在加载中  
        isLogin: false,
        mobile: 0,
        humidity: '',
        light: '',
        Enabled: '',
        sceneId: '',
        morningTime: '',
        value2: '',
        timeShow: false,
        confirmShow: false,
        orderRoom: false,
        focus: false,
        number: 6,
        is_weixin: is_weixin(),
        loginMember: storeGet('SH_RoomControl', 'Avatar'),
        imgUrl: storeGet('SH_wxAuth', 'headimgurl'),
        // 数据加载
        loading: false,
        // 房间基本数据
        basicInfo: {
          contactPhone: '',
          pic: '../../../static/images/roomTop.jpg'
        },
        // 检测环境数据
        envData: {
          AQI: '',
          InDoorAir: '',
          Humidity: '',
          Lighting: '',
          Temperature: '',
          Picture: ''
        },
        // 授权用户数据
        userInfo: {},
        doorKey: '',
        // 按钮反馈 TODO 苹果审核改成localhost记录
        press15mins: false,
        pressAnimation: false,
        // 提示能量不足
        showToast: false,
        toastTips: '你的智慧能量不够喔~，多攒攒吧',
        SmartEnergy: "",
        index: "",
        num: 0,
        min: 0,
        seconds: 0,
        isVisitor: true,
        inDoorAir: "",
        sceneIndex: "",
        changeScene: {},
        roomSceneNo: roomScene,
        MaxAir: 30,
        MinAir: 16,
        curtainDeviceId: "",
        airDeviceId: "",
        lightDeviceId: "",
        touchNum: "",
        // 组件beforeMount初始化，或者离开页面后，重新activated时触发，数据initial
        initialDT: false,
        isQuery: false,
        message: '没有你的房间，只能看看'
      }
    },
    methods: {
      dataInital(){
        this.$store.dispatch('setLoadingState', true);
        this.mobile = storeGet("memberInfo","Phone");
        this.isLogin = true;
        this.initialRoomData();
      },      
      /**
       * 微信根据unionid获取用户信息
       * copy 代码from MemberCenter
       */
      initialMemInfo(){
        this.$store.dispatch('setAnalogDataCommonScenes',{}); // 显示模拟的场景数据
        
        this.findMember()
      },
      saveStorageMember(obj){
        storeSet('memberInfo', 'Id', obj.Id);
        storeSet('memberInfo', 'Phone', obj.Phone);
        storeSet('memberInfo', 'NickName', obj.NickName);
        if(!storeGet('memberInfo', 'Avatar')){
          storeSet('memberInfo', 'Avatar', obj.Avatar);
        }
        storeSet('memberInfo', 'BindId', obj.BindId);
      },
      findMember(){
        let params = {}
        params.bindId = ls_unionId();
        params.bindWay = "W";
        fetchLoadMemberDetailViewByBindIdAxios(params).then(response => {          
          if (response.data.Success == true) {
            console.log("response.data.Success", response.data.Message);
            this.$store.dispatch('setMemberInfo', response.data.Content);
            this.$store.dispatch("setMemberHeadImg", response.data.Content.Avatar);
            this.$store.dispatch("setMemberLoginStatu", true);
            let obj = response.data.Content;
            this.saveStorageMember(obj);
            this.dataInital();  // 执行完saveStorageMember后再调用房间数据
          } else {
            // TODO 显示无查询数据
            this.$store.dispatch("setMemberLoginStatu", false);
            this.$store.dispatch('setLoadingState', false);
          }
        }).catch(err => {
          this.$store.dispatch("setMemberLoginStatu", false);
          this.$store.dispatch('setLoadingState', false);
        })
      },

      // 组件数据初始化
      initialRoomData() {
        // 缓存登陆用户数据提取
        this.userInfo = storeGet("SH_RoomControl","VerifyInfo")?storeGet("SH_RoomControl","VerifyInfo"):{}
        if (_.isEmpty(this.userInfo)) {
          // 没有可控房间数据，所以要捞一次
          this.getControlRoomData();
        } else {
          // 有可控房间数据，直接调queryCheckIn
          this.checkUserValid(true);
        }
        
      },
      getControlRoomData() {
        // 捞取可控房间信息
        let phone = this.mobile;
        getControlRoom({phone}).then(response => {
          if (response.data.Code=="0") {
            if (response.data.Content.length !== 0) {
              let content = response.data.Content[0];
              // 暂时选择默认数组第一个房间，后期再考虑多个房间控制选择问题
              this.userInfo = content;
              storeSet("SH_RoomControl","VerifyInfo", content);
              let RoomNumber = response.data.Content.RoomNumber;
              this.$store.dispatch("setRoomNumber", RoomNumber);
              // 捞到房间后，再看当前房间是否有效
              this.checkUserValid(true);
              fetchMemberInfoAxios({phone}).then(response => {
                // 设置头像
                if (response.data.Success == true) {
                  let obj = response.data.Content;
                  storeSet('SH_RoomControl', 'Avatar', obj.Avatar);                  
                }
              }).catch(err => {
                //alert('fetchMemberInfoAxios err:', err)
                this.utils.showNetError();
              })
            }
          } else {
            this.isVisitor = true;
            this.isQuery = false;
            this.$store.dispatch('setLoadingState', false);
            this.$store.dispatch('setAnalogDataCommonScenes',{});
            if (response.data.Code == '21004') {
              // 已定房但还不能操控房间
              this.message = '请在'+response.data.Content+'之后体验智慧客房';
            } else {
              this.message = '没有你的房间，只能看看';
            }
          }
        })
      },
      // check 用户是否仍是合法用户
      checkUserValid(isCreated) {
          let option = {
            checkInId: this.userInfo.CheckinId
          }

          userInfoCheck(option).then(response => {
            if (response.data.Code=="0") {
              if (response.data.Content) {
                this.isVisitor = false;
                this.$store.dispatch('setLoadingState', false);
                if(isCreated) {
                  this.loadRoomInfo()
                  this.$store.dispatch('keepAlivePageAdd', 'RoomControl')
                }
              }
            } else {
              // code不是0，表示非法入住，当前房间已失效，那么就要分两个情况，第一，换房间了，第二，客人打算离店了
              storeSet("SH_RoomControl","VerifyInfo", {});
              // 这里的isQuery表示提示栏里的选项信息要变化
              this.message = '没有你的房间，只能看看';
              this.isVisitor = true;
              this.isQuery = true;
              this.$store.dispatch('setAnalogDataCommonScenes',{});
              this.$store.dispatch('setLoadingState', false);
              // if(!isCreated) {
              //   // 只有非visitor 能厨房activated函数，此处说明 身份从合法用户变成visitor
              //   this.$router.replace({
              //     name: 'idverify'
              //   })
              // }
            }
          }).catch(err => {
            console.log(err);
          })
        
      },
      update(){
        this.timeShow = false
      },
      timeChange(val){
        let option = {
          sceneId: this.sceneId,
          dateTime: val
        };
        openTimeScene(option).then(response => {
          if (response.data.Success == true) {
            this.Enabled = true;
            this.morningTime = val;
            this.timeShow = false;
          }
        }).catch(err => {
          console.log(err);
        })
      },
      changeCurtainState(){
        if(this.curtainState){
            var option = {
              MemberId: this.userInfo.MemberId,
              Id: this.curtainDeviceId,
              cmdId: 1,
              cmdValue: 1
            };
        }else{
            var option = {
              MemberId: this.userInfo.MemberId,
              Id: this.curtainDeviceId,
              cmdId: 1,
              cmdValue: 0
            };
        };
        changeDeviceStatus(option).then(response => {
              if(response.data.Success){
                //成功
                this.$store.dispatch('setSyncDeviceCurtain',!this.curtainState);
              }
          }).catch(err => {
            console.log(err);
          })
      },
      changeLightState(){
        if(this.lightState){
            var option = {
              MemberId: this.userInfo.MemberId,
              Id: this.lightDeviceId,
              cmdId: 1,
              cmdValue: 0
            };
            //目前先不管场景，实现功能后续再改进
        }else{
            var option = {
              MemberId: this.userInfo.MemberId,
              Id: this.lightDeviceId,
              cmdId: 1,
              cmdValue: 1
            };
        };
        changeDeviceStatus(option).then(response => {
              if(response.data.Success){
                //成功
                this.$store.dispatch('setSyncDeviceLight', this.lightState?0:1);
              }
          }).catch(err => {
            console.log(err);
          })
      },
      addAir(){
        this.airAdjust(true);
      },
      minusAir(){
        this.airAdjust(false);
      },
      // 空调温度调节
      airAdjust(isAdd){
        // 初始数据
        let isOverRange = true;  // 超过温度设定范围
        let _airTemp = 0;
        if (isAdd) {
          if(this.airTem<this.MaxAir) {
            isOverRange = false;
            _airTemp = Number(this.airTem) + 1
          }
        } else {
          if(this.airTem>this.MinAir) {
            isOverRange = false;
            _airTemp = Number(this.airTem) - 1
          }
        }
        // 具体操作
        if(this.airState){
          //空调开着的
          if(!isOverRange){
            this.$store.dispatch('setSyncDeviceTemperature',_airTemp)
            this.setAirTemperature()
          }
        }else{
          //关着的
          let option = {
            MemberId: this.userInfo.MemberId,
            Id: this.airDeviceId,
            cmdId: 1,
            cmdValue: 1
          };
          changeDeviceStatus(option).then(response => {
            if(response.data.Success){
              //成功
              this.$store.dispatch('setSyncDeviceACState', true);
              if(!isOverRange){
                this.$store.dispatch('setSyncDeviceTemperature',_airTemp)
                this.setAirTemperature()
              }
            }
          }).catch(err => {
            console.log(err);
          })
        }
      },
      // 温度设置
      setAirTemperature() {
        let option = {
          MemberId: this.userInfo.MemberId,
          Id: this.airDeviceId,
          cmdId: 2,
          cmdValue: this.airTem
        };
        changeDeviceStatus(option).then(response => {
          if(response.data.Success){
            //成功
          }
        }).catch(err => {
          console.log(err);
        })
      },
      cancelFn(isTrue){
        this.confirmShow = false;
        if (isTrue) {
          // 已经设置过了，关闭叫早
          let option = {
            sceneId: this.sceneId
          };

          closeTimeScene(option).then((response) => {
            if (response.data.Success == true) {
              this.Enabled = false;
              this.value2 = "";
            }
          }).catch(err => {
            console.log(err);
          })
        }
      },
      confirmFn(isTrue){
        this.confirmShow = false;
        this.timeShow = true;
      },
      touchstart(e){
        this.index = e
      },
      touchend(e){
        this.index = ""
      },
      touchStartDoorKey(a){
        this.touchNum = a;
      },
      touchEndDoorKey(a){
        this.touchNum = "";
      },
      fingerStart(e){
        this.sceneIndex = e;
      },
      fingerEnd(){
        this.sceneIndex = ""
      },
      onConfirm(){
        return this.Enabled == true ? this.confirmFn(true) : this.confirmFn(false)
      },
      onCancel(){
        return this.Enabled == true ? this.cancelFn(true) : this.cancelFn(false)
      },
      keydown(e){
        // if(this.$refs.changeDoor.value.length>5){
        //     e.preventDefault();
        //     return false
        // }
      },
      isAppleDisable() {
        return !this.utils.isAppleCheck()
      },
      // 数据初始化
      loadRoomInfo() {
        this.loading = true
        // 加载环境数据， 定时setInterval
        this.startRefreshEnvData();
        this.getDeviceState();
        this.getSmartEnery();
        this.getBasicInfo();

      },
      // 定时刷新环境监测数据
      startRefreshEnvData () {
        this.getEnvData();
        this.changeScene = setInterval(() => {
          this.getEnvData();
        },300000);
      },
      // 加载房间基本信息
      getBasicInfo() {
        let params = {
          roomId: this.userInfo.RoomId
        }
        roomControlLoadRoomData(params).then(response => {
          if (response.data.Success == true) {
            let content = response.data.Content
            this.basicInfo = {
              contactPhone: content.ContactPhone.Value,
              pic: content.Picture.Value
            };
            storeSet("SH_RoomControl","BasicInfoPic", content.Picture.Value);
          }
        })
          .catch(err => {
            //alert('roomControlLoadRoomData err:' + err)
            this.utils.showNetError();
          })

      },
      getDeviceState(){
        let params = {
          roomId: this.userInfo.RoomId
        };
        loadDevicesInRoomPanel(params).then(response => {
          if (response.data.Success == true) {
            let content = response.data.Content;
            console.log(content);
            let that = this;
            content.forEach(function(item){
              console.log()
              if(item.DeviceTypeId == deviceTypes.CURTAIN){
                // 窗帘
                that.curtainDeviceId = item.Id;
                // 0-10, 10代表全关，0代表全开
                if(item.StatusObject.OpenPercent< 5){
                  that.$store.dispatch('setSyncDeviceCurtain', true);
                }else{
                  that.$store.dispatch('setSyncDeviceCurtain', false);
                }
              }else if(item.DeviceTypeId == deviceTypes.AIR_CONDITIONER){
                //空调
                that.$store.dispatch('setSyncDeviceTemperature', item.StatusObject.Temperature);

                that.airDeviceId = item.Id;
                var temArea = item.StatusObject.Commands.filter(function(item){
                    return (item.Id=="2")
                });
                that.MaxAir = temArea[0].Max;
                that.MinAir = temArea[0].Min;
                if(item.StatusObject.Powered=="1"){
                  that.$store.dispatch('setSyncDeviceACState', true);
                }else{
                  that.$store.dispatch('setSyncDeviceACState', false);
                }

              }else if(item.DeviceTypeId == deviceTypes.SCENE){
                // TODO 孙军接口未达到完成版，后续灯光不用SCENE做判断依据
                that.lightDeviceId = item.Id;
                // TODO 灯光的值，写入Vuex中
                // that.$store.dispatch('setSyncDeviceLight', todo-value);  // 具体值等待接口提供
              };
            });
          }
        })
          .catch(err => {
            //alert('roomControlLoadRoomData err:' + err)
            console.log(err);
          })
      },
      // 加载环境数据
      getEnvData () {
        let params = {
          memberId: this.userInfo.MemberId,
          roomId: this.userInfo.RoomId
        }

        roomControlLoadEvnData(params).then(response => {
          console.log('roomControlLoadEvnData', response)
          if (response.data.Success == true) {
            let content = response.data.Content
            this.envData = {
              AQI: content.AQI.Value,
              InDoorAir: content.InDoorAir.Value, // 室内空气
              Humidity: content.Humidity.Value, //湿度
              Lighting: content.Lighting.Value,
              Temperature: content.Temperature.Value,
              Picture: content.Picture,
            }
            if(content.InDoorAir.Value<35){
              this.inDoorAir = "优"
            }else if(content.InDoorAir.Value>=35&&content.InDoorAir.Value<75){
              this.inDoorAir = "良"
            }else if(content.InDoorAir.Value>=75&&content.InDoorAir.Value<=115){
              this.inDoorAir = "差"
            }else if(content.InDoorAir.Value>115){
              this.inDoorAir = "极差"
            }
            if (content.Humidity.Value < 40) {
              this.humidity = "干燥"
            } else if (content.Humidity.Value <= 60 && content.Humidity.Value >= 40) {
              this.humidity = "适中"
            } else if (content.Humidity.Value > 60) {
              this.humidity = "潮湿"
            }
            if (content.Lighting.Value < 20) {
              this.light = "室内较暗"
            } else if (content.Lighting.Value <= 45 && content.Lighting.Value >= 20) {
              this.light = "室内光线舒适"
            } else if (content.Lighting.Value > 45) {
              this.light = "室内明亮"
            }
          } else {
            this.utils.toast({msg: response.data.Message})
          }
        })
          .catch(err => {
            console.log('roomControlLoadEvnData err:' + err)
          })
      },
      // 加载用户能量数据
      getSmartEnery() {
        let params = {
          memberId: this.userInfo.MemberId
        }
        fetchLoadSmartEnergyAxios(params).then(response => {
          console.log('fetchLoadSmartEnergyAxios', response)
          if (response.data.Success == true) {
            let content = response.data.Content
            let data = {
              SmartEnergy: content.SmartEnergy,
              OverCount: content.OverCount
            };
            this.SmartEnergy = content.SmartEnergy;
            this.$store.dispatch('setSmartEnergy', data);
            this.getSceneData();
          } else {
            this.utils.toast({msg: response.data.Message})
          }
        })
          .catch(err => {
            console.log('fetchLoadSmartEnergyAxios err:' + err)
          })
      },
      // 接口请求加载场景数据
      getSceneData() {
        let params = {
          memberId: this.userInfo.MemberId,
          roomId: this.userInfo.RoomId,
          energy: this.SmartEnergy
        };
        roomControlLoadScene(params).then(response => {
          console.log('roomControlLoadScene', response)
          if (response.data.Success == true) {
            let content = response.data.Content
            this.$store.dispatch('setRoomScene', content);
            let morningStateArr = content.CommonScenes.filter((item) => {
              return (item.SceneNo == 'Morning')
            });
            var scenceArr = [];
            let scenceData = content.CommonScenes.forEach((item) => {
              if (item.SceneNo != 'Morning') {
                scenceArr.push(false)
              }
            });
            this.$store.dispatch("setScenceArr", scenceArr);
            this.sceneId = morningStateArr[0].Id;
            this.Enabled = morningStateArr[0].Enabled;
            this.morningTime = morningStateArr[0].TiggerTime;
            if(this.Enabled){
                let a = this.morningTime;
                let aa = a.split(":");
                let b = new Date();
                let c = b.getTime();
                if(b.getHours()>aa[0]){
                  var d = b.getFullYear()+"/"+doHandleMonth(b.getMonth()+1)+"/"+doHandleMonth(b.getDate()+1)+" "+a+":00";
                }else{
                  var d = b.getFullYear()+"/"+doHandleMonth(b.getMonth()+1)+"/"+doHandleMonth(b.getDate())+" "+a+":00";
                };

                let e = new Date((d).replace(new RegExp("-","gm"),"/")).getTime();
                let f = e-c;
                var that = this;
                if(f>0){
                  setTimeout(function(){
                    that.getSceneData();
                  },f+1000*60*3);
                }
                //闹钟定时

            }
          } else {
            this.utils.toast({msg: response.data.Message})
          }
        })
          .catch(err => {
            console.log('roomControlLoadScene err:' + err)
          })
      },
      // 获取开门密码
      getDoorKey() {
        // 检查是否是合法用户
        if (_.isEmpty(this.userInfo)) {
          this.isVisitor = true;
        } else {
          let option = {
            checkInId: this.userInfo.CheckinId
          }
          userInfoCheck(option).then(response => {
            if (response.data.Code=="0") {
              if (response.data.Content) {
                this.isVisitor = false;
                // 是合法用户才可以查看门锁密码
                this.$router.push({
                  name: "DoorKey"
                });
              } else {
                this.isVisitor = true;
              }
            } else {
              this.isVisitor = true;
            }
            if(this.isVisitor) {
              storeSet("SH_RoomControl","VerifyInfo", {})
            }
          }).catch(err => {
            console.log(err);
          })
        }

      },
      // 玩家体验
      playerControl() {
        this.$router.push({
          name: 'devicelist'
        })
      },

      // 场景触发
      handleCustomScene(idx, locked, index) {
        if (locked == true) {
          this.utils.toast({msg: '你的智慧能量不够喔~，多攒攒吧'})
          return;
        } else {
          this.handleSceneSet(idx, index, true);
        }

      },

      handleSceneSet(idx, index, isTrue) {
        if (idx == 'Morning') {
          this.confirmShow = true;
        } else if (isTrue) {
          let option = {
            sceneId: idx,    // TODO
            roomid: this.userInfo.RoomId
          }

          // this.utils.toast({msg: '设定中'})
          setRoomSceneCustom(option).then(response => {
            console.log('setRoomSceneCustom', response)
            if (response.data.Success == true) {
              //alert(response.data.msg)
              // this.toastTips = '设定成功'
              // this.scenceArr[index] = "success";
            }
          })
            .catch(err => {
              console.log('setRoomSceneCustom err:' + err)
            })
        } else if (!isTrue) {
          var scenceArr = this.$store.state.roomControl.roomInfo.scenceArr;
          if (scenceArr[index] == "success" || scenceArr[index] == "loading") {
            return
          } else {
            let option = {
              sceneId: idx,    // TODO
              roomid: this.userInfo.RoomId
            }

            // this.utils.toast({msg: '设定中'})
            var scenceArr = this.$store.state.roomControl.roomInfo.scenceArr;
            for (var i = 0; i < scenceArr.length; i++) {
              scenceArr[i] = false
            }
            ;
            scenceArr[index] = "loading";
            this.$store.dispatch("setScenceArr", []);
            this.$store.dispatch("setScenceArr", scenceArr);
            setRoomSceneCustom(option).then(response => {
              console.log('setRoomSceneCustom', response)
              if (response.data.Success == true) {
                //alert(response.data.msg)
                // this.toastTips = '设定成功'
                // this.scenceArr[index] = "success";

                var scenceArr = this.$store.state.roomControl.roomInfo.scenceArr;
                for (var i = 0; i < scenceArr.length; i++) {
                  scenceArr[i] = false
                }
                scenceArr[index] = "success";
                let that = this;
                setTimeout(function () {
                  that.$store.dispatch("setScenceArr", []);
                  that.$store.dispatch("setScenceArr", scenceArr);
                }, 1000);

              } else {
                // 设定结果提示
                // this.scenceArr[index] = "fail";
                var scenceArr = this.$store.state.roomControl.roomInfo.scenceArr;
                for (var i = 0; i < scenceArr.length; i++) {
                  scenceArr[i] = false
                }
                scenceArr[index] = "fail";
                this.$store.dispatch("setScenceArr", []);
                this.$store.dispatch("setScenceArr", scenceArr);
              }

            })
              .catch(err => {
                //console.log('setRoomSceneCustom err:' + err)
                var scenceArr = this.$store.state.roomControl.roomInfo.scenceArr;
                for (var i = 0; i < scenceArr.length; i++) {
                  scenceArr[i] = false
                }
                scenceArr[index] = "fail";
                this.$store.dispatch("setScenceArr", scenceArr);
              })
          }
        }
      },

      // 15mins恢复舒适体验
      handle15mins() {
        //this.update15mins()
        console.log('handle15mins')

        let option = {
          roomId: this.userInfo.RoomId ,
          memberId: this.userInfo.MemberId
        }

        if (!this.press15mins) {
          this.press15mins = true;
          set15minsComfortableEnv(option)
            .then(response => {
              if (response.data.Success) {
                this.update15minsSuccess()
                this.$store.dispatch('setSyncDeviceACState', true);
                this.go15MinsDetail(true)
              } else {
                this.update15minsFail()
                console.log(`15min设定失败：${response.data.Message}`)
              }
            })
            .catch(err => {
              this.update15minsFail()
              console.log(`15min设定失败 catch：${JSON.stringify(err)}`)
            })
        } else {
          console.log(this.$router)
          this.go15MinsDetail(false)
        }
      },
      // 激活同时15分钟，同时跳转
      go15MinsDetail(isReset) {
        this.$router.push({
          name: 'comfort15mins',
          query: {
            isReset: isReset
          }
        })
      },

      update15minsSuccess () {
          var that = this;
          this.min = '15';
          this.seconds = '00';
          var timeDiff = 15 * 60 * 1000;
          var timeOut = setInterval(function () {
            if (timeDiff > 1000) {
              timeDiff -= 1000;
              var newTime = new Date(timeDiff);
              var min = newTime.getMinutes();
              var seconds = newTime.getSeconds();
              if (seconds < 10) {
                seconds = '0' + seconds
              }
              if (min < 10) {
                min = '0' + min
              }
              that.min = min;
              that.seconds = seconds;
            } else {
              clearInterval(timeOut);
              that.press15mins = false;
            }
          }, 1000)
      },
      update15minsFail () {
        this.press15mins = false;
        this.utils.toast({msg: '设定失败，请稍后再试'});
      },
      handleClick(){
        this.orderRoom = true;
      },

      nowOrderOne(){
        if (this.message == '没有你的房间，只能看看') {
          this.$router.push({
            name: 'SmartHotel'
          })
        } else {
          this.orderRoom = false;
        }
          
      },
      goLogin(){
        if(is_weixin()){
          this.$router.push({
              name: 'ReplaceBindingPhone'
          })
        } else {
          this.$router.push({
              name: 'Login'
          })
        }
        
      },
      changeRoom(){
        // 换一间房间
        this.orderRoom = false;
        this.$store.dispatch('setLoadingState', true);
        this.getControlRoomData();
      },
      goOut(){
        // 退了
        this.isVisitor = true;
        this.isQuery = false;
      },
      checkout(){
          let option = {
            checkInId: this.userInfo.CheckinId
          };
          hotelCheckOut(option).then(response => {
              if(response.data.Success){
                this.$router.replace({
                  name: 'roomcontrol'
                })
              }
          }).catch(err => {
              console.log(err);
          })
      },
      jumpToPlay(){
        this.$store.dispatch("setHotelNo","JP0001");
        this.$router.push({
            name: "HowToPlay"
        })
      }
    },
    computed: {
      dialPhone () {
        return 'tel:' + this.basicInfo.contactPhone
      },
      // 环境数据背景图片
      imageStyle () {
        return 'background-image:url("' + this.basicInfo.pic + '")'
      },

      morningState(){
        let morningStateArr = this.commonScene.filter((item) => {
          return (item.SceneNo == 'Morning')
        });
        return morningStateArr[0]
      },

      ...mapState({
        memberScene: state => state.roomControl.roomInfo.sceneData.memberScene,
        commonScene: state => state.roomControl.roomInfo.sceneData.commonScene,
        eventScene: state => state.roomControl.roomInfo.sceneData.eventScene,
        userSmartEnergy: state => state.memberCenter.smartEnegry.SmartEnergy,
        scenceArr: state => state.roomControl.roomInfo.scenceArr,
        // 设备状态同步
        lightState: state => state.roomControl.shareDeviceData.lightIdx,
        airTem: state => state.roomControl.shareDeviceData.temperature,
        curtainState: state => state.roomControl.shareDeviceData.isCurtainTobeClosed,
        airState: state => state.roomControl.shareDeviceData.airState,  // 空调开关状态
      }),
      borderNum(){
        let num = this.commonScene.filter((item) => {
          return (item.Enabled||item.SceneNo=="Morning")
        });
        return num[num.length-1].SceneNo
      },
      curtainStateFont(){
          return this.curtainState ? "关" : "开"
      },
      lightStateFont(){
          return this.lightState ? "关" : "开"
      },
    },

  }

</script>

<style lang="less" scoped>
  @import "../../styles/common/themeSettings";

  // 顶部环境数据
  .topEnviro {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    height: 155px;
    // 添加一层暖色蒙版
    .bgMask {
      background-color:  rgba(0,0,0,.3);
      height: 100%;
      position: relative;
      .airQuality {
        margin-bottom: 15px;
        line-height: 1.3em;
        align-items: center;
      }
    }
    // 内容
    .textwrap {
      // flex: 1;
      align-self: flex-end;
      color: @panelColor;
      padding-bottom: 20px;
      margin-left: 10px;
      z-index: 10;
      span {
        margin-right: 5px;
      }
      .aqi {
        background-color: @hintColor;
        border-radius: 3px;
        font-size: 10px;
        width: 68px;
        height: 10px;
        line-height: 10px;
        display: inline-block;
        text-align: center;
      }
    }
    .circleBtn {
      background-color: rgba(37,192,177,0.8);
      color: @panelColor;
      width: 80px;
      height: 80px;
      border-radius: 40px;
      position: absolute;
      bottom: 40px;
      right: 20px;
      // align-self: center;
      // transition: 2s;

    }

    .timeBegin {
      width: 76px;
      height: 76px;
      border-radius: 76px;
      background-color: transparent;
      border: 2px solid #25c0b1;
      z-index: 10;
    }

    .circleInner {
      background-color: @themeColor;
      color: @panelColor;
      width: 70px;
      height: 70px;
      border-radius: 35px;
      z-index: 20;
      .experience {
        font-size: 10px;
        text-align: center;
      }
    }

    .shadow {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      opacity: 0.3;
    }
  }

  .hideThinline {
    position: absolute;
    top:-2px;
    left:0;
    height:2px;
    width: 100%;
    background: @pageColor
  }

  .normalHeight {
    height: 64px;
  }

  .basedControl {
    flex: 1;
    width: 100%;
    & > div {
      padding: 12px 0;
    }
    .sameStyle {
      div{
        line-height: 1em;
      }
      justify-content: space-between;
    }
    .basedAir {
      flex: 2;
      border-right: 1px solid @pageColor;
      border-left: 1px solid @pageColor;
      & > div {
        flex: 1
      }
      .temperature {
        font-size: 28px;
        text-align: center;
      }
      .middleTem {
        .setTem {
          text-align: center
        }
      }
    }
    .basedCurtain {
      flex: 1
    }
    .basedLight {
      flex: 1
    }
    .fontItem {
      width: 100%;
      text-align: center;
    }
  }

  // 中间区域
  .centerMenu {
    background: @panelColor;
    margin-top: 10px;
    // padding: 0 6px 0 10px;
    .rowitem {
      align-items: center;
      padding-left: 7px;
      img {
        border-radius: 5px;
      }
      .desc {
        flex: 1;
        margin-left: 15px;
        & > div:first-child {
          margin-bottom: 10px;
          line-height: 1em;
        }
        .roomTypeName {
          margin-right: 24px;
        }
      }
      img {
        width: 44px;
        height: 44px;
      }
    }
  }

  // 底部场景
  .controlScene {
    background: @panelColor;
    flex: 1;
    /* 水平场景栏 */
    .cussetting {
      // padding: 0 10px;
      align-items: center;
      &:not(:last-child) {
          border-right: 1px solid @pageColor;
        }
      & > div {
        flex: 1;
        text-align: center;
        line-height: 44px;
      }
      svg {
        margin-left: 10px;
      }
    }

    /* 垂直场景栏 */
    .roomSceneOuter {
       flex:1;
       height: 100%;
       position: relative;
       .borderLeft {
          position: absolute;
          width: 2px;
          height: 100%;
          background: @pageColor;
          left: -1px;
          top: 0;
       }
       .borderRight {
          position: absolute;
          width: 2px;
          height: 100%;
          background: @pageColor;
          right: -1px;
          top: 0;
       }
      .presetNormal {
        // justify-content: space-around;
        margin: 10px 0;
        display: inline-block;
        width: 100%;
        height: 44px;
        position: relative;
        .sceneImg {
          position: absolute;
          bottom: 18px;
          width: 100%;
          text-align: center;
          line-height: 0.8em;
        }
        .itemDesc {
          text-align: center;
          position: absolute;
          bottom: 2px;
          width: 100%;
          line-height: 0.8em;
        }
      }
    }

    .sceneList {

    }

    .borderStyle {
      border-right: 1px solid @pageColor;
    }

    .newBorder {
      // border-right: 1px solid @pageColor;
      // border-left: 1px solid @pageColor;
    }

    .bgFocus {
      background: @pageColor;
    }

    .lightOnly {
      flex: 1
    }

    /* 节日场景栏 */
    .festival {
      .imgwrap {
        width: 100vw;
        height: 44px;
      }
      .itemDesc {
        line-height: 44px;
        padding: 0 10px;
        color: @panelColor;
        // 补充 background-image配置
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
    }
  }

  /* 紧急电话 */
  .urgency {
    margin: 0 10px;
    background-color: @themeColor;
    color: @panelColor;
    border-radius: 5px;
    height: 40px;
    div {
      line-height: 40px;
    }
  }

  .checkoutRoom {
    margin: 10px 10px;
    background-color: @priceColor;
    color: @panelColor;
    border-radius: 5px;
    height: 40px;
    div {
      line-height: 40px;
    }
  }

  .footerBottom {
    width: 100%;
    height: 10px;
  }

  /* 门锁密码弹层 */
  .doorKey {
    width: 70vw;
    border-radius: 8px;
    background-color: @popColor;

    padding: 20px 10px;
    // display: flex;

    .keyTips {
      text-align: center;
      width: 192px;
    }
    .checkoutBtn {
      color: @panelColor;
      background-color: @themeColor;
      padding: 5px 30px;
      border-radius: 5px;
      margin-top: 10px;
    }

    .weui-dialog__btn {
      font-size: @ftSize-hl;
      color: @themeColor;
    }

    .dp-header .dp-item {
      color: #ccc
    }

    .colorGrey {
      color: #a2a2a2
    }

    .borderStyle {
      border-bottom: 1px solid @pageColor;
    }

  }

  .mengceng {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 499;
    width: 100%;
    height: 100%;
  }

  .getMore {
    margin-right: 6px;
  }

  .roomButton {
    width: 100%;
    background: @panelColor;
    padding-top: 15px;
    padding-bottom: 5px;
  }

  .touchBefore {
    background-color: @pageColor;
  }

  .specialLine {
    margin-left: 7px;
  }

  .newStyle {
    margin-left: 0;
  }
</style>
