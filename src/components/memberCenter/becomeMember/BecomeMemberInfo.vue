<!-- 会员中心页面 -->

<template>
  <div>
    <x-header v-if="titleBarFlag" class="xheader vux-override" style="background-color:#333;">好想住会员</x-header>
    <div class="head_info">
      <!--<blur :blur-amount=10 :url="avatarurl" :height="220" style="margin:0px 0px;">-->
      <div class="center">
        <img :src="avatar">
        <p class="cus-normal">{{nickname}}</p>
        <div class="memberType">{{memLevelName}}</div>
      </div>

      <!-- 重新部排 -->
      <div style="position: absolute;top: 164px;width: 100%;height: 95px;background:#fff;padding-top: 14px">
        <div class="memberLvlContainer" style="">
          <img src="@/../static/images/memberLevel.png" alt="">
          <div>
            <div class="BgLine"></div>
            <ul class="imgCover">
              <li :class="getMemLvlClass(0)" @click="setMemLvlClass(0)"></li>
              <li :class="getMemLvlClass(1)" @click="setMemLvlClass(1)"></li>
              <li :class="getMemLvlClass(2)" @click="setMemLvlClass(2)"></li>
              <li :class="getMemLvlClass(3)" @click="setMemLvlClass(3)"></li>
            </ul>
            <ul class="textwrap cus-normal cus-flexrow">
              <li v-for="(level, idx) in levels" :class="getMemRealLvlClass(idx)">{{level.Name}}</li>
            </ul>
          </div>
        </div>

      </div>
      <!--</blur>-->
    </div>

    <div class="question-Div" style="margin-top: 100px;">
      <div class="content" style="text-align: center;padding: 0">升级到更高等级，获得更多特权</div>
    </div>
    <card :header="{title:''}" style="margin:0px 0px">
      <div slot="content" class="card-memberRight-flex card-memberRight-content01 cus-flexrow">
        <div v-for="(item, idx) in benefits" @click="handleClick(idx)">
          <icon :name="memberBenefitsIcon[idx+1]" scale="24" class="svgicon"></icon>
          <br/>
          {{item.Name}}
          <br/>
          <span> {{item.Description}}</span>
        </div>
        <div></div>
      </div>
    </card>
    <div class="question-Div">
      <div class="content">如何获得积分</div>
    </div>
    <div class="content-Div">
            <span class="content1">
                1. 按照订单实际交易金额，+3分/元
            </span>
      <span class="content1">
                2. 积分三个月过期
            </span>
    </div>
  </div>
</template>

<script>
  import {Card, XHeader, XInput, XButton, Blur, LoadMore, Datetime} from 'vux'
  import {fetchLoadMemberLevelAndBenefitsAxios} from '@/services/axiosapi'
  import {is_weixin} from '@/utils/device'
  import {mapState} from 'vuex'
  import {storeGet} from '@/utils/localStorage'
  import {memberBenefitsIcon} from '@/utils/memberIcon'

  export default {
    name: 'BecomeMemberInfo',
    components: {
      Card,
      XHeader,
      XInput,
      XButton,
      Blur,
      LoadMore,
      Datetime
    },
    beforeMount () {
      //微信浏览器隐藏导航栏
      if (is_weixin()) this.titleBarFlag = false
      var localmemberInfo = localStorage['memberInfo']
      // TODO 验证 MemberId, RoomId是否仍然有效
      if (localmemberInfo == undefined) {
        if (is_weixin()) {
          this.$router.replace({
            name: 'ReplaceBindingPhone'
          })
        } else {
          this.$router.replace({
            name: 'membercenter'
          })
        }
      }
      // this.setAvatar(storeGet('memberInfo', 'Avatar'));
      this.LoadMemberLevelAndBenefits()
    },
    data () {
      return {
        titleBarFlag: true,
        // nickname: '张三',
        nameVal: 'mis',
        avatar: '../../../../static/images/defaultHead.png',
        avatarurl: 'http://106.15.56.108:9050/Images/memberlevel/background.png',
        levels: {},
        originalbenefits: {},
        birth: '',
        url: 'http://106.15.56.108:8050/Images/memberlevel/background.png',

        memberLevel: '黄金搭档',
        memberLevFlag: true,
        rightsFlag: [false, false, false, false, false],
        memLevelchoose: 0,  // 会员点击查看其它的等级index
        memLevelCurrent: 0, // 会员自己等级的index
        memberBenefitsIcon: memberBenefitsIcon,
        memLevelName: ""
      }
    },
    computed: {
      ...mapState({
        benefits: state => state.memberCenter.memberBenefits
      }),
      nickname(){
        var db_nikename = this.$store.state.memberCenter.memberInfo.NickName;// storeGet('memberInfo', 'NickName');
        if (!is_weixin()) {
          return db_nikename;
        } else {
          var localwxnickname = storeGet('SH_wxAuth', 'nickname')
          if (!(typeof localwxnickname == "undefined")) {
            if (!(typeof db_nikename == "undefined")) {
              return db_nikename;
              // console.log("headinfo getnickname this.nickname",this.nickname)
            } else {
              return localwxnickname;
              // console.log("headinfo getnickname this.nickname1",this.nickname)
            }
          }
        }
      },
    },
    methods: {
      LoadMemberLevelAndBenefits(){
        let memberId = storeGet('memberInfo', 'Id');//this.$store.state.memberCenter.memberInfo.Id
        let params = {}
        params.memberId = memberId
        fetchLoadMemberLevelAndBenefitsAxios(params).then(response => {
          // response TODO 添加异常失败情况检查
          console.log('LoadMemberLevelAndBenefits response:', response)
          if (response.data.Success == true) {

            let obj = {}
            obj = response.data.Content
            this.levels = obj.Levels
            console.log('LoadMemberLevelAndBenefits this.levels:', this.levels)
            for (var idx in this.levels) {
              if (this.levels[idx].IsInLevel == true) {
                // 获取和初始化真实用户等级index
                this.memLevelchoose = idx;
                this.memLevelCurrent = idx;
                this.memLevelName = this.levels[idx].Name;
                break;
              }
            }
            this.originalbenefits = obj.Benefits;
            this.$store.dispatch("setMemberBenefits", obj.Benefits);

            this.setAvatar(obj.Avatar);
          } else {
            // TODO 显示无查询数据
          }
        }).catch(err => {
//          alert('fetchLoadMemberLevelAndBenefitsAxios err:', err)
          this.utils.showNetError();
        })
      },
      setAvatar(dbavatar){
        if (is_weixin()) {
          var db_avatar = dbavatar;
          var localwxheadimgurl = storeGet('SH_wxAuth', 'headimgurl');
          if (!(typeof localwxheadimgurl == "undefined")) {
            if (!(typeof db_avatar == "undefined")) {
              let res = db_avatar.replace(/(^\s*)|(\s*$)/g, "");
              if (res.length > 0) {
                this.avatar = res;
              } else {
                this.avatar = localwxheadimgurl;
              }
            } else {
              this.avatar = localwxheadimgurl;
            }
          }

        } else {
          let headimg = storeGet('memberInfo', 'Avatar');
          console.log("beforeMount headimg", headimg)
          if (!(typeof headimg == "undefined") && !(headimg == null)) {
            let res = headimg.replace(/(^\s*)|(\s*$)/g, "");
            console.log("beforeMount r res", res.length)
            if (res.length > 0) this.avatar = res
            console.log("beforeMount r this.db_avatar", this.avatar)
          }
        }
      },
      filldata(val){
        let newarr = new Array();
        let choosebefits = this.levels[val].Benefits;
        newarr = this.originalbenefits;
        for (var i = 0; i < newarr.length; i++) {
          let obj = newarr[i];
          for (var j = 0; j < choosebefits.length; j++) {
            if (obj.Id == choosebefits[j]) {
              newarr[i].HasBenefit = true;
              break;
            }
          }
        }
        //设置权益显示状态
        // this.setRightsStatus(choosebefits);
        // console.log('filldata newarr:',newarr)
        this.benefits = new Array();
        this.benefits = newarr;
        // console.log('filldata this.benefits:',this.benefits)
      },
      // 设置权益显示状态
      // setRightsStatus(choosebefits){
      //     //重置显示状态
      //     // this.rightsFlag=[false,false,false,false,false];

      //     // for(var j=0;j<choosebefits.length;j++){
      //     //     let idx=parseInt(choosebefits[j]);
      //     //     this.rightsFlag[idx-1]=true;
      //     // }
      //     this.rightsFlag=[true,true,true,true,true];
      // },

      // 会员等级（查看）图标显示class
      getMemLvlClass (idx) {
        // console.log("getMemLvlClass idx",idx)
        if (this.memLevelchoose == idx) {
          return "on"
        } else {
          return ""
        }
      },
      // 会员等级（真实）图标显示class
      getMemRealLvlClass (idx) {
        // console.log("getMemRealLvlClass idx",idx)
        // if(this.memLevelCurrent == idx) {
        //     return "on"
        // } else {
        //     return ""
        // }
      },
      // 设置用户真正查看的会员等级
      setMemLvlClass (idx) {
        console.log("setMemLvlClass idx", idx)
        this.memLevelchoose = idx;
        this.filldata(this.memLevelchoose);
      },
      // 跳转至详情页
      handleClick(index){
        this.$router.push({
          name: 'MemberPrivilege',
          params: {index: index}
        })
      }
    }
  }
</script>


<style lang="less" scoped>
  @import '../../../styles/common/themeSettings.less';

  .xheader {
    background-color: @ftColorBlack;
  }

  .xbutton {
    background-color: @themeColor;
  }

  .js_meminfo_wrapper {
    background-color: @pageColor;
    position: relative;
  }

  .head_info {
    height: 164px;
    width: 100%;
    position: relative;
    top: 0;
    left: 0;
    text-align: center;
    // background-image: url('http://106.15.56.108:9050/Images/memberlevel/background.png');
    // background-size: 100% 100%;
    background-color: #333;
  }

  .memberlev_div {
    background-color: rgba(255, 255, 255, 0.0);
    padding: 25px 35px;
    font-size: @ftSize-normal;
    color: white;

    /* Flex 布局*/
    align-items: center;
    * {
      display: flex;
      display: -webkit-flex;
    }
  }

  .memberlev_img_div {
    padding: 5px 5px;
    .img {
      display: block;
      width: 44px;
      height: 44px;
      // border-radius: 50%;
      // border: 2px solid #FFFFFF;
    }

  }

  .memberlev_name_div {
    position: relative;
    height: 14px;
  }

  .memberlev_namecontent_div {
    line-height: 14px;
    text-align: center;
  }

  .memicon {
    margin-left: auto;
    margin-right: auto;
    padding-top: 50px;
    position: relative;
    .icon-center {
      border-radius: 50px;
      width: 60px;
      height: 60px;
    }
  }

  .mem-name {
    position: relative;
    /*color: @ftColorBlack3;*/
    color: #ececec;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    margin-left: 155px;
    border-radius: 20px;
    width: 80px;
    border: 1px solid #ececec;
  }

  .Energy-Div {
    position: relative;
    color: #ececec;
    padding-bottom: 5px;
    font-size: 12px;
    line-height: 20px;
  }

  .content {
    line-height: 44px;
    padding-left: 10px
  }

  .content1 {
    line-height: 32px;
    padding-left: 5px;
    display: block;
  }

  .question-Div {
    position: relative;
    color: @ftColorBlack;
    background-color: @pageColor;
    font-size: @ftSize-hl;
    height: 44px;
  }

  .content-Div {
    position: relative;
    margin-bottom: 40px;
    color: @ftColorBlack;
    background-color: @panelColor;
    font-size: 12px;
    height: 64px;
  }

  /* vux */
  .center {
    text-align: center;
    padding-top: 15px;
    color: #fff;
    font-size: 18px;
  }

  .center img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px solid #ececec;
    margin-bottom: 5px;
  }

  .memberType {
    width: 80px;
    height: 24px;
    line-height: 23px;
    font-size: 14px;
    color: #f7d970;
    margin: 10px auto;
    border: 1px solid #f7d970;
    border-radius: 15px;
  }

  .card-member-flex {
    display: -webkit-flex; /* Safari */
    display: flex;
  }

  .card-member-content01 {
    padding: 5px 5px;
  }

  .card-padding {
    padding: 15px;
  }

  .card-member-flex > div {
    flex: 1;
    text-align: center;
    font-size: 12px;
  }

  .card-member-flex span {
    color: #f74c31;
  }

  .card-member-flex-imgSelected {

    display: block;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    //   border: 2px solid #FE4C4C;
  }

  .card-member-flex-img {

    display: block;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    //   border: 2px solid #FFFFFF;
  }

  .card-memberlev-flex-img {
    padding: 7px 5px;
    display: block;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    //   border: 2px solid #FFFFFF;
  }

  .card-member-header {
    padding: 10px 0;
    text-align: center;
    font-size: @ftSize-hl;
  }

  .card-memberRight-flex {
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .card-memberRight-content01 {
    padding-top: 20px;
  }

  .card-memberRight-flex > div {
    text-align: center;
    font-size: 14px;
    width: 118px;
    height: 118px;
  }

  .card-memberRight-flex span {
    color: @ftColorBlack3;
    font-size: 10px;
  }

  .card-memberRight-flex img {
    margin-top: 10px;
    width: 48px;
    height: 48px;
    border: 2px solid #ececec;
  }

  .split_div {
    margin-top: 30px;
    height: 2px;
    width: 20px;
    background-color: @pageColor;

  }

  .no-rights-div {
    display: none;
  }

  .rights-div {
    display: block;
  }

  // .svgicon {
  //     color:@themeColor;
  // }

  /* 会员等级 */
  .memberLvlContainer {
    width: 300px;
    margin: 0 auto;
    position: relative;
    // text-align: center;
    img {
      width: 0%;
    }
    .BgLine {
      position: absolute;
      left: 0;
      top: 0; /* 层叠显示 */
      height: 45px;
      line-height: 45px;
      width: 98%;
      margin: 0 3px; /*剧中*/
      background: linear-gradient(to right, #fff7e8, #fff7e8) no-repeat;
      background-position: center center;
      background-size: 100% 2px;
      //box-shadow: 1px 1px 2px gray;
    }

    .imgCover {
      position: absolute;
      left: 0;
      top: 0; /* 层叠显示 */
      text-align: left;
      li {
        display: inline-block;
        width: 34px;
        height: 35px;
        background: url('../../../../static/images/memberLevel.png') no-repeat;
        background-size: 305px 45px;

        position: absolute;
        top: 5px;
        &:nth-child(1) {
          background-position: 0 -5px;
          left: 0; /* 中心点 17*/
        }
        &:nth-child(2) {
          background-position: -91px -5px;
          left: 88px; /* 中心点 17 + 88*/
        }
        &:nth-child(3) {
          background-position: -183px -5px;
          left: 177px;
        }
        &:nth-child(4) {
          background-position: -271px -5px;
          left: 266px;
        }

        &.on {
          width: 44px;
          height: 45px;
          background: url('../../../../static/images/memberLevelHighlight.png') no-repeat;
          background-size: 200px 50px;
          top: 0;
        }
        &.on:first-child {
          background-position: -3px -3px;
          left: -5px; /* 中心点 17*/
        }
        &.on:nth-child(2) {
          background-position: -53px -3px;
          left: 83px; /* 中心点 17*/
        }
        &.on:nth-child(3) {
          background-position: -103px -3px;
          left: 172px; /* 中心点 17*/
        }
        &.on:nth-child(4) {
          background-position: -153px -3px;
          left: 261px; /* 中心点 17*/
        }
      }

    }

    .textwrap {
      width: 310px;
      position: absolute;
      left: -5px;
      top: 50px;
      justify-content: space-between;

      li {
        flex: 4;
        color: #999;
        text-align: center;

        &:first-child {
          flex: 3;
          text-align: left;
        }
        &:last-child {
          flex: 3;
          text-align: right;
        }
        &.on {
          color: #dbedd9;
        }
      }
    }
  }


</style>
