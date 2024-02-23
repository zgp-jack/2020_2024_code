<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-10 16:41:57
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-21 17:21:29
 * @Description:
-->
<template>
  <div>
    <el-form
      ref="form"
      label-position="right"
      label-width="110px"
      size="mini"
      :model="formData"
      :rules="rules"
    >

      <el-form-item label="人员选择" prop="sendUser">
        <el-input
          ref="engineerInput"
          v-model="selectedEngineer.name"
          @focus="onFocusEngineerInput"
        />
      </el-form-item>
    </el-form>
    <el-row>
      <el-col style="text-align:right">
        <el-button
          size="mini"
          type="primary"
          :loading="submitButtonLoading"
          @click="submit"
        >提交</el-button></el-col>
    </el-row>
  </div>
</template>

<script>
import EngineerPanel from '@/views/components/engineer/engineerPanel.vue';
import ServiceDeskApi from '@/views/reportFault/center/api';
export default {
  props: {
    orderId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        sendUser: null,
      },
      selectedEngineer: {
        name: null,
        engineerId: null,
        isTeam: false,
        teamId: null,
      },
      submitButtonLoading: false,
      rules: {
        sendUser: [
          {
            required: true, message: '请选择工程师', trigger: 'change',
          }
        ],
      },
    };
  },
  methods: {
    async submit() {
      await this.$refs['form'].validate();
      this.submitButtonLoading = true;
      await ServiceDeskApi.findPerson({ id: this.orderId,
        users: this.selectedEngineer.engineerId, });
      this.submitButtonLoading = false;
      this.$emit('done');
    },
    async onFocusEngineerInput() {
      this.$refs.engineerInput.blur();
      this.$fuckDrawer({
        width: '688px',
        component: () => <EngineerPanel onDone={this.onSelectedEngineer} defaultSelectedData={this.selectedEngineer} teamDisabled={true}/>,
      });
    },
    onSelectedEngineer(data) {
      this.$refs.engineerInput.blur();
      this.selectedEngineer = Object.assign({}, data);
      this.formData.sendUser = this.selectedEngineer.name;
      this.$refs.engineerInput.blur();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
