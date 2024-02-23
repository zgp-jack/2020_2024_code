<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-05 10:23:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-05 10:24:45
 * @Description:终止弹窗
-->
<template>
  <el-form
    label-position="right"
    label-width="108px"
    size="mini"
  >
    <el-form-item label="终止原因">
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
      <pure-button label="确认终止" type="error" @click="onSubmit" />
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
      type: String,
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
        await CarryInServiceApi.terminate(this.formData);
        this.$message.success('已终止');
        this.$emit('done');
      } catch (error) {
        this.$message.error(`终止维修处理失败: ${error}`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
