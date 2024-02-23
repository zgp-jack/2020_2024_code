/**
* @file applicationHistory.vue
* @author huang
* @date 2023/11/8
* @description  入库记录
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <div class="table-area">
    <el-table :data="data">
      <el-table-column
        label="序号"
        type="index"
        width="80px"
      />
      <el-table-column
        label="入库时间"
        prop="createTime"
        width="160px"
      />
      <el-table-column
        label="操作人"
        prop="createUserToName"
        width="120px"
      />
      <el-table-column
        label="入库数量"
        prop="quantity"
        width="120px"
      />
      <el-table-column
        label="备注"
        prop="remark"
        width="auto"
      />
      <el-table-column
        label="附件"
        prop="enclosure"
        width="140px"
      />

    </el-table>
  </div>

</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
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
