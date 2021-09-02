/*
 * @Author: your name
 * @Date: 2021-08-27 15:52:25
 * @LastEditTime: 2021-08-27 17:53:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \workspace\hjimi2\bayonet-monitoring-front-demo\src\api\record.js
 */

import request from '@/utils/request'

// 获取List
export function getList(data) {
  return request({
    url: '/identificationRecord',
    method: 'post',
    data
  })
}