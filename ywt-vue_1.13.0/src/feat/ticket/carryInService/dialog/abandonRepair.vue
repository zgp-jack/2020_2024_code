<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-04 17:30:19
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-09 16:42:30
 * @Description:放弃维修弹窗
-->
<template>
  <el-form
    label-position="right"
    label-width="108px"
    size="mini"
  >
    <el-form-item label="放弃原因">
      <dic-radio v-model="formData.reason" dic-key="cancel_repair_reason" type="string" />
    </el-form-item>
    <el-form-item label="备注">
      <el-input
        v-model="formData.remark"
        type="textarea"
        :rows="4"
      />
    </el-form-item>
    <div class="align-right">
      <pure-button label="取消" type="wire-frame" @click="$emit('cancel')" />
      <pure-button label="确认放弃" type="error" @click="onSubmit" />
    </div>

  </el-form>
</template>
<script>
import CarryInServiceApi from '../api';
import DicRadio from '@/feat/system/dictionary/normal/component/dicRadio.vue';
export default {
  name: 'TicketNotPassAuditDialog',
  components: {
    DicRadio,
  },
  props: {
    repairId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        repairId: null,
        remark: null,
        reason: '1',
      },
    };
  },
  created() {
    this.formData.repairId = this.repairId;
  },
  methods: {
    async onSubmit() {
      try {
        await CarryInServiceApi.abandonRepair(this.formData);
        this.$message.success('已放弃维修');
        this.$emit('done');
      } catch (error) {
        this.$message.error(`放弃维修处理失败: ${error}`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
