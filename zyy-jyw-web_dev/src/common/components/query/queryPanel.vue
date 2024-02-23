<!--查询面板容器-->

<template>
  <el-form
    :inline="true"
    class="query-panel"
    size="mini"
  >
    <slot />
    <slot
      v-if="isDisplay"
      name="display"
    />
    <el-form-item>
      <template v-if="showQueryButton">
        <pure-button
          icon="search"
          label="查询"
          type="minor"
          @click="onQuery"
        />

        <pure-button
          icon="reset"
          label="重置"
          type="patch"
          @click="onReset"
        />
      </template>
      <slot name="otherButton" />
      <pure-button
        v-if="showExpandButton"
        :icon="isDisplay ? 'arrow-up' : 'arrow-down'"
        icon-position="right"
        label="展开"
        type="text"
        @click="onExpand"
      />
    </el-form-item>
    <slot name="customButton" />
    <el-form-item
      v-if="$slots.right"
      class="right-form-item"
    >
      <slot name="right" />
    </el-form-item>

    <el-row v-if="showExtraSlot">
      <el-col :span="12">
        <el-form-item>
          <slot name="extra" />
        </el-form-item>
      </el-col>

      <el-col
        :span="12"
        class="align-right"
      >
        <el-form-item>
          <slot name="rightExtra" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>

export default {
  components: {},
  props: {
    showQueryButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isDisplay: false,
    };
  },
  computed: {
    // 是否显示展开按钮
    showExpandButton() {
      return Boolean(this.$slots.display?.length);
    },
    // 是否显示额外的slot
    showExtraSlot() {
      return Boolean(this.$slots.extra?.length || this.$slots.rightExtra?.length);
    },
  },
  created() {
  },
  methods: {
    onExpand() {
      this.isDisplay = !this.isDisplay;
    },
    onQuery() {
      this.$emit('query');
    },
    onReset() {
      this.$emit('reset');
    },
  },
};
</script>

<style lang='scss'
  scoped
>
.right-form-item {
  float: right;
}

.query-panel {
  padding: 16px 0px 0px;
  background-color: #fff;
}
</style>
