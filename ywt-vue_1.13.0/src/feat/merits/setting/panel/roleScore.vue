<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-07 10:49:20
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:53:56
 * @Description:角色对应分值占比
-->
<template>
  <div class="double-padding-bottom">
    <div class="title double-margin-top">角色对应分值占比 <pure-button class="base-margin-left" :disabled="!id" label="添加" type="wire-frame-auto" @click="onAdd" /> </div>
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
          <span v-if="item.prop==='subjectiveRatio'&&row.editing"><el-input v-model="row.subjectiveRatio" size="mini" class="w-100" />%</span>
          <span v-if="item.prop==='subjectiveRatio'&&!row.editing">{{ row['subjectiveRatio'] }}%</span>
          <span v-else-if="item.prop==='objectiveRatio' &&!row.editing">{{ row['objectiveRatio'] }}%</span>
          <span v-else-if="item.prop==='objectiveRatio' &&row.editing"><el-input v-model="row.objectiveRatio" size="mini" class="w-100" />%</span>
          <span v-else-if="item.prop==='note' &&row.editing"><el-input v-model="row.note" size="mini" /></span>
          <span v-else-if="item.prop==='note' &&!row.editing">{{ row.note }}</span>
          <span v-else-if="item.prop==='roleIdToName' &&row.editing">
            <!-- <role-select v-model="row.role" /> -->
            <el-input :value="row.roleIdToName+'-'+row.deptIdToName" size="mini" @focus="onRoleInputBlur(row)" />
          </span>
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
import DepartmentRoleDialog from '../dialog/departmentRole.vue';
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
        label: '角色',
        prop: 'roleIdToName',
        width: '200px',
      }, {
        label: '主观分值占比',
        prop: 'subjectiveRatio',
        width: '166px',
      }, {
        label: '客观分支占比',
        prop: 'objectiveRatio',
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
  mounted() {

  },
  methods: {
    async fetchData() {
      try {
        const data = await SettingApi.roleScoreDetail(this.id);
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
        roleIdToName: '',
        deptIdToName: '',
        deptId: null,
        roleId: null,
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
          await SettingApi.updateRoleScore({
            ...row,
            performanceId: this.id,
            // roleId: row.role.split('-')[1],
            // deptId: row.role.split('-')[0],
          });
        } else {
          await SettingApi.createRoleScore({
            ...row,
            performanceId: this.id,
            // roleId: row.role.split('-')[1],
            // deptId: row.role.split('-')[0],
          });
        }
        this.fetchData();
      } catch (error) {
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
    onRoleInputBlur(row) {
      this.$dialog({
        title: '选择角色',
        width: '688px',
        component: () => <DepartmentRoleDialog data={row} onDone={(data) => this.onSelectedDepartmentRoleDone(data, row)}/>,
      });
    },
    onSelectedDepartmentRoleDone(data, row) {
      row.deptId = data.deptId;
      row.roleId = data.roleId;
      row.roleIdToName = data.roleIdToName;
      row.deptIdToName = data.deptIdToName;
    },
    async onDeleteRow(row) {
      try {
        await this.$confirm('确认删除本条数据吗？', '提示', { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', });
        await SettingApi.deleteRoleScore(row.id);
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
.w-100 {
  width: 100px;
}
</style>
