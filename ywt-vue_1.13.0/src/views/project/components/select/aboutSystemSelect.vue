<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-15 11:21:40
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-07-15 14:27:40
 * @Description: 涉及系统下拉框(字典:aboutSystem)
-->
<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-15 10:56:53
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-07-15 11:02:46
 * @Description: 紧急程度下拉框(字典:itemLevel)
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

      :value="item.value"
      :label="item.name"
    />
  </pure-draggable-select>
</template>

<script>
export default {
  components: {
    PureDraggableSelect: () => import('@/components/select/draggableSelect.vue'),
  },
  props: {
    value: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: '请选择涉及系统',
    },
  },
  data() {
    return {
      list: this.$store.state['dictionary'].aboutSystem,
    };
  },
  computed: {
    selectedData: {
      set(newVal) {
        this.$emit('input', newVal.join(','));
        this.$emit('change');
      },
      get() {
        return this.value ? this.value.split(',') : [];
      },
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
