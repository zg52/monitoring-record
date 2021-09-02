/*
 * @Author: your name
 * @Date: 2021-08-27 21:54:49
 * @LastEditTime: 2021-08-27 21:54:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \workspace\hjimi2\bayonet-monitoring-front-demo\src\utils\clickStatefrom.js
 */
export default {
  install (Vue) {
    // 防止重复点击
    Vue.directive('preventReClick', {
      inserted (el, binding) {
        console.log("binding-7",binding)
        el.addEventListener('click', () => {
          if (!el.disabled) {
            el.disabled = true
            setTimeout(() => {
              el.disabled = false
            },binding.value || 1000)
          }
        })
      }
    })
  }
}