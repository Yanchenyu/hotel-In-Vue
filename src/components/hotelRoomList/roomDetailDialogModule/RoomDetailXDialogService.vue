<template>
  <div class="detailDesc">
    <!-- Flex 布局 Group -->
    <div class="cus-normal">
      <div class="flexGroup" v-for="(item,idx) in roomDetailXDialogServiceData.detailServiceTag"
           v-if="idx < 2 || roomDetailXDialogServiceData.detailTagExpand">
        <div class="flex3span">{{item.Name}}:</div>
        <div class="flex9span">{{allToString(item.Content)}}</div>
      </div>
    </div>

    <div class="tagExpand cus-small cus-hintColor" v-if="roomDetailXDialogServiceData.detailServiceTag.length >= 2">
      <div v-if="roomDetailXDialogServiceData.detailTagExpand==false" @click="toggleTagExpand">
        <span>展开全部内容</span>
        <span style="position:relative; top:2px;">
                    <x-icon type="chevron-down" class="cell-x-icon" size="12"></x-icon>
                </span>
      </div>
      <div v-else="" @click="toggleTagExpand">
        <span>收起</span>
        <span style="position:relative; top:2px;">
                    <x-icon type="chevron-up" class="cell-x-icon" size="12"></x-icon>
                </span>
      </div>
    </div>
  </div>
</template>

<script>
  const initData = {
    detailServiceTag: [],
    detailTagExpand: false,
  }
  export default {
    props: {
      roomDetailXDialogServiceData: {
        type: Object,
        default: initData
      }
    },
    name: 'RoomDetailXDialogService',
    methods: {
      allToString(val) {
        // 数据格式如果是数组，提取Name字段
        if (Array.isArray(val)) {
          return val.map(item => {
            return item.Name
          }).join(' ')
        }
        return val
      },
      // 展开收起
      toggleTagExpand() {
        this.roomDetailXDialogServiceData.detailTagExpand = !this.roomDetailXDialogServiceData.detailTagExpand;
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '../../../styles/common/themeSettings.less';

  .detailDesc {
    text-align: left;
    padding: 10px 10px 10px 10px; // 展开关闭
    .tagExpand {
      text-align: center;
      margin: 13px 0 15px 0;
      .cell-x-icon {
        fill: @hintColor;
      }
    }
  }

</style>
