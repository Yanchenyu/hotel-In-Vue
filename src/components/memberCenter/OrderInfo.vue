<template>
  <div>
    <card :header="{title:''}">
      <div slot="content" class="card-order-flex card-order-content01">
        <div @click="allOrderclick">
          <icon name="allorder" scale="3" class="svgicon"></icon>
          <br/>
          <span>全部订单</span>
        </div>
        <div @click="noPayOrderclick">
          <icon name="unpaid" scale="3" class="svgicon"></icon>
          <br/>
          <span>待付款</span>
        </div>
        <div @click="unUseOrderclick">
          <icon name="pending" scale="14" class="svgicon" style="color:#25c0b1"></icon>
          <br/>
          <span>待消费</span>
        </div>
        <div @click="usedOrderclick">
          <icon name="saleservice" scale="3" class="svgicon"></icon>
          <br/>
          <span>售后</span>
        </div>
      </div>
    </card>
  </div>
</template>

<script>
  import {Card} from 'vux'
  import {setWechatTitle} from '@/utils/setWechatTitle.js'

  export default {
    name: 'OrderInfo',
    components: {
      Card
    },
    data () {
      return {
        nickname: '张三',
        nameVal: 'mis',
        sexlist: [['男', '女']],
        sexval: ['男'],
        birth: '',
        url: 'https://o3e85j0cv.qnssl.com/tulips-1083572__340.jpg',
        totalNumber: '1000',
        energy: '950',
        memberLevel: '黄金搭档',
        email: ''
      }
    },
    methods: {
      allOrderclick(){
        // N,C,P,HC,F,E,R
        this.$router.push({name: 'orderlist', params: {title: '全部订单', orderstatus: 'N,C,P,HC,I,O,E,R,CS', querymode: 0}})
        setWechatTitle('全部订单');
      },
      noPayOrderclick(){
        this.$router.push({name: 'orderlist', params: {title: '待支付订单', orderstatus: "N", querymode: 1}})
        setWechatTitle('待支付订单');
      },
      unUseOrderclick(){
        this.$router.push({name: 'orderlist', params: {title: '待消费订单', orderstatus: 'N,P,HC', querymode: 2}})
        setWechatTitle('待消费订单');
      },
      usedOrderclick(){
        this.$router.push({name: 'orderlist', params: {title: '售后订单', orderstatus: 'O,R,CS', querymode: 3}})
        setWechatTitle('售后订单');
      }
    }
  }
</script>

<style scoped lang="less">

  /* vux */
  .center {
    text-align: center;
    padding-top: 45px;
    color: #fff;
    font-size: 18px;
  }

  .center img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid #ececec;
  }

  .card-order-flex {
    display: flex;
  }

  .card-order-content01 {
    padding: 5px 5px;
  }

  .card-padding {
    padding: 15px;
  }

  .card-order-flex > div {
    flex: 1;
    text-align: center;
    font-size: 12px;
  }

  .card-order-flex span {
    font-size: 14px;
    color: #7e7b7b;
  }

  .card-order-flex img {
    margin-top: 10px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px solid #ececec;
  }
</style>
