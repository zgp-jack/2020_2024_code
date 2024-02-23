/**
* @file inspectionRectificationTime.vue
* @author huang
* @date 2023/10/11
* @description 巡检限期整改
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <hyy-panel-card>
    <div slot="header">限期整改</div>
    <el-descriptions
      :column="1"
      border
    >
      <el-descriptions-item label="整改日期">
        {{ itemData.rectifyStartDate }} - {{ itemData.rectifyEndDate }}
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
    </el-descriptions>
  </hyy-panel-card>
</template>
<script>
export default {
  name: 'InspectionRectificationTime',
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
