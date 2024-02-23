/**
* @file reject.vue
* @author huang
* @date 2023/11/7
* @description 驳回
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <dialog-template>
    <template #title>
      驳回
    </template>
    <el-form label-width="120px">
      <el-form-item label="驳回原因">
        <el-input
          v-model="form.remark"
          :rows="4"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <pure-button
        label="取消"
        type="minor"
        @click="cancel"
      />
      <pure-button
        label="确定"
        type="major"
        @click="confirm"
      />
    </template>
  </dialog-template>
</template>
<script>
import DialogTemplate from '@/common/components/dialog/template.vue';

export default {
  components: {
    DialogTemplate,
  },
  props: {
    confirmFn: {
      type: Function,
      default: () => {
      },
    },
    data: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      form: {
        id: '',
        remark: '',
      },
    };
  },
  methods: {
    async confirm() {
      this.form.id = this.data.id;
      try {
        await this.confirmFn(this.form);
        this.$emit('done');
        this.$notify.success('提交成功');
      } catch (err) {
        this.$notify.error(err);
      }
    },
    cancel() {
      this.$emit('done');
    },
  },

};
</script>

<style lang='scss'
  scoped
>

</style>
