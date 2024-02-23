<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-20 10:49:50
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:54:55
 * @Description:维修历史抽屉
-->
<template>
  <div
    v-loading="loading"
    class="drawer"
    :element-loading-text="loadingText"
  >
    <div class="header">
      <div class="title">
        维修历史
        <span class="accumulate-count">
          累积维修<span> {{ formData.repairNum }} </span>次
        </span>
        <span class="accumulate-money">
          累积维修金额<span> {{ formData.costSum }} </span>元
        </span>
      </div>
    </div>
    <div class="body">
      <el-row class="h-100">
        <el-col class="h-100">
          <el-table :data="formData.historyList" class="table" border>
            <el-table-column label="序号" type="index" width="85" align="left" />
            <el-table-column label="送修时间" width="147" align="left" prop="createTime" show-overflow-tooltip="" />
            <el-table-column label="维修金额" width="195" align="left" prop="cost" />
            <el-table-column label="维修情况" align="left" prop="repairResultToName" />
            <el-table-column label="操作" width="84" align="left">
              <template slot-scope="{row}">
                <pure-button
                  type="text"
                  label="查看"
                  @click="onView(row.repairId)"
                />
              </template>

            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import CarryInServiceApi from '../api';
import CarryInServiceDetailDrawer from './detail.vue';
import FormDialog from '@/minxins/common/formDialog';
export default {
  components: {

  },
  mixins: [FormDialog],
  data() {
    return {
      detailApi: CarryInServiceApi.maintenanceHistory,
      formData: {
        repairNum: 0,
        costSum: 0,
        historyList: [],
      },
    };
  },
  methods: {
    onView(repairId) {
      this.$fuckDrawer({
        width: '1184px',
        component: () => <CarryInServiceDetailDrawer operatorType='VIEW' onDone={this.onPerformedOperation} id={repairId}/>,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.accumulate-count,.accumulate-money,.label {
  color: #879bba;
  font-size: $--pure-base-font-size;
  margin-right: 80px;
  span {
    font-weight: 400;
    color: #2d405e;
  }
}
.accumulate-count {
  margin-left: 54px;
}
.body {
  padding-top: 16px;
  border-top: 1px solid #E6EAF2;
  height: 100%;
  padding-left: 10px;
  overflow: scroll;
  ::v-deep .el-timeline-item__timestamp {
    font-size: $--pure-base-font-size;
  }
}
.table {
  margin-top: 16px;
}
</style>
