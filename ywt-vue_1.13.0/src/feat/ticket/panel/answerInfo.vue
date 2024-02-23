<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-24 16:52:32
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-01 16:55:50
 * @Description:接听信息面板
-->

<template>
  <pure-card class="max-height" :disabled="disabled" :show-expand="showExpand" v-bind="$attrs">
    <div slot="header">
      接听信息
      <span v-if="formData.reception" class="reception">
        接听人:
        <span>{{ formData.reception | staffId }}</span>
      </span>
    </div>
    <div slot="subHeader">
      <span
        v-if="formData.time"
        class="time"
      >通话时间:
        <span>{{ formData.time | formatSeconds }}</span>
      </span>
      <span v-if="formData.createTime" class="createTime">
        报修时间:
        <span>{{ formData.createTime }}</span>
      </span>
    </div>
    <el-form
      ref="form"
      :model="formData"
      label-position="right"
      label-width="102px"
      size="mini"
      :disabled="disabled"
    >
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="phone" label="报修电话" :rules="[{required: repair_phone,message: '请输入报修电话', trigger: 'blur', }]">
              <el-input
                v-model.trim="formData.phone"
                style="width: auto"
                :disabled="phoneDisabled"
                @input="onPhoneChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="user" label="报修人" :rules="[{required: repair_user,message: '请输入报修人', trigger: 'blur', }]">
              <div class="flex">
                <el-input v-model="formData.user" />
                <el-button
                  v-if="canAdd"
                  type="primary"
                  icon="el-icon-plus"
                  class="add-btn"
                  @click="onAddEngineer"
                />
                <el-button
                  v-if="canEdit"
                  type="primary"
                  icon="el-icon-edit"
                  class="add-btn"
                  @click="onUpdateEngineer"
                />
              </div>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form-item>
      <el-form-item prop="deptId" label="报修科室" :rules="[{required: repair_dept,message: '请选择报修科室', trigger: 'change', }]">
        <div class="flex">
          <department-cascader
            v-model="formData.deptId"
            class="w100"
            @change="onDepartmentChange"
          />
          <el-button
            v-if="createPattern === 'byPop' && !formData.deptId"
            type="primary"
            icon="el-icon-plus"
            class="add-btn"
            size="mini"
            @click="handleAddDepartment"
          />
          <el-button
            v-if="createPattern === 'byPop' && formData.deptId"
            type="primary"
            icon="el-icon-edit"
            class="add-btn"
            @click="handleEditDepartment"
          />
        </div>
      </el-form-item>
      <el-form-item prop="place" label="报修地址" :rules="[{required: repair_place,message: '请输入报修地址', trigger: 'blur',}]">
        <el-input v-model="formData.place" />
      </el-form-item>
      <el-form-item v-if="formData.recording" label="录音">
        <pure-audio :the-url="formData.recording" />
      </el-form-item>
    </el-form>
  </pure-card>
</template>

<script>
import EngineerApi from '@/feat/system/user/api';
import { cloneDeep, isEmpty, } from 'lodash';
import MaintainReportUser from '@/views/system/user/dialog/maintainReportUser.vue';
import MaintainDepartment from '@/views/system/department/dialog/maintainDepartment.vue';
import {
  bus,
} from '@/utils/bus';
import { mapActions, mapGetters, mapMutations, } from 'vuex';
export default {
  name: 'TicketAnswerInfoPanel',
  components: {
    DepartmentCascader: () =>
      import('@/feat/system/department/component/departmentCascader.vue'),
    PureAudio: () => import('@/components/audio/audio'),
  },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: function () {
        return {};
      },
    },
    showExpand: {
      type: Boolean,
      default: false,
    },

    createPattern: {
      type: String,
      default: 'byManual',
    },
    operatorType: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        // 接听人
        reception: null,
        // 通话时间
        time: null,
        // 报修时间
        createTime: null,
        // 报修科室
        deptId: null,
        // 报修地址
        place: null,
        // 报修人
        user: null,
        // 报修电话
        phone: null,
        // 录音
        recording: null,
      },
      expandFuck: true,
      // 是否可添加报修人
      canAdd: false,
      // 是否可修改报修人
      canEdit: false,

      // 接听信息必填字段状态
      repair_phone: false,
      repair_user: false,
      repair_dept: false,
      repair_place: false,
    };
  },
  computed: {
    ...mapGetters('reportFault/mode', ['modeValue']),
    phoneDisabled() {
      if (this.operatorType === 'EDIT') {
        if (this.info.recording) {
          return true;
        } else {
          return false;
        }
      }
      return this.createPattern !== 'byManual';
    },
  },
  watch: {
    info: {
      handler(val) {
        this.formData = Object.assign({}, this.formData, val);
        this.expandFuck = !this.disabled;
        if (this.createPattern === 'byPop') {
          const { phone, user, } = this.formData;
          if (phone && user) {
            this.canEdit = true;
          }
          if (phone && !user) {
            this.canAdd = true;
          }
        }
      },
      deep: true,
      immediate: true,
    },
    modeValue: {
      handler(val) {
        this.GET_MODE_TEAM_USER(val);
      },
      deep: true,

    },
  },
  created() {
    this.getRepairConfigData();
    bus.$on('selectPersonalTicket', this.onSelectPersonalTicket);
  },
  destroyed() {
    bus.$off('selectPersonalTicket', this.onSelectPersonalTicket);
  },
  methods: {
    ...mapMutations('reportFault/mode', ['setDeptId']),
    ...mapActions('reportFault/mode', ['GET_MODE_TEAM_USER']),
    async getRepairConfigData() {
      let configData = [];
      configData = await EngineerApi.getRepairConfig({});
      const needFindKey = ['repair_phone', 'repair_user', 'repair_dept', 'repair_place'];
      configData.forEach(item => {
        needFindKey.forEach(el => {
          if (item.type === el) {
            this[el] = item.enable;
          }
        });
      });
    },
    async onPhoneChange(newVal) {
      let result = null;
      if (newVal.length === 4 || newVal.length >= 7 && newVal.length <= 8 || newVal.length === 11) { // 合理的电话号码才调用接口
        result = await EngineerApi.detailByPhone(newVal);
        if (result) {
          this.$emit('phoneChange', { phone: newVal, deptId: result.deptId, });
        }
      } else {
        this.formData.deptId = null;
        this.formData.place = null;
        this.formData.user = null;
        return false;
      }
      this.formData = Object.assign({}, this.formData, result);
    },
    async check() {
      await this.$refs.form.validate();
      return isEmpty(this.formData) ? null : cloneDeep(this.formData);
    },
    async onAddEngineer() {
      this.$dialog({
        title: '报修人维护',
        width: '688px',
        position: 'center',
        component: () => (
          <MaintainReportUser
            onDone={this.onAfterChangeEngineer}
            data={{
              phone: this.formData.phone,
              deptId: this.formData.deptId,
              name: this.formData.user,
            }}
            operatorType='CREATE'
          />
        ),
      });
    },
    async onUpdateEngineer() {
      this.$dialog({
        title: '报修人维护',
        width: '688px',
        position: 'center',
        component: () => (
          <MaintainReportUser
            data={{
              phone: this.formData.phone,
              name: this.formData.user,
              deptId: this.formData.deptId,
            }}
            operatorType='UPDATE'
            onDone={this.onAfterChangeEngineer}
          />
        ),
      });
    },
    // 科室维护-新增
    async handleAddDepartment() {
      this.$dialog({
        title: '科室维护',
        width: '688px',
        position: 'center',
        component: () => (
          <MaintainDepartment
            data={{
              phone: this.formData.phone,
              name: this.formData.user,
              deptId: this.formData.deptId,
              place: this.formData.place,
            }}
            operatorType='CREATE'
            onDone={this.onAfterChangeEngineer}
          />
        ),
      });
    },
    // 科室维护-修改
    async handleEditDepartment() {
      this.$dialog({
        title: '科室维护',
        width: '688px',
        position: 'center',
        component: () => (
          <MaintainDepartment
            data={{ place: this.formData.place, deptId: this.formData.deptId, }}
            operatorType='UPDATE'
            onDone={this.onAfterChangeEngineer}
          />
        ),
      });
    },
    async onAfterChangeEngineer(data) {
      this.formData = Object.assign({}, this.formData, data);
    },
    async onDepartmentChange(data) {
      this.formData.place = data?.deptPlace;
      this.setDeptId(data.id);
    },
    // 故障信息面板中选择个人工单，接听信息面板指定相关默认值
    async onSelectPersonalTicket() {
      this.formData.phone = this.$store.state.login.userInfo.phone;
      this.onPhoneChange(this.formData.phone);
    },
  },
};
</script>

<style lang="scss" scoped>
.reception {
  padding-left: 24px;
  font-size: $--pure-little-font-size;
  color: #879bba;
  span {
    color: #2d405e;
  }
}
.time,
.createTime {
  color: #879bba;
  font-size: $--pure-little-font-size;
  span {
    font-weight: 400;
    color: #2d405e;
  }
}
.time {
  padding-right: 36px;
}
.w100 {
  width: 100%;
}
.form-item-wrapper {
  padding: 0;
  margin-bottom: 0;
  .el-col-12 {
    padding: 0;
  }
}
.add-btn.el-button--mini {
  padding: 7px;
  margin-left: 5px;
}
.flex {
  display: flex;
}
</style>
