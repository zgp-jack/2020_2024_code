<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-29 11:03:38
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-29 16:16:47
 * @Description:流标处理面板
-->

<template>
  <collapse-item
    :name="name"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template #title>
      流标处理
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
      <el-form-item label="流标处理">
        <dic-radio v-model="formData.auctionsFailed" dic-key="outflow_bid" type="string" @change="onFlagChange" />
      </el-form-item>
      <template v-if="formData.auctionsFailed==='1'">
        <manufacture :list="formData.manufacturerInfos" :multi="true" />
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
      <template v-if="formData.auctionsFailed==='2'">
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
      <template v-if="formData.auctionsFailed==='3'">
        <el-form-item label="放弃送修原因">
          <el-input v-model="formData.giveUpReason" type="textarea" :rows="4" />
        </el-form-item>
      </template>
    </el-form>
  </collapse-item>
</template>

<script>
import CarryInServiceApi from '../api';
import CarryInServiceMixin from '../mixin';
import Manufacture from '@/feat/ticket/carryInService/components/manufacture';
import DicRadio from '@/feat/system/dictionary/normal/component/dicRadio.vue';
import {
  find,
} from 'lodash';
export default {
  name: 'FailureTenderPanel',
  components: {
    DicRadio,
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
      name: 'FailureTenderPanel',
      formData: {
        auctionsFailed: '1',
        manufacturerInfos: [{ manufacturerId: null, manufacturerUser: null, manufacturerPhone: null, }, { manufacturerId: null, manufacturerUser: null, manufacturerPhone: null, }],
        giveUpReason: null,
        quoteEndTime: null,
        pickUpTime: null,
      },
      rules: {},
    };
  },
  created() {
  },
  methods: {
    async check(repairId) {
      await this.$refs.form.validate();
      await CarryInServiceApi.dealFailureTender({ repairId, ...this.formData, });
    },

    onManufacturerUserChange(val, index) {
      const user = find(this.manufacturerUserList[index], { id: val, });
      this.$set(this.formData.manufacturerInfos[index], 'manufacturerPhone', user.mblNo);
    },
    onFlagChange() {
      if (this.formData.auctionsFailed === '1') {
        this.formData.manufacturerInfos = [{ manufacturerId: null, manufacturerUser: null, manufacturerPhone: null, }, { manufacturerId: null, manufacturerUser: null, manufacturerPhone: null, }];
      } else if (this.formData.auctionsFailed === '2') {
        this.formData.manufacturerInfos = [{ manufacturerId: null, manufacturerUser: null, manufacturerPhone: null, }];
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
