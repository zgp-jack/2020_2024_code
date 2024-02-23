<!-- 右侧筛选面板 -->
<template>
  <div class="switchSelection-main">
    <el-tabs type="border-card" style="box-shadow: none;border:none;" @tab-click="tabClick">
      <el-tab-pane v-for="(item, index) in switchSelectionLabel" :key="index" :label="item.lable">
        <el-tree :data="item.data" accordion :props="defaultProps" highlight-current />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  props: {
    switchSelectionLabel: {
      type: Array,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    };
  },
  methods: {
    tabClick(e) {
      this.$emit('filterTable', e.label);
    },
  },
};
</script>

<style lang="scss" scoped>
.switchSelection-main{
    width: 300px;
    height: 100%;
    background-color: #fff;
    margin-left: 10px;
}
</style>
