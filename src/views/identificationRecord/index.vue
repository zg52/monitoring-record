<!--
 * @Author: your name
 * @Date: 2021-08-27 13:23:49
 * @LastEditTime: 2021-08-30 19:02:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \workspace\hjimi2\bayonet-monitoring-front-demo\src\views\identificationRecord\index.vue
-->

<template>
  <div class="identificationRecord-container">
    <div class="identificationRecord-select-form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="卡 口：">
          <el-select v-model="formInline.bayonet" placeholder="请选择卡口">
            <el-option label="全部" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性 别：">
          <el-select v-model="formInline.gender" placeholder="请选择性别">
            <el-option label="全部" value=""></el-option>
            <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option>
            <el-option label="未知" value="unknown"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日 期：">
          <el-date-picker
            v-model="formInline.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="timeChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- 搞个flag好一点 -->
          <el-button type="primary" @click="onSubmit" v-preventReClick="2000">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="identificationRecord-table">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column prop="trackId" label="姓名" width="180">
        </el-table-column>
        <el-table-column label="照片" width="180">
          <template slot-scope="scope">
            <el-image :src="'http://192.168.1.102:5001/'+scope.row.facePhoto" style="width: 40px; height: 40px; display: block; margin: 0 auto;">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" style="font-size: 40px;"></i>
              </div>
            </el-image>
            <!-- <img :src="'http://192.168.1.102:5001/'+scope.row.facePhoto" style="width: 40px; height: 40px; display: block; margin: 0 auto;"> -->
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别">
        </el-table-column>
        <el-table-column prop="age" label="年龄"></el-table-column>
        <el-table-column prop="startTime" label="进入时间"></el-table-column>
        <el-table-column prop="endTime" label="离开时间"></el-table-column>
        <el-table-column label="停留时长">
          <template slot-scope="scope">
            <span>{{ scope.row.duration }}s</span>
          </template>
        </el-table-column>
        <el-table-column label="出现次数">
          <template slot-scope="scope">
            <span>{{ scope.row.frequency }}次</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="table-pagination"
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page="pageIndex"
        @current-change="handleCurrentChange"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getList } from '@/api/record'
import { timestampToTime } from '@/utils/functions'

export default {
  data() {
    return {
      formInline: {
        gender: "",
        bayonet: "0",
        time: [(new Date(new Date().toLocaleDateString()).getTime()), (new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)],
      },
      list: null,
      listLoading: false,
      pageSize: 10,
      pageIndex: 1,
      total: 0,
    };
  },
  methods: {
    timeChange(x) {
      console.log(x)
      if (x == null) {
        this.$nextTick(() => {
          this.formInline.time = ["", ""]
        })
      } else {
        this.formInline.time = this.formInline.time.map((item, index) => {
          if (index == 0) {
            item = item !== '' ? (new Date(new Date(item).toLocaleDateString()).getTime()) : "";
          } else if (index == 1) {
            item = item !== '' ? (new Date(new Date(item).toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1) : "";
          }
          return item
        })
      }
      console.log(this.formInline)
    },
    async handleCurrentChange(cpage) {
      this.pageIndex = cpage;
      await this.fetchData()
    },
    async onSubmit() {
      await this.fetchData()
    },
    fetchData() {
      const { pageSize, pageIndex, formInline } = this
      const { gender, time } = formInline
      const [startTime = 0, endTime = 0] = time
      this.listLoading = true
      getList({
        pageIndex,
        pageSize,
        gender,
        startTime: startTime == '' ? 0 : startTime,
        endTime: endTime == '' ? 0 : endTime,
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
        this.total = response.data.total
        this.listLoading = false
      }).catch(error => {
				this.listLoading = false
			})
    },
  },
  created() {
    this.fetchData()
  },
  // beforeDestroy() {
  //   this.$EventBus.$off('go');
  // },
  // mounted() {
  //   this.$EventBus.$on('go', async () => {
  //     this.fetchData();
  //   });
  // }
};
</script>

<style lang="scss" scoped>
.identificationRecord {
  &-container {
    // margin: 30px;
    margin: 30px 80px;
  }
  &-select-form {
    .el-form {
      .el-form-item {
        margin-right: 30px;
      }
    }
  }
  &-table {
    padding-top: 20px;
    position: relative;
    padding-bottom: 45px;
    .table-pagination {
      position: absolute;
      bottom: 0px;
      right: 5px;
    }
  }
}
</style>
