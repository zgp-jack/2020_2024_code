<!--
   项目实施
-->
<template>
  <el-container class="impose-container">
    <el-header v-show="!isShowGenerateReport" height="auto">
      <ProcessPanel
        :key="'impose'"
        :active-button="defaultCode"
        active-panel-name="impose"
        :show-header="true"
        @click="changeProcess"
      >
        <el-row class="impose-header-row">
          <el-col v-show="!showGatt" :span="24">
            <el-form ref="form" size="mini" :model="form" label-width="0" :inline="true">
              <el-form-item>
                <el-input v-model="form.query" class="border" placeholder="项目名称/描述">
                  <i slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  v-model="form.time"
                  start-placeholder="完成时间"
                  end-placeholder="完成时间"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="daterange"
                />
              </el-form-item>
              <el-form-item>
                <DicSelect v-model="form.projectLevelStr" :type="'string'" :dic-key="'itemProjectLevel'" placeholder="项目级别" />
              </el-form-item>
              <el-form-item>
                <UserSelect v-model="form.principalStr" placeholder="负责人" :multiple="true" />
              </el-form-item>
              <el-form-item class="w-200">
                <GroupSelect v-model="form.teamId" class="condition" clearable filterable multiple collapse-tags placeholder="小组" />
              </el-form-item>
              <el-form-item class="w-200">
                <el-select
                  v-model="form.enforceState"
                  placeholder="状态"
                  clearable
                >
                  <el-option
                    v-for="(item,index) in statusList"
                    :key="index"
                    :value="item.value"
                    :label="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item style="float: right;">
                <pure-button label="查询" @click="onSearch" />
                <pure-button type="wire-frame-auto" label="重置" @click="onReset" />
                <pure-button :label="btnText" size="mini" @click="cutaway" />

              </el-form-item>

            </el-form>

          </el-col>

          <el-col v-show="showGatt" :span="22">
            <el-row v-show="showGatt" class="slider-wrapper">
              <el-col :span="1" :offset="19">
                <span class="font-span">
                  缩放:
                </span>
              </el-col>
              <el-col :span="4">
                <el-slider
                  v-model="sliderValue"
                  :max="5"
                  :format-tooltip="formatTooltip"
                />
              </el-col>
            </el-row>
          </el-col>
          <el-col v-show="showGatt" :span="2" class="t-r">
            <pure-button :label="btnText" size="mini" @click="cutaway" />
          </el-col>
        </el-row>
      </ProcessPanel>
    </el-header>
    <el-main v-show="!isShowGenerateReport" class="impose-main">
      <MainTable v-show="!showGatt" ref="main" :code="perocessCode " @setGenerateReport="setGenerateReport" />
      <GanttTable v-show="showGatt" ref="gantt" :code="perocessCode" />
    </el-main>
    <GenerateReport v-if="isShowGenerateReport" :component-list="componentList" :is-change-row="isChangeRow" @isShow="isShow" />
  </el-container>
</template>

<script>
import { mapActions, } from 'vuex';
import GenerateReport from './components/generateReport/index.vue';
import GanttTable from './components/ganttTable.vue';
import MainTable from './components/mainTable.vue';
import ProcessPanel from '@/views/project/components/navigationPanel/processPanel.vue';
import DicSelect from '@/feat/system/dictionary/normal/component/dicMultiSelect.vue';
import UserSelect from '@/views/project/components/userSelect/index';
import GroupSelect from '@/views/reportFault/query/component/groupSelect.vue';
import { statusList, } from './constants/index';

import _ from 'lodash';
export default {
  name: 'XmWdxm',
  components: {
    GenerateReport,
    GanttTable,
    MainTable,
    ProcessPanel,
    DicSelect,
    UserSelect,
    GroupSelect,
  },
  data() {
    return {
      btnText: '切换甘特图',
      showGatt: false,
      defaultCode: 'implStart',
      perocessCode: 'implStart',
      sliderValue: 0,
      isShowGenerateReport: false,
      componentList: [],
      isChangeRow: {},
      form: {
        time: [],
        // / 负责人
        principalStr: '',
        // / 项目级别
        projectLevelStr: null,
        // / 查询字段
        query: '',
        // / 项目完成时间开始
        realDateBegin: '',
        // / 项目完成时间结束
        realDateEnd: '',
        // / 小组
        teamId: '',
      },
      statusList,
    };
  },
  computed: {},
  watch: {
    sliderValue: {
      handler: _.debounce(function (newVal, oldVal) {
        this.$refs['gantt'].setScaleConfig(newVal);
      }, 300),
    },
  },
  activated() {
    this.DISPATCHT_GET_USER_LIST();
    this.$nextTick(() => {
      if (this.showGatt) {
        this.$refs['gantt'].getList(this.perocessCode);
      } else {
        // this.$refs['main'].getList(this.perocessCode);
      }
    });
  },
  mounted() {
    this.DISPATCHT_GET_USER_LIST();
  },

  methods: {

    onSearch() {
      const data = {
        ...this.form,
      };
      data.realDateBegin = data.time ? data.time[0] : '';
      data.realDateEnd = data.time ? data.time[1] : '';

      this.$refs.main.query(data);
    },
    onReset() {
      this.form = {
        time: [],
        // / 负责人
        principalStr: '',
        // / 项目级别
        projectLevelStr: '',
        // / 查询字段
        query: '',
        // / 项目完成时间开始
        realDateBegin: '',
        // / 项目完成时间结束
        realDateEnd: '',
        // / 小组
        teamId: '',
      };
      this.$refs.main.query(this.form);
    },
    setGenerateReport(row, checkList, isShow) {
      this.isChangeRow = row;
      this.isShowGenerateReport = isShow;
      this.componentList = checkList;
    },
    isShow(isShow) {
      this.isShowGenerateReport = isShow;
    },
    formatTooltip(val) {
      const config = {
        0: '天/无递增',
        1: '天/递增+2',
        2: '周',
        3: '月',
        4: '季度',
        5: '年',
      };
      return config[val];
    },
    ...mapActions('user/center', ['DISPATCHT_GET_USER_LIST']),

    changeProcess(code) {
      this.perocessCode = code;
      if (this.showGatt) {
        this.$refs['gantt'].setCode(code);
      } else {
        this.$refs['main'].getList(code);
      }
    },
    cutaway() {
      this.showGatt = !this.showGatt;
      this.btnText = this.showGatt ? '切换表格' : '切换甘特图';
      if (this.showGatt) {
        this.$refs['gantt'].setCode(this.perocessCode);
      } else {
        this.$refs['main'].getList(this.perocessCode);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
::v-deep .el-button + .el-button{
  margin-left: 10px !important;
}

.w{
  &-200{
    width: 200px;
  }
}
.t-r{
  text-align: right;
}
.impose {
  &-header {
    &-row {
      padding: 16px 16px;
    }
  }
  &-container {
    background: rgb(255, 255, 255);
  }

}
</style>
