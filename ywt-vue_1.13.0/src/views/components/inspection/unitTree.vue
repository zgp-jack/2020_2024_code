<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-17 16:56:58
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-08-17 17:12:15
 * @Description:单元树型控件
-->
<template>
  <el-tree
    :data="treeData"
    :props="defaultProps"
    node-key="id"
    accordion
    highlight-current
    v-bind="$attrs"
    v-on="$listeners"
  >
    <span slot-scope="{ node, data }" class="custom-tree-node">
      <span>
        {{ node.label }}
      </span>
      <span v-if="node.level > 1">
        <el-button
          type="text"
          size="small"
          @click="edit(data)"
        >
          编辑
        </el-button>
        <el-button
          type="text"
          size="small"
          @click="del(data)"
        >
          删除
        </el-button>
      </span>
    </span>
  </el-tree>
</template>

<script>
import InspectionUnitApi from '@/apis/inspection/unit';
import InspectionUnit from '@/views/components/inspection/inspectionUnit.vue';

export default {
  name: 'PureInspectionUnitTree',
  props: {
    showHandle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    edit(data) {
      console.log(data);
      this.$drawer({
        width: '680px',
        position: 'right-bottom',
        component: () => <InspectionUnit detailApi={() => {}} id={data.id} onDone={this.fetchData} operatorType='EDIT'/>,
      });
    },
    async del(data) {
      this.$confirm(`是否删除「${data.name}」`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(async () => {
        await InspectionUnitApi.deleleUnit(data.id);
        this.fetchData();
      }).catch(() => {});
    },

    async fetchData() {
      try {
        const list = await InspectionUnitApi.tree();
        this.treeData = list;
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
 .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
