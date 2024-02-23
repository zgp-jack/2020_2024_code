<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-23 14:10:24
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-23 18:52:27
 * @Description:关联按钮
-->
<template>
  <el-link
    :underline="false"
    :class="['linked','linked--'+type]"
    v-on="$listeners"
  >
    <svg-icon
      :icon-class="icon"
    /> {{ count }}

  </el-link>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      default: 10,
    },
    type: {
      type: Number,
      default: 3,
    },
  },
  computed: {
    icon() {
      switch (this.type) {
        case 1:
          return 'warning';
        case 2:
          return 'link-alt';
        case 3:
          return 'revoke';
        default:
          return '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.linked+.linked {
  margin-left: 8px;
}
.linked {
  padding: 4px 5px;
  border-radius: 4px;
  font-size: 14px;
  &--1,&--1:hover {
    background: rgba(245,108,108,0.10);
    border: 1px solid rgba(245,108,108,0.50);
    color: #f56c6c;
  }
  &--2,&--2:hover {
    background: #e1e8f8;
    border: 1px solid #426ed7;
    color: #426ED7;
  }
  &--3,&--3:hover {
    background: rgba(230,162,60,0.10);
    border: 1px solid rgba(230,162,60,0.50);
    color: #E6A23C;
  }
}
</style>
