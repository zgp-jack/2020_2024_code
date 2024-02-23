<!--  -->
<template>
  <el-container>
    <el-main>
      <JYWPanel
        v-loading="loading"
        title="合同详情"
        left-flag-title="创建人"
        :left-flag-value="panelInfo.createUser | member"
        right-flag-title="创建时间"
        :right-flag-value="panelInfo.createTime | date"
        :width="100 + '%'"
      >
        <el-form
          ref="form"
          :model="formData"
          :rules="rules"
          label-position="right"
          label-width="120px"
          size="mini"
          :disabled="disabled"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="合同名称" prop="name">
                <el-input v-model="formData.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同编号" prop="number">
                <el-input v-model="formData.number" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="合同金额" prop="contractPrice">
                <el-col :span="20">
                  <CashInput v-model="formData.contractPrice" />
                </el-col>
                <el-col :span="4">
                  <span class="unit-cash-span"> 元 </span>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="签约日期" prop="signDate">
                <el-date-picker
                  v-model="formData.signDate"
                  class="w-100"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="验收日期" prop="checkDate">
                <el-date-picker
                  v-model="formData.checkDate"
                  class="w-100"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属项目" prop="itemCode">
                <SelectProject v-model="formData.itemCode" :disabled="disabledSelectProject" :value-type="'itemCode'" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属科室" prop="officeId">
                <department-cascader v-model="formData.officeId" class="w-100" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="甲方单位" prop="companyaId">
                <CommonDeptCascader
                  v-model="formData.companyaId"
                  class="w-100"
                  :source="enterpriseList"
                  :disabled-list="SelectedEnterpriseIds"
                  @change="changeEnterprise($event, 'companyaPerson', 'companyaPhone')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系人" prop="companyaPerson">
                <el-input v-model="formData.companyaPerson" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话" prop="companyaPhone">
                <el-input v-model="formData.companyaPhone" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="已方单位" prop="companybId">
                <CommonDeptCascader
                  v-model="formData.companybId"
                  class="w-100"
                  :source="enterpriseList"
                  :disabled-list="SelectedEnterpriseIds"
                  @change="changeEnterprise($event, 'companybPerson', 'companybPhone')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系人" prop="companybPerson">
                <el-input v-model="formData.companybPerson" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话" prop="companybPhone">
                <el-input v-model="formData.companybPhone" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="丙方单位" prop="companycId">
                <CommonDeptCascader
                  v-model="formData.companycId"
                  class="w-100"
                  :source="enterpriseList"
                  :disabled-list="SelectedEnterpriseIds"
                  @change="changeEnterprise($event, 'companycPerson', 'companycPhone')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系人" prop="companycPerson">
                <el-input v-model="formData.companycPerson" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话" prop="companycPhone">
                <el-input v-model="formData.companycPhone" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="质保时间" prop="qaDate">
                <el-date-picker
                  v-model="formData.qaDate"
                  class="w-100"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="赠送维保期限" prop="qaGiveDate">
                <el-date-picker
                  v-model="formData.qaGiveDate"
                  class="w-100"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="有偿维保费" prop="qaMoney">
                <CashInput v-model="formData.qaMoney" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="60px" label="元/年" />

            </el-col>
          </el-row>

        </el-form>
        <hr>
        <div>
          <el-row class="row-tag">
            <el-col :span="3">
              <h5>付款计划</h5>
            </el-col>
            <el-col v-if="showButton.pay" :span="3">
              <el-button size="mini" type="primary" plain @click="addPlan">
                添加付款计划
              </el-button>
            </el-col>
            <el-col v-if="showButton.pay" :span="10" :offset="8" class="label-wrapper">
              <label> 计划付款模板 </label>
              <el-select v-model="tep" size="mini" class="select-tag" @change="changeTemplate">
                <el-option v-for="v in templateList" :key="v.id" :value="v.id" :label="v.name" />
              </el-select>
            </el-col>
          </el-row>
          <el-row class="form-table-row">
            <el-col :span="24">
              <el-form ref="planForm" :model="planFormData" size="mini" status-icon :show-message="false">
                <el-table
                  :data="payPlanTemplateInfo.tableData"
                  :cell-style="tableStyle.cellStyle"
                  border
                  size="mini"
                >
                  <el-table-column
                    v-for="(v, index) in payTableConfig"
                    :key="index "
                    :type="v.type"
                    :label="v.label"
                    :prop="v.prop"
                    :width="v.width"
                    align="left"
                    :formatter="v.formatter"
                    :column-key="v.prop"
                    show-overflow-tooltip
                  >
                    <el-table-column
                      v-for="item in v.children"
                      :key="item.prop"
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :formatter="item.formatter"
                      align="left"
                      label-class-name="label-class-name"
                    />
                    <template v-if="v.slot" #default="{ row, $index }">
                      <OptionsMenu :pay-type="String(row.payState)" @click="clickOptions($event,row,$index)" />
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <!--

    开票记录
 -->
        <div v-if="showInvoiceTable">
          <el-row class="row-tag">
            <el-col :span="3">
              <h5>开票记录</h5>
            </el-col>
            <el-col :span="3">
              <el-button v-if="showButton.invoice" plain type="primary" size="mini" @click="clickPay">
                添加开票记录
              </el-button>
            </el-col>

            <el-col :span="4" class="label-wrapper">
              <label> 应开金额 </label>
              <span> ￥{{ classPrice.countPrice | formatCash }}元 </span>
            </el-col>
            <el-col :span="4" class="label-wrapper">
              <label> 已开金额 </label>
              <span> ￥{{ classPrice.amountOpend | formatCash }}元 </span>
            </el-col>
            <el-col :span="4" class="label-wrapper">
              <label> 待开金额 </label>
              <span> ￥{{ classPrice.prescribedAmount | formatCash }}元 </span>
            </el-col>
            <el-col :span="4" class="label-wrapper">
              <label> 状态: </label>
              <b :style="`color:${status.color};font-size:14px`"> {{ status.text[0] }} </b>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table
                :data="invoiceRecordInfo.tableData"
                border
                size="mini"
                :cell-style="tableStyle.cellStyle"
              >
                <el-table-column
                  v-for="v in invoiceRecordInfo.historyTableConfig"
                  :key="v.prop"
                  :label="v.label"
                  :prop="v.prop"
                  :width="v.width"
                  :formatter="v.formatter"
                  :type="v.type"
                  align="left"
                  show-overflow-tooltip
                >
                  <template v-if="v.slot" #default="{ row, $index }">
                    <el-button :disabled="disabledInvoiceTableOptions" type="text" @click="clickEdit(row)">
                      编辑
                    </el-button>
                    <el-button :disabled="disabledInvoiceTableOptions" type="text" @click="del(row, $index)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>

        <template v-if="['handle','add'].includes(optionsModel)">
          <el-row class="row-tag">
            <el-col :span="24">
              <h5>附件</h5>
            </el-col>
          </el-row>
          <el-row class="row-tag">
            <el-col :span="24">
              <JYWUpload v-model="formData.attachment" />
            </el-col>
          </el-row>
        </template>
      </JYWPanel>
    </el-main>
    <el-footer class="footer-wrapper">
      <el-button v-if="showButton.close" type="primary" size="mini" @click="close"> 关闭 </el-button>
      <el-button v-if="showButton.save" type="primary" size="mini" :loading="submitButtonLoading" @click="submit"> 保存 </el-button>
      <el-button v-if="showButton.delelt" type="default" size="mini" :loading="delButtonLoading" @click="clickDelContract"> 删除 </el-button>
    </el-footer>
  </el-container>
</template>

<script>
import ConrtactApis from '@/apis/contract';
import _ from 'lodash';
import { mapActions, mapGetters, mapMutations, mapState, } from 'vuex';
import { phone_rules, } from '@/views/project/components/panels/config/form.rules';
import CashInput from '@/views/contract/components/input/cashInput.vue';
import SelectProject from '@/views/project/components/select/selectProject.vue';
import mixinTable from './mixins/table.mixin';
import tableStyle from '@/views/project/style/table';
import historyTableConfig from '../config/historyTable';
import { pay_status, } from '../config/table';
import Pay from './pay.vue';
import dialogWidth from '@/views/project/common/width/dialog';
import DepartmentCascader from '@/feat/system/department/component/departmentCascader.vue';
export default {
  components: {
    CashInput,
    SelectProject,
    CommonDeptCascader: () => import('@/feat/system/department/component/commonDeptCascader.vue'),
    OptionsMenu: () => import('../components/optionsMenu.vue'),
    // eslint-disable-next-line vue/no-unused-components
    OpenTicket: () => import('./openTicket.vue'),
    // eslint-disable-next-line vue/no-unused-components
    DepartmentCascader,
  },
  mixins: [mixinTable],

  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 用于项目模块中的添加
    whereInfo: {
      type: Object,
      default: () => {
        return {
          where: 'contract',
          itemCode: '',
        };
      },
    },
  },
  data() {
    return {
      loading: false,
      formData: {
        // 合同名称
        name: '',
        // 合同编号
        number: '',
        // 合同金额
        contractPrice: '',
        // 签约日期
        signDate: '',
        // 验收日期
        checkDate: '',
        // 项目编号
        itemCode: '',
        // 科室ID
        officeId: null,
        // 甲方ID
        companyaId: null,
        // 甲方联系人
        companyaPerson: '',
        // 甲方联系电话
        companyaPhone: '',
        // 乙方ID
        companybId: null,
        // 乙方联系人
        companybPerson: '',
        // 乙方联系电话
        companybPhone: '',
        // 丙方ID
        companycId: null,
        // 丙方联系人
        companycPerson: '',
        // 丙方联系电话
        companycPhone: '',
        // 质保期
        qaDate: '',
        // 赠送维保期
        qaGiveDate: '',
        // 有偿维保费用
        qaMoney: '',
        // 付款计划
        payPlanJson: '',
        // 附件
        attachment: JSON.stringify([]),
      },
      rules: {
        name: [
          {
            required: true,
            message: '合同名称不能为空',
            trigger: 'blur',
          }
        ],
        number: [
          {
            required: true,
            message: '合同编号不能为空',
            trigger: 'blur',
          }
        ],
        contractPrice: [
          {
            required: true,
            message: '合同金额不能为空',
            trigger: 'blur',
          },
          {
            pattern: /(^(([1-9]([0-9]+)?)|(0{1}))(\.[0-9]{1,2})?$)/,
            message: '金额格式不正确',
            trigger: 'blur',
          }
        ],
        signDate: [
          {
            required: true,
            message: '签约日期不能为空',
            trigger: 'blur',
          }
        ],
        checkDate: [
          {
            required: true,
            message: '验收日期不能为空',
            trigger: 'blur',
          }
        ],
        qaDate: [{
          required: true,
          message: '质保时间不能为空',
          trigger: 'blur',
        }],
        itemCode: [
          {
            required: true,
            message: '所属项目不能为空',
            trigger: 'change',
          }
        ],
        officeId: [
          {
            required: true,
            message: '科室不能为空',
            trigger: 'change',
          }
        ],
        companyaId: [
          {
            required: true,
            message: '甲方单位不能为空',
            trigger: 'change',
          }
        ],
        companyaPerson: [
          {
            required: true,
            message: '甲方联系人不能为空',
            trigger: 'change',
          }
        ],
        companyaPhone: [
          {
            required: true,
            message: '甲方联系电话不能为空',
            trigger: 'change',
          },
          phone_rules
        ],
        companybId: [
          {
            required: true,
            message: '乙方单位不能为空',
            trigger: 'change',
          }
        ],
        companybPerson: [
          {
            required: true,
            message: '乙方联系人不能为空',
            trigger: 'change',
          }
        ],
        companybPhone: [
          {
            required: true,
            message: '乙方联系电话不能为空',
            trigger: 'change',
          },
          phone_rules
        ],
        companycId: [
          {
            required: false,
            message: '丙方不能为空',
            trigger: 'blur',
          }
        ],
        companycPerson: [
          {
            required: false,
            message: '丙方联系人不能为空',
            trigger: 'blur',
          }
        ],
        companycPhone: [
          {
            required: false,
            message: '丙方联系电话不能为空',
            trigger: 'blur',
          }, phone_rules
        ],
        qaMoney: [
          {
            required: false,

            trigger: 'change',
            type: 'number',
            transform: (v) => Number(v),
            message: '金额为数字',
          }
        ],
        attachment: [
          {
            required: true,
            message: '附件不能为空',
            trigger: 'blur',
          }
        ],
      },
      submitButtonLoading: false,
      delButtonLoading: false,
      tableStyle,
      templateList: [],
      tep: '',
      // 付款计划
      payPlanTemplateInfo: {
        tableData: [],
      },
      // 开票记录
      invoiceRecordInfo: {
        tableData: [],
        historyTableConfig,
      },
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('contract/index', ['itemList', 'detailData', 'enterpriseList', 'optionsModel']),
    ...mapGetters('contract/index', ['classPrice']),
    renderTemplate() {
      return ['edit', 'add'].includes(this.optionsModel);
    },
    SelectedEnterpriseIds() {
      const { companyaId, companybId, companycId, } = this.formData;
      return [companyaId, companybId, companycId];
    },
    panelInfo: {
      get() {
        return {
          createUser: this.userInfo.id,
          createTime: new Date(),
        };
      },
      set(data) {
        this.panelInfo = data;
      },
    },
    disabled() {
      return ['handle', 'look'].includes(this.optionsModel);
    },

    // 新增
    optionsModelAdd() {
      return ['add'].includes(this.optionsModel);
    },
    // 查看
    optionsModelLook() {
      return ['look'].includes(this.optionsModel);
    },
    // 编辑
    optionsModelEdit() {
      return ['edit'].includes(this.optionsModel);
    },
    // 处理
    optionsModelHandle() {
      return ['handle'].includes(this.optionsModel);
    },

    showButton() {
      return {
        close: this.optionsModelLook || this.optionsModelHandle,
        save: this.optionsModelAdd || this.optionsModelEdit || this.optionsModelHandle,
        delelt: this.optionsModelEdit,
        pay: this.optionsModelEdit || this.optionsModelAdd,
        invoice: this.optionsModelHandle,
      };
    },
    showInvoiceTable() {
      return this.optionsModelHandle || this.optionsModelLook;
    },

    showTableOptions() {
      return {
        pay: this.optionsModelHandle,
      };
    },

    disabledInvoiceTableOptions() {
      return ['look'].includes(this.optionsModel);
    },

    planFormData() {
      return {
        table: this.payPlanTemplateInfo.tableData,
      };
    },

    // 付款比例总数
    BillNum() {
      const nums = this.payPlanTemplateInfo.tableData.map(e => Number(e.payRate));
      const sum = _.sum(nums) || 0;
      return sum;
    },
    labelStyle() {
      return {
        color: '#879BBA',
        'font-size': '14px',
      };
    },
    status() {
      let state = 0;
      if (this.classPrice.prescribedAmount === 0) {
        state = 3;
      } else if (this.classPrice.amountOpend !== 0) {
        state = 2;
      } else if (this.classPrice.amountOpend === 0) {
        state = 1;
      }
      return pay_status[state];
    },
    disabledSelectProject() {
      if (this.whereInfo.where === 'project') {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.init();
    this.getTemplateList();
    this.SET_INJECT_EVENT({ name: 'contractDetail', fun: this.init, });
  },
  methods: {
    ...mapMutations('contract/index', ['SET_DETAIL_DATA']),
    ...mapMutations('project/index', ['SET_INJECT_EVENT']),
    ...mapActions('contract/index', ['FETCH_DETAIL_DATA']),
    ...mapActions('project/index', ['FETCH_PERFORM_EVENT']),

    clickEdit(row) {
      this.renderTemplateFun('开票', row);
    },
    clickPay() {
      this.renderTemplateFun('开票');
    },

    renderTemplateFun(title, row = {}) {
      this.$dialog({
        title: title,
        width: dialogWidth.mini_px,
        position: 'center',
        component: () => <OpenTicket index={this.tableData.length} info={row} onDone={this.onDone}/>,

      });
    },
    async del(row, i) {
      this.$confirm(`是否删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await ConrtactApis.InvoiceApi.del(row.id);
        this.onDone();
        this.$message.success('删除成功');
      });
    },
    clickOptions(code, r, i) {
      switch (code) {
        case 'pay':
          this.$dialog({
            title: '付款',
            width: dialogWidth.small_px,
            position: 'center',
            component: () => <Pay onDone={this.onDone} info={Object.assign({}, { ...r, index: i, })}/>,
          });
          break;
        case 'del':
          this.tableData.splice(i, 1);
          break;
        case 'search':
          this.$dialog({
            title: '查看',
            width: dialogWidth.small_px,
            position: 'center',
            component: () => <Pay onDone={this.onDone} isSearch info={Object.assign({}, { ...r, index: i, })}/>,
          });
          break;
        default:
          break;
      }
    },
    close() {
      this.$emit('done');
    },
    onDone() {
      this.FETCH_PERFORM_EVENT({ name: 'contractDetail', });
    },
    // 添加付款计划
    addPlan() {
      this.payPlanTemplateInfo.tableData.push({
        explan: '',
        payRate: '',
        payType: '',
        days: '',
      });
    },
    async getTemplateList() {
      this.templateList = await ConrtactApis.TemplateApi.enable();
    },
    async changeTemplate(v) {
      const rs = await ConrtactApis.TemplateApi.detail(v);
      for (const i of rs.templateInfo) {
        i.payRate = i.payRate * 100;
        i.id = '';
      }
      this.payPlanTemplateInfo.tableData.splice(0, this.payPlanTemplateInfo.tableData.length, ...rs.templateInfo);
    },
    // 基础表单校验
    baseFormValidate() {
      let validate = false;
      this.$refs['form'].validate((valid) => {
        validate = valid;
      });
      return validate;
    },
    // 校验付款计划表单
    planFormValidate() {
      let validate = false;
      if (this.BillNum > 100) {
        this.$notify({
          title: '提示',
          type: 'warning',
          message: '付款比例总数不能大于「100%」',
          duration: 3000,
        });
        validate = false;
      } else if (this.BillNum !== 100) {
        this.$notify({
          title: '提示',
          type: 'warning',
          message: '分期付款总比例需等于「100%」',
          duration: 3000,
        });
        validate = false;
      }

      this.$refs['planForm'].validate((valid) => {
        validate = valid;
      });
      return validate;
    },
    // 当选择某个企业之后
    changeEnterprise(val, contactField, phoneField) {
      if (val) {
        val = JSON.parse(val.contacts)[0];
        this.formData[contactField] = val.user;
        this.formData[phoneField] = val.phone;
      } else {
        this.formData[contactField] = '';
        this.formData[phoneField] = '';
      }
    },

    // 获取详情数据
    async init() {
      if (this.whereInfo.where === 'project') {
        this.formData.itemCode = this.whereInfo.itemCode;
      }
      if (!this.info.id) {
        return;
      }
      try {
        this.loading = true;
        const rs = await ConrtactApis.ConrtactApi.detail(this.info.id);
        this.detailInfo = rs;

        this.panelInfo.createUser = this.detailInfo.createUser || '';
        this.panelInfo.createTime = this.detailInfo.createTime || new Date();

        this.SET_DETAIL_DATA(this.detailInfo);

        for (const i of this.detailInfo.payPlanList) {
          i.payRate = i.payRate * 100;
        }
        this.tableData = this.detailInfo.payPlanList;
        this.attachment = this.detailInfo.attachment;

        this.payPlanTemplateInfo.tableData = rs.payPlanList || [];
        this.invoiceRecordInfo.tableData = rs.receiptList || [];

        this.formData = rs;
        this.formData.qaMoney = rs.qaMoney || '';

        this.loading = false;
      } catch (error) {
        this.loading = false;
      } finally {
        this.loading = false;
      }
    },

    async submit() {
      const params = {};
      if (!this.baseFormValidate()) {
        return;
      }
      if (!this.planFormValidate()) {
        return;
      }
      this.submitButtonLoading = true;
      Object.assign(params, {
        ...this.formData,
        payPlanJson: JSON.parse(JSON.stringify(this.payPlanTemplateInfo.tableData)),
      });
      for (const i of params.payPlanJson) {
        i.payRate = i.payRate / 100;
      }
      params.payPlanJson = JSON.stringify(params.payPlanJson);
      try {
        if (params.id) {
          _.unset(params, 'payPlanList');
          _.unset(params, 'receiptList');
          _.unset(params, 'createTime');

          await ConrtactApis.ConrtactApi.edit(params);
        } else {
          await ConrtactApis.ConrtactApi.add(params);
          this.FETCH_PERFORM_EVENT({ name: 'imposeList', });
        }
        this.submitButtonLoading = false;
        this.$emit('done');
      } catch (error) {
        console.log(error);
        this.$message.error(error);
        this.submitButtonLoading = false;
      }
    },
    async clickDelContract() {
      this.$confirm(`是否删除「${this.info.name}」合同?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.delButtonLoading = true;
          await ConrtactApis.ConrtactApi.del(this.info.id);
          this.delButtonLoading = false;
          this.FETCH_PERFORM_EVENT({ name: 'imposeList', });

          this.$emit('done');
          this.$message.success('删除成功');
        } catch (error) {
          this.delButtonLoading = false;
          this.$message.error(error);
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
.row-tag {
  display: flex;
  align-items: center;
  height: 50px;
  h5 {
    padding: 0;
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: #2d405e;
  }

}
.w-100 {
  width: 100%;
}
.unit-cash-span{
  display: block;
  text-align: center;
      color: #e01222;
}
.row-tag {
  display: flex;
  align-items: center;
  height: 50px;
  h5 {
    padding: 0;
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: #2d405e;
  }
  .label-wrapper {
    display: flex;
    align-items: center;
    label {
      font-size: 14px;
      font-weight: 400;
      display: inline-block;
      color: #879bba;
      margin-right: 5px;
      // width: 20%;
    }
      span {
      color: #2d405e;
      font-size: 14px;
    }
    .select-tag {
      flex: 1;
    }
  }
}
.form{
  &-table{
    &-row{
      ::v-deep .el-form-item__content{
        display: flex;
      }
      ::v-deep .el-form-item{
        margin:0
      }
    }
  }
}
</style>
