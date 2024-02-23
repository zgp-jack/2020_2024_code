<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-10 15:43:53
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:55:06
 * @Description:维修结算面板
-->
<template>
  <collapse-item
    :name="name"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template #title>
      维修结算
    </template>
    <template #labelText>
      操作人：
    </template>
    <template #labelValue>
      {{ currentUser }}
    </template>
    <template #labelTime>
      创建时间：
    </template>
    <template #labelTimeValue>
      {{ currentTime }}
    </template>
    <el-form
      ref="form"
      label-position="right"
      label-width="128px"
      size="mini"
      :disabled="disabled"
      :model="formData"
    >

      <el-row class="base-margin-top base-margin-bottom">
        <el-col :span="12">维修情况</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备状态外观">
            <dic-select v-model="formData.deviceState" dic-key="repair_equipment_status" type="string" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备数据状态">
            <dic-select v-model="formData.deviceData" dic-key="repair_equipment_data" type="string" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="附件">
        <upload v-model="formData.enclosure" />
      </el-form-item>
      <el-row class="base-margin-top base-margin-bottom">
        <el-col :span="12">维修信息</el-col>
      </el-row>
      <el-table :data="formData.repairMaintenanceItems" border class="base-margin-top">
        <el-table-column
          label="序号"
          type="index"
          width="84"
          align="left"
        />
        <el-table-column
          prop="name"
          label="维修项名称"
          width="auto"
          align="left"
          show-overflow-tooltip
        />
        <el-table-column
          prop="num"
          label="数量"
          width="153"
          align="left"
          show-overflow-tooltip
        />

        <el-table-column
          prop="enclosure"
          label="附件"
          width="84"
          align="left"
        >
          <template #default="{row}">
            <TableCellAttachment :data="row.enclosure" />
          </template>
        </el-table-column>
      </el-table>
      <el-row class="base-margin-top base-margin-bottom">
        <el-col :span="12">发票信息</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="发票返回">
            <el-radio-group v-model="formData.invoiceFlag">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="formData.invoiceFlag==='1'" :span="12">
          <el-form-item label="发票类型" prop="invoiceType">
            <dic-select v-model="formData.invoiceType" dic-key="Invoice_type" type="string" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="formData.invoiceFlag==='1'" label="发票号" prop="invoiceNum">
        <el-input v-model="formData.invoiceNum" />
      </el-form-item>
      <el-form-item label="发票附件">
        <upload v-model="formData.invoiceEnclosure" />
      </el-form-item>
    </el-form>

  </collapse-item>
</template>

<script>
import CarryInServiceMixin from '../mixin';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import TableCellAttachment from '@/views/project/components/tableCell/attachment.vue';

export default {
  name: 'RepairSettlePanel',
  components: {
    DicSelect,
    TableCellAttachment,
  },
  mixins: [CarryInServiceMixin],
  data() {
    return {
      name: 'RepairSettlePanel',
      formData: {

      },
    };
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>

</style>
