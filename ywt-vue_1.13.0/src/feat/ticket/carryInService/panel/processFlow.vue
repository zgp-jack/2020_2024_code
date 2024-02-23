<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-16 16:06:07
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-27 00:03:52
 * @Description:历史流程面板
-->
<template>
  <pure-card v-loading="loading" class="max-height ticket" :disabled="disabled">
    <div slot="header">历史流程</div>
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
          操作人： {{ item.createUserToName }}
          <template v-if="item.operState==='new_repair'">
            <div> 送修方式：{{ item.reasonToName }}</div>
          </template>
          <div v-if="item.operState==='confirm_quote'&&item.processValue">
            审核结果: {{ item.processValue }}
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
    <div v-if="tip" class="tip">{{ tip }}</div>
  </pure-card>
</template>

<script>
import CarryInServiceApi from '../api';
export default {
  name: 'CarryInServiceFlowPanel',
  components: {
  },
  props: {
    // 送修编号
    id: {
      type: Number,
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
    async fetchData() {
      try {
        if (!this.id) {
          return;
        }
        this.processData = await CarryInServiceApi.processFlow(this.id);
      } catch (error) {
        this.tip = '流程信息获取失败';
        console.error(error);
      } finally {
        this.loading = false;
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
