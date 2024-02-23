<template>
  <ul class="file-wrapper">

    <li v-for="(item,key) in FileList" :key="key" class="file-item">
      <i class="el-icon-folder icon" />
      <span class="file-item-name">
        葫芦娃大战盘丝洞
      </span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'FileList',
  props: {
    data: {
      type: String,
      default: () => {
        return '';
      },
    },
  },
  computed: {
    FileList() {
      const value = this.data ? JSON.parse(this.data) : [];
      return value;
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  > li {
    list-style: none;
  }
}
.file {
  &-wrapper {
  }
  &-item {
    height: 32px;
    line-height: 32px;
    margin-bottom: 12px;
    > .icon {
      color: #fff;
      font-size: 16px;
    }
    &-name {
      display: inline-block;
      margin-left: 8px;
      font-size: 18px;
      font-weight: 400;
      color: #ffffff;
    }
  }
}
</style>
