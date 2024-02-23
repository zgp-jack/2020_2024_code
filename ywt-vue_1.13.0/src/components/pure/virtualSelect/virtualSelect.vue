<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2023-04-17 09:46:23
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-07 11:57:26
 * @Description: 可拖拽下拉选择框-支持虚拟列表
-->

<template>
  <el-select
    ref="dragSelect"
    v-model="selectVal"
    popper-class="virtual-select"
    filterable
    remote
    :remote-method="remoteMethod"
    class="drag-select"
    v-bind="$attrs"
    :multiple="multiple"
    @visible-change="onVisibleChange"
    v-on="$listeners"
  >
    <virtual-list
      ref="virtualList"
      class="virtual-select-list"
      :data-key="'id'"
      :data-sources="sourceDataForEcho"
      :data-component="optionComponent"
      :keeps="20"
      :extra-props="extraProps"
    />
  </el-select>
</template>

<script>
import ElOptionNode from './elOptionNode.vue';
import VirtualList from 'vue-virtual-scroll-list';
import {
  findIndex,
  clone,
} from 'lodash';
import Sortable from 'sortablejs';
export default {
  name: 'PureVirtualSelect',
  components: {
    VirtualList,
  },
  model: {
    prop: 'defaultValue',
    event: 'input',
  },
  props: {
    sourceData: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultValue: {
      type: [String, Array, Number],
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    extraProps: {
      type: Object,
      default() {
        return {
          label: 'name',
          value: 'id',
        };
      },
    },
  },
  data() {
    return {
      optionComponent: ElOptionNode,
      // 用户回显有选择项的数据源
      sourceDataForEcho: [],
    };
  },
  computed: {
    selectVal: {
      get() {
        return this.multiple ? [...this.defaultValue] : this.defaultValue;
      },
      set(val) {
        this.$emit('input', this.multiple ? [...val] : val);
      },
    },
  },
  watch: {
    sourceData() {
      this.init();
    },
  },
  mounted() {
    this.init();
    if (this.draggable) {
      this.setSort();
    }
  },
  methods: {
    init() {
      if (this.multiple) {
        this.sourceDataForEcho = this.genSourceDataForEcho(this.defaultValue);
      } else {
        this.sourceDataForEcho = this.genSourceDataForEcho([this.defaultValue]);
      }
    },
    genSourceDataForEcho(defaultArr) {
      const cloneSource = clone(this.sourceData);
      const hoistingData = [];
      for (let i = 0; i < defaultArr.length; ++i) {
        const index = findIndex(this.sourceData, { [this.extraProps.value]: Number(defaultArr[i]), });
        if (index > 0) {
          hoistingData.push(this.sourceData[index]);
          cloneSource.splice(index, 1);
        }
      }
      hoistingData.reverse().map(item => {
        cloneSource.unshift(item);
      });
      return cloneSource;
    },

    onVisibleChange(bool) {
      if (!bool) {
        this.$refs.virtualList.reset();
        this.init();
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.sourceDataForEcho = this.sourceData.filter(item => {
          return item.name.indexOf(query) > -1;
        });
      } else {
        this.sourceDataForEcho = this.sourceData;
      }
    },
    setSort() {
      const el = this.$refs.dragSelect.$el.querySelectorAll('.el-select__tags > span')[0];
      this.sortable = Sortable.create(el, {
        ghostClass: 'blue-background-class',
        animation: 150,
        setData: function (dataTransfer, dragEl) {
          dataTransfer.setData('Text', dragEl.textContent);
        },
        onEnd: evt => {
          console.log(evt);
          const targetRow = this.defaultValue.splice(evt.oldIndex, 1)[0];
          this.defaultValue.splice(evt.newIndex, 0, targetRow);

          this.selectVal = [...this.defaultValue];
          console.log(this.selectVal, this.defaultValue);
        },
      });
    },
  },
};
</script>

<style lang="scss">
.virtual-select {
  &-list {
    max-height: 245px;
    overflow-y:auto;
    cursor:pointer;
  }
  .el-scrollbar {
    .el-scrollbar__bar.is-vertical {
    width: 0;
  }
  }
}
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
