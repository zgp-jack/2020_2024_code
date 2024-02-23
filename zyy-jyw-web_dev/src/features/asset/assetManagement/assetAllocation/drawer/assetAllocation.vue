/**
* @file assetAllocation.vue
* @author huang
* @date 2023/11/3
* @description Add a brief description of the file here.
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <drawer-template>
    <template #title>
      资产调拨
    </template>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item
        label="调入科室"
        prop="inDept"
      >
        <dept-cascader
          v-model="form.inDept"
          @input="changeDept"
        />
      </el-form-item>
      <el-form-item label="调拨原因">
        <el-input
          v-model="form.reason"
          :rows="4"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <pure-button
      :disabled="!form.inDept"
      label="添加条目"
      type="major"
      @click="onAdd"
    />
    <el-table :data="tableData">
      <el-table-column
        label="序号"
        type="index"
      />
      <el-table-column
        label="资产名称"
        prop=""
      >
        <template #default="{row,$index}">
          <el-select
            v-model="row.id"
            @change="changeSelect($event,row,$index)"
          >
            <el-option
              v-for="item in AssetList"
              :key="item.id"
              :disabled="item.disabled"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="规格型号"
        prop="model"
      />
      <el-table-column
        label="资产编号"
        prop="assetsCode"
      />

      <el-table-column
        label="状态"
        prop="equipmentStateToName"
      />
      <el-table-column
        label="操作"
      >
        <template #default="{row,$index}">
          <pure-button
            label="移除"
            @click="onDel(row,$index)"
          />
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <pure-button
        label="确定"
        type="major"
        @click="submit"
      />
      <pure-button
        label="取消"
        type="minor"
        @click="cancel"
      />

    </template>
  </drawer-template>
</template>

<script>
import DrawerTemplate from '@/common/components/drawer/template.vue';
import DeptCascader from '@/features/system/departmentManagement/components/deptCascader.vue';
import PureButton from '@/common/components/button/index.vue';
import AssetAllocationApi from '../api';
import { map, sortBy, } from 'lodash-es';

export default {
  components: {
    PureButton,
    DrawerTemplate,
    DeptCascader,
  },
  data() {
    return {
      rules: {
        inDept: [
          { required: true, message: '请选择调入科室', trigger: 'change', },
        ],
      },
      form: {
        // 资产条目(资产id集合)
        astList: '',
        // 调入科室
        inDept: '',
        // 调拨原因
        reason: '',
      },
      tableData: [],
      assetList: [],
    };
  },
  computed: {
    AssetIds() {
      return map(this.tableData, 'id');
    },
    AssetList() {
      const arr = map(this.assetList, item => {
        return {
          ...item,
          disabled: this.AssetIds.includes(item.id),
        };
      });
      return sortBy(arr, [
        'disabled',
        'id',
      ]);
    },
  },
  methods: {
    onDel(row, index) {
      this.tableData.splice(index, 1);
    },
    // 选择资产
    changeSelect(val, row, index) {
      const findVal = this.assetList.find(item => item.id === val);
      this.tableData[index] = findVal;
    },
    // 添加调入科室
    onAdd() {
      if (!this.form.inDept) {
        this.$notify({
          type: 'warning',
          message: '请选择调入科室',
        });
        return;
      }
      this.tableData.push({
        name: '',
        id: '',
        model: '',
        assetsCode: '',
        equipmentStateToName: '',

      });
    },
    async changeDept(val) {
      const res = await AssetAllocationApi.getOptionalAsset({
        excludeDept: val,
      });
      this.assetList = res || [];
    },

    async submit() {
      const valid = await this.$refs.form.validate();
      if (valid) {
        try {
          await AssetAllocationApi.assetAllocation({
            astList: this.AssetIds,
            inDept: this.form.inDept,
            reason: this.form.reason,
          });
          this.$notify.success('提交成功!');
          this.$emit('done');
        } catch (err) {
          console.log(err);
          this.$notify.error(err);
        }
      }
    },
    cancel() {
      this.$emit('done');
    },

  },
};

</script>

<style lang='scss'
  scoped
>

</style>
