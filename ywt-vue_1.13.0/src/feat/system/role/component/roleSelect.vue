<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-11 14:23:29
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-11 14:43:30
 * @Description:角色下拉框
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
import RoleApi from '../api';
export default {
  props: {
    value: {
      type: [Array, String, Number],
      default: null,
    },
    placeholder: {
      type: String,
      default: '请选择角色',
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
        let val = newVal;
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
      const { list, } = await RoleApi.list();
      this.list = list.filter(item => item.deptId).map(item => {
        return {
          id: item.deptId + '-' + item.id,
          name: `${item.deptName ? item.deptName + '-' : ''}${item.roleName}`,
        };
      });
    } catch (error) {
      console.error(error);
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
