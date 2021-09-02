/*
 * @Author: your name
 * @Date: 2021-08-27 20:19:33
 * @LastEditTime: 2021-08-27 20:37:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \workspace\hjimi2\bayonet-monitoring-front-demo\src\utils\mqtt.js
 */
// 随机字符串
function randomString(len){
	len = len || 32;
	let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	let maxPos = $chars.length;
	let pwd = '';
	for (let i = 0; i < len; i++) {
			pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

//客户端选项
const option = {
	"ServerUri": '192.168.1.102',
	"ServerPort": 8083, 
	// "ClientId": randomString(), // "mqttjs_17a74597be1"
	"TimeOut": 120*1000,
	"KeepAlive": 100,
	"CleanSession": false,
	"SSL":false
}

export {
	option,
	randomString
}

