<template>
  <el-tabs
    tab-position="left"
    style="height: 200px;"
  >
    <el-tab-pane
      v-for="item in dataList"
      :key="item.member"
      :label="item.member"
    >
      <div class="todo-content">
        <div class="todo-content-label">【本周计划】</div>

        <ul class="todo-content-ul">
          <li
            v-for="(sub,index) in item.thisWeekPlan"
            :key="index"
            class="todo-content-ul-item"
          >
            <span>{{ index+1 }}.{{ sub.planName }};</span>
            <span>({{ sub.statusToName }})</span>
          </li>
        </ul>
        <template v-if="item.nextWeekPlan.length">

          <div class="todo-content-label">【下周计划】</div>
          <ul class="todo-content-ul">
            <li
              v-for="(sub,index) in item.nextWeekPlan"
              :key="index"
              class="todo-content-ul-item"
            >
              <span>{{ index+1 }}.{{ sub.planName }};</span>
              <span>({{ sub.statusToName }})</span>
            </li>
          </ul>
        </template>
      </div>

    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  props: {
    dataList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__content{
  height: 100%;
  background-color: #F5F6F7;
}
::v-deep .el-tabs__header.is-left{
  margin-right: 0 !important;
}
.todo {
  &-content {

    padding: 16px  0 0 16px;
    &-label {
      font-family: AlibabaPuHuiTi_2_65_Medium;
      font-weight: 500;
      font-size: 18px;
      color: #e6a945;
    }
    &-ul{
  list-style: none;
margin: 0;
padding: 0;
      margin-bottom: 48px;

 &-item {
      margin-top: 16px;
      font-family: AlibabaPuHuiTi_2_55_Regular;
      font-weight: 400;
      font-size: 18px;
      color: #334266;
      span:last-child{
        margin-left: 16px;
      }
    }
    }

  }
}
</style>
