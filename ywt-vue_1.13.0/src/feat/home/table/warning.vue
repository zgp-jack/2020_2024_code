<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-31 14:21:28
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-01 10:40:44
 * @Description:预警提醒
-->
<template>
  <el-card>
    <el-row type="flex" align="middle">
      <el-col :span="12" class="title">预警提醒</el-col>
      <el-col :span="12" class="align-right">
        <span class="btn">关闭所有预警</span>
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
        <el-table-column label="操作" align="left" width="104px">
          <template>

            <span class="table-column-btn">查看</span>
            <span class="table-column-btn">关闭</span>
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
          label: '提醒描述',
          prop: 'b',
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
.title,.btn {
  font-size: 16px;
  height: 28px;
  line-height: 28px;
  font-weight: 400;
}
.btn {
  cursor: pointer;
  font-size: 14px;
  color: #2d405e;
}

.el-row + .el-row {
  margin-top:10px;
}
.flex {
  display: flex;
  flex:1;
}
</style>
