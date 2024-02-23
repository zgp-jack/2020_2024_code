/**
* @file applicationHistory.vue
* @author huang
* @date 2023/11/8
* @description  申领记录
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
        label="申请时间"
        prop="createTime"
      />
      <el-table-column
        label="申请科室"
        prop="inDeptName"
      />
      <el-table-column
        label="申请人"
        prop="createUserName"
      />
      <el-table-column
        label="申领数量"
        prop="quantity"
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
