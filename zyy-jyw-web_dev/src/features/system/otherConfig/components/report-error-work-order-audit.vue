<template>
  <div class="comp-report-error-work-order-audit">
    <p class="title">工单审核</p>
    <CompTips content="关闭工单审核后，所有工单将跳过工单审核，直接进入下一节点。" style="margin-bottom: 8px" />
    <CompModuleHeader title="工单审核">
      <template v-slot:extra>
        <el-switch v-model="formData.isReview" />
      </template>
    </CompModuleHeader>

    <template v-if="formData.isReview">
      <el-form label-width="100px" class="form-box">
        <el-form-item label="审核模式">
          <el-radio v-model="formData.reviewMode" :label="1">按故障来源和分类</el-radio>
          <el-radio v-model="formData.reviewMode" :label="2">按人员</el-radio>
        </el-form-item>
      </el-form>
      <template v-if="formData.reviewMode === 1">
        <CompTips content="选择工单“故障来源”和“故障分类”的大类，当工单任意满足其一时则需要审核。" style="margin-bottom: 8px" />
        <CompModuleHeader title="审核模式：按故障来源和分类" />
        <div class="select-box">
          <div class="left">
            <CompCheckBox v-model="checkedFaultSource" :item-props="itemProps" check-all-label="故障来源" :check-list="faultSourceList" />
          </div>
          <div class="divider" />
          <div class="right">
            <CompCheckBox v-model="checkedFaultType" :item-props="itemProps" check-all-label="故障分类" :check-list="faultTypeList" />
          </div>
        </div>
      </template>
      <template v-if="formData.reviewMode === 2">
        <CompModuleHeader title="审核模式：按人员" />
        <CompTips content="添加人员，被选择人员接单，处理，完成的工单都需要被审核。" />
        <div class="user-select-box">
          <div class="top">
            <pure-button label="编辑用户" type="minor" @click="onEditUser" />
            <el-popconfirm
              title="确认清空所有已添加的用户吗？"
              @confirm="onClearStaff"
            >
              <pure-button slot="reference" label="清空" type="text" />
            </el-popconfirm>
          </div>
          <el-divider />
          <div class="selected-box">
            <el-tag
              v-for="staff in staffList"
              :key="staff.userId"
              closable
              @close="onDelStaff(staff.userId)"
            >
              {{ staff.nickName }}
            </el-tag>
          </div>
        </div>
      </template>
    </template>
    <el-form class="form-box-reminder">
      <el-form-item label="审核工单类型">
        <el-checkbox v-model="formData.specialOrder">特殊工单
          <el-tooltip content="创建工单时被标记为“是特殊工单”的工单" placement="top">
            <i class="el-icon-question" />
          </el-tooltip>
        </el-checkbox>
        <el-checkbox v-model="formData.assitOrder">发起协助的工单
          <el-tooltip content="在工单处理过程中“发起协助”操作的工单" placement="top">
            <i class="el-icon-question" />
          </el-tooltip>
        </el-checkbox>
        <el-checkbox v-model="formData.operatorOrder">暂停操作的工单
          <el-tooltip content="在工单处理过程中有“暂停”操作的工单" placement="top">
            <i class="el-icon-question" />
          </el-tooltip>
        </el-checkbox>
      </el-form-item>
    </el-form>
    <div class="btn-box">
      <pure-button v-auth="'orderReviewConfig:edit'" label="应用" :disabled="isButtonDisabled" @click="updateConfig" />
      <pure-button v-auth="'orderReviewConfig:edit'" label="取消" type="patch" :disabled="isButtonDisabled" @click="onCancel" />
    </div>

  </div>
</template>

<script>
import CompModuleHeader from './module-header.vue';
import CompTips from './tips.vue';
import CompCheckBox from './check-box.vue';
import CompSelectUser from './select-user.vue';
import { getWorkOrderAuditConfigData, updateWorkOrderAuditConfigData, } from '../api';
import { cloneDeep, } from 'lodash-es';
export default {
  components: {
    CompModuleHeader,
    CompTips,
    CompCheckBox,
  },
  data() {
    return {
      originalFormData: null,
      formData: {
        specialOrder: false,
        assitOrder: false,
        operatorOrder: false,
      },
      itemProps: {
        label: 'recordName',
        value: 'recordId',
      },
      faultSourceList: [],
      checkedFaultSource: [],
      faultTypeList: [],
      checkedFaultType: [],
      staffList: [],
      showSelectUser: false,
    };
  },
  computed: {

    isButtonDisabled() {
      return false;
    },
    updatedFaultSourceList() {
      return this.faultSourceList.map(item => {
        if (this.checkedFaultSource.includes(item.recordId)) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        return item;
      });
    },
    updatedFaultTypeList() {
      return this.faultTypeList.map(item => {
        if (this.checkedFaultType.includes(item.recordId)) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        return item;
      });
    },

  },
  created() {
    this.getConfig();
  },
  methods: {

    convertData(data) {
      const { faultSourceList, faultTypeList, staffList, sysOrderReviewConfig, } = data;
      if (faultSourceList) {
        this.faultSourceList = faultSourceList;
        this.checkedFaultSource = faultSourceList.filter(item => item.checked).map(item => item.recordId);
      }
      if (faultTypeList) {
        this.faultTypeList = faultTypeList;
        this.checkedFaultType = faultTypeList.filter(item => item.checked).map(item => item.recordId);
      }
      if (staffList) {
        this.staffList = staffList.map(({
          recordId,
          recordName,
        }) => ({
          userId: +recordId,
          nickName: recordName,
        }));
      } else {
        data.staffList = [];
      }
      if (sysOrderReviewConfig) {
        this.formData = { ...this.formData, ...sysOrderReviewConfig, };
        if (sysOrderReviewConfig.reviewOrderType) {
          if (sysOrderReviewConfig.reviewOrderType.indexOf('1') !== -1) {
            this.formData.specialOrder = true;
          }
          if (sysOrderReviewConfig.reviewOrderType.indexOf('2') !== -1) {
            this.formData.assitOrder = true;
          }
          if (sysOrderReviewConfig.reviewOrderType.indexOf('3') !== -1) {
            this.formData.operatorOrder = true;
          }
        }
      }
      this.originalFormData = cloneDeep(data);
    },
    getConfig() {
      const loading = this.showLoading();
      getWorkOrderAuditConfigData().then((result) => {
        if (result) {
          this.convertData(result);
        }
      }).finally(() => {
        loading.close();
      });
    },
    updateConfig() {
      const faultSourceList = this.checkedFaultSource.map(item => ({ recordId: item, }));
      const faultTypeList = this.checkedFaultType.map(item => ({ recordId: item, }));
      const staffList = this.staffList.map(item => ({ recordId: item.userId, }));
      let reviewOrderType = '';
      if (this.formData.specialOrder) {
        reviewOrderType = '1';
      }
      if (this.formData.assitOrder) {
        reviewOrderType += '2';
      }
      if (this.formData.operatorOrder) {
        reviewOrderType += '3';
      }
      reviewOrderType = reviewOrderType.split('').join(',');
      const params = {
        sysOrderReviewConfig: { ...this.formData, reviewOrderType, },
        faultSourceList,
        faultTypeList,
        staffList,
      };
      const loading = this.showLoading();
      updateWorkOrderAuditConfigData(params).then(() => {
        this.$message.success('操作成功');
        this.getConfig();
      }).finally(() => {
        loading.close();
      });
    },
    onCancel() {
      this.convertData(this.originalFormData);
    },
    onDelStaff(id) {
      this.staffList = this.staffList.filter(item => item.userId !== id);
    },
    onClearStaff() {
      this.staffList = [];
    },
    onEditUser() {
      this.$drawer({
        component: () => <CompSelectUser title={'编辑用户'} onDone={this.selectionUser} selectedUser={this.staffList}/>,
      });
    },
    selectionUser(data) {
      if (data) {
        this.staffList = data;
      }
    },

  },
};
</script>

<style lang="scss" scoped>
.comp-report-error-work-order-audit {
  padding: 16px;
  background: #fff;
  .title {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
    color: #333333;
  }
  .form-box {
    max-width: 500px;
  }
  .form-box-reminder{
    ::v-deep {
      .el-form-item__content {
        height: 32px;
      }
    }
  }
  .select-box {
    display: flex;
    margin-top: 20px;
    padding: 16px;
    border: 1px solid #E7E7E7;
    border-radius: 2px;
    .left {
      flex: 1 1 50%;
    }
    .right {
      flex: 1 1 50%;
    }
    .divider {
      width: 1px;
      margin: 0 16px;
      border: 1px solid #EEEEEE;
    }
  }
  .user-select-box {
    margin-top: 20px;
    padding: 16px;
    border: 1px solid #E7E7E7;
    border-radius: 2px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .selected-box {
      ::v-deep {
        .el-tag + .el-tag {
          margin-left: 10px;
        }
      }
    }
  }
  .btn-box {
    // margin-top: 20px;
  }
}
</style>
