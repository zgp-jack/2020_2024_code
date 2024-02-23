<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-21 11:42:22
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-26 10:54:20
 * @Description:统计分析
-->
<template>
  <el-container>
    <el-main>
      <div class="container">
        <el-card class="fixed">
          <el-row>
            <el-form
              size="mini"
              :inline="true"
              :model="formData"
            >
              <el-form-item>
                <span class="title">总体分析</span>
              </el-form-item>
              <el-form-item>
                <department-cascader v-model="formData.deptId" />
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  v-model="formData.startTime"
                  type="date"
                  placeholder="开始时间"
                  value-format="timestamp"
                  format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  v-model="formData.endTime"
                  type="date"
                  placeholder="结束时间"
                  value-format="timestamp"
                  format="yyyy-MM-dd"
                  @change="onEndTimeChange"
                />
              </el-form-item>

              <el-form-item><el-button type="primary" @click="handleQuery">查询</el-button></el-form-item>
              <el-form-item><el-button type="text" class="gray-btn" @click="handleClear">清空查询条件</el-button></el-form-item>
            </el-form>
          </el-row>

        </el-card>
        <pure-main ref="pureMain" class="fixed-next" />

        <pure-department ref="pureDepartment" style="margin-top:24px" />
        <pure-engineer ref="pureEngineer" style="margin-top:24px" />
        <pure-normal-fault ref="pureNormalFault" style="margin-top:24px" />
        <pure-center ref="pureCenter" style="margin-top:24px" />

      </div>
    </el-main>

  </el-container>

</template>

<script>
import PureMain from './panel/main.vue';
import PureDepartment from './panel/department.vue';
import PureEngineer from './panel/engineer.vue';
import PureNormalFault from './panel/normalFault.vue';
import PureCenter from './panel/center.vue';
import Moment from 'moment';
// 如果new Date() 传入参数为yyyy-MM-dd 且天数补全了0时，会自动加上8小时。 而传入格式为 yyyy/MM/dd 时 不会自动加上8小时。
const TodayTimestamp = new Date(Moment().format('yyyy/MM/DD')).getTime();
export default {
  name: 'BzTjfx',
  components: {
    PureMain,
    PureDepartment,
    PureEngineer,
    PureNormalFault,
    PureCenter,
    DepartmentCascader: () => import('@/feat/system/department/component/departmentCascader.vue'),
  },
  data() {
    return {
      formData: {
        startTime: TodayTimestamp,
        endTime: TodayTimestamp + 24 * 60 * 60 * 1000 - 1,
      },
    };
  },
  mounted() {
    this.handleQuery();
  },
  created() {
    console.log(this.componentName);
  },
  methods: {
    async handleQuery() {
      this.$refs.pureMain.changeQueryCondition(this.formData);
      this.$refs.pureDepartment.changeQueryCondition(this.formData);
      this.$refs.pureEngineer.changeQueryCondition(this.formData);
      this.$refs.pureNormalFault.changeQueryCondition(this.formData);
      this.$refs.pureCenter.changeQueryCondition(this.formData);
    },
    async handleClear() {
      this.formData = Object.assign({}, {});
      this.handleQuery();
    },
    // 选择结束时间后，将时间戳加上23:59:59,别问为什么要做这种骚操作，懂的都懂
    onEndTimeChange(val) {
      if (val) {
        this.formData.endTime = val + 24 * 60 * 60 * 1000 - 1;
      }
    },
  },

};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  margin: 0px;
  overflow: scroll;
  ::v-deep .el-form-item {
    margin-bottom: 0px;
  }
  &::-webkit-scrollbar{
    width:6px;
    height:50%;
  }
  &::-webkit-scrollbar-thumb{
    background-color: #E2E3E7;
    border-radius: 3px;
  }
}
.title {
  font-size: 24px;
  font-weight: 600;
  color: #2d405e;
  margin-right: 60px;
}
.gray-btn {
  color:#C0C4CC
}
.fixed {
  position: sticky;
  top: 0px;
  width: 100%;
  margin-right: 24px;
  z-index: 999;
  height: 70px;
}
.fixed-next {
  margin-top: 12px;
}
</style>
