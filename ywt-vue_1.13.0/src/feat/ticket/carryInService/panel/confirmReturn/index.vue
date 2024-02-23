<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-01 16:26:00
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-29 10:28:57
 * @Description: 送回确认面板
-->
<template>
  <collapse-item
    :name="name"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template #title>
      送回确认
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
      :rules="rules"
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
import Repaired from './dealForm/repaired.vue';
import UnRepaired from './dealForm/unRepaired.vue';
import ManufactureUnableToRepair from './dealForm/manufactureUnableToRepair.vue';
import DepartmentAbandonRepair from './dealForm/departmentAbandonRepair.vue';
import CarryInServiceApi from '../../api';
import CarryInServiceMixin from '../../mixin';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import {
  isNil,
  omitBy,
} from 'lodash';
export default {
  name: 'ConfirmReturnPanel',
  components: {
    DicSelect,
    Repaired,
    UnRepaired,
    ManufactureUnableToRepair,
    DepartmentAbandonRepair,
  },
  mixins: [CarryInServiceMixin],
  data() {
    return {
      name: 'ConfirmReturnPanel',
      formData: {
        repairResult: '1',
      },
      rules: {
        repairResult: [
          { required: true, message: '请选择维修情况', trigger: 'change', }
        ],
      },
    };
  },
  computed: {
    repairResult() {
      switch (this.formData.repairResult) {
        case '1':
          return 'Repaired';
        case '2':
          return 'UnRepaired';
        case '3':
          return 'ManufactureUnableToRepair';
        case '4':
          return 'DepartmentAbandonRepair';
        case '5':
          return 'ManufactureUnableToRepair';
        case '6':
          return 'ManufactureUnableToRepair';
        default:
          return 'Repaired';
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
  watch: {
    data: {
      handler(val) {
        this.formData = Object.assign({}, this.formData, omitBy(val, isNil));
      },
      deep: true,
    },
  },
  created() {
  },
  methods: {
    async check(repairId) {
      console.log(repairId);
      await this.$refs.form.validate();
      const data = await this.$refs.component.check();
      await CarryInServiceApi.confirmSendBack({ ...data, repairId, repairResult: this.formData.repairResult, });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
