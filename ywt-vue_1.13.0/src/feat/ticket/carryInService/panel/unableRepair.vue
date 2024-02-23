<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-10 15:08:09
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-10 15:22:11
 * @Description:无法维修面板
-->
<template>
  <collapse-item
    :name="name"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template #title>
      无法维修
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
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备状态外观">
            <el-select v-model="formData.deviceStateToName" placeholder="">
              <el-option :label="1" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备数据状态">
            <el-select v-model="formData.deviceDataToName" placeholder="">
              <el-option :label="1" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="无法维修原因">
        <el-input v-model="formData.remark" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="附件">
        <upload v-model="formData.enclosure" />
      </el-form-item>
    </el-form>

  </collapse-item>
</template>

<script>
import CarryInServiceMixin from '../mixin';
export default {
  name: 'UnableRepairPanel',
  mixins: [CarryInServiceMixin],
  data() {
    return {
      name: 'UnableRepairPanel',
      formData: {
        deviceDataToName: null,
        deviceStateToName: null,
        remark: null,
        enclosure: null,
      },
    };
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>

</style>
