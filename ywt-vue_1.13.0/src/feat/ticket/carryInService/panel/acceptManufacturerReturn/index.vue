<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-16 17:49:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-17 10:24:35
 * @Description:科室接收-厂家送回面板
-->

<template>
  <collapse-item
    :name="name"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template #title>
      科室接收
    </template>
    <template #labelText>
      操作人：
    </template>
    <template #labelValue>
      {{ currentUser }}
    </template>
    <template #labelTime>
      操作时间：
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
          <el-form-item label="维修情况" prop="repairResult">
            <el-select v-model="formData.repairResult" placeholder="">
              <el-option v-for="(item,index) in filterOption" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" />
      </el-row>
    </el-form>
    <component
      :is="repairResult"
      ref="component"
      :disabled="disabled"
      :data="formData"
      v-bind="$attrs"
    />
  </collapse-item>
</template>

<script>
import CarryInServiceMixin from '../../mixin';
import AcceptWithRepaired from './form/acceptWithRepaired.vue';
import AcceptWithUnRepaired from './form/acceptWithRepaired.vue';
import AcceptWithDeptAbandonRepair from './form/acceptWithDeptAbandonRepair.vue';
import AcceptWithManufUnableToRepair from './form/acceptWithManufUnableToRepair.vue';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
export default {
  name: 'AcceptManufacturerReturnPanel',
  components: {
    DicSelect,
    AcceptWithRepaired,
    AcceptWithUnRepaired,
    AcceptWithDeptAbandonRepair,
    AcceptWithManufUnableToRepair,
  },
  mixins: [CarryInServiceMixin],
  data() {
    return {
      name: 'AcceptManufacturerReturnPanel',
      formData: {},
    };
  },
  computed: {
    repairResult() {
      switch (this.formData.repairResult) {
        case '1':
          return 'AcceptWithRepaired';
        case '2':
          return 'AcceptWithUnRepaired';
        case '3':
          return 'AcceptWithManufUnableToRepair';
        case '4':
          return 'AcceptWithDeptAbandonRepair';
        case '5':
          return 'AcceptWithManufUnableToRepair';
        case '6':
          return 'AcceptWithManufUnableToRepair';
        default:
          return 'AcceptWithRepaired';
      }
    },
    filterOption() {
      switch (this.formData.repairResult) {
        case '1':
        case '2':
          return [{
            label: '已修好',
            value: '1',
          }, {
            label: '未修好',
            value: '2',
          }];
        case '3':
          return [{
            label: '厂家无法维修',
            value: '3',
          }];
        case '4':
          return [{
            label: '科室放弃维修',
            value: '4',
          }];
        case '5':
          return [{
            label: '厂家放弃报价',
            value: '5',
          }];
        case '6':
          return [{
            label: '报价审核不通过',
            value: '6',
          }];

        default:
          return [];
      }
    },
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>

</style>
