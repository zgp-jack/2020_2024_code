<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-24 10:04:49
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-02-24 14:41:21
 * @Description: 巡检单元二维码
-->
<template>
  <el-skeleton animated :loading="loading" :rows="3">
    <template slot="template" />
    <template>
      <div class="pure">
        <template v-for="(item, index) in list">
          <div :key="index" class="card" :class="{'break-page':(1+index)%4===0}">
            <div class="parent-name">{{ item.parentIdToName||'-' }}</div>
            <div class="name">{{ item.name }}</div>
            <div class="qr-code">
              <img :src="item.imageUrl">
            </div>
          </div>
        </template>
      </div>
    </template>
  </el-skeleton>
</template>

<script>
import InspectionAssociatedApi from '../api';
export default {
  name: 'PropertyQRCode',
  props: {
    ids: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      list: [],
      loading: false,
    };
  },

  mounted() {
    this.loading = true;
    this.fetchData();
  },
  methods: {
    // 获取二维码信息
    async fetchData() {
      this.list = await InspectionAssociatedApi.qrCode(this.ids.join(','));
      this.loading = false;
      this.$nextTick(() => {
        this.$emit('print');
      });
    },

  },
};
</script>

<style lang="scss" scoped>
@media print {
  .pure {
    font-size: 50px;
  }
}
$ratio: 1;
.pure {
  font-size:14px*$ratio;
  text-align: center;
  box-sizing: content-box;
  color: #000000;
  .card {
    width: 160px*$ratio;
    height: 210px*$ratio;
    border: 0.5px*$ratio solid #000000;
    border-radius: 8px*$ratio;
    margin-bottom: 20px;
    box-sizing: border-box;
    padding: 10px*$ratio;
  }
  .break-page {
    page-break-after: always;
  }
  .name {
    font-size: 20px*$ratio;
    padding-top: 5px*$ratio;
    padding-bottom: 10px*$ratio;
    font-weight: 400*$ratio;
  }
  .parent-name {
    font-size: 14px*$ratio;
    padding-bottom: 5px*$ratio;
  }
  .qr-code {
    width: 140px*$ratio;
    height: 140px*$ratio;
    border: 1px*$ratio solid #000000;
    border-radius: 10px*$ratio;
    padding: 20px*$ratio;
    box-sizing: border-box;
    margin-right: auto;
    margin-left: auto;
    img {
      width: 100px*$ratio;
      height: 100px*$ratio;
    }
  }
}
</style>
