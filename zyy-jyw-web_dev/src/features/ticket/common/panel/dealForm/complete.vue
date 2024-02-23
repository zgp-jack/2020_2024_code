<template>
  <el-form
    ref="form"
    label-position="right"
    label-width="128px"
    size="mini"
    :disabled="disabled"
    :model="formData"
    :rules="rules"
  >
    <!--  屏蔽实际报修地址  -->
    <!--    <el-form-item
          label="实际报修地址"
        >
          <dic-select
            v-model="formData.actualRepairPlace"
            placeholder="请选择实际报修地址"
            dic-key="obs_repair_place"
          />
        </el-form-item>-->
    <el-form-item key="faultRemark" label="实际故障描述" prop="faultRemark">
      <el-input
        v-model="formData.faultRemark"
        placeholder="请输入实际故障描述"
        type="textarea"
        show-word-limit
        :rows="4"
        maxlength="1000"
      />
    </el-form-item>
    <el-form-item key="faultType" label="实际故障分类" prop="faultType">
      <fault-type-select
        v-model="formData.faultType"
        placeholder="请选择实际故障分类"
      />
    </el-form-item>
    <el-form-item label="解决方法" prop="makeWay">
      <el-input
        v-model="formData.makeWay"
        type="textarea"
        placeholder="请输入解决方法"
        :rows="4"
        show-word-limit
        maxlength="1000"
      />
    </el-form-item>

    <el-form-item label="实际工时" prop="realTime">
      <el-input
        v-model="formData.realTime"
        class="halfW"
        placeholder="请输入实际工时"
        @input="onInputRealTime"
      >
        <template slot="append">小时</template>
      </el-input>
    </el-form-item>
    <!--屏蔽资产-->
    <!--    <el-form-item label="资产名称">
      <el-input v-model="formData.equipment" placeholder="请输入资产名称" />
    </el-form-item>
    <el-form-item label="资产位置">
      <department-cascader v-model="formData.equipmentAddressId" placeholder="请选择资产位置" style="width: 100%" />
    </el-form-item>-->
    <el-form-item label="上传附件">
      <el-col :span="22" style="padding-left: 0px;">
        <upload v-model="formData.processEnclosure" />
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script>
// import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import TicketApi from '@/features/ticket/api';
import {
  limitNumberAfterPoint,
} from '@/common/utils/validator';
// import DepartmentCascader from '@/features/system/departmentManagement/components/deptCascader.vue';
// import KnowledgeBaseRetrievalApi from '@/feat/knowledgeBase/retrieval/api';
// import { Base64, } from 'js-base64';
// import moment from 'moment';
export default {
  name: 'Complete',
  components: {
    // DepartmentCascader,
    // DicSelect,
    FaultTypeSelect: () =>
      import('@/features/system/dataDictionary/components/faultTypeSelect.vue'),
    Upload: () => import('@/common/components/upload'),
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    faultInfo: {
      type: Object,
      default: () => ({}),
    },
    defaultData: {
      type: Object,
      default: () => ({}),
    },
    operatorType: {
      type: String,
      default: null,
    },
    requiredDealTime: {
      type: Boolean,
      default: false,
    },
    orderNum: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        // 实际报修地址
        actualRepairPlace: null,
        // 故障分类
        faultType: null,
        // 故障描述
        faultRemark: null,
        // 实际工时
        realTime: null,
        // 解决方法
        makeWay: null,
        // 附件
        processEnclosure: [],
        editor: '',
        // 资产名称
        equipment: '',
        // 资产位置
        equipmentAddressId: null,
        createTime: null,
      },
      rules: {
        faultType: [
          { required: true, message: '请选择故障分类', trigger: 'change', },
        ],
        faultRemark: [
          { required: true, message: '请输入故障描述', trigger: 'blur', },
        ],
        realTime: [
          {
            type: 'string', required: true, trigger: 'blur', validator: limitNumberAfterPoint('请输入实际耗时', 1),
          },
          { required: true, message: '不能为空', trigger: 'blur', },
        ],
      },
      htmlHashVal: {}, // 通过 # 选择的引用数据
      optionList: [],
    };
  },
  computed: {

  },
  watch: {
    faultInfo: {
      handler(val) {
        if (val) {
          this.formData = { ...val, };
        }
      },
      deep: true,
      immediate: true,
    },
    orderNum: {
      handler(val) {
        if (val) {
          this.initRealTime(val);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    // this.formData = Object.assign({}, this.formData, this.defaultData);
    // console.log(this.formData);
    // if (!this.formData.createTime) {
    //   this.formData.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
    // }
  },
  methods: {
    async querySearch() {
    },
    async isInputHashTrue(v, val) {
    },
    changeItem(list) {
    },
    onMouseenter(list) {
      list.isActive = true;
    },
    omMouseleave(list) {
      list.isActive = false;
    },
    async initRealTime(val) {
      const { makeTime, } = await TicketApi.orderTime(val);
      this.formData.realTime = parseInt(makeTime / 60 / 60);
      this.formData = { ...this.formData, };
    },
    async onSubmit(orderNum) {
      await this.$refs.form.validate();
      // this.formData.makeWay = Base64.encode(this.editor.txt.html());
      await TicketApi.complete({
        orderNum,
        ...this.formData,
        makeTime: this.formData.createTime,
      });
    },
    async fetchKnowledgeDetail(id) {
    },
    onInputRealTime(value) {
      this.formData.realTime = value.replace(/[^0-9.]/g, '');
    },
  },
};
</script>

<style lang="scss" scoped>
.halfW {
  width: 160px;
}
.w100 {
  width: 100%;
}
.special-item{
  position: absolute;
  right: 0px;
  top: -48px;
  width: 325px;

}
.date-picker {
  width: 100%;
  ::v-deep .el-input__inner {
    padding: 0 16px;
  }
}
</style>
