<template>
  <el-tooltip placement="top">
    <div slot="content">
      <p v-for="item in data.organizers.split(',')" :key="item" style="margin:0;padding:6px 0">
        [{{ item * 1 | deptId }}]
      </p>
    </div>
    <div class="text-over-flow">
      <span v-for="item in data.organizers.split(',')" :key="item">
        [{{ item * 1 | deptId }}]
      </span>
    </div>

  </el-tooltip>

</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.text{
  &-over{
    &-flow{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}

</style>
