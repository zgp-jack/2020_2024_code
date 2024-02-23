<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-15 16:18:53
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-11-05 19:54:36
 * @Description:资产登记更多信息
-->
<template>
  <pure-card ref="card" class="max-height" :show-expand="showExpand" @expandChange="handleExpandChange">
    <div slot="header">
      更多信息
    </div>
    <el-form
      ref="form"
      label-position="right"
      label-width="135px"
      size="mini"
      :model="formData"
      :disabled="actionType==='view'"
      :rules="rules"
    >
      <div class="divider">
        <span class="column-name">采购信息</span>
      </div>
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="25">
            <el-form-item label="采购编号">
              <el-input v-model="formData.purchaseCode" />
            </el-form-item>
          </el-col>
          <el-col :span="50">
            <el-form-item label="项目名称">
              <project-name-select v-model="formData.projectName" class="w100" />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="采购日期">
              <el-date-picker
                v-model="formData.purchaseDate"
                type="date"
                value-format="timestamp"
                placeholder="选择日期"
                :prefix-icon="'null'"
                :clear-icon="'null'"
                class="date-picker"
              />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="采购价格" prop="purchasePrice">
              <el-input v-model="formData.purchasePrice" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="25">
            <el-form-item label="采购数量" prop="purchaseNumber">
              <el-input v-model="formData.purchaseNumber" />
            </el-form-item>
          </el-col>

        </el-row>
      </el-form-item>
      <div class="divider">
        <span class="column-name">供应商信息</span>
      </div>
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="25">
            <el-form-item label="品牌">
              <dic-select
                v-model="formData.brand"
                :dic-key="'brand'"
                placeholder="请选择品牌"
              />
            </el-form-item>
          </el-col>
          <el-col :span="50">
            <el-form-item label="制作商">
              <manufacturer-select v-model="formData.manufacturer" placeholder="请选择制作商" class="w100" />
            </el-form-item>
          </el-col>
          <el-col :span="50">
            <el-form-item label="供应商">
              <supplier-select v-model="formData.supplier" placeholder="请选择供应商" class="w100" />
            </el-form-item>
          </el-col>

        </el-row>
      </el-form-item>
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="25">
            <el-form-item label="厂家电话">
              <el-input v-model="formData.manufacturerPhone" />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="售后电话">
              <el-input v-model="formData.salesPhone" />
            </el-form-item>
          </el-col>
          <el-col :span="50">
            <el-form-item label="产地">
              <el-input v-model="formData.originPlace" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <div class="divider">
        <span class="column-name">网络、操作系统、配置</span>
      </div>
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="25">
            <el-form-item label="IP地址" prop="ipPlace">
              <el-input v-model="formData.ipPlace" />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="MAC地址">
              <el-input v-model="formData.macPlace" />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="操作系统">
              <el-input v-model="formData.operatingSystem" />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="系统版本">
              <el-input v-model="formData.systemVersion" />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="是否正版">
              <el-switch
                v-model="formData.isGenuine"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="配置信息">
        <el-input v-model="formData.configuration" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
  </pure-card>
</template>

<script>
import * as Regex from '@/utils/regex';
export default {
  components: {
    DicSelect: () => import('@/views/components/dictionary/dicSelect.vue'),
    ProjectNameSelect: () => import('@/views/project/components/select/projectNameSelect.vue'),
    SupplierSelect: () => import('@/views/components/other/supplierSelect.vue'),
    ManufacturerSelect: () => import('@/views/components/other/manufacturerSelect.vue'),
  },
  props: {
    showExpand: {
      type: Boolean,
      default: false,
    },
    actionType: {
      type: String,
      default: 'create',
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

      },
      rules: {
        purchasePrice: [{
          pattern: Regex.price, message: '价格范围0-999999999.999', trigger: 'blur',
        }],
        purchaseNumber: [{
          pattern: Regex.count, message: '数量范围1-9999999', trigger: 'blur',
        }],
        ipPlace: [{
          pattern: Regex.ip, message: '请输入合法ip', trigger: 'blur',
        }],
      },
    };
  },
  async created() {
    if (this.actionType !== 'create') {
      this.formData = Object.assign({}, this.data);
    }
  },
  methods: {
    handleExpandChange() {
      this.$emit('expandChange');
    },
    async check() {
      await this.$refs.form.validate();
      return this.formData;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-col-25 {
  width: 20%;
}
::v-deep .el-col-50 {
  width: 40%;
}
.form-item-wrapper {
  padding: 0;
   margin-bottom: 0;
  .el-col-12 {
    padding:0;
  }
}
.column-name {
  font-size: 14px;
  font-weight: 600;
  transform: translateY(-50%);
  position: absolute;
  background-color: #fff;
  padding: 0 6px 0 16px;
}
.w100 {
  width: 100%;
}
.divider {
  display: block;
  height: 1px;
  width:100%;
  margin:24px 0;
  background-color: #dcdfe6;
  position: relative;
}
.date-picker {
  width: 100%;
  ::v-deep .el-input__inner{
    padding:0 16px;
  }
}
</style>
