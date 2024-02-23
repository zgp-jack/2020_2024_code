
<template>
  <div class="switch-box">
    <el-collapse v-model="activeName" class="switch-item" @change="handleCollapseChange">
      <el-collapse-item name="order">
        <template slot="title">
          <collapseTitle :is-open="mockData.order.enable" :config-type="configType" :title-and-info="titleAndInfo.order" @isOpenClick="isOpenClick" />
        </template>
        <orderAudit :mock-data="mockData.order" :config-type="configType.parentType[activeName]" />
      </el-collapse-item>
      <el-collapse-item name="mandatory">
        <template slot="title">
          <collapseTitle :has-switch="false" :is-open="mockData.mandatory.enable" :config-type="configType" :title-and-info="titleAndInfo.mandatory" @isOpenClick="isOpenClick" />
        </template>
        <mandatoryInfo :mock-data="mockData.mandatory" />
      </el-collapse-item>
      <el-collapse-item name="seatConfig" title="服务台上下线时间配置">
        <template slot="title">
          <collapseTitle :has-switch="false" :is-open="mockData.seatConfig.enable" :config-type="configType" :title-and-info="titleAndInfo.seatConfig" @isOpenClick="isOpenClick" />
        </template>
        <seat-config :mock-data="mockData.seatConfig" />
      </el-collapse-item>
      <el-collapse-item name="serveTimeliness" title="服务时效性配置">
        <template slot="title">
          <collapseTitle :has-switch="false" :is-open="mockData.serveTimeliness.enable" :config-type="configType" :title-and-info="titleAndInfo.serveTimeliness" @isOpenClick="isOpenClick" />
        </template>
        <serve-timeliness />
      </el-collapse-item>
      <el-collapse-item name="warningConfig">
        <template slot="title">
          <collapseTitle :has-switch="false" :is-open="mockData.warningConfig.enable" :config-type="configType" :title-and-info="titleAndInfo.warningConfig" @isOpenClick="isOpenClick" />
        </template>
        <warning-config :mock-data="mockData.warningConfig" />
      </el-collapse-item>

      <el-collapse-item name="DecentConfig" title="待派单提醒配置">
        <template slot="title">
          <collapseTitle :has-switch="false" :is-open="mockData.decentConfig.enable" :config-type="configType" :title-and-info="titleAndInfo.decentConfig" @isOpenClick="isOpenClick" />
        </template>
        <decent-config />
      </el-collapse-item>
      <el-collapse-item name="QrCodeConfig" title="二维码配置">
        <template slot="title">
          <collapseTitle :has-switch="false" :is-open="mockData.qrConfig.enable" :config-type="configType" :title-and-info="titleAndInfo.qrConfig" @isOpenClick="isOpenClick" />
        </template>
        <q-r-code-config />
      </el-collapse-item>
      <el-collapse-item name="workOrderReceptionDepartment" title="工单接单科室">
        <template slot="title">
          <collapseTitle :has-switch="false" :is-open="mockData.workOrderReceptionDepartment.enable" :config-type="configType" :title-and-info="titleAndInfo.workOrderReceptionDepartment" @isOpenClick="isOpenClick" />
        </template>
        <work-order-reception-department />
      </el-collapse-item>
      <el-collapse-item name="autoOrder" title="自动派单">
        <template slot="title">
          <collapseTitle :has-switch="true" :is-open="isAutoDispatch" :config-type="configType" :title-and-info="titleAndInfo.autoOrder" @isOpenClick="openAutoOrder" />
        </template>
        <AutoOrder ref="autoOrder" @init="initAutoOrder" />
      </el-collapse-item>
      <el-collapse-item name="workOrderTimeConfig" title="工单时间配置">
        <template slot="title">
          <collapseTitle :has-switch="false" :is-open="mockData.autoOrder.enable" :config-type="configType" :title-and-info="titleAndInfo.workOrderTimeConfig" />

        </template>

        <WorkOrderTimeConfig />
      </el-collapse-item>

    </el-collapse>
  </div>
</template>

<script>
import OtherSettingApi from '../api';
import collapseTitle from '../components/collapseTitle.vue';
import orderAudit from '../components/orderAudit.vue';
import mandatoryInfo from '../components/mandatoryInfo.vue';
import SeatConfig from '../components/seatConfig.vue';
import ServeTimeliness from '../components/serveTimeliness.vue';
import WarningConfig from '../components/warningConfig.vue';
import DecentConfig from '../components/decentConfig.vue';
import QRCodeConfig from '../components/qrCodeConfig.vue';
import WorkOrderReceptionDepartment from '../components/workOrderReceptionDepartment.vue';
import AutoOrder from '../components/autoOrder.vue';
import WorkOrderTimeConfig from '../components/workOrderTimeConfig.vue';
import { mapActions, mapGetters, mapState, } from 'vuex';
import { arrayToString, } from '@/utils/common';
export default {
  components: {
    collapseTitle,
    orderAudit,
    mandatoryInfo,
    SeatConfig,
    ServeTimeliness,
    WarningConfig,
    DecentConfig,
    QRCodeConfig,
    WorkOrderReceptionDepartment,
    AutoOrder,
    WorkOrderTimeConfig,
  },
  props: {
    idKey: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      mockData: {
        order: {
          enable: false,
          fault: {
            enable: false,
            fault_source: {
              enable: false,
              value: [],
            },
            fault_classify: {
              enable: false,
              value: [],
            },
          },
          group: {
            enable: false,
            group_user: {
              enable: false,
              value: [],
            },
          },
        },
        mandatory: {
          enable: false,
          repair_place: {
            enable: false,
            value: [],
          },
          repair_dept: {
            enable: false,
            value: [],
          },
          repair_user: {
            enable: false,
            value: [],
          },
          repair_phone: {
            enable: false,
            value: [],
          },
        },
        seatConfig: {
          enable: false,
        },
        serveTimeliness: {
          enable: false,
        },
        warningConfig: {
          enable: false,
        },
        decentConfig: {
          enable: false,
        },
        qrConfig: {
          enable: false,

        },
        workOrderReceptionDepartment: {
          enable: false,
        },
        autoOrder: {
          enable: false,

        },
        workOrderTimeConfig: {
          enable: false,

        },

      },
      activeName: ['order'],
      titleAndInfo: {
        order: {
          title: '工单审核',
          info: '开启工单审核后所有工单需审核后才可结束',
          isOpen: false,
          name: 'order',
        },
        mandatory: {
          title: '报修信息必填项配置',
          info: '配置报修信息必填项',
          isOpen: false,
          name: 'mandatory',
        },
        seatConfig: {
          title: '服务台上下线时间配置',
          info: null,
          isOpen: false,
          name: 'seatConfig',
        },
        serveTimeliness: {
          title: '服务时效性配置',
          info: null,
          isOpen: false,
          name: 'serveTimeliness',
        },

        warningConfig: {
          title: '告警消息配置',
          info: '配置大屏和服务台集中报修消息预警提示',
          isOpen: false,
          name: 'warningConfig',
        },
        decentConfig: {
          title: '待派单提醒配置',
          info: null,
          isOpen: false,
          name: 'decentConfig',
        },
        qrConfig: {
          title: '二维码配置',
          info: null,
          isOpen: false,
          name: 'QrCodeConfig',
        },
        workOrderReceptionDepartment: {
          title: '工单接单科室',
          info: null,
          isOpen: false,
          name: 'WorkOrderReceptionDepartment',
        },
        autoOrder: {
          title: '自动派单',
          info: null,
          isOpen: false,
          name: 'autoOrder',
        },
        workOrderTimeConfig: {
          title: '工单时间配置',
          info: null,
          isOpen: false,
          name: 'workOrderTimeConfig',
        },

      },
      typeTree: { // 类型树
        reportFault: { // 报障
          type: 'reportFault',
          order: { // 工单审核
            type: 'order',
            fault: {
              type: 'fault',
              fault_source: {
                type: 'fault_source',
              },
              fault_classify: {
                type: 'fault_classify',
              },
            },
            group: {
              type: 'group',
              group_user: {
                type: 'group_user',
              },
            },
          },
        },
        // 预留 其他...
      },
    };
  },
  computed: {
    ...mapState('systemOtherSetting/autoOrder', ['dispatchModeData']),
    ...mapGetters('systemOtherSetting/autoOrder', ['isAutoDispatch']),
    configType() {
      if (this.idKey && this.activeName) {
        return {
          parentType: this.typeTree[this.idKey],
          type: this.activeName,
        };
      } else {
        return {};
      }
    },
  },
  created() {
    this.getGroupListAllByTopType();
  },
  methods: {
    ...mapActions('systemOtherSetting/autoOrder', ['SET_DISPATCH_MODE_DATA']),
    openAutoOrder(e, info) {
      const data = {
        ...this.dispatchModeData,
      };
      data.open = e ? 1 : 0;
      data.whereaboutsList = arrayToString(data.whereaboutsList);
      this.SET_DISPATCH_MODE_DATA(data);
    },
    initAutoOrder(val) {
      this.mockData.autoOrder.enable = val;
    },
    getGroupListAllByTopType() {
      OtherSettingApi.groupListAllByTopType({ type: this.idKey, }).then(res => {
        if (res) {
          const { order, mandatory, } = res;
          if (order) this.mockData.order = order;
          if (mandatory) this.mockData.mandatory = mandatory;
        } else {
          this.mockData = { // 防止后台返回null 导致找不到对应key 报错
            order: {
              enable: false,
              fault: {
                enable: false,
                fault_source: {
                  enable: false,
                  value: [],
                },
                fault_classify: {
                  enable: false,
                  value: [],
                },
              },
              group: {
                enable: false,
                group_user: {
                  enable: false,
                  value: [],
                },
              },
            },
            mandatory: {
              enable: false,
              repair_place: {
                enable: false,
                value: [],
              },
              repair_dept: {
                enable: false,
                value: [],
              },
              repair_user: {
                enable: false,
                value: [],
              },
              repair_phone: {
                enable: false,
                value: [],
              },
            },
          };
        }
      });
    },
    isOpenClick(e, info) {
      let isClose = '';
      e ? isClose = '启用' : isClose = '停用';
      this.$confirm(`${info.title}将${isClose}, 请确认！`, {
        type: 'warning',
      }).then(() => {
        this.activeName = info.name;
        this.mockData[info.name].enable = e;
        // this.mockData[info.name].fault.enable = e;
        const params = {
          parentType: this.configType.parentType.type,
          type: this.configType.type,
        };
        OtherSettingApi.mutexSwitch(params).then(res => { // 第一次默认启用使用故障
          this.getGroupListAllByTopType();
          this.$message({
            type: 'success',
            message: res,
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消!',
        });
      });
    },
    handleCollapseChange(v) {
      if (v.length > 0) {
        this.activeName = v.pop();
      }
    },
    // 递归查找对应数据

  },
};
</script>

<style lang="scss" scoped>
.switch-box{
  margin-top: 5px;
  .switch-item{
    position: relative;
  }
}
.w100{
  width: 100%;
}
</style>
