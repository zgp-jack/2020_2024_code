<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-08-15 14:11:01
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-09-08 18:01:10
 * @FilePath: \ywt-vue-qp\src\views\project\impose\components\generateReport\descriptionsTab.vue
 * @Description:描述框组件
-->
<template>
  <div v-show="dataInfo" class="demand-container">
    <el-descriptions :title="basisConfig.title" :column="basisConfig.column" :direction="basisConfig.direction" size="medium" border :content-style="contentStyle" :label-style="labelStyle">
      <el-descriptions-item v-for="(item, idx) in dataInfo" :key="idx" :label="item.label" :span="item.span">
        <div v-if="!item.slotType">{{ item.content }}</div>
        <div v-if="item.slotType === 'file'">
          <template slot="label">
            {{ item.label }}
            <i class="el-icon-user title-icon" />
          </template>
          <AttachmentList :data="item.content" />
        </div>
        <slot v-else-if="item.slotType === 'inner'" class="inner-box" />
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import AttachmentList from '@/views/project/impose/attachment/list.vue';
export default {
  components: {
    AttachmentList,
  },
  props: {
    dataInfo: {
      type: Object,
      default: () => {},
    },
    basisConfig: {
      type: Object,
      default: () => ({
        title: '',
        column: 4,
        direction: 'horizontal',
      }),
    },
  },
  data() {
    return {
      checked: false,
      contentStyle: {
        'text-align': 'left', // 文本居中
        'min-width': '250px', // 最小宽度
        'word-break': 'break-all', // 过长时自动换行
      },
      labelStyle: {
        'color': '#909399',
        'text-align': 'left',
        // 'min-width': '110px',
        'word-break': 'keep-all',
      },
    };
  },
  computed: {

  },
  methods: {

  },
};
</script>

<style  lang="scss" scoped>
::v-deep.demand-container{
  margin-bottom: 20px;
  width: 100%;
  .el-descriptions-item__label{
    width: 150px;
  }
  .my-content {
    width: calc(20%);
    background: #FDE2E2;
  }
  table {
    table-layout: fixed !important;
  }
  .title-icon{
    font-size: 16px;
  }
  .enclosure{
    display: flex;
    flex-direction: column;
    align-items: center;
    float: left;
    .file{
      width: 100px;
      height: 100px;
      margin-right:10px
    }
    .file-name{
      text-align: center;
      width: 100px;
      padding: 0 5px;
      color:rgba(0,0,0,0.65);
      font-size: 14px;
      margin-top: 5px;
      line-height: 14px;
      text-overflow:ellipsis;
      white-space:nowrap;
      overflow: hidden;
    }
  }
}
.inner-box{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

}
</style>
