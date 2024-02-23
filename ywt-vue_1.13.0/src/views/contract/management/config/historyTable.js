import { formatCash, member, stringifyToArr, } from '@/filters';
import _ from 'lodash';
import Attachment from '@/views/project/components/attachment/attachment.vue';
import store from '@/store';
import { tableCellIconData, } from '@/views/project/common';
// 发票类型(1增值税专用发票2普通发票3专业发票)
export const receiptType = [{
  type: 1,
  text: '增值税专用发票',
}, {
  type: 2,
  text: '普通发票',
}, {
  type: 3,
  text: '专业发票',
}];
const icons = {
  file: require('@/assets/project/icons/file.svg'),
};
const receiptTypeMap = _.keyBy(receiptType, 'type');
const config = [{
  type: 'index',
  label: '序号',
  width: '60px',
}, {
  label: '开票日期',
  prop: 'receiptDate',
}, {
  label: '开票单位',
  prop: 'companyId',
  formatter: (v) => {
    const enterpriseList = store.state['contract/index'].enterpriseList;
    return _.find(enterpriseList, { id: v['companyId'], })?.name || '';
  },
}, {
  label: '开票人',
  prop: 'receiptUser',

}, {
  label: '票据类型',
  prop: 'receiptType',
  formatter: (v) => {
    return receiptTypeMap[v['receiptType']].text;
  },
}, {
  label: '票据编号',
  prop: 'receiptNo',
  formatter: (v) => {
    return v['receiptNo'] || '-';
  },
}, {
  label: '接收人',
  prop: 'reveiveUserId',
  formatter: (v) => {
    return member(v['reveiveUserId']);
  },
}, {
  label: '开票金额',
  prop: 'receiptPrice',
  formatter: (v) => {
    return formatCash(v['receiptPrice']);
  },
}, {
  label: '操作',
  slot: true,
}, {
  label: '附件',
  prop: 'attachment',
  formatter: (v) => {
    const num = stringifyToArr(v['attachment']).length;
    return tableCellIconData(icons.file, num, v['attachment'], Attachment, '附件');
  },
}];

export default config;
