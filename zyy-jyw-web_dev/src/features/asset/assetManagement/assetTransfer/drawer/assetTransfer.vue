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
      转移申请
    </template>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item
        label="转出科室"
        prop="outDept"
      >
        <dept-cascader
          v-model="form.outDept"
          @input="changeDept"
        />
      </el-form-item>
      <el-form-item label="转出原因">
        <el-input
          v-model="form.reason"
          :rows="4"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <pure-button
      :disabled="!form.outDept"
      label="添加条目"
      type="major"
      @click="onAdd"
    />
    <div class="table">

      <el-table :data="tableData">
        <el-table-column
          label="序号"
          type="index"
          width="80"
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
    </div>

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
import AssetTransferApi from '../api';
import AssetAllocationApi from '@/features/asset/assetManagement/assetAllocation/api';

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
        outDept: [
          { required: true, message: '请选择转出科室', trigger: 'change', },
        ],
      },
      form: {
        // 资产条目(资产id集合)
        astList: '',
        // 调入科室
        outDept: '',
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
      if (!this.form.outDept) {
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
    // 选择科室
    async changeDept(val) {
      const res = await AssetAllocationApi.getOptionalAsset({
        useDept: val,
      });
      this.assetList = res || [];
    },
    // 提交
    async submit() {
      const valid = await this.$refs.form.validate();
      if (valid) {
        try {
          await AssetTransferApi.transferApplication({
            astList: this.AssetIds,
            outDept: this.form.outDept,
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
@import "~@/common/styles/theme/handle.scss";

.table {
  margin-top: 16px;

  ::v-deep .el-table {

    thead {
      @include font_color_imp('color-assist-gray') ;

      font-size: 16px !important;

      th.el-table__cell {
        @include background_color_imp('color-assist-4') ;
      }
    }

  }
}
</style>
