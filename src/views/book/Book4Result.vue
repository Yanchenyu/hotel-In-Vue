<template>
  <div class="componentwrap">
    <div class="payresult">
      <!-- 结果提示 -->
      <div v-if="payresult">
        <div class="resulticon">
          <icon type="success" is-msg></icon>
        </div>
        <div class="cus-h2">订单支付成功</div>
      </div>
      <div v-else>
        <div class="resulticon">
          <icon type="warn" is-msg></icon>
        </div>
        <div class="cus-h2">订单支付失败</div>
      </div>
      <!-- 金额 -->
      <div class="totalprice cus-h1">订单金额：<span class="cus-priceColor">￥</span><span
        class="cus-priceColor">{{this.queryInfo.orderFee}}</span></div>
      <!-- 结果操作-->
      <div v-if="payresult" class="cus-normal resultbtn">
        <span @click='checkOrder'>查看订单</span>
        <span @click='homeNav'>回到首页</span>
      </div>
      <div v-else class="cus-normal resultbtn">
        <span @click='checkOrder'>查看订单</span>
        <span class="highlight" @click="payAgain">继续支付</span>
      </div>

      <!-- 下载App提示 -->
      <div class="cus-normal">
        <span>下载App体验我的智慧客房，发现{{hotelName}}之美</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {Icon} from 'vux'
  import {is_weixin} from '@/utils/device'
  import {getPayResult} from '@/services/axiosapi'

  export default {
    name: 'Book4Result',
    beforeMount() {
      this.dataInitial();
      this.dbCheckPayResult();
    },

    components: {
      Icon
    },
    data () {
      return {
        hotelName: '苏遇',
        queryInfo: {
          code: '',  // S:success, F: Fail, C: Cancel: E: error
          orderNo: '',
          orderFee: '',
          orderSubject: '',
          orderDesc: ''
        },
        queryLoaded: false,

        dbQueryLimit: 2,    // 数据库最多查询两次
        timerId: 0,       // setTimeout句柄
      }
    },
    computed: {
      payresult() {
        return this.queryInfo.code == 'S'
      }
    },
    beforeDestroy() {
      clearTimeout(this.timerId);
    },
    methods: {
      // 初始数据
      dataInitial(){
        if(this.$route.query.Code) {
          this.queryInfo = {
            code: this.$route.query.Code,
            orderNo: this.$route.query.order_no,
            orderFee: this.$route.query.order_fee,
            orderSubject: this.$route.query.order_subject,
            orderDesc: this.$route.query.order_desc
          }
          this.queryLoaded = true

          if(this.queryInfo.code != 'S') {
            // url参数非成功标识时，则无需查询数据库
            this.dbQueryLimit = 0;
          }

        } else {
          console.log('no query info ')
          this.queryInfo.orderNo = this.$route.query.order_no;
        }
      },

      // 数据库检查支付结果
      dbCheckPayResult() {
        if(this.dbQueryLimit < 1) {
          return;
        }
        this.dbQueryLimit--;
        console.log(`dbCheckPayResult chance left: ${this.dbQueryLimit}`)
        let option = {
          order_no:this.queryInfo.orderNo
        }
        // 接口查询
        getPayResult(option)
          .then(response => {
            console.log(response)
            if(response.data.ResultCode == 0) {
              // 成功
              this.dbQueryLimit = 0;
              this.queryInfo = {
                code: 'S',
                orderNo: response.data.Data.order_no,
                orderFee: response.data.Data.order_fee,
                orderSubject: response.data.Data.order_subject,
                orderDesc: response.data.Data.order_desc
              }
            } else if(response.data.ResultCode == 1 || response.data.ResultCode == 2){
              // 1 失败 2 异常
              if(this.dbQueryLimit > 0) {
                this.timerId = setTimeout(this.dbCheckPayResult.bind(this), 1000)
              } else {
                // 结果赋值
                if (response.data.Data) { // 非Null判断
                  this.queryInfo = {
                    code: response.data.Data.Code ,
                    orderNo: response.data.Data.order_no,
                    orderFee: response.data.Data.order_fee,
                    orderSubject: response.data.Data.order_subject,
                    orderDesc: response.data.Data.order_desc
                  }
                }
              }
            }
          })
          .catch (err => {
            // TODO
            this.utils.showNetError();
          })
      },
      // 回到首页
      homeNav() {
        this.$router.push({
          name: 'hotelroomlist'
        })
      },

      // 继续支付
      payAgain() {
        let url = location.href;
        let index = url.indexOf("#") - 1;
        let baseUrl = url.split("").splice(0, index).join("");
        location.href = `${baseUrl}/#/hotel/book3preview/${this.queryInfo.orderNo}`
      },
      checkOrder() {
        this.$router.replace({
          name: 'membercenter'
        })
        this.$router.push({
          name: 'orderdetail',
          params: {orderNo: this.queryInfo.orderNo}
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../styles/common/themeSettings';

  .componentwrap {
    background-color: @panelColor;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .payresult {
    text-align: center;
    padding: 0 10px;
    .resulticon {
      margin-top: 70px;
      margin-bottom: 15px;
    }

    .totalprice {
      padding: 5px;
    }

    /* 结果操作 */
    .resultbtn {
      margin: 15px auto 30px auto;
      span {
        display: inline-block;
        padding: 4px 25px;
        color: @themeColor;
        border: 1px solid @themeColor;
        border-radius: 3px;
        margin: 0 10px;

        &.highlight {
          color: @panelColor;
          background-color: @themeColor;
        }
      }
    }
  }
</style>
