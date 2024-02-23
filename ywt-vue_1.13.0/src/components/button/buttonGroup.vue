<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-13 10:14:23
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-07 17:55:41
 * @Description: 按钮组
-->
<template>
  <div class="btn-group">
    <div class="item">
      <el-badge
        v-for="(item, index) in options"
        :key="index"
        :value="item.count"
        :max="99"
        class="item"
      >
        <a
          :class="{active:activedBtn===item.name}"
          class="btn"
          @click="handleClick(item)"
        >
          {{ item.name }}
        </a>
      </el-badge>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: function () {
        return [];
      },

    },
    defaultActive: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      activedBtn: null,
    };
  },
  created() {
    this.activedBtn = this.defaultActive ? this.defaultActive : this.options[0]?.name;
  },
  methods: {
    async handleClick(item) {
      if (this.activedBtn !== item.name) {
        this.activedBtn = item.name;
        this.$emit('change', this.activedBtn);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-group {
  position: relative;
  height: 32px;
  text-align: left;
  .item {
    display: inline-flex;
    align-items: center;
    height: 32px;
    border-radius: 4px;
    padding:2px;
    background: #E9EFF5;
    margin-right:16px;
    ::v-deep .el-badge__content.is-fixed{
        right:18px;
    }
    :nth-last-child(1)
    {
        margin-right:1px;
    }
    > a {
        color: $--pure-color-primary;
        font-size: $--pure-base-font-size;
        line-height: 28px;
        flex: 0 0 auto;
        text-decoration: none;
        cursor: pointer;
        padding:0 15px;
        &.active {
            color: #FFFFFF;
            border-radius: 4px;
            background-color: $--pure-color-primary;
      }
    }
  }
}
</style>
