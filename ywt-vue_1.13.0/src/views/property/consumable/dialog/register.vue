<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-09 14:32:19
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-01 15:53:09
 * @Description:耗材登记
-->
<template>
  <div v-loading="loading" class="drawer">
    <div class="header">
      <span class="title">{{ title }}</span>
    </div>
    <div class="body">
      <pure-card class="card">
        <div slot="header">基本信息</div>
        <el-form
          ref="form"
          label-position="right"
          label-width="102px"
          size="mini"
          :model="formData"
          :rules="rules"
          :disabled="operatorType==='VIEW'"
        >
          <el-form-item label="耗材名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="规格型号">
                <el-input v-model="formData.model" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="耗材单位" prop="unit">
                <el-input v-model="formData.unit" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="安全库存" prop="securityNum">
                <el-input v-model="formData.securityNum" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单价" prop="price">
                <el-input-number v-model="formData.price" style="width:100px;" controls-position="right" />
                <span class="unit">元</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="供应商" prop="supplier">
            <supplier-select v-model="formData.supplier" style="width: 100%" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="formData.remark"
              type="textarea"
              :rows="2"
              style="width:100%; text-align: left;margin-right:5px;"
            />
          </el-form-item>
          <el-form-item label="是否启用" prop="state">
            <el-switch
              v-model="formData.state"
              :active-value="1"
              :inactive-value="0"
              inactive-text="否"
              active-text="是"
            />
          </el-form-item>
        </el-form>
      </pure-card>
    </div>
    <div v-if="operatorType!=='VIEW'" class="footer">

      <pure-button type="default" label="保存" @click="submit" />
    </div>
  </div>
</template>

<script>
import FormDialog, { OPERATOR_TYPES, } from '@/minxins/common/formDialog';
import ConsumableApi from '@/apis/property/consumable';
export default {
  components: {
    SupplierSelect: () => import('@/views/components/other/supplierSelect.vue'),
  },
  mixins: [FormDialog],
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        name: null,
        model: null,
        unit: null,
        securityNum: null,
        price: null,
        deptId: null,
        supplier: null,
        remark: null,
        state: 1,
      },
      rules: {
        name: [{
          required: true, message: '请输入耗材名称', trigger: 'blur',
        }],
        unit: [{
          required: true, message: '请输入耗材单位', trigger: 'blur',
        }],
        securityNum: [{
          required: true, message: '请输入安全库存', trigger: 'blur',
        }],
        price: [{
          required: true, message: '请输入单价', trigger: 'blur',
        }],
        deptId: [{
          required: true, message: '请选择所在科室', trigger: 'change',
        }],
        supplier: [{
          required: true, message: '请选择供应商', trigger: 'change',
        }],
      },
      needFetchDetail: false,
    };
  },
  computed: {
    title() {
      let title = '耗材';
      switch (this.operatorType) {
        case OPERATOR_TYPES.CREATE:
          title = '新增耗材';
          break;
        case OPERATOR_TYPES.UPDATE:
          title = '编辑耗材';
          break;
      }
      return title;
    },
  },
  async created() {
    if (this.operatorType !== OPERATOR_TYPES.CREATE) {
      const data = await ConsumableApi.detail(this.id);
      this.formData = Object.assign({}, this.formData, data);
    }
  },

  methods: {
    async submit() {
      try {
        await this.$refs.form.validate();
        if (this.operatorType === OPERATOR_TYPES.CREATE) {
          await this.create();
        } else {
          await this.update();
        }

        this.$message({
          type: 'success',
          message: '操作成功',
        });
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
    async update() {
      await ConsumableApi.update({ ...this.formData, id: this.id, });
    },
    async create() {
      await ConsumableApi.create(this.formData);
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
.unit {
  font-size: 14px;
  color: #879BBA;
  padding-left: 5px;
  padding-right: 5px;
}
</style>
