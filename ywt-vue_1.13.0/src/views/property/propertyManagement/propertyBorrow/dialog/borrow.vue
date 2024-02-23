<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-13 11:11:33
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-04 10:01:26
 * @Description:借用申请
-->
<template>
  <div v-loading="loading" class="drawer">
    <div class="header">
      <span class="title">借用申请</span>
      <span v-if="formData.serialNum" class="sub-title">申请单号:{{ formData.serialNum }}</span>
    </div>
    <div class="body">
      <pure-card class="card">
        <div slot="header">申请信息
          <span class="title-desc">
            申请人:
            <span>{{ userInfo.name }}</span>
          </span>
          <span class="title-desc">
            申请时间:
            <span>{{ formData.createTime?($options.filters.timestamp(formData.createTime)): currentDateTime }}</span>
          </span>
          <span class="title-desc">
            申请科室:
            <span>{{ userInfo.deptName }}</span>
          </span>
        </div>
        <el-form
          ref="form"
          :model="formData"
          label-position="right"
          label-width="132px"
          size="mini"
          :rules="rules"
          :disabled="operatorType==='VIEW'"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="借出科室" prop="outDept">
                <department-cascader v-model="formData.outDept" @change="handleOutDeptChange" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="预计归还时间" prop="backTime">
                <el-date-picker
                  v-model="formData.backTime"
                  value-format="timestamp"
                  type="date"
                  align="right"
                  format="yyyy-MM-dd"
                  :prefix-icon="'null'"
                  :clear-icon="'null'"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话">
                <el-input v-model="formData.phone" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <span class="table-title">借用资产</span>
            <pure-button type="wire-frame-auto" label="添加资产" :disabled="disableAdd" @click="handleAdd" />
          </el-row>
          <empty-row />
          <el-table
            border
            :data="formData.thingList"
          >
            <el-table-column
              label="序号"
              type="index"
              align="left"
              width="78px"
            />
            <el-table-column
              v-for="(item,index) in tableHeader"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              align="left"
              @click.stop.prevent
            >
              {{ item.prop }}
              <template slot-scope="{row,$index}">
                <suggest-input v-if="item.prop==='name'" v-model="row.name" :filter-ids="selectedIds" :dept-id="formData.outDept" @refresh="handleRefresh($index)" @selected="handleSelected($event,$index)" />
                <span v-else>
                  {{ row[item.prop] }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </pure-card>
    </div>
    <div v-if="operatorType!=='VIEW'" class="footer">

      <pure-button type="default" label="提交" @click="submit" />
      <pure-button type="wire-frame" label="保存" @click="save" />
    </div>
  </div>
</template>

<script>
import FormDialog, { OPERATOR_TYPES, } from '@/minxins/common/formDialog';
import PropertyApi from '@/apis/property/propertyManagement/index';
import BorrowApi from '@/apis/property/propertyManagement/borrow';
import PaginationTable from '@/minxins/common/paginationTable';
import JsonUtil from '@/utils/json';
import Tip from '@/views/property/propertyManagement/propertyTransfer/dialog/tip.vue';
import {
  mapGetters,
} from 'vuex';
import moment from 'moment';
export default {
  components: {
    DepartmentCascader: () => import('@/feat/system/department/component/departmentCascader.vue'),
    EmptyRow: () => import('@/components/emptyRow.vue'),
    SuggestInput: () => import('@/views/property/components/suggestInput.vue'),
  },
  mixins: [FormDialog, PaginationTable],
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      currentDateTime: '',
      preOutDept: null,
      formData: {
        outDept: null,
        backTime: null,
        phone: null,
        thingList: [],
        serialNum: null,
      },
      rules: {
        outDept: [{
          required: true, message: '请选择借出科室', trigger: 'change',
        }],
        backTime: [{
          required: true, message: '请选择预计归还时间', trigger: 'change',
        }],
      },
      tableHeader: [{
        label: '资产名称',
        prop: 'name',
      }, {
        label: '资产编号',
        prop: 'assetsCode',
      }, {
        label: '规格型号',
        prop: 'model',
      }, {
        label: '资产类型',
        prop: 'assetsTypeToName',
      }, {
        label: '当前科室',
        prop: 'useDeptToName',
      }, {
        label: '制作商',
        prop: 'manufacturerToName',
      }, {
        label: '供应商',
        prop: 'supplierToName',
      }],
      needFetchDetail: false,
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    disableAdd() {
      return this.operatorType === 'VIEW' || !this.formData.outDept || !this.formData.backTime;
    },
    selectedIds() {
      return this.formData.thingList.filter(item => item.id).map(item => item.id) || [];
    },
  },
  async created() {
    if (this.operatorType !== OPERATOR_TYPES.CREATE) {
      const data = await PropertyApi.changedDetail(this.id);
      this.formData = Object.assign({}, this.formData, data);
      this.formData.thingList = JsonUtil.parse(this.formData.thingList);
    }
    this.currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
  },
  methods: {
    async handleAdd() {
      this.formData.thingList.push({

        id: null,
        name: null,
        model: null,
        assetsCode: null,
        assetsType: null,
        useDept: null,
        manufacturer: null,
        supplier: null,
      });
    },

    async handleOutDeptChange() {
      if (!this.preOutDept) {
        this.preOutDept = this.formData.outDept;
        return;
      }
      this.$dialog({
        width: '320px',
        title: '提示',
        top: '300px',
        position: 'center',
        showClose: false,
        component: () => <Tip message='更改"借用科室"将清空已添加的资产.' onCancel={this.rebackOutDept} onDone={this.clearThingList}/>,
      });
    },
    // 当取消更改转出科室后,回滚到更改前的值
    rebackOutDept() {
      this.formData.outDept = this.preOutDept;
    },
    clearThingList() {
      this.preOutDept = this.formData.outDept;
      this.formData.thingList = [];
    },

    async submit() {
      try {
        await this.$refs.form.validate();
        const { thingList, ...other } = this.formData;
        const list = thingList.filter(item => item.id).map(item => {
          return {
            id: item.id,
          };
        });
        await BorrowApi.submit({ ...other, thingList: list, applyDept: this.userInfo.deptId, });
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
    async save() {
      try {
        await this.$refs.form.validate();
        const { thingList, ...other } = this.formData;
        const list = thingList.filter(item => item.id).map(item => {
          return {
            id: item.id,
          };
        });
        await BorrowApi.save({ ...other, thingList: list, applyDept: this.userInfo.deptId, });
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
    handleRefresh(index) {
      this.formData.thingList.splice(index, 1, {});
    },
    async handleSelected(row, index) {
      this.formData.thingList.splice(index, 1, row);
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
    max-height:calc(100% - 34px);
    height: calc(100% - 34px);
  }
}
.footer {
  height: 56px;
  padding-top: 12px;
  padding-bottom: 12px;
}
.table-title {
  font-size: $--pure-base-font-size;
  font-weight: 600;
  color: #2d405e;
  line-height: $--pure-base-font-size;
  margin-right: 28px;
}
.title-desc {
  font-size: $--pure-little-font-size;
  font-weight: 400;
  color: #879bba;
  line-height: $--pure-little-font-size;
  margin-left: 24px;
  span {
    color: #2d405e;
  }
}
</style>

