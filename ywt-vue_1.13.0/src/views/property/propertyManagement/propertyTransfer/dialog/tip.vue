<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-16 17:21:26
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-16 17:46:35
 * @Description:清空提示
-->
<template>
  <div>
    <el-row>
      <el-col class="align-center pure-message">
        <span>
          {{ message }}
        </span>
      </el-col>

    </el-row>
    <el-row>
      <el-col :span="12">
        <pure-button label="取消更改" type="default" @click="$emit('cancel')" />
      </el-col>
      <el-col :span="12" class="align-right">
        <pure-button label="确认更改" type="default" @click="$emit('done')" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.pure-message {
  font-size: 14px;
  font-weight: 400;
  color: #2d405e;
  line-height: 14px;
  margin-bottom: 32px;
  margin-top: 22px;
}
</style>
