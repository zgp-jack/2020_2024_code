<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-02 09:52:03
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-07 21:48:41
 * @Description:送回处置
-->

<template>
  <collapse-item
    :name="name"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template #title>
      送回处置
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

      <el-form-item v-if="type==='changeManufacturer'" label="更换厂家">
        <el-radio-group v-model="formData.changeManufacturerFlag">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="formData.changeManufacturerFlag!==1">
        <el-form-item label="科室领回方式">
          <el-radio-group v-model="formData.reclaimType">
            <el-radio :label="1">工程师配送</el-radio>
            <el-radio :label="2">上门自取</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row v-if="formData.reclaimType===1">
          <el-col :span="12">
            <el-form-item key="deliveryUser" label="配送人" prop="deliveryUser">
              <user-select v-model="formData.deliveryUser" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配送人电话">
              <el-input v-model="formData.deliveryPhone" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template v-if="formData.changeManufacturerFlag===1">
        <manufacture :list="formData.manufacturerInfos" :multi="false" />
        <el-form-item label="预约取件时间">
          <el-date-picker
            v-model="formData.pickUpTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>
      </template>
    </el-form>

  </collapse-item>
</template>

<script>
import CarryInServiceApi from '../api';
import CarryInServiceMixin from '../mixin';
import Manufacture from '@/feat/ticket/carryInService/components/manufacture';
import UserSelect from '@/views/project/components/userSelect/index';

export default {
  name: 'DealReturnPanel',
  components: {
    UserSelect,
    Manufacture,
  },
  mixins: [CarryInServiceMixin],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },

  },
  data() {
    return {
      name: 'DealReturnPanel',
      formData: {
        reclaimType: 1,
        deliveryUser: null,
        deliveryPhone: null,
        changeManufacturerFlag: 0,
        manufacturerInfos: [{ manufacturerId: null, manufacturerUser: null, manufacturerPhone: null, }],
        pickUpTime: null,
      },
      rules: {
        deliveryUser: [
          { required: true, message: '请选择配送人', trigger: 'change', }
        ],
      },

    };
  },
  computed: {
    type() {
      // 'changeManufacturer'-需要更换厂家 department-科室领回
      if (['3', '5', '6'].includes(this.data.repairResult)) {
        return 'changeManufacturer';
      } else {
        return 'department';
      }
    },
  },
  watch: {
    'data.repairResult': {
      handler(val) {
        if (['3', '5', '6'].includes(val)) {
          this.formData.reclaimType = null;
        }
      },
      deep: true,
    },
  },

  methods: {
    async check(repairId) {
      await this.$refs.form.validate();
      await CarryInServiceApi.dealSendBack({ repairId, ...this.formData, });
    },

  },
};
</script>

<style lang="scss" scoped>

</style>
