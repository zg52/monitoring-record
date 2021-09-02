/*
 * @Author: your name
 * @Date: 2021-08-27 18:15:15
 * @LastEditTime: 2021-08-30 18:45:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \workspace\hjimi2\bayonet-monitoring-front-demo\src\api\dashboard.js
 */

import request from '@/utils/request'

// 获取List
export function getHomeInfo(data) {
  return request({
    url: '/homeStatistics',
    method: 'post',
    data
  })
}

// homeRefresh
export function getHomeRefresh(data) {
  return request({
    url: '/homeRefresh',
    method: 'post',
    data
  })
}