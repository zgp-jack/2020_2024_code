
<template>
  <div>
    <div class="switch-body-tree-header">
      <el-checkbox v-model="checkAll" :disabled="!disabled" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
        人员小组
      </el-checkbox>
    </div>
    <el-cascader
      ref="engineer"
      v-model="selectedData"
      size="mini"
      :options="list"
      :props="{ multiple: true,value: 'id', }"
      filterable
      clearable
      placeholder="请输入查找人员"
      collapse-tags
      class="qp-cascader"
      :disabled="!disabled"
      @change="handleChange"
    />
  </div>
</template>

<script>
import OtherSettingApi from '../api';
import EngineerApi from '@/apis/system/engineer';
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
    peopleChecked: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      faultTypeList: [],
      selectedData: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled: this.isdisabledFn,
      },
    };
  },
  computed: {
    list() {
      return this.convertEngineerData(this.faultTypeList);
    },
    disabled() {
      return this.peopleChecked;
    },
    treeListLen() {
      return this.getChildren(this.list);
    },
  },
  watch: {
    checkedData: {
      handler(newValue, oldValue) {
        // let initialVal = { enable: false, value: [], }; // 防止后台返回null 导致找不到对应key 报错
        // if (newValue) initialVal = newValue;
        const { enable, group_user, } = this.appendDataTree(newValue);
        this.checkAll = enable;
        this.selectedData = group_user.value;
        this.showDropDown();
      },
      immediate: true,
      deep: true,
    },
  },
  async created() {
    const list = await EngineerApi.groupedList();
    this.faultTypeList = list.map(item => {
      return {
        name: item.userName,
        id: item.teamId,
        engineerId: item.userId,
        teamName: item.teamName,
        label: item.teamName,
      };
    });
  },
  methods: {
    appendDataTree(data) {
      const treeKeys = [
        { type: 'Boolean', name: 'enable', },
        { type: 'Object', name: 'group_user', }
      ];
      if (!data) {
        return {
          enable: false,
          group_user: {
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
    showDropDown() {
      this.$nextTick(() => {
        this.$refs.engineer.toggleDropDownVisible();
      });
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
    handleCheckAllChange(v) {
      const selectedDataArr = this.getChildren(this.list);
      if (v) {
        this.selectedData = selectedDataArr;
      } else {
        this.selectedData = [];
      }
      this.saveOrUpdateItem(v, selectedDataArr, this.refType);
    },
    isdisabledFn() {
      return this.disabled;
    },
    // 递归查询组装所有children
    getChildren(data) {
      const children = [];
      data.forEach(item => {
        if (item.children) {
          children.push(...this.getChildren(item.children));
        } else {
          children.push([item.parent_id, item.engineerId]);
        }
      });
      return children;
    },

    handleChange(checkedNodes) {
      if (checkedNodes.length === this.treeListLen.length) {
        this.checkAll = true;
        this.isIndeterminate = false;
      } else if (checkedNodes.length === 0) {
        this.isIndeterminate = false;
      } else {
        this.isIndeterminate = true;
        this.checkAll = false;
      }
      let ids = [];
      checkedNodes.length > 0 ? ids = checkedNodes : ids = this.getChildren(this.list);
      this.saveOrUpdateItem(checkedNodes.length > 0, ids, this.refType);
    },
    convertEngineerData(list) {
      var result = [];
      list.forEach((item, index) => {
        var { id, label, } = item;
        if (!result[id]) {
          result[id] = {
            id: id || 0,
            label: label || '未分组',
            children: [],
          };
        }
        result[id].children.push(item);
      });
      return Object.values(result).filter((element, index) => {
        return element.children.filter(item => {
          item.label = item.name;
          item.id = item.engineerId;
          item.parent_id = element.id;
        });
      });
    },
  },

};
</script>

<style lang="scss" scoped>
.switch-body-tree-header{
  padding: 0 25px;
  .tree-root-box{
    background: #e1e3e7;
  }
}
.qp-cascader{
  width: calc(100% - 50px);
  margin: 5px 25px;
  ::v-deep .el-cascader__tags{
    // padding: 0px 25px;
    font-size: 18px;
  }
}
.tree-item-box{
  padding-left: 15px;
}
</style>
