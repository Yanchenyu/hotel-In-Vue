/**
 * 共用功能性state
 * */
export const KEEP_ALIVE_ADD = 'KEEP_ALIVE_ADD'  // keepalive 缓存页面添加
export const KEEP_ALIVE_DEL = 'KEEP_ALIVE_DEL'  // 删除
/**
 * HotelRoomList页面使用state
 */
export const SET_HOTEL_INFO = 'SET_HOTEL_INFO'
export const SET_INLINE_CAL = 'SET_INLINE_CAL'  // 打开关闭日历
export const SET_SCROLL_TOP = 'SET_SCROLL_TOP'  // scrolltop值
export const SET_PATH = 'SET_PATH'
export const SET_POSITION = 'SET_POSITION'
export const SET_CHECKOUT_STATUS = 'SET_CHECKOUT_STATUS'  // 设置出店还是入店状态
export const SET_CHECK_IN = 'SET_CHECK_IN'      // 设定入住日期
export const SET_CHECK_OUT = 'SET_CHECK_OUT'    // 设定离店日期
export const SET_POPUP_SHOW = 'SET_POPUP_SHOW'    // 设定popupshow
export const SET_LOADING_SHOW = 'SET_LOADING_SHOW'    // 设定loadingshow
export const SET_HOTEL_ROOMLIST = 'SET_HOTEL_ROOMLIST' // 设定房型列表查询结果
export const SET_ROOMLIST_TOTALRECORDS = 'SET_ROOMLIST_TOTALRECORDS' // 设定房间总数
export const SET_ROOMLIST_LOADINGSHOW = 'SET_ROOMLIST_LOADINGSHOW' // 设定loading动画是否显示
export const SET_ROOMLISTHEIGHT = 'SET_ROOMLISTHEIGHT' // 设定roomList高度
export const SET_HOTEL_ROOMLIST_FAIL = 'SET_HOTEL_ROOMLIST_FAIL' // 设定房型列表查询结果
export const SET_BOX2_HEIGHT = 'SET_BOX2_HEIGHT' //设定box2高度
export const SET_SCROLL_TRUE = 'SET_SCROLL_TRUE'

export const SET_ROOM_DETAIL = 'SET_ROOM_DETAIL'        // 设定房间详情内容
export const SET_ROOM_DETAIL_DISPLAY = "SET_ROOM_DETAIL_DISPLAY"    // 打开或关闭酒店房间详情
export const SET_BANNER_IMG_INDEX = "SET_BANNER_IMG_INDEX"    // 设定当前选中房间index
export const SET_ROOM_SELECT_INDEX = "SET_ROOM_SELECT_INDEX"    // 设定当前选中房间index
export const HAS_ROOMLISTLOADING = "HAS_ROOMLISTLOADING"    // 第一次进入房间列表界面
export const SET_ROOMLIST_LOADINGSTART = "SET_ROOMLIST_LOADINGSTART"    // 开始加载房型列表

/**
 * 房间控制页用state
 */
export const SET_USERMOBILE = "SET_USERMOBILE"  //设置用户手机号
export const SET_ROOMNUMBER = "SET_ROOMNUMBER"  //获得房间号
export const SET_MEMBER_HEAD_IMG = "SET_MEMBER_HEAD_IMG"  //获得用户头像
export const GET_ROOM_IDX = "GET_ROOM_IDX"  //获得当前设备界面index
export const SET_ROOM_SCENE_ALL = "SET_ROOM_SCENE_ALL"  // 场景数据设定
export const SET_ANALOGDATA = "SET_ANALOGDATA"  // 模拟场景数据设定
export const SET_DEVICE_CONTENT = "SET_DEVICE_CONTENT"  // 房间设备信息设置
export const SET_DEVICE_ONOFF = "SET_DEVICE_ONOFF"  // 房间设备开关
export const SET_AC_MODE = "SET_AC_MODE"  // 空调模式选择
export const SET_AC_SPEED = "SET_AC_SPEED"  // 空调风速设置
export const SET_AC_TEMPERATURE = "SET_AC_TEMPERATURE"  // 空调温度设置
export const SET_CURTAIN_STATE = "SET_CURTAIN_STATE"  // 窗帘状态控制
export const SET_SCENCE_ARR = "SET_SCENCE_ARR" //设置设备场景状态
// vvv 设备状态同步用温度、光线、窗帘
export const SET_SYNC_DEVICE = "SET_SYNC_DEVICE"
export const SET_SYNC_DEVICE_TEMPERATURE = "SET_SYNC_DEVICE_TEMPERATURE"
export const SET_SYNC_DEVICE_AIRSTATE = "SET_SYNC_DEVICE_AIRSTATE"
export const SET_SYNC_DEVICE_CURTAIN = "SET_SYNC_DEVICE_CURTAIN"
export const SET_SYNC_DEVICE_LIGHT = "SET_SYNC_DEVICE_LIGHT"
// --- 舒适体验页多次进出使用 ---
export const SET_SYNC_DEVICE_WIND = "SET_SYNC_DEVICE_WIND"
export const SET_SYNC_DEVICE_MUSIC = "SET_SYNC_DEVICE_MUSIC"
export const SET_SYNC_DEVICE_MUSIC_PLAY_STATUS = 'SET_SYNC_DEVICE_MUSIC_PLAY_STATUS'
// ^^^
/**
 * 会员页用state
 */
export const SET_MEMBER_INFO = 'SET_MEMBER_INFO'    //会员信息
export const SET_MEMBER_ORDERLIST = 'SET_MEMBER_ORDERLIST'    //会员订单列表信息
export const SET_MEMBER_ORDERLIST_TOTALRECORDS = 'SET_MEMBER_ORDERLIST_TOTALRECORDS'    //会员订单列表总数
export const SET_MEMBER_ORDERLIST_LOADINGSHOW = 'SET_MEMBER_ORDERLIST_LOADINGSHOW'    //会员订单列表总数
export const SET_MEMBER_ORDER_SHOW = 'SET_MEMBER_ORDER_SHOW'    //会员订单列表加载
export const SET_MEMBER_ORDERLIST_HEIGHT = 'SET_MEMBER_ORDERLIST_HEIGHT'    //会员订单列表高度
export const SET_MEMBER_SMARTENERGY = 'SET_MEMBER_SMARTENERGY'  // 会员能量信息
export const SET_MEMBER_BENEFITS = 'SET_MEMBER_BENEFITS'  // 会员利益
export const SET_MEMBER_LOGIN_STATU = 'SET_MEMBER_LOGIN_STATU'  // 会员登录状态

/**
 * 微信授权
 */
export const SET_WXAUTH_USERINFO = 'SET_WXAUTH_USERINFO'

/**
 * 共用页面
 */
export const SET_VUXTOAST_DISPLAY = "SET_VUXTOAST_DISPLAY"
export const SET_TOAST_SET_DISPLAY = "SET_TOAST_SET_DISPLAY"

/**
 * smartHotel
 */
export const SET_LOCAL_CITY = "SET_LOCAL_CITY"  //选择城市
export const SET_HOTEL_ALL_LIST = "SET_HOTEL_ALL_LIST"  //设置所有酒店信息
export const SET_LOCATION = "SET_LOCATION"  //定位当前坐标
export const SET_HOTELNO = "SET_HOTELNO"  //获得酒店编号
export const SET_MAPURL = "SET_MAPURL"  //设置酒店地图地址
export const SET_LOADING_STATE = "SET_LOADING_STATE"  //设置加载动画状态
