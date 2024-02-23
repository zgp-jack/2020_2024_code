<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-08 11:18:37
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 16:02:06
 * @Description: 处理信息
-->
<template>
  <pure-card class="max-height" :disabled="disabled">
    <div slot="header">
      处理信息
      <span
        v-if="dealEngineerId"
        class="makeUser"
      >处理人:
        <span>{{ dealEngineerId | staffId }}</span>
      </span>
    </div>
    <div slot="subHeader">
      <span v-if="makeData.responseTime" class="responseTime">
        响应耗时：
        <span>{{ makeData.responseTime | formatSeconds }}</span>
      </span>
      <span v-if="makeData.makeTime" class="makeTime">
        处理耗时：
        <span>{{ makeData.makeTime | formatSeconds }}</span>
      </span>
      <span v-if="makeData.makeTime + makeData.responseTime" class="totalTime">
        总耗时：
        <span>{{ (makeData.makeTime + makeData.responseTime) | formatSeconds }}</span>
      </span>
    </div>
    <el-form
      ref="form"
      label-position="right"
      label-width="128px"
      size="mini"
      :disabled="disabled"
      :model="makeData"
      :rules="rules"
    >
      <el-form-item label="处理状态">
        <el-select
          v-model="makeData.makeType"
          clearable
          class="halfW"
          @change="clear"
        >
          <el-option
            v-for="(item, index) in operateList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 完成      -->
      <template v-if="makeData.makeType === 3">
        <el-form-item key="faultType" label="故障分类" prop="faultType">
          <fault-type-select
            v-model="makeData.faultType"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item key="faultRemark" label="故障描述" prop="faultRemark">
          <el-input
            v-model="makeData.faultRemark"
            type="textarea"
            :rows="2"
          />
          <!-- <el-button
            style="margin-left: 5px; background: #d7e5f9; color: #409eff;"
          >引用</el-button> -->
        </el-form-item>

        <el-form-item label="实际工时" prop="realTime">
          <el-input
            v-model="makeData.realTime"
            class="halfW"
            @input="handleRealTimeInput"
          />
          小时
        </el-form-item>
        <el-form-item label="解决方法" prop="makeWay">
          <el-input
            v-model="makeData.makeWay"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        <!-- <el-form-item label="存入知识库">
          <el-radio-group v-model="makeData.isLocal">
            <el-radio :label="0">不存入</el-radio>
            <el-radio :label="1">存入</el-radio>
          </el-radio-group>
        </el-form-item> -->

        <el-form-item label="附件">
          <el-col :span="22">
            <upload v-model="makeData.processEnclosure" />
          </el-col>
        </el-form-item>
      </template>
      <!-- 处理      -->
      <template v-if="makeData.makeType === 4">
        <el-form-item label="处理过程">
          <el-input
            v-model="makeData.remark"
            type="textarea"
            :rows="4"
          />
        </el-form-item>

        <el-form-item label="附件">
          <el-col :span="22">
            <upload v-model="makeData.processEnclosure" />
          </el-col>
        </el-form-item>
      </template>
      <!-- 暂停 -->
      <template v-if="makeData.makeType === 2">
        <el-form-item label="暂停原因" style="margin-bottom: 0">
          <suspend-reason-radio v-model="makeData.processValue" />
        </el-form-item>
        <el-form-item label="详细说明">
          <el-input
            v-model="makeData.remark"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        <el-form-item label="附件">
          <el-col :span="22">
            <upload v-model="makeData.processEnclosure" />
          </el-col>
        </el-form-item>
      </template>
      <!-- 转交 -->
      <template v-if="makeData.makeType === 7">
        <el-form-item label="原处理人:">
          <span style="color: #879bba">{{
            convertTransHistor(makeData.makeHisUserToName)
          }}</span>
        </el-form-item>
        <el-form-item label="转交至">
          <el-input
            ref="sendUserInput"
            v-model="selectedSendEngineer.name"
            style="width: auto"
            @focus="handleOpenEngineerPanel"
          />
        </el-form-item>
        <el-form-item label="转交原因" style="margin-bottom: 0">

          <trans-reason-radio v-model="makeData.processValue" />
        </el-form-item>
        <el-form-item label="详细说明">
          <el-input
            v-model="makeData.remark"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </template>
      <!-- 多人协作 -->
      <template v-if="makeData.makeType === 30">
        <template v-for="(k, index) in makeData.assist">
          <el-form-item :key="index" label-width="0px" class="form-item-wrapper">
            <el-col :span="9">
              <el-form-item
                :ref="index+'user'"
                label="协作人"
                label-width="80px"
                :prop="'assist.'+index+'.name'"
                :rules="{ required: true, message: '请选择协作人', trigger: 'blur' }"
              >
                <!-- <el-input v-model="k.user" /> -->
                <el-input
                  :ref="'sendUserInput'+index"
                  v-model="k.name"
                  style="width: auto"
                  @focus="handleOpenAssistEngineerPanel(index)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="协作事务"
                label-width="100px"
                :prop="'assist.'+index+'.content'"
                :rules="[{ required: true, message: '请输入协作事务' }]"
              >
                <el-input v-model="k.content" />

              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button
                v-if="index!==0"
                style="margin-left:16px"
                @click="handleDeleteAssist(index)"
              >删除</el-button>
            </el-col>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button
            @click="handleAddAssist()"
          >添加协作</el-button>
        </el-form-item>
      </template>
      <!-- 终止工单 -->
      <template v-if="makeData.makeType === 6">
        <el-form-item label="终止原因" style="margin-bottom: 0">
          <terminate-reason-radio v-model="makeData.processValue" />
        </el-form-item>
        <el-form-item label="详细说明">
          <el-input
            v-model="makeData.remark"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </template>
      <!-- 退回服务台 -->
      <template v-if="makeData.makeType === 5">
        <el-form-item label="退回原因">
          <send-back-reason-radio v-model="makeData.processValue" />
        </el-form-item>
        <el-form-item label="详细说明">
          <el-input
            v-model="makeData.remark"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </template>
      <!-- 存入知识库 -->
      <!-- <template v-if="state === 4">
        <el-form-item label="问题描述">
          <el-input type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="知识分类">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="临时科室权限" style="margin-bottom: 0">
          <el-radio-group>
            <el-radio :label="1">不可查看</el-radio>
            <el-radio :label="2">可以查看</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="症状">
          <el-input type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="解决办法">
          <el-input type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="附件">
          <el-col :span="22">
            <el-upload
              class="upload-demo"
              action="api/busLocalFile/upload"
              multiple
              :limit="3"
              :headers="{ token: '9DCC506615952E9361F2914E1C8F5348' }"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </el-col>
        </el-form-item>
      </template> -->
      <!-- 工单升级 -->
      <template v-if="makeData.makeType === 31">

        <el-form-item label="需求标题" prop="title">
          <el-input v-model="makeData.title" />
        </el-form-item>
        <el-form-item label="需求描述">
          <el-input v-model="makeData.remark" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label-width="0px" class="form-item-wrapper">
          <el-row>
            <el-col :span="12">
              <el-form-item label="紧急程度" prop="level">
                <level-select v-model="makeData.level" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="提出科室" prop="organizer">
                <department-cascader v-model="makeData.organizer" class="w100" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label-width="0px" class="form-item-wrapper">
          <el-row>
            <el-col :span="12">
              <el-form-item label="提出人" prop="sponsor">
                <el-input
                  ref="sponsorInput"
                  v-model="selectedSponsor.name"
                  @focus="onFocusSponsorInput"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="phone">
                <el-input v-model="makeData.phone" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label-width="0px" class="form-item-wrapper">
          <el-row>
            <el-col :span="12">
              <el-form-item label="提出日期" prop="startTime">
                <el-date-picker
                  v-model="makeData.startTime"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="datetime"
                  align="right"
                  :prefix-icon="'null'"
                  :clear-icon="'null'"
                  class="date-picker"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="期望完成日期">
                <el-date-picker
                  v-model="makeData.endTime"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
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

        <el-form-item label-width="0px" class="form-item-wrapper">
          <el-form-item label="涉及系统" prop="aboutSystem">
            <about-system-select v-model="makeData.aboutSystem" class="w100" />
          </el-form-item>
        </el-form-item>
        <el-form-item label="附件">
          <el-col :span="22">
            <upload v-model="makeData.enclosure" />
          </el-col>
        </el-form-item>
      </template>
      <!-- 转为特殊工单 -->
      <!-- <template v-if="state === 10">
        <el-form-item label="任务标题" required="">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="任务描述" required="">
          <el-input type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="问题类型" required="">
          <el-select class="halfW"></el-select>
        </el-form-item>
        <el-form-item label-width="0px" class="no-mb">
          <el-col :span="12">
            <el-form-item label="汇报提交至" required="">
              <el-input class="halfW"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参与人">
              <el-input class="halfW"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="计划日期">
          <el-date-picker
            type="datetime"
            align="left"
            :prefix-icon="'null'"
            :clear-icon="'null'"
            class="halfW"
          ></el-date-picker>
        </el-form-item>
        <el-form-item required label="提出日期">
          <el-date-picker
            type="datetime"
            align="left"
            :prefix-icon="'null'"
            :clear-icon="'null'"
            class="halfW"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="任务权重" required="">
          <el-input-number size="mini" class="halfW"></el-input-number>
        </el-form-item>
        <el-form-item label="附件">
          <el-col :span="22">
            <el-upload
              class="upload-demo"
              action="api/busLocalFile/upload"
              multiple
              :limit="3"
              :headers="{ token: '9DCC506615952E9361F2914E1C8F5348' }"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </el-col>
        </el-form-item>
      </template> -->
      <!-- 送修 -->
      <!-- <template v-if="state === 20">
        <el-form-item label-width="0px" class="no-mb">
          <el-col :span="12">
            <el-form-item label="设备名称" required="">
              <el-input class="halfW"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备编号    ">
              <el-input class="halfW"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label-width="0px" class="no-mb">
          <el-col :span="12">
            <el-form-item label="设备分类">
              <el-select class="halfW"></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备型号">
              <el-input class="halfW"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label-width="0px" class="no-mb">
          <el-col :span="12">
            <el-form-item label="设备序列号" required="">
              <el-input class="halfW"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备数据">
              <el-select class="halfW">
                <el-option label="重要已备份" :value="1"></el-option>
                <el-option label="重要未备份" :value="2"></el-option>
                <el-option label="不重要" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="设备信息备注">
          <el-input style="width: 101%"></el-input>
        </el-form-item>
        <el-form-item label-width="0px" class="no-mb">
          <el-col :span="12">
            <el-form-item label="科室名称" required="">
              <el-input class="halfW"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="科室联系人" required="">
              <el-select class="halfW"> </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label-width="0px" class="no-mb">
          <el-col :span="12">
            <el-form-item label="联系电话" required="">
              <el-input class="halfW"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="科室地址" required="">
              <el-select class="halfW"> </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item required label="送修时间">
          <el-date-picker
            type="datetime"
            align="left"
            :prefix-icon="'null'"
            :clear-icon="'null'"
            class="halfW"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="送修方式" class="no-mb">
          <el-radio-group>
            <el-radio :label="1">科室送修</el-radio>
            <el-radio :label="2">工程师送修</el-radio>
            <el-radio :label="3">科室维修</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="第三方公司" required="">
          <el-select style="width: 100%"></el-select>
        </el-form-item>
        <el-form-item label="故障描述" required="">
          <el-input type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="附件">
          <el-col :span="22">
            <el-upload
              class="upload-demo"
              action="api/busLocalFile/upload"
              multiple
              :limit="3"
              :headers="{ token: '9DCC506615952E9361F2914E1C8F5348' }"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </el-col>
        </el-form-item>
      </template> -->
    </el-form>
  </pure-card>
</template>

<script>
import { staffId, } from '@/filters';
import {
  cloneDeep,
  isNumber,
} from 'lodash';
import {
  limitNumberAfterPoint,
} from '@/utils/validator';
import NewEngineerPanel from '@/views/components/engineer/engineerPanel.vue';
import EngineerPanel from '@/views/sharedComponents/engineer/engineerPanel.vue';
import EngineerPanelSingle from '@/views/components/engineer/engineerPanel.vue';
import {
  mapGetters,
} from 'vuex';
export default {
  components: {
    FaultTypeSelect: () => import('../select/faultTypeSelect'),
    Upload: () => import('@/components/upload'),
    SuspendReasonRadio: () => import('../radio/suspendReasonRadio'),
    TransReasonRadio: () => import('../radio/transReasonRadio.vue'),
    TerminateReasonRadio: () => import('../radio/terminateReasonRadio.vue'),
    SendBackReasonRadio: () => import('../radio/sendBackReasonRadio.vue'),
    DepartmentCascader: () => import('@/feat/system/department/component/departmentCascader.vue'),
    LevelSelect: () => import('@/views/project/components/select/levelSelect.vue'),
    AboutSystemSelect: () => import('@/views/project/components/select/aboutSystemSelect.vue'),
  },
  props: {
    // 控制面板可选择状态
    disabled: {
      type: Boolean,
      default: false,
    },
    // 当前处理操作
    currentProcessState: {
      type: Number,
      default: 1,
    },
    make: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      selfId: this.$store.state.login.userInfo.id,
      // 指派人信息
      selectedSendEngineer: { name: null,
        id: null,
      },
      selectedSponsor: {
        name: null,
        engineerId: null,
      },
      // 当前操作的协作索引
      currentAssistIndex: 0,
      // 可操作列表
      operateList: [
        {
          label: '完成',
          value: 3,
        },
        {
          label: '暂停处理',
          value: 2,
        },
        {
          label: '终止工单',
          value: 6,
        },
        {
          label: '转交',
          value: 7,
        },
        {
          label: '退回',
          value: 5,
        },
        {
          label: '处理',
          value: 4,
        }, {
          label: '工单升级',
          value: 31,
        }, {
          label: '多人协作',
          value: 30,
        }
      ],
      // 操作信息
      makeData: {
        faultType: null,
        faultRemark: null,
        realTime: null,
        sponsor: null,
        assist: [{ user: '', content: '', name: null, engineerId: null, isTeam: false, teamId: null, }],
      },
      rules: {
        faultType: [
          { required: true, message: '请选择故障分类', trigger: 'change', }
        ],
        faultRemark: [
          { required: true, message: '请输入故障描述', trigger: 'blur', }
        ],
        realTime: [
          {
            type: 'string', required: true, trigger: 'blur', validator: limitNumberAfterPoint('请输入实际耗时', 1),
          }
        ],
        title: [{
          required: true, message: '请输入需求标题', trigger: 'blur',
        }],
        organizer: [{
          required: true, message: '请选择提出科室', trigger: 'change',
        }],
        sponsor: [{
          required: true, message: '请选择提出人', trigger: 'change',
        }],
        phone: [{
          required: true, message: '请输入联系电话', trigger: 'blur',
        }, {
          pattern: /^((0\d{2,3}-?\d{7,8})|(1[3465789]\d{9}))$/, message: '非有效手机或座机号', trigger: 'blur',
        }],
        level: [{
          required: true, message: '请选择紧急程度', trigger: 'change',
        }],
        startTime: [{
          required: true, message: '请选择提出日期', trigger: 'change',
        }],
        aboutSystem: [{
          required: true, message: '请选择涉及系统', trigger: 'change',
        }],
      },
    };
  },
  computed: {
    dealEngineerId() {
      return this.make.makeUser;
    },
    ...mapGetters(['userInfo']),
    // 是否是协作工单
    isAssist() {
      return this.makeData?.orderNum.includes('#');
    },
  },
  mounted() {
    this.makeData = Object.assign({}, this.makeData, this.make);
    if (isNumber(this.makeData.realTime)) {
      this.makeData.realTime = (this.makeData.realTime / 60).toString();
    }
    this.filterOperateList(this.makeData.makeType);
  },
  methods: {
    async handleOpenAssistEngineerPanel(index) {
      this.$refs['sendUserInput' + index][0].blur();
      this.currentAssistIndex = index;
      const defaultSelectedData = this.makeData.assist[index];
      console.log(defaultSelectedData);
      this.$innerDrawer({
        width: '688px',
        component: () => <EngineerPanelSingle onDone={this.handleAssistSelectedEngineer} defaultSelectedData={defaultSelectedData} disabledEngineer={[this.userInfo.id]}/>,
      });
    },
    async handleAssistSelectedEngineer(data) {
      this.$refs['sendUserInput' + this.currentAssistIndex][0].blur();
      this.makeData.assist[this.currentAssistIndex] = Object.assign(this.makeData.assist[this.currentAssistIndex], data);
      this.$refs.form.validate();
    },
    async handleOpenEngineerPanel() {
      this.$refs.sendUserInput.blur();
      this.$innerDrawer({
        width: '688px',
        component: () => <EngineerPanel onDone={this.handleSelectedEngineer} defaultSelectedData={this.selectedSendEngineer}/>,
      });
    },
    handleSelectedEngineer(data) {
      this.$refs.sendUserInput.blur();
      this.selectedSendEngineer = Object.assign({}, data);
      this.$refs.sendUserInput.blur();
    },
    handleRealTimeInput(value) {
      this.makeData.realTime = value.replace(/[^0-9.]/g, '');
    },
    clear() {
      this.makeData.remark = null;
      this.makeData.makeWay = null;
      this.$refs.form.clearValidate();
    },
    convertTransHistor(val) {
      if (!val) {
        return staffId(this.selfId);
      } else {
        return val
          .split(',')
          .join('>');
      }
    },
    handleDeleteAssist(index) {
      this.makeData.assist.splice(index, 1);
    },
    handleAddAssist() {
      this.makeData.assist.push({
        user: '', content: '', name: null, engineerId: null, isTeam: false, teamId: null,
      });
    },
    async onFocusSponsorInput() {
      this.$refs.sponsorInput.blur();
      this.$innerDrawer({
        width: '688px',
        component: () => <NewEngineerPanel onDone={this.onSelectedSponsor} defaultSelectedData={this.selectedSponor} teamDisabled={true}/>,
      });
    },
    onSelectedSponsor(data) {
      this.$refs.sponsorInput.blur();
      this.selectedSponsor = Object.assign({}, data);
      this.makeData.sponsor = this.selectedSponsor.engineerId;
      this.$refs.sponsorInput.blur();
    },
    // 筛选可选按钮
    filterOperateList(operateType) {
      console.log(operateType);
      switch (operateType) {
        // 点击终止按钮
        case 6:
          this.operateList = [
            {
              label: '终止工单',
              value: 6,
            }
          ];
          break;
        // 点击暂停按钮
        case 2:
          this.operateList = [
            {
              label: '暂停工单',
              value: 2,
            }
          ];
          break;
        // 点击退回按钮
        case 5:
          this.operateList = [
            {
              label: '退回',
              value: 5,
            }
          ];
          break;
        // 处理按钮筛选
        case 4:
          if (this.isAssist) {
            this.operateList = [
              {
                label: '完成',
                value: 3,
              },
              {
                label: '处理',
                value: 4,
              },
              {
                label: '暂停',
                value: 2,
              },
              {
                label: '转交',
                value: 7,
              },
              {
                label: '退回',
                value: 5,
              }
            ];
          } else {
            this.operateList = [
              {
                label: '完成',
                value: 3,
              },
              {
                label: '处理',
                value: 4,
              },
              {
                label: '暂停',
                value: 2,
              },
              {
                label: '转交',
                value: 7,
              },
              {
                label: '终止',
                value: 6,
              },
              {
                label: '退回',
                value: 5,
              }, {
                label: '工单升级',
                value: 31,
              }, {
                label: '多人协作',
                value: 30,
              }
            ];
          }

          break;
      }
      console.log(`筛选了按钮${operateType}`, this.operateList);
    },
    // 表单验证
    async check() {
      await this.$refs['form'].validate();
      if (this.makeData.makeType === 7) {
        if (!this.selectedSendEngineer.id) {
          throw new Error('请选择转交人');
        }
        if (this.selectedSendEngineer.isTeam) {
          this.makeData.sendTeam = this.selectedSendEngineer.id?.split('-')[1];
        } else {
          this.makeData.sendUser = this.selectedSendEngineer.id?.split('-')[2];
        }
      }

      return cloneDeep(this.makeData);
    },
    updatePanel() {
      this.filterOperateList(this.makeData.makeType);
    },
  },
};
</script>

<style lang="scss" scoped>
.makeUser,.responseTime,.makeTime,.totalTime {
     color: #879bba;
        font-size: $--pure-little-font-size;
        span {
            font-weight: 400;
            color: #2d405e;
        }
  }
.makeUser{
    padding-left: 36px;
  }
  .responseTime,.makeTime {
      padding-right:38px;
  }
.halfW {
  width: 160px;
}
.w100 {
  width: 100%;
}
.form-item-wrapper {
  padding: 0;
  margin-bottom: 0;
  .el-col-12 {
    padding:0;
  }
}
.date-picker {
  width: 100%;
  ::v-deep .el-input__inner{
    padding:0 16px;
  }
}
</style>
