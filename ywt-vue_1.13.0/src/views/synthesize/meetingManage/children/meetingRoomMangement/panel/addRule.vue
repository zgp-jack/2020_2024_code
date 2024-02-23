<!--  -->
<template>
  <el-container>
    <el-header height="32px" class="rulePanel-title">
      <span>新增规则</span>
    </el-header>
    <el-main>
      <JYWPanel title="会议室信息" width="100%">
        <el-form ref="form" :rules="ruleBase" label-width="120px" label-position="right" :model="formData" size="mini">
          <el-row>
            <el-col :span="12">
              <el-form-item label="排序">
                <el-input v-model="formData.order" oninput="value=value.replace(/[^0-9]/g,'')" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否启用">
                <el-switch
                  v-model="formData.enable"
                  active-text="是"
                  :active-value="1"
                  active-color="#409EFF"
                  inactive-color="#ccc"
                  inactive-text="否"
                  :inactive-value="0"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="会议室名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="容纳人数" prop="personNum">
                <el-input v-model="formData.personNum" oninput="value=value.replace(/[^0-9]/g,'')">
                  <template slot="append">人</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否接受预定">
                <el-switch
                  v-model="formData.isReserve"
                  active-text="是"
                  active-color="#409EFF"
                  :active-value="1"
                  inactive-color="#ccc"
                  inactive-text="否"
                  :inactive-value="0"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属院区" prop="hospital">
                <HospitalAreaSelect v-model="formData.hospital" @change="changeHospital" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属科室" prop="office">
                <el-cascader
                  ref="office"
                  :key="officeKey"
                  v-model="formData.office"
                  :disabled="!formData.hospital"
                  :options="officeList"
                  :props="{checkStrictly:true,emitPath:false}"
                  @change="closeCascader"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="会议室地址" prop="addr">
            <el-input v-model="formData.addr" />
          </el-form-item>
          <el-form-item label="配套设备">
            <el-checkbox-group v-model="formData.device">
              <el-checkbox v-for="(val) in meetingDevice" :key="val.id" :label="val.value">{{ val.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>

        <b class="b-tag">会议预定规则设置</b>
        <el-form size="mini" class="m-t-23" label-position="right" label-width="160px">
          <el-form-item label="会议最小时间单元" prop="unit">
            <el-radio-group v-model="formData.unit">
              <el-radio v-for="v in meetingTimeUnit" :key="v.id" :label="v.parm"> {{ v.name }} </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <b class="b-tag">会议预定规则设置</b>
        <el-form ref="formTimeRange" size="mini" class="m-t-23" :model="formTimeRange" label-position="right" label-width="100px">
          <el-form-item
            v-for="(v, i) of formTimeRange.values"
            :key="i"
            required
            :label="`时间段${i+1}`"
          >
            <el-col :span="10">
              <el-form-item :prop="'values.'+i+'.startTime'" :rules="ruleMetting.startTime">
                <el-time-picker
                  v-model="v.startTime"
                  value-format="HH:mm"
                  format="HH:mm"
                  :picker-options="{
                    format:'HH:mm',
                    selectableRange: `${i>0? formTimeRange.values[i-1].endTime : '00:00'}:00 - 23:59:00`
                  }"
                  placeholder="选择时间"
                />
                <!-- :default-value="timePickerDefaultTime" -->
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :prop="'values.'+i+'.endTime'" :rules="ruleMetting.endTime">
                <el-time-picker
                  v-model="v.endTime"
                  value-format="HH:mm"
                  format="HH:mm"
                  :disabled="!v.startTime"
                  :picker-options="{
                    format:'HH:mm',
                    selectableRange: `${i>0? formTimeRange.values[i-1].endTime : v.startTime}:00 - 23:59:00`
                  }"
                  placeholder="选择时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button
                v-if="i > 0"
                :span="3"
                class="del-button"
                @click="clickDelContacts(v,i)"
              >
                删除
              </el-button>
            </el-col>
          </el-form-item>

          <el-form-item>
            <template #default>
              <el-button
                size="mini"
                type="primary"
                plain
                @click="clickTimeRange"
              >添加时间段</el-button>
            </template>
          </el-form-item>
        </el-form>
      </JYWPanel>
    </el-main>
    <el-footer class="rule-footer-tag">
      <el-button type="primary" size="mini" :loading="submitButtonLoading" @click="submit">保存</el-button>
    </el-footer>
  </el-container>
</template>

<script>

import HospitalAreaSelect from '@/views/system/sharedComponnets/select/hosipitalAreaSelect.vue';
import { mapState, } from 'vuex';
import mettingMangementApi from '@/apis/synthesize/mettingMangement/index';
import { arrayToString, stringToArray, } from '@/utils/common';
import moment from 'moment';
export default {
  name: 'RulePanel',
  filters: {
  },
  components: {
    HospitalAreaSelect,
  },
  props: {
    id: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      ruleBase: {
        name: [{
          required: true,
          message: '会议室名称不能为空',
        }],
        personNum: [{
          required: true,
          message: '容纳人数不能为空',
        }],
        hospital: [{
          required: true,
          message: '请选择所属院区',
        }],
        office: [{
          required: true,
          message: '请选择所属科室',
        }],
        addr: [{
          required: true,
          message: '会议室地址不能为空',
        }],
      },
      officeKey: 0,
      submitButtonLoading: false,
      formData: {
        id: '',
        hospital: null,
        office: null,
        order: '',
        enable: 1,
        name: '',
        personNum: '',
        isReserve: 1,
        addr: '',
        unit: '15',
        device: [],
      },
      formTimeRange: {
        values: [{
          startTime: '',
          endTime: '',
        }],
      },
      ruleMetting: {
        startTime: [{
          required: true,
          message: '开始时间不能为空',
          type: 'string',
        }],
        endTime: [{
          required: true,
          message: '结束时间不能为空',
          type: 'string',
        }],
      },
    };
  },
  computed: {
    ...mapState(['dictionary']),
    ...mapState('systemDepartment', {
      cascaderList: (v) => {
        return v.list;
      },
      originList: 'originList',
    }),
    meetingTimeUnit() {
      return this.dictionary['meetingTimeUnit'];
    },
    meetingDevice() {
      return this.dictionary['meetingDevice'];
    },
    timePickerDefaultTime() {
      let defaultTime = '';
      defaultTime = moment().set({ hour: 0, minute: 0, }).valueOf();

      return defaultTime;
    },
    officeList() {
      const findList = this.cascaderList.filter((e) => {
        if (e.id === this.formData.hospital) {
          return e;
        }
      });
      if (findList.length) {
        return findList[0].children;
      }
      return [];
    },

  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (this.id) {
        const rs = await mettingMangementApi.roomData({ id: this.id, });
        this.formData = {
          id: rs.id,
          name: rs.name,
          personNum: rs.peopleNumber,
          hospital: rs.deptHospitalId,
          enable: rs.state,
          device: stringToArray(rs.devices, ',', false),
          office: rs.deptId,
          isReserve: rs.reserve,
          addr: rs.address,
          unit: rs.timeCell,
          order: rs.orders,
        };
        this.formTimeRange.values = rs.busMeetingRoomTimeDtos;
      }
    },
    clickTimeRange() {
      this.$refs['formTimeRange'].validate((valid) => {
        if (valid) {
          this.formTimeRange.values.push({
            startTime: '',
            endTime: '',
          });
        }
      });
    },
    async clickDelContacts(val, index) {
      if (val.id) {
        try {
          await mettingMangementApi.deleteTimeRule({ id: val.id, });
          this.formTimeRange.values.splice(index, 1);
        } catch (error) {
          this.$message.error(error);
        }
      } else {
        this.formTimeRange.values.splice(index, 1);
      }
    },
    changeHospital() {
      this.officeKey += 1;
      this.formData.office = null;
    },
    closeCascader() {
      this.$refs.office.dropDownVisible = false;
    },
    async submit() {
      try {
        await this.$refs['formTimeRange'].validate();
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            this.submitButtonLoading = true;
            const params = {
              id: this.formData.id,
              name: this.formData.name,
              peopleNumber: this.formData.personNum,
              deptHospitalId: this.formData.hospital,
              state: this.formData.enable,
              deptId: this.formData.office,
              devices: arrayToString(this.formData.device),
              reserve: this.formData.isReserve,
              address: this.formData.addr,
              timeCell: this.formData.unit,
              orders: this.formData.order,
              busMeetingRoomTimeDtos: JSON.stringify(this.formTimeRange.values),
            };
            try {
              await mettingMangementApi.saveMeetingRoom(params);
              this.submitButtonLoading = false;
              this.$emit('done');
              this.$message.success('保存成功！');
            } catch (error) {
              this.$message.error(error);
            } finally {
              this.submitButtonLoading = false;
            }
          } else {
            this.$message.error('表单校验未通过');
          }
        });
      } catch (error) {
        this.$message.error('会议预定规则设置不能为空');
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.w-100 {
  width: 100%;
}
.rulePanel-title {
  span {
    font-size: 16px;
    font-weight: 400;
    color: #2d405e;
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
.rule-footer-tag {
    padding: 0;
    display: flex;
    align-items: center;
}

.del-button {
  margin-left: 16px;
}
.b-tag {
  font-size: 14px;
  font-weight: 500;
  color: #2d405e;
  display: inline-block;
  margin-top: 22px;
}
.m-t-23{
    margin-top: 23px;
}
.t-r {
  text-align: right;
}
</style>
