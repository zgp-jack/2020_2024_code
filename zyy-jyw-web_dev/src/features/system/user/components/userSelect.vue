<template>
  <el-select
    v-model="selectedData"
    v-bind="$attrs"
    :filterable="true"
  >
    <el-option
      v-for="(item, index) in list"
      :key="index"
      :value="item.userId"
      :label="item.nickName"
    />
  </el-select>
</template>

<script>
export default {
  name: 'UserSelect',
  props: {
    value: {
      required: true,
    },
    // 用户状态,0-全部,1-正常用户
    status: {
      type: Number,
      default: 0,
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
    userCachedList() {
      return this.$store.state['SYSTEM_USER'].list;
    },
  },
  created() {
    this.list = this.getList();
  },
  methods: {
    getList() {
      if (this.status === 0) {
        return this.userCachedList;
      } else if (this.status === 1) {
        return this.userCachedList.filter(item => item.status === '1');
      } else {
        console.warn('用户状态参数未知：', this.status);
        return [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
