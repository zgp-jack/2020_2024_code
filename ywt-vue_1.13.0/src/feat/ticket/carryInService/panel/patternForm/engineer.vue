<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-19 16:24:26
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-17 21:51:01
 * @Description:工程师送修
-->
<template>
  <el-form
    ref="form"
    label-position="right"
    label-width="128px"
    size="mini"
    :disabled="disabled"
    :model="formData"
    :rules="rules"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="配送人" prop="repairUser">
          <user-select v-model="formData.repairUser" @change="onRepairUserChange" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="配送人电话" prop="repairPhone">
          <el-input v-model="formData.repairPhone" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="接收科室">
      <department-cascader v-model="formData.receiveDept" class="w-100" @change="onDepartmentChange" />
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="设备编号">
          <el-input v-model="formData.deviceNum" @input="onInputDeviceNum" />
          <svg-icon v-if="!disabled" class-name="el-icon-time" icon-class="repair" @click.stop="onViewMaintenanceHistory" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="formData.deviceName" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="设备分类">
          <tree-dic-cascader
            v-model="formData.deviceType"
            :dic-key="'assetsType'"
            class="w-200"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="设备型号">
          <el-input v-model="formData.deviceModel" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="设备序列号" prop="deviceSerialNum">
          <el-input v-model="formData.deviceSerialNum" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="设备数据">
          <el-select v-model="formData.deviceData">
            <el-option label="已备份" :value="1" />
            <el-option label="未备份" :value="2" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="设备信息备注">
      <el-input v-model="formData.deviceRemark" />
    </el-form-item>
    <el-form-item label="科室名称" prop="deptId">
      <department-cascader v-model="formData.deptId" class="w-100" @change="onDepartmentChange" />
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="科室联系人">
          <el-input v-model="formData.deptUser" :disabled="!formData.deptId" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="联系电话">
          <el-input v-model="formData.phone" :disabled="!formData.deptId" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="科室地址" prop="deptPlace">
      <el-input v-model="formData.deptPlace" />
    </el-form-item>
    <el-form-item label="故障描述" prop="faultRemark">
      <Q-paste-up
        ref="Q"
        :data-dom="formData.faultRemark"
        :disabled-fun="setDisabledFun"
        placeholder="引用知识库请先输入#号，再选择所需知识库"
        :html-hash-val="htmlHashVal"
        @isInputHashTrue="isInputHashTrue"
      >
        <el-card shadow="always" class="card-box">
          <div
            v-for="list in optionList"
            :key="list.id"
            :style="{ background: list.isActive ? '#f5f7fa' : '#fff' }"
            class="card-item"
            :disabled="list.title === '暂无数据...'"
            @click="changeItem(list)"
            @mouseenter="onMouseenter(list)"
            @mouseleave="omMouseleave(list)"
          >
            {{ list.title }}
          </div>
        </el-card>
      </Q-paste-up>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="formData.remark" type="textarea" :rows="4" />
    </el-form-item>
    <el-form-item label="附件">
      <upload v-model="formData.enclosure" />
    </el-form-item>
  </el-form>
</template>

<script>
import CarryInServiceApi from '../../api';
import MaintenanceHistoryDrawer from '../../drawer/maintenanceHistory.vue';
import DepartmentCascader from '@/feat/system/department/component/departmentCascader.vue';
import { delayCallBack, } from '@/utils/common';
import TreeDicCascader from '@/feat/system/dictionary/tree/component/treeDicCascader.vue';
import PropertyApi from '@/feat/property/propertyManagement/api';
import KnowledgeBaseRetrievalApi from '@/apis/knowledgeBase/retrieval/index';
import UserSelect from '@/views/project/components/userSelect/index';
import EngineerApi from '@/feat/system/user/api.js';
import {
  cloneDeep,
} from 'lodash';
export default {
  components: {
    DepartmentCascader,
    TreeDicCascader,
    UserSelect,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      formData: {
        repairUser: this.$store.state.login.userInfo.id,
        repairPhone: this.$store.state.login.userInfo.phone,
        receiveDept: this.$store.state.login.userInfo.deptId,
        deviceNum: null,
        deviceName: null,
        deviceType: null,
        deviceModel: null,
        deviceSerialNum: null,
        deviceData: 1,
        deviceRemark: null,
        deptId: null,
        deptUser: null,
        phone: null,
        deptPlace: null,
        faultRemark: null,
        remark: null,
        enclosure: null,
      },
      // 科室联系人
      deptContacts: [],
      // 厂家列表
      manufacturerList: [],
      // 厂家代表列表
      manufacturerUserList: [],
      rules: {
        repairUser: [{
          required: true, trigger: 'blur', message: '请输入配送人',
        }],
        repairPhone: [{
          required: true, trigger: 'blur', message: '请输入配送人电话',
        }],
        deviceName: [{
          required: true, trigger: 'blur', message: '请输入设备名称',
        }],
        deviceSerialNum: [{
          required: true, trigger: 'blur', message: '请输入设备序列号',
        }],
        deptId: [{
          required: true, trigger: 'change', message: '请选择科室',
        }],
        deptPlace: [{
          required: true, trigger: 'blur', message: '请输入科室地址',
        }],
        faultRemark: [{
          required: true, trigger: 'blur', message: '请输入故障描述',
        }],
      },
      htmlHashVal: {}, // 通过 # 选择的引用数据
      optionList: [],
    };
  },
  computed: {
    setDisabledFun() {
      if (this.disabled) {
        return 'disable';
      } else {
        return 'enable';
      }
    },
  },
  created() {
    if (this.data.id) {
      this.formData = Object.assign({}, this.data);
    }
  },
  methods: {
    // 查看维修历史
    async onViewMaintenanceHistory() {
      if (!this.formData.deviceNum) {
        return this.$message.warning('请输入设备编号');
      }
      const data = await CarryInServiceApi.maintenanceHistory(this.formData.deviceNum);
      if (data.historyList?.length === 0) {
        return this.$message.warning('暂无历史维修记录');
      }
      this.$innerDrawer({
        width: '720px',
        component: () => <MaintenanceHistoryDrawer operatorType='VIEW' id={this.formData.deviceNum}/>,
      });
    },
    onInputDeviceNum(val) {
      delayCallBack(1000, () => {
        this.onFetchPropertyDetail(val);
      });
    },
    async onFetchPropertyDetail(assetCode) {
      const data = await PropertyApi.detailByAssetCode(assetCode);
      this.formData.deviceName = data?.name;
      this.formData.deviceType = data?.assetsType;
      this.formData.deviceModel = data?.model;
      this.formData.deviceSerialNum = data?.seriesNumb;
    },
    async onDepartmentChange(data) {
      this.formData.deptPlace = data?.deptPlace;
    },
    // 配送人变化
    async onRepairUserChange(val) {
      const data = await EngineerApi.detail(val);
      this.formData.repairPhone = data.mblNo;
    },
    async querySearch() {
      const { list, } = await KnowledgeBaseRetrievalApi.list({
        pageSize: 9999,
        type: this.formData.faultType,
      });
      list.length === 0 ? this.optionList = [{ title: '暂无数据...', id: new Date().getTime(), }] : this.optionList = list.map((item) => {
        item.isActive = false;
        return item;
      });
    },
    onMouseenter(list) {
      list.isActive = true;
    },
    omMouseleave(list) {
      list.isActive = false;
    },
    async isInputHashTrue(v) {
      v ? await this.querySearch() : (this.optionList = []);
    },
    changeItem(list) {
      JSON.stringify(this.htmlHashVal) === '{}'
        ? (this.htmlHashVal = list)
        : this.$confirm('将使用选择内容替换故障描述', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.htmlHashVal = list;
            this.formData.learningId = list.id;
          })
          .catch(() => {
          });
      this.$refs['Q'].isSlotShow = false; // 隐藏引用选择框
    },
    async check() {
      this.formData.faultRemark = this.$refs['Q'].convertBase64();
      await this.$refs['form'].validate();
      return cloneDeep(this.formData);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-icon-time {
  color:#426ED7;
  position: absolute;
  top: 4px;
  margin-left: 5px;
  cursor: pointer;
}
</style>
