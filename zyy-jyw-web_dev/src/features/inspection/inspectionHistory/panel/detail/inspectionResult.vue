/**
* @file inspectionResult.vue
* @author huang
* @date 2023/10/11
* @description 巡检结果.
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <hyy-panel-card>
    <div slot="header">巡检结果</div>
    <template #subHeader>
      <hyy-sub-label-text
        :value="itemData.inspectUserName"
        label="巡检人"
      />
      <hyy-sub-label-text
        :value="itemData.inspectionTime"
        label="巡检时间"
      />

    </template>
    <el-descriptions
      :column="1"
      border
    >
      <el-descriptions-item label="巡检结果">
        {{ itemData.result }}
      </el-descriptions-item>
      <el-descriptions-item label="详细说明">
        {{ itemData.elaborate }}
      </el-descriptions-item>
      <el-descriptions-item label="巡检过程照片">
        <el-image
          v-for="(item,index) in itemData.inspectionPhotos"
          :key="index"
          :preview-src-list="itemData.inspectionPhotos"
          :src="item.url"
          style="width: 100px; height: 100px"
        />

      </el-descriptions-item>
      <el-descriptions-item label="录音">
        <pure-audio :the-url="itemData.inspectionSound" />
      </el-descriptions-item>
    </el-descriptions>
  </hyy-panel-card>
</template>
<script>
export default {
  name: 'InspectionResult',
  components: {},
  props: {
    itemData: {
      type: Object,
      default: () => {
        return {
          inspectUserName: '',
          inspectionTime: '',
          result: '',
          elaborate: '',
          inspectionPhotos: '',
          inspectionSound: '',

        };
      },
    },
  },
};
</script>
