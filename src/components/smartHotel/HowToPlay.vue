<template>
    <div>
        <div class="header">
            <div class="cus-flexrow" @click="back">
                <img src="@/../static/images/back.png" height="25px" width="25px" />
                <span>返回</span>
            </div>
            怎么玩
        </div>
        <div v-show="isSuYu" class="bg">
            <article class="cus-flexcolumn">
                <nav>城市概况</nav>
                <section>
                    苏州位于江苏省东南部，自古就被文人称作人间天堂，也被马克•波罗惊叹为“东方威尼斯”。这座古城座落在水网之中，街道依河而建，水陆并行；建筑临水而造，前巷后河，形成“小桥、流水、人家”的独特风貌。
                </section>
                <section>
                    苏州之美像极了这里的人，内敛而温润。享清闲安逸何必隐居山林，逛上苏州的几个园林，便能醉在这城市之中了。姑苏城外的太湖风光、极富江南韵致的水乡古镇，又为这鱼米之乡增添了一份秀美和灵动。漫步平江路或七里山塘，两千多年的古都，也有了小文艺的调调。
                </section>
                <section>
                    苏州园林、小桥流水只是管中窥豹，听昆曲的行腔婉转、找个苏州人聊聊、随意走走停停，才是真正的江南味道。
                </section>
                <div class="hotelAddress cus-flexrow">
                    <img src="@/../static/images/SuYulogo.jpg" height="42px" />
                    <div class="cus-flexcolumn">
                        <div class="standardLine">苏遇精品酒店  0512-85551666</div>
                        <div class="standardLine">苏州市姑苏区苏站路1688号</div>
                    </div>
                </div>
            </article>
            <nav class="cus-flexrow">
                <div></div>
                <span>附近景点</span>
            </nav>
            <article class="cus-flexcolumn">
                <div class="area">拙政园</div>
                <img class="areaImg" src="@/../static/images/ZhuoZhengYuan.jpg" />
                <section>
                    拙政园，以水见长、自然典雅、庭院错落、花木为胜。始建于明代，与留园、北京颐和园、承德避暑山庄并称为中国四大名园。拙政园里处处是精雕细琢，粉墙黛瓦，小桥流水，绿树红花，蕉肥竹瘦。 此园分东、中、西三部分，各有风味。东园面积最广，绿野遍布、莲渠萦绕，树古林深。东园与中园，以极为别致的游廊为屏风，连接彼此。立于廊下，才能细细感受古树参天、小桥流水的意趣。
                </section>
                <div class="area" style="margin-top:27px;">苏州博物馆</div>
                <img class="areaImg" src="@/../static/images/SuZhouMuseum.jpg" />
                <section>
                    苏州博物馆位于江苏省苏州市东北街。馆址为太平天国忠王李秀成王府遗址，是保存至今最完整的一座太平天国王府建筑。苏州博物馆的设计者为著名建筑设计大师贝聿铭。整个苏州博物馆，处处都透露出中国色彩。最为独到的是中轴线上的北部庭院，不仅使游客透过大堂玻璃可一睹江南水景特色，而且庭院隔北墙直接衔接拙政园之补园，新旧园景融为一体。 馆内藏品以古代书画、瓷器、工艺、出土文物为主。常设“吴地遗珍”、“吴塔国宝”、“吴中风雅”、“吴门书画”4个展览。
                </section>
            </article>
            <nav class="cus-flexrow" style="margin-top:27px;">
                <div></div>
                <span>附近交通</span>
            </nav>
            <article class="cus-flexcolumn">
                <div class="travel">地铁：<div>2号线，4号线</div></div>
                <div class="travel">公交：<div>19路; 161路; 166路; 178路; 876路; 923路</div></div>
            </article>
            <nav class="cus-flexrow">
                <div></div>
                <span>附近美食</span>
            </nav>
            <article class="cus-flexcolumn">
                <div class="foodName">有家酸菜鱼</div>
                <img class="areaImg" src="@/../static/images/YouJia.jpg" />
                <div class="hotelPhone cus-flexrow">
                    <div class="cus-flexrow" @click="phoneCall('0512-67317717')">
                        <icon name="telephone" scale="1.4"></icon>
                        <span class="cus-themeColor cus-normal standardLine">0512-67317717</span>
                    </div>
                    <div class="cus-flexrow">
                        <icon name="location" scale="6" class="standardLine svgiconGray"></icon>
                        <span class="cus-ftColorBlack3 cus-normal standardLine">人民路万达广场2幢102室</span>
                    </div>
                </div>
                <div class="foodName">厚德坊食府</div>
                <img class="areaImg" src="@/../static/images/HouDeFang.jpg" />
                <div class="hotelPhone cus-flexrow">
                    <div class="cus-flexrow" @click="phoneCall('0512-65891717')">
                        <icon  name="telephone" scale="1.4"></icon>
                        <span class="cus-themeColor cus-normal standardLine">0512-65891717</span>
                    </div>
                    <div class="cus-flexrow">
                        <icon name="location" scale="6" class="standardLine svgiconGray"></icon>
                        <span class="cus-ftColorBlack3 cus-normal standardLine">江乾坤路208号</span>
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>
<script>
export default {
  name: 'HowToPlay',
    computed: {
        isSuYu(){
            let hotelNo = this.$store.state.smartHotel.hotelNo;
            return hotelNo=="JP0001"||hotelNo=="SY001"
        }
    },
    methods: {
        back(){
            history.back();
        },
        phoneCall(phone){
            window.location.href = "tel: " + phone;
        }
    }
}
</script>
<style lang='less' scoped>
@import '../../styles/common/themeSettings';
* {
    margin: 0;
    padding: 0;
}

.header {
    background-color: @themeColor;
    color: @panelColor;
    height: 64px;
    line-height: 74px;
    text-align: center;
    font-size: @ftSize-huge;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    div {
        position: absolute;
        left: 4px;
        top: 27px;
        line-height: 1em;
        color: @panelColor;
        align-items: center;
        span {
            display: inline-block;
            font-size: @ftSize-normal;
        }
    }
}

.bg {
    background: @panelColor;
    padding: 79px 0 15px 0;
}

article {
    margin: 0 10px;
}

nav {
    font-size: @ftSize-hl;
    color: @ftColorBlack;
    margin-top: 30px;
    line-height: 1em;
    height: 16px;
    align-items: center;
    &:first-child {
        margin-top: 0;
    }
    div {
        display: inline-block;
        width: 3px;
        height: 15px;
        margin-right: 7px;
        background-color: @themeColor;
    }
    span {
        display: inline-block;
    }
}

section {
    font-size: @ftSize-normal;
    color: @ftColorBlack3;
    margin-top: 12px;
}

.hotelAddress {
    margin-top: 37px;
    height: 42px;
    &>div {
        height: 100%;
        justify-content: space-between;
        margin-left: 15px;
        div {
            font-size: @ftSize-hl;
            color: @ftColorBlack;
        }
    }
}

.area {
    margin-top: 30px;
    color: @ftColorBlack;
    font-size: @ftSize-normal;
    line-height: 1em;
}

.areaImg {
    margin-top: 15px;
    width: 100%;
}

.travel {
    color: @ftColorBlack;
    font-size: @ftSize-normal;
    line-height: 1em;
    div {
        color: @ftColorBlack3;
        display: inline-block;
        font-size: @ftSize-normal;
    }
    margin-top: 15px;
}

.foodName {
    color: @ftColorBlack;
    font-size: @ftSize-normal;
    margin-top: 30px;
    line-height: 1em;
}

.hotelPhone {
    // justify-content: space-between;
    margin-top: 15px;
    div {
        &:first-child {
            margin-right: 30px;
        }
        align-items: flex-end;
        span {
            margin-left: 8px;
        }
    }
}

</style>
