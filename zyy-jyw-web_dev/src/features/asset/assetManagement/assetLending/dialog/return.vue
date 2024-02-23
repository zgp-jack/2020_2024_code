/**
* @file return.vue
* @author huang
* @date 2023/11/7
* @description  借用归还
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <dialog-template>
    <template #title>
      归还
    </template>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="归还人">
        <el-input v-model="form.returnUser" />
      </el-form-item>
      <el-form-item label="归还人电话">
        <el-input v-model="form.returnPhone" />
      </el-form-item>
      <el-form-item
        label="归还日期"
        prop="returnDate"
      >
        <el-date-picker v-model="form.returnDate" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.returnRemark" />

      </el-form-item>
    </el-form>
    <template #footer>
      <pure-button
        label="取消"
        @click="cancel"
      />
      <pure-button
        label="确认"
        @click="confirm"
      />

    </template>
  </dialog-template>
</template>
<script>
import DialogTemplate from '@/common/components/dialog/template.vue';
import PureButton from '@/common/components/button/index.vue';
import AssetLendingApi from '../api';

export default {
  components: {
    PureButton,
    DialogTemplate,
  },
  props: {
    data: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      rules: {
        returnDate: [
          { required: true, message: '请选择归还日期', trigger: 'change', },
        ],
      },
      form: {
        // 借出科室
        id: '',
        // 归还日期
        returnDate: '',
        // 归还人电话
        returnPhone: '',
        // 归还备注
        returnRemark: '',
        // 归还人
        returnUser: '',
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.form.id = this.data.id;
      this.form.returnUser = this.data.inUser;
      this.form.returnPhone = this.data.inPhone;
      this.form.returnDate = this.$options.filters.timeFormat(new Date(), 'YYYY-MM-DD');
    });
  },
  methods: {
    cancel() {
      this.$emit('done');
    },
    async confirm() {
      const valid = await this.$refs.form.validate();
      if (valid) {
        try {
          await AssetLendingApi.assetReturn(this.form);
          this.$notify.success('归还成功!');
          this.$emit('done');
        } catch (err) {
          this.$notify.error(err);
        }
      }
    },
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
