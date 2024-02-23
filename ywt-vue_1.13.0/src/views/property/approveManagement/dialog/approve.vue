<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-16 11:18:04
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-02-28 09:59:24
 * @Description:审批弹窗
-->
<template>
  <div class="drawer">
    <div class="header">
      <span class="title">
        审批
      </span>
    </div>
    <div class="body">
      <div class="flex">
        <div class="module">
          <component :is="module" :id="id" v-bind="$attrs" />
        </div>
        <div v-if="operatorType==='CREATE'" class="approve">
          <approve :id="id" ref="approve" v-bind="$attrs" />

        </div>
        <el-row v-if="operatorType==='CREATE'" style="margin-bottom:10px">
          <el-col>
            <el-button size="mini" type="primary" @click="submit">提交</el-button>
          </el-col>
        </el-row>
      </div>
    </div>

  </div>
</template>

<script>
import AprroveApi from '@/apis/property/approve';
import FormDialog from '@/minxins/common/formDialog';
export default {
  name: 'ApproveDialog',
  components: {
    PropertyTransfer: () => import('../panel/propertyTransfer.vue'),
    PropertyBorrow: () => import('../panel/propertyBorrow.vue'),
    PropertyDisposals: () => import('../panel/propertyDisposals.vue'),
    ConsumableDeposit: () => import('../panel/consumableDeposit.vue'),
    ConsumableWithdraw: () => import('../panel/consumableWithdraw.vue'),
    ConsumableReceive: () => import('../panel/consumableReceive.vue'),
    Approve: () => import('../panel/approve.vue'),
  },
  mixins: [FormDialog],
  props: {
    module: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentModule: 'PropertyTransfer',
      needFetchDetail: false,
    };
  },
  methods: {
    async submit() {
      try {
        const result = this.$refs.approve.check();
        await AprroveApi[result.state]({ ...result, });
        this.$message({
          type: 'success',
          message: '审批成功',
        });
        this.$emit('done');
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.flex {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.module {
  flex:1
}
.approve {
  height: 423px;

}
</style>

