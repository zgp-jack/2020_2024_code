<!--  -->
<template>
  <JYWPanel
    title="预定信息"
    width="100%"
    left-flag-title="创建人"
    :left-flag-value="panelInfo.user "
    right-flag-title="建单时间"
    :right-flag-value="panelInfo.time | date"
    :height="$attrs.height"
    :show-expand="$attrs.expand"
    p-k="mettingInfo"
    :expand="expand"
    :disabled="disabled"
  >
    <div v-loading="loading" class="due-panel-container">
      <div class="left">
        <div>
          <el-form
            ref="form"
            label-width="120px"
            :rules="rules"
            :model="formData"
            label-position="right"
            size="mini"
            :disabled="disabled"
          >
            <el-form-item label="会议主题" prop="name">
              <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="会议议题">
              <el-input v-model="formData.desc" type="textarea" rows="4" />
            </el-form-item>
            <el-form-item label="会议类型" prop="type">
              <DicSelect v-model="formData.type" :type="'string'" :dic-key="'meeting_type'" />
            </el-form-item>
            <el-form-item label="会议室名称" prop="roomId">
              <MettingSelect v-model="formData.roomId" @load="loadMeetingData" @clear="clearMeetingData" @info="getChooseMettingData" />
            </el-form-item>
            <el-form-item label="会议室地址">
              <el-input v-model="formData.addr" disabled readonly />
            </el-form-item>
            <el-form-item label="主持人">
              <UserSelect v-model="formData.host" />
            </el-form-item>
            <el-form-item label="参会人员">
              <UserSelect v-model="formData.join" multiple />
            </el-form-item>
            <el-form-item label="所属项目">
              <ProjectSelect v-model="formData.project" value-type="itemCode" :disabled="DisabledProjectSelect" />
            </el-form-item>
            <el-form-item label="审批人">
              <UserSelect v-model="formData.approve" />
            </el-form-item>
          </el-form>
          <hr class="hr">
          <b class="b-contact">联系人</b>
          <el-form ref="contactRef" :model="formContact" class="form-contact" :rules="contactRules" label-position="right" size="mini" :disabled="disabled">
            <el-row v-for="(v, i) in formContact.values" :key="i">
              <el-col :span="9">
                <el-form-item label-width="130px" :label="`联系人${i+1}`" :rules="contactRules.name" :prop="`values.${i}.name`">
                  <el-input v-model="v.name" style="width: 116px" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label-width="100px" :label="`联系电话`" :rules="contactRules.phone" :prop="`values.${i}.phone`">
                  <el-input v-model="v.phone" />
                </el-form-item>
              </el-col>
              <el-col v-if="i > 1" :span="3" class="t-r">
                <el-form-item>
                  <el-button @click="clickDelContacts(i)"> 删除 </el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label-width="70px">
              <template #default>
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="clickContact"
                >添加联系人</el-button>
              </template>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="center" />
      <div class="right">
        <el-empty v-if="!ReseverTimes.length" description="请选择会议室!" />
        <el-form v-else size="mini" label-position="left" :disabled="disabled">
          <el-form-item label="会议日期" required>
            <el-date-picker v-model="currentDate" :picker-options="pickerOptions" @change="changeCurrentDate" />
          </el-form-item>
          <el-form-item label="选择会议时间" required />
          <div
            v-for="v in ReseverTimes"
            :key="v.key"
            class="time-range__wrapper"
            :class="[ClassName[v.isOvertime],checkClass(v.key,v.time)]"
            @click="clickChose(v)"
          >
            <p>{{ v.time }}</p>
            <p>{{ v.isOvertime | timeState }}</p>
          </div>
          <el-form-item />
        </el-form>
      </div>
    </div>
  </JYWPanel>

</template>

<script>
import UserSelect from '@/views/project/components/userSelect/index';
import { mapGetters, mapState, } from 'vuex';
import moment from 'moment';
import MeetingMangementApi from '@/apis/synthesize/mettingMangement/index';

import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';

import ProjectSelect from '@/views/project/components/select/selectProject.vue';
import MettingSelect from '../../select/mettingSelect.vue';
import { stringToArray, } from '@/utils/common';
import { pickerOptions, } from '@/views/project/components/panels/config/panel.config';
import { phone_rules, } from '@/views/project/components/panels/config/form.rules';

const isDuringDate = function (beginDate, endDate, currentDate) {
  const curDate = currentDate ? new Date(currentDate) : new Date();
  const begin = new Date(beginDate);
  const end = new Date(endDate);
  if (curDate >= begin && curDate >= end) {
    return true;
  }
  return false;
};
const formatterDate = function (time) {
  const times = time.split('-');
  const ftime = moment().format('YYYY-MM-DD');
  const begin = `${ftime} ${times[0]}`;
  const end = `${ftime} ${times[1]}`;
  return [begin, end];
};

export default {
  name: 'BasePanel',
  filters: {
    timeState(val) {
      // 0可预订1已过期2已预定
      const msg = {
        '0': '可预订',
        '1': '已过期',
        '2': '已预定',
      };
      return msg[String(val)];
    },
  },
  components: {
    UserSelect,
    DicSelect,
    ProjectSelect,
    MettingSelect,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    disabled: Boolean,
    where: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      pickerOptions,
      loading: false,
      rules: {
        name: [{ required: true, message: '会议主题不能为空', }],
        type: [{ required: true, message: '会议类型不能为空', }],
        roomId: [{ required: true, message: '请选择会议室', }],
      },
      contactRules: {
        name: [{ required: true, message: '联系人不能为空', }],
        phone: [{ required: true, message: '电话号码不能为空', }, phone_rules],
      },
      checkKeys: [],
      checkTimes: [],
      interval: 0,
      currentDate: Date.now(),
      // 预定
      reseverTimes: [],
      formData: {
        id: '',
        name: '',
        desc: '',
        type: '',
        roomId: '',
        addr: '',
        // 参与人
        host: '',
        join: '',
        // 所属项目
        project: '',
        // 审批人
        approve: '',
      },
      formContact: {
        values: [
          {
            name: '',
            phone: '',
          }
        ],
      },

      panelInfo: {
        time: '',
        user: '',
      },

    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('project/index', {
      expand: (v) => {
        return v['pancelExpandOptions'].mettingInfo;
      },
    }),
    ReseverTimes() {
      if (this.reseverTimes.length) {
        return this.reseverTimes.map((e, i) => {
          return {
            ...e,
            check: e.isOvertime,
            key: i,
            time: `${e.startTime}-${e.endTime}`,
          };
        });
      }
      return [];
    },
    ClassName() {
      return {
        '1': 'time-range-timeOut',
        '2': 'time-range-active',
        '0': 'time-range-available-green',
      };
    },
    RoomId() {
      if (this.IsWhereProject) {
        return '';
      }
      return this.data.id || '';
    },
    CheckTimes() {
      return this.checkTimes.map(e => e.startTime + '-' + e.endTime);
    },
    isChangeDateSameToDay() {
      const toDay = moment();
      return toDay.isSame(this.currentDate);
    },
    DisabledProjectSelect() {
      return ['project'].includes(this.where);
    },
    IsWhereProject() {
      return ['project'].includes(this.where);
    },
  },
  mounted() {
    this.init();
  },
  destroyed() {
  },
  methods: {
    async init() {
      try {
        if (this.IsWhereProject) {
          this.formData.project = this.data?.itemCode || '';
          this.initPanelInfo({});
          this.initContractData();
          return;
        }
        let rs = {};
        if (this.RoomId) {
          this.loading = true;
          this.currentDate = this.data.time;
          rs = await MeetingMangementApi.getReserve({ id: this.RoomId, sign: 'info', });
          this.formData = {
            id: rs.id,
            name: rs.title,
            desc: rs.subject,
            type: rs.type,
            roomId: rs.meetingRoomId,
            host: rs.hosts && rs.hosts.length ? rs.hosts[0].user : [],
            join: rs.attends && rs.attends.length ? rs.attends.map(e => e.user) : [],
            project: rs?.itemCode || '',
            approve: rs.audits && rs.audits.length ? rs.audits[0].user : [],
          };
          this.checkTimes = rs.meetingTimes;
          this.formContact.values = rs.person.map((e) => {
            return {
              name: e.person,
              phone: e.phone,
            };
          });
          this.loading = false;
        } else {
          this.initContractData();
        }

        this.initPanelInfo(rs);
      } catch (error) {
        this.$message.error(error);
      } finally {
        this.loading = false;
      }
    },
    initPanelInfo(data) {
      this.panelInfo.user = data?.createUserName || this.userInfo.name;
      this.panelInfo.time = data?.createTime || Date.now();
    },
    initContractData() {
      this.formContact.values = [{
        name: this.userInfo.name,
        phone: this.userInfo.phone || '',
      }];
    },
    loadMeetingData(info) {
      this.formData.addr = info?.address || '';
      this.getMeetingTimes(info);
    },
    clearMeetingData() {
      this.checkTimes = [];
      this.checkKeys = [];
      this.getChooseMettingData({});
    },
    getChooseMettingData(info) {
      this.checkTimes = [];
      this.checkKeys = [];
      this.formData.addr = info?.address || '';
      this.getMeetingTimes(info);
    },
    async getMeetingTimes(info) {
      if (info?.id) {
        const time = moment(this.currentDate).format('YYYY-MM-DD');
        const rs = await MeetingMangementApi.getMeetingTimes({ id: info.id, time, });
        this.reseverTimes = rs;
      } else {
        this.reseverTimes = [];
      }
    },
    changeCurrentDate() {
      this.checkTimes = [];
      this.checkKeys = [];
      this.getChooseMettingData({ id: this.formData.roomId, });
    },
    checkClass(currentKey, time) {
      if (this.checkKeys.includes(currentKey)) {
        return 'time-range-blue';
      } else if (this.CheckTimes.includes(time)) {
        this.checkKeys.push(currentKey);
        return 'time-range-blue';
      }
      return '';
    },

    // 选中的时间段需连续选中
    clickChose(item) {
      if (this.disabled) {
        return;
      } else if (item.check && !this.RoomId) {
        return;
      } else {
        const time = formatterDate(item.time);
        if (this.isChangeDateSameToDay && isDuringDate(time[0], time[1])) {
          return;
        }
        const currentKey = Number(item.key);
        const currentKeyIndex = this.checkKeys.indexOf(currentKey);
        const previousKey = currentKey + 1;
        const nextKey = currentKey - 1;
        const preIndex = this.checkKeys.indexOf(previousKey);
        const nextIndex = this.checkKeys.indexOf(nextKey);
        const nextValue = this.checkKeys[nextIndex];
        const preValue = this.checkKeys[preIndex];
        // 同一个选中的值存在
        if (currentKeyIndex > -1) {
          if (nextValue && preValue) {
            this.$message.warning('无法取消存在连续的时间段!');
          } else {
            this.checkKeys.splice(currentKeyIndex, 1);
            this.checkTimes.splice(currentKeyIndex, 1);
          }
          return;
        }
        if (this.checkKeys.length) {
          if (nextIndex > -1) {
            if ((nextValue + 1) === currentKey) {
              this.checkKeys.push(currentKey);
              this.checkTimes.push({
                startTime: item.startTime,
                endTime: item.endTime,
                id: item.id,
              });
            }
          } else if (preIndex > -1) {
            if ((preValue - 1) === currentKey) {
              this.checkKeys.push(currentKey);
              this.checkTimes.push({
                startTime: item.startTime,
                endTime: item.endTime,
                id: item.id,

              });
            }
          } else {
            this.$message.warning('选中的时间段需连续选中!');
          }
        } else {
          this.checkKeys.push(currentKey);
          this.checkTimes.push({
            startTime: item.startTime,
            endTime: item.endTime,
            id: item.id,

          });
        }
      }
    },
    clickContact() {
      this.formContact.values.push({
        name: '',
        phone: '',
      });
    },
    clickDelContacts(index) {
      this.formContact.values.splice(index - 1, 1);
    },
    anyUserDataToArray(type, val) {
      const arr = [];
      let value = [];
      if (val instanceof Array) {
        value = val;
      } else {
        value = stringToArray(val);
      }
      value.forEach((e) => {
        arr.push({
          type,
          user: e,
        });
      });
      return arr;
    },
    anyContactUsers() {
      const arr = [];
      this.formContact.values.forEach((e) => {
        arr.push({
          person: e.name,
          phone: e.phone,
        });
      });
      return arr;
    },
    submit() {
      return new Promise((resolve, reject) => {
        try {
          this.$refs['contactRef'].validate((valid) => {
            if (!valid) {
              reject('联系人错误!');
              return;
            }
            if (!this.checkTimes.length) {
              reject('请选择会议时间段!');
              return;
            }

            // 用户类型(1主持人2审批人3参会人员4到会人员)
            const host = this.anyUserDataToArray(1, this.formData.host);
            const joinUser = this.anyUserDataToArray(3, this.formData.join);
            const approve = this.anyUserDataToArray(2, this.formData.approve);
            const meetingUsers = [...host, ...joinUser, ...approve];
            const contactUsers = this.anyContactUsers();
            const params = {
              id: this.formData.id || '',
              title: this.formData.name,
              time: moment(this.currentDate).format('YYYY-MM-DD'),
              subject: this.formData.desc,
              type: this.formData.type,
              meetingRoomId: this.formData.roomId,
              itemCode: this.formData.project,
              meetingUsers: JSON.stringify(meetingUsers),
              meetingPersons: JSON.stringify(contactUsers),
              meetingTime: JSON.stringify(this.checkTimes),
            };
            this.$refs['form'].validate(async (valid) => {
              if (valid) {
                if (this.RoomId) {
                  await MeetingMangementApi.updatedMeeting(params);
                } else {
                  await MeetingMangementApi.saveRserveMeeting(params);
                }
                resolve();
              } else {
                reject('表单校验未通过！');
              }
            });
          });
        } catch (error) {
          reject(error);
        }
      });
    },

  },
};
</script>
<style lang='scss' scoped>
.w-100 {
  width: 100%;
}
.duePanel {
  display: flex;
  flex-direction: column;
  .duePanel-title {
    span {
      font-size: 20px;
      font-weight: 400;
      color: #334266;
    }
    small {
      display: inline-block;
      margin-left: 36px;
      font-size: 14px;
      font-weight: 400;
      color: #879bba;
    }
  }
  .panel-container {
    margin: 0;
    height: 100%;
  }
  .duePanel-footer {
    padding: 0;
    display: flex;
    align-items: center;
  }
}
.h-100 {
  height: 100%;
}
.due-panel-container {
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: space-between;
  > .right,.left {
    width: 49.9%;
  }
  .left {
    margin: 0 24px 0 0;
    height: 100%;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 6px;
      height: 10px;
    }
    // 滚动条的滑块
    &::-webkit-scrollbar-thumb {
      background-color: #d7e5f9;
      border-radius: 3px;
    }
  }
  .right {
    overflow:auto;
    margin-left: 24px;
     &::-webkit-scrollbar {
       display: none;
    }
  }
  > .center {
    height: 100%;
    width: 1px;
    background-color: #dee2ee;
  }
}
.hr {
  border: 0;
  height: 1px;
  background-color: #dee2ee;
}
.b-contact {
  font-size: 14px;
  font-weight: 500;
  color: #2d405e;
  display: inline-block;
  margin-top: 22px;
}
.form-contact {
  margin-top: 32px;
}
.t-r {
  text-align: right;
}
.time-range-timeOut {
  opacity: 0.4;
  background: #ffffff;
  border: 1px solid #dee2ee;
}
.time-range-available-green {
  background: #dff7df;
}
.time-range-active {
  background: #ffe6e6;
}
.time-range-blue {
  background: #f0f4fc;
  box-shadow: inset 0 0 0px 1px   #426ed7;

}

.time-range__wrapper {
  width: 117px;
  height: 64px;
  border-radius: 4px;
  display: inline-block;
  line-height: 32px;
  margin: 0 0px 10px 10px;
  cursor: pointer;
  p {
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    color: #2d405e;
    margin: 0;
    padding: 0;
  }
}
</style>
