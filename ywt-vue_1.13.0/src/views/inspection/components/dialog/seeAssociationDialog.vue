<!-- 模板关联查看弹窗 -->
<template>
  <div
    style="
    height:100%;
    display:flex;
    flex-direction: column;
    justify-content: space-between;
  "
  >
    <div style="margin-bottom: 20px;">
      巡检
    </div>
    <div style="display:flex;height: calc(100% - 92px);">
      <div class="content">
        <patrolUnitInformation :isdisabled="true" :width-num="27" />
        <informationPanel :isdisabled="true" />
      </div>
      <history />
    </div>
    <el-button style="width:100px;margin:10px 0 20px 0;" size="mini" type="primary">退出</el-button>
  </div>
</template>

<script>
import history from '@/views/inspection/components/panel/history';
import informationPanel from '@/views/inspection/components/panel/informationPanel';
import patrolUnitInformation from '@/views/inspection/components/panel/patrolUnitInformation';
export default {
  components: {
    informationPanel,
    patrolUnitInformation,
    history,
  },
  data() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>
.content{
  overflow-y:auto;
}

.content::-webkit-scrollbar {
 width: 6px;
 position: fixed;
 left: 7px;
 top: 0;
}
 .content::-webkit-scrollbar-track {
 border-radius:3px;
}
 .content::-webkit-scrollbar-thumb {
 background-color:#D7E5F9;
 border-radius: 3px;
}
</style>
