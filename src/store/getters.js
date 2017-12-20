import {
  hotelIconArr,
  hotelInfrastructureArr,
  businessFacilitiesArr,
  intimateServiceArr,
  amusementFacilityArr,
  surroundingLifeArr
} from '../utils/hotelIcon'
const filterPriceInfo = item => {
  return item !== undefined && item.Type == 3 && item.Display == true && item.Name == "价格说明"
}


export default {
  /* --------- 酒店页面使用 --------- */
  // 酒店轮播列表数据提取
  hotelInfo_bannerList: state => {
    if (state.hotelRoomList.hotelInfoLoaded) {
      console.log(state.hotelRoomList.hotelInfo.Banners);
      return state.hotelRoomList.hotelInfo.Banners.map((item) => ({
          url: {name: 'RoomDetailMes'},
          img: item.ImgUrl,
          type: item.Type,
          id: item.Id
        })
      )
    } else {
      return []
    }
  },

  // 酒店描述  图标
  hotelInfo_serviceIcons: state => {
    if (state.hotelRoomList.hotelInfoLoaded) {
      return state.hotelRoomList.hotelInfo.HotelInfrastructure.map(item => ({
          icon: hotelIconArr[item.Id],
          name: item.Name
        })
      )
    } else {
      return []
    }
  },

  // 酒店详情界面图标
  businessFacilities: state => {
    if (state.hotelRoomList.hotelInfoLoaded) {
      return state.hotelRoomList.hotelInfo.BusinessFacilities.map(item => ({
          icon: businessFacilitiesArr[item.Id],
          name: item.Name
        })
      )
    } else {
      return []
    }
  },
  intimateService: state => {
    if (state.hotelRoomList.hotelInfoLoaded) {
      return state.hotelRoomList.hotelInfo.IntimateService.map(item => ({
          icon: intimateServiceArr[item.Id],
          name: item.Name
        })
      )
    } else {
      return []
    }
  },
  amusementFacility: state => {
    if (state.hotelRoomList.hotelInfoLoaded) {
      return state.hotelRoomList.hotelInfo.AmusementFacility.map(item => ({
          icon: amusementFacilityArr[item.Id],
          name: item.Name
        })
      )
    } else {
      return []
    }
  },
  surroundingLife: state => {
    if (state.hotelRoomList.hotelInfoLoaded) {
      return state.hotelRoomList.hotelInfo.SurroundingLife.map(item => ({
          icon: surroundingLifeArr[item.Id],
          name: item.Name
        })
      )
    } else {
      return []
    }
  },

  // 酒店房型价格说明
  // roomInfo_priceInfo: state => {
  //   // 一定要在vuex中预设属性为null， 不能是undefined，否则getter typeof == Object导致无法检测数据变化
  //   if (state.hotelRoomList.roomList.length > 0 && state.hotelRoomList.roomList[state.hotelRoomList.roomSelectIdx].asyncRoomDetail) {
  //     let asyncData = state.hotelRoomList.roomList[state.hotelRoomList.roomSelectIdx].asyncRoomDetail
  //     var arr = asyncData.ServiceTags.filter(filterPriceInfo)
  //     if (arr.length) {
  //       return arr[0].Content
  //     }
  //   }
  //   return ''
  // },

  deviceModels: state => {
    if (state.hotelRoomList.hotelInfoLoaded) {
      console.log(state)
    } else {
      return []
    }
  }

  // 房型均价(根据选择日期求平均值)
  // roomInfo_priceAverage: state => {
  //     if(state.hotelRoomList.roomList.length > 0 ) {

  //     }
  // },
  /* --------- 会员中心页面使用 --------- */

}
