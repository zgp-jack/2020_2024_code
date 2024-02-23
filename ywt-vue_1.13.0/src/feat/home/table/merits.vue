<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-31 14:16:42
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-01 11:47:29
 * @Description:绩效考核
-->
<template>
  <el-card>
    <el-row type="flex" align="middle">
      <el-col :span="12" class="title">绩效考核</el-col>
      <el-col :span="12" class="align-right">
        <el-button class="hide_input" size="mini">设置统计时间范围
          <el-date-picker />
        </el-button>
      </el-col>
    </el-row>
    <el-row class="flex">
      <el-table
        v-loading="loading"
        border
        :data="data"
        :empty-text="emptyText"
        height="193px"
      >
        <el-table-column
          v-for="(item,index) in tableColumns"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          align="left"
          width="73px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{row}">
            {{ row[item.prop] }}
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </el-card>
</template>

<script>
import PaginationTable from '@/minxins/common/paginationTable';
export default {
  mixins: [PaginationTable],
  data() {
    return {
      tableColumns: [{
        label: '类别',
        prop: 'a',
      },
      {
        label: '项目',
        prop: 'b',
      },
      {
        label: '服务台',
        prop: 'c',
      }, {
        label: '工单',
        prop: 'd',
      }, {
        label: '巡检',
        prop: 'e',
      }, {
        label: '任务',
        prop: 'f',
      }, {
        label: '总分',
        prop: 'g',
      }
      ],
    };
  },
  async created() {
    this.data = [{
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
      g: 7,
    }, {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
      g: 7,
    }, {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
      g: 7,
    }, {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
      g: 7,
    }];
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
}
.el-row + .el-row {
  margin-top:10px;
}
.flex {
  display: flex;
  flex:1;
}
.hide_input {
  position:  relative !important;
  border: 1px solid #409eff;
  color: #409eff;
  font-size: 14px;
  font-weight: 400;
  line-height: 14px;
  min-width:86px;
  padding:7px 14px;
}
.hide_input .el-date-editor {
  position: absolute;
  top:0;
  left:0;
  opacity: 0;
  ::v-deep .el-input__inner {
    cursor: pointer;
  }
}
</style>
