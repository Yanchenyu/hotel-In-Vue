<!-- 个人信息页面 -->

<template>
  <div>
    <div class="layout_div">
      <div style="margin-top:0;">
        <group gutter="0px">
          <x-input class="cus-normal   vux-override" style="padding: 0 10px;" type="text" title='昵称'
                   :show-clear="false"
                   v-model="personalinfo.nickname" placeholder="请输入昵称" text-align="right">
          </x-input>
          <div class="thinLine"></div>
          <!--<x-input class="cus-normal   vux-override" type="text"  title='性别'
            :show-clear="false"  text-align="right"  @click.native="sexChange"
            v-model="sex"  >
          </x-input>                  -->
          <div @touchstart="touchStart(1)" @touchend="touchEnd(1)" style="position:relative">
            <cell class="cus-normal   vux-override" :class="{focus:num==1}" style="padding: 0 10px;" :title="'性别'" is-link @click.native="sexChange">
              <div slot="value">
                <span style="color:#7e7b7b;font-size:14px;">{{personalinfo.sex}}</span>
              </div>
            </cell>
            <div style="position: absolute;top:-2px;left:0;height:2px;width: 100%;background: #eee" v-show="num==1"></div>
            <div style="position: absolute;top:44px;left:0;height:2px;width: 100%;background: #eee" v-show="num==1"></div>
          </div>
          <div class="thinLine"></div>
          <div @touchstart="touchStart(2)" @touchend="touchEnd(2)" style="position:relative">
            <datetime class="cus-normal   vux-override" :class="{focus:num==2}" v-model="personalinfo.birthday" style="padding: 0 10px;" :min-year=1960 :max-year=2020
                      format="YYYY-MM-DD" :title="'出生年月'"
                      value-text-align="right" year-row="{value}年" month-row="{value}月" day-row="{value}日"
                      :clear-text="'选择出生日期'" :cancel-text="'取消'" :confirm-text="'完成'">
            </datetime>
            <div style="position: absolute;top:-2px;left:0;height:2px;width: 100%;background: #eee" v-show="num==2"></div>
            <div style="position: absolute;top:44px;left:0;height:2px;width: 100%;background: #eee" v-show="num==2"></div>
          </div>
          <div class="thinLine"></div>
          <div class="address" @touchstart="touchStart(3)" @touchend="touchEnd(3)" style="position:relative">
            <x-address class="cus-normal   vux-override" :class="{focus:num==3}" style="padding: 0 10px;border: 0" title="居住城市"
                      v-model="personalinfo.location" raw-value :list="addressData" hide-district
                      value-text-align="right">
            </x-address>
            <div style="position: absolute;top:-2px;left:0;height:2px;width: 100%;background: #eee" v-show="num==3"></div>
            <div style="position: absolute;top:44px;left:0;height:2px;width: 100%;background: #eee" v-show="num==3"></div>
          </div>
          <div class="thinLine"></div>
          <div class="signature-div">
            <x-textarea class="cus-normal   vux-override" style="height:64px;padding: 0 10px;" type="text"
                        v-model="personalinfo.signature" :show-counter="true" :rows="3" :max="20" placeholder="请输入个人签名">
              <div slot="label" style="">
                <div style="font-size:14px;text-align:center;margin-right:8px;">个人签名</div>
              </div>

            </x-textarea>
          </div>
        </group>
      </div>
    </div>
    <div style="padding:0px 10px;" class="btn_save" @click="onClick">
      <span>保存</span>
    </div>
    <actionsheet v-model="showFlag" :menus="sexlist" :close-on-clicking-mask="false" @on-click-menu="sexClick"
                 close-on-clicking-mask></actionsheet>
  </div>
</template>

<script>
  import {
    Actionsheet,
    XHeader,
    Cell,
    Group,
    XInput,
    PopupPicker,
    ChinaAddressData,
    XAddress,
    Datetime,
    XTextarea,
    ChinaAddressV3Data,
    Value2nameFilter as value2name,
    Name2valueFilter as name2value
  } from 'vux'
  import {fetchLoadMemberDetailViewByIdAxios, fetchSaveMemberInfoAxios} from '@/services/axiosapi'
  import {mapState} from 'vuex'
  import {storeGet, storeSet} from '@/utils/localStorage'
  import {is_weixin} from '@/utils/device'

  export default {
    name: 'PersonalInfo',
    components: {
      Actionsheet,
      Group,
      Cell,
      XHeader,
      XInput,
      PopupPicker,
      ChinaAddressData,
      XAddress,
      Datetime, XTextarea
    },
    data () {
      return {
        addressData: ChinaAddressData,
        addressValue: ['江苏省', '苏州市'],
        nameVal: 'mis',
        mobile: '',
        email: '',
        personalinfo: {},
        showFlag: false,
        sexlist: {
          M: '男',
          F: '女'
        },
        formatDemoValue: ['01', '12'],
        format: function (value, name) {
          return `1992-04-05`
        },
        value1: '1990-01-01',
        num: ""
      }
    },
    beforeMount () {
      if (!is_weixin()) {
        // 清空缓存数据，并推出页面到登陆页
        // delete localStorage['memberInfo']
        var localmemberInfo = localStorage['memberInfo']
        // TODO 验证 MemberId, RoomId是否仍然有效
        if (localmemberInfo == undefined) {
          this.$router.replace({
            name: 'membercenter'
          })
        }

      }
      this.loadMemberInfo()
    },
    computed: {},
    methods: {
      // load会员信息
      loadMemberInfo () {
        let memberId = storeGet('memberInfo', 'Id');
        if (memberId !== null || memberId !== undefined || memberId !== '') {
          let params = {}
          console.log("loadMemberInfo memberId:", memberId)
          params.memberId = memberId
          fetchLoadMemberDetailViewByIdAxios(params).then(response => {
            // response TODO 添加异常失败情况检查
            console.log("loadMemberInfo:", response)
            if (response.data.Success == true) {
              this.personalinfo = this.filldata(response.data.Content)
            } else {
              // TODO 显示无查询数据
            }
          }).catch(err => {
            //alert('fetchLoadMemberDetailViewByIdAxios err:', err)
            this.utils.showNetError();
          })
        }
      },
      filldata(singleData){
        let obj = {}
        obj.Id = singleData.Id
        obj.nickname = singleData.NickName
        let sexname = singleData.Sex;
        console.log("filldata sexname:", sexname)
        if (sexname !== null || sexname !== undefined || sexname !== '' || sexname !== " ") {
          sexname = (singleData.Sex == "F" ? "女" : "男")
          obj.sex = sexname
        }
        let birthday = singleData.Birthday;
        console.log("filldata birthday:", birthday)
        if (birthday == null || birthday == undefined || birthday == '' || birthday == " ") {
          obj.birthday = "1990-01-01";
        }
        else {
          obj.birthday = singleData.Birthday;
        }

        console.log("filldata singleData.Location:", singleData.Location)
        if (singleData.Location !== null) {

          let localname = singleData.Location.split(' ')
          console.log('localname', localname)
          let localvalue = this.getValue(localname)
          console.log('sex value', localvalue.split(' '))
          obj.location = localvalue.split(' ')
        }
        console.log("filldata obj.signature:", singleData.Signature)
        obj.signature = singleData.Signature

        return obj
      },
      onClick () {
        console.log('on click')
        let params = {}
        params.Id = this.personalinfo.Id
        params.NickName = this.personalinfo.nickname
        // params.Signature=encodeURI(this.personalinfo.signature)
        params.Signature = this.personalinfo.signature;
        params.Birthday = this.personalinfo.birthday
        params.Sex = (this.personalinfo.sex == "男" ? "M" : "F")
        let localname = this.getName(this.personalinfo.location)
        // console.log("localname：",localname)
        params.Location = localname
        // console.log("params：",params)
        fetchSaveMemberInfoAxios(params).then(response => {
          // response TODO 添加异常失败情况检查
          console.log(response)
          if (response.data.Success == true) {
            //更新localstrage中数据
            storeSet('memberInfo', 'NickName', this.personalinfo.nickname);
            storeSet('memberInfo', 'Signature', this.personalinfo.signature);
            this.$router.back()
            // console.log("response.data.Success",response.data.Message)
          } else {
            // TODO 显示无查询数据
          }
        }).catch(err => {
          //alert('fetchSaveMemberInfoAxios err:', err)
          this.utils.showNetError();
        })
      },

      getName (value) {
        return value2name(value, ChinaAddressV3Data)
      },
      getValue (value) {
        return name2value(value, ChinaAddressV3Data)
      },
      change()
      {


      }, onShow () {
        console.log('on show')
      },
      sexClick (key) {
        console.log('sexClick  ', key)
        if (key == "F") {
          this.personalinfo.sex = "女"
          console.log('true  ', this.sex)
        }
        if (key == "M") {
          this.personalinfo.sex = "男"
          console.log('false this.sex ', this.sex)
        }


      },
      sexChange()
      {
        this.showFlag = true;
      },
      touchStart(e){
        this.num = e
      },
      touchEnd(e){
        this.num = ""
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '../../../../styles/common/themeSettings.less';

  .xheader {
    background-color: @ftColorBlack;
  }

  .head-cell {
    line-height: 60px;
    padding-top: 5px;
    padding-bottom: 5px;
    img {
      display: inline-block;
      margin-right: 5px;
      height: 60px;
      width: 60px;
      border-radius: 40px;
    }
  }

  .content-cell {
    line-height: 40px;
    padding-top: 5px;
    padding-bottom: 5px;
    font-family: 微软雅黑, 宋体;
    font-size: 14px;
  }

  //设置页面布局的颜色
  .layout_div {
    background-color: white;
    // position:fixed;
    width: 100vw;
    height: 100%;

  }

  .signature-div {
    margin: 10px 0px;
  }

  .btn_save {
    // TODO weex支持 flex only
    background-color: @themeColor;
    margin-top: 30px;
    margin-left: 10px;
    margin-right: 10px;
    line-height: 44px;
    color: @panelColor;
    font-size: 18px;
    color: @panelColor;
    text-align: center;
    border-radius: 4px;
    border: 1px solid @themeColor;
  }

  .focus {
    background: #eee;
  }
</style>
