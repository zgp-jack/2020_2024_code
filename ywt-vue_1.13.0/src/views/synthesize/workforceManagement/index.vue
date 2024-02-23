<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-20 15:55:01
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 14:01:08
 * @Description:综合-值班管理
-->

<template>
  <el-container>

    <el-main>
      <el-container>
        <el-header>
          <el-row
            type="flex"
            align="middle"
            style="height:100%;padding:0 20px"
          >
            <el-col :span="5">
              <el-date-picker
                v-model="selectedMonth"
                type="month"
                placeholder="选择月"
                size="mini"
                value-format="yyyy-MM-dd"
                :clearable="false"
                style="width: 160px"
                @change="handleChangeMonth"
              />
              <el-button
                size="mini"
                class="btn"
                @click="handleCurrentMonth"
              >回到本月</el-button>
            </el-col>
            <el-col :span="19" style="text-align:right">
              <el-checkbox v-model="onlySelf" size="mini" @change="handleQueryMyself">只看自己</el-checkbox>
              <el-popconfirm
                title="确认清空本月排班吗？"
                @confirm="handleClearDutyScheduleByMonty"
              >
                <el-button
                  slot="reference"
                  size="mini"
                  class="btn"
                >清空本月排班</el-button>
              </el-popconfirm>

              <el-button
                size="mini"
                class="btn"
                @click="openDutyScheduleRuleListDialog"
              >排班规则</el-button>
              <el-button
                size="mini"
                class="btn"
                :type="isSettingHolidy?'primary':''"
                @click="isSettingHolidy=!isSettingHolidy"
              >节假日设置</el-button>

              <el-button
                size="mini"
                class="btn"
              >导入排班</el-button>
              <el-button
                v-popover:popover
                size="mini"
                class="btn"
                @click="handleExport"
              >导出Excel</el-button>
              <el-button
                v-popover:popover
                size="mini"
                class="btn"
              >打印</el-button>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <pure-calendar ref="calendar" @monthChange="handleMonthChange">
            <template slot="dateCell" slot-scope="{ holidayData, day, data, scheduleData}">
              <div @dblclick="handleDbclick(data, $event)">
                <div
                  class="day-container"
                  @click="handleSettingHoliday(data, holidayData)"
                >
                  <el-tag
                    v-if="holidayData.holidayType === 1 || holidayData.holidayType === 3"
                    type="weekend"
                  >周末</el-tag>
                  <el-tag
                    v-if="holidayData.holidayType === 2 || holidayData.holidayType === 3"
                    type="holiday"
                  >节假日</el-tag>
                  <span class="day"> {{ day }}</span>
                </div>
                <div>

                  <el-scrollbar style="height:70px">
                    <ul class="schedule-list">
                      <template
                        v-for="(item) in scheduleData.core"
                      >
                        <li
                          :key="item.id"
                          :class="{'is-selected':selectedRow.id===item.id}"
                          :style="{background: selectedRow.id===item.id?item.colorCode: ''}"
                          @click="handleClickRow(item,$event,scheduleData)"
                        >
                          <span class="color-node" :style="{background: item.colorCode}" />
                          <span class="duty-type">{{ item.dutyType }}</span>
                          <el-tooltip class="item" effect="dark" transition="fade-in" :content="convertTransHistor(item.schedulUsers)" placement="right">
                            <span class="engineer">{{ convertTransHistor(item.schedulUsers) }}</span>
                          </el-tooltip>
                        </li>

                      </template>
                    </ul>
                  </el-scrollbar>
                </div>
              </div>
            </template>
          </pure-calendar>
          <el-popover
            :key="popperFlag"
            v-model="visibleEdit"
            placement="right"
            width="500"
            trigger="manual"
            :reference="prevTarget"
          >
            <el-row>
              <el-col :span="13"><div class="title">{{ selectedRow.dutyType }}</div></el-col>
              <el-col :span="11" style="text-align:right">
                <i class="el-icon-error" @click="visibleEdit=false" />
              </el-col>
            </el-row>
            <div>

              <el-form
                v-model="selectedRow"
                size="mini"
                label-position="right"
                label-width="66px"
                :disabled="onlySelf"
              >
                <el-form-item label="时间：">
                  {{ convertSlotTime(selectedRow.slotTime) }}
                </el-form-item>
                <el-row>
                  <el-col :span="12">排班人员</el-col>
                  <el-col :span="12"><el-button
                    type="primary"
                    size="mini"
                    style="position:absolute;right:0"
                    @click="handleUpdateUser"
                  >修改</el-button></el-col>
                </el-row>
                <template v-for="(item,index) in selectedRow.schedulUsers">
                  <div
                    :key="index"
                  >
                    <div class="hospital">{{ getHospitalNameById(item.hospital) }}</div>
                    <div class="user">{{ getUsersNameByIds(item.user) }}</div>
                  </div>
                </template>
                <el-form-item label-width="0" style="padding-top:200px">
                  <el-row>
                    <el-col :span="12"><el-button
                      @click="handleDeleteDutySchedule"
                    >删除</el-button></el-col>
                    <el-col
                      :span="12"
                      style="text-align:right"
                    ><el-button type="primary" @click="handleUpdateDutySchedule">保存</el-button></el-col>
                  </el-row>
                </el-form-item>

              </el-form>
            </div>
          </el-popover>
          <!-- 新增排班popover -->
          <el-popover
            :key="addpopperFlag"
            v-model="visibleAdd"
            placement="right"
            width="500"
            trigger="manual"
            :reference="prevTargetAdd"
          >

            <el-row>
              <el-col :span="13"><div class="title">添加班次</div></el-col>
              <el-col :span="11" style="text-align:right">
                <i class="el-icon-error" @click="visibleAdd=false" />
              </el-col>
            </el-row>
            <el-form
              v-model="addDutyScheduleData"
              size="mini"
              label-position="right"
              label-width="96px"
              :disabled="onlySelf"
            >
              <el-form-item label="班次">
                <el-select
                  v-model="addDutyScheduleData.ruleId"
                  clearable
                  :filterable="true"
                >
                  <el-option
                    v-for="item in dutyScheduleNameList"
                    :key="item.id"
                    :label="item.dutyType"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="排班人员">
                <el-button
                  type="primary"
                  size="mini"
                  style="position:absolute;right:0"
                  @click="handleAddUser('new')"
                >添加</el-button>
              </el-form-item>
              <template v-for="(item,index) in addDutyScheduleData.schedulUsers">
                <div
                  :key="index"
                >
                  <div class="hospital">{{ getHospitalNameById(item.hospital) }}</div>
                  <div class="user">{{ getUsersNameByIds(item.user) }}</div>
                </div>
              </template>
              <el-form-item label-width="0" style="padding-top:200px">
                <el-row>
                  <el-col :span="12"><el-button @click="visibleAdd=false">取消</el-button></el-col>
                  <el-col
                    :span="12"
                    style="text-align:right"
                  ><el-button type="primary" @click="handleAddDutySchedule">保存</el-button></el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </el-popover>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import {
  updateHolidy,
  deleteDutySchedule,
  updateDutyScheduleEngineer,
  getDutyScheduleRuleNameList,
  addDutySchedule,
  clearDutyScheduleByMonty,
} from '@/apis/synthesize/workforceManagement';
import DepartmentApi from '@/apis/system/department';
import WorkforceManagementApi from '@/apis/synthesize/workforceManagement';
import PureCalendar from '@/components/calendar';
import {
  find,
} from 'lodash';
import { staffId, } from '@/filters';
import DutyScheduleRuleList from '../sharedComponents/dialog/dutyScheduleRuleList';
import UpdateDutyScheduleUser from '../sharedComponents/dialog/updateDutyScheduleUser';
import UpdateDutyScheduleUserOnly from '../sharedComponents/dialog/updateDutyScheduleUserOnly';
import {
  bus,
} from '@/utils/bus';
import {
  mapGetters,
} from 'vuex';
import downLoadFile from '@/utils/downLoad';
export default {
  name: 'ZhZbgl',
  components: {
    PureCalendar,
  },
  data() {
    return {
      isSettingHolidy: false,
      // 当前选中月份
      selectedMonth: '',
      // 选中的排班
      selectedRow: {
        edit: false,
      },
      onlySelf: false,
      // 选中的某天数据
      selectedDutyScheduleData: {},
      prevTarget: null,
      prevTargetAdd: null,
      visibleEdit: false,
      visibleAdd: false,
      editData: null,
      popperFlag: false,
      addpopperFlag: 1,
      addDutyScheduleData: {
        date: null,
        ruleId: null,
        schedulUsers: null,
      },
      editDutyScheduleData: {
        edit: false,
      },
      hospitalList: [],
      // 排班规则名称列表
      dutyScheduleNameList: [],
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
  },

  mounted() {
    this.selectedMonth = this.$refs.calendar.formatedToday;
  },
  async created() {
    const { list, } = await DepartmentApi.list({ deptType: 1, state: 1, });
    this.hospitalList = list;
    if (this.$route.query.onlySelf) {
      this.onlySelf = true;
      this.handleQueryMyself(this.onlySelf);
    }
  },
  methods: {
    // 导出excel
    async handleExport() {
      try {
        const currentMonth = this.$refs.calendar.curMonthDatePrefix;
        const fileName = `值班信息${currentMonth}.xlsx`;
        const res = await WorkforceManagementApi.exportExcel(currentMonth);
        downLoadFile(res, fileName);
      } catch (error) {
        this.$message({
          type: 'error',
          message: '下载值班信息失败!',
        });
      }
    },
    async handleQueryMyself(val) {
      if (val) {
        bus.$emit('reloadData', this.userInfo.id);
      } else {
        bus.$emit('reloadData');
      }
    },
    // 添加排班人员-可选院区
    async handleAddUser(type) {
      let userInfo = this.selectedRow.schedulUsers || [];
      if (type === 'new') {
        userInfo = this.addDutyScheduleData.schedulUsers || [];
      }
      this.$dialog({
        title: '排班人员',
        width: '668px',
        position: 'center',
        component: () => <UpdateDutyScheduleUser data={userInfo} onDone={this.addUserDone}/>,
      });
    },
    // 添加排班人员-只可选人
    async handleAddUserOnly() {
      const userInfo = this.selectedRow.schedulUsers || [];
      this.$dialog({
        title: '排班人员',
        width: '668px',
        position: 'center',
        component: () => <UpdateDutyScheduleUserOnly data={userInfo[0]} onDone={this.addUserDone}/>,
      });
    },
    // 修改排班-如果已有人员中无院区，那么弹窗就只能选人不选院区
    async handleUpdateUser() {
      const userInfo = this.selectedRow.schedulUsers || [];
      const hasHospital = userInfo.some(item => item.hospital > 0);
      if (hasHospital) {
        this.handleAddUser();
      } else {
        this.handleAddUserOnly();
      }
    },
    // 修改排班人员完成后触发
    async addUserDone(data) {
      this.selectedRow.schedulUsers = data;
      this.addDutyScheduleData.schedulUsers = data;
    },
    getHospitalNameById(id) {
      return find(this.hospitalList, { id, })?.deptName;
    },
    getUsersNameByIds(ids) {
      return ids?.split(',')
        .map(item => {
          return staffId(Number(item));
        })
        .join(',');
    },
    async handleClearDutyScheduleByMonty() {
      try {
        await clearDutyScheduleByMonty({ month: this.$refs.calendar.curMonthDatePrefix, });
        this.onlySelf = false;
        bus.$emit('reloadData');
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    async openDutyScheduleRuleListDialog() {
      this.$drawer({
        title: '排班规则',
        width: '720px',

        component: () => <DutyScheduleRuleList/>,
      });
    },
    handleChangeMonth(day) {
      this.onlySelf = false;
      this.$refs.calendar.pickDay(day);
    },
    handleMonthChange(day) {
      this.selectedMonth = day;
      this.handleChangeMonth(day);
    },
    // 回到本月
    handleCurrentMonth() {
      this.selectedMonth = this.$refs.calendar.formatedToday;
      this.handleChangeMonth(this.selectedMonth);
    },
    // 设置节假日
    handleSettingHoliday(dayData, data) {
      const date = dayData.day;
      if (!this.isSettingHolidy || !dayData.type.includes('current')) {
        return;
      }
      data.holidayType = this.loopHolidayType(data.holidayType);
      updateHolidy(date, data.holidayType);
    },
    // 节假日循环
    loopHolidayType(type) {
      return ++type > 3 ? 0 : type;
    },
    convertTransHistor(val) {
      const strArr = [];
      if (val) {
        val.map(item => {
          const hospitalName = find(this.hospitalList, { id: item.hospital, })?.deptName.split('院区')[0];
          item.user.split(',')
            .map(innerItem => {
              if (hospitalName) {
                strArr.push(`${staffId(Number(innerItem))}(${hospitalName})`);
              } else {
                strArr.push(`${staffId(Number(innerItem))}`);
              }
            });
        });
      }
      return strArr.join(',');
    },
    clearEditPopoverComponent() {
      this.prevTarget = null;
      this.popperFlag = !this.popperFlag;
      this.visibleEdit = false;
    },
    clearAddPopoverComponent() {
      this.prevTargetAdd = null;
      this.addpopperFlag = this.addpopperFlag === 2 ? 1 : 2;
      this.visibleAdd = false;
    },

    async handleUpdateDutySchedule() {
      try {
        await updateDutyScheduleEngineer({ dutyScheduleId: this.selectedRow.id,
          schedulUsers: this.selectedRow.schedulUsers, });
        bus.$emit('reloadData');
        this.clearEditPopoverComponent();
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    handleDeleteDutySchedule() {
      deleteDutySchedule(this.selectedRow.id)
        .then(() => {
          bus.$emit('reloadData');
          this.clearEditPopoverComponent();
        });
    },

    // 新增排班
    handleDbclick(dayData, event) {
      if (this.isSettingHolidy || !dayData.type.includes('current')) {
        return;
      }
      const date = dayData.day;
      this.clearEditPopoverComponent();
      const currentTarget = event.currentTarget;
      this.addDutyScheduleData.date = date;
      this.addDutyScheduleData.ruleId = null;
      this.addDutyScheduleData.schedulUsers = [];
      getDutyScheduleRuleNameList()
        .then(res => {
          this.dutyScheduleNameList = res;
        });
      if (event.stopPropagation) {
        event.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
      if (this.prevTargetAdd === currentTarget) {
        this.visibleAdd = !this.visibleAdd;
      } else {
        if (this.prevTargetAdd) {
          this.clearAddPopoverComponent();
          this.$nextTick(() => {
            this.prevTargetAdd = currentTarget;
            this.visibleAdd = true;
          });
        } else {
          this.prevTargetAdd = currentTarget;
          this.visibleAdd = true;
        }
      }
    },
    // 点击某一个排班
    handleClickRow(row, event, dutyScheduleData) {
      if (this.isSettingHolidy) {
        return;
      }
      this.clearAddPopoverComponent();
      this.selectedDutyScheduleData = dutyScheduleData;
      row.edit = false;
      if (event.stopPropagation) {
        event.stopPropagation();
      } else if (window.event) {
        window.event.cancelBubble = true;
      }
      this.selectedRow = Object.assign({}, row);
      const currentTarget = event.currentTarget;
      if (this.prevTarget === currentTarget) {
        this.visibleEdit = !this.visibleEdit;
      } else {
        if (this.prevTarget) {
          this.clearEditPopoverComponent();
          this.$nextTick(() => {
            this.prevTarget = currentTarget;
            this.visibleEdit = true;
          });
        } else {
          this.prevTarget = currentTarget;
          this.visibleEdit = true;
        }
      }
    },
    // 转换时间段显示
    convertSlotTime(slotTime) {
      if (!slotTime) {
        return '异常时间段';
      }
      try {
        const slotTimeJson = JSON.parse(slotTime);
        const values = Object.values(slotTimeJson);
        const strArr = [];
        values.forEach(item => {
          strArr.push(item[0] + '-' + item[1]);
        });
        return strArr.join(',');
      } catch (error) {
        console.log(error, slotTime);
        return '异常时间段';
      }
    },
    async handleAddDutySchedule() {
      try {
        await addDutySchedule(this.addDutyScheduleData);
        bus.$emit('reloadData');
        this.visibleAdd = false;
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-container ::v-deep .el-aside {
  background: white;
  margin: 0 10px 0 0;
}

.el-container ::v-deep .el-main {
  background: white;
}

.el-container ::v-deep .el-calendar-day {
  height: 100%;
  min-height: 118px;
  max-height: 118px;
}
.day-container {
  font-size: 17px;
  position: relative;
  height: 25px;
  .day {
    display: inline-block;
    font-size: 17px;
    line-height: 25px;
    text-align: center;
    width:36px;
    position: absolute;
    right: 0px;
  }
}
.day {
  text-align: right;
}
.title {
  color: #2D405E;
  font-size: 20px;
  line-height: 22px;

}
.holidays {
  height: 32px;
  padding-top: 5px;
  padding-left: 10px;
  font-size: 16px;
  line-height: 22px;
  color: #2d405e;
  font-weight: 500;
  border-radius: 4px;
  margin-bottom: 12px;
}

.weekend {
  background-color: #ffa1a1;
}
.el-tag {
  font-size: 15px;
  line-height: 25px;
  color:#2D405E;
  font-weight: 600;
  padding: 0 5px;
  border: unset;
  margin-right: 8px;
  height: unset;
}
.el-tag--weekend {

  background-color: #FFD9D9;
}
.el-tag--holiday {
   background-color: #F4DCF4;
}

.holiday {
  background-color: #f4c9f3;
}
.color-node {
  width: 8px;
  height: 8px;
  background: red;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}
.el-scrollbar ::v-deep .el-scrollbar__wrap {
   overflow-x: hidden;
 }
 .schedule-list {
   list-style: none;
   padding: 6px 0;
   margin: 0;
   box-sizing: border-box;
 }
 .schedule-list__item {
    font-size: 14px;
    padding: 0 20px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #606266;
    height: 34px;
    line-height: 34px;
    box-sizing: border-box;
    cursor: pointer;
    // &:hover {
    //   background-color: red;
    // }
 }
 .btn {
  border: 1px solid #409eff;
  border-color: #409eff;
  color: #409eff;
  margin-left: 30px;
}
.btn.el-button--primary {
  color: white;
}
.schedule-list{
  list-style: none;
  li {
    padding: 3px 10px;
    font-size: $--pure-base-font-size;
    border-radius: 4px;
    .duty-type {
      color: #2D405E;

      font-weight: 500;
    }
    .engineer {
      color: #606266;
      font-weight: 400;
      float:right;
      width:90px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &.is-selected  {
      span {
        color: white;
      }
      background: rgb(224, 18, 18);
    }
  }
}
.el-icon-error:hover {
  color: #409eff;
  cursor: pointer;
}
.hospital {
  color: #879BBA;
  margin-top: 10px;
}
.user {
  color: #2D405E;
  margin-bottom: 20px;
}
</style>
