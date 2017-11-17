/* eslint-disable */
<template>
  <div id="app">
    <app-header></app-header>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view  v-if="!$route.meta.keepAlive"></router-view>
    <MuDialog :open="open" :dialogTextCenter="dialogText" @close="close(name)"></MuDialog>
  </div>
</template>

<script>
  import appHeader from './components/Header'
  import store from './store/index'
  import MuDialog from '@/components/MuDialog.vue'
  import {mapState} from 'vuex'
  export default {
    name: 'app',
    store: store,
    components: {
      appHeader,
      MuDialog
    },
    computed: {
      ...mapState({
        open: state => state.muDialog.open,
        dialogText: state => state.muDialog.dialogText,
        name: state => state.muDialog.name
      })
    },
    methods: {
      close (name) {
        this.$store.dispatch('setDialog', [false, '', '']);
        if (name != '') {
          this.$router.replace({
            name: name
          });
        };
      }
    }
  }
</script>

<style lang="less">
  @import './styles/common/basic.less';
  @import "./styles/common/museOverride.less";
</style>
