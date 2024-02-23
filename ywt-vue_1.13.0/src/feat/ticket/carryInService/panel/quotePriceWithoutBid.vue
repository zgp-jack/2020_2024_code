<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-20 16:05:03
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-04 16:05:09
 * @Description:厂家报价-不邀标面板
-->
<template>
  <collapse-item
    :name="name"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template #title>
      厂家报价
    </template>
    <template #labelText>
      报价人：
    </template>
    <template #labelValue>
      {{ formData.quoteUser }}
    </template>
    <template #labelTime>
      报价时间：
    </template>
    <template #labelTimeValue>
      {{ formData.quoteTime }}
    </template>
    <el-form
      ref="form"
      label-position="right"
      label-width="90px"
      size="mini"
      :model="formData"
      :disabled="disabled"
      :rules="rules"
    >

      <el-row>
        <el-col :span="12">
          <el-form-item label="报价" prop="quoteMoney">
            <el-input v-model="formData.quoteMoney" style="width: 87%" />
            <span class="unit">元</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="附件">
        <upload v-model="formData.enclosure" />
      </el-form-item>
    </el-form>
  </collapse-item>
</template>

<script>
export default {
  name: 'QuotePriceWithoutBidPanel',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      name: 'QuotePriceWithoutBidPanel',
      formData: {
        quoteUser: null,
        quoteTime: null,
        quoteMoney: null,
        enclosure: null,
      },
      rules: {
        quoteMoney: [
          { required: true, message: '请输入报价', trigger: 'blur', }
        ],
      },
    };
  },
  created() {
    if (this.data.id) {
      const data = this.data.manufacturerInfos[0] || {};
      this.formData.createTime = data.createTime;
      this.formData.quoteUser = data.quoteUserToName;
      this.formData.quoteTime = data.createTime;
      this.formData.quoteMoney = data.quoteMoney;
      this.formData.enclosure = data.enclosure;
    }
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
