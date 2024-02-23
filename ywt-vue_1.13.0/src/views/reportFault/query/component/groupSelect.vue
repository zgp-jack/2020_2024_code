<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-29 16:55:50
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-26 14:42:48
 * @Description: 运维小组下拉框
-->
<template>
  <el-select
    v-model="selectedData"
    :placeholder="placeholder"
    :clearable="true"
    :filterable="filterable"
    :multiple="multiple"
    :collapse-tags="collapseTags"
  >
    <el-option
      v-for="(item,index) in list"
      :key="index"
      :value="item.id"
      :label="item.name"
    />
  </el-select>
</template>

<script>
import GroupApi from '@/apis/system/group';
export default {
  props: {
    value: {
      type: [Array, String],
      default: null,
    },
    placeholder: {
      type: String,
      default: '请选择运维小组',
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    // 是否有所有运维小组选择
    hasAll: {
      type: Boolean,
      default: false,
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
    // 多选时是否将选中值按文字的形式展示
    collapseTags: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: [],
    };
  },
  computed: {
    selectedData: {
      set(newVal) {
        let val;
        if (this.multiple) {
          val = newVal.join(',');
        }
        this.$emit('input', val);
        this.$emit('change', val);
      },
      get() {
        if (this.multiple) {
          return this.value ? this.value.split(',').map(item => Number(item)) : [];
        } else {
          return this.value;
        }
      },
    },
  },
  async created() {
    try {
      const { list, } = await GroupApi.list();
      if (this.hasAll) {
        list.unshift({
          name: '所有运维小组',
          id: -1,
        });
      }
      this.list = list;
    } catch (error) {
      console.error(error);
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
