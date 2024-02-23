<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-28 15:13:37
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-26 14:46:36
 * @Description:巡检单元级联选择
-->
<template>
  <el-cascader
    v-model="selectedData"
    :options="data"
    :props="defaultProps"
    v-bind="$attrs"
    clearable
  />
</template>

<script>
import InspectionUnitApi from '@/apis/inspection/unit';
export default {
  name: 'PureInspectionUnitCascader',
  props: {
    value: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      data: [],

      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id',
        emitPath: false,
      },
    };
  },
  computed: {
    selectedData: {
      set(val) {
        console.log(val);
        this.$emit('input', val);
        this.$emit('change', val);
      },
      get() {
        return this.value;
      },
    },

  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const list = await InspectionUnitApi.tree();

        this.data = list.map(item => {
          item.id = `dir-${item.id}`;
          item.children?.length === 0 && delete item.children && (item.disabled = true);
          return item;
        });
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

</style>
