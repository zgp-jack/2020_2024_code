<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-07 10:51:45
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:53:49
 * @Description:评分细则
-->
<template>
  <div class="double-padding-bottom">
    <div class="title double-margin-top">评分细则 <pure-button class="base-margin-left" :disabled="!id" label="添加" type="wire-frame-auto" @click="onAdd" /></div>
    <el-table
      border
      :data="tableData"
    >
      <el-table-column
        label="序号"
        align="left"
        type="index"
        width="85px"
      />
      <el-table-column
        v-for="(item, index) in tableColumn"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        align="left"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作" align="left" width="200px">
        <template slot-scope="{row}">
          <pure-button v-if="!row.editing" label="编辑" type="text" @click="onEditRow(row)" />
          <pure-button label="删除" type="text" @click="onDeleteRow(row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
import SettingApi from '../api';
import DetailRuleDialog from '../dialog/detailRule.vue';
export default {
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      tableColumn: [{
        label: '一级指标',
        prop: 'nameToName',
        width: '200px',
      }, {
        label: '二级指标',
        prop: 'secondToName',
        width: '166px',
      }, {
        label: '分值类别',
        prop: 'indexTypeToName',
        width: '166px',
      }, {
        label: '指标描述',
        prop: 'indexDescription',
        width: '380px',
      }, {
        label: '单项分值',
        prop: 'score',
      }, {
        label: '计算规则',
        prop: 'calculationRuleToName',
      }, {
        label: '备注',
        prop: 'note',
      }],
      tableData: [],
    };
  },
  watch: {
    id(val) {
      if (val) {
        this.fetchData();
      }
    },
  },
  methods: {
    async fetchData() {
      try {
        const data = await SettingApi.detailRuleDetail(this.id) || [];
        this.tableData = data.sort((a, b) => { return a.indexType - b.indexType; }); // 将所有数据按主观评分和客观评分依次排序
      } catch (error) {
        console.error(error);
      }
    },
    onAdd() {
      this.$dialog({
        title: '添加评分细则',
        width: '688px',
        component: () => <DetailRuleDialog performanceId={this.id} onDone={this.fetchData} operatorType='CREATE'/>,
      });
    },
    onEditRow(row) {
      this.$dialog({
        title: '编辑评分细则',
        width: '688px',
        component: () => <DetailRuleDialog performanceId={this.id} onDone={this.fetchData} data={row} operatorType='UPDATE'/>,
      });
    },
    async onDeleteRow(row) {
      try {
        await this.$confirm('确认删除本条数据吗？', '提示', { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', });
        await SettingApi.deleteDetailRule(row.id);
        this.fetchData();
      } catch (error) {
        if (error && error !== 'cancel') {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
