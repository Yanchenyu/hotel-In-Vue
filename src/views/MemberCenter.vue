<!-- 会员中心页面 -->
<template>
  <div class="bg cus-flexcolumn">
    <div>
      <HeadInfo></HeadInfo>
      <OrderInfo></OrderInfo>
      <!-- <div style="height:20px; display:block"></div> -->

      <UsedInfo></UsedInfo>
      <section @click="loginBtn" v-if="!is_weixin && !loginStatu"></section>
    </div>
    <div class="loginLogo cus-flexrow-center">
      <img src="@/../static/images/loginLogo.png" width="25%" height="25%"/>
    </div>
    <!--<img src="@/../static/images/defautbackground.png" />-->
  </div>
</template>

<script>
  import HeadInfo from '@/components/memberCenter/HeadInfo.vue'
  import OrderInfo from '@/components/memberCenter/OrderInfo.vue'
  import UsedInfo from '@/components/memberCenter/UsedInfo.vue'

  // 数据接口

  import {fetchMemberInfoAxios, fetchLoadMemberDetailViewByBindIdAxios} from '@/services/axiosapi'
  import {storeGet, storeSet} from '@/utils/localStorage'

  // vuex
  import {mapState} from 'vuex'
  import {is_weixin} from '@/utils/device'
  import {ls_unionId} from '@/utils/localStorage'
  export default {
    name: 'MemberCenter',
    components: {
      HeadInfo, OrderInfo, UsedInfo
    },
    beforeMount () {
      localStorage.setItem("changeMemberHeadImg", false);
      if (!is_weixin()) {
        // 清空缓存数据，并推出页面到登陆页
        // delete localStorage['memberInfo']
        var localmemberInfo = localStorage['memberInfo']
        // TODO 验证 MemberId, RoomId是否仍然有效
        if (localmemberInfo == undefined) {
          this.$store.dispatch("setMemberLoginStatu", false);
          // this.$router.replace({
          //   name: 'Login'
          // })
        }
        console.log("不是微信")
        this.loadMemberInfo()
      } else {
        this.findMember();
      }

    },
    data(){
      return {
        is_weixin: is_weixin()
      }
    },
    computed: {
      ...mapState({
        loginStatu: state => state.memberCenter.memberLoginStatu
      })
    },
    methods: {
      // load会员信息
      loadMemberInfo () {
        let phone = storeGet('memberInfo', 'Phone');
        console.log("loadMemberInfo phone", phone)
        if (!(typeof phone == "undefined")) {
          console.log("loadMemberInfo phone1", phone)
          let params = {}
          params.phone = phone
          fetchMemberInfoAxios(params).then(response => {
            // response TODO 添加异常失败情况检查
            console.log(response)
            if (response.data.Success == true) {
              this.$store.dispatch('setMemberInfo', response.data.Content);
              this.$store.dispatch("setMemberLoginStatu", true);
              let obj = response.data.Content;
              this.saveStorageMember(obj);
            } else {
              // TODO 显示无查询数据
              this.$store.dispatch("setMemberLoginStatu", false);
            }
          }).catch(err => {
            console.log('fetchMemberInfoAxios err:', err);
            this.utils.showNetError();
            this.$store.dispatch("setMemberLoginStatu", false);
          })
        }

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
          // response TODO 添加异常失败情况检查
          console.log(response)
          if (response.data.Success == true) {
            console.log("response.data.Success", response.data.Message);
            this.$store.dispatch('setMemberInfo', response.data.Content);
            this.$store.dispatch("setMemberHeadImg", response.data.Content.Avatar);
            this.$store.dispatch("setMemberLoginStatu", true);
            let obj = response.data.Content;
            this.saveStorageMember(obj);
          } else {
            // TODO 显示无查询数据
            this.$store.dispatch("setMemberLoginStatu", false);
          }
        }).catch(err => {
          this.$store.dispatch("setMemberLoginStatu", false);
        })

      },
      loginBtn(){
        this.$router.push({
          name: 'Login'
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../styles/membercenter.less';

  .bg {
    justify-content: space-between;
    height: 100%;
  }

  .loginLogo {
    width: 100%;
    text-align: center;
    margin-bottom: 45px;
  }

  section {
    position: fixed;
    top: 150px;
    left: 0;
    width: 100%;
    height: 170px;
    z-index: 1000;
  }

</style>
