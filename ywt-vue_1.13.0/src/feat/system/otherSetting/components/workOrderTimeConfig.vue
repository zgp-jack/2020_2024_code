// 工单时间配置
<template>
  <el-form
    ref="form"
    label-width="80px"
    :inline="false"
    size="mini"
  >
    <el-form-item label="配置项">
      <el-checkbox v-model="createTime" :true-label="1" :false-label="0">
        工单创建时间
        <el-popover
          placement="top-start"
          title="包含工单来源：电话报修、上门报修、补录、微信报修、电脑报修、需求转工单、巡检转工单、医互通"
          width="auto"
          trigger="hover"
        >
          <i slot="reference" class="el-icon-question" />
        </el-popover>
      </el-checkbox>
      <el-checkbox v-model="makeTime" :true-label="1" :false-label="0">
        工单处理时间
        <el-popover
          placement="top-start"
          title="包含工单处理状态：完成、暂停工单、终止工单、转交、退回、处理、工单升级、多人协作"
          width="auto"
          trigger="hover"
        >
          <i slot="reference" class="el-icon-question" />
        </el-popover>
      </el-checkbox>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">应用</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import OtherSettingApi from '../api';
export default {
  data() {
    return {
      createTime: 0,
      makeTime: 0,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const res = await OtherSettingApi.getWorkTimeConfig();
      const { createTime, makeTime, } = JSON.parse(res.value);
      this.createTime = createTime;
      this.makeTime = makeTime;
    },
    async onSubmit() {
      const data = {
        key: 'ORDER_TIME_SETTING',
        value: JSON.stringify({
          createTime: this.createTime,
          makeTime: this.makeTime,
        }),
      };
      await OtherSettingApi.setWorkTimeConfig(data);
      this.$message.success('保存成功');
      this.init();
    },
  },
};
</script>

<style></style>
