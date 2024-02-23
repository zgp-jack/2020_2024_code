<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-22 11:12:02
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-02-28 17:09:10
 * @Description:耗材申领
-->
<template>
  <div v-loading="loading" class="drawer">
    <div class="header">
      <span class="title">耗材申领</span>
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
              <el-form-item label="提供科室" prop="outDept">
                <department-cascader v-model="formData.outDept" @change="handleOutDeptChange" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="联系电话">
                <el-input v-model="formData.phone" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <span class="table-title">申领耗材</span>
            <pure-button type="wire-frame-auto" label="添加耗材" :disabled="operatorType==='VIEW' || !formData.outDept" @click="handleAddConsumable" />
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
                <suggest-input v-if="item.prop==='name'" v-model="row.name" :filter-ids="selectedIds" type="Consumable" :dept-id="formData.outDept" @refresh="handleRefresh($index)" @selected="handleSelected($event,$index)" />
                <el-input-number v-else-if="item.prop==='num' && row.num" v-model.number="row.num" :min="1" size="mini" />
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
import ReceiveApi from '@/apis/property/consumable/receive';
import JsonUtil from '@/utils/json';
import {
  find,
} from 'lodash';
import Tip from '@/views/property/propertyManagement/propertyTransfer/dialog/tip.vue';
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
        outDept: null,
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
        outDept: [{
          required: true, message: '请选择提供科室', trigger: 'change',
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
        const list = thingList.map(item => {
          return {
            id: item.id,
            num: item.num || 1,
          };
        });
        await ReceiveApi.submit({ ...other, thingList: list, applyDept: this.userInfo.deptId, });
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
        const list = thingList.map(item => {
          return {
            id: item.id,
            num: item.num,
          };
        });
        await ReceiveApi.save({ ...other, thingList: list, applyDept: this.userInfo.deptId, });
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
        component: () => <Tip message='更改"提供科室"将清空已添加的耗材.' onCancel={this.rebackOutDept} onDone={this.clearThingList}/>,
      });
    },
    clearThingList() {
      this.preOutDept = this.formData.outDept;
      this.formData.thingList = [];
    },
    // 当取消更改转出科室后,回滚到更改前的值
    rebackOutDept() {
      this.formData.outDept = this.preOutDept;
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
