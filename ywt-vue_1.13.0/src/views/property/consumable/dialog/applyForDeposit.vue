<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-09 18:02:53
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 16:01:22
 * @Description:入库申请
-->
<template>
  <div v-loading="loading" class="drawer">
    <div class="header">
      <span class="title">入库申请</span>
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
          label-width="102px"
          size="mini"
          :rules="rules"
          :disabled="operatorType==='VIEW'"
        >
          <el-row>
            <el-col :span="5">
              <el-form-item label="入库科室" prop="inDept">
                <department-cascader v-model="formData.inDept" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="联系电话">
                <el-input v-model="formData.phone" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <span class="table-title">入库耗材</span>
            <pure-button type="wire-frame-auto" label="添加耗材" :disabled="disableAdd" @click="handleAddConsumable" />
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
              <template slot-scope="{row, $index}">
                <suggest-input v-if="item.prop==='name'" v-model="row.name" :filter-ids="selectedIds" type="Consumable" @refresh="handleRefresh($index)" @selected="handleSelected($event,$index)" />
                <el-input-number v-else-if="item.prop==='num' && row.num" v-model="row.num" :min="1" size="mini" />
                <span v-else-if="item.prop === 'price' && row.price">
                  {{ row.price + '元' }}
                </span>
                <span v-else-if="item.prop==='supplier'">{{
                  convertSupplier(row.supplier)
                }}</span>
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
import PaginationTable from '@/minxins/common/paginationTable';
import ThirdPartApi from '@/apis/thirdPart';
import {
  mapGetters,
} from 'vuex';
import moment from 'moment';
import ConsumableApi from '@/apis/property/consumable';
import DepositApi from '@/apis/property/consumable/deposit';
import JsonUtil from '@/utils/json';
import {
  find,
} from 'lodash';
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
        applyDept: null,
        inDept: null,
        phone: null,
        thingList: [],
      },
      // 供应商数据源
      supplierList: [],
      // 制作商数据源
      manufacturerList: [],
      rules: {
        applyDept: [{
          required: true, message: '请选择申请科室', trigger: 'change',
        }],
        inDept: [{
          required: true, message: '请选择入库科室', trigger: 'change',
        }],
      },
      tableHeader: [{
        label: '耗材名称',
        prop: 'name',
      }, {
        label: '规格型号',
        prop: 'model',
      }, {
        label: '单位',
        prop: 'unit',
      }, {
        label: '数量',
        prop: 'num',
      }, {
        label: '单价',
        prop: 'price',
      }, {
        label: '供应商',
        prop: 'supplier',
      }],
      popoverTableHeader: [{
        label: '耗材名称',
        prop: 'name',
      }, {
        label: '规格型号',
        prop: 'model',
      }, {
        label: '单位',
        prop: 'unit',
      }, {
        label: '单价',
        prop: 'price',
      }, {
        label: '供应商',
        prop: 'supplier',
      }],
      needFetchDetail: false,
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    disableAdd() {
      return this.operatorType === 'VIEW' || !this.formData.inDept;
    },
    selectedIds() {
      return this.formData.thingList.filter(item => item.id).map(item => item.id) || [];
    },
  },
  async created() {
    this.supplierList = await ThirdPartApi.supplierList();
    this.currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    if (this.operatorType !== OPERATOR_TYPES.CREATE) {
      const data = await ConsumableApi.changedDetail(this.id);
      this.formData = Object.assign({}, this.formData, data);
      this.formData.thingList = JsonUtil.parse(this.formData.thingList);
    }
  },
  methods: {
    async handleAddConsumable() {
      this.formData.thingList.push({

        id: null,
        name: null,
        model: null,
        unit: null,
        num: null,
        price: null,
        supplier: null,
      });
    },

    async submit() {
      try {
        await this.$refs.form.validate();
        const { thingList, ...other } = this.formData;
        const list = thingList.filter(item => item.id).map(item => {
          return {
            id: item.id,
            num: item.num || 1,
          };
        });
        await DepositApi.submit({ ...other, thingList: list, applyDept: this.userInfo.deptId, });
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
            num: item.num,
          };
        });
        await DepositApi.save({ ...other, thingList: list, applyDept: this.userInfo.deptId, });
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

    convertSupplier(id) {
      console.log(find(this.supplierList, { id, }));
      return find(this.supplierList, { id, })?.name;
    },

    handleRefresh(index) {
      this.formData.thingList.splice(index, 1, {});
    },
    async handleSelected(row, index) {
      this.$set(row, 'num', 1);
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
