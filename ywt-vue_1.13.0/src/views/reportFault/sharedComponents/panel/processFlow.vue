<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-06 12:58:07
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-18 19:17:11
 * @Description: 处理流程面板
-->
<template>
  <pure-card class="max-height ticket" :disabled="disabled">
    <div slot="header">处理流程</div>
    <el-timeline :reverse="false">
      <el-timeline-item
        v-for="(item,index) in processData"
        :key="index"
        :timestamp="item.createTime"
        placement="top"
      >
        <div class="">
          <pure-button :label="item.operStateToName" type="ghost" size="mini" :disabled="disabled" />
        </div>
        <div class="process">
          {{ item.createUser | staffId }}

          <template v-if="item.operState.includes('forward')">
            转单给
            <span class="dispatch">
              {{ item.processValueToName }}
            </span>
          </template>
          <template v-else-if="item.operState.includes('allocate')">
            派单给
            <span class="dispatch">
              {{ item.processValueToName }}
            </span>
          </template>
          <template v-else>
            {{ item.operStateToName }}
          </template>
          <div v-if="item.operState==='assist'">
            <div v-for="(assistItem,assistIndex) in item.assistList" :key="assistIndex">
              <span>{{ assistItem.sendUserToName || assistItem.sendTeamToName }} </span>
              <span :class="'state--'+assistItem.currState"> {{ assistItem.currStateToName }} </span>
              <el-button type="text" size="mini" @click="onViewTicket(assistItem.childOrderNum)"> 查看</el-button>
            </div>
          </div>
        </div>

        <preview
          v-if="item.processEnclosure"
          :file-list="item.processEnclosure | stringifyToArr"
        />
        <div v-if="item.transHistory" class="reason">
          转交记录:{{ item.transHistory }}
        </div>
        <div v-if="item.remark" class="reason">说明:{{ item.remark }}</div>
        <div v-if="item.makeWay" class="reason">
          解决方法:{{ item.makeWay }}
        </div>
        <div v-if="item.processValueName" class="reason">
          原因：{{ item.processValueName }}
        </div>
      </el-timeline-item>
    </el-timeline>
  </pure-card>
</template>

<script>
import { getProcessInfoByOrderNum, } from '@/apis/reportFault/workOrder';
import WorkOrderApi from '@/apis/reportFault/workOrder';
import ViewWorkOrder from '@/views/reportFault/sharedComponents/dialog/viewWorkOrder.vue';
export default {
  components: {
    preview: () => import('@/components/preview/index.vue'),
  },
  props: {
    orderNum: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      processData: [],
    };
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async onViewTicket(orderNum) {
      try {
        const data = await WorkOrderApi.detail(orderNum);
        this.$innerDrawer({
          width: '1688px',
          component: () => <ViewWorkOrder data={data}/>,
        });
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    async fetchData() {
      try {
        if (!this.orderNum) {
          return;
        }
        this.processData = await getProcessInfoByOrderNum({
          orderNum: this.orderNum,
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/ticket.scss";
.el-timeline {
    padding-inline-start: 0px;
    .el-timeline-item__timestamp {
      color: #879bba;
    }
    .process,
    .reason {
      padding-top: 6px;
      color: #2d405e;
      overflow-wrap: anywhere;
      line-height: 28px;
    }
  }
.dispatch {
    color: $--pure-color-success;
}
</style>
