/**
* @file rectificationTime.vue
* @author huang
* @date 2023/10/12
* @description 限期整改时间
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <pure-panel-card>
    <div slot="header">限期整改</div>

    <el-descriptions
      :column="1"
      border
    >
      <el-descriptions-item label="整改日期">
        {{ itemData.rectifyStartDate }}{{ itemData.rectifyEndDate }}
      </el-descriptions-item>
      <el-descriptions-item label="整改责任人">
        {{ itemData.rectifyUserName }}
      </el-descriptions-item>
      <el-descriptions-item label="整改要求及建议">
        {{ itemData.rectifyOpinion }}
      </el-descriptions-item>
      <el-descriptions-item label="录音">
        <pure-audio :the-url="itemData.soundFile" />
      </el-descriptions-item>
      <el-descriptions-item label="是否为转交任务">

        {{ itemData.transmitRecordList ? '是' : '否' }}
        <template v-if="itemData.transmitRecordList">
          由
          {{ itemData.transmitRecordList[0].transmitUserName }}
          转交给
          {{ itemData.transmitRecordList[0].receiveUserName }};
          {{ itemData.transmitRecordList[0].createTime }};

        </template>
      </el-descriptions-item>
    </el-descriptions>
  </pure-panel-card>
</template>
<script>
export default {
  props: {
    itemData: {
      type: Object,
      default: () => {
        return {
          rectifyStartDate: '',
          rectifyEndDate: '',
          rectifyUserName: '',
          rectifyOpinion: '',
          soundFile: '',
          resultElaborate: '',
        };
      },
    },
  },
};
</script>
<style lang='scss'
  scoped
>

</style>
