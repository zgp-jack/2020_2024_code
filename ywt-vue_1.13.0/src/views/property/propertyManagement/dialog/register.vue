<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-15 15:18:59
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-07-19 15:59:19
 * @Description: 资产登记
-->
<template>
  <div class="drawer">
    <div class="header">
      <span class="title">
        资产登记
      </span>
    </div>
    <div class="body">
      <div class="flex">
        <base-info ref="baseInfo" style="margin-bottom:10px" :show-expand="expand" />
        <div class="flex-container">
          <more-info ref="moreInfo" style="margin-bottom:10px" class="more-info" />
        </div>

        <el-row style="margin-bottom:10px">
          <el-col>
            <el-button size="mini" type="primary" @click="handleAddProperty">添加资产</el-button>
            <el-button size="mini" class="btn" @click="handleBatchAddProperty">批量添加</el-button>
          </el-col>
        </el-row>
      </div>

    </div>
  </div>
</template>

<script>
import {
  find,
} from 'lodash';
import PropertyManagementApi from '@/apis/property/propertyManagement';
import RegisterBatch from './registerBatch.vue';
export default {
  components: {
    BaseInfo: () => import('../panel/baseInfo.vue'),
    MoreInfo: () => import('../panel/moreInfo.vue'),
  },
  data() {
    return {
      expand: true,
      tableData: [],
      tableColumn: [{
        prop: 'assetsCode',
        label: '资产编号',
      }, {
        prop: 'name',
        label: '名称',
      }, {
        prop: 'model',
        label: '规格型号',
      }, {
        prop: 'assetsType',
        label: '资产类型',
      }, {
        prop: 'useDept',
        label: '使用科室',
      }, {
        prop: 'patrolTemp',
        label: '巡检模板',
      }, {
        prop: 'patrolDept',
        label: '维护科室',
      }],
    };
  },
  methods: {

    // 添加资产
    async handleAddProperty() {
      try {
        const baseInfo = await this.$refs.baseInfo.check();
        const moreInfo = await this.$refs.moreInfo.check();
        const data = { ...baseInfo, ...moreInfo, };
        await PropertyManagementApi.register(data);
        this.$emit('done');
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    // 转换资产类型
    convertAssetType(assetType) {
      return find(this.$store.state.dictionary.assetsTypeList, { value: assetType, })?.name;
    },
    // 转换巡检模板
    convertPatrolTemp(val) {
      return val;
    },
    async handleBatchAddProperty() {
      try {
        const baseInfo = await this.$refs.baseInfo.check();
        const moreInfo = await this.$refs.moreInfo.check();
        if (!baseInfo.isAutoCode) {
          throw new Error('系统随机生成编号才能批量添加');
        }
        const data = { ...baseInfo, ...moreInfo, };
        this.$dialog({
          title: '批量添加',
          position: 'center',
          width: '548px',
          component: () => <RegisterBatch data={data} onDone={this.handleAfterBatchRegister}/>,
        });
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    // 批量添加完成处理函数
    async handleAfterBatchRegister() {
      this.$emit('done');
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
 .btn {
  border: 1px solid #409eff;
  border-color: #409eff;
  color: #409eff;
}
.btn.el-button--primary {
  color: white;
}
 .flex-container {
    flex:1;
    overflow: hidden;
  }
.more-info {
  flex:1;
  height:100%;
  &::v-deep .pure-card__body {
    height: calc(100% - 71px)
  }
}
</style>
