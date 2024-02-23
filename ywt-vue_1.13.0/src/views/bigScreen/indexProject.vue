<!--
  项目
-->

<template>
  <Layout :layout-list="layout" :item-title="'数据展示'" />
</template>

<script>

import Layout from './layout/index.vue';
import ProjectTable from './components/projectTable/index.vue';
import ProjectTypeSum from './components/projectType/index.vue';
import ProjectAmount from './components/projectAmount/index.vue';
import ProjectDepartment from './components/projectDepartment/index.vue';
import { mapActions, } from 'vuex';
export default {
  components: {
    Layout,
  },

  data() {
    return {
      layout: [
        { 'x': 0, 'y': 0, 'w': 4, 'h': 1, 'i': '0', static: false, component: ProjectAmount, componentProps: { name: 'cure', }, },
        { 'x': 4, 'y': 0, 'w': 4, 'h': 1, 'i': '1', static: false, component: ProjectTypeSum, componentProps: { type: 'A', }, },
        { 'x': 8, 'y': 0, 'w': 4, 'h': 1, 'i': '2', static: false, component: ProjectTypeSum, componentProps: { type: 'B', }, },
        { 'x': 0, 'y': 1, 'w': 8, 'h': 2, 'i': '3', isDraggable: false, static: false, component: ProjectTable, },
        { 'x': 8, 'y': 1, 'w': 4, 'h': 2, 'i': '4', isDraggable: false, static: false, component: ProjectDepartment, }
      ],

    };
  },
  created() {
    this.DISPATCHT_GET_USER_LIST();
  },

  methods: {
    ...mapActions('user/center', ['DISPATCHT_GET_USER_LIST']),

  },
};
</script>

<style scoped>

</style>
