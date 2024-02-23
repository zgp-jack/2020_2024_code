<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-31 14:19:02
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-01 11:47:42
 * @Description:会议安排
-->
<template>
  <el-card>
    <el-row type="flex" align="middle">
      <el-col :span="12" class="title">会议安排(10)</el-col>
      <el-col :span="12" class="align-right" />
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
          label="序号"
          align="left"
          type="index"
          width="49px"
        />
        <el-table-column
          v-for="(item,index) in tableColumns"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          align="left"

          :show-overflow-tooltip="true"
        >
          <template slot-scope="{row}">
            {{ row[item.prop] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left" width="49px">
          <template>

            <span class="table-column-btn">查看</span>
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
      tableColumns: [
        {
          label: '会议主题',
          prop: 'b',
        },
        {
          label: '会议时间',
          prop: 'c',
        }, {
          label: '会议地址',
          prop: 'd',
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
    }];
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  height: 28px;
  line-height: 28px;
}
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

</style>
