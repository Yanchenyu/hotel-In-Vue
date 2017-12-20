
<template>
  <div class="view-wrap">
    <x-header  :left-options="{showBack: false}"
               class="xheader vux-override" style="background-color:#25c0b1;" >
      使用优惠
      <span slot="left" style="color: white;" @click="handleClose"><div class="left-arrow"></div>&nbsp;&nbsp;&nbsp;&nbsp;返回</span>
      <span slot="right" style="color: white;" @click="handleClose">完成</span>
    </x-header>

    <div class="cus-flexrow discountItem" v-for="(item, index) in coupons" @click="couponHandleClick(index, item.Rate)">
      <div>
        <div class="cus-h1 cus-ftColorBlack">{{item.Name}}</div>
        <div class="cus-small cus-ftColorBlack3">{{item.Description}}</div>
        <div class="cus-small cus-ftColorBlack3">有效期：{{item.StartDate}} - {{item.EndDate}}</div>
      </div>
      <div>
        <icon v-if="couponIndex == index" name="raw-checked" scale="2" class="svgicon" style="color:#25c0b1"></icon>
        <icon v-else name="raw-unchecked" scale="2" class="svgicon" style="color:#a5a2a2"></icon>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import {XHeader} from 'vux'
  export default {
    name: 'DiscountSelect',
    props:{
      // 优惠券
      coupons: {
        type: Array,
        default(){
          return [{
            StartDate:'',
            EndDate:'',
            Name: '好想住会员85折',
            Description: '好想住会员享受85折优惠，不可叠加使用',
            Rate: 0.85
          },{
            StartDate:'',
            EndDate:'',
            Name: '新店开张7折',
            Description: '新店开张7折，不可叠加使用',
            Rate: 0.7
          }]
        }
      }
    },
    components: {
      XHeader
    },
    data() {
      return {
        couponIndex: -1,
        discountRate: 1
      }
    },

    methods: {
      // 优惠券点击选择/取消选择
      couponHandleClick(idx, rate) {
        if(this.couponIndex == idx) {
          this.couponIndex =  -1;
          this.discountRate = 1;
        } else {
          this.couponIndex = idx;
          this.discountRate = rate;
        }
      },
      // 关闭选择
      handleClose() {
        this.$emit('confirmCouponSelect', this.couponIndex, this.discountRate)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../styles/common/themeSettings";
  .view-wrap {

    /* 优惠选项 */
    .discountItem {
      background-color: white;
      margin: 10px 10px 0;
      border-radius: 8px;
      padding: 10px;
      /* 左边文字 */
      &>div:first-child {
        padding-top: 1px;
        padding-bottom: 2px;
        /*line-height: 1em;*/
        flex:1;
      }
    }
  }
</style>
