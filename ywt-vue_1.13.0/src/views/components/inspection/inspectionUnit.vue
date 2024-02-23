<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-27 15:44:22
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 16:00:21
 * @Description:巡检单元(新增，编辑，查看)
-->
<template>
  <div v-loading="loading" class="drawer">
    <div class="header">
      <span class="title">{{ title }}</span>
    </div>
    <div class="body">
      <pure-card class="card">
        <div slot="header">巡检单元信息</div>
        <el-form
          ref="form"
          label-position="right"
          label-width="102px"
          size="mini"
          :model="formData"
          :rules="rules"
          :disabled="operatorType==='VIEW'"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="编号" prop="code">
                <el-input v-model="formData.code" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="名称" prop="name">
                <el-input v-model="formData.name" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="父节点" prop="parentId">
                <inspection-unit-parent-select v-model="formData.parentId" />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否巡检">
                <el-switch
                  v-model="formData.state"
                  :active-value="1"
                  :inactive-value="0"
                  inactive-text="否"
                  active-text="是"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="巡检责任人">
                <el-input
                  ref="sendUserInput"
                  v-model="formData.inspDutyOfficer"
                  style="width: auto"
                  @focus="handleOpenEngineerPanel"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="使用科室" prop="useDept">
                <department-cascader v-model="formData.useDept" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用责任人">
                <engineer-select v-model="formData.useUser" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="维护科室">
                <department-cascader v-model="formData.maintainDept" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维保责任人">
                <engineer-select v-model="formData.maintainUser" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="解决方法">
            <el-input
              v-model="formData.remark"
              type="textarea"
              :rows="3"
              style="width:100%; text-align: left;margin-right:5px;"
            />
          </el-form-item>
        </el-form>
      </pure-card>
    </div>
    <div v-if="operatorType!=='VIEW'" class="footer">

      <pure-button type="default" label="保存" @click="submit" />
    </div>
  </div>
</template>

<script>
import FormDialog, { OPERATOR_TYPES, } from '@/minxins/common/formDialog';
import InspectionUnitApi from '@/apis/inspection/unit';
import EngineerPanel from '@/views/components/engineer/engineerPanel.vue';
export default {
  components: {
    InspectionUnitParentSelect: () => import('@/views/components/inspection/unitParentSelect.vue'),
    DepartmentCascader: () => import('@/feat/system/department/component/departmentCascader.vue'),
    EngineerSelect: () => import('@/views/sharedComponents/engineer/allEngineerSingleSelect.vue'),
  },
  mixins: [FormDialog],
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      detailApi: () => {},
      formData: {
        inspDutyOfficer: null,
      },
      rules: {
        code: [{
          required: true, message: '请输入编号', trigger: 'blur',
        }],
        name: [{
          required: true, message: '请输入名称', trigger: 'blur',
        }],
        useDept: [{
          required: true, message: '请选择使用科室', trigger: 'change',
        }],
        parentId: [{
          required: true, message: '请选择父节点', trigger: 'change',
        }],
      },
      // 选中的巡检责任人
      selectedInspDutyOfficer: {
        name: null,
        engineerId: null,
        isTeam: false,
        teamId: null,
      },
    };
  },
  computed: {
    title() {
      let title = '巡检单元';
      switch (this.operatorType) {
        case OPERATOR_TYPES.CREATE:
          title = '新增巡检单元';
          break;
        case OPERATOR_TYPES.UPDATE:
          title = '编辑巡检单元';
          break;
      }
      return title;
    },
  },
  async created() {
    if (this.operatorType !== OPERATOR_TYPES.CREATE) {
      this.loading = true;
      const data = await InspectionUnitApi.detail(this.id);
      this.loading = false;
      this.formData = Object.assign({}, this.formData, data);
      this.selectedInspDutyOfficer.engineerId = this.formData.sendUser;
      this.selectedInspDutyOfficer.teamId = this.formData.sendTeam;
      this.selectedInspDutyOfficer.isTeam = !this.selectedInspDutyOfficer.engineerId;
      this.formData.inspDutyOfficer = this.formData.sendUserToName || this.formData.sendTeamToName || this.formData.sendDeptToName;
    }
  },
  methods: {
    async submit() {
      try {
        await this.$refs.form.validate();
        const { code,
          name,
          parentId,
          useDept,
          useUser,
          state,
          maintainDept,
          maintainUser,
          remark,
        } = this.formData;
        let sendUser = null;
        let sendTeam = null;
        if (this.selectedInspDutyOfficer.isTeam) {
          sendTeam = this.selectedInspDutyOfficer.teamId;
        } else {
          sendUser = this.selectedInspDutyOfficer.engineerId;
          sendTeam = this.selectedInspDutyOfficer.teamId;
        }
        if (this.operatorType === OPERATOR_TYPES.CREATE) {
          await InspectionUnitApi.create({
            code,
            name,
            parentId,
            useDept,
            useUser,
            state,
            maintainDept,
            maintainUser,
            remark,
            sendTeam,
            sendUser,
          });
        } else {
          await InspectionUnitApi.update({
            id: this.id,
            code,
            name,
            parentId,
            useDept,
            useUser,
            state,
            maintainDept,
            maintainUser,
            remark,
            sendTeam,
            sendUser,
          });
        }
        this.$message({
          type: 'success',
          message: this.operatorType === OPERATOR_TYPES.CREATE ? '新增巡检单元成功' : '更新巡检单元成功',
        });
        this.$emit('done');
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    async handleOpenEngineerPanel() {
      this.$refs.sendUserInput.blur();
      this.$innerDrawer({
        width: '548px',
        component: () => <EngineerPanel onDone={this.handleSelectedInspDutyOfficer} showOrder={false} defaultSelectedData={this.selectedInspDutyOfficer}/>,
      });
    },
    async handleSelectedInspDutyOfficer(data) {
      this.$refs.sendUserInput.blur();
      this.selectedInspDutyOfficer = Object.assign({}, data);
      this.formData.inspDutyOfficer = this.selectedInspDutyOfficer.name;
      this.$refs.sendUserInput.blur();
    },
  },

};
</script>

<style lang="scss" scoped>
.body {
  height: 100%;
  .card {
    height: 100%;
  }
  &::v-deep .pure-card__body {
    max-height:calc(100% - 50px);
    height: calc(100% - 50px);
  }
}
.footer {
  height: 28px;
  padding-top: 16px;
  padding-bottom: 16px;
}
</style>
