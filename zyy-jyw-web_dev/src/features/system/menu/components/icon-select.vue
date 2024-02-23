<template>
  <div class="icon-body">
    <el-input v-model="name" class="icon-search" clearable placeholder="请输入图标名称" @clear="filterIcons" @input="filterIcons">
      <i slot="suffix" class="el-icon-search el-input__icon" />
    </el-input>
    <div class="icon-list">
      <div class="list-container">
        <div v-for="(item, index) in iconList" :key="index" class="icon-item-wrapper" @click="selectedIcon(item)">
          <div :class="['icon-item', { active: activeIcon === item.icon }]">
            <i :class="item.icon" style="height: 25px;width: 16px;" />
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IconSelect',
  props: {
    activeIcon: {
      type: String,
    },
  },
  data() {
    return {
      name: '',
      icons: [
        { icon: 'iconfont icon-ITzichantiaobotuikuliucheng', name: '资产', },
        { icon: 'iconfont icon-tongji', name: '统计', },
        { icon: 'iconfont icon-sort', name: '综合', },
        { icon: 'iconfont icon-zhuye', name: '首页', },
        { icon: 'iconfont icon-wrench', name: '报障', },
        { icon: 'iconfont icon-zhuliucheng', name: '流程', },
        { icon: 'iconfont icon-shezhi', name: '设置', },
        { icon: 'iconfont icon-shouye', name: '首页', },
        { icon: 'iconfont icon-xunjianrenwu', name: '巡检任务', },
        { icon: 'iconfont icon-jixiaokaohe', name: '绩效', },
        { icon: 'iconfont icon-xiangmu', name: '项目', },
        { icon: 'iconfont icon-zhiliangxunjian', name: '检查', },
        { icon: 'iconfont icon-xunjian', name: '巡检', },
        { icon: 'iconfont icon-hetong', name: '合同', },
        { icon: 'iconfont icon-zhishiku', name: '知识库', },
      ],
      iconList: [],
    };
  },
  created() {
    this.iconList = this.icons;
  },
  methods: {
    filterIcons() {
      this.iconList = this.icons;
      if (this.name) {
        this.iconList = this.iconList.filter(item => item.name.includes(this.name));
      }
    },
    selectedIcon(iconData) {
      this.$emit('selected', iconData);
      document.body.click();
    },
    reset() {
      this.name = '';
      this.iconList = this.icons;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-search {
    position: relative;
    margin-bottom: 5px;
  }
  .icon-list {
    height: 200px;
    overflow: auto;
    .list-container {
      display: flex;
      flex-wrap: wrap;
      .icon-item-wrapper {
        width: calc(100% / 3);
        height: 25px;
        line-height: 25px;
        cursor: pointer;
        display: flex;
        .icon-item {
          display: flex;
          max-width: 100%;
          height: 100%;
          padding: 0 5px;
          &:hover {
            background: #ececec;
            border-radius: 5px;
          }
          .icon {
            flex-shrink: 0;
          }
          span {
            display: inline-block;
            vertical-align: -0.15em;
            fill: currentColor;
            padding-left: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .icon-item.active {
          background: #ececec;
          border-radius: 5px;
        }
      }
    }
  }
}
</style>
