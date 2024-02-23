<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-07 10:50:55
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:53:53
 * @Description:考核分支对应等级设置
-->
<template>
  <div class="double-padding-bottom">
    <div class="title double-margin-top">考核分支对应等级设置 <pure-button class="base-margin-left" :disabled="!id" label="添加" type="wire-frame-auto" @click="onAdd" /></div>
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
      >
        <template slot-scope="{row}">
          <span v-if="item.prop==='score'&&row.editing">
            <dic-select v-model="row.firstSymbol" dic-key="Symbol" size="mini" type="string" style="width:160px;margin-right:8px" />
            <el-input v-model="row.firstScore" size="mini" style="width:100px;margin-right:8px" />&
            <dic-select v-model="row.secondSymbol" dic-key="Symbol" size="mini" type="string" style="width:160px;margin-right:8px" />
            <el-input v-model="row.secondScore" size="mini" style="width:100px;margin-right:8px" />
          </span>
          <span v-if="item.prop==='score'&&!row.editing">{{ convertScore(row) }}</span>
          <span v-else-if="item.prop==='level' &&!row.editing">{{ row['levelToName'] }}</span>
          <span v-else-if="item.prop==='level' &&row.editing"><dic-select v-model="row.level" size="mini" dic-key="performance_level" type="string" /></span>
          <span v-else-if="item.prop==='note' &&row.editing"><el-input v-model="row.note" size="mini" /></span>
          <span v-else-if="item.prop==='note' &&!row.editing">{{ row.note }}</span>
          <span v-else-if="item.prop==='roleIdToName' &&row.editing"><role-select v-model="row.role" /></span>
          <span v-else-if="item.prop==='roleIdToName' &&!row.editing">{{ row.roleIdToName+'-'+row.deptIdToName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="200px">
        <template slot-scope="{row,$index}">
          <pure-button v-if="!row.editing" label="编辑" type="text" @click="onEditRow(row)" />
          <pure-button v-if="row.editing" label="保存" type="text" @click="onSubmitRow(row)" />
          <pure-button v-if="row.editing" label="取消" type="text" @click="onCancelEditRow(row,$index)" />
          <pure-button label="删除" type="text" @click="onDeleteRow(row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
import SettingApi from '../api';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
export default {
  components: {
    DicSelect,
  },
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      tableColumn: [{
        label: '分值',
        prop: 'score',
      }, {
        label: '等级',
        prop: 'level',
        width: '166px',
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
        const data = await SettingApi.levelDetail(this.id);
        this.tableData = data.map(item => ({
          ...item,
          role: item.deptId + '-' + item.roleId,
          editing: false,
        }));
      } catch (error) {
        console.error(error);
      }
    },
    onAdd() {
      this.tableData.push({
        role: '',
        subjectiveRatio: '',
        objectiveRatio: '',
        note: '',
        editing: true,
      });
    },
    onEditRow(row) {
      row.editing = true;
    },
    async onSubmitRow(row) {
      try {
        if (row.id) {
          await SettingApi.updateLevel({
            ...row,
            performanceId: this.id,
          });
        } else {
          await SettingApi.createLevel({
            ...row,
            performanceId: this.id,
          });
        }
        this.fetchData();
      } catch (error) {
        console.error(error);
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    onCancelEditRow(row, index) {
      row.editing = false;
      if (!row.id) {
        this.tableData.splice(index, 1);
      }
    },
    convertScore(row) {
      let result = '';
      if (row.firstSymbolToName) {
        result += `${row.firstSymbolToName}${row.firstScore} `;
      }
      if (row.secondSymbolToName) {
        if (result) {
          result += `& ${row.secondSymbolToName}${row.secondScore}`;
        } else {
          result += `${row.secondSymbolToName}${row.secondScore}`;
        }
      }
      return result;
    },
    async onDeleteRow(row) {
      try {
        await this.$confirm('确认删除本条数据吗？', '提示', { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', });
        await SettingApi.deleteLevel(row.id);
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
