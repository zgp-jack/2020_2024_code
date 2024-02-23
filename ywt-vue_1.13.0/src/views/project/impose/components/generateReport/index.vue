<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-08-15 14:11:01
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-09-06 19:51:55
 * @FilePath: \ywt-vue-qp\src\views\project\impose\components\generateReport\index.vue
 * @Description:生成报告页
-->
<template>
  <div class="container">
    <div class="container-header">
      <div class="back mrg-right" @click="back">
        <i class="el-icon-back" /> 返回
      </div>
      <div class="mrg-right">项目报告 编号：{{ isChangeRow.itemCode }}</div>
      <el-button :loading="isReportLoading" size="mini" type="primary" plain class="el-icon-download mrg-right report-button" @click="downloadReport">{{ downloadName }}</el-button>
    </div>
    <el-tabs class="Q-el-tabs-style" :tab-position="'left'" @tab-click="handleClick">
      <el-tab-pane v-for="(item,idx) in componentList" :key="idx" :label="item.name" :component-key="item.component">
        <div class="title-name">
          {{ item.name }}
          <div v-if="item.component === 'Enclosures'" style="margin-left:10px">
            <el-button size="mini" plain type="primary" @click="downloadFile('isAll')">下载所有附件</el-button>
            <el-button size="mini" plain type="primary" @click="downloadFile('change')">下载选中附件</el-button>
          </div>
        </div>
        <div
          v-show="!loading"
          v-loading="loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          style="position: absolute;top: 50%;left: 50%;"
        />
        <component :is="componentName" v-if="componentName === item.component && componentData[componentName]" ref="component" :data="item" :component-data="componentData[componentName]" @delUidStr="delUidStr" @addUidStr="addUidStr" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, } from 'vuex';
import ReportApi from '@/apis/itemReport';
export default {
  components: {
    ItemDesc: () => import('./itemDesc.vue'),
    Demand: () => import('./demand.vue'),
    ItemEstablish: () => import('./itemEstablish.vue'),
    ImplementStart: () => import('./implementStart.vue'),
    ContractInvoice: () => import('./contractInvoice.vue'),
    MeetingTask: () => import('./meetingTask.vue'),
    FaultRepair: () => import('./faultRepair.vue'),
    InspectionManagement: () => import('./inspectionManagement.vue'),
    Enclosures: () => import('./enclosures.vue'),
  },
  props: {
    componentList: {
      type: Array,
      default: () => [],
    },
    isChangeRow: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // downloadName: '下载报告准备中',
      isReportLoading: true,
      componentName: 'ItemDesc',
      componentData: {
        ItemDesc: {},
        Demand: {},
        ItemEstablish: {},
        ProjectImplementation: {},
        ContractInvoice: [],
        MeetingTask: {},
        FaultRepair: {},
        InspectionManagement: {},
        Enclosures: [],
      },
      allUidStr: [],
      loading: false,
      timer: null,
      downloadReportFile: {},
    };
  },
  computed: {
    downloadName() {
      let downloadName = '';
      this.isReportLoading ? downloadName = '下载报告准备中' : downloadName = '下载报告';
      return downloadName;
    },
    isShow() {
      return JSON.stringify(this.componentData[this.componentName]) !== '{}' || JSON.stringify(this.componentData[this.componentName]) !== '[]';
    },
    ...mapState('login', {
      baseUrl: (v) => {
        return v['uriConfig'].fileBaseUri;
      },
    }),
  },
  created() {
    this.timer = setInterval(() => {
      this.getDownloadType(this.isChangeRow.itemCode);
    }, 5000);
    this.getByModuleData(this.isChangeRow.itemCode, this.componentName);
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    getByModuleData(itemCode, makeItems) {
      this.loading = true;
      ReportApi.getByModule({ itemCode, makeItems, }).then(res => {
        this.loading = false;
        this.componentData[makeItems] = JSON.parse(res);
        this.componentName = makeItems;
      });
    },
    getDownloadType(itemCode) {
      this.isReportLoading = true;
      ReportApi.getByModule({ itemCode, makeItems: 'FileUrl', }).then(res => {
        const data = JSON.parse(res);
        if (JSON.stringify(data) !== '{}' && data.url) {
          this.isReportLoading = false;
          this.downloadReportFile = data;
          clearInterval(this.timer);
        }
      });
    },
    downloadReport() {
      const { url, fileName, } = { ...this.downloadReportFile, };
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = `${this.baseUrl}${url}`;
      link.download = fileName;// 文件名称
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    back() {
      this.isReportLoading = true;
      this.$emit('isShow', false);
    },
    handleClick(tab) {
      const componentName = tab.$attrs['component-key'];
      this.getByModuleData(this.isChangeRow.itemCode, componentName);
    },
    downloadFile(type) {
      this.downloadSever(type);
    },
    async downloadSever(type) {
      let data = {};
      if (type === 'change') {
        data = { itemCode: this.isChangeRow.itemCode, items: this.allUidStr, isAll: false, };
      } else {
        data = { itemCode: this.isChangeRow.itemCode, isAll: true, };
      }
      const res = await ReportApi.downloadItem({ ...data, });
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(res);
      link.download = '项目报告书.zip';
      link.click();
    },
    addUidStr(uidStr) {
      this.allUidStr = [...new Set(this.allUidStr.concat(uidStr))];
    },
    delUidStr(uid) {
      this.allUidStr = this.allUidStr.filter(item => { return item !== uid; });
    },
  },
};
</script>

<style lang='scss' scoped>
.container{
  padding: 0 10px;
  height: 100%;
  .container-header{
    height: 64px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #DCDFE6;
    .back{
      font-size: 18px;
      color: #2B65D9;
      line-height: 18px;
      cursor: pointer;
      padding-right: 10px;
      border-right: 3px solid #DCDFE6;
    }
    .mrg-right{
      font-size: 18px;
      margin-right: 20px;
    }
    .report-button{
      padding: 5px 10px;
      font-size: 16px;
    }
  }
  .Q-el-tabs-style{
    padding: 20px 0 !important;
    height: calc(100% - 64px) !important;
    ::v-deep .el-tabs__header .el-tabs__item {
      color: #000000 !important;
      font-size: 18px !important;
      &.is-active {
        background-color: #ffffff !important;
        color: #2B65D9 !important;
      }
      &.el-tabs__active-bar {
        background-color: #2B65D9 !important;
      }
    }
    ::v-deep .el-tabs__header .el-tabs__active-bar {
      background-color: #2B65D9 !important;
      height: 40px !important;
    }
    ::v-deep .el-tabs__content{
      height: 100%;
      overflow: auto;
    }
    .title-name{
      font-weight: 600;
      font-size: 24px;
      color: rgba(0,0,0,0.85);
      line-height: 32px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
