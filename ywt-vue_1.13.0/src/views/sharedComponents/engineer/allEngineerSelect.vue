<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-11 09:56:18
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-06-15 11:04:16
 * @Description: 所有启用人员多选框
-->
<template>
  <pure-draggable-select
    v-model="selectedData"
  >
    <el-option
      v-for="(item, index) in list"
      :key="index"
      :label="item.name"
      :value="item.id"
    />
  </pure-draggable-select>
</template>

<script>
import {
  getEngineerListByDeptId,
} from '@/apis/system/engineer';
export default {
  components: {
    PureDraggableSelect: () => import('@/components/select/draggableSelect'),
  },
  props: {
    value: {
      type: String,
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
      return this.allEngineer.filter(item => item.state === 1).map(item => {
        return {
          id: item.id,
          name: item.name,
        };
      });
    },
    selectedData: {
      set(newVal) {
        this.$emit('input', newVal.join(','));
        this.$emit('change');
      },
      get() {
        return this.value ? this.value.split(',').map(item => Number(item)) : [];
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
