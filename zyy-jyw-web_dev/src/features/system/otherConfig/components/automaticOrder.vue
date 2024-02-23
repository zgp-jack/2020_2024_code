<template>
  <div class="automatic-order">
    <div class="knowledge-audit">
      <CompModuleHeader title="自动派单">
        <template v-slot:extra>
          <el-switch v-model="formData.autoDispatch" v-auth="'orderAutoDispatchConfig:edit'" @change="changeAutoDispatch" />
        </template>
      </CompModuleHeader>
      <div class="order-group">
        <el-radio-group
          v-model="handleType"
          size="small"
        >
          <el-radio-button :label="1">派单模式</el-radio-button>
          <el-radio-button :label="2">派单优先级</el-radio-button>
          <!-- <el-radio-button :label="3">派单规则</el-radio-button> -->
        </el-radio-group>
      </div>
      <template v-if="handleType === 1">
        <el-tabs v-model="activeName" class="tab-mode-autoOrder" @tab-click="changeMode">
          <el-tab-pane label="按“报修科室”派单" name="1">
            <span slot="label">
              <el-checkbox v-model="formData.depMode" v-auth="'orderAutoDispatchConfig:edit'" @change="changeAutoDispatch" />按“报修科室”派单
            </span>
          </el-tab-pane>
          <el-tab-pane label="按“故障分类”派单" name="2">
            <span slot="label">
              <el-checkbox v-model="formData.faultMode" v-auth="'orderAutoDispatchConfig:edit'" @change="changeAutoDispatch" />按“故障分类”派单
            </span>
          </el-tab-pane>
        </el-tabs>
        <hyy-view-layout class="order-list">
          <template #aside>
            <department-tree v-if="activeName === '1'" @node-click="choseDepartmentTree" />
            <FaultTree v-else @node-click="choseFaultTree" />
          </template>
          <el-table ref="tableRef" class="tableRef" :data="tableData" height="100%">
            <el-table-column type="index" label="序号" width="200" />
            <el-table-column
              v-for="item in tableColumn"
              :key="item.prop"
              :column-key="item.prop"
              :fixed="item.fixed"
              :formatter="item.formatter"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
            />
            <el-table-column label="操作">
              <template #default="{ row }">
                <pure-button
                  v-if="row.sendUserName || row.sendTeamName"
                  v-auth="'orderAutoDispatchConfig:edit'"
                  label="修改"
                  type="text"
                  @click="onEdit(row, 'edit')"
                />
                <pure-button
                  v-else
                  v-auth="'orderAutoDispatchConfig:edit'"
                  label="指定接单小组/人"
                  type="text"
                  @click="onEdit(row, 'add')"
                />
              </template>
            </el-table-column>
          </el-table>
        </hyy-view-layout>
      </template>
      <template v-else-if="handleType === 2">
        <CompTips content="派单优先级：派单发生冲突时，系统优先根据哪种派单模式进行派单。P1优先级最高。" />
        <el-form ref="formAuto" class="order-mode" :model="formData" label-position="left" label-width="100px">
          <div class="order-mode-header mode-item">
            <span>派单模式</span>
            <span>优先级</span>
          </div>
          <el-form-item
            label="报修科室"
            prop="repairDepart"
            class="order-mode-item mode-item"
            :rules="[{required: true, message: '请选择报修科室',}]"
          >
            <el-select v-model="formData.repairDepart" clearable placeholder="请选择">
              <el-option label="P1" value="P1" :disabled="formData.faultType == 'P1'" />
              <el-option label="P2" value="P2" :disabled="formData.faultType == 'P2'" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="故障分类"
            prop="faultType"
            class="order-mode-item mode-item"
            :rules="[{required: true, message: '请选择故障分类',}]"
          >
            <el-select v-model="formData.faultType" clearable placeholder="请选择">
              <el-option label="P1" value="P1" :disabled="formData.repairDepart == 'P1'" />
              <el-option label="P2" value="P2" :disabled="formData.repairDepart == 'P2'" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="btn-box">
          <pure-button v-auth="'orderAutoDispatchConfig:edit'" label="应用" @click="changeAutoDispatch('2')" />
        </div>
      </template>
      <template v-else>
        <CompTips content="根据“人员去向”标签判断是否跳过处理人，跳过后工单将派给处理人所在的小组，需要组员手动去接单；" />
        <CompModuleHeader title="派单跳过" />
        <el-form class="form-box-reminder">
          <el-form-item label="人员去向">
            <el-checkbox-group v-model="formData.whereAbouts">
              <el-checkbox label="1">请假</el-checkbox>
              <el-checkbox label="2">出差</el-checkbox>
              <el-checkbox label="3">值班</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div class="btn-box">
          <pure-button label="应用" @click="changeAutoDispatch" />
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import DepartmentTree from '@/features/system/departmentManagement/components/departmentTree.vue';
import EngineerPanel from '@/features/system/user/drawer/user.vue';
import FaultTree from './faultTree.vue';
import CompModuleHeader from './module-header.vue';
import CompTips from './tips.vue';
import {
  getorderAutoDispatchConfigData,
  getRepairDepartListData,
  updateOrderConfigData,
  getOrderFaultTypeListData,
  addOrderAutoDispatch,
  editOrderAutoDispatch,
} from '../api';

export default {
  components: {
    CompModuleHeader,
    CompTips,
    DepartmentTree,
    FaultTree,
  },
  data() {
    return {
      handleType: 1,
      activeName: '1',
      formData: {
        whereAbouts: [],
        repairDepart: '',
        faultType: '',
        autoDispatch: false,
        faultMode: '',
        depMode: '',
      },
      tableColumn: [],
      tableData: [],
      departmentTableColumn: [
        {
          label: '科室名称',
          prop: 'deptName',
        },
        {
          label: '所属院区',
          prop: 'hospitalName',
        },
        {
          label: '接单小组/人',
          prop: 'sendUserName',
          formatter: (row) => {
            let sendUserName = '';
            if (!row.sendUserName && !row.sendTeamName) {
              sendUserName = '-';
            } else {
              sendUserName = (row.sendTeamName ? row.sendTeamName : '-') + '/' + (row.sendUserName ? row.sendUserName : '-');
            }
            return sendUserName;
          },
        },
      ],
      failureTableColumn: [
        {
          label: '故障名称',
          prop: 'faultTypeName',
        },
        {
          label: '接单小组/人',
          prop: 'sendUserName',
          formatter: (row) => {
            let sendUserName = '';
            if (!row.sendUserName && !row.sendTeamName) {
              sendUserName = '-';
            } else {
              sendUserName = (row.sendTeamName ? row.sendTeamName : '-') + '/' + (row.sendUserName ? row.sendUserName : '-');
            }
            return sendUserName;
          },
        },
      ],
      selectedSendEngineer: { name: null, engineerId: null, isTeam: false, teamId: null, },
      deptParentId: '',
      rowData: '',
    };
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    async changeAutoDispatch(val) {
      if (val === '2') {
        const valid = await this.$refs.formAuto.validate();
        if (!valid) {
          return;
        }
      }
      let reviewOrderType = '';
      if (this.formData.depMode) {
        reviewOrderType = '1';
      }
      if (this.formData.faultMode) {
        reviewOrderType += '2';
      }
      reviewOrderType = reviewOrderType.split('').join(',');
      const params = {
        ...this.formData,
        whereAbouts: this.formData.whereAbouts.join(','),
        dispatchMode: reviewOrderType,
      };
      updateOrderConfigData(params).then(result => {
        this.$message.success('操作成功');
      });
    },
    getConfig() {
      const loading = this.showLoading();
      getorderAutoDispatchConfigData().then((result) => {
        this.formData.autoDispatch = result.autoDispatch || false;
        this.formData.faultType = result.faultType || '';
        this.formData.repairDepart = result.repairDepart || '';
        this.formData.whereAbouts = result.whereAbouts ? result.whereAbouts.split(',') : [];
        if (result.dispatchMode.indexOf('1') !== -1) {
          this.formData.depMode = true;
        }
        if (result.dispatchMode.indexOf('2') !== -1) {
          this.formData.faultMode = true;
        }
      }).finally(() => {
        loading.close();
      });
    },
    getData() {
      this.handleType = 1;
      this.tableColumn = this.departmentTableColumn;
      this.init();
    },
    onEdit(row, type) {
      this.rowData = row;
      if (type === 'edit') {
        this.selectedSendEngineer = {
          name: row.sendUserName || null,
          engineerId: row.sendUser || null,
          isTeam: false,
          teamId: row.sendTeam || null,
        };
        if (row.sendType === 2) {
          this.selectedSendEngineer.isTeam = true;
        }
      } else {
        this.selectedSendEngineer = { name: null, engineerId: null, isTeam: false, teamId: null, };
      }
      this.$drawer({
        width: '548px',
        component: () => (
          <EngineerPanel
            onDone={this.onSelectEngineer}
            defaultSelectedData={this.selectedSendEngineer}
          />
        ),
      });
    },
    onSelectEngineer(data) {
      const params = {
        deptId: this.rowData.deptId,
        dispatchMode: this.rowData.dispatchMode,
        faultType: this.rowData.faultType,
        sendTeam: data.teamId,
        sendType: data.isTeam ? 2 : 1,
        sendUser: data.engineerId,
      };
      if (!this.rowData.sendUserName && !this.rowData.sendTeamName) {
        addOrderAutoDispatch(params).then(res => {
          this.$message.success('操作成功');
          if (this.rowData.dispatchMode === 1) {
            this.init();
          } else {
            this.initFault();
          }
        });
      } else {
        params.id = this.rowData.id;
        editOrderAutoDispatch(params).then(res => {
          this.$message.success('操作成功');
          if (this.rowData.dispatchMode === 1) {
            this.init();
          } else {
            this.initFault();
          }
        });
      }
    },
    changeMode(val) {
      this.deptParentId = '';
      if (val.name === '1') {
        this.tableColumn = this.departmentTableColumn;
        this.init();
      } else {
        this.tableColumn = this.failureTableColumn;
        this.initFault();
      }
    },
    initFault() {
      const loading = this.showLoading();
      const params = {
        parentFaultType: this.deptParentId,
      };
      getOrderFaultTypeListData(params).then((data) => {
        this.tableData = data;
      }).finally(() => {
        loading.close();
      });
    },
    init() {
      const params = {
        deptParentId: this.deptParentId,
      };
      const loading = this.showLoading();
      getRepairDepartListData(params).then((data) => {
        this.tableData = data;
      }).finally(() => {
        loading.close();
      });
    },
    choseFaultTree(node) {
      this.deptParentId = node?.dictValue || null;
      this.initFault();
    },
    choseDepartmentTree(node) {
      this.deptParentId = node?.deptId || null;
      this.init();
    },
  },
};
</script>
<style lang="scss" scoped>
.automatic-order{
  height: calc(100vh - 172px);
  background-color: #fff;
}
.order-group{
  margin-bottom: 16px;
  cursor: pointer;
}
.knowledge-audit{
  height: 100%;
  width: 100%;
  padding: 16px 24px 0 24px;
}
.order-mode{
  width: 500px;
}
.mode-item{
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  margin-top: 16px;
}
.order-mode-item{
  font-size: 14px;
  color: #606266;
}
.automatic-order ::v-deep .order-mode-item.el-form-item::before,
.automatic-order ::v-deep .order-mode-item.el-form-item::after {
  display: none;
}
.form-box-reminder ::v-deep .el-form-item--mini .el-form-item__content{
  line-height: 32px;
}
.order-list{
  /* height: 500px; */
  background-color: #fff;
  height: calc(100% - 150px);
  padding-bottom: 16px;
}
.tableRef{
  height: 100%;
}
.comp-other-config-global .tab-mode-autoOrder ::v-deep {
  .el-tabs__header{
    width: initial;
  }
  .el-tabs__active-bar{
    display: none;
  }
  .el-tabs__item{
    padding-left: 16px;
    padding-right: 16px;
  }
  .el-tabs__item.is-active{
    background-color: #E5F1F0;
  }
}
</style>
