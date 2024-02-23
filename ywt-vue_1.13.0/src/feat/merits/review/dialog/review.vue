<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-07 16:15:13
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-19 17:56:34
 * @Description:最终审核弹窗
-->
<template>
  <el-form
    ref="form"
    size="mini"
    :model="formData"
    label-position="right"
    label-width="128px"
  >
    <el-form-item label="审核结果">
      <dic-radio v-model="formData.state" dic-key="add_type" type="string" />
    </el-form-item>
    <el-form-item v-if="formData.state === '1'" label="备注">
      <el-input
        v-model="formData.note"
        type="textarea"
        :rows="4"
      />
    </el-form-item>
    <el-form-item v-if="formData.state === '2'" label="不通过原因">
      <el-input
        v-model="formData.note"
        type="textarea"
        :rows="4"
      />
    </el-form-item>
    <el-form-item v-if="formData.state === '1'" label="">
      <div class="tip"><span>*注意：</span>此“最终审核”弹窗，审核结果选择“<span>通过</span>”并提交后，<span>本月绩效审核完结， 无法再次操作修改，</span>请谨慎操作！</div>
    </el-form-item>
    <div class="align-right">
      <pure-button label="提交" @click="onSubmit" />
    </div>
  </el-form>
</template>

<script>
import ReviewApi from '../api';
import DicRadio from '@/feat/system/dictionary/normal/component/dicRadio.vue';
export default {
  components: {
    DicRadio,
  },
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        state: '1',
        note: null,
      },
    };
  },
  methods: {
    async onSubmit() {
      try {
        await ReviewApi.review({ ...this.formData, id: this.id, });
        this.$emit('done');
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tip {
  color: #334266;
  span {
    color: #F56C6C;
  }
}
</style>
