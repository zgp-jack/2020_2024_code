<template>
  <pure-panel-card
    :disabled="disabled"
    :show-expand="showExpand"
    class="max-height"
    v-bind="$attrs"
  >
    <div slot="header">
      故障信息
    </div>
    <div slot="subHeader">
      <span
        v-if="formData.createUser"
        class="createUser"
      >建单人:
        <span>
          {{ formData.createUserName }}
        </span>
      </span>
      <span
        v-if="formData.createTime"
        class="createTime"
      >
        建单时间:
        <span>{{ formData.createTime }}</span>
      </span>
    </div>
    <el-form
      ref="form"
      :disabled="disabled"
      :model="formData"
      :rules="rules"
      label-position="right"
      label-width="122px"
      size="mini"
      style="padding-right: 10px;"
    >
      <el-form-item
        v-if="requiredCreateTime"
        label="创建时间"
        required
      >
        <el-date-picker
          v-model="formData.createTime"
          :clear-icon="'null'"
          :prefix-icon="'null'"
          align="right"
          class="date-picker"
          format="yyyy-MM-dd HH:mm"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
        />
      </el-form-item>
      <el-form-item
        label="故障描述"
        prop="faultRemark"
        class="fault-remark"
      >
        <el-input
          v-model="formData.faultRemark"
          :rows="5"
          maxlength="1000"
          placeholder=""
          show-word-limit
          type="textarea"
          @input="faultInput"
        />
        <div class="fault-remark-title" @click.stop="getRemark($event.target)">
          <span v-for="item in remarkList" :key="item.id" :data-faultType="item.faultType" :data-question="item.question" class="fault-remark-item">{{ item.title }}</span>
        </div>
      </el-form-item>
      <el-form-item
        label="故障分类"
        prop="faultType"
      >
        <fault-type-select
          v-model="formData.faultType"
          style="width: 100%"
          @change="onFaultTypeChange"
        />
      </el-form-item>
      <template v-if="createPattern !== 'warranty'">
        <el-form-item
          v-if="!disabled && operatorType !== 'EDIT'"
          label="指派人员"
        >
          <el-input
            ref="sendUserInput"
            v-model="selectedSendEngineer.name"
            :disabled="isDealBySelf"
            class="w-80"
            style="width: auto"
            @focus="handleOpenEngineerPanel"
          />
          <el-checkbox
            :value="isDealBySelf"
            class="ml-16"
            @change="handleDealByself"
          >由我处理
          </el-checkbox>
        </el-form-item>
        <div class="flex">

          <el-form-item label="工单来源">
            <dic-select
              v-model="formData.source"
              :disabled="operatorType === 'EDIT'"
              :disabled-list="disabledSourceList"
              class="w-80"
              dic-key="obs_fault_source"
              type="number"
              @change="onFaultSourceChanged"
            />
          </el-form-item>
          <!-- <el-form-item
            label="实际报修地址"
            label-width="120px"
          >
            <dic-select
              v-model="formData.actualRepairPlace"
              dic-key="obs_repair_place"
              type="number"
            />
          </el-form-item> -->
        </div>
      </template>
      <el-form-item label="备注" prop="remarks">
        <el-input
          v-model="formData.remarks"
          :rows="4"
          maxlength="1000"
          show-word-limit
          type="textarea"
        />
      </el-form-item>
      <template v-if="createPattern !== 'warranty'">
        <el-form-item label="是否为特殊工单">
          <el-radio-group v-model="formData.specialOrder">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <el-form-item label="紧急程度">
        <dic-radio
          v-model="formData.degree"
          dic-key="obs_fault_degree"
          type="number"
        />
      </el-form-item>
      <el-form-item label="影响范围">
        <dic-radio
          v-model="formData.rangeType"
          dic-key="obs_fault_range"
          type="number"
        />
      </el-form-item>
      <template v-if="createPattern !== 'warranty'">
        <el-form-item label="响应类型">
          <dic-radio
            v-model="formData.responseType"
            dic-key="obs_fault_response"
            type="number"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.responseType === 2"
          label="预约时间"
          prop="appointment"
        >
          <el-date-picker
            v-model="formData.appointment"
            :clear-icon="'null'"
            :prefix-icon="'null'"
            align="right"
            class="date-picker"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>
        <!-- <el-form-item
          label="预计工时"
          prop="reqTime"
        >
          <el-input
            v-model="formData.reqTime"
            placeholder=""
            style="width: 80%"
            @input="onInputReqTime"
          >
            <template slot="append">小时</template>
          </el-input>
        </el-form-item> -->
        <el-form-item label="期望完成时间">
          <dic-radio
            v-model="formData.completeType"
            dic-key="obs_complete_type"
            type="number"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.completeType == 4"
          label="完成时间"
          label-width="120px"
          prop="completeTime"
          :rules="[{ required: true, message: '请输入完成时间', trigger: 'change', },]"
        >
          <el-date-picker
            v-model="formData.completeTime"
            :clear-icon="'null'"
            :prefix-icon="'null'"
            align="right"
            class="date-picker"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            type="datetime"
          />
        </el-form-item>
        <!-- <el-form-item label="资产名称">
          <el-input v-model="formData.equipment " />
        </el-form-item>
        <el-form-item label="资产位置">
          <department-cascader v-model="formData.equipmentAddressId" style="width: 100%" />
        </el-form-item> -->
      </template>
      <el-form-item label="附件">
        <el-col :span="22">
          <upload v-model="formData.enclosure" />
        </el-col>
      </el-form-item>
    </el-form>
  </pure-panel-card>
</template>

<script>
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import DicRadio from '@/features/system/dataDictionary/components/dicRadio.vue';
import { omitBy, isNil, debounce, } from 'lodash-es';
import { mapGetters, } from 'vuex';
import { limitNumberAfterPoint, } from '@/common/utils/validator';
import EngineerPanel from '@/features/system/user/drawer/user.vue';
// import OtherSettingApi from '@/feat/system/otherSetting/api';
// import KnowledgeBaseRetrievalApi from '@/apis/knowledgeBase/retrieval/index';
// import DepartmentCascader from '@/features/system/departmentManagement/components/deptCascader.vue';

import {
  bus,
} from '@/common/utils/bus';
import WarrantyApi from '@/features/ticket/warranty/api';

export default {
  name: 'TicketFaultInfoPanel',
  components: {
    // DepartmentCascader,
    DicSelect,
    DicRadio,
    FaultTypeSelect: () =>
      import('@/features/system/dataDictionary/components/faultTypeSelect.vue'),
    Upload: () => import('@/common/components/upload'),
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
    createPattern: {
      type: String,
      default: '',
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
        degree: 3,
        // 影响范围
        rangeType: 1,
        // 响应类型
        responseType: 1,
        // 预约时间
        appointment: null,
        // 附件
        enclosure: [],
        // 知识库id
        learningId: null,
        // 资产名称
        equipment: '',
        // 资产位置
        equipmentAddressId: null,
        orderCreateTime: null,
        specialOrder: 0,
      },
      // 指派人员信息
      selectedSendEngineer: { name: null, engineerId: null, isTeam: false, teamId: null, },
      rules: {
        faultType: [
          { required: true, message: '请选择故障分类', trigger: 'change', },
        ],
        faultRemark: [
          { required: true, message: '请输入故障描述', trigger: 'blur', },
          { max: 1000, message: '故障描述长度不超过1000字符', trigger: 'blur', },
        ],
        remarks: [
          { max: 1000, message: '备注长度不超过1000字符', trigger: 'blur', },
        ],
        reqTime: [
          {
            trigger: 'blur',
            validator: limitNumberAfterPoint(undefined, 1),
          },
        ],
        completeTime: [
          {
            required: false,
            trigger: 'change',
            message: '请选择完成时间',
          },
        ],
        appointment: [
          {
            required: true,
            message: '请选择预约时间',
            trigger: 'change',
          },
        ],
      },
      requiredCreateTime: false,
      remarkList: [],
    };
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
    isDealBySelf: {
      get() {
        if (!this.selectedSendEngineer.engineerId) {
          return false;
        }
        if (
          !this.selectedSendEngineer.isTeam &&
          this.selectedSendEngineer.engineerId === this.userInfo.userId
        ) {
          return true;
        }
        return false;
      },
      set(val) {
        return val;
      },
    },
    disabledSourceList() {
      if (this.type === 'byManual') {
        return [
          1,
          4,
        ];
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
        if (val) {
          this.formData = Object.assign({}, this.formData, omitBy(val, isNil));

          if (!this.formData.createTime) {
            this.formData.createTime = this.$options.filters.timeFormat(new Date(), 'YYYY-MM-DD HH:mm');
          }
          if (!this.formData.createUser) {
            this.formData.createUser = this.userInfo?.userId;
            this.formData.createUserName = this.userInfo?.nickName;
          }
        } else {
          this.formData.createTime = this.$options.filters.timeFormat(new Date(), 'YYYY-MM-DD HH:mm');
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
  },
  async created() {
    // const { value: configValue, } = await OtherSettingApi.getTicketTimeConfig();
    const configValue = JSON.stringify({ createTime: 1, });
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
    getRemark(e) {
      this.formData.faultRemark = `问题描述：${e.innerText}\n症状：${e.dataset.question}`;
      this.formData.faultType = e.dataset.faulttype;
      this.remarkList = [];
    },
    faultInput: debounce(async function (val) {
      if (val) {
        const res = await WarrantyApi.getListByKeyword({ data: val, });
        this.remarkList = res?.slice(0, 5);
      }
    }, 300),
    // 重置 清空
    reset() {
      this.formData = {
        // 建单人
        createUser: this.userInfo?.userId,
        createUserName: this.userInfo?.nickName,
        // 建单时间
        createTime: this.$options.filters.timeFormat(new Date(), 'YYYY-MM-DD HH:mm'),
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
        degree: 3,
        // 影响范围
        rangeType: 1,
        // 响应类型
        responseType: 1,
        // 预约时间
        appointment: null,
        // 附件
        enclosure: [],
        // 知识库id
        learningId: null,
        // 资产名称
        equipment: '',
        // 资产位置
        equipmentAddressId: null,
        orderCreateTime: null,
      };
      this.selectedSendEngineer = {
        name: null,
        engineerId: null,
        isTeam: false,
        teamId: null,
      };
    },
    async handleOpenEngineerPanel() {
      this.$refs.sendUserInput.blur();
      this.$drawer({
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
      // this.formData.faultRemark && this.$confirm('替换故障分类将清空故障描述内容', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      // })
      //   .then(() => {
      //     this.$refs['Q'].clearHtml();
      //   })
      //   .catch(() => {
      //     this.formData.faultType = null;
      //   });
      // this.optionList = [];
      // this.formData.reqTime = '1';
    },
    async check() {
      // this.formData.faultRemark = this.$refs['Q'].convertBase64();
      await this.$refs['form'].validate();

      const data = {
        ...this.formData,
      };
      data.sendType = 2;
      if (this.selectedSendEngineer.isTeam) {
        data.sendObjId = this.selectedSendEngineer.teamId;
        data.sendObjType = 2;
      } else {
        data.sendObjId = this.selectedSendEngineer.engineerId;
        data.sendObjType = 2;
        data.sendTeam = this.selectedSendEngineer.teamId || null;
        if (data.sendUser === this.userInfo?.userId) {
          data.sendType = 1;
        }
      }
      if (data.createTime) {
        data.createTime = this.$options.filters.timeFormat(data.createTime, 'YYYY-MM-DD HH:mm');
      }
      if (data.completeTime) {
        data.completeTime = this.$options.filters.timeFormat(data.completeTime, 'YYYY-MM-DD HH:mm');
      }
      return data;
    },
    onInputReqTime(value) {
      this.formData.reqTime = value.replace(/[^0-9.]/g, '');
    },
    handleDealByself(val) {
      if (val) {
        this.formData.sendUser = this.userInfo.userId;
        this.selectedSendEngineer = Object.assign(
          {},
          {
            engineerId: this.userInfo.userId,
            name: this.userInfo.nickName,
            isTeam: false,
          },
        );
        this.formData.sendType = 1;
      } else {
        this.selectedSendEngineer = Object.assign({}, {});
        this.formData.sendUser = null;
        this.formData.sendType = 2;
      }
    },
    async querySearch(val) {
      // const { list, } = await KnowledgeBaseRetrievalApi.list({
      //   pageSize: 9999,
      //   type: this.formData.faultType,
      //   query: val,
      // });
      // list.length === 0 ? this.optionList = [{ title: '暂无数据...', id: new Date().getTime(), }, ] : this.optionList = list.slice(0, 6).map((item) => {
      //   item.isActive = false;
      //   return item;
      // });
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

<style lang='scss'
  scoped
>
.createUser,
.createTime {
  color: #879bba;

  span {
    font-weight: 400;
    color: #2d405e;
  }
}

.disabled {
  background: #f7f7f7;
}

.createUser {
  padding-right: 36px;
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
.fault-remark {
  position: relative;
  width: 100%;
}
.fault-remark-title {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  position: absolute;
  left: 12px;
  bottom: 5px;
  padding-right: 60px;
  z-index: 99999;
}
.fault-remark-item {
  display: inline-block;
  padding: 0 5px;
  margin-right: 5px;
  margin-bottom: 5px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #006666;
  border-radius: 14px;
  color: #006666;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
