/**
* @file rectifiactionResult.vue
* @author huang
* @date 2023/10/12
* @description 整改结果
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <pure-panel-card>
    <div slot="header">
      整改结果
      <hyy-state-text
        :config="INSPECTION_RECTIFY_STATUS_MAP"
        :state="itemData.isRectify"
      />
    </div>
    <template #subHeader>
      <hyy-sub-label-text
        :value="itemData.rectifyUserName "
        label="整改人"
      />
      <hyy-sub-label-text
        :value="itemData.rectifyTime "
        label="整改时间"
      />

    </template>
    <el-descriptions
      :column="1"
      border
    >
      <el-descriptions-item label="整改结果说明">
        {{ itemData.resultElaborate || '-' }}
      </el-descriptions-item>

      <el-descriptions-item label="整改过程照片">
        <template v-if="itemData.rectifyPhotos">
          <el-image
            v-for="(item,index) in itemData.rectifyPhotos"
            :key="index"
            :preview-src-list="itemData.rectifyPhotos"
            :src="item.url"
            style="width: 100px; height: 100px"
          />
        </template>
        <template v-else>
          -
        </template>

      </el-descriptions-item>
      <el-descriptions-item label="录音">
        <pure-audio :the-url="itemData.rectifySoundFile" />
      </el-descriptions-item>
    </el-descriptions>
  </pure-panel-card>
</template>
<script>
import { INSPECTION_RECTIFY_STATUS_MAP, } from '@/features/inspection/inspection.config';
import PurePanelCard from '@/common/components/panelCard/index.vue';

export default {
  components: { PurePanelCard, },
  props: {
    itemData: {
      type: Object,
      default: () => {
        return {
          isRectify: '',
          rectifyUserName: '',
          rectifyTime: '',
          resultElaborate: '',
          rectifyPhotos: [],
          rectifySoundFile: '',

        };
      },
    },
  },
  data() {
    return {
      INSPECTION_RECTIFY_STATUS_MAP,
    };
  },
};

</script>

<style lang='scss'
  scoped
>

</style>
