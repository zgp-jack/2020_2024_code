<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-06 18:26:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-02-07 17:48:53
 * @Description:
-->
<template>
  <draggable v-model="list" class="list-group" tag="ul" v-bind="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false">
    <transition-group type="transition" :name="'flip-list'">
      <li v-for="(element,index) in list" :key="element.order" class="list-group-item">
        <span style="color:#879BBA">{{ index +1 }}</span>
        <i class="drag icon-drag1" />
        <span v-if="hasChecked" style="margin-right:8px">
          <el-checkbox v-model="element.checked" @change="handleChange" />
        </span>
        <span style="color:#2D405E"> {{ element.name }}</span>
      </li>
    </transition-group>
  </draggable>
</template>

<script>
export default {
  name: 'PureDraggable',
  components: {
    draggable: () => import('vuedraggable'),
  },
  props: {
    data: {
      type: Array,
      default: function () {
        return [];
      },
    },
    hasChecked: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editable: true,
      isDragging: false,
      delayedDragging: false,

    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: !this.editable,
        ghostClass: 'ghost',
      };
    },

    list: {
      get() {
        return this.data;
      },
      set(value) {
        this.$emit('change', value);
      },
    },
  },
  watch: {
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true;
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });
    },
  },
  methods: {
    handleChange() {
      this.$emit('change', this.list);
    },
    orderList() {
      this.list = this.list.sort((one, two) => {
        return one.order - two.order;
      });
    },
    onMove({ relatedContext, draggedContext, }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 24px;
  padding-left: 0;
  margin-bottom: 0px;
  margin-top: 0;
}
.list-group-item {
  cursor: move;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #fff;
}
.drag {
  margin: 0 8px;
  width: 16px;
  overflow: hidden;
}
.list-group-item i {
  cursor: pointer;
  display: inline-block;
}
</style>
