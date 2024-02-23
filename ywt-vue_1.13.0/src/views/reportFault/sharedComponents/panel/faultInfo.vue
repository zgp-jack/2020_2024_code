<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-07 11:11:55
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-18 18:46:04
 * @Description: 故障面板
-->
<template>
  <pure-card class="max-height" :disabled="disabled" :show-expand="showExpand">
    <div slot="header">故障信息
      <span class="createUser">建单人:
        <span>
          {{ faultData.createUser | staffId }}
        </span>
      </span>
    </div>
    <div slot="subHeader">
      <span
        v-if="faultData.createTime"
        class="createTime"
      >
        建单时间:
        <span>{{ faultData.createTime }}</span>
      </span></div>
    <el-form
      ref="form"
      :model="faultData"
      label-position="right"
      label-width="102px"
      size="mini"
      :disabled="disabled"
      :rules="rules"
    >
      <el-form-item label="来源">
        <!-- <source-radio v-model="faultData.source" :type="type" /> -->
        <dic-select v-model="faultData.source" dic-key="faultSource" :disabled-list="disabledSourceList" />
      </el-form-item>
      <el-form-item v-if="!disabled" label="指派人员">
        <el-input
          ref="sendUserInput"
          v-model="selectedSendEngineer.name"
          style="width: auto"
          :disabled="isDealBySelf"
          @focus="handleOpenEngineerPanel"
        />
        <el-checkbox
          class="ml-16"
          :value="isDealBySelf"
          @change="handleDealByself"
        >由我处理</el-checkbox>
      </el-form-item>
      <el-form-item label="故障分类" prop="faultType">
        <fault-type-select
          v-model="faultData.faultType"
          style="width: 100%"
          @change="handleFaultTypeChange"
        />
      </el-form-item>
      <el-form-item label="故障描述" prop="faultRemark">
        <el-autocomplete
          v-model="faultData.faultRemark"
          :debounce="1000"
          type="textarea"
          value-key="title"
          :rows="2"
          :fetch-suggestions="querySearch"
          style="width:calc(100% - 0px); text-align: left;margin-right:5px;"
          @select="onSelectSuggestionKnowledge"
        />
        <!-- <pure-button label="引用" type="ghost" @click="onRefKnowledge" /> -->
      </el-form-item>
      <el-form-item label="详细说明">
        <el-input v-model="faultData.detailInfo" type="textarea" :rows="4" />
      </el-form-item>

      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="12">
            <el-form-item label="预计工时" prop="reqTime">
              <el-input
                v-model="faultData.reqTime"
                style="width: 80%"
                placeholder=""
                @input="handleReqTimeInput"
              />
              小时
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成时间" label-width="95px" prop="completeTime">
              <el-date-picker
                v-model="faultData.completeTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                align="right"
                :prefix-icon="'null'"
                :clear-icon="'null'"
                class="date-picker"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="紧急程度">
        <degree-radio v-model="faultData.degree" />
      </el-form-item>
      <el-form-item label="影响范围">
        <range-radio v-model="faultData.rangeType" />
      </el-form-item>
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="13">
            <el-form-item label="响应类型">
              <response-radio v-model="faultData.responseType" />
            </el-form-item>
          </el-col>
          <el-col v-if="faultData.responseType === '2'" :span="11">
            <el-form-item label="预约时间" label-width="95px" prop="appointment">
              <el-date-picker
                v-model="faultData.appointment"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                align="right"
                :prefix-icon="'null'"
                :clear-icon="'null'"
                class="date-picker"
              />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form-item>
      <el-form-item label="附件">
        <el-col :span="22">
          <upload v-model="faultData.enclosure" />
        </el-col>
      </el-form-item>

    </el-form>
  </pure-card>
</template>

<script>
import {
  cloneDeep,
  // isNumber,
} from 'lodash';
import {
  mapGetters,
} from 'vuex';
import {
  limitNumberAfterPoint,
} from '@/utils/validator';
import EngineerPanel from '@/views/components/engineer/engineerPanel.vue';
import KnowledgeBaseRetrievalApi from '@/apis/knowledgeBase/retrieval/index';
export default {
  components: {
    DicSelect: () => import('@/views/components/dictionary/dicSelect.vue'),
    DegreeRadio: () => import('../radio/degreeRadio.vue'),
    RangeRadio: () => import('../radio/rangeRadio.vue'),
    FaultTypeSelect: () => import('../select/faultTypeSelect.vue'),
    ResponseRadio: () => import('../radio/responseRadio.vue'),
    Upload: () => import('@/components/upload'),
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    fault: {
      type: Object,
      default: function () {
        return {};
      },
    },
    showExpand: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      faultData: {
        reqTime: null,
        completeTime: null,
        faultRemark: null,
      },
      // 指派人员信息
      selectedSendEngineer: { name: null,
        engineerId: null,
        isTeam: false,
        teamId: null,
      },
      rules: {
        faultType: [
          { required: true, message: '请选择故障分类', trigger: 'change', }
        ],
        faultRemark: [
          { required: true, message: '请输入故障描述', trigger: 'blur', }
        ],
        reqTime: [
          {
            type: 'string', required: true, trigger: 'blur', validator: limitNumberAfterPoint('请输入预计耗时', 1),
          }
        ],
        completeTime: [{
          required: false, trigger: 'change', message: '请选择完成时间',
        }],
        appointment: [
          {
            required: true, message: '请选择预约时间', trigger: 'change',
          }
        ],
      },
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    isDealBySelf() {
      if (!this.selectedSendEngineer.engineerId) {
        return false;
      }
      if (!this.selectedSendEngineer.isTeam && this.selectedSendEngineer.engineerId === this.userInfo.id) {
        return true;
      }
      return false;
    },
    disabledSourceList() {
      if (this.type === 'normal') {
        return [1, 4];
      } else {
        return [];
      }
    },
  },
  async created() {
    this.faultData = Object.assign({}, this.faultData, this.fault);
    // if (isNumber(this.faultData.reqTime)) {
    //   // this.faultData.reqTime = this.faultData.reqTime / 60;

    // }
  },
  methods: {
    async handleOpenEngineerPanel() {
      this.$refs.sendUserInput.blur();
      this.$innerDrawer({
        width: '548px',
        component: () => <EngineerPanel onDone={this.handleSelectedEngineer} defaultSelectedData={this.selectedSendEngineer}/>,
      });
    },
    handleSelectedEngineer(data) {
      this.$refs.sendUserInput.blur();
      this.selectedSendEngineer = Object.assign({}, data);
      this.$refs.sendUserInput.blur();
    },
    handleFaultTypeChange(newVal) {
      this.faultData.reqTime = '1';
    },
    onRefKnowledge() {},
    async check() {
      await this.$refs['form'].validate();
      const data = cloneDeep(this.faultData);
      data.sendType = 2;
      if (this.selectedSendEngineer.isTeam) {
        data.sendTeam = this.selectedSendEngineer.teamId;
      } else {
        data.sendUser = this.selectedSendEngineer.engineerId;
        data.sendTeam = this.selectedSendEngineer.teamId;
        if (data.sendUser === this.userInfo.id) {
          data.sendType = 1;
        }
      }
      return data;
    },
    handleReqTimeInput(value) {
      this.faultData.reqTime = value.replace(/[^0-9.]/g, '');
    },
    handleDealByself(val) {
      if (val) {
        this.faultData.sendUser = this.userInfo.id;
        this.selectedSendEngineer = Object.assign({}, {
          engineerId: this.userInfo.id,
          name: this.userInfo.name,
          isTeam: false,
        });
        this.faultData.sendType = 1;
      } else {
        this.selectedSendEngineer = Object.assign({}, {
        });
        this.faultData.sendType = 2;
      }
    },
    onSelectSuggestionKnowledge(item) {
      this.faultData.detailInfo = item.question;
      this.faultData.faultRemark = item.title;
      this.faultData.learningId = item.id;
    },
    async querySearch(queryString, cb) {
      const { list, } = await KnowledgeBaseRetrievalApi.list({
        query: queryString,
        pageSize: 9999,
      });
      cb(list);
    },
  },
};
</script>

<style lang="scss" scoped>
  .createUser,.createTime {
     color: #879bba;
        font-size: $--pure-little-font-size;
        span {
            font-weight: 400;
            color: #2d405e;
        }
  }
  .disabled {
    background: #f7f7f7;
  }
  .createUser {
    padding-left: 36px;
  }
  .ml-16 {
    margin-left: 16px;
  }
  .date-picker {
    width: 100%;
   ::v-deep .el-input__inner{
     padding:0 16px;
   }
  }
   .form-item-wrapper {
        padding: 0;
        margin-bottom: 0;
        .el-col-11 {
        padding:0;
    }
    }
</style>
