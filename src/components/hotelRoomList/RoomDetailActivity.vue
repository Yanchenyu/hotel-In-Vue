<template>
  <div>
    <group>
      <cell title="cell" value="hello" is-link :link='address'></cell>
      <cell-box is-link>
        cell-box long long long long long long long
      </cell-box>
    </group>
  </div>
</template>

<script>
  import {Group, Cell, CellBox} from 'vux'

  export default {
    name: 'RoomDetailActivity',
    components: {
      Group,
      Cell,
      CellBox
    },
    data(){
      return {
        address: "https://www.baidu.com/"
      }
    }
  }
</script>
