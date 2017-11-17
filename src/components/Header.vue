<template>
  <div>
    <div class="header" v-if="showHeader">
      <div class="cus-flexrow back" v-if="isBack" @click="goBack">
        <img src="@/../static/images/back.png" height="25px" width="25px" />
        <span>{{this.$route.name=='roomList'?'退出客栈':'返回'}}</span>
      </div>
      <span>{{title}}</span>
      <div class="cus-flexrow maintain" v-if="isMaintain" @click="goMaintain">
        <span>维护</span>
        <img src="@/../static/images/back.png" height="25px" width="25px" />
      </div>
    </div>
  </div>
</template>

<script>
  import {pageTitle} from '@/utils/headerTitle'
  import {mapState} from 'vuex'
  export default {
    computed: {
      ...mapState({
        isGoMaintain: state => state.hotelRoomData.isGoMaintain,
        maintenBack: state => state.hotelRoomData.maintenBack
      }),
      // 是否显示标题
      showHeader () {
        if (pageTitle.hasOwnProperty(this.$route.name)) {
          return true
        } else {
          return false
        }
      },
      // 标题内容
      title () {
        if (pageTitle.hasOwnProperty(this.$route.name)) {
          if (pageTitle[this.$route.name].name != '') {
            // 如果有title，那就加载
            return pageTitle[this.$route.name].name
          } else {
            // 如果没有title，就加载动态title
            return this.$store.state.routerTitle
          }
        } else {
          return ''
        }
      },
      isBack () {
        if (pageTitle.hasOwnProperty(this.$route.name)) {
          return pageTitle[this.$route.name].back
        }
      },
      isMaintain () {
        if (pageTitle.hasOwnProperty(this.$route.name)) {
          if (this.$route.name == 'hotelRoomLogin') {
            return this.isGoMaintain
          } else {
            return pageTitle[this.$route.name].maintain
          }
        }
      }
    },
    methods: {
      // 后退
      goBack () {
        if (this.$route.name === 'maintenance') {
          // 维修页面的back按钮要特殊讨论
          if (this.maintenBack) {
            this.$router.go(-1)
          } else {
            this.$router.push({
              name: 'roomList'
            })
          }
        } else if (this.$route.name === 'hotelRoomLogin') {
          this.$router.push({
            name: 'roomList'
          })
        } else if (this.$route.name === 'roomList') {
          this.$router.push({
            name: 'login'
          })
        } else {
          this.$router.go(-1)
        }
      },
      // 去维修
      goMaintain () {
        this.$router.push({
          name: 'maintenance'
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import "../styles/common/themeSettings.styl"
  .header 
    background-color $themeColor
    color $panelColor
    height 44px
    line-height 44px
    text-align center
    font-size $ftSize4
    position absolute
    top 0
    left 0
    width 100%
    z-index 100
    &>span
      font-size 20px
    .back
        position absolute
        left 4px
        top 0
        color $panelColor
        align-items center
        span
            display inline-block
            font-size $ftSize3
    .maintain
        position absolute
        right 4px
        top 0
        color $panelColor
        align-items center
        span
            display inline-block
            font-size $ftSize3
        img
            transform rotate(180deg)
</style>
