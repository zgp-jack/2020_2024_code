<template>
  <pure-panel-card class="panel-card">
    <div slot="header">
      处理记录
    </div>
    <div slot="subHeader">
      <span class="make_info">处理人:
        <span>
          {{ makeInfo.makeUserName }}
        </span>
      </span>
      <span class="make_info">
        响应耗时:
        <span>{{ makeInfo.responseTimeFormat }}</span>
      </span>
      <span class="make_info">
        处理耗时:
        <span>{{ makeInfo.makeTimeFormat }}</span>
      </span>
      <span class="make_info">
        总耗时:
        <span>{{ makeInfo.totalTimeFormat }}</span>
      </span>
    </div>
    <div v-for="(item,index) in makeList" :key="index">
      <!-- 完成 已修改-->
      <template v-if="item.makeType==='complete'">
        <div class="card__header">处理{{ index+1 }}: {{ item.makeTypeToName }}</div>
        <el-descriptions
          :column="2"
          border
          :colon="false"
          :label-style="{ width: '120px' }"
        >
          <el-descriptions-item label="处理人">
            {{ item.makeUserName }}
          </el-descriptions-item>
          <el-descriptions-item label="处理时间">
            {{ item.operDate }}
          </el-descriptions-item>
          <el-descriptions-item label="实际报修地址" :span="2">
            {{ item.processObj ? item.processObj.actualRepairPlaceToName : '' }}
          </el-descriptions-item>
          <el-descriptions-item label="实际故障描述" :span="2">
            {{ item.processObj ? item.processObj.faultRemark : '' }}
          </el-descriptions-item>
          <el-descriptions-item label="实际故障分类" :span="2">
            {{ item.processObj ? item.processObj.faultTypeToName : '' }}
          </el-descriptions-item>
          <el-descriptions-item label="解决办法" :span="2">
            {{ item.processObj ? item.processObj.makeWay : '' }}
          </el-descriptions-item>
          <el-descriptions-item label="实际工时" :span="2">
            {{ item.processObj.realTime ? item.processObj.realTime+'小时' : '' }}
          </el-descriptions-item>
          <el-descriptions-item label="资产名称" :span="2">
            {{ item.processObj ? item.processObj.equipment : '' }}
          </el-descriptions-item>
          <el-descriptions-item label="资产位置" :span="2">
            {{ item.processObj ? item.processObj.equipmentAddress : '' }}
          </el-descriptions-item>
          <el-descriptions-item label="附件" :span="2">
            <pure-attachment-list :list="item.processObj.processEnclosure" />
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <!-- 暂停 已修改-->
      <template v-if="item.makeType==='suspend'">
        <div class="card__header">处理{{ index+1 }}: {{ item.makeTypeToName }}</div>
        <el-descriptions
          :column="2"
          border
          :colon="false"
          :label-style="{ width: '120px' }"
        >
          <el-descriptions-item label="处理人">
            {{ item.makeUserName }}
          </el-descriptions-item>
          <el-descriptions-item label="处理时间">
            {{ item.operDate }}
          </el-descriptions-item>
          <el-descriptions-item label="暂停原因" :span="2">
            {{ item.processObj.reason }}
          </el-descriptions-item>
          <el-descriptions-item label="说明" :span="2">
            {{ item.processObj.remark }}
          </el-descriptions-item>
          <el-descriptions-item label="附件" :span="2">
            <pure-attachment-list :list="item.processObj.enclosure" />
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <!-- 终止 已修改-->
      <template v-if="item.makeType==='end_termination'">
        <div class="card__header">处理{{ index+1 }}: {{ item.makeTypeToName }}</div>
        <el-descriptions
          :column="2"
          border
          :colon="false"
          :label-style="{ width: '120px' }"
        >
          <el-descriptions-item label="处理人">
            {{ item.makeUserName }}
          </el-descriptions-item>
          <el-descriptions-item label="处理时间">
            {{ item.operDate }}
          </el-descriptions-item>
          <el-descriptions-item label="终止原因" :span="2">
            {{ item.processObj.reason }}
          </el-descriptions-item>
          <el-descriptions-item label="说明" :span="2">
            {{ item.processObj.remark }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <!-- 转交 已修改 -->
      <template v-if="item.makeType==='forward'">
        <div class="card__header"><span>处理{{ index+1 }}: {{ item.makeTypeToName }}</span></div>
        <el-descriptions
          :column="2"
          border
          :colon="false"
          :label-style="{ width: '120px' }"
        >
          <el-descriptions-item label="处理人">
            {{ item.makeUserName }}
          </el-descriptions-item>
          <el-descriptions-item label="处理时间">
            {{ item.operDate }}
          </el-descriptions-item>
          <el-descriptions-item label="转交至" :span="2">
            {{ item.processObj.sendName }}
          </el-descriptions-item>
          <el-descriptions-item label="转交原因" :span="2">
            {{ item.processObj.reason }}
          </el-descriptions-item>
          <el-descriptions-item label="说明" :span="2">
            {{ item.processObj.remark }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <!-- 退回 已修改-->
      <template v-if="item.makeType==='back'">
        <div class="card__header">处理{{ index+1 }}: {{ item.makeTypeToName }}</div>
        <el-descriptions
          :column="2"
          border
          :colon="false"
          :label-style="{ width: '120px' }"
        >
          <el-descriptions-item label="处理人">
            {{ item.makeUserName }}
          </el-descriptions-item>
          <el-descriptions-item label="处理时间">
            {{ item.operDate }}
          </el-descriptions-item>
          <el-descriptions-item label="退单原因" :span="2">
            {{ item.processObj.reason }}
          </el-descriptions-item>
          <el-descriptions-item label="退单说明" :span="2">
            {{ item.processObj.remark }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <!-- 处理 已修改-->
      <template v-if="item.makeType==='making'">
        <div class="card__header">处理{{ index+1 }}: {{ item.makeTypeToName }}</div>
        <el-descriptions
          :column="2"
          border
          :colon="false"
          :label-style="{ width: '120px' }"
        >
          <el-descriptions-item label="处理人">
            {{ item.makeUserName }}
          </el-descriptions-item>
          <el-descriptions-item label="处理时间">
            {{ item.operDate }}
          </el-descriptions-item>
          <el-descriptions-item label="处理内容" :span="2">
            {{ item.processObj.remark }}
          </el-descriptions-item>
          <el-descriptions-item label="附件" :span="2">
            <pure-attachment-list :list="item.processObj.processEnclosure" />
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <!-- 工单升级 -->
      <template v-if="item.makeType==='end_upgrade'">
        <div class="card__header">处理{{ index+1 }}: {{ item.makeTypeToName }}</div>
        <el-descriptions
          :column="2"
          border
          :colon="false"
          :label-style="{ width: '120px' }"
        >
          <el-descriptions-item label="处理人">
            {{ item.makeUserName }}
          </el-descriptions-item>
          <el-descriptions-item label="处理时间">
            {{ item.operDate }}
          </el-descriptions-item>
          <el-descriptions-item label="需求标题" :span="2">
            {{ item.processObj.title }}
          </el-descriptions-item>
          <el-descriptions-item label="需求描述" :span="2">
            {{ item.processObj.remark }}
          </el-descriptions-item>
          <el-descriptions-item label="涉及系统" :span="2">
            {{ item.processObj.aboutSystemToName }}
          </el-descriptions-item>
          <el-descriptions-item label="优先级" :span="2">
            {{ item.processObj.levelToName }}
          </el-descriptions-item>
          <el-descriptions-item label="期望完成日期" :span="2">
            {{ item.processObj.endTime }}
          </el-descriptions-item>
          <el-descriptions-item label="提出日期" :span="2">
            {{ item.processObj.startTime }}
          </el-descriptions-item>
          <template v-for="(child,index) in item.processObj.proposeList">
            <el-descriptions-item :key="index" :label="'提出科室'+(index+1)" :span="2">
              {{ child.organizerName }};{{ child.sponsor }};{{ child.phone }}
            </el-descriptions-item>
          </template>
          <el-descriptions-item label="附件" :span="2">
            <pure-attachment-list :list="item.processObj.enclosure" />
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <!-- 多人协作 已修改-->
      <template v-if="item.makeType==='assist'">
        <div class="card__header">处理{{ index+1 }}: {{ item.makeTypeToName }}</div>
        <el-descriptions
          :column="2"
          border
          :colon="false"
          :label-style="{ width: '120px' }"
        >
          <el-descriptions-item label="处理人">
            {{ item.makeUserName }}
          </el-descriptions-item>
          <el-descriptions-item label="处理时间">
            {{ item.operDate }}
          </el-descriptions-item>
          <el-descriptions-item label="协作说明" :span="2">
            {{ item.processObj.assistRemark }}
          </el-descriptions-item>
          <el-descriptions-item label="公共附件" :span="2">
            <pure-attachment-list :list="item.processObj.assistEnclosure" />
          </el-descriptions-item>
          <template v-for="(child,index) in item.processObj.assistList">
            <el-descriptions-item :key="index" :label="'协作人'+(index+1)" :span="2">
              {{ child.sendName }}
            </el-descriptions-item>
            <el-descriptions-item :key="index" label="协作事务" :span="2">
              {{ child.content }}
            </el-descriptions-item>
            <el-descriptions-item :key="index" label="附件" :span="2">
              <pure-attachment-list :list="child.assistEnclosure" />
            </el-descriptions-item>
          </template>
        </el-descriptions>
      </template>
      <!-- 开启 已修改 -->
      <template v-if="item.makeType==='open_suspend'">
        <div class="card__header">处理{{ index+1 }}: {{ item.makeTypeToName }}</div>
        <el-descriptions
          :column="2"
          border
          :colon="false"
          :label-style="{ width: '120px' }"
        >
          <el-descriptions-item label="处理人">
            {{ item.makeUserName }}
          </el-descriptions-item>
          <el-descriptions-item label="处理时间">
            {{ item.operDate }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <!-- 重启 已修改 -->
      <template v-if="item.makeType==='open_termination'">
        <div class="card__header">处理{{ index+1 }}: {{ item.makeTypeToName }}</div>
        <el-descriptions
          :column="2"
          border
          :colon="false"
          :label-style="{ width: '120px' }"
        >
          <el-descriptions-item label="处理人">
            {{ item.makeUserName }}
          </el-descriptions-item>
          <el-descriptions-item label="处理时间">
            {{ item.operDate }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </div>
  </pure-panel-card>
</template>

<script>
import TicketApi from '@/features/ticket/api';

export default {
  props: {
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      makeList: [],
      makeInfo: {
        makeUserName: null,
      },
    };
  },
  watch: {
    data: {
      handler: function (val) {
        this.makeList = val.makeList;
        if (val.info) {
          this.orderTime(val.info.orderNum);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async orderTime(orderNum) {
      if (orderNum) {
        this.makeInfo = await TicketApi.orderTime(orderNum);
        console.log(this.makeInfo);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/common/styles/theme/handle.scss";
.card__header {
  display: flex;
  align-items: center;
  height: 47px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  @include font_color_imp('color-assist-gray');
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  padding: 0 16px;
  &::before {
    content: '';
    width: 5px;
    height: 50%;
    margin-right: 6px;
    top: 0;
    left: 0;
    @include background_color_imp('color-primary');
  }
}
.make_info{
  @include font_color_imp('color-primary');
  span{
    color: #2c3e50 !important;
  }
}
</style>
