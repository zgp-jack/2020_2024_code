<!-- 调研信息 -->
<template>
  <Panel
    :header-top="{
      title:'创建信息',
      text:`创建人:${panelInfo.injectUser}`
    }"
  >
    <el-form
      ref="form"
      :model="formData"
      label-width="120px"
      size="mini"
      label-position="right"
      disabled
    >
      <el-form-item label="调研负责人" required>
        <el-input v-model="formData.principal" />
      </el-form-item>
      <el-form-item label="调研成员">
        <el-input v-model="formData.users" />
      </el-form-item>
      <el-form-item required label="调研时间">
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
      <el-form-item required label="调研地点">
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
      <el-form-item label="调研工时">
        <el-col :span="7">
          <el-input v-model="formData.dayTime" :disabled="formData.dayMode ? true : false" />
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
              :active-value="1"
              :inactive-value="0"
              active-color="#3e4650"
              inactive-color="#3e4650"
              active-text="手动分配"
              inactive-text="平均分配"
            />
          </el-form-item>
        </el-col>

      </el-row>
      <el-table
        :data="tableData"
        border
        size="mini"
        :row-style="rowStyle"
        :header-row-style="headerRowStyle"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
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
      </el-table>
      <el-form-item required label="涉及系统">
        <DicSelect v-model="formData.aboutSystem" :multiple="true" :dic-key="'aboutSystem'" />
      </el-form-item>
      <el-form-item prop="purpose" label="需求目的">
        <el-input v-model="formData.purpose" type="textarea" rows="4" />
      </el-form-item>
      <p style="color: #2d405e; font-weight: 500">调研内容</p>
      <span class="content-span required">

        适用业务场景概述
      </span>
      <el-form-item prop="outline" label-width="0px">
        <el-input v-model="formData.outline" placeholder="组织结构、流程、角色、业务规则、主要业务特点" type="textarea" rows="4" />
      </el-form-item>
      <span class="content-span required">
        系统功能/相关系统
      </span>
      <el-form-item prop="functions" label-width="0px">
        <el-input v-model="formData.functions" placeholder="包括系统中功能模块的划分和模块功能定义; 系统间关系、接口" type="textarea" rows="4" />
      </el-form-item>
      <span class="content-span">
        其他要求
      </span>
      <el-form-item label-width="0px">
        <el-input v-model="formData.other" placeholder="系统环境、安全性、历史数据处理、现有资源情况" maxlength="255" type="textarea" rows="2" />
      </el-form-item>

      <el-form-item label="附件" label-width="60px">
        <File :data="formData.enclosure" />
      </el-form-item>
    </el-form>
  </Panel>

</template>

<script>

import { stringToArray, } from '@/utils/common';
import DicSelect from '@/views/project/components/select/selectDic';
import ElTableStyle from '@/views/bigScreen/style/table';
import Panel from '@/views/bigScreen/components/projectPanel/components/panel/index.vue';
import File from '@/views/bigScreen/components/projectPanel/components/file/index.vue';
import _ from 'lodash';
import { member, } from '@/filters';
export default {
  name: 'RearchInfo',
  components: {
    DicSelect,
    Panel,
    File,
  },
  mixins: [ElTableStyle],
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      changeRemainderTime: 0,
      test: '',
      formData: {
        itemCode: '',
        startTime: new Date(),
        place: '',
        endTime: '',
        aboutSystem: [],
        purpose: '',
        outline: '',
        functions: '',
        other: '',
        enclosure: JSON.stringify([]),
        principal: '',
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

      distributeColumn: [{
        w: '100px',
        label: '组员',
        prop: 'name',
      }, {
        w: '120px',
        label: '工时(天)',
        prop: 'time',
        formatter: (v) => {
          return this.$createElement('el-input', {
            props: {
              value: v['time'],
              size: 'mini',
              disabled: this.formData.dayMode === 0,
            },
            on: {
              input: (val) => {
                v['time'] = val.replace(/[^0-9.]/g, '');
              },
            },
          });
        },
      }, {
        w: 'auto',
        label: '备注',
        prop: 'desc', formatter: (v) => {
          return this.$createElement('el-input', {
            props: {
              value: v['desc'],
              size: 'mini',
            },
            on: {
              input: (val) => {
                v['desc'] = val;
              },
            },
          });
        },
      }],
    };
  },
  computed: {
    InvestigateData() {
      return this.data.investigate;
    },
    ResearchPerson() {
      return this.data.investUser;
    },
  },
  watch: {},

  mounted() {
    this.init();
    // this.initTableData();
  },
  methods: {

    init() {
      const data = this.InvestigateData;
      this.panelInfo.injectUser = member(data?.updateUser || '');
      this.panelInfo.injectTime = data.updateTime || '';

      this.formData = _.pick(data, Object.keys(this.formData));
      this.formData.aboutSystem = stringToArray(data.aboutSystem, ',',);
      this.tableData = data.dayDetail ? JSON.parse(data.dayDetail) : [];
      this.formData.endTime = data.endTime;
      this.formData.principal = this.ResearchPerson.principalName;
      this.formData.users = this.ResearchPerson.userNames;
      this.formData.startTime = data.startTime;
      this.formData.dayTime = this.formData.dayTime || '';
      this.formData.dayMode = this.formData.dayMode || 0;
    },

  },
};
</script>
<style lang='scss' scoped>
@import "~@/views/bigScreen/style/form.scss";

.content-span {
  font-size: 16px;
  color: #879bba;
  margin-bottom: 12px;
  display: block;

}
.required{
   &::before{
   content: "*";
    color: #ff4949;
    margin-right: 4px;
 }
}
.w-100 {
  width: 100%;
}
</style>
