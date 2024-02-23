<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-16 15:45:14
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 16:01:08
 * @Description:资产借用
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
          <el-form-item label="申请科室" prop="applyDept">
            <department-cascader v-model="formData.applyDept" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="预计归还时间" prop="backTime">
            <el-date-picker
              v-model="formData.backTime"
              value-format="timestamp"
              type="datetime"
              align="right"
              format="yyyy-MM-dd HH:mm:ss"
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
import PropertyApi from '@/apis/property/propertyManagement';
import JsonUtil from '@/utils/json';
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
        prop: 'assetsType',
      }, {
        label: '当前科室',
        prop: 'useDeptToName',
      }, {
        label: '制作商',
        prop: 'manufacturer',
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
        const data = await PropertyApi.changedDetail(this.id);
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

