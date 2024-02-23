<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-15 11:10:59
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-02-28 16:05:35
 * @Description: 所有启用人员单选
-->
<template>
  <el-select
    v-model="selectedData"
    :filterable="true"
    v-bind="$attrs"
    clearable
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
import EngineerApi from '@/feat/system/user/api';
export default {
  components: {
  },
  props: {
    value: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      allEngineer: [],
    };
  },
  computed: {
    list() {
      return this.allEngineer.map(item => {
        return {
          id: item.id,
          name: item.name,
        };
      });
    },
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
      // const { list, } = await getEngineerListByDeptId(null, 9999, 0);
      const list = await EngineerApi.simpleList();
      this.allEngineer = list;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
