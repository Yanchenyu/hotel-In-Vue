<template>
  <div>
    <div class="outer cus-flexrow-center">
      <icon :name="deviceData.iconName" :scale="deviceData.scale" class="svgicon"></icon>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DeviceCurtainTop',
    data(){
      return {
        deviceData: {
          iconName: 'roomcontrol/device-curtain',
          scale: 16
        }
      }
    },
    methods: {}
  }
</script>

<style lang="less" scoped>
  .outer {
    width: 192px;
    height: 192px;
    border-radius: 50%;
    border: 2px solid #bfbfbf;
    margin: 80px auto 15px auto;
    position: relative;
  }

  .inner {
    width: 89px;
    height: 89px;
    border-radius: 50%;
    border: 0;
    background-color: #25c0b1;
    font-size: 45px
  }

</style>


