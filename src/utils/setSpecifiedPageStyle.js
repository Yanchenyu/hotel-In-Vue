
// 临时策略 scoped组件中无法修改上层body的样式，路由页面切换判断添加
export const getSpecifiedStyleEle = () => {
  const styleId = 'overrideStyle'
  let styleEl = document.getElementById(styleId)
  if (styleEl) return styleEl
  styleEl = document.createElement('style')
  styleEl.id = styleId
  document.body.appendChild(styleEl)
  return styleEl
}
export const setSpecifiedStyle = () => {
  const styleEl = getSpecifiedStyleEle()
  styleEl.innerHTML = 'body {background-color: white!important;}'
}
export const removeSpecifiedStyle = () => {
  const styleEl = getSpecifiedStyleEle()
  styleEl.innerHTML = ''
}
