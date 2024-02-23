<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-19 16:39:33
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-12 19:32:44
 * @Description:送修信息抽屉
-->
<template>
  <div
    v-loading="loading"
    class="drawer"
    :element-loading-text="loadingText"
  >
    <div class="header">
      <div class="title">
        {{ title }}
      </div>
    </div>
    <div class="body">
      <el-row class="h-100">
        <el-col class="h-100">
          <collapse>
            <carry-info-panel ref="panel" class="carry-info-panel" />
          </collapse>
        </el-col>
      </el-row>
    </div>
    <div class="footer">
      <pure-button
        label="提交"
        @click="onSubmit"
      />
    </div>
  </div>
</template>

<script>
import CarryInfoPanel from '../panel/carryInfo.vue';
import FormDialog from '@/minxins/common/formDialog';
import CarryInServiceApi from '../api';
export default {
  name: 'CarryInfoDrawer',
  components: {
    CarryInfoPanel,
  },
  mixins: [FormDialog],
  data() {
    return {
      name: '送修',
    };
  },
  methods: {
    async onSubmit() {
      const data = await this.$refs.panel.check();
      await CarryInServiceApi.createCarryInService(data);
      this.$emit('done');
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
  height: 100%;
  .card {
      height: 100%;
  }
  &::v-deep .pure-card__body {
    max-height:calc(100% - 34px);
    height: calc(100% - 34px);
  }
}
   .carry-info-panel
  {
    height: 100%;
    &::v-deep .pure-card__body {
      height: calc(100% - 40px);
    }
  }
.footer {
  height: 56px;
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
