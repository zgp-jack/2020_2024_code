<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-19 16:42:16
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-26 14:44:40
 * @Description: 角色下拉框
-->
<template>
  <el-select
    v-model="selectedData"
    :disabled="disabled"
    :filterable="true"
    :placeholder="placeholder"
    clearable
  >
    <el-option
      v-for="(item, index) in list"
      :key="index"
      :value="item.id"
      :label="item.roleName"
    />
  </el-select>
</template>

<script>
import {
  getRoleListByDeptId,
} from '@/apis/system/role';
export default {
  props: {
    value: {
      type: Number,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请选择角色',
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
        this.$emit('input', newVal);
        this.$emit('change');
      },
      get() {
        return this.value;
      },
    },
  },
  async created() {
    try {
      const { list, } = await getRoleListByDeptId(null, 99999, 0);
      this.list = list;
    } catch (error) {
      if (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
