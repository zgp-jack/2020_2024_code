<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-11-11 16:37:14
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-06 16:31:34
 * @Description:表格区域
-->
<template>
  <div class="table-area">
    <div v-if="$slots.header" class="table-area-header base-margin-bottom">
      <slot name="header" />
    </div>
    <div class="table-area-body">
      <slot name="body" />
    </div>
    <div class="table-area-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'TableArea',
  props: {

  },
  data() {
    return {
    };
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
.table-area {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: white;
}

.table-area-header {
  width: 100%;
}
.table-area-body,.table-area-footer {
  padding: 0 16px;
}
.table-area-body {
  flex: 1;
  width: 100%;
  overflow: hidden;
  min-height: 100px;
}
.table-area-footer {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-end;
  ::v-deep .el-pagination {
    padding:16px 0;
  }
}
</style>

