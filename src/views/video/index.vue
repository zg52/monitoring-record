<!--
 * @Author: your name
 * @Date: 2021-08-30 10:31:37
 * @LastEditTime: 2021-08-30 19:08:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \workspace\hjimi2\bayonet-monitoring-front-demo\src\views\video\index.vue
-->
<template>
  <div class="video-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :lg="17">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="video-box">
          <video
            class="h5video"
            id="h5sVideo"
            autoplay
            webkit-playsinline
            playsinline
            controls="controls"
          >
            您的浏览器不支持 video 标签。
          </video>
        </div>
        <el-button style="float: right; margin-right: 16px;" @click="goToMore">查看更多</el-button>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="7">
        <div class="list-item" v-for="(item, index) in list" :key="index">
          <div class="list-item-top">
            <div class="list-item-tx">
              <el-image :src="'http://192.168.1.102:5001/'+item.facePhoto" style="width: 80px; height: 80px; display: block; margin: 0 auto; border-radius: 100%;">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" style="font-size: 80px;"></i>
                </div>
              </el-image>
            </div>
            <div class="list-item-base">
              <p>{{ item.trackId }}</p>
              <p>{{ item.gender }} {{ item.age }}岁</p>
              <p>卡口1出现第{{ item.frequency }}次</p>
            </div>
          </div>
          <div class="list-item-bottom">
            <div class="list-item-content">
              <span class="title">进入</span>
              <span class="sym">:</span>
              <span>
                {{ item.startTime }}
              </span>
            </div>
            <div class="list-item-content">
              <span class="title">离开</span>
              <span class="sym">:</span>
              <span>
                {{ item.endTime }}
              </span>
            </div>
            <div class="list-item-content">
              <span class="title">停留时长</span>
              <span class="sym">:</span>
              <span>
                {{ item.duration }}秒
              </span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getList } from '@/api/record'
import { timestampToTime } from '@/utils/functions'

export default {
  data() {
    return {
      options: [{
        value: '1',
        label: '卡口1'
      }],
      value: '1',
      cameraConf: {
        videoid: 'h5sVideo',
        protocol: window.location.protocol,
        host: '192.168.1.102:9081',
        rootpath: '/',
        token: 'asdfasdfasdf4',
        hlsver: 'v1',
        session: 'c1782caf-b670-42d8-ba90-2244d0b0ee83'
      },
      v1: null,
      list: null
    }
  },
  methods: {
    goToMore() {
      this.$router.push({
        path: "/identificationRecord"
      });
    },
    fetchData() {
      getList({
        pageIndex: 1,
        pageSize: 4,
        gender: "",
        startTime: 0,
        endTime: 0,
      }).then(response => {
        response.data.stayTimeList.forEach(item => {
          if (item['gender'] == 'male') {
            item['gender'] = '男'
          } else if (item['gender'] == 'female') {
            item['gender'] = '女'
          } else if (item['gender'] == 'unknown') {
            item['gender'] = '未知'
          }
          item['startTime'] = timestampToTime(item['startTime']*1000)
          item['endTime'] = timestampToTime(item['endTime']*1000)
        })
        this.list = response.data.stayTimeList
      }).catch(error => {
				// 做些什么
			})
    },
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.v1 = H5sPlayerCreate(this.cameraConf)
    this.v1.connect()
    this.$EventBus.$on('go', async () => {
      this.fetchData();
    });
  },
  beforeDestroy() {
    this.$EventBus.$off('go');
    if (this.v1 != null) {
      this.v1.disconnect()
      this.v1 = null
    }
  },
}
</script>

<style lang="scss" scoped>
.video {
  &-container {
    // margin: 30px;
    margin: 30px 80px;
    .el-select {
      width: 146px;
    }
    .video-box {
      margin: 71px 16px 71px 6px;
      height: 641px;
      background: pink;
      .h5video {
        width: 100%;
        height: 641px;
        object-fit: fill;
        display: inline-block;
      }
    }
    .list-item {
      // width: 357px;
      height: 200px;
      background-color:#f8f9fb;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 29px;
      .list-item-top {
        height: 80px;
        margin-top: 18px;
        padding-left: 30px;
        display: flex;
        align-items: center;
        .list-item-tx {
          width: 80px;
          height: 80px;
          border-radius: 100%;
        }
        .list-item-base {
          height: 80px;
          padding-top: 7px;
          padding-bottom: 7px;
          padding-left: 15px;
          p {
            font-size: 15px;
            line-height: 23px;
            margin: 0;
          }
        }
      }
      .list-item-bottom {
        margin-top: 15px;
        padding-left: 30px;
        .list-item-content {
          font-size: 14px;
          color: #74798c;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          .title {
            width: 56px;
            text-align: justify;   
            height: 16px;   
            &::after {
              content: '';
              display: inline-block;
              padding-left: 100%;
            }     
          }
          .sym {
            margin: 0 10px 0 5px;
          }
        }
      }
    }
    .list-item:last-child {
      margin-bottom: 0;
    }
  }
}
</style>