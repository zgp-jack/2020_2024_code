<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-22 13:35:20
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-04-13 10:29:59
 * @Description:科室二维码
-->
<template>
  <el-skeleton animated :loading="loading" :rows="3">
    <template slot="template" />
    <template>
      <div class="pure">
        <template v-for="(item,index) in list">
          <department-qr-code :key="index" :config="item" />
        </template>

      </div>
    </template>
  </el-skeleton>

</template>

<script>
import DepartmentApi from '@/feat/system/department/api';
import DepartmentQrCode from './departmentQrCodeCard.vue';
import OtherSettingApi from '@/feat/system/otherSetting/api.js';

export default {
  name: 'PropertyQRCode',
  components: {
    DepartmentQrCode,
  },
  props: {
    deptIds: {
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
  created() {
  },
  mounted() {
    this.loading = true;
    this.fetchData();
  },
  methods: {
    // 二维码配置信息
    async getQrCodeConfig() {
      const res = await OtherSettingApi.getDepartmentQrCodeConfig();
      const { showAcceptDept, showCustomPhrase, customPhrase, acceptDept, printDirection, qrSize, } = res;
      return {
        showAcceptDept: Number(showAcceptDept),
        showCustomPhrase: Number(showCustomPhrase),
        customPhrase: customPhrase || '',
        acceptDept: acceptDept || '',
        printDirection: printDirection || 0,
        qrSize: this.formatQrSize(qrSize),
      };
    },
    formatQrSize(qrSize) {
      let result = [];
      try {
        result = qrSize.split('*');
        return result;
      } catch (error) {
        this.$message.warning(`二维码大小系统设置{${qrSize}}有误，将采用默认值`);
        throw new Error('二维码大小系统设置有误，将采用默认值');
      }
    },
    // 获取二维码信息
    async fetchData() {
      let config = null;
      try {
        config = await this.getQrCodeConfig();
      } catch (error) {
        console.log(error);
        return;
      }

      const list = await DepartmentApi.qrcode(this.deptIds.join(','));

      this.list = list.map((item) => {
        return {
          // 二维码图片
          imageUrl: item.imageUrl,
          // 科室名称
          deptName: item.deptName,
          ...config,
        };
      });
      this.loading = false;

      this.$nextTick(() => {
        this.$emit('print', config);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pure {
  text-align: center;

  .card {
    width: 320px;
    height: 440px;
    background: #ffffff;
    border-radius: 15px;
    border: 1px solid #000000;
    margin-right: auto;
    margin-left: auto;
    margin-top: 40px;
    padding: 20px;
    box-sizing: border-box;
  }
  .title {
    font-size: 36px;
    font-weight: 400;
    margin-bottom: 5px;
  }
  .qr-code {
    width: 280px;
    height: 284px;
    border: 1px solid #000000;
    border-radius: 10px;
    margin-right: auto;
    margin-left: auto;
    padding: 40px 40px 0 40px;
    box-sizing: border-box;
    img {
      width: 200px;
      height: 200px;
    }
  }
  .dept {
    font-size: 24px;
    margin-bottom: 26px;
  }
  .dept2 {
    font-size: 24px;
  }
}

</style>
