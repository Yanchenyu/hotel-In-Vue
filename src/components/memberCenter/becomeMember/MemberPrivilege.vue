<template>
  <div>
    <nav class="cus-flexrow">
      <icon :name="memberBenefitsIcon[index+1]" scale="30" class="svgicon"></icon>
      <div class="cus-flexcolumn">
        <p style="font-size: 18px;color: #353535">{{benefits[index].Name}}</p>
        <p style="font-size: 14px;color: #7e7b7b">{{benefits[index].Description}}</p>
      </div>
    </nav>
    <p class="introduction">权益介绍</p>
    <article>
      <p v-for="(item,idx) in benefits[index].Detail">
        {{idx + 1}}.{{item}}
      </p>
    </article>
  </div>
</template>
<script>
  import {setWechatTitle} from '@/utils/setWechatTitle.js'
  import {memberBenefitsIcon} from '@/utils/memberIcon'
  import {mapState} from 'vuex'
  export default {
    name: 'MemberPrivilege',
    beforeMount(){
      let index = this.$route.params.index;
      this.index = index;
      let benefits = this.$store.state.memberCenter.memberBenefits;
      setWechatTitle(benefits[index].Name);
    },
    data(){
      return {
        index: '',
        memberBenefitsIcon: memberBenefitsIcon
      }
    },
    computed: {
      ...mapState({
        benefits: state => state.memberCenter.memberBenefits
      })
    }
  }
</script>
<style lang='less' scoped>
  nav {
    background: #fff;
    padding: 21px 10px;
    div {
      justify-content: center;
      margin-left: 10px;
    }
  }

  .introduction {
    width: 100%;
    height: 44px;
    line-height: 44px;
    padding-left: 15px;
    color: #353535;
    font-size: 16px;
  }

  article {
    padding: 15px 15px;
    background: #fff;
    p {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: #353535;
    }

  }

</style>
