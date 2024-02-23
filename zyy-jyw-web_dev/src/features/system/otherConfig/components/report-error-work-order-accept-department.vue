<template>
  <el-form
    ref="formRef"
    class="comp-report-error-work-order-accept-department"
    label-width="100px"
    :model="formData"
  >
    <p class="title">工单接单科室<el-switch v-model="enabled" class="switch" @change="changeEnabled" /></p>
    <CompTips content="开启工单接单科室后，可配置用户报修时，可以选择工单的接单科室，若选择了“故障分类”，则会根据“故障分类”自动判断接单科室。注意：工单是指派给科室旗下的小组人员，非科室人员。" content2="注意：工单是指派给科室旗下的小组人员，非科室人员。" />
    <CompModuleHeader title="接单科室" class="m-b">
      <template v-slot:extra>
        <pure-button
          label="添加科室"
          size="mini"
          @click="onAdd"
        />
      </template>
    </CompModuleHeader>
    <el-form-item
      v-for="(item, index) in formData.acceptDepartmentList"
      :key="index"
      :label="`科室${index + 1}`"
      class="is-required"
      :prop="`acceptDepartmentList[${index}].departId`"
      :rules="[{
        required:true,
        message:'请选择所属科室',
      }]"
    >
      <el-col :span="6">
        <dept-cascader v-model="item.departId" />
      </el-col>
      <el-col :span="6" :offset="1">
        <el-form-item
          label="故障分类"
          prop="faultType"
        >
          <el-cascader
            ref="cascader"
            v-model="item.faultList"
            style="width: 100%"
            :options="list"
            clearable
            collapse-tags
            placeholder="故障分类"
            :props="{ multiple: true, checkStrictly: true, value: 'dictValue', emitPath: false, }"
          />
        </el-form-item>
      </el-col>
      <el-col :span="1">
        <i
          v-if="index !== 0"
          class="el-icon-delete btn-delete"
          @click="onDelete(index)"
        />
      </el-col>

    </el-form-item>
    <div class="btn-box">
      <pure-button
        :disabled="isButtonDisabled"
        label="应用"
        @click="updateConfig"
      />
      <pure-button
        :disabled="isButtonDisabled"
        label="取消"
        type="patch"
        @click="onCancel"
      />
    </div>
  </el-form>
</template>

<script>
import CompModuleHeader from './module-header.vue';
import CompTips from './tips.vue';
import DeptCascader from '@/features/system/departmentManagement/components/cascaderDepartmentList.vue';
import {
  getWorkOrderAcceptDepartmentConfigData,
  updateWorkOrderAcceptDepartmentConfigData,
  getReceiveDepartConfigData,
  updateReceiveDepartConfigData,
} from '../api';
import { cloneDeep, isEqual, find, } from 'lodash-es';
import { isEmpty, } from '@/common/utils/validator';

export default {
  components: {
    CompModuleHeader,
    CompTips,
    DeptCascader,
    // FaultTypeSelect: () =>
    //   import('@/features/system/dataDictionary/components/faultTypeSelect.vue'),
  },
  data() {
    return {
      faultType: '',
      enabled: '',
      originalAcceptDepartmentList: [],
      formData: {
        acceptDepartmentList: [],
      },
    };
  },
  computed: {
    cachedDicList() {
      return this.$store.state['SYSTEM_DIC'].list || [];
    },
    list() {
      const faultList = find(this.cachedDicList, { type: 'obs_fault_type', })?.data || [];
      return this.convertData(faultList);
    },
    isButtonDisabled() {
      return (
        isEqual(this.originalAcceptDepartmentList, this.formData.acceptDepartmentList)
      );
    },
  },
  created() {
    this.getConfig();
    this.getEnabled();
  },
  methods: {
    convertData(list, parent_id = 0) {
      const parentObj = {};
      list.forEach((item) => {
        parentObj[item.id] = item;
      });
      if (!parent_id) {
        return list
          .filter((item) => !parentObj[item.parentId])
          .map((item) => {
            item.children = this.convertData(list, item.id);
            item.label = item.dictLabel;
            if (item.children.length === 0) {
              delete item.children;
            }
            return item;
          });
      } else {
        return list
          .filter((item) => item.parentId === parent_id)
          .map((item) => {
            item.children = this.convertData(list, item.id);
            item.label = item.dictLabel;
            if (item.children.length === 0) {
              delete item.children;
            }
            return item;
          });
      }
    },
    changeEnabled() {
      updateReceiveDepartConfigData({ enabled: this.enabled,
      }).then(res => {
        this.$message.success('操作成功');
      });
    },
    getEnabled() {
      getReceiveDepartConfigData().then(res => {
        this.enabled = res.enabled || false;
      });
    },
    onFaultTypeChange(newVal, row) {
      // this.formData.faultRemark && this.$confirm('替换故障分类将清空故障描述内容', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      // })
      //   .then(() => {
      //     this.$refs['Q'].clearHtml();
      //   })
      //   .catch(() => {
      //     this.formData.faultType = null;
      //   });
      // this.optionList = [];
      // this.formData.reqTime = '1';
    },
    getConfig() {
      const loading = this.showLoading();
      getWorkOrderAcceptDepartmentConfigData()
        .then((result) => {
          if (result) {
            result.forEach(item => {
              item.faultList = item.faultType ? item.faultType.split(',') : [];
            });
            this.formData.acceptDepartmentList = result;
            this.originalAcceptDepartmentList = cloneDeep(result);
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    updateConfig() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.formData.acceptDepartmentList.forEach(item => {
            const faultData = item.faultList.join(',');
            item.faultType = faultData;
          });
          const data = this.formData.acceptDepartmentList.filter(item => !isEmpty(item.departId));
          const loading = this.showLoading();
          updateWorkOrderAcceptDepartmentConfigData(data)
            .then(() => {
              this.$message.success('操作成功');
              this.getConfig();
            })
            .finally(() => {
              loading.close();
            });
        }
      });
    },
    onCancel() {
      this.formData.acceptDepartmentList = cloneDeep(this.originalAcceptDepartmentList);
    },
    onAdd() {
      this.formData.acceptDepartmentList.push({});
    },
    onDelete(index) {
      this.formData.acceptDepartmentList.splice(index, 1);
    },
  },
};
</script>

<style lang='scss'
  scoped
>
.comp-report-error-work-order-accept-department {
  padding: 16px;
  background: #fff;
  .m-b{
    margin-bottom: 16px;
  }
  .switch{
    margin-left: 30px;
  }
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

  .btn-box {
    // margin-top: 20px;
  }

  .btn-delete {
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
