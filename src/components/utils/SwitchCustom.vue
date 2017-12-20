<template>
  <!-- 自定义switch 组件-->
  <div class="cus-component-switch-wrap">
    <input type="checkbox" v-model="currentValue" class="cus-component-switch"/>
  </div>
</template>

<script>
  export default{
    name: 'SwitchCustom',
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        currentValue: this.value
      }
    },

    watch: {
      currentValue (val) {
        this.$emit('input', val)
        this.$emit('on-change', val)
      },
      value (val) {
        this.currentValue = val
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../styles/common/themeSettings.less';

  @wid: 68px;
  @hgt: 30px;

  .cus-component-switch {
    position: relative;
    width: @wid+2px;
    height: @hgt + 2px;
    border: 1px solid #dfdfdf;
    outline: 0;
    border-radius: @hgt/2 + 1px;
    box-sizing: border-box;
    background-color: #dfdfdf;
    transition: background-color .1s, border .1s;
    -webkit-transition: background-color .1s, border .1s;
  }

  /* 去除默认checkbox 显示样式 */
  .cus-component-switch {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  .cus-component-switch::before {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    width: @wid;
    height: @hgt;
    border-radius: @hgt/2;

    /*background: linear-gradient(to right, blue, red);*/
    background: #fdfdfd url("../../../static/images/memberCenter/pwdSwitchDot.png") no-repeat 100% 100%;
    background-size: 100% 100%;

    -webkit-transition: -webkit-transform .35s cubic-bezier(.45, 1, .4, 1);
    transition: -webkit-transform .35s cubic-bezier(.45, 1, .4, 1);
    transition: transform .35s cubic-bezier(.45, 1, .4, 1);
    transition: transform .35s cubic-bezier(.45, 1, .4, 1), -webkit-transform .35s cubic-bezier(.45, 1, .4, 1);
  }

  .cus-component-switch::after {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    width: @hgt;
    height: @hgt;
    border-radius: @hgt/2;
    background-color: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .4);

    -webkit-transition: -webkit-transform .35s cubic-bezier(.4, .4, .25, 1.35);
    transition: -webkit-transform .35s cubic-bezier(.4, .4, .25, 1.35);
    transition: transform .35s cubic-bezier(.4, .4, .25, 1.35);
    transition: transform .35s cubic-bezier(.4, .4, .25, 1.35), -webkit-transform .35s cubic-bezier(.4, .4, .25, 1.35);
  }

  .cus-component-switch:checked {
    border-color: @themeColor !important;
    background-color: @themeColor !important;
    background: url("../../../static/images/memberCenter/pwdSwitchabc.png") no-repeat 100% 100%;
    background-size: 100% 100%;
  }

  .cus-component-switch:checked:before {
    /* 隐藏原有背景 */
    transform: scale(0);
  }

  .cus-component-switch:checked::after {
    /* 移动按钮 */
    transform: translateX(@wid - @hgt);
  }


</style>
