<!--
  项目
-->

<template>
  <Layout :layout-list="layout" :item-title="'项目管理数据展示'" />
</template>

<script>

import Layout from '../layout/index.vue';
import ProjectAmount from './panel/projectAmount.vue';
import ProjectTypeSum from './panel/projectType.vue';
import ProjectTable from './panel/projectTable.vue';
import ProjectDepartment from './panel/projectDepartment.vue';
import { mapActions, } from 'vuex';
export default {
  components: {
    Layout,
  },

  data() {
    return {
      layout: [
        { 'x': 0, 'y': 0, 'w': 4, 'h': 5, 'i': '0', static: false, component: ProjectAmount, componentProps: { name: 'cure', }, },
        { 'x': 4, 'y': 0, 'w': 4, 'h': 5, 'i': '1', static: false, component: ProjectTypeSum, componentProps: { type: 'A', }, },
        { 'x': 8, 'y': 0, 'w': 4, 'h': 5, 'i': '2', static: false, component: ProjectTypeSum, componentProps: { type: 'B', }, },
        { 'x': 0, 'y': 1, 'w': 8, 'h': 10, 'i': '3', isDraggable: false, static: false, component: ProjectTable, },
        { 'x': 8, 'y': 1, 'w': 4, 'h': 10, 'i': '4', isDraggable: false, static: false, component: ProjectDepartment, }
      ],

    };
  },
  created() {
    console.log('project');
    this.DISPATCHT_GET_USER_LIST();
  },

  methods: {
    ...mapActions('user/center', ['DISPATCHT_GET_USER_LIST']),

  },
};
</script>

<style scoped>

</style>
