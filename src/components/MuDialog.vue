<template>
<div class="museOverride">
  <mu-dialog :open="open" dialogClass="loginDialogClass" bodyClass="bodyClass" actionsContainerClass="buttonClass">
    <div>{{dialogTextLeft}}</div>
    <div style="text-align:center">{{dialogTextCenter}}</div>  
  <mu-flat-button label="确定" slot="actions" primary @click="close"/>
  </mu-dialog>
</div>
</template>
<script>
export default {
  props: {
    open: {
      type: Boolean
    },
    dialogTextLeft: {
      type: String
    },
    dialogTextCenter: {
      type: String
    }
  },
  methods: {
    close () {
      this.$emit('close');
    }
  }
}
</script>
<style lang='less' scoped>
</style>