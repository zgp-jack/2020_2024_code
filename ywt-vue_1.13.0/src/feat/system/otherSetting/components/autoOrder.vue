<template>
  <el-tabs v-model="activeName" type="border-card">
    <el-tab-pane label="派单模式" name="mode">
      <Model />
    </el-tab-pane>
    <el-tab-pane label="派单优先级" name="priority">
      <Priority />
    </el-tab-pane>
    <!-- <el-tab-pane label="派单规则" name="rule">
      <Rule />
    </el-tab-pane> -->
  </el-tabs>
</template>

<script>
import { mapActions, } from 'vuex';
import Model from './autoOrderComponents/model.vue';
import Priority from './autoOrderComponents/priority.vue';
// import Rule from './autoOrderComponents/rules.vue';
export default {
  components: {
    Model,
    Priority,
    // Rule,
  },
  data() {
    return {
      activeName: 'mode',
    };
  },
  mounted() {
    this.GET_DISPATCH_MODE_DATA();
  },
  methods: {
    ...mapActions('systemOtherSetting/autoOrder', ['GET_DISPATCH_MODE_DATA']),

  },
};
</script>

<style>

</style>
