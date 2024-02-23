/**
* @file inspectionContent.vue
* @author huang
* @date 2023/10/11
* @description 巡检内容
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <pure-panel-card>
    <template #header>
      <div slot="header">巡检内容</div>
      <hyy-state-text
        :config="config"
        :state="0"
      />
    </template>
    <div class="table-area">
      <el-table>
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="80px"
        />
        <el-table-column
          label="巡检项名称"
          prop="itemName"
          width="180px"
        />
        <el-table-column
          label="实测值"
          prop="measuredValue"
          width="80px"
        />
        <el-table-column
          label="巡检结果"
          prop="result"
          width="120px"
        >
          <template #default="{row}">
            <pure-type-text
              :config="INSPECTION_RESULT_MAP"
              :type="row.result"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="整改要求及处罚意见"
          prop="rectifyOpinion"
          width="auto"
        />
      </el-table>
    </div>

  </pure-panel-card>
</template>
<script>
import { STATUS_FAIL_COLOR, } from '@/common/utils/color';
import { INSPECTION_RESULT_MAP, } from '@/features/inspection/inspection.config';

export default {
  name: 'InspectionContent',
  components: {},
  props: {
    itemData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      INSPECTION_RESULT_MAP,
      config: {
        '0': {
          label: '异常',
          state: 0,
          color: STATUS_FAIL_COLOR,
        },
      },
    };
  },
};
</script>

<style lang='scss'
  scoped
>
@import "~@/common/styles/theme/handle.scss";

.table-area {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: white;

  ::v-deep .el-table {

    thead {
      @include font_color_imp('color-assist-gray');

      font-size: 16px;

      th.el-table__cell {
        @include background_color_imp('color-assist-4');
      }
    }

  }
}
</style>
