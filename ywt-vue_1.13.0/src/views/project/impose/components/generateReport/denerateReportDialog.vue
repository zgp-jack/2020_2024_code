<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-08-16 16:34:23
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-08-17 17:07:56
 * @FilePath: \big-screenc:\Users\cunzhe\Desktop\全院\ywt-vue-qp\src\views\project\impose\components\generateReport\denerateReportDialog.vue
 * @Description:生成报告弹窗
-->
<template>
  <div>
    <div>选择报告需要生成的模块：</div>
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="(item,idx) in tabsList" :key="idx" class="checkbox" :label="item.name" :disabled="item.disabled" />
    </el-checkbox-group>
    <div class="btns">
      <el-button size="mini" @click="cancel">取 消</el-button>
      <el-button type="primary" size="mini" @click="confirm">确 定</el-button>
    </div>
  </div>
</template>

<script>
import ReportApi from '@/apis/itemReport';
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      checkList: [
        '项目概况',
        '需求管理',
        '项目立项',
        '项目实施',
        '合同发票',
        '会议任务'
        // '故障报修',
        // '巡检管理',
        // '项目文件'
      ],
      tabsList: [
        { name: '项目概况', component: 'ItemDesc', disabled: true, },
        { name: '需求管理', component: 'Demand', disabled: false, },
        { name: '项目立项', component: 'ItemEstablish', disabled: false, },
        { name: '项目实施', component: 'ImplementStart', disabled: false, },
        { name: '合同发票', component: 'ContractInvoice', disabled: false, },
        { name: '会议任务', component: 'MeetingTask', disabled: false, },
        // { name: '故障报修', component: 'FaultRepair', disabled: true, },
        // { name: '巡检管理', component: 'InspectionManagement', disabled: true, },
        { name: '项目文件', component: 'Enclosures', disabled: false, }
      ],
    };
  },
  methods: {
    cancel() {
      this.$emit('done', false);
    },
    confirm() {
      const checkedBox = this.setIsCheckbox();
      const checkedStr = this.setIsServeCheckbox(checkedBox);
      this.setItemReport(this.data.itemCode, checkedStr, checkedBox);
    },
    setIsCheckbox() {
      const IsCheckbox = [];
      this.tabsList.forEach(item => {
        this.checkList.forEach(el => {
          item.name === el && IsCheckbox.push(item);
        });
      });
      return IsCheckbox;
    },
    setIsServeCheckbox(checkedBox) {
      let IsCheckStr = '';
      checkedBox.forEach((item, idx) => {
        if (idx + 1 === this.checkList.length) {
          IsCheckStr += item.component;
        } else {
          IsCheckStr += `${item.component},`;
        }
      });
      return IsCheckStr;
    },
    setItemReport(itemCode, makeItems, checkedBox) {
      ReportApi.make({ itemCode, makeItems, }).then(res => {
        this.$emit('done', true, this.data, checkedBox);
      });
    },
  },
};
</script>

<style>
.checkbox{
  margin-top: 20px;
}
.btns{
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
