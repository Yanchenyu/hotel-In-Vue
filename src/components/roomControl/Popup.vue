<template>
  <div>
    <div class="cus-mask" @click="hideOnBlur && (currentValue = false)" v-show="currentValue"></div>
    <div class="cus-dialog" v-show="currentValue" :style="">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Popup',
    props: {
      hideOnBlur: {
        type: Boolean,
        default: true
      },
      value: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        currentValue: false
      }
    },
    methods: {},
    watch: {
      // 监听来自外部的v-model切换
      value: {
        handler: function (val) {
          this.currentValue = val
        },
        immediate: true
      },
      // 内部变化，通知外部进行更新
      currentValue: function (val) {
        //this.$emit(val? 'on-show':'on-hide')
        this.$emit('input', val)
      }
    },
    // created() {

    // }
  }
</script>

<style lang="less" scoped>
  .cus-mask {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  .cus-dialog {
    position: fixed;
    z-index: 1100;
    // 先不支持weex
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    // text-align: center;
    // max-width: 90%;
    // width: 98vw;
    // background-color: white;
  }
</style>
