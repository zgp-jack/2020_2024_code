<!--  -->
<template>
  <el-container style="height: 586px">
    <el-aside width="150px" class="aside-tag">
      <div class="history-wrapper">
        <h4>付款记录</h4>
        <ul>
          <li
            v-for="(v,i) in historyList"
            :key="v.id"
            :class="i === active ? 'active' : ''"
            @click="clickLi(v,i)"
          >
            {{ v.payDate }}
          </li>
        </ul>
      </div>
    </el-aside>
    <div class="divider" />
    <el-container>
      <el-main style="padding:0 2px">
        <el-form ref="form" size="mini" :disabled="disabled" label-position="right" :model="formData" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="分期">
                <el-input v-model="formData.index" disabled />
              </el-form-item>
            </el-col>
            <el-col :offset="2" :span="12">
              <el-form-item label="已开发票金额" label-width="120px">
                <span class="cash-span"> ￥{{ classPrice.amountOpend | formatCash }}元 </span>
              </el-form-item>
            </el-col>

          </el-row>

          <el-form-item label="付款说明">
            <el-input v-model="formData.explan" disabled type="textarea" rows="2" />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="付款比例">
                <el-input v-model="formData.payRate" disabled>
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="应付金额">
                <el-col :span="20">
                  <CashInput v-model="formData.payablePrice" disabled />
                </el-col>
                <el-col :span="4">
                  <span class="unit-cash-span"> 元 </span>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="已付金额">
                <el-col :span="20">
                  <CashInput v-model="formData.paidPrice" disabled />
                </el-col>
                <el-col :span="4">
                  <span class="unit-cash-span"> 元 </span>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="待付金额">
                <el-col :span="20">
                  <CashInput v-model="formData.stay" disabled />
                </el-col>
                <el-col :span="4">
                  <span class="unit-cash-span"> 元 </span>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="本次付款" prop="payPrice">
                <el-col :span="20">
                  <CashInput v-model="formData.payPrice" />
                </el-col>
                <el-col :span="4">
                  <span class="unit-cash-span"> 元 </span>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12" />
          </el-row>
          <el-form-item label="付款日期" prop="payDate">
            <el-date-picker
              v-model="formData.payDate"
              type="date"
              class="w-100"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="付款单位" prop="payCompanyId">
            <el-select v-model="formData.payCompanyId" class="w-100">
              <el-option
                v-for="v in enterpriseList"
                :key="v.id"
                :label="v.deptName"
                :value="v.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="formData.remarks" type="textarea" rows="4" />
          </el-form-item>
          <el-form-item class="t-r" />
        </el-form>
      </el-main>
      <el-footer class="el-footer" height="auto">
        <el-button type="primary" :loading="submitButtonLoading" size="mini" :disabled="disabled" @click="submit"> 确认 </el-button>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import ConrtactApis from '@/apis/contract';
import { mapGetters, mapState, } from 'vuex';
import moment from 'moment';
import CashInput from '@/views/contract/components/input/cashInput.vue';

export default {
  name: 'PayHyy',
  components: {
    CashInput,
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isSearch: Boolean,
  },
  data() {
    return {
      active: 0,
      submitButtonLoading: false,
      historyList: [],
      formData: {
        index: '',
        explan: '',
        payRate: '',
        // answer: '',
        // has: '',
        paidPrice: '',
        payablePrice: '',
        stay: '',
        // 分期ID
        contractPayPlanId: '',
        // 支付日期
        payDate: '',
        // 期号
        planNo: '',
        // 备注
        remarks: '',
        // 付款金额
        payPrice: '',
        // 付款公司ID
        payCompanyId: '',
      },
      rules: {
        // remarks: [
        //   {
        //     required: true,
        //     message: '付款说明不能为空',
        //     trigger: 'blur',
        //   }
        // ],
        payPrice: [
          {
            required: true,
            message: '本次付款金额不能为空',
            trigger: 'blur',
          },
          {
            message: '金额类型错误',
            trigger: 'change',
            type: 'number',
            transform: (v) => Number(v),
          },
          {
            trigger: 'change',
            validator: (r, v, cb) => {
              if (this.disabled) {
                return cb();
              }
              if (v > this.formData.stay) {
                return cb('本次付款金额不能大于待付金额');
              }
              return cb();
            },
          }
        ],
        payDate: [
          {
            required: true,
            message: '付款日期不能不空',
            type: 'string',
          }
        ],
        payCompanyId: [
          {
            required: true,
            message: '请选择付款单位',
            trigger: 'blur',

          }
        ],

      },
    };
  },
  computed: {
    ...mapState('contract/index', ['enterpriseList', 'detailData']),
    ...mapGetters('contract/index', ['classPrice']),

    // ...mapState('contract/index', ['itemList', 'enterpriseList', 'optionsModel'])

    disabled() {
      return this.isSearch || !!this.active;
    },
  },
  mounted() {
    this.init();
  },
  methods: {

    clickLi(v, i) {
      this.active = i;
      this.formData.index = ++i;
      this.formData.payPrice = v.payPrice;
      this.formData.remarks = v.remarks;
      this.formData.payCompanyId = v.payCompanyId;
      this.formData.payDate = v.payDate;
    },
    submit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          try {
            this.submitButtonLoading = true;
            const params = {};
            params.contractPayPlanId = this.info.id;
            params.payDate = this.formData.payDate;
            params.planNo = this.formData.index;
            params.remarks = this.formData.remarks;
            params.payPrice = this.formData.payPrice;
            params.payCompanyId = this.formData.payCompanyId;
            await ConrtactApis.PayApi.create(params);
            this.submitButtonLoading = false;
            this.$emit('done');
          } catch (error) {
            this.submitButtonLoading = false;
            this.$message.error(error);
          }
        }
      });
    },

    // 1.需先查询 本次付款id 的记录
    async init() {
      this.historyList = await ConrtactApis.PayApi.init(this.info.id);
      if (this.isSearch) {
        this.formData = this.historyList[0];
        this.formData.index = 1;
      } else {
        this.historyList.unshift({
          id: -1,
          contractPayPlanId: '',
          payCompanyId: this.detailData.companyaId,
          payDate: moment().format('YYYY-MM-DD'),
          payPrice: '',
          planNo: '',
          remarks: '',

        });
        this.formData.index = this.info.index += 1;

        this.formData.payDate = moment().format('YYYY-MM-DD');
        this.formData.payCompanyId = this.detailData.companyaId;

        this.formData.payPrice = '';
      }
      this.formData.explan = this.info.explan;
      this.formData.payRate = this.info.payRate;
      this.formData.explan = this.info.explan;
      this.formData.payRate = this.info.payRate;
      this.formData.payablePrice = this.info.payablePrice;
      this.formData.paidPrice = this.info.paidPrice;
      // 待付金额 =  应付 - 已付
      this.formData.stay = (this.info.payablePrice - this.formData.paidPrice).toFixed(2);
    },
  },
};
</script>
<style lang='scss' scoped>
.cash-span {
  font-size: 14px;
  font-weight: 600;
  color: #f56c6c;
}
.w-100 {
  width: 100%;
}
.aside-tag {
  margin-bottom: 0 !important;

  &::-webkit-scrollbar {
    width: 6px;
    height: 10px;
  }
  // 滚动条的滑块
  &::-webkit-scrollbar-thumb {
    background-color: #d7e5f9;
    border-radius: 3px;
  }
}
.el-footer{
  @extend .t-r;
  padding: 0;
}
.divider {
  width: 1px;
  background-color: #ecf0f7;
  height: 100%;
  display: inline-block;
  margin: 0 8px;
}
.history-wrapper {
  width: 100%;

  h4,
  li {
    line-height: 48px;
    height: 48px;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    display: block;
  }
  > h4,
  ul {
    padding: 0;
    margin: 0;
  }
  li {
    border: 1px solid #ecf0f7;
    margin: 0 0 -1px 0;
    cursor: pointer;
  }
  .active {
    background: #f5f7fa;
  }
  h4 {
    background: #d7e5f9;
    position: sticky;
    top: 0;
    border-radius: 4px 4px 0px 0px;
  }
}

.t-r {
  text-align: right;
}
.unit-cash-span{
  display: block;
  text-align: center;
      color: #e01222;
}
</style>
