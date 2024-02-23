<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-26 20:54:55
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-08-04 16:19:11
 * @Description:
-->
<template>
  <pure-draggable-select
    v-model="selectedData"
    :placeholder="placeholder"
    :disabled="disabled"
  >
    <el-option
      v-for="(item,index) in list"
      :key="index"

      :label="item.name"
      :value="item.id"
    />
  </pure-draggable-select>
</template>

<script>
import PureDraggableSelect from '@/components/select/draggableSelect';
import {
  getEngineerListByDeptId,
} from '@/apis/system/engineer';
export default {
  components: {
    PureDraggableSelect,
  },
  props: {
    value: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请选择',
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
