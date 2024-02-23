<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2023-03-17 10:10:27
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-03-17 13:54:32
 * @Description:大屏配置
-->
<template>
  <div class="switch-box">
    <el-collapse v-model="activeName" class="switch-item" @change="handleCollapseChange">
      <el-collapse-item name="bigScreen" title="大屏展示配置">
        <template slot="title">
          <collapseTitle :has-switch="false" :is-open="mockData.bigScreen.enable" :config-type="{}" :title-and-info="titleAndInfo.bigScreen" @isOpenClick="isOpenClick" />
        </template>
        <big-screen-config />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import collapseTitle from '../components/collapseTitle.vue';
import BigScreenConfig from './components/bigScreen.vue';
export default {
  components: {
    collapseTitle,
    BigScreenConfig,
  },
  data() {
    return {
      mockData: {
        bigScreen: {
          enable: true,
        },
      },
      activeName: ['bigScreen'],
      titleAndInfo: {
        bigScreen: {
          title: '大屏展示配置',
          info: null,
          isOpen: true,
          name: 'bigScreen',
        },
      },
    };
  },
  methods: {
    isOpenClick() {},
    handleCollapseChange(v) {
      if (v.length > 0) {
        this.activeName = v.pop();
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>

