<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-10 17:34:47
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-12 14:03:58
 * @Description:派单弹窗
-->
<template>
  <div>
    <el-form
      ref="form"
      label-position="right"
      label-width="120px"
      size="mini"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="指派人员" prop="sendUser">
        <el-input ref="input" v-model="formData.sendUser" style="width:auto" @focus="handleOpenEngineerPanel" />
      </el-form-item>
    </el-form>
    <el-row>
      <el-col style="text-align:right">
        <el-button
          size="mini"
          type="primary"
          :loading="submitButtonLoading"
          @click="submit()"
        >提交</el-button></el-col>
    </el-row>
  </div>
</template>

<script>
import TicketApi from '@/views/reportFault/api';
import EngineerPanel from '@/views/sharedComponents/engineer/engineerPanel.vue';
export default {

  props: {
    orderNum: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        sendUser: null,
      },
      submitButtonLoading: false,
      selectedData: null,
      rules: {
        sendUser: [
          {
            required: true,
            message: '请选择工程师',
            trigger: 'change',
          }
        ],
      },
    };
  },
  methods: {
    async handleOpenEngineerPanel() {
      this.$refs.input.blur();
      this.$drawer({
        width: '548px',
        component: () => <EngineerPanel onDone={this.handleSelectedEngineer} data={this.selectedData}/>,
      });
    },
    handleSelectedEngineer(data) {
      this.$refs.input.blur();
      this.formData.sendUser = data.name;
      this.selectedData = data;
      this.$refs.input.blur();
    },
    async submit() {
      try {
        await this.$refs['form'].validate();
        const data = { orderNum: this.orderNum, };
        if (this.selectedData.isTeam) {
          data.sendTeam = this.selectedData.id?.split('-')[1];
        } else {
          data.sendUser = this.selectedData.id?.split('-')[2];
        }
        this.submitButtonLoading = true;
        await TicketApi.dispatch(data);
        this.submitButtonLoading = false;
        this.$emit('done');
      } catch (error) {
        this.submitButtonLoading = false;
        if (error) {
          this.$message({
            type: 'error',
            message: error,
            duration: 3000,
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
