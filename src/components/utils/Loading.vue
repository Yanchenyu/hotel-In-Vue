<template>
    <div class="bg" v-show="loading">
        <img src="../../../static/images/loading.png" width="100px" />
        <div class="cus-normal">加载中...</div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
    computed: {
        ...mapState({
            loading: state => state.loading
        })
    }
}
</script>
<style lang='less' scoped>
@import "../../styles/common/themeSettings";
.bg {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 50px;
    right: 0;
    z-index: 999999;
    background-color: @panelColor;
    text-align: center;
    img {
        margin-top: 130px;
    }
}
</style>