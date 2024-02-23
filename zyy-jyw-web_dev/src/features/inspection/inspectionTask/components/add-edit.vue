<template>
  <div>
    <div class="form-box">
      <div class="form-box-header">
        <div class="title">
          <div name="title">巡检内容</div>
          <div style="color: #ff5722;padding-left: 20px;font-size: 14px">{{ errorText }}</div>
        </div>
      </div>
      <div class="form-box-body">
        <div class="table-box">
          <el-table
            ref="tableRef"
            :data="formData.taskItemList"
            height="100%"
          >
            <el-table-column
              label="序号"
              type="index"
              width="60"
            />
            <el-table-column
              label="巡检项名称"
              prop="itemName"
            />
            <el-table-column label="实测值">
              <template slot-scope="{ row }">
                <el-input
                  v-if="row.itemType === 1"
                  v-model="row.measuredValue"
                  placeholder="请输入整数"
                  style="width: 100%"
                  @change="onChangeValue(row)"
                >
                  <template slot="append">{{ row.itemUnit }}</template>
                </el-input>
                <el-select
                  v-if="row.itemType === 2"
                  v-model="row.measuredValue"
                  style="width: 100%"
                  @change="onChangeOption(row)"
                >
                  <el-option
                    v-for="item in row.optionContent"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="巡检结果"
              prop="unitCode"
            >
              <template slot-scope="{ row }">
                <div v-if="row.result !==2 ">
                  <span class="badge-dot bg-green" />
                  正常
                </div>
                <div v-if="row.result ===2">
                  <span class="badge-dot bg-orange" />
                  异常
                </div>
              </template>

            </el-table-column>
            <el-table-column label="整改要求及处罚意见">
              <template slot-scope="{ row }">
                <el-input
                  v-model="row.rectifyOpinion"
                  placeholder="请输入整改要求及处罚意见"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
      style="maxwidth: 480px;padding-top: 20px;"
    >
      <div class="form-box">
        <div class="form-box-header">
          <div class="title">
            <div name="title">巡检结果</div>
          </div>
        </div>
        <div class="form-box-body">
          <div style="display: flex">
            <el-form-item
              label="巡检结果"
              prop="result"
            >
              <div style="display: inline-block;line-height: 28px;height:28px;vertical-align: middle;">
                <el-radio-group v-model="formData.result">
                  <el-radio :label="1">正常</el-radio>
                  <el-radio :label="2">异常</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item
              v-if="formData.result===2"
              label="异常处理办法"
              prop="handleMethod"
            >
              <div style="display: inline-block;line-height: 28px;height:28px;vertical-align: middle;">
                <el-radio-group v-model="formData.handleMethod">
                  <el-radio :label="1">限期整改</el-radio>
                  <el-radio :label="2">转工单</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
          </div>
          <el-form-item
            label="详细说明"
            prop="elaborate"
            style="width: 60%"
          >
            <el-input
              v-model="formData.elaborate"
              :rows="2"
              maxlength="1000"
              placeholder=""
              show-word-limit
              type="textarea"
            />
          </el-form-item>
          <el-form-item
            label="巡检过程照片"
            prop="inspectionPhotos"
          >
            <upload v-model="formData.inspectionPhotos" />

          </el-form-item>
        </div>
      </div>
      <div
        v-if="formData.result===2 &&formData.handleMethod===1"
        class="form-box"
        style="margin-top: 20px;"
      >
        <div class="form-box-header">
          <div class="title">
            <div name="title">限期整改</div>
          </div>
        </div>
        <div class="form-box-body">
          <el-form-item
            label="整改日期"
            prop="rectifyDate"
          >
            <el-date-picker
              v-model="formData.rectifyDate"
              end-placeholder="结束日期"
              start-placeholder="开始日期"
              type="daterange"
              @change="onRectifyDateChange"
            />
          </el-form-item>
          <el-form-item
            label="整改责任人"
            prop="rectifyUserId"
          >
            <user-select
              v-model="formData.rectifyUserId"
              collapse-tags
              placeholder="整改责任人"
            />
          </el-form-item>
          <el-form-item
            label="整改要求及建议"
            prop="rectifyOpinion"
            style="width: 60%"
          >
            <el-input
              v-model="formData.rectifyOpinion"
              :rows="2"
              maxlength="1000"
              placeholder=""
              show-word-limit
              type="textarea"
            />
          </el-form-item>
        </div>
      </div>
      <!--创建工单-->
      <el-row
        v-if="formData.result===2&&formData.handleMethod===2"
        :gutter="20"
        style="height: 100%;"
      >
        <el-col
          :span="12"
          style="height: 100%;"
        >
          <div
            class="pure-card"
            style="margin-top: 20px"
          >
            <div class="pure-card__header">
              故障信息
            </div>

            <div class="pure-card__sub__header">
              <span class="createUser">
                建单人:
                <span>{{ createUser }}</span>
              </span>
              <span class="createTime">
                建单时间:
                <span>{{ formData.orderAddDto.createTime }}</span>
              </span>
            </div>
            <el-collapse-transition>
              <div
                class="pure-card__body"
                style="height: calc(100% - 71px);"
              >
                <el-form-item
                  :rules="[{ required: true, message: '请选择创建时间', },]"
                  label="创建时间"
                  prop="orderAddDto.createTime"
                >
                  <el-date-picker
                    v-model="formData.orderAddDto.createTime"
                    :clear-icon="'null'"
                    :prefix-icon="'null'"
                    align="right"
                    class="date-picker"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
                <el-form-item
                  :rules="[{ required: true, message: '请输入故障描述', },]"
                  label="故障描述"
                  prop="orderAddDto.faultRemark"
                >
                  <el-input
                    v-model="formData.orderAddDto.faultRemark"
                    :rows="2"
                    maxlength="1000"
                    placeholder="可输入#快速引用知识库内容"
                    show-word-limit
                    type="textarea"
                  />
                </el-form-item>
                <el-form-item
                  :rules="[{ required: true, message: '请选择故障分类', },]"
                  label="故障分类"
                  prop="orderAddDto.faultType"
                >
                  <fault-type-select
                    v-model="formData.orderAddDto.faultType"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="指派人员">
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
                    @change="handleDealBySelf"
                  >由我处理
                  </el-checkbox>
                </el-form-item>
                <el-form-item label="工单来源">
                  <dic-select
                    v-model="formData.orderAddDto.source"
                    dic-key="obs_fault_source"
                    disabled
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item
                  :rules="[{ required: true, message: '请选择实际报修地址', }]"
                  label="实际报修地址"
                  label-width="120px"
                  prop="orderAddDto.actualRepairPlace"
                >
                  <dic-select
                    v-model="formData.orderAddDto.actualRepairPlace"
                    dic-key="obs_repair_place"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="紧急程度">
                  <dic-radio
                    v-model="formData.orderAddDto.degree"
                    dic-key="obs_fault_degree"
                    type="string"
                  />
                </el-form-item>
                <el-form-item label="影响范围">
                  <dic-radio
                    v-model="formData.orderAddDto.rangeType"
                    dic-key="obs_fault_range"
                    type="string"
                  />
                </el-form-item>
                <el-form-item label="响应类型">
                  <dic-radio
                    v-model="formData.orderAddDto.responseType"
                    dic-key="obs_fault_response"
                    type="string"
                  />
                </el-form-item>
                <el-form-item
                  v-if="formData.orderAddDto.responseType === '2'"
                  label="预约时间"
                  prop="appointment"
                >
                  <el-date-picker
                    v-model="formData.orderAddDto.appointment"
                    :clear-icon="'null'"
                    :prefix-icon="'null'"
                    align="right"
                    class="date-picker"
                    placeholder="请选择预约时间"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
                <el-form-item
                  :rules="[{ pattern: /^[0-9]*[1-9][0-9]*$/, message: '预计工时请输入正整数', },]"
                  label="预计工时"
                  prop="orderAddDto.reqTime"
                >
                  <el-input
                    v-model="formData.orderAddDto.reqTime"
                    placeholder="请输入预计工时"
                    style="width: 80%"
                  >
                    <template slot="append">小时</template>
                  </el-input>
                </el-form-item>
                <el-form-item
                  label="期望完成时间"
                  label-width="120px"
                  prop="completeTime"
                >
                  <el-date-picker
                    v-model="formData.orderAddDto.completeTime"
                    :clear-icon="'null'"
                    :prefix-icon="'null'"
                    align="right"
                    class="date-picker"
                    placeholder="请选择期望完成时间"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
                <el-form-item label="资产名称">
                  <el-input
                    v-model="formData.orderAddDto.equipment"
                    placeholder="请输入资产名称"
                  />
                </el-form-item>
                <el-form-item label="资产位置">
                  <department-cascader
                    v-model="formData.orderAddDto.equipmentAddressId"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="附件">
                  <el-col :span="22">
                    <upload v-model="formData.orderAddDto.enclosure" />
                  </el-col>
                </el-form-item>
              </div>
            </el-collapse-transition>

          </div>
        </el-col>
        <el-col
          :span="12"
          style="height: 100%;"
        >
          <div
            class="pure-card"
            style="margin-top: 20px"
          >
            <div class="pure-card__header">
              报修信息
            </div>

            <div class="pure-card__sub__header">
              <span class="createTime">
                报修时间:
                <span>{{ formData.orderAddDto.createTime }}</span>
              </span>
            </div>
            <el-collapse-transition>
              <div
                class="pure-card__body"
                style="height: calc(100% - 71px);"
              >
                <el-form-item
                  label="报修人"
                  prop="orderAddDto.user"
                >
                  <el-input
                    v-model="formData.orderAddDto.user"
                    placeholder="请输入报修人姓名"
                  />
                </el-form-item>
                <el-form-item
                  :rules="[{ required: true, message: '请输入报修电话', }]"
                  label="报修电话"
                  prop="orderAddDto.phone"
                >
                  <el-input
                    v-model="formData.orderAddDto.phone"
                    placeholder="请输入报修电话"
                    @input="onPhoneChange"
                  />
                </el-form-item>
                <el-form-item
                  label="报修科室"
                  prop="orderAddDto.deptId"
                >
                  <department-cascader
                    v-model="formData.orderAddDto.deptId"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item
                  label="报修地址"
                  prop="place"
                >
                  <el-input
                    v-model="formData.orderAddDto.place"
                    placeholder="请输入报修地址"
                  />
                </el-form-item>
              </div>
            </el-collapse-transition>

          </div>
        </el-col>
      </el-row>

    </el-form>
  </div>

</template>

<script>

import UserSelect from '@/features/system/user/components/userSelect.vue';
import moment from 'moment/moment';
import DicRadio from '@/features/system/dataDictionary/components/dicRadio.vue';
import DepartmentCascader from '@/features/system/departmentManagement/components/deptCascader.vue';
import Upload from '@/common/components/upload';
import FaultTypeSelect from '@/features/system/dataDictionary/components/faultTypeSelect.vue';
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import { mapGetters, } from 'vuex';
import EngineerPanel from '@/features/system/user/drawer/user.vue';
import EngineerApi from '@/features/system/user/api';

export default {
  components: {
    DicSelect,
    DicRadio,
    UserSelect,
    DepartmentCascader,
    Upload,
    FaultTypeSelect,
  },
  props: {
    currentData: {
      type: Object,
      default() {
        return {};
      },
    },
    directoryTreeData: {
      type: Array,
      default() {
        return [];
      },
    },
    operateType: {
      type: String,
      default: 'add',
    },
    treeProps: {
      type: Object,
      default() {
        return {
          label: 'label',
        };
      },
    },
  },
  data() {
    return {
      activeValue: 1,
      inactiveValue: 0,
      formData: {
        inspectionPhotos: [],
        taskItemList: [],
        orderAddDto: {
          createTime: '',
          enclosure: [],
        }, // 转工单
      },
      tableData: [], // 巡检内容
      errorText: '',
      // 指派人员信息
      selectedSendEngineer: { name: null, engineerId: null, isTeam: false, teamId: null, },
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
          this.selectedSendEngineer.engineerId === this.userInfo?.userId
        ) {
          return true;
        }
        return false;
      },
      set(val) {
        console.log(val);
        return val;
      },
    },
    createUser() {
      return this.userInfo?.nickName;
    },
    rules() {
      return {
        result: [
          { required: true, message: '请选择巡检结果', },
        ],
        handleMethod: [
          { required: true, message: '请选择异常处理办法', },
        ],
        inspectionPhotos: [
          { required: true, message: '请上传巡检过程照片', },
        ],
        rectifyDate: [
          { required: true, message: '请选择整改日期', },
        ],
        rectifyUserId: [
          { required: true, message: '请选择整改责任人', },
        ],
      };
    },
  },
  watch: {
    currentData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          const { ...rest } = newVal;
          const data = { ...rest, };
          const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
          const orderAddDto = {
            createTime: createTime,
            enclosure: [],
            source: '7',
            degree: '3', // 紧急程度
            rangeType: '1', // 影响范围
            responseType: '1', // 响应类型
          };
          data.orderAddDto = orderAddDto;
          data.inspectionPhotos = [];
          if (data.taskItemList) {
            data.taskItemList.forEach(a => {
              if (!a.result) {
                a.result = 1;
              }
              if (a.itemType) {
                if (a.itemType === 1) {
                  a.measuredValue = a.defaultValue;
                }
                if (a.itemType === 2) {
                  a.measuredValue = a.defaultOption;
                }
              }
            });
          }
          this.formData = data;
          this.$nextTick(() => {
            this.$refs.formRef.clearValidate();
          });
        }
      },
    },
  },
  methods: {
    reset() {
      this.formData = {};
      this.selectedSendEngineer = {};
      this.errorText = '';
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate();
      });
    },
    validate() {
      const result = {};
      this.$refs.formRef.validate(valid => {
        result.valid = valid;
        if (valid) {
          const data = { ...this.formData, };
          result.data = data;
        }
      });
      return result;
    },
    onRectifyDateChange(time) {
      this.formData.rectifyStartDate = time ? time[0] : '';
      this.formData.rectifyEndDate = time ? time[1] : '';
    },
    /* 打开处理人选择 */
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
    /* 由我处理 */
    handleDealBySelf(val) {
      if (val) {
        this.formData.orderAddDto.sendUser = this.userInfo?.userId;
        this.selectedSendEngineer = Object.assign(
          {},
          {
            engineerId: this.userInfo?.userId,
            name: this.userInfo?.nickName,
            isTeam: false,
          },
        );
        this.formData.orderAddDto.sendType = 1;
      } else {
        this.selectedSendEngineer = Object.assign({}, {});
        this.formData.orderAddDto.sendUser = null;
        this.formData.orderAddDto.sendType = 2;
      }
    },
    /* 改变值状态 */
    onChangeValue(row) {
      if (row.minValue && row.maxValue && row.measuredValue) {
        const measuredValue = Number(row.measuredValue);
        const minValue = Number(row.minValue);
        const maxValue = Number(row.maxValue);
        if (measuredValue > maxValue || measuredValue < minValue) {
          row.result = 2;
        } else {
          row.result = 1;
        }
      }
      this.setErrorText();
    },
    /* 改变选项状态 */
    onChangeOption(row) {
      if (row.errorOption && row.measuredValue) {
        const measuredValue = row.measuredValue;
        const errorOption = row.errorOption;
        let hasError = false;
        errorOption.forEach(a => {
          if (a === measuredValue) {
            hasError = true;
          }
        });
        if (hasError) {
          row.result = 2;
        } else {
          row.result = 1;
        }
      }
      this.setErrorText();
    },
    async onPhoneChange(newVal) {
      let result = null;
      if (newVal.length === 4 || newVal.length >= 7 && newVal.length <= 8 || newVal.length === 11) { // 合理的电话号码才调用接口
        result = await EngineerApi.getUserDeptInfo(newVal);
        if (result) {
          this.$emit('phoneChange', { phone: newVal, deptId: result.deptId, });
        }
      } else {
        this.formData.orderAddDto.deptId = null;
        this.formData.orderAddDto.place = null;
        this.formData.orderAddDto.user = null;
        return false;
      }
      this.formData.orderAddDto = Object.assign({}, this.formData.orderAddDto, result);
    },
    setErrorText() {
      if (this.formData.taskItemList) {
        this.errorText = '';
        this.formData.taskItemList.forEach(a => {
          if (a.result && a.result === 2) {
            this.errorText = '异常';
          }
        });
      }
    },
  },
};
</script>
<style lang='scss'
  scoped
>
@import "~@/common/styles/theme/handle.scss";

.badge-dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border-radius: 50%;
  position: relative;
  display: inline-block;
  font-size: 12px;
  text-align: center;
}

.bg-green {
  background-color: #16baaa !important;
  color: #fff !important;
}

.bg-orange {
  background-color: #ff5722 !important;
  color: #fff !important;
}

.ml-16 {
  margin-left: 16px;
}

::v-deep .el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 110px;
}

::v-deep .el-upload-list__item {
  width: 100px;
  height: 100px;
  line-height: 110px;
}

.el-upload__tip {
  font-size: 14px;
  padding: 6px;
  line-height: 22px;
  @include font_color_imp('color-special');
  @include background_color_imp('color-assist-3');
}

.table-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: white;

  ::v-deep .el-table {

    thead {
      @include font_color_imp('color-assist-gray');

      font-size: 16px;

      th.el-table__cell {
        @include background_color_imp('color-assist-4');
      }
    }

  }

  .operate-btn {
    margin-right: 16px;
    font-size: 14px;
    color: #006666;
    cursor: pointer;

    &.delete {
      color: #ff836b;
    }
  }
}

.form-box {
  border-radius: 4px 4px 0px 0px;
  border: 1px solid #dde9e8;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 36px;
    padding: 0 16px;
    background: #f0f7f7;
    font-size: 16px;
    color: #757e7e;

    .title {
      display: flex;
      line-height: 20px;
      font-size: 18px;

      &::before {
        display: inline-block;
        content: '';
        width: 6px;
        height: 20px;
        margin-right: 6px;
        background: #006666;
      }
    }
  }

  &-body {
    padding: 16px;
  }
}

.pure-card {
  width: 100%;

  .pure-card__header, .pure-card__sub__header, .pure-card__body {
    padding: 0 16px;
    height: 36px;
  }

  .pure-card__header, .pure-card__sub__header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .pure-card__header {
    @include background_color_imp('color-stroke');
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    @include font_color_imp('color-assist-gray');
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;

    &::before {
      content: '';
      width: 5px;
      height: 50%;
      margin-right: 6px;
      top: 0;
      left: 0;
      @include background_color_imp('color-primary');
    }

    .expand {
      color: #409EFF;
      cursor: pointer;
      font-weight: 400;
    }
  }

  .pure-card__sub__header {
    @include background_color_imp('color-assist-4');
    padding: 0 16px;
    font-size: 14px;
  }

  .pure-card__body {
    border-left: 1px solid #ECF0F7;
    border-right: 1px solid #ECF0F7;
    border-bottom: 1px solid #ECF0F7;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    padding-top: 16px;

    &::-webkit-scrollbar {
      width: 6px;
      height: 50%;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #DEE2EE;
      border-radius: 3px;
    }

    &.disabled {
      background-color: #fafafa;
    }
  }
}

.createUser,
.createTime {
  color: #879bba;

  span {
    font-weight: 400;
    color: #2d405e;
  }
}
</style>
