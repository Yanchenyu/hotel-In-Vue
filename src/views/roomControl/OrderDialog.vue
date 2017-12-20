<template>
    <div class="dialog">
        <x-dialog
        :title="''"
        v-model="dialogShow">
        <div class="weui-dialog__bd">
            <p class="cus-flexrow-center" style="text-align:center;font-size:16px">现在将<span v-if="roomNumber==''">你的</span>{{roomNumber!=''?roomNumber:""}}房间客房码<img @click="questionClick" src="@/../static/images/question.png" width="14px" height="14px" />转交给</p>
            <x-input class="cus-h1 xInput" is-type="china-mobile" v-model="mobile" keyboard="number" placeholder="请输入手机号"></x-input>
            <div v-show="errMessShow" class="errMess cus-flexrow-center cus-normal standardLine">{{errMess}}</div>
            <div class="text3 cus-normal cus-ftColorBlack3"><span>上面被转交的手机号会收到客房码，得到客房控制权</span><span v-show="!selfControl">。</span><span v-show="selfControl">，<span class="cus-priceColor">你将失去控制权。</span></span></div>
        </div>
        <div class="weui-dialog__ft">
            <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default cus-h1" style="color: #25c0b1" @click="giveUp">放弃</a>
            <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default cus-h1" style="color: #25c0b1" @click="confirm">确认转交</a>
        </div>
        </x-dialog>
    </div>
</template>
<script>
import {XDialog,XInput} from "vux"
import {storeSet, storeGet} from '@/utils/localStorage'
import {
    fetchRoomCodeTransferAxios,
    fetchRoomCodeDistributeAxios
} from '@/services/axiosapi'

export default {
  name: 'OrderDialog',
    components: {
        XDialog,
        XInput
    },
    props: {
        dialogShow: {
            type: Boolean
        },
        selfControl: {
            type: Boolean
        },
        hotelId: {
            type: String
        },
        checkInId: {
            type: String
        },
        roomNumber: {
            type: String
        },
        transmit: {
            type: Boolean
        }
    },
    beforeMount(){
        this.mobile = "";
    },
    data(){
        return {
            mobile: "",
            errMess: "",
            errMessShow: false
        }
    },
    watch: {
        dialogShow(){
            this.mobile = "";
            this.errMessShow = false;
        }
    },
    methods: {
        questionClick(){
            this.$router.push({
                name: "RoomCode"
            })
        },
        giveUp(){
            this.mobile = "";
            this.$emit("dialogHide");
        },
        confirm(){
            if(!this.checkPhone()){
                return
            };
            let params = {
                    HotelId: this.hotelId,
                    checkinId: this.checkInId,
                    Recipient: this.mobile
            };
            if(this.selfControl){

                fetchRoomCodeTransferAxios(params).then(response => {
                    if(response.data.Success){
                        this.message = "";
                        this.$emit("dialogHide");
                        storeSet("SH_RoomControl","VerifyInfo", {})
                        localStorage.removeItem("firstIntoRoomControl");
                        this.$store.dispatch('keepAlivePageDel', 'RoomControl')
                        this.$router.replace({
                            name: 'roomcontrol'
                        });
                    }else{
                        this.errMessShow = true;
                        this.errMess = response.data.Message;
                    }
                }).catch(err => {
                    console.log(err);
                })
            }else{
                if(this.transmit){
                    //转交客房码
                    fetchRoomCodeTransferAxios(params).then(response => {
                        if(response.data.Success){
                            this.$emit("dialogHide");
                            this.$emit("getRoomCustomers");
                        }else{
                            this.errMessShow = true;
                            this.errMess = response.data.Message;
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                }else{
                    //分发客房码
                    fetchRoomCodeDistributeAxios(params).then(response => {
                        if(response.data.Success){
                            this.$emit("dialogHide");
                            this.$emit("getRoomCustomers");
                        }else{
                            this.errMessShow = true;
                            this.errMess = response.data.Message;
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                }

            }
        },
        checkPhone(){
            var length = this.mobile.length;
            if(length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(this.mobile) ){
                return true;
            }else{
                return false;
            }
        }
    },
    computed: {

    }
}
</script>
<style lang='less' scoped>
@import "../../styles/common/themeSettings";
p {
    text-align: center;
    margin-bottom: 10px;
    line-height: 1em;
    align-items: center;
}

img {
    display: inline-block;
    margin-left: 6px;
    margin-right: 12px;
}

.xInput {
    border-bottom: 1px solid @splitColor;
    padding: 0;
    height: 40px;
}



.dialog .weui-dialog__bd:first-child {
    padding: 39px 25px;
}

.dialog .weui-input {
   margin-top: 10px !important;
}

.text3 {
    text-align: left;
    margin-top: 10px;
    div {
        display: inline-block;
    }
}

.errMess {
    margin-top: 10px;
    color: #ff7c8e;
}
</style>
