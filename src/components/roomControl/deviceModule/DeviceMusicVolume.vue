<template>
  <div class="volume cus-flexwrap-center">
    <img style="margin-right: 10px" src='../../../assets/images/minus.png'/>
    <div>
      <range style="position: static;width: 255px;margin: 0 auto;" class="range" v-model="volume" :min='10' :max='100'
        minHTML="<span style='display:none'></span>" maxHTML="<span style='display:none'></span>"></range>
    </div>
    <img style="margin-left: 10px" src='../../../assets/images/plus.png'/>
  </div>
</template>

<script>
  import {Range} from 'vux'

  export default {
    name: 'DeviceMusicVolume',
    components: {
      Range      
    },
    props:{
      vol: {
        type: Number,
        default: 50
      }
    },
    data () {
      return {
        volume: this.vol,
      }
    },
    watch: {
      // 内部变化通知，外部更新
      volume(val){
        console.log(val);
        this.$emit('volumeChangedTo', val)
      },
      // 外部变化，通知内部同步
      vol(val) {
        this.volume = val;
      }
    },
    methods: {

    }
  }
</script>

<style lang="less" scoped>
  .volume {
    width: 100%;
    height: 50px;
    margin-top: 60px;
    text-align: center;
  }

  .range {
    position: static;
    width: 255px;
    margin: 0 auto;
  }

  img {
    display: inline-block;
  }

</style>
