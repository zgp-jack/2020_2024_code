<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-28 10:35:53
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-08 16:51:42
 * @Description:
-->
<template>
  <div ref="collapse" class="collapse">
    <slot />
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'Collapse',
  componentName: 'Collapse',
  props: {
    accordion: Boolean,
    value: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      activeNames: [],
      collapseItemHeight: '',
      childNum: 0,
    };
  },
  provide() {
    return {
      collapse: this,
    };
  },
  watch: {
    value(value) {
      this.activeNames = [].concat(value);
    },
  },

  mounted() {
    const observer = new MutationObserver(this.setHeight);
    observer.observe(this.$el, {
      childList: true,
      subtree: true,
    });
    this.observer = observer;
  },

  created() {
    this.$on('item-click', this.handleItemClick);
  },
  methods: {
    setHeight() {
      const child = this.$slots.default || [];
      // 过滤出存在的
      const existChild = child.filter((item) => {
        if (item?.tag) {
          return item;
        }
      });
      this.childNum = existChild.length;
      if (existChild.length > 1) {
        // 存放每个子元素的高度
        const AllChildTotalHeights = [];
        let margin = '';
        const headHeight = existChild[0]?.elm?.clientHeight;
        existChild.forEach((item) => {
          const { marginTop, } = getComputedStyle(item.elm);
          const marginNum = Number(marginTop.replace('px', ''));
          const elMarginTop = Math.ceil(marginNum);
          const elHeight = item.elm.clientHeight;
          const height = elMarginTop + elHeight;
          margin = elMarginTop;

          AllChildTotalHeights.push(height);
        });
        // 计算所有子元素高度的总和
        const childSum = _.reduce(AllChildTotalHeights, (sum, n) => {
          return sum + n;
        }, 0);
        // 获取 子元素数量
        const childNum = existChild.length || 0;
        const { collapse, } = this.$refs;
        //  获取 父元素高度
        const collapseHeight = Math.ceil(collapse.clientHeight);
        // 子元素每个面板高度 = 父元素高度 - （子元素折叠高度 - 子元素marginTop） - 子元素的数量
        const collapseItemHeight = (collapseHeight - childSum - childNum);
        this.collapseItemHeight = collapseItemHeight;
        const itemNum = existChild.length;
        this.collapseItemHeight = collapseHeight - itemNum * headHeight - (itemNum - 1) * margin;
        this.activeNames = [].concat(this.value);
      } else {
        this.activeNames = [].concat(this.value);
      }
    },
    setActiveNames(activeNames) {
      activeNames = [].concat(activeNames);
      const value = this.accordion ? activeNames[0] : activeNames;
      this.activeNames = activeNames;
      this.$emit('input', value);
      this.$emit('change', value);
    },
    handleItemClick(item) {
      if (this.accordion) {
        this.setActiveNames(
          (this.activeNames[0] || this.activeNames[0] === 0) &&
            this.activeNames[0] === item.name
            ? '' : item.name
        );
      } else {
        const activeNames = this.activeNames.slice(0);
        const index = activeNames.indexOf(item.name);

        if (index > -1) {
          activeNames.splice(index, 1);
        } else {
          activeNames.push(item.name);
        }
        this.setActiveNames(activeNames);
      }
    },
  },
};
</script>

<style lang="scss">
.collapse{
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
