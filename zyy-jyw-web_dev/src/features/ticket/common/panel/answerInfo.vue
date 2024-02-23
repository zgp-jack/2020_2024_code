<template>
  <pure-panel-card
    :disabled="disabled"
    :show-expand="showExpand"
    class="max-height"
    v-bind="$attrs"
  >
    <div slot="header">
      报修信息
      <span
        v-if="formData.reception"
        class="reception"
      >
        接听人:
        <span>{{ formData.reception | staffId }}</span>
      </span>
    </div>
    <div slot="subHeader">
      <span
        v-if="formData.time"
        class="time"
      >通话时间:
        <span>{{ formData.time | formatSeconds }}</span>
      </span>
      <span
        v-if="formData.createTime"
        class="createTime"
      >
        报修时间:
        <span>{{ formData.createTime }}</span>
      </span>
    </div>
    <el-form
      ref="form"
      :disabled="disabled"
      :model="formData"
      label-position="right"
      label-width="102px"
      size="mini"
      style="padding-right: 10px;"
    >
      <el-form-item
        class="form-item-wrapper"
        label-width="0px"
      >
        <el-form-item
          :rules="[{required: repair_phone,message: '请输入报修电话', trigger: 'blur', },
                   { max: 20, message: '报修电话长度不超过20字符', },]"
          label="报修电话"
          prop="phone"
        >
          <div class="flex">
            <el-input
              v-model.trim="formData.phone"
              :class="[createPattern !== 'warranty' && operatorType === 'CREATE' && 'not-warranty' ]"
              :disabled="phoneDisabled"
              placeholder="请输入报修电话"
              @input="onPhoneChange"
            />
            <el-button
              v-if="createPattern !== 'warranty' && operatorType === 'CREATE'"
              :disabled="createPattern === 'byPop' || !(formData.phone?.length === 4 || formData.phone?.length >= 7 && formData.phone?.length <= 8 || formData.phone?.length === 11)"
              class="add-btn"
              size="mini"
              type="primary"
              @click="changePhone"
            >修改</el-button>
          </div>
        </el-form-item>
        <el-form-item
          :rules="[{required: repair_user,message: '请输入报修人', trigger: 'blur', },
                   { max: 20, message: '报修人长度不超过20字符', }]"
          label="报修人"
          prop="user"
        >
          <div class="flex">
            <el-input v-model="formData.user" placeholder="请输入报修人" />
            <el-button
              v-if="canAdd"
              class="add-btn"
              icon="el-icon-plus"
              type="primary"
              @click="onAddEngineer"
            />
            <el-button
              v-if="canEdit"
              class="add-btn"
              icon="el-icon-edit"
              type="primary"
              @click="onUpdateEngineer"
            />
          </div>
        </el-form-item>
      </el-form-item>
      <el-form-item
        :rules="[{required: repair_dept,message: '请选择报修科室', trigger: 'change', }]"
        label="报修科室"
        prop="deptId"
      >
        <div class="flex">
          <department-cascader
            v-model="formData.deptId"
            :class="[createPattern !== 'warranty' && operatorType === 'CREATE' && 'not-warranty' ]"
            class="w100"
            @change="onDepartmentChange"
          />
          <el-button
            v-if="createPattern !== 'warranty' && operatorType === 'CREATE'"
            :disabled="createPattern === 'byPop' || !(formData.deptId)"
            class="add-btn"
            size="mini"
            type="primary"
            @click="changeDeptId(formData)"
          >修改</el-button>
          <!-- <el-button
            v-if="createPattern === 'byPop' && !formData.deptId"
            class="add-btn"
            icon="el-icon-plus"
            size="mini"
            type="primary"
            @click="handleAddDepartment"
          />
          <el-button
            v-if="createPattern === 'byPop' && formData.deptId"
            class="add-btn"
            icon="el-icon-edit"
            type="primary"
            @click="handleEditDepartment"
          /> -->
        </div>
      </el-form-item>
      <el-form-item
        :rules="[{required: repair_place,message: '请输入报修地址',trigger: 'blur',},
                 { max: 255, message: '报修地址长度不超过255字符', }]"
        label="报修地址"
        prop="place"
      >
        <el-input v-model="formData.place" placeholder="请输入报修地址" />
      </el-form-item>
      <el-form-item
        label="故障地址"
        prop="faultAddress"
        :rules="[{ max: 255, message: '故障地址长度不超过255字符', }]"
      >
        <el-input v-model="formData.faultAddress" placeholder="请输入故障地址" />
      </el-form-item>
      <el-form-item
        :rules="[{required: repair_place,validator: handlerIpAddress,trigger: 'blur',}]"
        label="报修IP"
        prop="ipAddress"
      >
        <el-select
          v-model="formData.ipAddress"
          class="autocomplete-input"
          multiple
          filterable
          allow-create
          default-first-option
          value-key="id"
          placeholder="请输入报修IP"
        >
          <el-option
            v-for="item in restaurants"
            :key="item.id"
            :label="item.ipAddress"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="formData.recording"
        label="录音"
      >
        <pure-audio :the-url="formData.recording" />
      </el-form-item>
    </el-form>
  </pure-panel-card>
</template>

<script>
import EngineerApi from '@/features/system/user/api';
import { cloneDeep, isEmpty, debounce, } from 'lodash-es';
import {
  bus,
} from '@/common/utils/bus';
import WarrantyApi from '@/features/ticket/api';
import {
  mapState,
} from 'vuex';
import PhoneDialog from '@/features/system/phone/components/phone.vue';
import DialogUpdateDepartment from '@/features/system/departmentManagement/dialog/addDeaprtment.vue';
import ApproveApi from '@/features/system/phone/api';

export default {
  name: 'TicketAnswerInfoPanel',
  components: {
    DepartmentCascader: () =>
      import('@/features/system/departmentManagement/components/deptCascader.vue'),
    PureAudio: () => import('@/common/components/audio'),
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: function () {
        return {};
      },
    },
    showExpand: {
      type: Boolean,
      default: false,
    },

    createPattern: {
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
      formData: {
        // 接听人
        reception: null,
        // 通话时间
        time: null,
        // 报修时间
        createTime: null,
        // 报修科室
        deptId: null,
        // 报修地址
        place: null,
        // 报修人
        user: null,
        // 报修电话
        phone: '',
        // 录音
        recording: null,
        ipAddress: [],
      },
      expandFuck: true,
      // 是否可添加报修人
      canAdd: false,
      // 是否可修改报修人
      canEdit: false,

      // 接听信息必填字段状态
      repair_phone: true,
      repair_user: true,
      repair_dept: true,
      repair_place: true,
      restaurants: [],
    };
  },
  computed: {
    phoneDisabled() {
      if (this.operatorType === 'EDIT') {
        if (this.info.recording) {
          return true;
        } else {
          return false;
        }
      }
      if (this.createPattern === 'warranty') {
        return false;
      }
      return this.createPattern !== 'byManual';
    },
    ...mapState('SYSTEM_DEPT', {
      depList: state => state.list,
    }),
  },
  watch: {
    info: {
      handler(val) {
        this.formData = Object.assign({}, this.formData, val);
        if (this.formData.ipAddressId && this.formData.deptId) {
          this.formData.ipAddress = JSON.parse(this.formData.ipAddressId);
          WarrantyApi.getIpAddressByDeptId(this.formData.deptId).then(res => {
            this.restaurants = res;
          });
          this.$emit('deptIdChange', this.formData.deptId);
        }
        // 报修时间
        if (!this.formData.createTime) {
          this.formData.createTime = this.$options.filters.timeFormat(new Date(), 'YYYY-MM-DD HH:mm');
        }
        this.expandFuck = !this.disabled;
        if (this.createPattern === 'byPop') {
          // const { phone, user, } = this.formData;
          // if (phone && user) {
          //   this.canEdit = true;
          // }
          // if (phone && !user) {
          //   this.canAdd = true;
          // }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // this.getRepairConfigData();
    if (this.createPattern === 'byPop') {
      this.onPhoneChange(this.info.phone);
    }
    bus.$on('selectPersonalTicket', this.onSelectPersonalTicket);
  },
  async mounted() {
    if (this.createPattern === 'warranty') {
      this.formData.ipAddress = await WarrantyApi.getIpAddress();
    }
  },
  destroyed() {
    bus.$off('selectPersonalTicket', this.onSelectPersonalTicket);
  },
  methods: {
    /* ip地址校验 */
    handlerIpAddress(rule, value, callback) {
      const ipAddress = this.formData.ipAddress;
      if (typeof ipAddress === 'string') {
        callback();
      } else if (ipAddress.length === 0) {
        callback(new Error('请选择或输入IP地址'));
      } else {
        let isBool = true;
        ipAddress.forEach((ip) => {
          if (typeof ip === 'string') {
            const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
            const flag = ipRegex.test(ip);
            if (!flag) {
              isBool = false;
            }
          }
        });
        if (!isBool) {
          callback(new Error('请输入正确的IP地址'));
        } else {
          callback();
        }
      }
    },
    changeDeptId(row) {
      this.$dialog({
        width: '600px',
        component: () => <DialogUpdateDepartment isStatus={false} title={'报修科室信息维护'} data={row} onDone={this.onDepartmentChange}/>,
      });
    },
    changePhone() {
      let deptIdList = [];
      if (this.formData.deptIdList) {
        deptIdList = [
          ...this.formData.deptIdList,
        ];
      }
      // this.formData.deptList = deptIdList;
      this.$set(this.formData, 'deptList', [...deptIdList,
      ]);
      this.$dialog({
        width: '600px',
        component: () => <PhoneDialog
          confirmFn={ApproveApi.getSysSave}
          form={this.formData}
          onDone={this.onPhoneChange}
          title={'报修电话信息维护'}
        />,
      });
    },
    cancel() {},
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.ipAddress.indexOf(queryString) === 0);
      };
    },
    // 重置 清空
    reset() {
      this.formData = {
        // 接听人
        reception: null,
        // 通话时间
        time: null,
        // 报修时间
        createTime: this.$options.filters.timeFormat(new Date(), 'YYYY-MM-DD HH:mm'),
        // 报修科室
        deptId: null,
        // 报修地址
        place: null,
        // 报修人
        user: null,
        // 报修电话
        phone: '',
        // 录音
        recording: null,
        ipAddress: [],
      };
      this.restaurants = [];
    },
    async getRepairConfigData() {
      let configData = [];
      configData = await EngineerApi.getRepairConfig({});
      const needFindKey = [
        'repair_phone',
        'repair_user',
        'repair_dept',
        'repair_place',
      ];
      configData.forEach(item => {
        needFindKey.forEach(el => {
          if (item.type === el) {
            this[el] = item.enable;
          }
        });
      });
    },
    async onPhoneChange(newVal) {
      if (!newVal) {
        return;
      }
      let result = null;
      if (newVal.length === 4 || newVal.length >= 7 && newVal.length <= 8 || newVal.length === 11) { // 合理的电话号码才调用接口
        result = await WarrantyApi.getDeptByPhone(newVal);
        if (result) {
          this.depList.forEach(item => {
            if (item.deptId === result.deptId) {
              result.deptPlace = item.deptPlace;
            }
          });
          this.formData.user = result.contacts;
          this.onDepartmentChange(result);
          this.$emit('phoneChange', { phone: newVal, deptId: result.deptId, });
        }
      } else {
        this.formData.deptId = null;
        this.formData.place = null;
        this.formData.user = null;
        this.formData.ipAddress = [];
        this.formData.deptIdList = [];
        this.restaurants = [];
        return false;
      }
      this.formData = Object.assign({}, this.formData, result);
    },
    async check() {
      await this.$refs.form.validate();
      if (this.formData.ipAddress.length) {
        let ipAddress = '';
        this.formData.ipAddressId = [];
        this.formData.ipAddress.forEach(item => {
          if (typeof item === 'number' && !isNaN(item)) {
            this.formData.ipAddressId.push(item);
          } else {
            ipAddress += ';' + item;
          }
        });
        this.formData.ipAddress = ipAddress.slice(1);
      }
      return isEmpty(this.formData) ? null : cloneDeep(this.formData);
    },
    async onAddEngineer() {
      // this.$dialog({
      //   title: '报修人维护',
      //   width: '688px',
      //   position: 'center',
      //   component: () => (
      //     <MaintainReportUser
      //       onDone={this.onAfterChangeEngineer}
      //       data={{
      //         phone: this.formData.phone,
      //         deptId: this.formData.deptId,
      //         name: this.formData.user,
      //       }}
      //       operatorType='CREATE'
      //     />
      //   ),
      // });
    },
    async onUpdateEngineer() {
      // this.$dialog({
      //   title: '报修人维护',
      //   width: '688px',
      //   position: 'center',
      //   component: () => (
      //     <MaintainReportUser
      //       data={{
      //         phone: this.formData.phone,
      //         name: this.formData.user,
      //         deptId: this.formData.deptId,
      //       }}
      //       operatorType='UPDATE'
      //       onDone={this.onAfterChangeEngineer}
      //     />
      //   ),
      // });
    },
    // 科室维护-新增
    async handleAddDepartment() {
      // this.$dialog({
      //   title: '科室维护',
      //   width: '688px',
      //   position: 'center',
      //   component: () => (
      //     <MaintainDepartment
      //       data={{
      //         phone: this.formData.phone,
      //         name: this.formData.user,
      //         deptId: this.formData.deptId,
      //         place: this.formData.place,
      //       }}
      //       operatorType='CREATE'
      //       onDone={this.onAfterChangeEngineer}
      //     />
      //   ),
      // });
    },
    // 科室维护-修改
    async handleEditDepartment() {
      // this.$dialog({
      //   title: '科室维护',
      //   width: '688px',
      //   position: 'center',
      //   component: () => (
      //     <MaintainDepartment
      //       data={{ place: this.formData.place, deptId: this.formData.deptId, }}
      //       operatorType='UPDATE'
      //       onDone={this.onAfterChangeEngineer}
      //     />
      //   ),
      // });
    },
    async onAfterChangeEngineer(data) {
      this.formData = Object.assign({}, this.formData, data);
    },
    onDepartmentChange: debounce(async function (data) {
      if (this.createPattern !== 'warranty' && data) {
        this.formData.place = data?.deptPlace || '';
        this.restaurants = await WarrantyApi.getIpAddressByDeptId(data.deptId) || [];
        this.$emit('deptIdChange', data.deptId);
        if (this.restaurants.length) {
          this.formData.ipAddress = [
            this.restaurants[0]?.id,
          ];
          // this.formData.ipAddress.push(this.restaurants[0]?.id);
        } else {
          this.formData.ipAddress = [];
        }
      } else {
        this.restaurants = [];
      }
    }),
    // 故障信息面板中选择个人工单，接听信息面板指定相关默认值
    async onSelectPersonalTicket() {
      this.formData.phone = this.$store.state.login.userInfo.phone;
      this.onPhoneChange(this.formData.phone);
    },
  },
};
</script>

<style lang='scss'
  scoped
>
.reception {
  padding-left: 24px;
  color: #879bba;

  span {
    color: #2d405e;
  }
}

.time,
.createTime {
  color: #879bba;

  span {
    font-weight: 400;
    color: #2d405e;
  }
}

.time {
  padding-right: 36px;
}

.w100 {
  width: 100%;
}

.form-item-wrapper {
  padding: 0;
  margin-bottom: 0;

  .el-col-12 {
    padding: 0;
  }
}

.add-btn.el-button--mini {
  padding: 7px;
  margin-left: 5px;
}

.flex {
  display: flex;
}
.autocomplete-input {
  width: 100%;
}
.not-warranty {
  width: calc(100% - 50px);
}
</style>
