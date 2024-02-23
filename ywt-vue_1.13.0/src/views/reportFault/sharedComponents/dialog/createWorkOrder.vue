<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-03 11:19:14
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-21 17:21:55
 * @Description: 创建工单弹窗
-->
<template>
  <div class="drawer">
    <div class="header">
      <span class="title">
        工单信息
      </span>
    </div>

    <div class="body">
      <el-row :gutter="16" type="flex" justify="space-around">
        <el-col :span="10">
          <fault-info
            ref="fault"
            :fault="fault"
            :type="type"
            class="fault-info"
          />
        </el-col>
        <el-col :span="10" class="middle-col">

          <div><answer-info
            ref="info"
            :info="info"
            class="answer-info"
            :is-pop="type==='pop'"
            @phoneChange="handlePhoneChange"
          />
          </div>
          <div v-if="relatedList.length>0" class="flex-container">
            <related-info class="related-info" :data="relatedList" @relate="handleRelate" />
          </div>
        </el-col>
        <el-col :span="4">
          <process-flow
            :order-num="orderNum"
            class="process-flow"
          />
        </el-col>
      </el-row>
    </div>

    <div class="button">

      <el-button
        type="primary"
        size="mini"
        :loading="createButtonLoading"
        @click="onCreateTicket"
      >创建工单</el-button>
      <el-button
        v-if="info.state === 0"
        type="primary"
        size="mini"
        :loading="phoneSolvedButtonLoading"
        @click="handlePhoneSolved"
      >电话已解决</el-button>
      <el-button
        v-if="info.state === 0"
        type="primary"
        size="mini"
        @click="handlePhoneFind"
      >电话找人</el-button>
      <el-button
        v-if="info.state === 0"
        type="primary"
        size="mini"
        :loading="invalidPhoneButtonLoading"
        @click="handleInvalidPhone"
      >无效电话</el-button>
    </div>
  </div>
</template>

<script>
import {
  createWorkOrder,
} from '@/apis/reportFault/workOrder';
import TicketApi from '@/views/reportFault/api';
import {
  isString,
  omitBy,
  isNil,
} from 'lodash';
import { mapGetters, } from 'vuex';
import FindPersonByPhone from './findPersonByPhone';
import WorkOrderApi from '@/apis/reportFault/workOrder';
import ServiceDeskApi from '@/views/reportFault/center/api';
export default {
  components: {
    ProcessFlow: () => import('../panel/processFlow.vue'),
    FaultInfo: () => import('../panel/faultInfo.vue'),
    AnswerInfo: () => import('../panel/answerInfo.vue'),
    RelatedInfo: () => import('../panel/relatedInfo.vue'),
  },
  props: {
    // 新建类型：弹屏 pop,手动：normal
    type: {
      type: String,
      default: 'normal',
    },
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      relatedList: [],
      createButtonLoading: false,
      phoneSolvedButtonLoading: false,
      invalidPhoneButtonLoading: false,
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    orderNum() {
      return this.data?.info?.orderNum;
    },
    fault() {
      const faultData = omitBy(this.data.fault, isNil);
      const fault = Object.assign({
        source: this.type === 'normal' ? 3 : 1,
        degree: '3',
        rangeType: '1',
        responseType: '1',
        sendUser: null,

      }, faultData);
      if (isString(fault.faultType)) {
        fault.faultType = fault.faultType.split(',');
      }
      if (!fault.createUser) {
        fault.createUser = this.userInfo.id;
      }
      return fault;
    },
    info() {
      const info = Object.assign({
      }, this.data.info);
      this.handlePhoneChange({ phone: info.phone, deptId: info.deptId, });
      return info;
    },
  },
  methods: {
    async handleRelate(orderNum, linkedType) {
      try {
        await WorkOrderApi.relate({
          orderNum,
          id: this.info.id,
          linkedType,
        });
        this.$emit('done');
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    async handlePhoneChange(data) {
      try {
        if (!data.phone && !data.deptId) {
          return;
        }
        if (this.orderNum) {
          const { list, } = await WorkOrderApi.relatedList({ orderNum: this.orderNum,
            phone: data.phone,
            deptId: data.deptId,
          });
          this.relatedList = list;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async handleInvalidPhone() {
      this.invalidPhoneButtonLoading = true;
      await ServiceDeskApi.invalidPhone(this.info?.id);
      this.invalidPhoneButtonLoading = false;
      this.$emit('done');
    },
    async onCreateTicket() {
      try {
        const fault = await this.$refs['fault'].check();
        const info = await this.$refs['info'].check();
        fault.reqTime = Number(fault.reqTime) * 60;
        const data = {
          info,
          ...fault,
        };
        this.createButtonLoading = true;
        await TicketApi.create(data);
        this.createButtonLoading = false;
        this.$emit('done');
      } catch (error) {
        this.createButtonLoading = false;
        if (error) {
          this.$message({
            type: 'error',
            message: error,
            duration: 3000,
          });
        }
      }
    },
    async handlePhoneSolved() {
      try {
        const fault = await this.$refs['fault'].check();
        const info = await this.$refs['info'].check();
        const data = {
          info,
          ...fault,
          sendType: 3,
        };
        this.phoneSolvedButtonLoading = true;
        await createWorkOrder(data);
        this.phoneSolvedButtonLoading = false;
        this.$emit('done');
      } catch (error) {
        this.phoneSolvedButtonLoading = false;
        if (error) {
          this.$message({
            type: 'error',
            message: error,
            duration: 3000,
          });
        }
      }
    },
    async handlePhoneFind() {
      this.$innerDialog({
        title: '电话找人',
        width: '390px',
        top: '32vh',
        position: 'center',
        component: () => <FindPersonByPhone orderId={this.info.id} onDone={this.handlePhoneFindDone} />,
      });
    },
    handlePhoneFindDone() {
      this.$emit('done');
    },
  },
};
</script>

<style lang="scss" scoped>
  .body .el-row {
    height: 100%;
  }
  .button {
    height: 56px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .related-info
  {
    height: 100%;
    &::v-deep .pure-card__body {
      height: calc(100% - 50px);
    }
  }
  .fault-info
  {
    height: 100%;
    &::v-deep .pure-card__body {
      height: calc(100% - 71px);
    }
  }

  .process-flow
  {
    height: 100%;
    &::v-deep .pure-card__body {
      height: calc(100% - 34px);
    }
  }
  .answer-info {
    margin-bottom: 16px;
  }
  .flex-container {
    flex:1;
    overflow: hidden;
  }
  .middle-col {
    display: flex;
    flex-direction: column;
  }
</style>
