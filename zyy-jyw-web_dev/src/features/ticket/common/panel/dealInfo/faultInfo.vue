<template>
  <pure-panel-card class="panel-card">
    <div slot="header">
      故障信息
    </div>
    <div slot="subHeader">
      <span
        v-if="faultInfo.createUserName"
        class="createUser"
      >建单人:
        <span>
          {{ faultInfo.createUserName }}
        </span>
      </span>
      <span v-if="faultInfo.createTime" class="createTime">
        建单时间:
        <span>{{ faultInfo.createTime }}</span>
      </span>

    </div>
    <el-descriptions
      :column="1"
      border
      :colon="false"
    >
      <el-descriptions-item label="故障描述" :span="2">
        {{ faultInfo.faultRemark }}
      </el-descriptions-item>
      <el-descriptions-item label="故障分类">
        {{ faultInfo.faultTypeToName }}
      </el-descriptions-item>
      <el-descriptions-item label="处理人">
        {{ faultInfo.makeUserName }}
      </el-descriptions-item>
      <el-descriptions-item label="工单来源">
        {{ faultInfo.sourceToName }}
      </el-descriptions-item>
      <el-descriptions-item label="备注">
        {{ faultInfo.remarks }}
      </el-descriptions-item>
      <el-descriptions-item label="是否为特殊工单">
        {{ faultInfo.specialOrderToName }}
      </el-descriptions-item>
      <!--<el-descriptions-item label="实际报修地址">
        {{ faultInfo.actualRepairPlaceToName }}
      </el-descriptions-item>-->
      <el-descriptions-item label="紧急程度">
        {{ faultInfo.degreeToName }}
      </el-descriptions-item>
      <el-descriptions-item label="影响范围">
        {{ faultInfo.rangeTypeToName }}
      </el-descriptions-item>
      <el-descriptions-item label="响应类型">
        {{ faultInfo.responseTypeToName }}
      </el-descriptions-item>
      <el-descriptions-item label="期望完成时间">
        {{ faultInfo.completeTypeToName }}
      </el-descriptions-item>
      <el-descriptions-item label="完成时间">
        {{ faultInfo.completeTime }}
      </el-descriptions-item>
      <!--      <el-descriptions-item label="资产名称">
        {{ faultInfo.equipment }}
      </el-descriptions-item>
      <el-descriptions-item label="资产位置">
        {{ faultInfo.equipmentAddress }}
      </el-descriptions-item>-->
      <el-descriptions-item label="附件">
        <pure-attachment-list :list="faultInfo.enclosure" />
      </el-descriptions-item>
    </el-descriptions>
  </pure-panel-card>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: function () {
        return {

        };
      },
    },
  },
  data() {
    return {
      faultInfo: {
        createTime: null,
      },
    };
  },
  watch: {
    data: {
      handler: function (val) {
        this.faultInfo = Object.assign({}, val.fault);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-card {
  ::v-deep .pure-card__body {
    padding: 0;
  }
}
.createUser,
.createTime {
  color: #879bba;
  margin-right: 10px;
  span {
    font-weight: 400;
    color: #2d405e;
  }
}
:deep(.el-descriptions__body) {
  .el-descriptions-item__content {
    min-width: 120px;
    max-width: 500px;
    word-break: break-all; // 让内容超出列宽时自动换行显示
    word-wrap: break-word;
  }
}
/* 长文件名称缩短*/
:deep(.el-upload-list__item-name){
  width: 280px;
}
</style>
