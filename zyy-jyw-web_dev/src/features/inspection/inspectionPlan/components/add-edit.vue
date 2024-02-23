<template>
  <div>
    <el-form
      ref="formRef"
      label-width="150px"
      style="maxwidth: 480px;padding-bottom: 10px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item :label="businessName" prop="businessId">
        <el-select
          v-model="formData.businessId"
          :disabled="operateType=='edit'||operateType=='config'"
          style="width: 100%"
          @change="changePlanItem"
        >
          <el-option
            v-for="item in businessList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          />
        </el-select>
      </el-form-item>

      <div class="form-box">
        <div class="form-box-header">
          <div class="title">
            <div name="title">基本信息</div>
          </div>
        </div>
        <div class="form-box-body">
          <el-form-item label="生效日期" prop="effectiveType">
            <div style="display: flex;">
              <div class="radio-group-box">
                <el-radio v-model="formData.effectiveType" :label="1">立即生效</el-radio>
                <el-tooltip class="item" effect="dark" content="从今日起永久生效" placement="top-start">
                  <i style="color: #757E7E !important;" class="el-icon-question" />
                </el-tooltip>
                <el-radio v-model="formData.effectiveType" style="padding-left: 10px;" :label="2">指定日期</el-radio>
              </div>
              <div style="display: flex;padding-left: 10px;">
                <el-date-picker
                  v-model="formData.effectiveStartDate"
                  style="width: 150px;padding: 0 5px"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="生效日期"
                />
                <el-date-picker
                  v-model="formData.effectiveEndDate"
                  style="width: 150px;padding: 0 5px"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="失效日期"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="巡检责任人" prop="inspectUserId">
            <user-select v-model="formData.inspectUserId" placeholder="巡检责任人" collapse-tags style="width: 100%" />
          </el-form-item>
          <el-form-item label="是否上传图片" prop="uploadPhoto">
            <el-radio-group v-model="formData.uploadPhoto">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="异常处理办法" prop="handlerMethod">
            <el-checkbox v-model="formData.deadlineRectify">限期整改</el-checkbox>
            <el-checkbox v-model="formData.workOrder">转工单</el-checkbox>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch v-model="formData.isEnable" :active-value="activeValue" :inactive-value="inactiveValue" />
          </el-form-item>
          <div style="width: 100%;height: 50px;font-weight: 700;padding-top: 10px">规则配置</div>
          <el-form-item label="巡检周期" prop="inspectionCycle">
            <el-select
              v-model="formData.inspectionCycle"
              style="width: 100%"
            >
              <el-option
                v-for="item in inspectionCycleList"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue*1"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="巡检次数" prop="inspectionNum" style="width: 50%">
            <el-input
              v-model="formData.inspectionNum"
              style="width: 90%"
              placeholder="请输入整数"
              @change="executionTimeChange"
            >
              <template slot="append">次</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="graceDay" style="width: 50%">
            <span slot="label">
              到期宽限
              <el-tooltip
                class="item"
                effect="dark"
                content="任务在执行时间内未完成时，在宽限天数内处理完不算做超时"
                placement="top"
              >
                <i class="el-icon-question" />
              </el-tooltip>
            </span>
            <el-input
              v-model="formData.graceDay"
              style="width: 90%"
              placeholder="请输入整数"
            >
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="isFixedTime">
            <span slot="label">
              是否固定时间
              <el-tooltip
                class="item"
                effect="dark"
                content="是否每日指定时间段处理，若为否，则默认执行时间为00:00-23:59"
                placement="top"
              >
                <i class="el-icon-question" />
              </el-tooltip>
            </span>
            <el-radio-group v-model="formData.isFixedTime" @change="executionTimeChange">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-for="(item,index) in formData.executionTimeList"
            :key="index"
            :prop="'executionTimeList.'+index+'.localTime'"
            :rules="[{required: true, message: '请选择执行时间',}]"
          >
            <span slot="label">
              执行时间{{ index + 1 }}
            </span>
            <el-time-picker
              v-model="item.localTime"
              is-range
              value-format="HH:mm:ss"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            />
          </el-form-item>
          <el-form-item label="特殊处理">
            <el-checkbox v-model="formData.skipHoliday">跳过节假日</el-checkbox>
            <el-checkbox v-model="formData.skipWeekend">跳过周末</el-checkbox>
          </el-form-item>
          <el-form-item label="处理规则">
            <div style="display: flex;">
              <div class="radio-group-box">
                <el-radio v-model="formData.processingRule" :label="2">次日处理</el-radio>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="节假日/周末的跳过任务，在次日生成，若生成日期有相同任务则任务合并"
                  placement="top-start"
                >
                  <i style="color: #757E7E !important;" class="el-icon-question" />
                </el-tooltip>
                <el-radio v-model="formData.processingRule" style="padding-left: 10px;" :label="1">直接跳过</el-radio>
                <el-tooltip class="item" effect="dark" content="节假日/周末的跳过任务，不再生成" placement="top-start">
                  <i style="color: #757E7E !important;" class="el-icon-question" />
                </el-tooltip>
              </div>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <CompFormBox title="巡检内容">
      <template v-slot:operate>
        <pure-button type="major" label="关联巡检项" icon="add" @click="onAddItem" />
      </template>
      <div class="table-box" style="height: 320px">
        <el-table ref="tableRef" :data="formData.planItemList" height="100%">
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column label="巡检项名称" prop="itemName" />
          <el-table-column label="巡检项类型" prop="itemTypeName" />
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <span class="operate-btn delete" @click="onDelItem(row.configItemId)">移除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </CompFormBox>
    <custom-drawer
      size="50%"
      :append-to-body="true"
      title="关联巡检项"
      :visible.sync="showBindDialog"
    >
      <CompBindItem
        ref="compBindItemRef"
        :select-data="selectData"
        :current-data="formData"
      />
      <template v-slot:footer>
        <div>
          <pure-button label="保存" @click="onSaveItem" />
          <pure-button label="取消" type="patch" @click="onCancelItem" />
        </div>
      </template>
    </custom-drawer>
  </div>

</template>

<script>
import CompFormBox from '@/common/components/formBox/index.vue';
import CompBindItem from '@/features/inspection/inspectionPlan/components/bind-item.vue';
import UserSelect from '@/features/system/user/components/userSelect.vue';
import PlanApi from '../api';
import { find, } from 'lodash-es';

export default {
  components: {
    UserSelect,
    CompBindItem,
    CompFormBox,
  },
  props: {
    currentData: {
      type: Object,
      default() {
        return {
          status: '0',
        };
      },
    },
    directoryTreeData: {
      type: Array,
      default() {
        return [];
      },
    },
    currentTab: {
      type: String,
      default: '0',
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
      // 是否启用
      activeValue: true,
      inactiveValue: false,
      formData: {
        planItemList: [],
        executionTimeList: [],
      },
      businessName: '巡检资产',
      businessList: [],
      inspectionCycleList: [], // 巡检周期
      selectData: [], // 巡检配置项已选
      // 关联巡检项
      showBindDialog: false,
    };
  },
  computed: {
    rules() {
      const handlerMethod = (rule, value, callback) => {
        const deadlineRectify = this.formData.deadlineRectify;
        const workOrder = this.formData.workOrder;
        if (!workOrder && !deadlineRectify) {
          callback(new Error('请选择异常处理办法'));
        } else {
          callback();
        }
      };
      return {
        businessId: [
          { required: true, message: '请选择巡检资产/单元', },
        ],
        effectiveType: [
          { required: true, message: '请选择生效日期', },
        ],
        inspectUserId: [
          { required: true, message: '请选择巡检责任人', },
        ],
        uploadPhoto: [
          { required: true, message: '请选择是否上传图片', },
        ],
        handlerMethod: [
          { required: true, validator: handlerMethod, message: '请选择异常处理办法', },
        ],
        isEnable: [
          { required: true, message: '请选择是否启用', },
        ],
        inspectionCycle: [
          { required: true, message: '请选择巡检周期', },
        ],
        inspectionNum: [
          { required: true, message: '请输入巡检次数', },
        ],
        isFixedTime: [
          { required: true, message: '请选择是否固定时间', },
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
          if (data.executionTimeList) {
            data.executionTimeList.forEach(a => {
              const arr = [a.startTime, a.endTime,
              ];
              this.$set(a, 'localTime', arr);
            });
          }
          console.log(this.operateType, 'operateType');

          this.formData = data;
          this.getBusiness(this.formData.currentTab);
          this.getPlanItem();
          this.$nextTick(() => {
            this.$refs.formRef.clearValidate();
          });
        }
      },
    },
  },
  created() {
    this.getInspectionCycle();
  },
  methods: {
    reset() {
      this.formData = {};
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
          if (data.executionTimeList) {
            data.executionTimeList = data.executionTimeList.map(item => ({
              startTime: item.localTime[0],
              endTime: item.localTime[1],
            }));
          }
          if (data.planItemList) {
            data.configItemIds = data.planItemList.map(item => item.configItemId);
          }
          result.data = data;
        }
      });
      return result;
    },
    /* 获取巡检周期 */
    getInspectionCycle() {
      const cachedDicList = this.$store.state['SYSTEM_DIC'].list || [];
      this.inspectionCycleList = find(cachedDicList, { type: 'ins_plan_inspection_cycle', })?.data || [];
    },
    /* 获取巡检类型选择 */
    async getBusiness(tab) {
      if (tab === '0') {
        this.businessName = '巡检资产';
        this.formData.businessType = 1;
        const request = this.operateType === 'edit' ? PlanApi.astAllList : PlanApi.getAstList;

        const data = await request();
        console.log(data, 'data');

        const listData = data || [];
        this.businessList = listData.map(item => ({
          id: item.id,
          name: item.name,
        }));
      } else {
        this.businessName = '巡检单元';
        this.formData.businessType = 2;
        const request = this.operateType === 'edit' ? PlanApi.unitAllList : PlanApi.getUnitList;
        const data = await request();
        const listData = data || [];
        this.businessList = listData.map(item => ({
          id: item.id,
          name: item.unitName,
        }));
      }
    },
    /* 获取资产配置项 */
    getPlanItem() {
      if (this.operateType === 'config') {
        console.log(this.formData.businessId, 'this.formData.businessId');

        this.changePlanItem(this.formData.businessId);
      }
    },
    /* 获取资产单元配置项 */
    changePlanItem(data) {
      console.log(this.formData.currentTab, 'this.formData.currentTab');

      const request = this.formData.currentTab === '0' ? PlanApi.getAstItemList : PlanApi.getUnitItemList;

      request(data).then((res) => {
        this.formData.planItemList = res;

        this.formData = { ...this.formData, };
      });
    },
    /* 巡检时间切换 */
    executionTimeChange() {
      const isFixedTime = this.formData.isFixedTime;
      if (isFixedTime === true) {
        const inspectionNum = this.formData.inspectionNum;
        if (inspectionNum > 0) {
          const newData = [];
          for (let S = 0; S < inspectionNum; S++) {
            newData.push({ localTime: '', });
          }
          this.formData.executionTimeList = [...newData,
          ];
          this.formData = { ...this.formData, };
        }
      } else {
        this.formData.executionTimeList = [];
      }
    },
    /* 打开绑定 */
    onAddItem() {
      this.showBindDialog = true;
      console.log(this.formData.planItemList, 'this.formData.planItemList');

      this.selectData = this.formData.planItemList;
    },
    /* 绑定配置项移除 */
    onDelItem(id) {
      const ids = [id,
      ];
      this.formData.planItemList = this.formData.planItemList.filter((item) => {
        if (!ids.includes(item['configItemId'])) {
          return item;
        }
      });
    },
    // 绑定巡检项操作
    onSaveItem() {
      this.formData.planItemList = this.$refs.compBindItemRef.getSelectedData();
      this.showBindDialog = false;
    },
    // 取消绑定
    onCancelItem() {
      this.showBindDialog = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/common/styles/theme/handle.scss";

.radio-group-box {
  line-height: 33px;
  height: 33px;
  vertical-align: middle;
  min-width: 260px;
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
</style>
