<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-01 14:42:00
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-31 10:04:13
 * @Description:报价审核-邀标面板
-->
<template>
  <collapse-item
    :name="name"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template #title>
      报价审核
    </template>
    <template #labelText>
      操作人：
    </template>
    <template #labelValue>
      {{ currentUser }}
    </template>
    <template #labelTime>
      创建时间：
    </template>
    <template #labelTimeValue>
      {{ currentTime }}
    </template>
    <el-form
      ref="form"
      label-position="right"
      label-width="128px"
      size="mini"
      :disabled="disabled"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="评标结果">
        <dic-radio v-model="formData.bidResult" dic-key="bid_result" type="string" />
      </el-form-item>
      <template v-if="formData.bidResult==='1'">
        <el-form-item key="manufacturerId1" label="中标厂家" prop="manufacturerId">
          <el-select v-model="formData.manufacturerId" class="w-100" @change="onChangeCandidateManufacturer">
            <el-option v-for="(item,index) in candidateManufacturerList " :key="index" :label="item.manufacturerName" :value="item.manufacturerId" />
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="厂家授权人">
              <el-select v-model="formData.manufacturerAuthorizer" :disabled="!formData.manufacturerId" @change="onManufacturerAuthorizerChange">
                <el-option v-for="(item,index) in manufacturerAuthorizers " :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式">
              <el-input v-model="formData.phone" :disabled="!formData.manufacturerId" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="中标时间">
          <el-date-picker
            v-model="formData.selectTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>
        <el-form-item key="bidEvaluateUser1" label="评标人员" prop="bidEvaluateUser">
          <user-select v-model="formData.bidEvaluateUser" :multiple="true" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="附件">
          <upload v-model="formData.enclosure" />
        </el-form-item>
      </template>
      <template v-if="formData.bidResult==='2'">
        <el-form-item key="bidEvaluateUser2" label="评标人员" prop="bidEvaluateUser">
          <user-select v-model="formData.bidEvaluateUser" :multiple="true" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="附件">
          <upload v-model="formData.enclosure" />
        </el-form-item>
      </template>
      <template v-if="formData.bidResult==='3'">
        <el-form-item label="废标处理">
          <dic-radio v-model="formData.abandonedBid" dic-key="abandoned_bid" type="string" />
        </el-form-item>

        <template v-if="formData.abandonedBid==='1'">
          <manufacture :list="formData.manufacturerInfos" :multi="true" />
          <el-form-item label="报价截止时间">
            <el-date-picker
              v-model="formData.quoteEndTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
            />
          </el-form-item>
        </template>
      </template>
    </el-form>
  </collapse-item>
</template>

<script>
import CarryInServiceApi from '../api';
import CarryInServiceMixin from '../mixin';
import Manufacture from '@/feat/ticket/carryInService/components/manufacture';
import DicRadio from '@/feat/system/dictionary/normal/component/dicRadio.vue';
import UserSelect from '@/views/project/components/userSelect/index';
import EngineerApi from '@/feat/system/user/api';
import Moment from 'moment';
import {
  find,
} from 'lodash';
export default {
  name: 'ExamineQuotePriceWithBidPanel',
  components: {
    DicRadio,
    UserSelect,
    Manufacture,
  },
  mixins: [CarryInServiceMixin],
  props: {
    disabled: {
      type: Boolean,
      default: false,
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
      name: 'ExamineQuotePriceWithBidPanel',
      formData: {
        bidResult: '1',
        manufacturerId: null,
        manufacturerAuthorizer: null,
        phone: null,
        selectTime: Moment().format('YYYY-MM-DD HH:mm'),
        bidEvaluateUser: null,
        remark: null,
        enclosure: null,
        abandonedBid: '1',
        manufacturerInfos: [{ manufacturerId: null, manufacturerUser: null, manufacturerPhone: null, }, { manufacturerId: null, manufacturerUser: null, manufacturerPhone: null, }],
        quoteEndTime: null,
      },
      rules: {
        manufacturerId: [
          { required: true, message: '请选择中标厂家', trigger: 'change', }
        ],
        bidEvaluateUser: [
          { required: true, message: '请选择评标人员', trigger: 'change', }
        ],
      },

      manufacturerAuthorizers: [],

      // 中标厂家候选列表
      candidateManufacturerList: [],
    };
  },

  created() {
    this.onFetchCandidateManufacturerList();
    if (this.data.id) {
      this.formData = Object.assign({}, this.data);
    }
    if (this.formData.manufacturerId) {
      this.onChangeCandidateManufacturer(this.formData.manufacturerId);
    }
  },
  methods: {
    async onFetchCandidateManufacturerList() {
      const data = await CarryInServiceApi.candidateManufacturerList(this.data.repairId);
      this.candidateManufacturerList = data;
    },

    // 中标厂家变更
    async onChangeCandidateManufacturer(val) {
      const { list, } = await EngineerApi.list({ pageNum: 0, pageSize: 9999, deptId: val, });
      const manufacturer = find(this.candidateManufacturerList, { manufacturerId: val, });
      this.manufacturerAuthorizers = list;
      this.formData.manufacturerAuthorizer = manufacturer?.manufacturerUser;
      this.formData.phone = manufacturer?.manufacturerPhone;
    },
    onManufacturerAuthorizerChange(val) {
      this.formData.phone = null;
      const user = find(this.manufacturerAuthorizers, { id: val, });
      this.formData.phone = user?.mblNo;
    },
    async check(repairId) {
      console.log({ repairId, ...this.formData, });
      await this.$refs['form'].validate();
      await CarryInServiceApi.examineQuotePrice({ repairId, ...this.formData, });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
