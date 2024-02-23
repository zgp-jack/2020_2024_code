<!--  -->
<template>
  <el-form
    ref="form"
    :model="formData"
    label-width="120px"
    size="mini"
    label-position="right"
    :rules="rules"
    :disabled="disabled"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="formData.orderCreateTime"
            :disabled="disabledOrderCreateTime"
            style="width: 100%"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-DD HH:mm:ss"
            format="yyyy-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="指派人员">
          <UserSelect v-model="formData.assignedPeople" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="报修科室" prop="department">
          <CascaderDepartment v-model="formData.department" style="width:100%" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="报修人" prop="repairPeople">
          <el-input v-model="formData.repairPeople" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="报修人电话" prop="repairPeoplePhone">
          <el-input v-model="formData.repairPeoplePhone" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="故障分类" prop="faultType">
      <FaultTypeSelect v-model="formData.faultType" style="width: 100%" />
    </el-form-item>

    <el-form-item label="故障描述" prop="faultMemo">
      <el-autocomplete
        v-model="formData.faultMemo"
        :debounce="1000"
        type="textarea"
        value-key="title"
        :rows="2"
        :fetch-suggestions="querySearch"
        style="width:calc(100% - 0px); text-align: left;margin-right:5px;"
        @select="onSelectSuggestionKnowledge"
      />
    </el-form-item>
    <el-row>

      <el-col :span="12">
        <el-form-item label="预计工时">
          <el-input
            v-model="formData.expectedTime"
          >
            <template slot="append">小时</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" :offset="0">

        <el-form-item label="报修时间">
          <el-date-picker
            v-model="formData.creatTime"
            style="width: 100%"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-DD"
            format="yyyy-MM-DD"
          />
        </el-form-item>
      </el-col>

    </el-row>

    <el-form-item label="紧急程度">
      <dic-radio v-model="formData.degree" dic-key="gradeUrgency" />
    </el-form-item>
    <el-form-item label="影响范围">
      <dic-radio v-model="formData.rangeType" dic-key="faultScope" />
    </el-form-item>
    <el-form-item label="响应类型">
      <dic-radio v-model="formData.responseType" dic-key="responseType" />
    </el-form-item>
    <el-form-item label="附件">
      <JYWUpload v-model="formData.enclosure" />
    </el-form-item>
  </el-form>
</template>

<script>
import OtherSettingApi from '@/feat/system/otherSetting/api';

import { mixins_base, } from '@/minxins/project';
import ProjectAPI from '@/apis/project';
import moment from 'moment';
import { arrayToString, } from '@/utils/common';
import KnowledgeBaseRetrievalApi from '@/apis/knowledgeBase/retrieval/index';
export default {
  name: 'Order',
  components: {
    FaultTypeSelect: () => import('@/views/reportFault/sharedComponents/select/faultTypeSelect.vue'),
    DicRadio: () => import('@/views/components/dictionary/dicRadio.vue'),

  },
  mixins: [mixins_base],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    orderData: {
      type: Object,
      default: () => ({}),
    },
    isVote: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      repairPeopleRequired: true,
      repairPeoplePhoneRequired: true,
      departmentRequired: true,
      disabledOrderCreateTime: false,
      formData: {
        orderCreateTime: new Date(),
        // 报修人
        repairPeople: '',
        // 报修人电话
        repairPeoplePhone: '',
        // 故障分类
        faultType: null,
        // 故障描述
        faultMemo: '',
        // 报修时间
        creatTime: '',
        // 指派人
        assignedPeople: '',
        // 报修科室
        department: null,
        // 预计工时
        expectedTime: '',
        // 项目优先级
        degree: 1,
        // 影响范围
        rangeType: 1,
        // 响应类型
        responseType: 1,
        // 附件
        enclosure: '',
      },

    };
  },
  computed: {
    rules() {
      return {
        repairPeople: [{
          required: this.repairPeopleRequired,
          message: '报修人不能为空',
          trigger: 'blur',
        }],
        repairPeoplePhone: [{
          required: this.repairPeoplePhoneRequired,
          trigger: 'blur',
          message: '电话不能为空',
        }],
        faultType: [{
          required: true,
          message: '请选择故障分类',
          trigger: 'change',
        }],
        department: [{
          required: this.departmentRequired,
          trigger: 'change',
          message: '请选择报修科室',
        }],
        faultMemo: [{
          required: true,
          trigger: 'blur',
          message: '请填写故障描述',
        }],
        creatTime: [{
          required: true,
          trigger: 'blur',
          message: '请选择报修时间',
        }],
        assignedPeople: [{
          required: true,
          trigger: 'change',
          message: '请选择指派人员',
        }],
        expectedTime: [{
          required: true,
          trigger: 'blur',
          type: 'number',
          message: '工时只能为数字',
          transform: (v) => Number(v),

        }, {
          trigger: 'blur',
          validator: (r, v, cb) => {
            if (parseFloat(v) <= 0 || v === '') {
              return cb(new Error('工时不能为空或者小于0'));
            }
            cb();
          },
        }],
      };
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.getOtherSettingConfig();
      if (Object.values(this.orderData).length) {
        this.$set(this.formData, 'repairPeople', this.orderData.sponsor);
        this.$set(this.formData, 'repairPeoplePhone', this.orderData.phone);
        this.$set(this.formData, 'creatTime', this.orderData.createTime);
        this.$set(this.formData, 'department', this.orderData.organizer || null);
        this.$set(this.formData, 'faultMemo', this.orderData.title);
        this.$set(this.formData, 'enclosure', this.orderData.enclosure);
      }
      if (Object.values(this.researchInfo).length) {
        this.formData.repairPeople = this.researchInfo.sponsor;
        this.formData.repairPeoplePhone = this.researchInfo.phone;
        this.formData.creatTime = this.researchInfo.startTime;
        this.formData.department = this.researchInfo.organizer || null;
        this.formData.faultMemo = this.researchInfo.title + this.researchInfo.remark || '';
      }
    });
  },
  methods: {
    async getOtherSettingConfig() {
      const res = await OtherSettingApi.groupListAllByTopType({ type: 'reportFault', });
      const getWorkTimeConfig = await OtherSettingApi.getWorkTimeConfig();
      const { createTime, } = JSON.parse(getWorkTimeConfig.value);
      this.disabledOrderCreateTime = Boolean(Number(createTime));
      const { repair_phone, repair_user, repair_dept, } = res.mandatory;
      this.repairPeopleRequired = repair_user.enable;
      this.repairPeoplePhoneRequired = repair_phone.enable;
      this.departmentRequired = repair_dept.enable;
    },
    emitData() {
      const submitArguments = {
        user: this.formData.repairPeople,
        phone: this.formData.repairPeoplePhone,
        createTime: moment(this.formData.creatTime).format('YYYY-MM-DD'),
        deptId: this.formData.department,
        faultRemark: this.formData.faultMemo,
        sendUser: this.formData.assignedPeople,
        reqTime: this.formData.expectedTime,
        faultType: arrayToString(this.formData.faultType),
        degree: this.formData.degree,
        learningId: this.formData.learningId,
        rangeType: this.formData.rangeType,
      };
      this.$emit('data', submitArguments);
    },
    submit() {
      if (this.isVote === false) {
        return this.$message.error('投票中，无法提交');
      }
      return new Promise((r, j) => {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const submitArguments = {
              itemCode: this.itemCode,
              user: this.formData.repairPeople,
              phone: this.formData.repairPeoplePhone,
              creatTime: moment(this.formData.creatTime).format('YYYY-MM-DD'),
              deptId: this.formData.department,
              faultRemark: this.formData.faultMemo,
              sendUser: this.formData.assignedPeople,
              reqTime: this.formData.expectedTime,
              faultType: arrayToString(this.formData.faultType),
              degree: this.formData.degree,
              learningId: this.formData.learningId,
              rangeType: this.formData.rangeType,
            };
            try {
              await ProjectAPI.demand.submitReview(submitArguments, 'order');
              this.$message.success('提交成功');
              r(true);
            } catch (e) {
              this.$message.error(e);
              j(e);
            }
          } else {
            j('表单校验未通过');
          }
        });
      });
    },
    async querySearch(queryString, cb) {
      const { list, } = await KnowledgeBaseRetrievalApi.list({
        query: queryString,
        pageSize: 9999,
      });
      cb(list);
    },
    onSelectSuggestionKnowledge(item) {
      this.formData.faultRemark = item.faultMemo;
      this.formData.learningId = item.id;
      this.$refs.form.clearValidate();
    },
  },
};
</script>
<style lang='scss' scoped>
.w-100 {
  width: 100%;
}
</style>
