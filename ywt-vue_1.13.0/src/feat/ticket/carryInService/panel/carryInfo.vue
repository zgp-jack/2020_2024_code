
<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-19 16:21:33
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-16 11:24:27
 * @Description:送修信息面板
-->
<template>
  <collapse-item
    :name="name"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template #title>
      送修信息
    </template>
    <template #labelText>
      创建人：
    </template>
    <template #labelValue>
      {{ currentUser }}
    </template>
    <template #labelTime>
      创建时间：
    </template>
    <template #labelTimeValue>
      {{ currentTime }}
    </template>
    <el-form
      label-position="right"
      label-width="128px"
      size="mini"
      :disabled="disabled"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="送修方式">
        <el-radio-group v-model="carryPattern">
          <el-radio label="Department">科室送修</el-radio>
          <el-radio label="Engineer">工程师送修</el-radio>
          <el-radio label="ThirdParty">现场维修</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <component
      :is="carryPattern"
      ref="component"
      :disabled="disabled"
      :data="data"
      v-bind="$attrs"
    />
  </collapse-item>
</template>

<script>
const TYPES = { 'Department': 1, Engineer: 2, ThirdParty: 3, };
import Engineer from './patternForm/engineer.vue';
import Department from './patternForm/department.vue';
import ThirdParty from './patternForm/thirdParty.vue';
import CarryInServiceMixin from '../mixin';
export default {
  name: 'CarryInfoPanel',
  components: {
    Engineer,
    Department,
    ThirdParty,
  },
  mixins: [CarryInServiceMixin],
  data() {
    return {
      name: 'CarryInfoPanel',
      carryPattern: 'Department',
      formData: {},
      rules: {},

    };
  },
  created() {
    if (this.data.id) {
      this.formData = Object.assign({}, this.data);
      switch (this.formData.repairType) {
        case 1:
          this.carryPattern = 'Department';
          break;
        case 2:
          this.carryPattern = 'Engineer';
          break;
        case 3:
          this.carryPattern = 'ThirdParty';
          break;
      }
      this.currentTime = this.formData.createTime;
      this.currentUser = this.formData.createUserToName;
    }
  },
  mounted() {
  },
  methods: {
    async check() {
      const data = await this.$refs.component.check();
      return { ...data, repairType: TYPES[this.carryPattern], };
    },
  },
};
</script>

<style lang="scss" scoped>
.createUser,
.createTime {
  color: #879bba;
  font-size: $--pure-little-font-size;
  span {
    font-weight: 400;
    color: #2d405e;
  }
}
</style>
