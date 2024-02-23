<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-01 11:32:11
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-29 15:39:11
 * @Description:接收处置面板
-->
<template>
  <collapse-item
    :name="name"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template #title>
      接收处置
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
      <el-form-item label="是否邀标">
        <el-radio-group v-model="formData.bidsFlag" @change="onBidsFlagChange">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <manufacture :list="formData.manufacturerInfos" :multi="formData.bidsFlag===1" />
      <template v-if="formData.bidsFlag===1">

        <el-form-item label="报价截止时间">
          <el-date-picker
            v-model="formData.quoteEndTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>
      </template>

      <template v-else-if="formData.bidsFlag===0">

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

      <el-form-item label="备注">
        <el-input v-model="formData.remark" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="附件">
        <upload v-model="formData.enclosure" />
      </el-form-item>
    </el-form>
  </collapse-item>
</template>

<script>
import CarryInServiceApi from '../api';
import CarryInServiceMixin from '../mixin';
import Manufacture from '@/feat/ticket/carryInService/components/manufacture';
export default {
  name: 'DealAcceptPanel',
  components: {
    Manufacture,
  },
  mixins: [CarryInServiceMixin],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      name: 'DealAcceptPanel',
      formData: {
        bidsFlag: 0,
        manufacturerInfos: [{ manufacturerId: null, manufacturerUser: null, manufacturerPhone: null, }],
        quoteEndTime: null,
        pickUpTime: null,
        remark: null,
        enclosure: null,
      },
      rules: {},
    };
  },
  created() {

  },
  methods: {
    async check(repairId) {
      await this.$refs.form.validate();
      await CarryInServiceApi.receiveRepair({ id: repairId, ...this.formData, });
    },
    onBidsFlagChange() {
      if (this.formData.bidsFlag === 1) {
        this.formData.manufacturerInfos = [{ manufacturerId: null, manufacturerUser: null, manufacturerPhone: null, }, { manufacturerId: null, manufacturerUser: null, manufacturerPhone: null, }];
      } else {
        this.formData.manufacturerInfos = [{ manufacturerId: null, manufacturerUser: null, manufacturerPhone: null, }];
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
