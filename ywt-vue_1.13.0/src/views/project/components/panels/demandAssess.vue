<!-- 需求评估 -->

<template>
  <JYWPanel
    :key="'demandAssess'"
    title="需求评估信息"
    :height="$attrs.height"
    :show-expand="$attrs.expand"
    p-k="demandAssess"
    :expand="Expand"
    :disabled="Disabled"
    left-flag-title="评估人"
    :left-flag-value="panelInfo.injectUser | member"
    right-flag-title="评估时间"
    :right-flag-value="panelInfo.injectTime"
  >
    <el-form
      ref="form"
      :disabled="Disabled"
      label-width="120px"
      size="small"
      label-position="right"
    >
      <el-form-item label="评估结果">
        <el-radio-group v-model="formData.assessResult" @change="changeResult">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="2">不通过</el-radio>
          <el-radio :label="3">继续调研</el-radio>
          <el-radio :label="4">转工单</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <!-- 通过 -->
    <el-form
      v-show="formData.assessResult === 1"
      :ref="formNameConfig[0].ref"
      :model="formDataPass"
      :disabled="Disabled"
      label-width="120px"
      :rules="rulesFormDataPass"
      size="small"
      label-position="right"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目负责人" prop="principal">
            <UserSelect v-model="formDataPass.principal" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目类型" prop="projectType">
            <DicSelect
              v-model="formDataPass.projectType"
              :dic-key="'projectType'"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目优先级" prop="priority">
            <DicSelect
              v-model="formDataPass.priority"
              :dic-key="'itemPriority'"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="项目级别" prop="projectLevel">
        <DicRadio
          v-model="formDataPass.projectLevel"
          :dic-key="'itemProjectLevel'"
        />
      </el-form-item>
      <!--
       项目级别 M|L 级
     -->
      <el-row
        v-show="
          [2, 3].includes(formDataPass.projectLevel) &&
            formData.assessResult === 1
        "
      >
        <el-col :span="12">
          <el-form-item label="业务答辩人" prop="businessRespondent">
            <UserSelect v-model="formDataPass.businessRespondent" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="技术答辩人">
            <UserSelect v-model="formDataPass.technicalRespondent" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="答辩时间" class="w-100">
            <el-date-picker v-model="formDataPass.replyTime" class="w-100" type="datetime" placeholder="答辩时间" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" />

          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="其他参与人">
            <UserSelect
              v-model="formDataPass.otherRespondent"
              :multiple="true"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="评估意见">
        <el-input v-model="formData.assessRemark" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
    <!-- </template> -->

    <!-- 不通过 -->
    <el-form
      v-show="formData.assessResult === 2"
      :ref="formNameConfig[1].ref"
      :model="formDataNotPass"
      :rules="rulesFormDataNotPass"
      :disabled="Disabled"
      label-width="140px"
      size="small"
      label-position="right"
    >
      <el-form-item label="不通过理由" prop="failReason">
        <el-input
          v-model="formDataNotPass.failReason"
          type="textarea"
          rows="5"
          :maxlength="2000"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="评估意见">
        <el-input v-model="formData.assessRemark" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
    <!--  继续调研-->
    <el-form
      v-show="formData.assessResult === 3"
      :ref="formNameConfig[2].ref"
      :model="formDataContinueReason"
      :rules="rulesFormDataContinueReason"
      :disabled="Disabled"
      label-width="140px"
      size="small"
      label-position="right"
    >
      <el-form-item
        label-width="140px"
        label="继续调研理由"
        prop="continueReason"
      >
        <el-input
          v-model="formDataContinueReason.continueReason"
          type="textarea"
          rows="5"
          :maxlength="2000"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="评估意见">
        <el-input v-model="formData.assessRemark" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>

    <!-- 转工单 -->
    <WorkOrder
      v-show="formData.assessResult === 4"
      :ref="formNameConfig[3].ref"
      :order-data="orderData"
      :disabled="Disabled"
      @data="(v)=> formDataTransferOrder = v"
    />

    <VoteList :item-code="ItemCode" />

  </JYWPanel>
</template>

<script>
import _ from 'lodash';
import UserSelect from '@/views/project/components/userSelect/index';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import DicRadio from '@/feat/system/dictionary/normal/component/dicRadio.vue';
import KnowledgeBaseRetrievalApi from '@/apis/knowledgeBase/retrieval/index';
import { mapState, } from 'vuex';
import ProjectAPI from '@/apis/project';
import VoteList from '@/views/project/components/panels/childComponents/voteList.vue';
import WorkOrder from './childComponents/researchInfo/order.vue';

export default {
  components: {
    UserSelect,
    DicSelect,
    DicRadio,
    WorkOrder,
    VoteList,
  },
  props: {
    where: {
      type: String,
      // 1评估 2评审
      default: '1',
    },
  },
  data() {
    return {
      orderData: {},

      panelInfo: {
        injectUser: '',
        injectTime: '',
      },
      formNameConfig: [
        {
          ref: 'formPass',
          formData: 'formDataPass',
          assessResult: 1,
        },
        {
          ref: 'formNotPass',
          formData: 'formDataNotPass',
          assessResult: 2,
        },
        {
          ref: 'formContinueReason',
          formData: 'formDataContinueReason',
          assessResult: 3,
        },
        {
          ref: 'formTransferOrder',
          formData: 'formDataTransferOrder',
          assessResult: 4,
        }
      ],
      rulesFormDataPass: {
        principal: [
          { trigger: 'change', message: '请选择项目负责人', required: true, }
        ],
        projectLevel: [
          { trigger: 'blur', message: '请选择项目级别', required: true, }
        ],
        priority: [
          { trigger: 'change', message: '请选择项目优先级', required: true, }
        ],
        projectType: [
          { trigger: 'change', message: '请选择项目类型', required: true, }
        ],

        businessRespondent: [
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              if ([2, 3].includes(this.formDataPass.projectLevel)) {
                if (value) {
                  callback();
                } else {
                  callback(new Error('请选择业务答辩人'));
                }
              } else {
                callback();
              }
            },
            required: true,
          }
        ],
      },
      rulesFormDataNotPass: {
        failReason: [
          { trigger: 'blur', message: '请填写不通过原因', required: true, }
        ],
      },
      rulesFormDataContinueReason: {
        continueReason: [
          { trigger: 'blur', message: '请填写继续调研原因', required: true, }
        ],
      },
      rulesFormDataTransferOrder: {
        user: [{ trigger: 'blur', message: '请填写报修人', required: true, }],
        phone: [
          { trigger: 'blur', message: '请填写报修人电话', required: true, }
        ],
        faultType: [
          { trigger: 'change', message: '请选择故障分类', required: true, }
        ],

        degree: [
          { trigger: 'change', message: '请选择紧急程度', required: true, }
        ],
        rangeType: [
          { trigger: 'change', message: '请选择影响范围', required: true, }
        ],

        reqTime: [
          { trigger: 'blur', message: '请填写预计工时', required: true, }
        ],
        sendUser: [
          { trigger: 'change', message: '请选择指派人员', required: true, }
        ],
        deptId: [
          { trigger: 'change', message: '请选择报修科室', required: true, }
        ],
        faultRemark: [
          { trigger: 'blur', message: '请填写故障描述', required: true, }
        ],
      },
      formDataPass: {
        // 项目负责人
        principal: '',
        // 项目优先级
        priority: '',
        // 项目级别
        projectLevel: 1,
        // 项目类型
        projectType: 1,
        // 业务答辩人
        businessRespondent: '',
        // 技术答辩人
        technicalRespondent: '',
        // 其他答辩人
        otherRespondent: '',
        // 答辩时间
        replyTime: '',
      },
      formDataNotPass: {
        //  不通过原因
        failReason: '',
      },
      formDataContinueReason: {
        // 继续调研原因
        continueReason: '',
      },
      formDataTransferOrder: {},
      formData: {
        itemCode: '',
        // 评估结果，1-通过，2-不通过，3-继续调研，4-转工单
        assessResult: 1,
        // 评估意见
        assessRemark: '',
      },

    };
  },
  computed: {
    ...mapState('project/index', {
      PreliminaryLevelData: obj => {
        return obj.panelGroupData?.firstGrading || null;
      },
      DemandAssess: obj => {
        return obj.panelGroupData?.demandAssess || null;
      },
      DemandData: obj => {
        return obj.panelGroupData?.demand || null;
      },
      ItemCode: obj => {
        return obj.itemCode;
      },
      Disabled: v => {
        return v['pancelDisabledOptions'].demandAssess;
      },
      Expand: v => {
        return v['pancelExpandOptions'].demandAssess;
      },
    }),
    FormNameConfigMap() {
      return _.keyBy(this.formNameConfig, 'assessResult');
    },
    BusinessRespondentRule() {
      if ([2, 3].includes(this.formDataPass.projectLevel)) {
        return {
          trigger: 'change',
          message: '请选择业务答辩人',
          required: true,
        };
      }
      return {};
    },

  },

  async mounted() {
    this.formData.itemCode = this.ItemCode;
    this.init();
  },
  methods: {

    init() {
      const data = this.DemandAssess || this.PreliminaryLevelData;
      this.$set(this.formData, 'itemCode', data?.itemCode);
      this.$set(this.formData, 'assessResult', data?.result || 1);
      this.$set(this.formData, 'assessRemark', data?.assessRemark || '');

      this.$set(this.formDataPass, 'principal', data?.principal || '');
      this.$set(this.formDataPass, 'projectType', data?.projectType);
      this.$set(this.formDataPass, 'priority', data?.priority || '');
      this.$set(this.formDataPass, 'projectLevel', data?.projectLevel || '');
      // this.$set(this.formDataPass, 'assessRemark', data?.assessRemark || '');

      // 使用v-if 会导致 用户不渲染 。出此下策，改变表单校验必填

      this.$set(this.formDataPass, 'businessRespondent', data?.businessRespondent || '');
      this.$set(this.formDataPass, 'technicalRespondent', data?.technicalRespondent || '');
      this.$set(this.formDataPass, 'otherRespondent', data?.otherRespondent || '');
      this.$set(this.formDataPass, 'replyTime', data?.replyTime || '');

      this.$set(this.formDataNotPass, 'failReason', data?.failReason || '');

      this.$set(this.formDataContinueReason, 'continueReason', data?.continueReason || '');
      // this.$set(this.formDataContinueReason, 'assessRemark', data?.assessRemark || '');

      this.$set(this.panelInfo, 'injectUser', data?.updateUser || '');
      this.$set(this.panelInfo, 'injectTime', data?.updateTime || '');

      // this.$set(this.formDataTransferOrder, 'user', this.DemandData.sponsor);
      // this.$set(this.formDataTransferOrder, 'phone', this.DemandData.phone);
      // this.$set(this.formDataTransferOrder, 'createTime', this.DemandData.createTime);
      // this.$set(this.formDataTransferOrder, 'deptId', this.DemandData.organizer || null);
      // this.$set(this.formDataTransferOrder, 'faultRemark', this.DemandData.title);
      this.orderData = this.DemandData;
    },
    changeResult() {
      const refName = this.FormNameConfigMap[this.formData.assessResult].ref;

      if (this.$refs[refName]?.clearValidate) {
        this.$refs[refName].clearValidate();
      } else {
        this.$refs[refName].$refs['form'].clearValidate();
      }
    },
    packageParams() {
      const params = {
        ...this.formData,
        ...this.formDataPass,
        ...this.formDataNotPass,
        ...this.formDataContinueReason,
        transferOrder: Object.values(this.formDataTransferOrder).length ? this.formDataTransferOrder : null,

      };
      return params;
    },
    onSave() {
      return new Promise((resolve, reject) => {
        const data = {
          ...this.packageParams(),
          closeValid: true,

        };
        Object.assign(data, { result: data.assessResult, type: 1, });
        try {
          ProjectAPI.demand.updateDemandAssess(data).then(() => {
            resolve();
          }).catch(err => {
            reject(err);
          });
        } catch (error) {
          reject(error);
        }
      });
    },
    onSubmit() {
      const refName = this.FormNameConfigMap[this.formData.assessResult].ref;
      let validate = null;
      if (this.formData.assessResult === 4) {
        validate = this.$refs[refName].$refs['form'].validate;
        this.$refs[refName].emitData();
      } else {
        validate = this.$refs[refName].validate;
      }
      return new Promise((resolve, reject) => {
        validate(async valid => {
          if (valid) {
            console.log(this.packageParams(), 'this.packageParams()');

            try {
              await ProjectAPI.demand.submitDemandAssess(this.packageParams());
              resolve();
              this.$message.success('提交成功!');
            } catch (error) {
              reject(error);
            }
          } else {
            reject('表单校验不通过!');
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
      // this.formData.learningId = item.id;
      this.$refs.form.clearValidate();
    },
  },
};
</script>

<style lang="scss" scoped>
.w-100{
  width: 100%;
}
</style>
