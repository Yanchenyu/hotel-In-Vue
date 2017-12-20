<template>
<div>
    <x-header class="xheader vux-override" style="background-color:#25c0b1;" v-if="titleBarFlag">
        {{userInfo.RoomNumber}}
    </x-header>
    <div class="bg" :class="{isApp:!is_weixin}">
        <header>
            <img :src='basicInfoPic' height="230" width="100%" />
            <header class="cus-huge cs-ftColorBlack standardLine textCenter doorkey">门锁密码</header>
            <div v-show="!changePassword" class="cus-ftColorBlack getDoorKey textCenter">{{doorKey}}</div>
            <div v-show="changePassword" class="cus-ftColorBlack getDoorKey changePassword">
                <div class="iptA cus-flexrow-center" @click="handleClickUl">
                    <div>{{iptA[0]}}</div>
                    <div>{{iptA[1]}}</div>
                    <div>{{iptA[2]}}</div>
                    <div>{{iptA[3]}}</div>
                    <div>{{iptA[4]}}</div>
                    <div>{{iptA[5]}}</div>
                </div>
                <input type="tel" pattern="[0-9]*" class="xInput" v-model="ipt" ref="ipt" id="ipt" autocomplete="off" maxlength=6 @keydown="keydown" />
                <!--<x-input class="xInput" v-model="ipt" ref="ipt" :show-clear="showClear" :max='maxLength' keyboard="number"></x-input>-->
            </div>
            <div class="cus-normal standardLine cus-themeColor doorKeyText textCenter" @click="changeKey">{{doorKeyText}}<span v-show="changePassword" class="standardLine cus-small cus-uncheckedColor">(30s后生效)</span></div>
            <div class="cus-normal cus-uncheckedColor textCenter noticeA standardLine">在门锁上输入密码即可打开房门</div>
            <div class="cus-normal cus-priceColor textCenter standardLine">注意保密，任何人取得此密码都可以打开你的房门</div>
        </header>
    </div>
</div>
</template>
<script>
import {mapState} from "vuex"
import {XHeader,XInput} from "vux"
import {
    roomControlLoadDoorKey,
    getHotelRoomCheckinCustomers,
    changeRoomDoorKey
} from '@/services/axiosapi'
import {storeSet, storeGet} from '@/utils/localStorage'
import {is_weixin} from '@/utils/device'
import {setWechatTitle} from '@/utils/setWechatTitle.js'

export default {
    name: 'DoorKey',
    components: {
        XHeader,
        XInput
    },
    beforeMount(){        
        this.userInfo = storeGet("SH_RoomControl","VerifyInfo")?storeGet("SH_RoomControl","VerifyInfo"):{};
        document.title = this.userInfo.RoomNumber
        setWechatTitle(this.userInfo.RoomNumber)    // 微信端显示的标题

        this.checkInId = this.userInfo.CheckInId;
        this.hotelId = this.userInfo.HotelId;
        let params = {
          memberId: this.userInfo.MemberId,
          roomId: this.userInfo.RoomId
        };
        roomControlLoadDoorKey(params).then(response => {
          if (response.data.Code == 0) {
            this.doorKey = response.data.Content;
            this.changePassword = false;
          } else if (response.data.Code == 22003) {
            this.utils.toast({msg: '密码重置中，请稍后'});
          }
        });
        this.getHotelRoomCheckinCustomers();
    },
    data(){
        return {
            basicInfoPic: storeGet("SH_RoomControl","BasicInfoPic"),
            userInfo: {},
            changePassword: false,
            doorKey: "",
            roomCustomers: [],
            onBlur: false,
            dialogShow: false,
            selfControl: false,
            hotelId: "",
            checkInId: "",
            maxLength: 6,
            showClear: false,
            index: 0,
            ipt: "",
            transmit: false,
            Id: "",
            // 微信端适配补充
            titleBarFlag: !is_weixin(),
            is_weixin: is_weixin()
        }
    },
    computed: {
        userMobile(){
            return storeGet('memberInfo','Phone')
        },
        ...mapState({
            roomNumber: state => state.roomControl.roomNumber
        }),
        doorKeyText(){
            return this.changePassword ? "确认" : "修改密码"
        },
        iptA(){
            return this.ipt.toString()
        }
    },
    methods: {
        dialogHide(){
            this.dialogShow = false
        },
        getHotelRoomCheckinCustomers(){
            let param = {
            OrderId: this.userInfo.OrderId,
            RoomId: this.userInfo.RoomId
            };
            getHotelRoomCheckinCustomers(param).then(response => {
                if(response.data.Success) {
                    let Content = response.data.Content;
                    let roomCustomers = [];
                    Content.forEach((item) => {
                        if(item.Phone==this.userMobile){
                            roomCustomers.unshift(item)
                        }else{
                            roomCustomers.push(item)
                        }
                    });
                    this.roomCustomers = roomCustomers;
                }
            })
        },
        getRoomCustomers(){
            this.getHotelRoomCheckinCustomers();
        },
        changeKey(){
            if(!this.changePassword){
                this.changePassword = true;
                this.$refs.ipt.focus();
                // document.getElementById("ipt").focus();
                console.log(jq("#ipt"));
                jq("#ipt").focus();
                setTimeout(() => {
                    // document.getElementById("ipt").focus();
                    this.$refs.ipt.focus();
                    jq("#ipt").focus();
                }, 100);
            }else{
                    if(this.iptA.length!=6){
                        return
                    }else{
                        let option = {
                            roomId: this.userInfo.RoomId,
                            password: this.ipt
                        }
                        changeRoomDoorKey(option).then(response => {
                            this.doorKey = this.ipt;
                            this.focus = false;
                            this.$refs.ipt.blur();
                            this.changePassword = false;
                        }).catch(err => {
                            console.log('err: ' + err);
                            this.changePassword = true;
                        })
                    }


            };
        },
        handleClickUl(){
            this.$refs.ipt.focus();
        },
        keydown(){
            if(event.keyCode!=8){
                if(event.keyCode>57||event.keyCode<48){
                    event.preventDefault();
                }
            }
        },
    }
}
</script>
<style lang='less' scoped>
@import "../../styles/common/themeSettings";
.bg {
    margin: 10px 15px;
    // padding-top: 40px;
    // padding-bottom: 45px;
    background-color: @panelColor;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    &.isApp{
        top: 64px;
    }
}

.textCenter {
    text-align: center
}

.doorkey {
    margin-top: 50px;
}

header {
    margin-bottom: 25px;
}

.getDoorKey {
    font-size: 24px;
    margin-bottom: 20px;
    line-height: 0.8em;

}

.doorKeyText {
    margin-bottom: 40px;
}

.noticeA {
    margin-bottom: 20px;
}

.iptA{
   width: 100%;
   div {
     display: inline-block;
     list-style: none;
     width: 24px;
     height: 28px;
     font-size: 24px;
     text-align: center;
     line-height: 28px;
     border: 0.7px solid @uncheckedColor;
     overflow: hidden;
     color: @ftColorBlack;
     &:not(:first-child) {
      margin-left: 10px;
     }

  }
}

.changePassword {
    position: relative;
        .xInput {
            position: absolute;
            top: 0;
            left: 0;
            width: 1px;
            height: 1px;
            margin: 0;
            padding: 0;
            opacity: 1;
            border: none;
    }
}
</style>
