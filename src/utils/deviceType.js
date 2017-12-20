export const deviceType = {
  '9': [
    {name: 'cold', size: '15', title: '制冷模式', type: 'ACCold', state: false},
    {name: 'hot', size: '3', title: '制热模式', type: 'ACHot', state: false},
    {name: 'windy', size: '15', title: '风速', type: 'ACWindy', state: false}
  ],
  '4': [
    {name: 'openCL', size: '15', title: '开', type: 'curtainOpen', state: false},
    {name: 'pause', size: '3', title: '暂停', type: 'curtainPause', state: false},
    {name: 'closeCL', size: '20', title: '关', type: 'curtainClose', state: false}
  ],
  '3': [
    {name: 'menu', size: '15', title: '菜单', type: 'TVMenu', state: false},
    {name: 'slience', size: '15', title: '静音模式', type: 'TVSilence', state: false},
    {name: 'back', size: '15', title: '返回', type: 'TVBack', state: false}
  ],
  '6': [
    {name: 'roomcontrol/last', size: '15', title: '上一首', type: 'musicLast', state: false},
    {name: 'roomcontrol/play', size: '3', title: '播放', type: 'musicPlay', state: false},
    {name: 'roomcontrol/next', size: '15', title: '下一首', type: 'musicNext', state: false}
  ]
}
