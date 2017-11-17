<template>
<div class="bg cus-flexcolumn museOverride">
  <div class="page-wrap">
    <section>
      <img src="../../../static/images/hotelMaster.png" width="200px" />
    </section>
    <div class="input-wrap loginInputStyle">
      <mu-text-field hintText="请输入手机号" v-model="phone" hintTextClass="hintText" @focus="phoneFocus" :inputClass="muText" :underlineClass="{errorLine: error=='phoneError'}"></mu-text-field>
      <mu-text-field hintText="请输入密码" v-model="password" type="password" hintTextClass="hintText" :inputClass="muText" :underlineClass="{errorLine: error=='passwordError'}"></mu-text-field>
    </div>
    <div class="forgetPassword cus-ftSize2" @click="open">忘记密码</div>
    <MuDialog :open="dialog" :dialogTextLeft="dialogText" @close="close"></MuDialog>
    <div class="btn-wrap" @click="loginSubmit">
      <mu-raised-button label="主人登录" :fullWidth="true" class="login-raised-button" :class="{noLogin: phone==''||password==''}" />
    </div>
    <div class="notification cus-ftSize2">{{notification}}</div>
  </div>
  <footer v-show="logoShow">
    <img src="../../../static/images/hotelBottomLogo.png" width="100px" />
  </footer>
</div>
</template>
<script>
  import {hotelMasterLogin} from '@/services/axiosapi'
  import md5 from 'blueimp-md5'
  import MuDialog from '@/components/MuDialog.vue'
  import {storeSet, storeGet} from '@/utils/localStorage'
  export default {
    components: {
      MuDialog
    },
    beforeMount () {
      if (storeGet('HotelMaster', 'UserData')) {
        let userName = storeGet('HotelMaster', 'UserData').UserName;
        this.phone = userName;
      }
      // 如果有缓存，直接调用用户名手机号
    },
    data () {
      return {
        muText: ['muText'],
        phone: '',
        password: '',
        notification: '',
        error: '',
        dialog: false,
        dialogText: '本密码与好想住密码一致，请至好想住APP修改密码确认',
        scrollHeight: document.body.scrollHeight,
        logoShow: true
      }
    },
    methods: {
      loginSubmit () {
        // TODO add valid condition
        let phone = this.phone;
        let password = this.password;
        if (phone == '' || password == '') {
          return
        }
        if (isNaN(phone) || phone.length != 11) {
          this.notification = '请输入正确的手机号'
          this.error = 'phoneError'
          return
        }
        var passwordHash = md5(password);
        let params = {
          userName: this.phone,
          password: passwordHash
        }
        // let params = {
        //   userName: 'thinkia',
        //   password: 'E10ADC3949BA59ABBE56E057F20F883E'
        // };
        // 暂时测试使用虚拟数据
        hotelMasterLogin(params).then(response => {
          console.log(response.data);
          if (response.data.ResultCode == 0) {
            this.$store.dispatch('setHotelMasterUserData', response.data.Data);
            this.$store.dispatch('setHotelRoomMes', {'token': response.data.Data.Token});
            storeSet('HotelMaster', 'UserData', response.data.Data);
            this.$router.push({
              name: 'roomList'
            });
          } else {
            this.notification = response.data.ErrorMessage;
          }
        }).catch(err => {
          console.log(err);
        })
      },
      open () {
        this.dialog = true
      },
      close () {
        this.dialog = false
      },
      phoneFocus () {
        this.error = '';
        this.notification = '';
      }
    },
    mounted () {
      var h = this.scrollHeight;
      window.onresize = () => {
        if (document.body.scrollHeight < h) {
          this.logoShow = false;
        } else {
          this.logoShow = true;
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  *
    flex-direction column
    align-items center

  .bg
    height 100%
    justify-content space-between

  .page-wrap
    margin-top 95px
    section
      text-align center
      height 40px
    .input-wrap
      margin-top 41px
      width 100%;
      padding 0 30px

  .forgetPassword
    display inline-block
    margin-top 15px
    margin-left 30px
    height 17px
    color #666    
    border-bottom 0.7px dashed #666
    line-height 14px

  /* 按钮样式*/
  .btn-wrap
    margin-top 40px
    padding 0 30px
    .login-raised-button
      font-size 18px
      height 44px
      border-radius 6px
    .noLogin 
      background-color #92dfd8 !important;
  
  .notification
    text-align center 
    line-height 1em
    margin-top 15px
    color #ff7c8e

  footer
    width 100%
    line-height 1em
    text-align center
    margin-bottom 35px
</style>
