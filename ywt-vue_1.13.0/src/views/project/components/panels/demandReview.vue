<!-- 方案评审信息 -->

<template>
  <JYWPanel
    :key="'demandReview'"
    title="方案评审信息"
    :height="$attrs.height"
    :show-expand="$attrs.expand"
    p-k="demandReview"
    :expand="Expand"
    :disabled="Disabled"
    left-flag-title="评审人"
    :left-flag-value="panelInfo.injectUser | member"
    right-flag-title="评审时间"
    :right-flag-value="panelInfo.injectTime"
  >
    <el-form
      ref="form"
      :disabled="Disabled"
      label-width="120px"
      size="small"
      label-position="right"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="答辩结果">
            <el-radio-group
              v-model="formData.assessResult"
              @change="changeResult"
            >
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">不通过</el-radio>
              <el-radio :label="3">继续调研</el-radio>
              <el-radio :label="5">二次答辩</el-radio>
              <el-radio :label="4">转工单</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="DemandReview && DemandReview.id" :span="3">
          <el-form-item label-width="80px">
            <template #label>
              <el-popover
                placement="bottom-end"
                title=""
                width="456"
                trigger="click"
                @show="getLog"
              >
                <span slot="reference" class="update-history">
                  <i class="el-icon-time" />
                  记录
                </span>
                <template #default>
                  <div class="log-wrapper">

                    <el-timeline>
                      <el-timeline-item
                        v-for="(item, index) in logList"
                        :key="index"
                        placement="top"
                        :timestamp="`${item.createTime}  ${item.operatorName || ''}`"
                      >
                        <ul class="log-ul">
                          <template v-if="item.operationContent">
                            <li
                              v-for="(itemSub, subIndex) in JSON.parse(
                                item.operationContent
                              )"
                              :key="subIndex"
                              class="log-li"
                            >
                              <label>
                                {{ itemSub.field }}
                              </label>
                              <span v-if="itemSub.from" class="old">
                                <template v-if="itemSub.to">
                                  原:
                                </template>{{ itemSub.from }}
                              </span>
                              <span v-if="itemSub.to" class="new">
                                现:{{ itemSub.to }}
                              </span>
                            </li>
                          </template>
                        </ul>
                      </el-timeline-item>
                    </el-timeline>
                  </div>
                </template>
              </el-popover>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 通过 -->
    <el-form
      v-show="formData.assessResult === 1 || formData.assessResult === 5"
      :ref="formNameConfig[formData.assessResult-1].ref"
      :disabled="Disabled"
      :model="formDataPass"
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
            <DicSelect v-model="formDataPass.projectType" :dic-key="'projectType'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目优先级" prop="priority">
            <DicSelect v-model="formDataPass.priority" :dic-key="'itemPriority'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="项目级别" prop="projectLevel">
        <DicRadio
          v-model="formDataPass.projectLevel"
          :dic-key="'itemProjectLevel'"
        />
      </el-form-item>
      <!-- 项目级别 S 级   -->
      <!-- <template v-if="[1].includes(formDataPass.projectLevel) && [1,5].includes(formData.assessResult)">

      </template> -->

      <!--
       项目级别 M|L 级
     -->
      <div v-show="[2, 3].includes(formDataPass.projectLevel) && (formData.assessResult === 1 || formData.assessResult === 5)">
        <el-row>
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
        </el-row>
        <el-form-item label="其他参与人">
          <UserSelect v-model="formDataPass.otherRespondent" :multiple="true" />
        </el-form-item>
      </div>
      <el-form-item label="备注">
        <el-input v-model="formDataPass.remark" type="textarea" />
      </el-form-item>
      <el-form-item label="附件">
        <JYWUpload v-model="formData.enclosure" />
      </el-form-item>
    </el-form>

    <!-- 不通过 -->
    <el-form
      v-show="formData.assessResult === 2"
      :ref="formNameConfig[1].ref"
      :disabled="Disabled"
      :model="formDataNotPass"
      label-width="120px"
      :rules="rulesFormDataNotPass"
      size="small"
      label-position="right"
    >
      <el-form-item label-width="140px" label="不通过理由" prop="failReason">
        <el-input
          v-model="formDataNotPass.failReason"
          type="textarea"
          rows="5"
        />
      </el-form-item>
      <el-form-item label="附件">
        <JYWUpload v-model="formData.enclosure" />
      </el-form-item>
    </el-form>

    <!--  继续调研-->
    <el-form
      v-show="formData.assessResult === 3"
      :ref="formNameConfig[2].ref"
      :disabled="Disabled"
      :model="formDataNextInvestigate"
      label-width="120px"
      :rules="rulesFormDataNextInvestigate"
      size="small"
      label-position="right"
    >
      <el-form-item
        label-width="140px"
        label="继续调研理由"
        prop="continueReason"
      >
        <el-input
          v-model="formDataNextInvestigate.continueReason"
          type="textarea"
          rows="5"
        />
      </el-form-item>
      <el-form-item label="附件">
        <JYWUpload v-model="formData.enclosure" />
      </el-form-item>
    </el-form>

    <!-- 转工单 -->
    <WorkOrder v-if="formData.assessResult === 4" :ref="formNameConfig[3].ref" :order-data="orderData" :disabled="Disabled" @data="(v)=> formDataTransferOrder = v" />

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
import WorkOrder from './childComponents/researchInfo/order.vue';

export default {
  components: {
    UserSelect,
    DicSelect,
    DicRadio,
    WorkOrder,
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
      logList: [],
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
        }, {
          ref: 'formSecondaryDefense',
          formData: 'formDataSecondaryDefense',
          assessResult: 5,

        }
      ],
      rulesFormDataPass: {
        projectType: [{ trigger: 'change', message: '请选择项目类型', required: true, }],
        priority: [
          { trigger: 'change', message: '请选择项目优先级', required: true, }
        ],
        principal: [
          { trigger: 'change', message: '请选择项目负责人', required: true, }
        ],
        projectLevel: [
          { trigger: 'change', message: '请选择项目级别', required: true, }
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
      rulesFormDataNextInvestigate: {
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
          { trigger: 'blur', message: '请选择故障分类', required: true, }
        ],
        reqTime: [
          { trigger: 'blur', message: '请填写预计工时', required: true, }
        ],
        sendUser: [
          { trigger: 'change', message: '请选择指派人员', required: true, }
        ],
        deptId: [
          { trigger: 'blur', message: '请选择报修科室', required: true, }
        ],
        faultRemark: [
          { trigger: 'blur', message: '请填写故障描述', required: true, }
        ],
      },
      formDataPass: {
        // 项目负责人
        principal: '',
        // 项目类型
        projectType: 1,
        // 项目优先级
        priority: '',
        // 项目级别
        projectLevel: 1,
        // 业务答辩人
        businessRespondent: '',
        // 技术答辩人
        technicalRespondent: '',
        // 其他答辩人
        otherRespondent: '',
        //  备注
        remark: '',

      },
      formDataNotPass: {
        //  不通过原因
        failReason: '',
      },
      formDataNextInvestigate: {
        // 继续调研原因
        continueReason: '',
      },
      formDataTransferOrder: {},
      formData: {
        itemCode: '',
        // 评估结果，1-通过，2-不通过，3-继续调研，4-转工单
        assessResult: 1,
        // 附件
        enclosure: '',
      },
    };
  },
  computed: {
    FormNameConfigMap() {
      return _.keyBy(this.formNameConfig, 'assessResult');
    },
    ...mapState('project/index', {
      DemandReview: obj => {
        return obj.panelGroupData.demandReview;
      },
      DemandData: obj => {
        return obj.panelGroupData.demand;
      },
      DemandAssess: obj => {
        return obj.panelGroupData.demandAssess;
      },
      PreliminaryLevelData: (obj) => {
        return obj.panelGroupData.firstGrading;
      },
      ItemCode: obj => {
        return obj.itemCode;
      },
      Disabled: v => {
        return v['pancelDisabledOptions'].demandReview;
      },
      Expand: v => {
        return v['pancelExpandOptions'].demandReview;
      },
    }),
  },

  async mounted() {
    this.init();
  },
  methods: {

    init() {
      const initData = this.DemandReview || this.DemandAssess || this.PreliminaryLevelData;

      this.$set(this.panelInfo, 'injectUser', this.DemandReview?.createUser || '');
      this.$set(this.panelInfo, 'injectTime', this.DemandReview?.createTime || '');

      this.$set(this.formData, 'itemCode', initData?.itemCode || '');
      this.$set(this.formData, 'assessResult', initData?.result || 1);
      this.$set(this.formData, 'enclosure', initData?.enclosure || '');

      this.$set(this.formDataPass, 'principal', initData?.principal || '');
      this.$set(this.formDataPass, 'projectType', initData?.projectType || '');
      this.$set(this.formDataPass, 'priority', initData?.priority || '');
      this.$set(this.formDataPass, 'projectLevel', initData?.projectLevel || '');
      this.$set(this.formDataPass, 'businessRespondent', initData.businessRespondent);
      this.$set(this.formDataPass, 'technicalRespondent', initData.technicalRespondent);
      this.$set(this.formDataPass, 'otherRespondent', initData.otherRespondent);
      this.$set(this.formDataNotPass, 'failReason', initData.failReason);
      this.$set(this.formDataNextInvestigate, 'continueReason', initData.continueReason);
      this.orderData = {
        ...this.DemandData,
        enclosure: initData?.enclosure || '',
      };
    },

    changeResult() {
      const refName = this.FormNameConfigMap[this.formData.assessResult].ref;
      if (this.$refs[refName]?.clearValidate) {
        this.$nextTick(() => {
          this.$refs[refName].clearValidate();
        });
        // this.$refs[refName].clearValidate();
      } else {
        this.$refs[refName].$refs['form'].clearValidate();
      }
    },
    packageParams() {
      const params = {
        ...this.formData,
        ...this.formDataPass,
        ...this.formDataNotPass,
        ...this.formDataNextInvestigate,
        transferOrder: Object.values(this.formDataTransferOrder).length ? this.formDataTransferOrder : null,
      };
      return params;
    },
    async onSubmit() {
      return new Promise((resolve, reject) => {
        const refName = this.FormNameConfigMap[this.formData.assessResult].ref;
        let validate = null;
        if (this.formData.assessResult === 4) {
          validate = this.$refs[refName].$refs['form'].validate;
          this.$refs[refName].emitData();
        } else {
          validate = this.$refs[refName].validate;
        }
        validate(async valid => {
          if (valid) {
            try {
              console.log(this.packageParams(), 'this.packageParams()');
              await ProjectAPI.demand.submitDemandReview(this.packageParams());
              resolve();
              this.$message.success('提交成功!');
            } catch (error) {
              reject(error);
            }
          } else {
            reject('表单校验不通过!');
          }
        }
        );
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
    async getLog() {
      if (this.DemandReview?.id) {
        this.logList = await ProjectAPI.demand.getDemandReviewHistoryLog(
          this.ItemCode
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.update-history {
  color: #426ed7;
  cursor: pointer;
}
.log {
   &-wrapper{
     height: 400px;
     overflow: auto;
     padding-left: 8px;
     &::-webkit-scrollbar-thumb{
       background-color: #DEE2EE;
     }
     &::-webkit-scrollbar{
       width: 4px;
     }
   }
  &-ul,
  &-li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  &-li {
    &+&{
      margin-top: 24px;
    }
    label,
    span {
      font-weight: 400;
      font-size: 18px;
    }
    label {
      color: #426ED7;
    }
    >span {
      display: block;
      // color: #334266;
    }
    >.old{
      color:#7D8DB3
    }
    >.new{
      color:#334266
    }
  }
}
</style>
