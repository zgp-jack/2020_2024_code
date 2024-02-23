<!-- 调研信息 -->
<template>
  <JYWPanel
    :key="'researchInfo'"
    title="调研信息"
    :height="$attrs.height"
    left-flag-title="处理人"
    :left-flag-value="panelInfo.injectUser | member"
    right-flag-title="处理时间"
    :right-flag-value="panelInfo.injectTime"
    :disabled="disabled"
    :show-expand="$attrs.expand"
    :expand="expand"
    p-k="researchInfo"
  >
    <el-form
      ref="form"
      :model="formData"
      label-width="120px"
      size="mini"
      label-position="right"
      :rules="rules"
      :disabled="disabled"
    >
      <el-form-item label="调研负责人" prop="principal">
        <el-select
          v-model="formData.principal"
          :filterable="true"
          placeholder="请选择"
          disabled
        >
          <el-option
            v-for="item in personList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="调研成员">
        <UserSelect
          v-model="formData.users"
          :disabled-value="formData.principal"
          multiple
          :clearable="false"
          @change="changeUsers"
        />
      </el-form-item>
      <el-form-item prop="startTime" label="调研时间">
        <el-date-picker
          v-model="formData.startTime"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd  "
          value-format="yyyy-MM-dd"
          class="w-100"
          :editable="false"
          popper-class="customDatePicker"
        />
      </el-form-item>
      <el-form-item prop="place" label="调研地点">
        <el-input v-model="formData.place" />
      </el-form-item>
      <el-form-item label="期望完成日期">
        <el-date-picker
          v-model="formData.endTime"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd  "
          value-format="yyyy-MM-dd "
          class="w-100"
          :editable="false"
          popper-class="customDatePicker"
        />
      </el-form-item>
      <!-- <el-form-item label="调研工时">
        <el-col :span="7">
          <el-input
            v-model="formData.dayTime"
            :disabled="formData.dayMode ? true : false"
            @input="inputDayTime"
          />
        </el-col>
        <el-col :span="2" style="text-align:right">
          天
        </el-col>
      </el-form-item>

      <el-row>
        <el-col :span="24">
          <el-form-item label="工时分配方式">
            <el-switch
              v-model="formData.dayMode"
              :disabled="formData.users.length === 1"
              :active-value="1"
              :inactive-value="0"
              active-color="#1890ff"
              inactive-color="#ff4949"
              active-text="手动分配"
              inactive-text="平均分配"
              @change="changeSwitch"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        border
        size="mini"
        :cell-style="tableStyle.cellStyle"
        style="margin-bottom:10px"
      >
        <el-table-column
          v-for="(v, i) in distributeColumn"
          :key="i"
          :width="v.w"
          :min-width="v.w"
          :label="v.label"
          :prop="v.prop"
          :formatter="v.formatter"
          align="left"
        />
      </el-table> -->
      <el-row>
        <el-col :span="24">
          <el-form-item prop="aboutSystem" label="涉及系统">
            <DicMultipleSelect
              v-model="formData.aboutSystem"
              class="w-100"
              placeholder="请选择涉及系统"
              multiple
              dic-key="aboutSystem"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="purpose" label="需求目的">
        <el-input v-model="formData.purpose" type="textarea" rows="4" :maxlength="2000" show-word-limit />
      </el-form-item>
      <p style="color: #2d405e; font-weight: 500">调研内容</p>
      <span class="content-span">
        业务描述
      </span>
      <el-form-item prop="outline" label-width="0px">
        <el-input
          v-model="formData.outline"
          placeholder="业务场景、当前痛点"
          type="textarea"
          rows="4"
        />
      </el-form-item>
      <span class="content-span">
        解决方案设计
      </span>
      <el-form-item label-width="0px">
        <el-input
          v-model="formData.functions"
          type="textarea"
          rows="4"
        />
      </el-form-item>
      <span class="content-span">
        后续行动计划
      </span>
      <el-form-item label-width="0px">
        <el-input
          v-model="formData.followUpActionPlan"
          type="textarea"
          rows="4"
        />
      </el-form-item>
      <span class="content-span">
        其他要求
      </span>
      <el-form-item label-width="0px">
        <el-input
          v-model="formData.other"
          placeholder="系统环境、安全性、历史数据处理、现有资源情况"
          maxlength="255"
          type="textarea"
          rows="2"
        />
      </el-form-item>

      <el-form-item label="附件" label-width="60px">
        <JYWUpload v-model="formData.enclosure" />
      </el-form-item>
    </el-form>
  </JYWPanel>
</template>

<script>
import moment from 'moment';
import { stringToArray, } from '@/utils/common';
import {
  mixins_base,
  mixins_researchInfo,
} from '@/minxins/project';
import _ from 'lodash';
import ProjectAPI from '@/apis/project';
import { member, } from '@/filters';
import tableStyle from '../../style/table';
import DicMultipleSelect from '@/feat/system/dictionary/normal/component/dicMultiSelect.vue';

export default {
  name: 'RearchInfo',
  components: {
    DicMultipleSelect,
  },
  mixins: [mixins_base, mixins_researchInfo],
  data() {
    return {
      tableStyle,
      changeRemainderTime: 0,
      formData: {
        itemCode: '',
        startTime: new Date(),
        place: '',
        endTime: '',
        aboutSystem: '',
        purpose: '',
        outline: '',
        functions: '',
        other: '',
        enclosure: JSON.stringify([]),
        principal: '',
        followUpActionPlan: '',
        users: '',
        dayTime: '',
        dayMode: 0,
        dayDetail: JSON.stringify([]),
      },
      userArgument: [],
      panelInfo: {
        injectUser: '',
        injectTime: '',
      },
      tableData: [],

      distributeColumn: [
        {
          w: '100px',
          label: '组员',
          prop: 'name',
        },
        {
          w: '120px',
          label: '工时（天）',
          prop: 'time',
          formatter: v => {
            return this.$createElement('el-input', {
              props: {
                value: v['time'],
                size: 'mini',
                disabled: this.formData.dayMode === 0,
              },
              on: {
                input: val => {
                  v['time'] = val.replace(/[^0-9.]/g, '');
                },
              },
            });
          },
        },
        {
          w: 'auto',
          label: '备注',
          prop: 'desc',
          formatter: v => {
            return this.$createElement('el-input', {
              props: {
                value: v['desc'],
                size: 'mini',
              },
              on: {
                input: val => {
                  v['desc'] = val;
                },
              },
            });
          },
        }
      ],
      rules: {
        principal: [
          {
            required: true,
            message: '请选择负责人',
            trigger: 'blur',
          },
          {
            trigger: 'change',
            type: 'number',
          }
        ],
        startTime: [{
          required: true,
          trigger: 'blur',
          message: '开始时间不能为空',
        }],
        place: [{
          required: true,
          type: 'string',
          trigger: 'blur',
          message: '请填写调研地点',
        }],
        aboutSystem: [{
          required: true,
          trigger: 'change',
          message: '请选择涉及系统',

        }],
        purpose: [{
          required: true,
          type: 'string',
          trigger: 'blur',
          message: '请填写需求目的',
        }],
      },
    };
  },
  computed: {
    // 表格中输入的总工时
    inputCount() {
      if (this.tableData instanceof Array) {
        const Times = this.tableData.map(e => Number(e.time) || 0);
        const countTime = _.reduce(
          Times,
          function (sum, n) {
            return sum + n;
          },
          0
        );
        return _.floor(countTime, 2);
      }
      return 0;
    },
  },
  watch: {
    tableData: {
      handler: function (n, o) {
        if (this.formData.dayMode === 1) {
          this.formData.dayTime = this.inputCount;
        }
      },
      deep: true,
    },
  },

  mounted() {
    this.getInfo();
    if (!this.disabled) {
      this.SET_INJECT_EVENT({ name: 'confirm', fun: this.submit, });
      this.SET_INJECT_EVENT({ name: 'save', fun: this.submit, });
    }
    this.initTableData();
  },
  methods: {
    changeUsers() {
      this.computedTableData();
    },
    inputDayTime(v) {
      if (this.formData.dayMode === 0) {
        if (v || Number(v) > -1) {
          this.computedTableData();
        }
      }
    },
    /**
     * 分配时间 初始化
     */
    initTableData() {
      if (!this.formData.dayTime) {
        const users = stringToArray(this.formData.users);
        this.tableData = users.map(e => {
          return {
            name: member(e),
            id: e,
            time: 0,
            desc: '',
          };
        });
      }
    },
    changeSwitch(val) {
      this.formData.dayTime = 0;
      const users = stringToArray(this.formData.users);

      this.tableData = users.map(e => {
        return {
          name: member(e),
          id: e,
          time: 0,
          desc: '',
        };
      });
    },

    /**
     * 计算平均分配
     */
    computedTableData() {
      const users = stringToArray(this.formData.users);
      const tableDataMap = _.keyBy(this.tableData, 'id');
      this.tableData = users.map(e => {
        return {
          name: member(e),
          id: e,
          time: _.floor(this.formData.dayTime / users.length, 2),
          desc: tableDataMap[e] ? tableDataMap[e].desc : '',
        };
      });
    },
    async getInfo() {
      const self = this;
      if (
        self.getterPanelGroupData.investigate &&
        Object.values(self.getterPanelGroupData.investigate).length
      ) {
        const data = self.getterPanelGroupData.investigate;
        self.panelInfo.injectUser = data.updateUser || '';
        self.panelInfo.injectTime = data.updateTime || '';
        const d = Object.values(data).length ? data : self.formData;
        self.formData = _.pick(d, Object.keys(self.formData));
        self.formData.users = data.users;
      } else {
        self.formData.users = self.researchInfo.users;
      }

      self.tableData = self.formData.dayDetail
        ? JSON.parse(self.formData.dayDetail)
        : [];
      self.formData.endTime =
        self.formData.endTime || self.researchInfo.endTime || '';
      self.formData.principal = self.researchInfo.principal * 1;
      self.formData.startTime = self.formData.startTime || new Date();
      self.formData.dayTime = self.formData.dayTime || '';
      self.formData.dayMode = self.formData.dayMode || 0;
    },
    submit(v) {
      const data = JSON.parse(JSON.stringify(this.formData));
      return new Promise((r, j) => {
        this.$refs['form'].validate(valid => {
          if (valid) {
            data.itemCode = this.itemCode;
            data.startTime = moment(data.startTime).format('YYYY-MM-DD hh:mm');
            data.dayDetail = JSON.stringify(this.tableData);

            if (data.endTime) {
              data.endTime = moment(data.endTime).format('YYYY-MM-DD hh:mm');
            }
            const rs = ProjectAPI.demand.confirmOrSaveRearchInfo(v, data);
            this.$message['success'](
              v === 'confirm' ? '提交成功' : '保存成功' + '!'
            );

            // this.$refs['form'].resetFields();
            r(rs);
          } else {
            j('表单校验未通过');
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.content-span {
  font-size: 16px;
  color: #879bba;
  margin-bottom: 12px;
  display: block;
}
.required {
  &::before {
    content: "*";
    color: #ff4949;
    margin-right: 4px;
  }
}
.w-100 {
  width: 100%;
}
</style>
