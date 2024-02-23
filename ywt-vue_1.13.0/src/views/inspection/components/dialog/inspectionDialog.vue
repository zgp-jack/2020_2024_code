<!-- 巡检弹窗 -->
<template>
  <div style="height:100%;display:flex;flex-direction: column;justify-content: space-between;">
    <div style="flex:1;">
      <informationPanel :isdisabled="false" />
    </div>
    <div style="margin:20px 0;">
      <el-button style="width:80px;" type="primary" size="mini">提交</el-button>
      <el-button style="width:80px;" type="primary" plain size="mini">保存</el-button>
    </div>
  </div>
</template>

<script>
import informationPanel from '@/views/inspection/components/panel/informationPanel';

export default {
  components: {
    informationPanel,
  },
};
</script>

<style lang="scss" scoped>

</style>
