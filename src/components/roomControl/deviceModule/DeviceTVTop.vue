<template>
  <div>
    <div class="outer cus-flexrow-center">
      <div class="previous cus-flexrow-center" @click='previousClick'>
        <icon name="previous" scale="3" class="svgicon"></icon>
      </div>
      <div class="inner cus-flexrow-center cus-panelColor">OK</div>
      <div class="next cus-flexrow-center" @click='nextClick'>
        <icon name="next" scale="3" class="svgicon"></icon>
      </div>
      <div class="plus cus-flexrow-center" @click='plusClick'>
        <icon name="plus" scale="12" class="svgicon"></icon>
      </div>
      <div class="minus cus-flexrow-center" @click='minusClick'>
        <icon name="minus" scale="10" class="svgicon"></icon>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DeviceTVTop',
    props: {
      deviceStatus: {
        type: Boolean
      }
    },
    data(){
      return {}
    },
    methods: {
      previousClick(){
        if (this.deviceStatus) {

        }
      },
      nextClick(){
        if (this.deviceStatus) {

        }
      },
      plusClick(){
        if (this.deviceStatus) {

        }
      },
      minusClick(){
        if (this.deviceStatus) {

        }
      },
    }
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
    width: 57px;
    height: 57px;
    border-radius: 50%;
    border: 0;
    background-color: #25c0b1;
    font-size: 15px
  }

  .previous {
    position: absolute;
    top: -10px;
    width: 80px;
    height: 60px;
    text-align: center;
  }

  .next {
    position: absolute;
    bottom: -10px;
    width: 80px;
    height: 60px;
    text-align: center;
  }

  .plus {
    position: absolute;
    left: -14px;
    width: 80px;
    height: 60px;
    text-align: center;
  }

  .minus {
    position: absolute;
    right: -14px;
    width: 80px;
    height: 60px;
    text-align: center;
  }

</style>


