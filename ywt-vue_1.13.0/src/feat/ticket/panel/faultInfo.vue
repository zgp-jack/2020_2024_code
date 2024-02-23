<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-24 17:08:11
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-26 17:30:34
 * @Description:故障信息面板
-->
<template>
  <pure-card class="max-height" :disabled="disabled" :show-expand="showExpand" v-bind="$attrs">
    <div slot="header">
      故障信息
      <span
        v-if="formData.createUser"
        class="createUser"
      >建单人:
        <span>
          {{ formData.createUser | staffId }}
        </span>
      </span>
    </div>
    <div slot="subHeader">
      <span v-if="formData.createTime" class="createTime">
        建单时间:
        <span>{{ formData.createTime }}</span>
      </span>
    </div>
    <el-form
      ref="form"
      :model="formData"
      label-position="right"
      label-width="102px"
      size="mini"
      :disabled="disabled"
      :rules="rules"
    >
      <el-form-item v-if="requiredCreateTime" label="创建时间" required>
        <el-date-picker
          v-model="formData.createTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          align="right"
          :prefix-icon="'null'"
          :clear-icon="'null'"
          class="date-picker"
        />
      </el-form-item>
      <div class="flex">

        <el-form-item label="来源">
          <dic-select
            v-model="formData.source"
            class="w-80"
            dic-key="faultSource"
            :disabled="operatorType === 'EDIT'"
            :disabled-list="disabledSourceList"
            @change="onFaultSourceChanged"
          />
        </el-form-item>
        <el-form-item label="实际报修地址" label-width="120px">
          <dic-select
            v-model="formData.actualRepairPlace"
            dic-key="sjbxdz"
          />
        </el-form-item>
      </div>
      <el-form-item v-if="!disabled && operatorType !== 'EDIT'" label="指派人员">
        <el-input
          ref="sendUserInput"
          v-model="selectedSendEngineer.name"
          style="width: auto"
          class="w-80"
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
          v-model="formData.faultType"
          style="width: 100%"
          @change="onFaultTypeChange"
        />
      </el-form-item>
      <el-form-item label="故障描述" prop="faultRemark">
        <Q-paste-up
          ref="Q"
          :data-dom="formData.faultRemark"
          :disabled-fun="setDisabledFun"
          :html-hash-val="htmlHashVal"
          placeholder="1.请先选择故障分类<br/>2.引用知识库请先输入#号，再选择所需知识库"
          @isInputHashTrue="isInputHashTrue"
        >
          <el-card shadow="always" class="card-box">
            <div
              v-for="list in optionList"
              :key="list.id"
              :style="{ background: list.isActive ? '#f5f7fa' : '#fff' }"
              class="card-item"
              :disabled="list.title === '暂无数据...'"
              @click="changeItem(list)"
              @mouseenter="onMouseenter(list)"
              @mouseleave="omMouseleave(list)"
            >
              {{ list.title }}
            </div>
          </el-card>
        </Q-paste-up>
      </el-form-item>

      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="12">
            <el-form-item label="预计工时" prop="reqTime">
              <el-input
                v-model="formData.reqTime"
                style="width: 80%"
                placeholder=""
                @input="onInputReqTime"
              />
              <span class="unit">小时</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期望完成时间" label-width="120px" prop="completeTime">
              <el-date-picker
                v-model="formData.completeTime"
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
        <dic-radio v-model="formData.degree" dic-key="gradeUrgency" type="string" />
      </el-form-item>
      <el-form-item label="影响范围">
        <dic-radio v-model="formData.rangeType" dic-key="faultScope" type="string" />
      </el-form-item>
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="13">
            <el-form-item label="响应类型">
              <dic-radio
                v-model="formData.responseType"
                dic-key="responseType"
                type="string"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="formData.responseType === '2'" :span="11">
            <el-form-item label="预约时间" label-width="95px" prop="appointment">
              <el-date-picker
                v-model="formData.appointment"
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
      <el-form-item label="资产名称">
        <el-input v-model="formData.equipment " />
      </el-form-item>
      <el-form-item label="资产位置">
        <department-cascader
          v-model="formData.equipmentAddressId "
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="附件">
        <el-col :span="22">
          <upload v-model="formData.enclosure" />
        </el-col>
      </el-form-item>
    </el-form>
  </pure-card>
</template>

<script>
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import DicRadio from '@/feat/system/dictionary/normal/component/dicRadio.vue';
import DepartmentCascader from '@/feat/system/department/component/departmentCascader.vue';
import { cloneDeep, omitBy, isNil, } from 'lodash';
import { mapActions, mapGetters, mapMutations, } from 'vuex';
import { limitNumberAfterPoint, } from '@/utils/validator';
import EngineerPanel from '@/views/components/engineer/engineerPanel.vue';
import OtherSettingApi from '@/feat/system/otherSetting/api';
import KnowledgeBaseRetrievalApi from '@/apis/knowledgeBase/retrieval/index';
import {
  bus,
} from '@/utils/bus';
import moment from 'moment';
export default {
  name: 'TicketFaultInfoPanel',
  components: {
    DicSelect,
    DicRadio,
    DepartmentCascader,
    FaultTypeSelect: () =>
      import('@/views/reportFault/sharedComponents/select/faultTypeSelect.vue'),
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
      default: 'byManual',
    },
    operatorType: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      optionList: [],
      htmlHashVal: {}, // 通过 # 选择的引用数据
      formData: {
        // 建单人
        createUser: null,
        // 建单时间
        createTime: null,
        // 来源
        source: this.type === 'byManual' ? 3 : 1,
        // 实际报修地址
        actualRepairPlace: '',
        // 故障分类
        faultType: null,
        // 故障描述
        faultRemark: null,
        // 预计工时
        reqTime: null,
        // 完成时间
        completeTime: null,
        // 紧急程度
        degree: '3',
        // 影响范围
        rangeType: '1',
        // 响应类型
        responseType: '1',
        // 预约时间
        appointment: null,
        // 附件
        enclosure: null,
        // 知识库id
        learningId: null,
        // 资产名称
        equipment: '',
        // 资产位置
        equipmentAddressId: null,
        orderCreateTime: null,
      },
      // 指派人员信息
      selectedSendEngineer: { name: null, engineerId: null, isTeam: false, teamId: null, },
      rules: {
        faultType: [{ required: true, message: '请选择故障分类', trigger: 'change', }],
        faultRemark: [{ required: true, message: '请输入故障描述', trigger: 'blur', }],
        reqTime: [
          {
            trigger: 'blur',
            validator: limitNumberAfterPoint(undefined, 1),
          }
        ],
        completeTime: [
          {
            required: false,
            trigger: 'change',
            message: '请选择完成时间',
          }
        ],
        appointment: [
          {
            required: true,
            message: '请选择预约时间',
            trigger: 'change',
          }
        ],
      },
      requiredCreateTime: false,
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapGetters('reportFault/mode', ['modeSendValue']),

    isDealBySelf: {
      get() {
        if (!this.selectedSendEngineer.engineerId) {
          return false;
        }
        if (
          !this.selectedSendEngineer.isTeam &&
        this.selectedSendEngineer.engineerId === this.userInfo.id
        ) {
          return true;
        }
        return false;
      },
      set(val) {
        return val;
      }, },
    disabledSourceList() {
      if (this.type === 'byManual') {
        return [1, 4];
      } else {
        return [];
      }
    },
    setDisabledFun() {
      if ((this.operatorType === 'EDIT' || this.operatorType === 'CREATE') && this.formData.faultType) {
        return 'enable';
      } else {
        return 'disable';
      }
    },
  },
  watch: {
    fault: {
      handler(val) {
        this.formData = Object.assign({}, this.formData, omitBy(val, isNil));
        if (!this.formData.createTime) {
          this.formData.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        }
      },
      deep: true,
      immediate: true,
    },
    'formData.faultType': {
      handler(val) {
        this.$refs['Q']?.clearHtml();
      },
      deep: true,
      immediate: true,
    },
    modeSendValue: {
      handler(val) {
        this.selectedSendEngineer = val;
      },
      deep: true,
    },

  },
  async created() {
    const { value: configValue, } = await OtherSettingApi.getTicketTimeConfig();
    this.GET_DISPATCH_MODE_DATA();
    try {
      const configValueObj = JSON.parse(configValue);
      if (configValueObj.createTime === 1) {
        this.requiredCreateTime = true;
      }
    } catch (error) {
      this.$message.error('获取工单时间配置出错');
    }
  },
  methods: {
    ...mapMutations('reportFault/mode', ['setFaultType']),
    ...mapActions('reportFault/mode', ['GET_MODE_TEAM_USER']),
    ...mapActions('systemOtherSetting/autoOrder', ['GET_DISPATCH_MODE_DATA']),
    async handleOpenEngineerPanel() {
      this.$refs.sendUserInput.blur();
      this.$innerDrawer({
        width: '548px',
        component: () => (
          <EngineerPanel
            onDone={this.onSelectEngineer}
            defaultSelectedData={this.selectedSendEngineer}
          />
        ),
      });
    },
    onSelectEngineer(data) {
      this.$refs.sendUserInput.blur();
      this.selectedSendEngineer = Object.assign({}, data);
      this.$refs.sendUserInput.blur();
    },
    onFaultTypeChange(newVal) {
      this.setFaultType(newVal);

      this.formData.faultRemark && this.$confirm('替换故障分类将清空故障描述内容', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$refs['Q'].clearHtml();
        })
        .catch(() => {
          this.formData.faultType = null;
        });
      this.optionList = [];
      this.formData.reqTime = '1';
    },
    async check() {
      this.formData.faultRemark = this.$refs['Q'].convertBase64();
      await this.$refs['form'].validate();

      const data = cloneDeep(this.formData);
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
      data.orderCreateTime = this.formData.createTime;
      return data;
    },
    onInputReqTime(value) {
      this.formData.reqTime = value.replace(/[^0-9.]/g, '');
    },
    handleDealByself(val) {
      if (val) {
        this.formData.sendUser = this.userInfo.id;
        this.selectedSendEngineer = Object.assign(
          {},
          {
            engineerId: this.userInfo.id,
            name: this.userInfo.name,
            isTeam: false,
          }
        );
        this.formData.sendType = 1;
      } else {
        this.selectedSendEngineer = Object.assign({}, {});
        this.formData.sendUser = null;
        this.formData.sendType = 2;
      }
    },
    async querySearch(val) {
      const { list, } = await KnowledgeBaseRetrievalApi.list({
        pageSize: 9999,
        type: this.formData.faultType,
        query: val,
      });
      list.length === 0 ? this.optionList = [{ title: '暂无数据...', id: new Date().getTime(), }] : this.optionList = list.slice(0, 6).map((item) => {
        item.isActive = false;
        return item;
      });
    },
    onMouseenter(list) {
      list.isActive = true;
    },
    omMouseleave(list) {
      list.isActive = false;
    },
    isInputHashTrue(v, val) {
      v ? this.querySearch(val) : (this.optionList = []);
    },
    changeItem(list) {
      this.formData.learningId = list.id;
      JSON.stringify(this.htmlHashVal) === '{}'
        ? (this.htmlHashVal = list)
        : this.$confirm('将使用选择内容替换故障描述', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.htmlHashVal = list;
          })
          .catch(() => {
            this.formData.learningId = null;
          });
      this.$refs['Q'].isSlotShow = false; // 隐藏引用选择框
    },
    onFaultSourceChanged(val) {
      // 个人工单，使用这种魔法数字，我也很无奈，后端数据一变就会歇菜
      if (val === 9) {
        this.isDealBySelf = true;
        this.handleDealByself(true);
        bus.$emit('selectPersonalTicket');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.createUser,
.createTime {
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
  ::v-deep .el-input__inner {
    padding: 0 16px;
  }
}
.form-item-wrapper {
  padding: 0;
  margin-bottom: 0;
  .el-col-11 {
    padding: 0;
  }
}
.card-box {
  z-index: 99999;
  position: absolute;
  top: 40px;
  width: calc(100% - 20px);
  margin-left: 10px;
  .card-item {
    cursor: pointer;
  }
}
</style>
