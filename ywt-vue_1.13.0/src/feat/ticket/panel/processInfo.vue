<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-24 17:09:19
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-26 15:49:23
 * @Description:工单处理面板
-->
<template>
  <pure-card class="max-height" :disabled="disabled">
    <div slot="header">
      处理信息
      <span
        v-if="dealEngineerId"
        class="makeUser"
      >处理人:
        <span>{{ dealEngineerId | staffId }}</span>
      </span>
    </div>
    <div slot="subHeader">
      <span v-if="formData.responseTime" class="responseTime">
        响应耗时：
        <span>{{ formData.responseTime | minuteToDay }}</span>
      </span>
      <span v-if="formData.makeTime" class="makeTime">
        处理耗时：
        <span>{{ formData.makeTime | minuteToDay }}</span>
      </span>
      <span v-if="formData.makeTime + formData.responseTime" class="totalTime">
        总耗时：
        <span>{{
          (formData.makeTime + formData.responseTime) | minuteToDay
        }}</span>
      </span>
    </div>
    <el-form
      label-position="right"
      label-width="128px"
      size="mini"
      :disabled="disabled"
    >
      <el-form-item v-if="operationType" label="处理状态">
        <el-select
          v-model="operationType"
          :disabled="enableOpertionList.length === 1"
          style="width: 160px"
        >
          <el-option
            v-for="item in enableOpertionList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span v-if="operationType==='endUpgrade'" class="tip-end-upgrade"><i class="el-icon-warning-outline" />此工单升级后不可再由需求转为工单</span>
      </el-form-item>

      <div v-else class="tip">暂未开始处理</div>
    </el-form>
    <component
      :is="operationType"
      ref="component"
      :disabled="disabled"
      :default-data="formData"
      :required-deal-time="requiredDealTime"
      v-bind="$attrs"
    />
  </pure-card>
</template>

<script>
import TicketApi from '@/feat/ticket/api';
import OtherSettingApi from '@/feat/system/otherSetting/api';
import EndTermination from './dealForm/endTermination.vue';
import Complete from './dealForm/complete.vue';
import Suspend from './dealForm/suspend.vue';
import Forward from './dealForm/forward.vue';
import Back from './dealForm/back.vue';
import Making from './dealForm/making.vue';
import EndUpgrade from './dealForm/endUpgrade.vue';
import Assist from './dealForm/assist.vue';
import DicRadio from '@/feat/system/dictionary/normal/component/dicRadio.vue';
import { camelCase, } from 'lodash';
import { mapGetters, } from 'vuex';
export default {
  components: {
    DicRadio,
    EndTermination,
    Complete,
    Suspend,
    Forward,
    Back,
    Making,
    EndUpgrade,
    Assist,
    FaultTypeSelect: () =>
      import('@/views/reportFault/sharedComponents/select/faultTypeSelect.vue'),
    Upload: () => import('@/components/upload'),
    LevelSelect: () =>
      import('@/views/project/components/select/levelSelect.vue'),
    AboutSystemSelect: () =>
      import('@/views/project/components/select/aboutSystemSelect.vue'),
  },
  props: {
    // 控制面板可选择状态
    disabled: {
      type: Boolean,
      default: false,
    },
    make: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // 更新工单时的处理操作
    dealType: {
      type: String,
      default: '',
    },
    ticketId: {
      type: String,
      default: null,
    },
    // 是否是协助工单
    isAssist: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selfId: this.$store.state.login.userInfo.id,
      // 操作类型
      operationType: '',
      // 当前可执行操作
      enableOpertionList: [],
      // 操作类型列表
      operationTypeList: [
        {
          label: '完成',
          value: 'complete',
        },
        {
          label: '暂停工单',
          value: 'suspend',
        },
        {
          label: '终止工单',
          value: 'endTermination',
        },
        {
          label: '转交',
          value: 'forward',
        },
        {
          label: '退回',
          value: 'back',
        },
        {
          label: '处理',
          value: 'making',
        },
        {
          label: '工单升级',
          value: 'endUpgrade',
        },
        {
          label: '多人协作',
          value: 'assist',
        }
      ],
      // 操作信息
      formData: {
        responseTime: 0,
        makeTime: 0,
        makeUser: null,
      },
      requiredDealTime: false,
    };
  },
  computed: {
    dealEngineerId() {
      return this.formData.makeUser;
    },
    ...mapGetters(['userInfo']),
  },
  async mounted() {
    this.formData = Object.assign({}, this.formData, this.make);
    const { value: configValue, } = await OtherSettingApi.getTicketTimeConfig('processInfo');
    try {
      const configValueObj = JSON.parse(configValue);
      if (configValueObj.makeTime === 1) {
        this.requiredDealTime = true;
      }
    } catch (error) {
      this.$message.error('获取工单时间配置出错');
    }
    if (this.ticketId) {
      const data = await TicketApi.lastProcess(this.ticketId);
      if (data) {
        this.formData = Object.assign({}, this.formData, data);
        this.enableOpertionList = this.operationTypeList;
        this.operationType = camelCase(this.formData.operState);
      }
    } else {
      this.operationType = this.dealType === 'making' ? 'complete' : this.dealType;
      this.filterOperateList(this.dealType);
    }
  },
  methods: {
    // 表单提交，提供给父级调用
    async onSubmit(ticketId) {
      await this.$refs.component.onSubmit(ticketId);
    },

    // 筛选可选按钮
    filterOperateList(operateType) {
      let enableOperation = [];
      switch (operateType) {
        // 点击终止按钮
        case 'endTermination':
          enableOperation = ['endTermination'];

          break;
        // 点击暂停按钮
        case 'suspend':
          enableOperation = ['suspend'];
          break;
        // 点击退回按钮
        case 'back':
          enableOperation = ['back'];
          break;
        // 处理按钮筛选
        case 'making':
          if (this.isAssist) {
            enableOperation = [
              'complete',
              'making',
              'suspend',
              'forward',
              'back'
            ];
          } else {
            enableOperation = [
              'complete',
              'making',
              'suspend',
              'forward',
              'endTermination',
              'back',
              'endUpgrade',
              'assist'
            ];
          }

          break;
      }
      this.enableOpertionList = this.operationTypeList.filter(item =>
        enableOperation.includes(item.value)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.makeUser,
.responseTime,
.makeTime,
.totalTime {
  color: #879bba;
  font-size: $--pure-little-font-size;
  span {
    font-weight: 400;
    color: #2d405e;
  }
}
.makeUser {
  padding-left: 36px;
}
.responseTime,
.makeTime {
  padding-right: 38px;
}
.tip {
  text-align: center;
  font-size: $--pure-base-font-size;
  color: #2d405e;
  &-end-upgrade {
    margin-left: 24px;
    color: #F56C6C;
  }
}
</style>
