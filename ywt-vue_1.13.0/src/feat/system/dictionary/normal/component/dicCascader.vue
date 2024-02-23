<template>
  <el-cascader
    ref="cascader"
    v-model="valueData"
    :options="list"
    :props="propsData"
    collapse-tags
    clearable
    v-bind="$attrs"
  />
</template>

<script>
import { dataToTree, } from '@/utils/common';
import { mapState, } from 'vuex';
export default {
  name: 'DicCascader',
  components: {
  },
  props: {
    value: {
      type: [String, Array, Number],
      default: () => {
        return null;
      },
    },
    dicKey: {
      type: String,
      default: '',
    },
    props: {
      type: Object,
      default: () => {},
    },
    disabledValues: {
      type: Array,
      default: () => [],
    },
  },

  computed: {

    ...mapState('dictionary', {
      dicList: (v) => {
        return v;
      },
    }),
    valueData: {
      set(val) {
        this.$emit('input', val);
        this.$emit('change', val);
      },
      get() {
        return this.value;
      },
    },

    orginList() {
      return this.dicList[this.dicKey];
    },
    list() {
      const d = dataToTree(this.orginList, {
        parentId: 'parent_id',
        id: 'id',
        value: 'value',
        disabledValue: this.propsData.value,
      }, this.disabledValues);
      return d;
    },
    propsData() {
      return {
        multiple: true,
        emitPath: false,
        checkStrictly: true,
        value: 'value',
        label: 'name',
        children: 'children',
        ...this.props,
      };
    },

  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>

</style>
