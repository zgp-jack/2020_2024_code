<template>
  <pure-panel-card class="max-height">
    <div slot="header">处理信息</div>
    <div slot="subHeader">

      <span class="createUser">
        处理人:
        <span>
          {{ dealEngineerId }}
        </span>
      </span>
      <span class="createUser">
        处理时间:
        <span>
          {{ dealTime }}
        </span>
      </span>
    </div>
    <el-form
      size="mini"
      label-width="128px"
    >
      <el-form-item label="处理状态">
        <el-select
          v-model="operationType"
          :disabled="enableOperationList.length === 1"
        >
          <el-option
            v-for="item in enableOperationList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <component
      :is="operationType"
      ref="component"
      :disabled="disabled"
      v-bind="$attrs"
      style="padding-right: 16px;"
    />
  </pure-panel-card>
</template>

<script>
import Back from './back.vue';
import Assist from './assist.vue';
import Complete from './complete.vue';
import EndTermination from './endTermination.vue';
import EndUpgrade from './endUpgrade.vue';
import Forward from './forward.vue';
import Making from './making.vue';
import Suspend from './suspend.vue';
import { mapGetters, } from 'vuex';
import moment from 'moment';
export default {
  name: 'TicketDealFormPanel',
  components: {
    Back,
    Assist,
    Complete,
    EndTermination,
    EndUpgrade,
    Forward,
    Making,
    Suspend,
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
      // 操作类型
      operationType: '',
      // 当前可执行操作
      enableOperationList: [],
      dealTime: null,
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
          label: '退单',
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
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
    dealEngineerId() {
      return this.userInfo.nickName;
    },

  },
  async mounted() {
    //   this.formData = Object.assign({}, this.formData, this.make);
    // const { value: configValue, } = await OtherSettingApi.getTicketTimeConfig('processInfo');
    try {
      // const configValueObj = JSON.parse(configValue);
      // if (configValueObj.makeTime === 1) {
      //   this.requiredDealTime = true;
      // }
      this.dealTime = moment().format('YYYY-MM-DD HH:mm:ss');
    } catch (error) {
      this.$message.error('获取工单时间配置出错');
    }
    if (this.ticketId) {
      // const data = await TicketApi.lastProcess(this.ticketId);
      // if (data) {
      //   this.formData = Object.assign({}, this.formData, data);
      //   this.enableOpertionList = this.operationTypeList;
      //   this.operationType = camelCase(this.formData.operState);
      // }
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
          enableOperation = [
            'endTermination',
          ];

          break;
        // 点击暂停按钮
        case 'suspend':
          enableOperation = [
            'suspend',
          ];
          break;
        // 点击退回按钮
        case 'back':
          enableOperation = [
            'back',
          ];
          break;
        // 处理按钮筛选
        case 'making':
          if (this.isAssist) {
            enableOperation = [
              'complete',
              'making',
              'suspend',
              'forward',
              'back',
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
              'assist',
            ];
          }

          break;
      }
      this.enableOperationList = this.operationTypeList.filter(item =>
        enableOperation.includes(item.value)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.createUser,
.createTime {
  color: #879bba;
  margin-right: 10px;
  span {
    font-weight: 400;
    color: #2d405e;
  }
}
</style>
