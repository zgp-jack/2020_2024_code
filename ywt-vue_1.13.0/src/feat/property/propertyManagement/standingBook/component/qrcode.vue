<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-18 13:47:58
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-05-25 14:48:20
 * @Description:资产二维码
-->
<template>
  <el-skeleton animated :loading="loading" :rows="3">
    <template slot="template" />
    <template>
      <div class="pure">
        <template v-for="(item, index) in list">
          <div :key="index" class="card">
            <div class="hospital">{{ item.hospitalToName }}</div>
            <div>
              <div class="label">
                <div>资产类型</div>
                <div>资产型号</div>
                <div>资产名称</div>
                <div>使用科室</div>
              </div>
              <div class="value">
                <div>{{ item.assetsTypeToName }}</div>
                <div>{{ item.model }}</div>
                <div>{{ item.name }}</div>
                <div>{{ item.useDeptToName }}</div>
              </div>
              <div class="qr-code">
                <img :src="item.imageUrl">
              </div>
            </div>
            <div>
              <div class="label">
                <div>所在位置</div>
              </div>
              <div class="value-long">
                <div>{{ item.place }}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </el-skeleton>
</template>

<script>
import PropertyApi from '@/feat/property/propertyManagement/api';
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
      this.list = await PropertyApi.qrcode(this.ids.join(','));
      this.loading = false;
      this.$nextTick(() => {
        this.$emit('print');
      });
    },

  },
};
</script>

<style lang="scss" scoped>
.pure {
  font-size:10px;
  line-height: 17px;
  text-align: center;
  box-sizing: border-box;
  .card {
    width: 230px;
    height: 112px;
    border: 0.5px solid #000000;
    border-radius: 8px;
    margin-bottom: 20px;
     box-sizing: border-box;
  }

  .hospital {
    font-size: 14px;
    font-weight: bold;
    padding: 3.5px 0;
  }
  .label {
    width: 49px;
    vertical-align: top;
    display: inline-block;
    div {
       height: 17px;
       border-top: 0.5px solid #000000;
       border-right: 0.5px solid #000000;
        box-sizing: border-box;
    }
  }
  .value {
    width: 106px;
        vertical-align: top;
    display: inline-block;
     div {
       height: 17px;
       border-top: 0.5px solid #000000;
       border-right: 0.5px solid #000000;
        box-sizing: border-box;
     }
  }
  .value-long {
    width: 178px;
    display: inline-block;
     border-top: 0.5px solid #000000;
      box-sizing: border-box;
  }
  .qr-code {
    width: 70.5px;
    display: inline-grid;
    padding:3.5px;
    border-top: 0.5px solid #000000;
     box-sizing: border-box;
    justify-items: center;
    img {
      width: 60px;
      height: 60px;
    }
  }
}
</style>
