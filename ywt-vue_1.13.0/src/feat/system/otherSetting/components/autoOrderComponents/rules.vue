
<!-- 自动派单 / 派单规则 -->
<template>
  <el-container>
    <el-main>
      <el-form
        ref="form"
        :disabled="!isAutoDispatch"
        :rules="rules"
        size="small"
        :model="checkedData"
      >
        <el-form-item prop="acceptOrderTime" label="派单后">
          <span class="input-style">
            <el-input v-model="checkedData.acceptOrderTime" />
          </span>
          <span class="text-info">
            分钟内可抢单
          </span>
        </el-form-item>
        <el-form-item prop="reset">
          <div class="checkbox" :class="{ active: checkedData.reset }">
            <el-checkbox
              v-model="checkedData.reset"
              :true-label="1"
              :false-label="0"
            >每日重置派单</el-checkbox>

            <p class="text-danger">
              例:ABC三人,今日最后1单派给了B,则次日第1单将会重置派给A
            </p>
          </div>
        </el-form-item>
        <el-form-item>
          <div
            class="checkbox"
            :class="{ active: checkedData.skipWhereabouts }"
          >
            <el-checkbox
              v-model="checkedData.skipWhereabouts"
              :true-label="1"
              :false-label="0"
              @change="skipWhereaboutsChange"
            >派单跳过</el-checkbox>

            <p class="text-danger">
              系统的自动派单会跳过指定“去向”的人员,人员去向可至“综合-人员去向”模块配置
            </p>
            <el-form-item>
              <el-select
                v-model="checkedData.whereaboutsList"
                multiple
                :disabled="!Boolean(checkedData.skipWhereabouts)"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in whereAboutsTagList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="checkbox" :class="{ active: checkedData.schedule }">
            <el-checkbox
              v-model="checkedData.schedule"
              :true-label="1"
              :false-label="0"
              @change="scheduleChange"
            >排班派单</el-checkbox>
            <div>
              <p class="text-danger">系统会结合排班进行派单</p>
              <el-form-item prop="scheduleType">
                <el-select
                  v-model="checkedData.scheduleType"
                  :disabled="!Boolean(checkedData.schedule)"
                  placeholder="请选择"
                >
                  <el-option label="值班人员接单" :value="1" />
                  <el-option label="值班人员不接单" :value="2" />
                  <el-option label="值班人员末位接单" :value="3" />
                  <el-option label="值班人员优先接单" :value="4" />
                </el-select>
              </el-form-item>
            </div>
            <small
              class="text-danger"
            >{{ ScheduleLabelText }}</small>

            <el-form-item v-if="[3,4].includes(checkedData.scheduleType)" :label="ScheduleLabelInputText" prop="scheduleOrderNum">
              <el-col :span="3">
                <el-input v-model="checkedData.scheduleOrderNum" :disabled="!Boolean(checkedData.schedule)" size="small">
                  <template #append>
                    单
                  </template>
                </el-input>
              </el-col>
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item>
          <div class="checkbox" :class="{ active: checkedData.notAccept }">
            <el-checkbox
              v-model="checkedData.notAccept"
              :true-label="1"
              :false-label="0"
            >未接单数累计

              <el-popover
                placement="top-start"
                title="未接单数累计规则"
                width="auto"
                trigger="hover"
              >
                <ul class="list-unstyled">
                  <li>1.接单人员退单、转交、终止，视为未接单。</li>
                  <li>
                    2.未接单数可通过主动接单（未退单、转交、终止）和系统派单（未退单、转交、终止）抵消。
                  </li>
                </ul>
                <i slot="reference" class="el-icon-question" />
              </el-popover>
            </el-checkbox>

            <p class="text-danger">
              未接单则会累计未接单数，系统会优先派单给未接单数最多的人员
            </p>

            <el-form-item label="未接单数" prop="notAcceptType">
              <el-radio-group
                v-model="checkedData.notAcceptType"
                style="margin-left:16px"
                :disabled="!Boolean(checkedData.notAccept)"
              >
                <el-radio :label="1">不可为负数</el-radio>
                <el-radio :label="0">可为负数</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">
            应用
          </el-button>
        </el-form-item>
      </el-form>
    </el-main>

  </el-container>
</template>

<script>
import WhereAboutsApi from '@/feat/synthesize/whereAbouts/api';
import { arrayToString, } from '@/utils/common';
import { mapActions, mapGetters, mapState, } from 'vuex';
export default {
  data() {
    return {
      whereAboutsTagList: [],
      rules: {
        acceptOrderTime: [
          {
            required: false,
            validator: (rule, value, callback) => {
              if (value === null || value === undefined || value === '') {
                callback(new Error('0~720整数'));
              } else if (Number(value) < 0) {
                callback(new Error('派单分钟不能小于0'));
              } else if (!Number.isInteger(Number(value))) {
                callback(new Error('派单分钟必须为整数'));
              } else if (Number(value) > 720) {
                callback(new Error('派单分钟不能超过720分钟'));
              } else {
                callback();
              }
            },
            trigger: 'change',
          }
        ],
        whereaboutsList: [

          {
            required: false,
            validator: (rule, value, callback) => {
              if (this.checkedData.skipWhereabouts) {
                if (value.length === 0) {
                  callback(new Error('请选择指定"去向"的人员'));
                }
              }
              callback();
            },
            trigger: 'change',
          }
        ],
        scheduleType: [

          {
            required: false,
            validator: (rule, value, callback) => {
              if (this.checkedData.schedule) {
                if (!value) {
                  callback(new Error('请选择排班派单'));
                }
              }
              callback();
            },
          }
        ],
        scheduleOrderNum: [

          {
            required: false,
            validator: (rule, value, callback) => {
              if (this.checkedData.schedule) {
                if ([3, 4].includes(this.checkedData.scheduleType)) {
                  if (value === null || value === undefined || value === '') {
                    callback(new Error('1~999整数'));
                  } else if (Number(value) <= 0) {
                    callback(new Error('派单数不能小于0'));
                  } else if (!Number.isInteger(Number(value))) {
                    callback(new Error('派单数必须为整数'));
                  } else if (Number(value) > 999) {
                    callback(new Error('派单数不能超过999'));
                  }
                }
              }
              callback();
            },
            trigger: 'change',
          }
        ],

        // notAcceptType: [
        //   { required: false, validator(rule, val, cb) {}, trigger: 'change', }
        // ],
      },
      checkedData: {
        // 抢单时间配置 0-720
        acceptOrderTime: '',
        // 未接单数累计是否开启 1是 0否
        notAccept: 0,
        // 未接单数累计类型 1可为负数 0不可为负数
        notAcceptType: '',
        // 是否开启自动派单 1是 0否
        open: 0,
        // 是否开启每日重置派单 1是 0否
        reset: 0,
        // 排班派单是否开启 1是 0否
        schedule: 0,
        // 接单阈值(他人可接)
        scheduleOrderNum: '',
        // 排班派单类型 1值班人员接单 2非值班人员接单 3值班人员末位接单 4值班人员优先接单
        scheduleType: '',
        // 是否开启去向派单跳过 1是 0否
        skipWhereabouts: 0,
        // 跳过的去向数据
        whereaboutsList: '',
      },
    };
  },
  watch: {
    dispatchModeData: {
      handler(val) {
        this.checkedData = {
          ...val,
        };
      },
      deep: true,
    },
  },
  computed: {
    ...mapState('systemOtherSetting/autoOrder', ['dispatchModeData']),
    ...mapGetters('systemOtherSetting/autoOrder', ['isAutoDispatch']),

    ScheduleLabelText() {
      let label = '';
      switch (this.checkedData.scheduleType) {
        case 1:
          label = '即系统派单只会派给当日值班的人员';
          break;
        case 2:
          label = '即系统派单只会派给科室其他人员，跳过值班人员。';
          break;
        case 3:
          label = '系统派单将优先派给科室其他人，当科室其他人有未完成工单或未完成工单超过X单（可选择）才会派给值班人员';
          break;

        default:
          label = '系统派单将优先派给值班人员，当值班人员有未完成工单或未完成工单超过X单（可选择）其次才会是科室其他人';
          break;
      }
      return label;
    },
    ScheduleLabelInputText() {
      switch (this.checkedData.scheduleType) {
        case 3:
          return '其他人可接';

        default:
          return '值班人员可接';
      }
    },
  },
  mounted() {
    // this.init();
    // this.GET_DISPATCH_MODE_DATA();
    console.log('other_config/order/auto');

    this.getWhereAboutsTagList();
  },

  methods: {
    ...mapActions('systemOtherSetting/autoOrder', ['GET_DISPATCH_MODE_DATA', 'SET_DISPATCH_MODE_DATA']),
    // 提交
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.setConfig(1);
        }
      });
    },
    // 跳过去向
    skipWhereaboutsChange(val) {
      // 清空跳过的去向数据
      if (!val) {
        this.checkedData.whereaboutsList = [];
      }
    },
    // 排班派单
    scheduleChange(val) {
      // 清空排班派单的数据
    },

    async setConfig(isAuto) {
      const data = {
        ...this.checkedData,
      };
      data.open = isAuto;
      data.whereaboutsList = data.whereaboutsList.length ? arrayToString(data.whereaboutsList) : null;
      this.SET_DISPATCH_MODE_DATA(data);
    },
    // 获取人员去向
    async getWhereAboutsTagList() {
      this.whereAboutsTagList = await WhereAboutsApi.whereAboutsOptions();
    },
  },
};
</script>

<style lang="scss" scoped>
.list-unstyled {
  list-style: none;
  padding: 0;
  margin: 0;
}
.input-style {
  width: 160px;
  display: inline-block;
}
.title {
  display: flex;
  margin-bottom: 16px;
}
.active {
  border: 1px solid #4574e6 !important;
}
.checkbox {
  background: #ffffff;
  border: 1px solid #dee2ee;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}
.text-danger {
  font-weight: 400;
  font-size: 14px;
  margin: 0;
  padding: 0;
  color: #7d8db3;
  letter-spacing: 0;
}

.text-info {
  font-weight: 400;
  font-size: 18px;
  color: #7d8db3;
  letter-spacing: 0;
}
</style>
