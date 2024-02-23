<template>
  <el-select
    v-model="selectedData"
    :clearable="clearable"
    :filterable="filterable"
    v-bind="$attrs"
  >
    <el-option
      v-for="(item, index) in list"
      :key="index"
      :disabled="disabledList.includes(item.dictValue)"
      :label="item.dictLabel"
      :value="item.dictValue"
    />
  </el-select>
</template>

<script>
import {
  find,
} from 'lodash-es';

export default {
  props: {
    value: {
      type: [
        String,
        Number,
      ],
      default: null,
    },
    dicKey: {
      type: String,
      default: null,
    },
    // 字典值的类型 number,string
    type: {
      type: String,
      default: 'string',
    },
    filterable: {
      type: Boolean,
      default: true,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    // 硬码字典
    hardList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    disabledList: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      list: [],
    };
  },
  computed: {
    selectedData: {
      set(val) {
        this.$emit('input', val);
        this.$emit('change', val);
      },
      get() {
        return this.value;
      },
    },
    cachedDicList() {
      return this.$store.state['SYSTEM_DIC'].list || [];
    },
  },
  created() {
    if (this.hardList.length > 0) {
      this.list = this.hardList;
    } else {
      this.genListByDic();
    }
  },
  mounted() {
  },

  methods: {
    // 通过数据字典生成选项
    genListByDic() {
      const dicObj = find(this.cachedDicList, { type: this.dicKey, });
      if (dicObj) {
        if (this.type === 'number') {
          dicObj.data.forEach(a => {
            a.dictValue = parseInt(a.dictValue.toString());
          });
          this.list = dicObj.data;
        } else {
          this.list = dicObj.data;
        }
      } else {
        throw new Error('未找到对应字典数据');
      }
    },
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
