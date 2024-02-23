<template>
  <el-cascader
    ref="cascader"
    v-model="selectedData"
    :options="list"
    filterable
    clearable
    placeholder="故障分类"
    :props="{checkStrictly: true,value: 'dictValue',}"
    @change="handleChange"
  />
</template>

<script>
import { findLast, find, } from 'lodash-es';
export default {
  props: {
    value: {
      type: [
        String,
        Number,
      ],
      default: null,
    },
    // 字典值的类型 number,string
    type: {
      type: String,
      default: 'string',
    },
  },
  data() {
    return {
    };
  },
  computed: {
    cachedDicList() {
      return this.$store.state['SYSTEM_DIC'].list || [];
    },
    list() {
      const faultList = find(this.cachedDicList, { type: 'obs_fault_type', })?.data || [];
      return this.convertData(JSON.parse(JSON.stringify(faultList)));
    },
    selectedData: {
      set(val) {
        const value1 = findLast(val);
        this.$emit('input', value1);
        this.$emit('change', value1);
      },
      get() {
        if (this.type === 'number') {
          return Number(this.value);
        } else {
          return this.value;
        }
      },
    },
  },
  created() {},
  methods: {
    handleChange(item) {
      const leaf = findLast(item);
      const data = find(this.faultTypeList, { id: leaf, });
      if (data?.parm) {
        this.$emit('change', parseFloat(data.parm));
      }
      this.$refs.cascader.dropDownVisible = false;
    },
    convertData(list, parent_id = 0) {
      const parentObj = {};
      list.forEach((item) => {
        parentObj[item.id] = item;
      });
      if (!parent_id) {
        return list
          .filter((item) => !parentObj[item.parentId])
          .map((item) => {
            item.children = this.convertData(list, item.id);
            item.label = item.dictLabel;
            if (item.children.length === 0) {
              delete item.children;
            }
            return item;
          });
      } else {
        return list
          .filter((item) => item.parentId === parent_id)
          .map((item) => {
            item.children = this.convertData(list, item.id);
            item.label = item.dictLabel;
            if (item.children.length === 0) {
              delete item.children;
            }
            return item;
          });
      }
    },
  },

};
</script>

<style lang="scss" scoped>
</style>
