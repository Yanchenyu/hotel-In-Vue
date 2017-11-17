<template>
<div class="hotelRoomLogin museOverride">
  <article>
    <div class="cus-flexrow">
        <div class="menuTitle">房费</div>
        <mu-text-field hintText="输入房费总额" v-model="roomCharge" :underlineShow='underlineShow' hintTextClass='hintTextClass' inputClass='inputClass'/>
    </div>
    <div class="cus-flexrow">
      <div class="menuTitle">押金</div>
      <mu-text-field hintText="输入押金" v-model="deposit" :underlineShow='underlineShow' hintTextClass='hintTextClass' inputClass='inputClass'/>
    </div>
    <div class="remark cus-flexrow">
      <div class="menuTitle">备注</div>
      <textarea v-model="remarkText" maxlength="20" rows="2" class="inputText" />
    </div>
  </article>
  <div class="confirm" @click="confirm">
    <mu-raised-button label="已支付确认" class="login-raised-button" />
  </div>
</div>
</template>
<script>
// import {mapState} from 'vuex'
export default {
  beforeMount () {
    this.initialData();
  },
  data () {
    return {
      underlineShow: false,
      roomCharge: '',
      deposit: '',
      remarkText: ''
    }
  },
  methods: {
    confirm () {
      let option = {
        roomCharge: this.roomCharge,
        deposit: this.deposit,
        remarkText: this.remarkText
      };
      this.$store.dispatch('setOrderRemark', option);
      this.$store.dispatch('setOrderStatus', 'P');
      this.$router.push({
        name: 'hotelRoomLogin'
      })
    },
    initialData () {
      this.roomCharge = this.$store.state.hotelRoomData.hotelOrderData.orderMessage.roomCharge;
      this.deposit = this.$store.state.hotelRoomData.hotelOrderData.orderMessage.deposit;
      this.remarkText = this.$store.state.hotelRoomData.hotelOrderData.orderMessage.remarkText;
      this.$store.dispatch('reloadHotelRoomLoginData', false);
    }
  }
}
</script>
<style lang='stylus' scoped>
@import "../../styles/common/themeSettings.styl"
.hotelRoomLogin
  margin-top 44px
article
  .remark
    height 64px
    align-items flex-start
    .inputText
      width 254px
      height 44px
      margin-top 9px
      border 0
.confirm
  margin 30px auto
  width 355px
  .login-raised-button
    font-size $ftSize4
    height 44px
    width 100%
    border-radius 6px
    background-color $themeColor
    color $panelColor
</style>