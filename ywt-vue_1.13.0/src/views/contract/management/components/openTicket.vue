<!--  -->
<template>
  <el-form ref="form" size="mini" :model="formData" :rules="rules" label-position="right" label-width="120px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="分期">
          <el-input v-model="formData.index" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="发票类型" prop="receiptType">
          <el-select v-model="formData.receiptType" class="w-100">
            <el-option
              v-for="v in receiptType"
              :key="v.type"
              :label="v.text"
              :value="v.type"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="发票编号" prop="receiptNo">
      <el-input v-model="formData.receiptNo" type="textarea" rows="4" />
    </el-form-item>

    <el-row>
      <el-col :span="12">
        <el-form-item label="应开金额">
          <el-col :span="20">
            <CashInput v-model="formData.countPrice" disabled />
          </el-col>
          <el-col :span="4">
            <span class="unit-cash-span"> 元 </span>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="已开金额">
          <el-col :span="20">

            <CashInput v-model="formData.amountOpend" disabled />

          </el-col>
          <el-col :span="4">
            <span class="unit-cash-span"> 元 </span>
          </el-col>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">

        <el-form-item label="待开金额">
          <el-col :span="20">
            <CashInput v-model="formData.prescribedAmount" disabled />
          </el-col>
          <el-col :span="4">
            <span class="unit-cash-span"> 元 </span>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="receiptPrice" label="本次开票金额" label-width="140px">
          <el-col :span="20">
            <CashInput v-model="formData.receiptPrice" />
          </el-col>
          <el-col :span="4">
            <span class="unit-cash-span"> 元 </span>
          </el-col>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item prop="companyId" label="开票单位">
      <el-select v-model="formData.companyId" class="w-100">
        <el-option
          v-for="v in enterpriseList"
          :key="v.id"
          :label="v.deptName"
          :value="v.id"
        />
      </el-select>
    </el-form-item>

    <el-row>
      <el-col :span="12">
        <el-form-item prop="receiptUser" label="开票人">
          <el-input v-model="formData.receiptUser" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="receiptDate" label="开票日期">
          <el-date-picker v-model="formData.receiptDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" class="w-100" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item prop="reveiveUserId" label="接收人">
          <UserSelect v-model="formData.reveiveUserId" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="reveiveDate" label="接收日期">
          <el-date-picker v-model="formData.reveiveDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" class="w-100" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="备注">
      <el-input v-model="formData.remarkes" type="textarea" rows="4" />
    </el-form-item>
    <el-form-item label="附件">
      <JYWUpload v-model="formData.attachment" />
    </el-form-item>
    <el-form-item class="t-r">
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import ConrtactApis from '@/apis/contract';
import { mapGetters, mapState, } from 'vuex';
import { receiptType, } from '../config/historyTable';
import moment from 'moment';
import UserSelect from '@/views/project/components/userSelect/index';
import CashInput from '@/views/contract/components/input/cashInput.vue';
export default {
  name: 'Ticket',
  components: {
    UserSelect,
    CashInput,
  },
  props: {
    index: {
      type: Number,
      default: 0,
    },
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      defaultValueTime: Date.now(),
      receiptType,
      rules: {
        receiptType: [
          {
            trigger: 'change',
            required: true,
            message: '请选择发票类型',
          }
        ],
        receiptNo: [
          {
            trigger: 'blur',
            required: true,
            message: '发票编号不能为空',
          }
          // {
          //   pattern: /^\d{8}$/,
          //   message: '发票号码错误',
          //   trigger: 'change',
          // }
        ],
        receiptPrice: [
          {
            trigger: 'blur',
            required: true,
            message: '本次开票金额不能为空',
          },
          {
            trigger: 'change',
            validator: (r, v, cb) => {
              if (v > this.formData.prescribedAmount) {
                return cb('本次开票金额不得大于待开金额');
              }
              return cb();
            },
          }
        ],
        companyId: [
          {
            trigger: 'blur',
            required: true,
            message: '请选择开票单位',
          }
        ],
        receiptUser: [
          {
            trigger: 'blur',
            required: true,
            message: '开票人不能为空',
          }
        ],
        receiptDate: [
          {
            trigger: 'blur',
            required: true,
            message: '开票日期不能为空',
          }
        ],
        reveiveUserId: [
          {
            trigger: 'blur',
            required: true,
            message: '接收人不能为空',
          }
        ],
        reveiveDate: [
          {
            trigger: 'blur',
            required: true,
            message: '接收日期不能为空',
          }
        ],
      },
      formData: {
        // 应开
        countPrice: '',
        // 已开
        amountOpend: '',
        // 代开
        prescribedAmount: '',
        index: 0,
        // 合同ID
        contractId: '',
        // 开票日期
        receiptDate: '',
        // 开票单位ID
        companyId: '',
        // 开票人
        receiptUser: '',
        // 发票类型(1增值税专用发票2普通发票3专业发票)
        receiptType: '',
        // 发票编号
        receiptNo: '',
        // 接收人ID
        reveiveUserId: '',
        // 开票金额
        receiptPrice: '',
        // 接收日期
        reveiveDate: '',
        // 备注
        remarkes: '',
        // 附件
        attachment: JSON.stringify([]),
      },
    };
  },
  computed: {
    ...mapState('contract/index', ['enterpriseList', 'detailData']),
    ...mapGetters('contract/index', ['classPrice']),
    ...mapGetters(['userInfo']),
    isEdit() {
      return !!Object.values(this.info).length;
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      this.formData.countPrice = this.classPrice.countPrice;
      this.formData.amountOpend = this.classPrice.amountOpend;
      this.formData.prescribedAmount = this.classPrice.prescribedAmount;
      this.formData.receiptDate = moment().format('YYYY-MM-DD');
      this.formData.reveiveDate = moment().format('YYYY-MM-DD');
      this.formData.receiptUser = this.info?.receiptUser || '';
      this.formData.receiptPrice = this.info?.receiptPrice || '';
      this.formData.receiptType = this.info?.receiptType || '';
      this.formData.receiptNo = this.info?.receiptNo || '';

      this.formData.index += 1;
      this.formData.companyId = this.detailData.companybId;
      this.formData.reveiveUserId = this.userInfo.id;
      this.formData.attachment = (this.info?.attachment || JSON.stringify([]));
    },
    async submit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const params = {};
          params.id = (this.info?.id || '');
          params.contractId = this.detailData.id;
          params.receiptDate = this.formData.receiptDate;
          params.companyId = this.formData.companyId;
          params.receiptUser = this.formData.receiptUser;
          params.receiptType = this.formData.receiptType;
          params.receiptNo = this.formData.receiptNo;
          params.reveiveUserId = this.formData.reveiveUserId;
          params.receiptPrice = this.formData.receiptPrice;
          params.attachment = this.formData.attachment;
          if (params.id) {
            await ConrtactApis.InvoiceApi.update(params);
          } else {
            await ConrtactApis.InvoiceApi.create(params);
          }
          this.$emit('done');
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.w-100 {
  width: 100%;
}
.t-r{
  text-align: right;
}

.unit-cash-span{
 display: block;
  text-align: center;
      color: #e01222;
}
</style>
