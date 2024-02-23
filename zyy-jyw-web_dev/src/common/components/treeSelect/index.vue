<template>
  <el-popover placement="bottom-start" trigger="click" :width="defaultWidth">
    <div class="component-tree-select">
      <el-input v-if="isShowSearch" v-model.trim="filterText" placeholder="检索关键字" clearable />
      <div class="tree-container">
        <el-tree
          ref="treeRef"
          :class="{ 'not-show-expand-icon': notShowExpandIcon }"
          :show-checkbox="showCheckbox"
          check-strictly
          :node-key="nodeKey"
          :props="treeProps"
          v-bind="$attrs"
          :data="treeData"
          :filter-node-method="filterNode"
          :default-checked-keys="defaultCheckedKeys"
          @check="onCheck"
          @node-click="nodeClick"
        />
      </div>
    </div>
    <el-input
      slot="reference"
      :placeholder="placeholder"
      clearable
      :value="showCheckedLabels"
      @clear="clearSelected"
    />
  </el-popover>

</template>

<script>
export default {
  name: 'TreeSelect',
  inheritAttrs: false,
  props: {
    notShowExpandIcon: {
      type: Boolean,
      default: false,
    },
    treeData: {
      type: Array,
      default() {
        return [];
      },
    },
    nodeKey: {
      type: String,
      default: 'id',
    },
    placeholder: {
      type: String,
      default: '请选择单位',
    },
    treeProps: {
      type: Object,
      default() {
        return {
          label: 'label',
        };
      },
    },
    isSingle: {
      type: Boolean,
      default: false,
    },
    isShowSearch: {
      type: Boolean,
      default: false,
    },
    defaultCheckedKeys: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultCheckedLabels: {
      type: Array,
      default() {
        return [];
      },
    },
    showCheckbox: {
      type: Boolean,
      default: true,
    },
    defaultWidth: {
      type: Number,
      default: 200,
    },
  },
  data() {
    return {
      filterText: '',
      checkedIds: this.defaultCheckedKeys,
      checkedLabels: this.defaultCheckedLabels,
    };
  },
  computed: {
    showCheckedLabels() {
      const len = this.checkedLabels.length;
      if (len === 0) {
        return '';
      } else if (len === 1) {
        return this.checkedLabels[0];
      } else {
        return this.checkedLabels[0] + ' +' + (len - 1);
      }
    },
  },
  watch: {
    filterText(newVal) {
      this.$refs.treeRef.filter(newVal);
    },
    defaultCheckedKeys(newVal) {
      this.checkedIds = newVal;
      if (this.$refs.treeRef) {
        this.$refs.treeRef.setCheckedKeys(newVal);
      }
    },
    defaultCheckedLabels(newVal) {
      this.checkedLabels = newVal;
    },
  },
  methods: {
    nodeClick(data) {
      const nodeKey = this.nodeKey;
      const nodeLabel = this.treeProps.label;
      const checkedIds = [
        data[nodeKey],
      ];
      const checkedLabels = [
        data[nodeLabel],
      ];
      this.checkedIds = checkedIds;
      this.checkedLabels = checkedLabels;
      this.$refs.treeRef.setCheckedKeys(checkedIds);
      this.$emit('update:defaultCheckedKeys', checkedIds);
      this.$emit('treeNodeClick', data);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    onCheck(data, { checkedKeys, checkedNodes, }) {
      let checkedIds = [];
      let checkedLabels = [];
      const nodeKey = this.nodeKey;
      const nodeLabel = this.treeProps.label;
      const isCheck = checkedKeys.includes(data[nodeKey]);
      if (this.isSingle) {
        if (isCheck) {
          checkedIds = [
            data[nodeKey],
          ];
          checkedLabels = [
            data[nodeLabel],
          ];
        } else {
          checkedIds = [];
          checkedLabels = [];
        }
      } else {
        checkedNodes.forEach((item) => {
          checkedIds.push(item[nodeKey]);
          checkedLabels.push(item[nodeLabel]);
        });
      }
      this.checkedIds = checkedIds;
      this.checkedLabels = checkedLabels;
      this.$refs.treeRef.setCheckedKeys(checkedIds);
      this.$emit('update:defaultCheckedKeys', checkedIds);
    },
    clearSelected() {
      this.$refs.treeRef.setCheckedKeys([]);
      this.checkedIds = [];
      this.checkedLabels = [];
      this.$emit('update:defaultCheckedKeys', []);
      this.$emit('treeNodeClick', {});
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/common/styles/mixin.scss';
.component-tree-select {
  .not-show-expand-icon {
    ::v-deep .el-tree-node__expand-icon {
      display: none;
    }
  }
  .tree-container {
    margin-top: 10px;
    max-height: calc(100vh - 240px);
    overflow-y: auto;
    @include scrollBar;
  }
}
</style>
