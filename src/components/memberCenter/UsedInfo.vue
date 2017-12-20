<template>
  <div>
    <div v-if="0" class="video_div">

      <div style="margin-bottom:10px;height:44px; ">
        <span style="font-size:16px;padding-left:10px;">拥有智慧家</span>
      </div>
      <div class="thinLine"></div>
      <div v-if="0" class="video_div">
        <!--<md-card>
          <md-card-media>-->
        <div class="item">
          <div class="player">
            <video-player ref="videoPlayer"
                          :options="playerOptions"
                          @play="onPlayerPlay($event)"
                          @pause="onPlayerPause($event)"
                          @ended="onPlayerEnded($event)"
                          @loadeddata="onPlayerLoadeddata($event)"
                          @waiting="onPlayerWaiting($event)"
                          @playing="onPlayerPlaying($event)"
                          @timeupdate="onPlayerTimeupdate($event)"
                          @canplay="onPlayerCanplay($event)"
                          @canplaythrough="onPlayerCanplaythrough($event)"
                          @ready="playerReadied"
                          @statechanged="playerStateChanged($event)">
            </video-player>
          </div>
        </div>
        <!--</md-card-media>
      </md-card>  -->
      </div>
    </div>
    <div style="background-color:white;padding: 0;margin-top:0;margin-bottom:60px;position:relative">
      <group gutter='10px'>
        <div @touchstart="touchStart(1)" @touchend="touchEnd(1)">
          <cell class="cus-normal vux-override pubClass" :class="{focus:index==1}" :title="'好想住会员'" link="/membercenter/component/BecomeMemberInfo"
                is-link></cell>
        </div>
        <div class="thinLine"></div>
        <div @touchstart="touchStart(2)" @touchend="touchEnd(2)">
          <cell class="cus-normal   vux-override pubClass" :class="{focus:index==2}" :title="'智慧能量'" link="/membercenter/component/SmartEnergyInfo"
                is-link>
          </cell>
        </div>
        <div style="position: absolute;top:44px;left:0;height:2px;width: 100%;background: #eee" v-show="showLine"></div>
      </group>
    </div>
  </div>
</template>

<script>
  import {Cell, Group} from 'vux'
  import {videoPlayer} from 'vue-video-player'


  export default {
    name: 'UsedInfo',
    components: {
      Group,
      videoPlayer,
      Cell
    },
    data () {
      return {
        showLine: false,
        index: "",
        playerOptions: {

          // component options
          start: 0,
          playsinline: true,

          // videojs options
          muted: false,
          language: 'zh-CN',
          // live:true,
          // autoplay: true,
          // playbackRates: [0.7, 1.0, 1.5, 2.0],
          height: 240,
          sources: [{
            type: "video/mp4",
            src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
          }],
          // poster: "/static/images/author.jpg",
        }

      }
    },
    mounted() {
      // console.log('this is current player instance object', this.player)
      setTimeout(() => {
        // console.log('dynamic change options', this)
        this.playerOptions.muted = false
      }, 2000)
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },
    methods: {
      onClick () {
        console.log('on click')
      },
      // listen event
      onPlayerPlay(player) {
        // console.log('player play!', player)
      },
      onPlayerPause(player) {
        // console.log('player pause!', player)
        player.pause();
      },
      onPlayerEnded(player) {
        // console.log('player ended!', player)
      },
      onPlayerLoadeddata(player) {
        // console.log('player Loadeddata!', player)
      },
      onPlayerWaiting(player) {
        // console.log('player Waiting!', player)
      },
      onPlayerPlaying(player) {
        // console.log('player Playing!', player)
      },
      onPlayerTimeupdate(player) {
        // console.log('player Timeupdate!', player.currentTime())
      },
      onPlayerCanplay(player) {
        // console.log('player Canplay!', player)
      },
      onPlayerCanplaythrough(player) {
        // console.log('player Canplaythrough!', player)
      },

      // or listen state event
      playerStateChanged(playerCurrentState) {
        // console.log('player current update state', playerCurrentState)
      },

      // player is ready
      playerReadied(player) {
        console.log('example 01: the player is readied', player)
      },
      touchStart(e){

          this.showLine = true
          this.index = e;

      },
      touchEnd(e){

          this.showLine = false;
          this.index = "";
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../styles/common/themeSettings.less';

  .video_div {
    background-color: #ffffff;
    padding: 5px 5px;
    margin-top: 10px;
    color: #353535;
    // height: 169px;

  }

  .pubClass {
    padding: 0 10px;
  }

  .focus {
    background: #eee;
  }

</style>
