<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-19 17:00:01
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-08-24 15:15:05
 * @Description:资产查看
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
        <base-info ref="baseInfo" style="margin-bottom:10px" :data="baseInfo" :show-expand="expand" action-type="view" />
        <div class="flex-container">
          <more-info ref="moreInfo" style="margin-bottom:10px" :data="moreInfo" :show-expand="expand" class="more-info" action-type="view" />
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  components: {
    BaseInfo: () => import('../panel/baseInfo.vue'),
    MoreInfo: () => import('../panel/moreInfo.vue'),
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      expand: true,
      baseInfo: null,
      moreInfo: null,
    };
  },
  async created() {
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
    } = this.data;
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
