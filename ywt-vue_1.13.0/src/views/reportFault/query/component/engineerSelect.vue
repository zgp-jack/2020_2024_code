<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-29 17:41:49
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-02-07 15:13:43
 * @Description:人员下拉框
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
      v-for="(item, index) in list"
      :key="index"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import {
  getEngineerListByDeptId,
} from '@/apis/system/engineer';
export default {
  props: {
    value: {
      type: [Array, String],
      default: null,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    // 所有人
    all: {
      type: String,
      default: null,
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
      allEngineer: [],
    };
  },
  computed: {
    list() {
      const list = this.allEngineer.filter(item => item.state === 1).map(item => {
        return {
          id: item.id,
          name: item.name,
        };
      });
      if (this.all) {
        list.unshift({
          id: -1,
          name: this.all,
        });
      }
      return list;
    },
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
      const { list, } = await getEngineerListByDeptId(null, 9999, 0);
      this.allEngineer = list;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
