<!-- 需求列表和项目列表 名称 相关的级别图标展示 -->
<template>
  <div :class="isOverFlow ? 'cellName' : ''">

    <!-- 项目级别图标 -->
    <span v-if="ProjectLevelText" class="icon-wrapper" :class="ProjectLevelClass">
      {{ ProjectLevelText }}
    </span>
    <!-- 优先级图标 -->
    <template v-if="PriorityValue === 1">
      <span class="icon-wrapper icon-wrapper-priority">
        <svg-icon icon-class="first" />
      </span>
    </template>

    <img v-if="data['vote']" :src="icons.vote" width="16px" height="16px" alt="投票">

    <!-- 名称 -->
    <span v-if="isLinkTag" class="link" @click="onLink">
      {{ Name }}
    </span>
    <span v-else>
      {{ Name }}
    </span>
  </div>
</template>

<script>
const icons = {
  vote: require('@/assets/project/icons/vote.svg'),
};
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isLinkTag: Boolean,
    isOverFlow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      icons,
    };
  },
  // 1s 2m 3l
  computed: {
    Name() {
      return this.data.title || this.data.itemToName;
    },
    PriorityValue() {
      const { priority, level, } = this.data;
      return priority || level;
    },
    LevelText() {
      return this.$options.filters.dicValueToKey(
        this.data.priority,
        'itemPriority'
      );
    },
    ProjectLevelText() {
      const obj = {
        1: 'S',
        2: 'M',
        3: 'L',
      };
      return obj[this.data.projectLevel];
    },
    ProjectLevelClass() {
      return `icon-wrapper-${this.ProjectLevelText} ${this.ProjectLevelText}  `;
    },
    WrapperStyle() {
      return {};
    },
  },
  methods: {
    onLink() {
      this.$emit('onLink');
    },
    // onLink() {
    //   if (this.data.type === 1) {
    //     this.$router.push({
    //       name: 'XmXqgl',
    //       params: {
    //         itemCode: this.data.itemCode,
    //         showState: this.data.showState,
    //         principal: this.data.principal * 1,
    //       },
    //     });
    //   } else {
    //     this.$router.push({
    //       name: 'XmXmlxps',
    //       params: {
    //         itemCode: this.data.itemCode,
    //         showState: this.data.showState,
    //         principal: this.data.principal * 1,
    //       },
    //     });
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.cellName{
  white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;

}
.link{
    vertical-align: middle;
    position: relative;
    text-decoration: none;
    outline: none;
    cursor: pointer;
    padding: 0;
    font-size: 18px;
    font-weight: 500;
    color:#426ED7
}

.S {
  color: #4574e6;
}
.M {
  color: #e6ac39;
}
.L {
  color: #f26161;
}

.icon {
  &-wrapper {
    display: inline-block;
    width: 24px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    border-radius: 4px;
    font-size: 18px;
      margin-right: 8px;

    &-priority {
      background-color: #ffebeb;
    }
    &-S {
      background-color: #e6effc;
    }
    &-M {
      background-color: #faf2e3;
    }
    &-L {
      background-color: #ffeded;
    }
  }
}
</style>
