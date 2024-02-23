<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-09-02 15:48:25
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-05 20:54:32
 * @Description:项目统计
-->
<template>
  <el-card style="height:598px">
    <el-row>
      <el-col :span="20">
        <span class="label">项目统计</span>
        <pure-button-group style="display:inline" :options="groupBtnOptions" default-active="按项目类型" @change="handleTabChange" />
      </el-col>
      <el-col :span="4" style="text-align:right">
        <el-button size="mini" icon="el-icon-download" :disabled="downButtonDisable" @click="onDownExcel" />
      </el-col>

    </el-row>
    <el-row class="base-margin-top">
      <el-col :span="24">
        <el-table
          ref="table"
          border
          :data="tableData"
          max-height="500px"
        >
          <el-table-column label="序号" type="index" width="80" />
          <el-table-column :label="nameLabel" prop="name" />
          <el-table-column label="项目总数" prop="itemCount">
            <template slot-scope="{row}">
              <el-tag size="mini" type="info">{{ row.itemCount }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="已完成">
            <el-table-column label="未超时" prop="complete">
              <template slot-scope="{row}">
                <el-tag size="mini" type="info">{{ row.complete }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="超时" prop="overtime">
              <template slot-scope="{row}">
                <el-tag size="mini" type="danger">{{ row.overtime }}</el-tag>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="未完成">
            <el-table-column label="未超时" prop="incomplete">
              <template slot-scope="{row}">
                <el-tag size="mini" type="info">{{ row.incomplete }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="超时" prop="timeout">
              <template slot-scope="{row}">
                <el-tag size="mini" type="danger">{{ row.timeout }}</el-tag>
              </template>
            </el-table-column>
          </el-table-column>

        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import ProjectApi from '../api';
import PureButtonGroup from '@/feat/statistical/components/groupButton.vue';
import downLoadFile from '@/utils/downLoad';
export default {
  components: {
    PureButtonGroup,
  },
  props: {
    dateTime: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      tableData: [],
      groupBtnOptions: [{
        count: null,
        name: '按项目类型',
      }, {
        count: null,
        name: '按项目负责人',
      }, {
        count: null,
        name: '按项目级别',
      }, {
        count: null,
        name: '按供应商',
      }],
      startTime: null,
      endTime: null,
      template: 1, // 1项目类型2项目负责人3项目级别4供应商
      nameLabel: '项目类型',
      downButtonDisable: false,
    };
  },

  methods: {
    async onDownExcel() {
      try {
        this.downButtonDisable = true;
        const params = {
          template: this.template,
          startTime: this.dateTime?.[0],
          endTime: this.dateTime?.[1],

        };
        const res = await ProjectApi.projectListExportExcel(params);
        const fileName = `项目统计分析.xlsx`;
        downLoadFile(res, fileName);
      } catch (err) {
        this.$message.error(err);
      } finally {
        this.downButtonDisable = false;
      }
    },
    // 查询条件变更后操作
    async  changeQueryCondition(condition = {}) {
      this.startTime = condition.startTime;
      this.endTime = condition.endTime;
      this.fetchData();
    },
    async fetchData() {
      this.tableData = await ProjectApi.projectList({ startTime: this.startTime, endTime: this.endTime,
        template: this.template,
      });
    },
    handleTabChange(val) {
      switch (val) {
        case '按项目类型':
          this.template = '1';
          this.nameLabel = '项目类型';
          break;
        case '按项目负责人':
          this.template = '2';
          this.nameLabel = '负责人';
          break;
        case '按项目级别':
          this.template = '3';
          this.nameLabel = '项目级别';
          break;
        case '按供应商':
          this.template = '4';
          this.nameLabel = '供应商';
          break;
      }
      this.fetchData();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-card__body {
  height: 100%;
  padding: 16px;
}
.label {
  font-size: 18px;
  font-weight: 600;
  color: #2d405e;
  margin-right: 28px;
}
</style>

