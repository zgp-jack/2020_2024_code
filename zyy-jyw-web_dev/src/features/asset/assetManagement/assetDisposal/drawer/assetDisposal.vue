<template>
  <drawer-template>
    <template #title>
      处置申请
    </template>
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
    >

      <el-form-item label="处置原因">
        <el-input
          v-model="form.reason"
          :rows="4"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <pure-button
      label="添加条目"
      type="major"
      @click="onAdd"
    />
    <div class="table">

      <el-table :data="tableData" current-row-key="id">
        <el-table-column
          label="序号"
          type="index"
          width="80"
        />
        <el-table-column
          label="资产名称"
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
        <!-- <el-table-column
          label="处置类型"
        >
        <template #default="{row}">
           <el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
        </template>
        </el-table-column> -->
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
import PureButton from '@/common/components/button/index.vue';
import AssetDisposalApi from '../api';
import AssetAllocationApi from '@/features/asset/assetManagement/assetAllocation/api';

import { map, sortBy, } from 'lodash-es';

export default {
  components: {
    PureButton,
    DrawerTemplate,
  },
  data() {
    return {

      form: {
        // 原因
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
  mounted() {
    this.getAssetList();
  },
  methods: {
    onDel(row, index) {
      this.tableData.splice(index, 1);
    },
    // 选择资产
    changeSelect(val, row, index) {
      const findVal = this.assetList.find(item => item.id === val);
      this.tableData[index] = findVal;
      console.log(findVal, 'f');
      // this.tableData[index].equipmentStateToName = '报废';
    },
    // 添加调入科室
    onAdd() {
      this.tableData.push({
        name: '',
        id: '',
        model: '',
        assetsCode: '',
        equipmentStateToName: '',

      });
    },
    // 资产列表获取
    async getAssetList(val) {
      const res = await AssetAllocationApi.getOptionalAsset({
        excludeEquipmentState: 2,
      });
      this.assetList = res || [];
      this.tableData = [];
    },
    // 提交
    async submit() {
      const valid = await this.$refs.form.validate();
      if (valid) {
        try {
          await AssetDisposalApi.disposal({
            astList: this.tableData.map(item => {
              return {
                id: item.id,
                dispose: 2,
              };
            }),
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
