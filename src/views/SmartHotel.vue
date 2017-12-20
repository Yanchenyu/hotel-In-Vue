<!-- 智慧酒店页面 -->
<template>
  <div>
    <!-- 轮播活动展示区域 -->
    <!--<Banner></Banner>-->
    <!-- 酒店信息描述 -->
    <!--<SmartHotelDesc></SmartHotelDesc>-->
    <div class="headerTop" :class="{weixin:is_weixin}"></div>
    <header class="cus-flexrow" :class="{weixin:is_weixin}">
      <div class="cus-flexrow">
        <section :class="{localCity:index==num,recommandCity:index!=num}" @click="chooseCity(num)" v-for="(item,num) in cityArr">{{item}}</section>
        <section class="recommandCity moreArea cus-flexrow" @click="jumpToCity">
          更多城市
          <span class="triangle-down"></span>
        </section>
      </div>
    </header>
    <article :class="{weixin:is_weixin}">
    <!--<scroller lock-x use-pulldown :pulldown-config="pullDown" ref="scroller" @on-pulldown-loading="onScrollBottom" :height="scrollerHeight">
        <div>
          <div class="loading">
            <img src="@/../static/images/loginLogo.png" height="40px"/>
          </div>-->
          <section class="smartBanner" v-for="(item,index) in hotelList">
            <div class="banner" @click="jumpToHotel(item.HotelNo)">
              <Banner :imgList="item.BannerList" :isAuto="index=='0'"></Banner>
              <!--<img :src="item.BannerList[0]" width="100%" height="100%" />-->
            </div>
            <div v-if="item.LowestDiscount" class="discount cus-small" @click="jumpToHotel(item.HotelNo)"><span class="standardLine">{{item.LowestDiscount}}</span>折</div>
            <div v-if="item.LowestDiscount" class="discountBugle"></div>
            <div v-if="item.HowToPlay" class="howToPlay cus-small" :class="{noDisCount: item.LowestDiscount==''}" @click="jumpToHowToPlay(item.HotelNo)">怎么玩</div>
            <div v-if="item.HowToPlay" class="howToPlayBugle" :class="{noDisCount: item.LowestDiscount==''}"></div>
            <div class="hotelMes cus-flexcolumn">
              <div class="hotelDes cus-flexrow">
                <span class="hotelName cus-huge">{{item.HotelName}}</span>
                <div class="hotelPrice" @click="jumpToHotel(item.HotelNo)">
                  <span class="lowestPrice cus-h2 cus-priceColor standardLine"><span class="cus-small cus-priceColor">¥</span>{{item.LowestPrice}}</span>
                  <span class="cus-small">起</span>
                </div>
              </div>
              <div class="hotelContact cus-normal cus-flexrow">
                <icon @click="contact(item.Phone)" v-if="item.Phone" name="telephone" scale="1.4" class="phoneIcon standardLine"></icon>
                <span @click="contact(item.Phone)" v-if="item.Phone" class="telephone standardLine">{{item.Phone}}</span>
                <icon @click="goHotel(item.shp_Latitude_Gd,item.shp_Longitude_Gd,item.HotelName)" v-if="item.Address" name="location" scale="6" class="addressIcon standardLine"></icon>
                <span @click="goHotel(item.shp_Latitude_Gd,item.shp_Longitude_Gd,item.HotelName)" v-if="item.Address" class="address standardLine cus-flexrow">{{item.Address}}</span>
              </div>
            </div>
            <div v-if="index==notAnyMore" class="notAnyMore cus-small cus-ftColorBlack3">没有更多智慧酒店</div>
          </section>
        <!--</div>
    </scroller>-->
    </article>
    <div v-show="noHotel" class="noHotel cus-small cus-ftColorBlack3">还没有智慧酒店</div>
  </div>
</template>
<script>
  import Banner from '@/components/smartHotel/Banner.vue'
  import {fetchHotelInfoAxios,getHotelList} from '@/services/axiosapi'
  // vuex
  import {mapState} from 'vuex'
  import {Scroller} from 'vux'
  import {is_weixin} from '@/utils/device'
  export default {
    components: {
      Banner,
      Scroller,
    },
    name: 'SmartHotel',
    beforeRouteEnter(to, from, next){
      // 通过 `vm` 访问组件实例
      next(vm => {
        // 酒店选择页面时，需要提前销毁酒店房型列表组件
        vm.$store.dispatch("keepAlivePageDel", 'HotelRoomList');
      })
    },
    beforeMount () {
      this.$store.dispatch("setMapurl", "");
      var clientHeight = document.body.clientHeight;
      var scrollerHeight = clientHeight-60;
      this.scrollerHeight = scrollerHeight+"px";

      if(this.localCity==""){
        //初始加载页面的时候或者刷新
        // this.getLocation();
        //请求所有数据
        this.$store.dispatch("setLocalCity","苏州");
        this.getLocalHotelList("苏州");
        this.getAllHotelCity();
      }else{
        //此时已经有了选择城市
        this.checkHotelInfoExist(this.localCity);
      };

    },
    data () {
      return {
        loading: false,
        // localCity: "苏州",
        hotelList: [],
        index: 0,
        cityArr: ['苏州','上海','北京','深圳','厦门'],
        noHotel: false,
        notAnyMore: 0,
        pullDown: {
          content: '',
          height: 60,
          autoRefresh: false,
          downContent: '',
          upContent: '',
          loadingContent: '',
          clsPrefix: 'xs-plugin-pulldown-'
        },
        scrollerHeight: "auto",
        is_weixin: is_weixin()
      }
    },
    computed: {
      ...mapState({
        localCity: state => state.smartHotel.chooseCity,
        hotelAllList: state => state.smartHotel.hotelAllList
      })
    },
    methods: {
      // getLocation(){
      //   // //调用高德地图api
      //   var map = new AMap.Map("container", {
      //     resizeEnable: true,
      //     center: [116.397428, 39.90923],
      //     zoom: 13
      //   });
      //   var citysearch = new AMap.CitySearch();
      //     //自动获取用户IP，返回当前城市
      //     citysearch.getLocalCity((status, result) => {
      //         if (status === 'complete' && result.info === 'OK') {
      //             console.log('请求当前定位成功');
      //             //请求当前定位成功
      //             if (result && result.city && result.bounds) {
      //                 console.log('获取城市信息成功');
      //                 var cityinfo = result.city;
      //                 var index = cityinfo.indexOf("市");
      //                 var a = cityinfo.split("");
      //                 a.splice(index);
      //                 var localCity = a.join("");
      //                 console.log(localCity);
      //                 //切换到当前城市
      //                 this.checkHotelInfoExist(localCity);

      //             }
      //         } else {
      //             this.$store.dispatch("setLocalCity","苏州");
      //             this.getLocalHotelList("苏州");
      //         }
      //     });

      //   //     if (navigator.geolocation)
      //   //     {
      //   //         navigator.geolocation.getCurrentPosition(showPosition);
      //   //     }
      //   //     else
      //   //     {
      //   //         console.log("该浏览器不支持获取地理位置。");
      //   //     }


      //   // function showPosition(position)
      //   // {
      //   //     alert("纬度: " + position.coords.latitude +
      //   //     "经度: " + position.coords.longitude)
      //   // }
      // },
      getLocalHotelList(cityName){
          let option = {
             CityName: cityName
          };

          getHotelList(option).then(response => {
              if(response.data.ResultCode=='0'){
                 this.hotelList = response.data.Data;
                 if(this.hotelList.length==0){
                    this.noHotel = true;
                 }else{
                    this.noHotel = false;
                    this.notAnyMore = this.hotelList.length-1;
                 }
              }
          }).catch(err => {
              console.log(err);
          });
      },
      getAllHotelCity(){
        let allOption = {};
        getHotelList(allOption).then(response => {
          if(response.data.ResultCode=='0'){
              this.$store.dispatch("setHotelAllList",response.data.Data);
          }
        }).catch(err => {
          console.log(err);
        });
      },
      checkHotelInfoExist(localCity){
                      let isTrue = this.cityArr.every((item) => {
                        return (item!=localCity)
                      });
                      if(isTrue){
                        if(this.cityArr[0]=="苏州"){
                          this.cityArr.unshift(localCity);
                          this.cityArr.pop();
                        }else if(this.cityArr[1]=="苏州"){
                          this.cityArr.shift();
                          this.cityArr.unshift(localCity);
                        };
                        this.$store.dispatch("setLocalCity",localCity);
                        this.getLocalHotelList(localCity);
                      }else{
                        this.cityArr.forEach((item,index) => {
                          if(localCity==item){
                              this.index = index;
                              if(this.hotelAllList.length>0){
                                //如果当前所有城市列表信息不为空的话
                                this.chooseCity(index);
                              }else{
                                //如果为空，则请求一次
                                this.getLocalHotelList(localCity);
                              }
                          }
                        });
                      };
      },
      //此时滚动图片的下标
      changeIndex(num) {
        this.$store.dispatch('changeBannerImgIndex', {value: num});
      },
      chooseCity(index){
        let cityArr = this.cityArr;
        this.index = index;
        let localCity = cityArr[index];
        this.$store.dispatch("setLocalCity",localCity);
        let hotelAllList = this.hotelAllList;
        let newHotelList = hotelAllList.filter(function(item){
          return (item.CityName==localCity)
        });
        this.hotelList = newHotelList;
        if(newHotelList.length==0){
          this.noHotel = true
        }else{
          this.noHotel = false;
          this.notAnyMore = this.hotelList.length-1;
        }
      },
      contact(val){
        window.location.href = 'tel:'+val;
      },
      jumpToCity(){
        this.$router.push({
           name: 'CityNames'
        })
      },
      mapLocation(){
        this.getLocation();
        // let mapurl = "https://m.amap.com";
        // this.$store.dispatch("setMapurl", mapurl);
        // this.$router.push({
        //   name: 'CurrentLocation'
        // })
      },
      jumpToHotel(hotelNo){
          this.$store.dispatch("setHotelNo", hotelNo);
          this.$store.dispatch('setRoomListLoadingShow', true);
          this.$store.dispatch('setRoomListLoadingStart', false);

          this.$router.push({
            name: "hotelroomlist"
          })
      },
      jumpToHowToPlay(hotelNo){
          this.$store.dispatch("setHotelNo",hotelNo);
          this.$router.push({
            name: "HowToPlay"
          })
      },
      onScrollBottom(){
            setTimeout(() => {
                this.$refs.scroller.donePulldown()
            }, 10)
      },
      goHotel(lat,lng,hotelName){
          let location = {
            'lat': lat,
            'lng': lng
          };
          this.$store.dispatch("setLocation", location);
          let mapurl = "https://uri.amap.com/marker?position="
          + lng + "," + lat
          + "&name=" + hotelName
          + "&src=mypage&coordinate=gaode&callnative=0";
          this.$store.dispatch("setMapurl", mapurl);
          this.$router.push({
            name: "CurrentLocation"
          })
      }
    },


  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../styles/common/themeSettings.less';
.headerTop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
    &.weixin{
      height:0;
    }
    z-index: 100;
    background-color: @ftColorBlack;
}

header {
  width: 100%;
  background-color: #f8f9f8;
  align-items: center;
  position: fixed;
  top: 20px;
  &.weixin{
    top:0;
  }
  left: 0;
  right: 0;
  z-index: 100;
  justify-content: space-between;
  padding-bottom: 9px;
  padding-top: 9px;
  border-bottom: 0.7px solid @splitColor;
  div {
    line-height: 1em;
  }
  section {
    display: inline-block;
    width: 44px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    font-size: @ftSize-small;
    border-radius: 3px;
    &:first-child {
      margin-left: 10px;
    }
    &:not(:first-child) {
      margin-left: 4px;
    }
  }
  .moreArea {
      width: 80px;
      align-items: center;
  }
  .localCity {
    color: @themeColor;
    background-color: rgba(37, 192, 177, .2);
    border: 0.7px solid @themeColor;
  }
  .recommandCity {
    color: @ftColorBlack3;
    background-color: @panelColor;
    border: 0.7px solid @splitColor;
  }
  .mapChoose {
    margin-right: 8px;
    display: inline-block;
    line-height: 0.5em;
  }
  .triangle-down {
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 7px solid @ftColorBlack3;
    display: inline-block;
  }
}

article {
  margin-top: 64px;
  padding-bottom: 10px;
  &.weixin{
    margin-top:44px;
  }
  .loading {
    text-align: center;
    width: 100%;
    height: 40px;
    display: block;
    img {
      display: inline-block;
    }
  }
  .smartBanner {
    position: relative !important;
    .banner {
      width: 100%;
      height: 100%;
    }
  }
  section {
    margin-top: 10px;
    width: 100%;
    height: 260px;
    position: relative !important;
    &:last-child {
      margin-bottom: 20px;
    }
    .discount {
      width: 50px;
      height: 30px;
      background-color: @priceColor;
      color: @panelColor;
      position: absolute !important;
      top: 0;
      left: 10px;
      text-align: center;
      line-height: 45px;
      span {
        font-size: 24px;
      }
    }
    .discountBugle {
      position: absolute !important;
      top: 30px;
      left: 10px;
      width: 0;
      height: 0;
      border-left: 25px solid transparent;
      border-right: 25px solid transparent;
      border-top: 15px solid @priceColor;
    }
    .howToPlay {
      width: 50px;
      height: 30px;
      background-color: #fea04c;
      color: @panelColor;
      position: absolute !important;
      top: 0;
      left: 70px;
      text-align: center;
      line-height: 45px;
    }
    .howToPlayBugle {
      position: absolute !important;
      top: 30px;
      left: 70px;
      width: 0;
      height: 0;
      border-left: 25px solid transparent;
      border-right: 25px solid transparent;
      border-top: 15px solid #fea04c;
    }
    .noDisCount {
      left: 10px;
    }
    .hotelMes {
      width: 100%;
      height: 80px;
      background: rgba(0, 0, 0, .6);
      position: absolute !important;
      bottom: 0;
      left: 0;
      justify-content: space-between;
      z-index: 10;
      .hotelDes {
        justify-content: space-between;
        color: @panelColor;
        align-items: flex-end;
        height: 33px;
        div {
          display: inline-block;
          height: 100%;
        }
        .hotelName {
          margin-left: 10px;
        }
        .hotelPrice {
          margin-right: 10px;
          border-bottom: 1px dotted @panelColor;
          line-height: 1.3em;
        }
      }
      .hotelContact {
        margin-bottom: 20px;
        padding-right: 10px;
        color: @panelColor;
        align-items: flex-end;
        .phoneIcon {
          margin-left: 10px;
        }
        .telephone {
          margin-left: 10px;
          white-space:nowrap;
        }
        .addressIcon {
          margin-left: 40px;
        }
        .address {
          margin-left: 10px;
          white-space:nowrap;
          overflow-x: hidden;
          text-overflow: ellipsis;
          display: inline-block;
        }
      }
    }
  }
}

.noHotel {
  width: 100%;
  margin-top: 100px;
  text-align: center;
}

.notAnyMore {
  margin-top: 10px;
  text-align: center;
}

</style>
