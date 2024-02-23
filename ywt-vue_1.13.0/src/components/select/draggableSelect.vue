<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-26 20:02:10
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-07 17:56:25
 * @Description:
-->
<template>
  <el-select
    ref="dragSelect"
    v-model="selectVal"
    v-bind="$attrs"
    class="drag-select"
    multiple
    clearable
    :filterable="true"
    v-on="$listeners"
  >
    <slot />
  </el-select>
</template>

<script>
import Sortable from 'sortablejs';
export default {
  name: 'PureDraggableSelect',
  props: {
    value: {
      type: Array,
      require: true,
      default: function () {
        return [];
      },
    },
  },
  computed: {
    selectVal: {
      get() {
        return [...this.value];
      },
      set(val) {
        this.$emit('input', [...val]);
      },
    },

  },
  mounted() {
    this.setSort();
  },
  methods: {
    setSort() {
      const el = this.$refs.dragSelect.$el.querySelectorAll('.el-select__tags > span')[0];
      this.sortable = Sortable.create(el, {
        ghostClass: 'blue-background-class',
        animation: 150,
        setData: function (dataTransfer, dragEl) {
          dataTransfer.setData('Text', dragEl.textContent);
        },
        onEnd: evt => {
          const targetRow = this.value.splice(evt.oldIndex, 1)[0];
          this.value.splice(evt.newIndex, 0, targetRow);
          this.selectVal = [...this.value];
        },
      });
    },
  },
};

</script>

<style lang="scss" scoped>
.drag-select {
  ::v-deep {
    .sortable-ghost {
      opacity: .8;
      color: #fff !important;
      background: #409EFF !important;
    }

    .el-tag {
      cursor: pointer;
      width: 100px;
      justify-content: center;
      padding:12px;
      font-size: $--pure-little-font-size;
    }
  }
  ::v-deep .el-select__tags {
    color: rebeccapurple;
    &>span {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
}
</style>
