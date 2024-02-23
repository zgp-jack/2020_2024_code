<template>
  <div class="config-box">
    <div class="config-box-header">
      <el-checkbox v-model="checkAll" :disabled="!disabled" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
        {{ titleHeader }}
      </el-checkbox>
    </div>
    <el-select v-model="searchVal" filterable :disabled="!disabled" placeholder="请输入查找内容" size="mini" class="tree-search-box" @change="searchInput">
      <el-option
        v-for="item in treeList"
        :key="item.id"
        :label="item.label"
        :value="item.id"
      />
    </el-select>
    <el-tree
      ref="treeList"
      node-key="id"
      :data="treeList"
      :props="defaultProps"
      show-checkbox
      class="tree-item-box"
      :style="{ color: !disabled ? '#C0C4CC' : '#606266' }"
      @check="((data,checkedNodes)=>{handleCheckChange(data,checkedNodes, refType)})"
    />
  </div>
</template>

<script>
import OtherSettingApi from '../api';
export default {
  props: {
    checkedData: {
      type: Object,
      default: () => {},
    },
    refType: {
      type: String,
      default: () => '',
    },
    faultChecked: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      checkAll: false,
      searchVal: '',
      isIndeterminate: false,
      treeList: [],
      keyArr: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled: this.isdisabledFn,
      },
    };
  },
  computed: {
    titleHeader() {
      return this.refType === 'fault_source' ? '故障来源' : '故障分类';
    },
    disabled() {
      return this.faultChecked;
    },
  },
  watch: {
    checkedData: {
      handler(newValue, oldValue) {
        // let initialVal = { enable: false, value: [], }; // 防止后台返回null 导致找不到对应key 报错
        // if (newValue[this.refType]) initialVal = newValue[this.refType];
        // const { enable, value, } = initialVal;
        // const { fault_source, fault_classify, } = this.appendDataTree(newValue);
        const { [this.refType]: QP, } = this.appendDataTree(newValue);
        const res = QP;
        this.$nextTick(() => {
          this.checkAll = res.enable;
          if (res.value.length === this.treeList.length) {
            this.isIndeterminate = false;
          } else if (res.value.length === 0) {
            this.isIndeterminate = false;
          } else {
            this.isIndeterminate = true;
          }
          this.$refs.treeList.setCheckedKeys(res.value);
        });
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    const { sourceList, faultTypeList, } = this.$store.state['dictionary'];
    if (this.refType === 'fault_source') {
      this.treeList = this.convertData(sourceList);
    } else {
      this.treeList = faultTypeList.filter(item => {
        if (!item.parent_id) {
          item.label = item.name;
          return item;
        }
      });
    }
  },
  methods: {
    appendDataTree(data) {
      const treeKeys = [
        { type: 'Boolean', name: 'enable', },
        { type: 'Object', name: this.refType, }
      ];
      if (!data) {
        return {
          enable: false,
          fault_source: {
            enable: false,
            value: [],
          },
          fault_classify: {
            enable: false,
            value: [],
          },
        };
      }
      const res = {};
      treeKeys.forEach(item => {
        if (item.type === 'Boolean') {
          if (!data[item.name]) {
            res[item.name] = false;
          } else {
            res[item.name] = data[item.name];
          }
        }
        if (item.type === 'Object') {
          if (!data[item.name]) {
            res[item.name] = { enable: false, value: [], };
          } else {
            res[item.name] = data[item.name];
          }
        }
      });
      return res;
    },
    handleCheckAllChange(v) {
      let chechedKeys = [];
      if (v) {
        this.isIndeterminate = false;
        this.$refs.treeList.setCheckedNodes(this.treeList);
        chechedKeys = this.$refs.treeList.getCheckedKeys(this.treeList);
      } else {
        chechedKeys = this.$refs.treeList.getCheckedKeys(this.treeList);
        this.keyArr = [];
        this.isIndeterminate = false;
        this.$refs.treeList.setCheckedNodes([]);
      }
      this.saveOrUpdateItem(v, chechedKeys, this.refType);
    },
    convertData(list, parent_id = 0) {
      const parentObj = {};
      list.forEach((item) => {
        parentObj[item.id] = item;
      });
      if (!parent_id) {
        return list
          .filter((item) => !parentObj[item.parent_id])
          .map((item) => {
            item.children = this.convertData(list, item.id);
            item.label = item.name;
            if (item.children.length === 0) {
              delete item.children;
            }
            return item;
          });
      } else {
        return list
          .filter((item) => item.parent_id === parent_id)
          .map((item) => {
            item.children = this.convertData(list, item.id);
            item.label = item.name;
            if (item.children.length === 0) {
              delete item.children;
            }
            return item;
          });
      }
    },
    searchInput(v) {
      this.keyArr.push(v);
      const isCheckedKeys = [...new Set([...this.keyArr, ...this.$refs.treeList.getCheckedKeys(this.treeList)])];
      this.$refs.treeList.setCheckedKeys(isCheckedKeys);
      this.saveOrUpdateItem(true, isCheckedKeys, this.refType);
      if (isCheckedKeys.length === this.treeList.length) {
        this.isIndeterminate = false;
        this.checkAll = true;
      } else {
        this.isIndeterminate = true;
      }
      this.searchVal = '';
    },
    isdisabledFn() {
      return !this.disabled;
    },
    handleRootCheckChange(data, checked, key) {
      if (checked) {
        this.$refs.treeList.setCheckedNodes(this.treeList);
      } else {
        this.$refs.treeList.setCheckedNodes([]);
      }
    },
    handleCheckChange(data, checkedNodes, key) {
      const checked = this.$refs['treeList'].getNode(data).checked;// 获取点击节点的勾选状态
      if (checked) {
        this.searchVal = '';
      }
      if (checkedNodes.checkedKeys.length === this.treeList.length) {
        this.checkAll = true;
        this.isIndeterminate = false;
      } else if (checkedNodes.checkedKeys.length === 0) {
        this.isIndeterminate = false;
      } else {
        this.isIndeterminate = true;
        this.checkAll = false;
      }
      this.saveOrUpdateItem(checked, [data.id], key);
      // this.getNodeTree(data, key);// 由于需求改动 暂时不需要递归获取当前点击项的所有祖辈id 预留 后期可能会改动
    },
    saveOrUpdateItem(checked, id, key) {
      const parentType = key.split('_')[0];
      const params = {
        enable: checked,
        parentType,
        type: key,
        typeValue: id,
      };
      OtherSettingApi.saveOrUpdateItem(params,).then(res => {
        this.$message({
          type: 'success',
          message: res,
        });
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '出错了',
        });
      });
    },
    getNodeTree(node, key) {
      // 最终的数据
      this.isChangeItem = [];
      //  获取点击当节点的dom的信息
      const selectNode = this.$refs[key].getNode(node);
      // 调用递归函数
      this.platform(selectNode);
    },
    // 递归函数
    platform(node) {
      if (!node.parent) {
        return;
      }
      this.isChangeItem.unshift(node.data.label, node.data.id);
      console.log(this.isChangeItem, '当前点击id和其所有父辈id');
      // 调用递归
      this.platform(node.parent);
    },
  },
};
</script>

<style lang="scss" scoped>
.config-box-header{
  margin: 0 25px;
  .tree-root-box{
    background: #e1e3e7;
  }
}
.tree-search-box{
  width: calc(100% - 50px);
  margin: 0 25px;
}
.tree-item-box{
  padding-left: 15px;
}
</style>
