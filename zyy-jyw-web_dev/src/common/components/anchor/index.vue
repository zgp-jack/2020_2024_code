/**
* @file index.vue
* @author huang
* @date 2023/10/26
* @description 锚点组件
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <div class="anchor-wrapper">
    <ul class="anchor-wrapper-list">
      <li
        v-for="item in childData"
        :key="item.elId"
      >
        <span
          class="anchor-item"
          @click="handleClick(item)"
        >
          <a class="anchor-item-label">
            {{ item.childTitle }}
          </a>
        </span>

      </li>
    </ul>
    <div class="anchor-wrapper-content">
      <slot />
    </div>
  </div>

</template>
<script>
export default {
  name: 'Anchor',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      childData: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {

    init() {
      //      获取指定子组件下的ID
      console.log(this.$children);
      const childs = this.$children.map((item) => {
        return {
          elId: item.elId,
          childTitle: item.title,
        };
      });
      this.childData = childs;
    },
    handleClick(item) {
      const toEl = document.getElementById(item.elId);
      console.log(toEl, '123');
      if (toEl) {
        toEl.scrollIntoView({ behavior: 'smooth', });
      }
    },
  },
};

</script>
<style lang='scss'
  scoped
>
.anchor {
  &-item {
    display: inline-block;
    padding: 9px 16px;

    &-label {
      font-size: 14px;
      font-weight: 400;
      color: #006666;
    }
  }

  &-wrapper {
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow: auto;

    &-list {
      border-right: 1px solid #F0F7F7;
      margin: 0;
      padding: 0;
    }

    &-content {
      flex: 1;
      overflow: auto;

    }
  }
}

</style>
