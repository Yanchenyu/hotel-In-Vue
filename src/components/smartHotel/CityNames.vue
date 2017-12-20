<template>
    <div class="bg">
        <div class="cityInitialName cus-flexcolumn-center">
            <div class="standardLine firstDiv cus-small cus-themeColor">当前</div>
            <div class="standardLine cus-small cus-themeColor">热门</div>
            <div class="standardLine initialCityList"@touchstart="moveStart" @touchend="moveEnd" @touchmove="touchMove">
                <div class="initialCity standardLine cus-small cus-themeColor" v-for="item in allCityNames" :ref="item.initial" :href="'#'+item.initial" @click="jumpCity(item.initial)">{{item.initial}}</div>
            </div>
        </div>
        <div class="bodyLeft">
            <div class="cityTitle">当前</div>
            <div class="current cus-flexrow">
                <div class="cus-normal">{{currentCity}}</div>
            </div>
            <div class="cityTitle">热门</div>
            <div class="hotCity cus-flexcolumn">
                <section class="cus-flexrow">
                    <div :class="{hotCityChoose: currentCity=='苏州'}" @click="chooseHotCity(0)">苏州</div>
                    <div :class="{hotCityChoose: currentCity=='上海'}" @click="chooseHotCity(1)">上海</div>
                    <div :class="{hotCityChoose: currentCity=='北京'}" @click="chooseHotCity(2)">北京</div>
                </section>
                <section class="cus-flexrow">
                    <div :class="{hotCityChoose: currentCity=='深圳'}" @click="chooseHotCity(3)">深圳</div>
                    <div :class="{hotCityChoose: currentCity=='厦门'}" @click="chooseHotCity(4)">厦门</div>
                    <div class="none"></div>
                </section>
            </div>
            <div :name="item.initial" :id="item.initial" v-for="item in allCityNames">
                <div class="cityTitle">{{item.initial}}</div>
                <div class="cityList">
                    <div class="list">
                        <div v-for="it in item.list" class="cus-normal" :class="{fontChosed: currentCity==it.name,bgFocus:chooseCityName==it.name}" @click="chooseCity(it.name)" @touchstart="touchStart(it.name)" @touchend="touchEnd(it.name)">
                            {{it.name}}
                            <div class="foucsShow" v-show="chooseCityName==it.name"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {cityNames} from '@/utils/cityNames'
import {mapState} from 'vuex'
export default {
  name: 'CityNames',
    data(){
        return {
            allCityNames: cityNames,
            hotCityIndex: 0,
            chooseCityName: "",
            scrollTop: 0,
            moveStartClientY: 0,
            moveEndClientY: 0,
            moveStartName: ""
        }
    },
    methods: {
        chooseHotCity(num){
            this.hotCityIndex = num;
            let hotCityArr = ['苏州','上海','北京','深圳','厦门'];
            this.$store.dispatch("setLocalCity", hotCityArr[num]);
            this.$router.push({
                name: 'SmartHotel'
            });
        },
        chooseCity(name){
            this.$store.dispatch("setLocalCity", name);
            this.$router.push({
                name: 'SmartHotel'
            });
        },
        touchStart(name){
            this.chooseCityName = name
        },
        touchEnd(){
            this.chooseCityName = ""
        },
        touchMove(coordinate){
            this.moveEndClientY = coordinate.changedTouches[0].clientY;
            let moveY = this.moveEndClientY - this.moveStartClientY;
            let cityNames = this.initialCityName;
            let index = cityNames.indexOf(this.moveStartName);
            let initial = cityNames[index+Math.round(moveY/16)];
            let anchorElement = document.getElementById(initial);
            anchorElement.scrollIntoView();
        },
        moveStart(coordinate){
            this.moveStartName = coordinate.target.innerText;
            this.moveStartClientY = coordinate.changedTouches[0].clientY;
        },
        moveEnd(coordinate){
            // console.log(coordinate);
        },
        jumpCity(initial){
            let anchorElement = document.getElementById(initial);
            anchorElement.scrollIntoView();
        }
    },
    computed: {
       ...mapState({
        currentCity: state => state.smartHotel.chooseCity
      }),
      initialCityName(){
          var initialArr = [];
          this.allCityNames.forEach((item)=>{
            initialArr.push(item.initial)
          });
          return initialArr
      }
    }
}
</script>
<style lang='less' scoped>
@import '../../styles/common/themeSettings.less';

.bg {
    position: relative;
    height: 100%;
}

.cityInitialName {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 30px;
    background-color: @panelColor;
    z-index: 10;
    border: 0;
    div {
        text-align: center;
    }
    .firstDiv {
        margin-bottom: 5px;
    }
    .initialCityList {
        width: 100%;
    }
    .initialCity {
        width: 100%;
        margin-top: 4px;
    }
}

.bodyLeft {
    position: fixed;
    top: 64px;
    left: 0;
    right: 30px;
    bottom: 0;
    height: 100%;
    overflow-y: scroll;
    border: 0;
    border-color: @panelColor;
}

.cityTitle {
    background-color: transparent;
    padding-left: 10px;
    height: 30px;
    line-height: 30px;
    font-size: @ftSize-hl;
    color: @ftColorBlack;
    border-top: 0.7px solid @splitColor;
    border-bottom: 0.7px solid @splitColor;

}

.current {
    height: 64px;
    background-color: @panelColor;
    padding-left: 30px;
    align-items: center;
    div {
        width: 95px;
        height: 34px;
        line-height: 34px;
        color: @themeColor;
        background-color: rgba(37, 192, 177, .2);;
        border: 0.7px solid @themeColor;
        text-align: center;
        border-radius: 5px;
    }
}

.hotCity {
    width: 100%;
    height: 113px;
    background-color: @panelColor;
    padding-top: 15px;
    padding-bottom: 15px;
    justify-content: space-around;
    section {
        margin-left: 30px;
        justify-content: space-between;
        div {
            display: inline-block;
            width: 95px;
            height: 34px;
            line-height: 34px;
            color: @ftColorBlack3;
            background-color: @panelColor;
            border: 0.7px solid @splitColor;
            text-align: center;
            border-radius: 5px;
            font-size: @ftSize-normal;
        }
        .none {
            border: 0.7px solid @panelColor;
        }
        .hotCityChoose {
            color: @themeColor;
            background-color: rgba(37, 192, 177, .2);
            border: 0.7px solid @themeColor;
        }
    }
}

.cityList {
    width: 100%;
    background-color: @panelColor;
    .list {
        margin-left: 10px;
        div {
            color: @ftColorBlack3;
            height: 44px;
            line-height: 44px;
            position: relative;
            .foucsShow {
                position: absolute;
                top: -0.7px;
                left: -10px;
                width: 10px;
                height: 44px;
                background-color: @pageColor;
                border-bottom: 0.7px solid @splitColor;
                border-top: 0.7px solid @splitColor;
            }
            &:not(:last-child) {
                border-bottom: 0.7px solid @splitColor;
            }
        }
        .fontChosed {
            color: @themeColor;
        }
        .bgFocus {
            background-color: @pageColor;
        }
    }
}

</style>
