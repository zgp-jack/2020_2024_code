<!--  -->
<template>
  <el-container>
    <el-main>
      <JYWPanel title="付款计划模板" width="100%">
        <el-form ref="form" label-width="100px" size="mini" label-position="left" :model="formData" :rules="rules">
          <el-form-item label="模板名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
        </el-form>
        <hr>
        <Table
          ref="formTable"
          :table-data="planTableData"
          :push-data="pushPlanTableData"
          btn-text="添加付款计划"
        />
        <!-- <Table :table-config="tableConfig" text="维保付款计划" btn-text="添加维保付款计划" /> -->
      </JYWPanel>
    </el-main>
    <el-footer class="footer-wrapper">
      <el-button type="primary" size="mini" :loading="submitButtonLoading" @click="submit"> 保存 </el-button>
      <el-button type="default" size="mini" :loading="delButtonLoading" @click="del"> 删除 </el-button>
    </el-footer>
  </el-container>
</template>

<script>
import ConrtactApis from '@/apis/contract';
import { cloneDeep, } from 'lodash';

export default {
  name: 'PlanTemplate',
  components: {
    Table: () => import('./table.vue'),
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      planTableData: [],
      submitButtonLoading: false,
      delButtonLoading: false,
      formData: {
        name: '',

      },
      pushPlanTableData: {
        explan: '',
        payRate: '',
        payType: '',
        days: '',
      },
      rules: {
        name: [{ required: true, message: '模板名称不能为空', }],
      },
    };
  },
  mounted() {
    if (Object.values(this.info).length) {
      this.getDetail(this.info.id);
    }
  },
  methods: {
    async   getDetail(id) {
      const rs = await ConrtactApis.TemplateApi.detail(id);
      this.planTableData = rs.templateInfo;
      this.formData.name = rs.name;
      for (const i of this.planTableData) {
        i.payRate = i.payRate * 100;
      }
    },
    async del() {
      this.$confirm(`是否删除「${this.info.name}」模板?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.delButtonLoading = true;
          // 服务端未对 id做判空 处理
          await ConrtactApis.TemplateApi.del(this.info.id);
          this.$emit('done');
          this.$message.success('删除成功');
        } catch (error) {
          this.$message.error(error);
        } finally {
          this.delButtonLoading = false;
        }
      });
    },
    async submit() {
      const valid = this.$refs['formTable'].validateForm();
      this.$refs['form'].validate(async (v) => {
        if (v) {
          if (valid) {
            this.submitButtonLoading = true;
            const planTableData = cloneDeep(this.planTableData);
            const params = {
              id: this.info.id || '',
              name: this.formData.name,
              templateInfoJson: '',
            };
            // params.name = this.formData.name;
            for (const i of planTableData) {
              i.payRate = i.payRate / 100;
            }
            params.templateInfoJson = JSON.stringify(planTableData);
            try {
              if (this.info.id) {
                await ConrtactApis.TemplateApi.update(params);
              } else {
                await ConrtactApis.TemplateApi.create(params);
              }
              this.$emit('done');
              this.submitButtonLoading = false;
            } catch (error) {
              this.submitButtonLoading = false;
              this.$message.error(error);
            }
          }
        }
      });
    },

  },
};
</script>
<style lang='scss' scoped>
hr {
  border: none;
  height: 1px;
  background-color: #ecf0f7;
}
.t-r {
  text-align: right;
}
.footer-wrapper {
  padding: 0;
  display: flex;
  align-items: center;
}
.panel-container {
  height: 100%;
  margin: 0 !important;
  padding: 0;
}
</style>
