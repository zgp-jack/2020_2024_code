<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-07 11:22:54
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 16:02:02
 * @Description: 接听信息
-->
<template>
  <pure-card class="max-height" :disabled="disabled" :show-expand="showExpand">
    <div slot="header">接听信息
      <span v-if="infoData.reception" class="reception">
        接听人:
        <span>{{ infoData.reception | staffId }}</span>
      </span>
    </div>
    <div slot="subHeader">
      <span
        v-if="infoData.time"
        class="time"
      >通话时间:
        <span>{{ infoData.time | formatSeconds }}</span>
      </span>
      <span
        v-if="infoData.createTime"
        class="createTime"
      >
        报修时间:
        <span>{{ infoData.createTime }}</span>
      </span>
    </div>
    <el-form
      label-position="right"
      label-width="102px"
      size="mini"
      :disabled="disabled"
    >
      <el-form-item
        label="报修科室"
      >

        <div class="flex">
          <department-cascader v-model="infoData.deptId" class="w100" />
          <el-button
            v-if="isPop&&!infoData.deptId"
            type="primary"
            icon="el-icon-plus"
            class="add-btn"
            @click="handleAddDepartment"
          />
          <el-button
            v-if="isPop&&infoData.deptId"
            type="primary"
            icon="el-icon-edit"
            class="add-btn"
            @click="handleEditDepartment"
          />
        </div>
      </el-form-item>
      <el-form-item
        label="报修地址"
      >
        <el-input v-model="infoData.place" />
      </el-form-item>
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="12">
            <el-form-item label="报修人">

              <div class="flex">
                <el-input v-model="infoData.user" />
                <el-button
                  v-if="canAdd"
                  type="primary"
                  icon="el-icon-plus"
                  class="add-btn"
                  @click="handleAddEngineer"
                />
                <el-button
                  v-if="canEdit"
                  type="primary"
                  icon="el-icon-edit"
                  class="add-btn"
                  @click="handleEditEngineer"
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报修电话">
              <el-input
                v-model="infoData.phone"
                style="width:auto"
                :disabled="isPop"
                @change="handlePhoneChange"
              />

            </el-form-item>
          </el-col>
        </el-row>

      </el-form-item>
      <el-form-item v-if="infoData.recording" label="录音">
        <pure-audio :the-url="infoData.recording" />
      </el-form-item>
    </el-form>
  </pure-card>
</template>

<script>
import { getPersonInfo, } from '@/apis/reportFault/center';
import {
  cloneDeep,
  isEmpty,
} from 'lodash';
import MaintainReportUser from '@/views/system/user/dialog/maintainReportUser.vue';
import MaintainDepartment from '@/views/system/department/dialog/maintainDepartment.vue';
export default {
  components: {
    DepartmentCascader: () => import('@/feat/system/department/component/departmentCascader.vue'),
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
    // 是否来电弹屏
    isPop: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      infoData: {
        phone: null,
        user: null,
      },
      expand: true,
      // 是否可添加报修人
      canAdd: false,
      // 是否可修改报修人
      canEdit: false,
    };
  },
  async created() {
    this.infoData = Object.assign({ }, this.info);
    this.expand = !this.disabled;
    if (this.isPop) {
      const { phone, user, } = this.infoData;
      if (phone && user) {
        this.canEdit = true;
      }
      if (phone && !user) {
        this.canAdd = true;
      }
    }
  },
  methods: {
    async handlePhoneChange(newVal) {
      const result = await getPersonInfo(newVal);
      if (result) {
        this.$emit('phoneChange', { phone: newVal, deptId: result.deptId, });
      }
      this.infoData = Object.assign({}, this.infoData, result);
    },
    async check() {
      return isEmpty(this.infoData) ? null : cloneDeep(this.infoData);
    },
    async handleAddEngineer() {
      this.$dialog({
        title: '报修人维护',
        width: '688px',
        position: 'center',
        component: () => <MaintainReportUser onDone={this.handleAfterChangeEngineer} data={{ phone: this.infoData.phone, deptId: this.infoData.deptId, user: this.infoData.user, }} operatorType='CREATE'/>,
      });
    },
    async handleEditEngineer() {
      this.$dialog({
        title: '报修人维护',
        width: '688px',
        position: 'center',
        component: () => <MaintainReportUser data={{ phone: this.infoData.phone, name: this.infoData.user, deptId: this.infoData.deptId, }} operatorType='UPDATE' onDone={this.handleAfterChangeEngineer}/>,
      });
    },
    // 科室维护-新增
    async handleAddDepartment() {
      this.$dialog({
        title: '科室维护',
        width: '688px',
        position: 'center',
        component: () => <MaintainDepartment data={{ phone: this.infoData.phone, name: this.infoData.user, deptId: this.infoData.deptId, }} operatorType='CREATE' onDone={this.handleAfterChangeEngineer}/>,
      });
    },
    // 科室维护-修改
    async handleEditDepartment() {
      this.$dialog({
        title: '科室维护',
        width: '688px',
        position: 'center',
        component: () => <MaintainDepartment deptId={this.infoData.deptId} operatorType='UPDATE' onDone={this.handleAfterChangeEngineer}/>,
      });
    },
    async handleAfterChangeEngineer(data) {
      this.infoData = Object.assign({}, this.infoData, data);
    },

  },
};
</script>

<style lang="scss" scoped>
    .reception {
        padding-left: 24px;
        font-size: $--pure-little-font-size;
        color: #879BBA;
        span {
            color: #2D405E;
        }
    }
    .time, .createTime {
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
        padding:0;
    }
    }
    .add-btn.el-button--mini {
      padding:7px;
      margin-left: 5px;
    }
    .flex {
      display: flex;
    }

</style>
