<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-20 16:22:23
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-12 17:20:33
 * @Description:科室领回-领走面板
-->

<template>
  <collapse-item
    :name="name"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template #title>
      领走
    </template>
    <template #labelText>
      操作人：
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
    >
      <el-form-item label="签名">
        <div v-if="formData.sign">
          <img class="autograph" :src="$store.state['login'].uriConfig.fileBaseUri+formData.sign">
        </div>
      </el-form-item>
      <el-form-item label="附件">
        <upload v-model="formData.enclosure " />
      </el-form-item>

    </el-form>
  </collapse-item>
</template>

<script>
import CarryInServiceMixin from '../mixin';
export default {
  name: 'TakeBackPanel',
  mixins: [CarryInServiceMixin],
  data() {
    return {
      name: 'TakeBackPanel',
      formData: {},

    };
  },
};
</script>

<style lang="scss" scoped>
.autograph  {
  width: 100%;
  height: auto;
}
</style>
