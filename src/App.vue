<!--
 * @Author: your name
 * @Date: 2021-08-25 10:46:43
 * @LastEditTime: 2021-08-27 21:30:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \workspace\hjimi2\bayonet-monitoring-front-demo\src\App.vue
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { option, randomString } from "@/utils/mqtt";
let client;

export default {
  name: "App",
  created() {
    client = new Paho.Client(
      option.ServerUri,
      option.ServerPort,
      randomString()
    );
    client.connect({
      timeout: option.TimeOut, //连接超时时间
      keepAliveInterval: option.KeepAlive, //心跳间隔
      cleanSession: option.CleanSession, //是否清理Session
      useSSL: option.SSL, //是否启用SSL
      onSuccess: () => {
        console.log("连接成功");
        client.subscribe(`home`);
        console.log("订阅成功");
        //mqtt消息抵达
        client.onMessageArrived = async (msg) => {
          console.log(msg.payloadString, "mqtt msg", msg);
          if (msg.destinationName == "home") {
            this.$EventBus.$emit('go');
          }
        };
        //mqtt失去连接
        client.onConnectionLost = (responseObject) => {
          if (responseObject.errorCode !== 0) {
            console.log(responseObject, "mqtt lost msg");
          }
        };
      },
      onFailure: () => {
        console.log("连接mqtt失败");
      },
    });
  },
  beforeDestroy() {
    if (client.isConnected()) {
      client.disconnect();
    }
  },
};
</script>
