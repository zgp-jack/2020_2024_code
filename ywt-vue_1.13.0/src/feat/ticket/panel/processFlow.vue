<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-24 17:08:53
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-25 17:42:10
 * @Description: 工单处理流程面板
-->
<template>
  <pure-card v-loading="loading" class="max-height ticket" :disabled="disabled">
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
        <div v-if="item.operState==='start_investigate'">
          <a class="requirement_id base-margin-top" @click="onViewRequirement(item.objId)">{{ item.objId }}</a>
        </div>
        <div class="process">
          {{ item.createUser | staffId }}

          <template v-if="item.operState.includes('forward')">
            转单给
            <span class="dispatch">
              {{ item.sendUserToName }}
            </span>
          </template>
          <template v-else-if="item.operState.includes('allocate')">
            派单给
            <span class="dispatch">
              {{ item.processValueToName }}
            </span>
          </template>
          <template v-else-if="item.operState.includes('auto_receiving')">
            自动派单给
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
              <el-button v-if="operatorType==='UPDATE'&& assistItem.currState==='wait_delivery'" type="text" size="mini" @click="onDispatchTicket(assistItem.childOrderNum)"> 派单</el-button>
            </div>
          </div>
          <div v-if="item.operState==='start_investigate'">
            <pure-button label="查看需求" type="wire-frame" @click="onViewRequirement(item.objId)" />
          </div>
          <div v-if="item.operState==='edit_order'">

            <el-popover
              placement="bottom"
              width="200"
              trigger="click"
            >
              <div v-for="(val,key,index2) in (convertEditRecord(item.processValue))" :key="index2" class="edit-record">

                <div class="label">{{ key }}</div>
                <div class="old-value">原：{{ val.oldValue }}</div>
                <div class="new-value">现：{{ val.newValue }}</div>
              </div>
              <pure-button slot="reference" label="查看修改项" type="text" />
            </el-popover>
          </div>
        </div>

        <preview
          v-if="item.processEnclosure"
          :file-list="item.processEnclosure | stringifyToArr"
        />
        <div v-if="item.transHistory" class="reason">
          转交记录:{{ item.transHistory }}
        </div>
        <div v-if="item.remark" class="reason">
          <div>说明：</div>
          <div class="remark">{{ item.remark | faultRemarkFormatter }}</div>
          <!-- <div>说明：</div>
          <Q-paste-up
            ref="Q"
            :data-dom="item.remark"
          /> -->
        </div>
        <div v-if="item.makeWay" class="reason">
          解决方法:{{ item.makeWay }}
        </div>
        <div v-if="['suspend','back','end_termination','forward','forward_team'].includes(item.operState)" class="reason">
          原因：{{ item.processValueToName }}
        </div>
      </el-timeline-item>
    </el-timeline>
    <div v-if="tip" class="tip">{{ tip }}</div>
  </pure-card>
</template>

<script>
import { faultRemarkFormatter, } from '../filter';
import TicketApi from '../api';
import DispatchTicketDialog from '../dialog/dispatch.vue';
import TicketInfoDrawer from '@/feat/ticket/drawer/ticket.vue';
import SearchDemandPanel from '@/views/project/needSetting/drawer/demandPanel.js';

export default {
  name: 'ProcessFlow',
  components: {
    preview: () => import('@/components/preview/index.vue'),
  },
  filters: {
    faultRemarkFormatter,
  },
  props: {
    // 工单编号
    id: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    operatorType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      processData: [],
      loading: true,
      tip: '',
    };
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async onViewTicket(ticketId) {
      this.$innerDrawer({
        width: '1688px',
        component: () => <TicketInfoDrawer operatorType='VIEW' id={ticketId}/>,
      });
    },
    /**
     * 派单
     * @param {String} ticketId 工单编号
     */
    async onDispatchTicket(ticketId) {
      this.$innerDrawer({
        width: '548px',
        component: () => <DispatchTicketDialog ticketId={ticketId} onDone={this.fetchData}/>,
      });
    },
    /**
     * 查看需求
     * @param {String} requirementId 需求编号
     */
    async onViewRequirement(requirementId) {
      SearchDemandPanel(requirementId);
    },
    async fetchData() {
      try {
        if (!this.id) {
          return;
        }
        this.processData = await TicketApi.processFlow(this.id);
      } catch (error) {
        this.tip = '流程信息获取失败';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    convertEditRecord(data) {
      try {
        const dataJson = JSON.parse(data);
        return dataJson;
      } catch (error) {
        console.error(error);
        return {};
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
.requirement_id {
  color: #426ED7;
  text-decoration: underline;
  display: inline-block;
}
.tip {
  color: $--pure-color-danger;
  padding: 10px 0;
  text-align: center;
}
.edit-record {
  font-size: $--pure-base-font-size;
  margin-bottom: 24px;
  .label {
    color: #426ED7;
  }
  .old-value {
    color: #7D8DB3;
  }
  .new-value {
    color: #334266;
  }
}
</style>
