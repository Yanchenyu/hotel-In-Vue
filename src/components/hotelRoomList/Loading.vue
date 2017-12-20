<template>
  <transition name="vux-mask">
    <div class="weui-loading_toast" v-show="show">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast" :style="{ position: position }">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">加载中
          <slot></slot>
        </p>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'Loading',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      text: String,
      position: String
    },
    created () {
      this.show = this.value
    },
    data () {
      return {
        show: false
      }
    },
    watch: {
      value (val) {
        this.show = val
      },
      show (val) {
        this.$emit('input', val)
      }
    }
  }
</script>

<style lang="less" scoped>

  .weui-icon_toast.weui-loading {
    margin: 5px 0 0;
    width: 38px;
    height: 38px;
    vertical-align: baseline;
    display: inline-block;
  }

  .weui-toast {
    min-height: 80px;
    width: 110px;
    top: 240px;
  }

  .vux-mask-enter, .vux-mask-leave-active {
    opacity: 0;
  }

  .vux-mask-leave-active, .vux-mask-enter-active {
    transition: opacity 300ms;
  }
</style>
