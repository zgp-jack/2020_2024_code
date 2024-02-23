<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-22 16:11:16
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 16:01:03
 * @Description:耗材出库
-->
<template>
  <pure-card class="card">
    <div slot="header">
      申请信息
      <span class="title-desc">
        申请人:
        <span>{{ formData.createUserToName }}</span>
      </span>
      <span class="title-desc">
        申请时间:
        <span>{{ formData.createTime|timestamp }}</span>
      </span>
      <span class="title-desc">
        申请科室:
        <span>{{ formData.applyDeptToName }}</span>
      </span>
    </div>
    <el-form
      label-position="right"
      label-width="102px"
      size="mini"
      disabled
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="转入科室" prop="inDept">
            <department-cascader v-model="formData.inDept" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="转出科室" prop="outDept">
            <department-cascader v-model="formData.outDept" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系电话">
            <el-input v-model="formData.phone" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <span class="table-title">出库耗材</span>
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
          <template slot-scope="{row}">
            <span v-if="item.prop==='assetsType'">{{
              row[item.prop] | dicValueToKey('assetsType')
            }}</span>
            <span v-else-if="item.prop==='manufacturer'">
              {{ convertManufacturer(row.manufacturer) }}
            </span>
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
</template>

<script>
import ConsumableApi from '@/apis/property/consumable';
import JsonUtil from '@/utils/json';
import ThirdPartApi from '@/apis/thirdPart';
import {
  find,
} from 'lodash';
export default {
  components: {
    DepartmentCascader: () => import('@/feat/system/department/component/departmentCascader.vue'),
    EmptyRow: () => import('@/components/emptyRow.vue'),
  },
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        transferReason: null,
        inDept: null,
        outDept: null,
        thingList: [],
        serialNum: null,
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
      // 供应商数据源
      supplierList: [],
      // 制作商数据源
      manufacturerList: [],
    };
  },
  async created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.supplierList = await ThirdPartApi.supplierList();
        const data = await ConsumableApi.changedDetail(this.id);
        this.formData = Object.assign({}, data);
        this.formData.thingList = JsonUtil.parse(this.formData.thingList);
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    convertSupplier(id) {
      console.log(id, this.supplierList);
      return find(this.supplierList, { id, })?.name;
    },
    convertManufacturer(id) {
      return find(this.manufacturerList, { id, })?.name;
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  height: 100%;
  &::v-deep .pure-card__body {
    height: calc(100% - 71px)
  }
}
.table-title {
  font-size: 14px;
  font-weight: 600;
  color: #2d405e;
  line-height: 14px;
  margin-right: 28px;
}
.title-desc {
  font-size: 12px;
  font-weight: 400;
  color: #879bba;
  line-height: 12px;
  margin-left: 24px;
  span {
    color: #2d405e;
  }
}
</style>
