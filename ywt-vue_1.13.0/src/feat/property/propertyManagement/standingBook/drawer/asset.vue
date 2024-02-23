<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-04 15:52:23
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-01 10:45:31
 * @Description:资产弹窗
-->
<template>
  <div
    v-loading="loading"
    class="drawer"
    :element-loading-text="loadingText"
  >
    <div class="header">
      <span class="title">
        {{ title }}
        <span v-if="id">
          <span class="id">资产编号:{{ formData.assetsCode }}</span>
        </span>
      </span>
    </div>
    <div class="body">
      <div class="flex">
        <base-info
          ref="baseInfo"
          :operator-type="operatorType"
          style="margin-bottom:10px"
          :show-expand="expand"
          :data="baseInfo"
        />
        <div class="flex-container">
          <more-info
            ref="moreInfo"

            :operator-type="operatorType"
            style="margin-bottom:10px"
            class="more-info"
            :data="moreInfo"
            :show-expand="expand"
          />
        </div>

        <div v-if="operatorType==='CREATE'" class="footer">
          <pure-button label="添加资产" @click="onAddAsset" />
          <pure-button label="批量添加" type="wire-frame" @click="onBatchAddAsset" />
        </div>
        <div v-else-if="operatorType==='UPDATE'" class="footer">
          <pure-button
            label="提交"
            @click="onUpdateAsset"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import RegisterBatch from '../dialog/registerBatch.vue';
import BaseInfo from '../panel/baseInfo.vue';
import MoreInfo from '../panel/moreInfo.vue';
import FormDialog from '@/minxins/common/formDialog';
import AssetApi from '@/feat/property/propertyManagement/api';
export default {
  name: 'AssetInfoDrawer',
  components: {
    BaseInfo,
    MoreInfo,
  },

  mixins: [FormDialog],
  data() {
    return {
      name: '资产',
      expand: true,
      detailApi: AssetApi.detail,
      baseInfo: null,
      moreInfo: null,
      formData: {},
    };
  },
  async created() {

  },
  methods: {
    async afterFetchDetail() {
      const { name,
        model,
        seriesNumb,
        useDate,
        years,
        equipmentState,
        assetsType,
        assetsSource,
        outLinked,
        isAutoCode,
        codePrefix,
        assetsCode,
        isPublic,
        isMetering,
        meteringTimer,
        useDept,
        place,
        personLiable,
        isMaintain,
        maintainTerm,
        maintainCompany,
        maintainUser,
        isPatrol,
        patrolTemp,
        patrolDept,
        remark,
        enclosure,
        purchaseCode,
        projectName,
        purchaseDate,
        purchasePrice,
        purchaseNumber,
        brand,
        manufacturer,
        supplier,
        manufacturerPhone,
        salesPhone,
        originPlace,
        ipPlace,
        macPlace,
        operatingSystem,
        systemVersion,
        isGenuine,
        configuration,
        pertainUnit,
        sendUser,
        sendTeam,
        sendUserToName,
        sendTeamToName,
      } = this.formData;
      this.baseInfo = Object.assign({}, {
        name,
        model,
        seriesNumb,
        useDate,
        years,
        equipmentState,
        assetsType,
        assetsSource,
        outLinked,
        isAutoCode,
        codePrefix,
        assetsCode,
        isPublic,
        isMetering,
        meteringTimer,
        useDept,
        place,
        personLiable,
        isMaintain,
        maintainTerm,
        maintainCompany,
        maintainUser,
        isPatrol,
        patrolTemp,
        patrolDept,
        remark,
        enclosure,
        pertainUnit,
        sendUser,
        sendTeam,
        sendUserToName,
        sendTeamToName,
      });
      this.moreInfo = Object.assign({}, {
        purchaseCode,
        projectName,
        purchaseDate,
        purchasePrice,
        purchaseNumber,
        brand,
        manufacturer,
        supplier,
        manufacturerPhone,
        salesPhone,
        originPlace,
        ipPlace,
        macPlace,
        operatingSystem,
        systemVersion,
        isGenuine,
        configuration,
      });
    },

    // 添加资产
    async onAddAsset() {
      try {
        const baseInfo = await this.$refs.baseInfo.check();
        const moreInfo = await this.$refs.moreInfo.check();
        const data = { ...baseInfo, ...moreInfo, };
        await AssetApi.register(data);
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
    // 批量添加资产
    async onBatchAddAsset() {
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
    async onUpdateAsset() {
      try {
        const baseInfo = await this.$refs.baseInfo.check();
        const moreInfo = await this.$refs.moreInfo.check();
        const data = { ...baseInfo, ...moreInfo, id: this.id, };
        await AssetApi.update(data);
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
  },
};
</script>

<style lang="scss" scoped>
.flex {
  height: 100%;
  display: flex;
  flex-direction: column;
}
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
.footer {
  height: 56px;
  padding-top: 12px;
  padding-bottom: 12px;
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
   .id {
    padding-left: 36px;
    font-size: 14px;
    color: #879bba;
  }
.more-info {
  flex:1;
  height:100%;
  &::v-deep .pure-card__body {
    height: calc(100% - 40px)
  }
}
</style>
