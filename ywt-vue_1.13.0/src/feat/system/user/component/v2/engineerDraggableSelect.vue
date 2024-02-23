<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2023-04-13 17:18:32
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-04-17 17:23:51
 * @Description: 用户可拖拽下拉选择框
-->
<template>
  <virtual-select v-model="selectedEngineers" :source-data="engineers" :extra-props="extraProps" v-bind="$attrs" :multiple="multiple" />
</template>

<script>
import VirtualSelect from '@/components/pure/virtualSelect/virtualSelect.vue';
export default {
  name: 'EngineerDraggableSelect',
  components: {
    VirtualSelect,
  },
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      extraProps: {
        label: 'name',
        value: 'id',
      },
    };
  },
  computed: {
    engineers() {
      const list = this.$store.state.systemEngineer.listV2;
      if (!list.length) {
        this.$store.dispatch('systemEngineer/FETCH_ENGINEER_LIST_V2');
      }
      // 对删除或禁用用户进行标识
      const markedEngineers = list.map(engineer => {
        let name = engineer.name;
        if (engineer.state === 0) {
          name = `${engineer.name}[已禁用]`;
        }
        if (engineer.state === -1) {
          name = `${engineer.name}[已删除]`;
        }
        return {
          ...engineer,
          name: name,
        };
      });
      return markedEngineers;
    },
    selectedEngineers: {
      set(newVal) {
        if (this.multiple) {
          this.$emit('input', newVal.join(','));
        } else {
          this.$emit('input', newVal);
        }

        this.$emit('change');
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
  created() {
    this.$store.dispatch('systemEngineer/FETCH_ENGINEER_LIST_V2');
  },
};
</script>

<style lang="scss" scoped>

</style>
