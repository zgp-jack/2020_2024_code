// label: 表格标题, span:表格宽度(横向占比) , content: 表格内容
// ---------- 需求管理 ----------
// 需求评审
const demandReviewList = {
  updateTime: { label: '评审时间', span: 1, content: '', },
  updateUser: { label: '评审人', span: 1, content: '', },
  projectLevel: { label: '项目级别', span: 1, content: '', },
  result: { label: '评审结果', span: 1, content: '', },
  principal: { label: '项目负责人', span: 1, content: '', },
  priority: { label: '项目优先级', span: 1, content: '', },
  businessRespondent: { label: '业务答辩人', span: 1, content: '', },
  technicalRespondent: { label: '技术答辩人', span: 1, content: '', },
  otherRespondent: { label: '其他参与人', span: 4, content: '', },
};
// 需求评估
const demandAssessList = {
  updateTime: { label: '评估时间', span: 1, content: '', },
  updateUser: { label: '评估人', span: 1, content: '', },
  projectLevel: { label: '项目级别', span: 1, content: '', },
  result: { label: '评估结果', span: 1, content: '', },
  principal: { label: '项目负责人', span: 1, content: '', },
  priority: { label: '项目优先级', span: 1, content: '', },
  businessRespondent: { label: '业务答辩人', span: 1, content: '', },
  technicalRespondent: { label: '技术答辩人', span: 1, content: '', },
  otherRespondent: { label: '其他参与人', span: 4, content: '', },
};
// 技术分析
const technicalAnalyses = {
  updateTime: { label: '操作时间', span: 1, content: '', },
  analyst: { label: '分析人', span: 1, content: '', },
  difficulty: { label: '难易程度', span: 1, content: '', },
  applyType: { label: '实施形式', span: 1, content: '', },
  technicalRisk: { label: '当前技术风险', span: 4, content: '', },
  solution: { label: '建议解决方案', span: 4, content: '', },
  remark: { label: '评估备注', span: 4, content: '', },
  enclosure: {
    label: '附件',
    span: 4,
    slotType: 'file',
    content: [],
  },
};
// 需求分析
const demandAnalyses = {
  optionDate: { label: '操作时间', span: 1, content: '', },
  optionUser: { label: '操作人', span: 1, content: '', },
  type: { label: '需求类型', span: 1, content: '', },
  analyst: { label: '需求分析人', span: 1, content: '', },
  analystTechnical: { label: '技术分析人', span: 4, content: '', },
  coreDemand: { label: '核心需求', span: 4, content: '', },
  demandValue: { label: '需求价值', span: 4, content: '', },
  domain: { label: '涉及业务领域', span: 4, content: '', },
  aboutSystem: { label: '涉及系统', span: 4, content: '', },
  remark: { label: '分析备注', span: 4, content: '', },
  enclosure: {
    label: '附件',
    span: 4,
    slotType: 'file',
    content: [],
  },
};
// 初定级
const firstGrading = {
  updateTime: { label: '定级时间', span: 1, content: '', },
  updateUser: { label: '定级人', span: 1, content: '', },
  projectLevel: { label: '项目级别', span: 1, content: '', },
  projectType: { label: '项目类型', span: 1, content: '', },
  principal: { label: '项目负责人', span: 1, content: '', },
  priority: { label: '项目优先级', span: 1, content: '', },
  businessRespondent: { label: '业务答辩人', span: 1, content: '', },
  technicalRespondent: { label: '技术答辩人', span: 1, content: '', },
  otherRespondent: { label: '其他参与人', span: 4, content: '', },
};
// 调研信息
const investigate = {
  optionDate: { label: '处理时间', span: 1, content: '', },
  optionUser: { label: '处理人', span: 1, content: '', },
  startTime: { label: '调研时间', span: 1, content: '', },
  principal: { label: '调研负责人', span: 1, content: '', },
  users: { label: '调研成员', span: 4, content: '', },
  place: { label: '调研地点', span: 3, content: '', },
  endTime: { label: '期望完成日期', span: 1, content: '', },
  aboutSystem: { label: '涉及系统', span: 4, content: '', },
  purpose: { label: '需求目的', span: 4, content: '', },
  outline: { label: '业务描述', span: 4, content: [], },
  functions: { label: '解决方案设计', span: 4, content: '', },
  followUpActionPlan: { label: '后续行动计划', span: 4, content: '', },
  other: { label: '其他要求', span: 4, content: '', },
  enclosure: {
    label: '附件',
    span: 4,
    slotType: 'file',
    content: [],
  },
  dayTime: { label: '调研工时', span: 2, content: '', },
  dayMode: { label: '工时分配方式', span: 2, content: '', },

};
// 调研成员分配
const investigateUser = {
  optionDate: { label: '分配时间', span: 2, content: '', },
  optionUser: { label: '分配人', span: 1, content: '', },
  principal: { label: '调研负责人', span: 1, content: '', },
  users: { label: '调研成员', span: 4, content: '', },
};
// 需求信息
const demandInfo = {
  title: { label: '需求标题', span: 3, content: '', },
  level: { label: '项目优先级', span: 1, content: '', },
  remark: { label: '需求描述', span: 4, content: '', },
  proposers: { label: '提出人列表', span: 4, slotType: 'inner', content: [], },
  startTime: { label: '提出日期', span: 1, content: '', },
  endTime: { label: '期望完成日期', span: 1, content: '', },
  aboutSystem: { label: '涉及系统', span: 2, content: '', },
  enclosure: {
    label: '附件',
    span: 4,
    slotType: 'file',
    content: [],
  },
};

// ---------- 项目立项 ----------
// 方案制定
const itemInfo = {
  createTime: { label: '创建时间', span: 1, content: '', },
  createUser: { label: '创建人', span: 1, content: '', },
  itemType: { label: '项目类型', span: 1, content: '', },
  reviewer: { label: '审核人', span: 1, content: '', },
  title: { label: '项目名称', span: 1, content: '', },
  remark: { label: '项目描述', span: 4, content: '', },
  startToEndTime: { label: '项目起止日期', span: 2, content: '', },
  parentName: { label: '关联项目', span: 2, content: '', },
  priority: { label: '项目优先级', span: 1, content: '', },
  principal: { label: '项目负责人', span: 1, content: '', },
  projectLevel: { label: '项目级别', span: 1, content: '', },
  itemAttribute: { label: '项目属性', span: 1, content: '', },
  joinUser: { label: '项目参与人员', span: 4, content: '', },
  enclosure: { label: '附件', span: 4, slotType: 'file', content: [], },
};
// 里程碑
const workList = {
  indexNum: { label: '任务序号', span: 1, content: '', },
  createUser: { label: '创建人', span: 1, content: '', },
  principal: { label: '负责人', span: 1, content: '', },
  planUse: { label: '预计工时', span: 1, content: '', },
  name: { label: '任务名称', span: 2, content: '', },
  startToEndTime: { label: '时间', span: 2, content: '', },
  remark: { label: '任务描述', span: 4, content: '', },
  users: { label: '参与人员', span: 4, content: '', },
  parent: { label: '父任务', span: 2, content: '', },
  isHinge: { label: '关键任务', span: 1, content: '', },
  isSubmit: { label: '必须提交文档', span: 1, content: '', },
  according: { label: '工时依据', span: 4, content: '', },
  template: { label: '附件', span: 4, slotType: 'file', content: [], },
};
// 方案评审
const itemReviewList = {
  reviewTime: { label: '评审时间', span: 2, content: '', },
  reviewer: { label: '评审人', span: 1, content: '', },
  result: { label: '评审结果', span: 1, content: '', },
  itemName: { label: '项目名称', span: 4, content: '', },
};

// ---------- 项目实施 ----------
// 处理任务
const itemWork = {
  indexNum: { label: '任务序号', span: 1, content: '', },
  createUser: { label: '创建人', span: 1, content: '', },
  principal: { label: '负责人', span: 1, content: '', },
  planUse: { label: '预计工时', span: 1, content: '', },
  name: { label: '任务名称', span: 2, content: '', },
  startToEndTime: { label: '时间', span: 2, content: '', },
  remark: { label: '任务描述', span: 4, content: '', },
  users: { label: '参与人员', span: 4, content: '', },
  parent: { label: '父任务', span: 2, content: '', },
  isHinge: { label: '关键任务', span: 1, content: '', },
  isSubmit: { label: '必须提交文档', span: 1, content: '', },
  according: { label: '工时依据', span: 4, content: '', },
  template: { label: '附件', span: 4, slotType: 'file', content: [], },
};
// 处理子任务
const handleResultList = {
  // id: { label: '调研工时', span: 4, content: '', },
  users: { label: '处理人', span: 2, content: '', },
  progress: { label: '完成进度', span: 1, content: '', },
  finishTime: { label: '完成时间', span: 1, content: '', },
  remark: { label: '处理描述', span: 4, content: '', },
  enclosure: { label: '附件', span: 4, slotType: 'file', content: '', },
};
// 确认结果
const enterInfoList = {
  enterTime: { label: '确认时间', span: 2, content: '', },
  enterUser: { label: '确认人', span: 1, content: '', },
  result: { label: '确认结果', span: 4, content: '', },
  itemName: { label: '项目名称', span: 1, content: '', },
};

// ---------- 合同发票 ----------
// 合同
const contractInvoiceList = {
  createTime: { label: '创建时间', span: 2, content: '', },
  createUser: { label: '创建人', span: 2, content: '', },
  name: { label: '合同名称', span: 4, content: '', },
  number: { label: '合同编号', span: 1, content: '', },
  contractPrice: { label: '合同金额', span: 1, content: '', },
  signDate: { label: '签约日期', span: 1, content: '', },
  checkDate: { label: '验收日期', span: 1, content: '', },
  itemName: { label: '所属项目', span: 2, content: '', },
  office: { label: '所属科室', span: 2, content: '', },
  companya: { label: '甲方单位', span: 2, content: '', },
  companyaPerson: { label: '甲方联系人', span: 1, content: '', },
  companyaPhone: { label: '甲方联系电话', span: 1, content: '', },
  companyb: { label: '已方单位', span: 2, content: '', },
  companybPerson: { label: '乙方联系人', span: 1, content: '', },
  companybPhone: { label: '已方联系电话', span: 1, content: '', },
  companyc: { label: '丙方单位', span: 2, content: '', },
  companycPerson: { label: '丙方联系人', span: 1, content: '', },
  companycPhone: { label: '丙方联系电话', span: 1, content: '', },
  qaDate: { label: '质保时间', span: 1, content: '', },
  qaGiveDate: { label: '赠送维保期限', span: 1, content: '', },
  qaMoney: { label: '有偿保费', span: 2, content: '', },
  attachment: { label: '附件', span: 4, slotType: 'file', content: [], },
};
// 还款计划
const payPlanList = {
  planNo: { label: '付款分期', span: 1, content: '', },
  explan: { label: '付款说明', span: 2, content: '', },
  payRate: { label: '付款比例', span: 1, content: '', },
  payPlanDate: { label: '计划付款日期', span: 1, content: '', },
  payablePrice: { label: '应付金额', span: 1, content: '', },
  paidPrice: { label: '已付金额', span: 1, content: '', },
  waitPrice: { label: '待付金额', span: 1, content: '', },
};
// 还款
const contractPayList = {
  payDate: { label: '付款日期', span: 1, content: '', },
  payPrice: { label: '付款金额', span: 1, content: '', },
  payCompany: { label: '付款单位', span: 2, content: '', },
  remarks: { label: '备注', span: 4, content: '', },
};
// 发票
const receiptList = {
  planNo: { label: '开票分期', span: 1, content: '', },
  receiptType: { label: '发票类型', span: 1, content: '', },
  needReceiptPrice: { label: '应开金额', span: 1, content: '', },
  receiptPrice: { label: '本次开票金额', span: 1, content: '', },
  receiptNo: { label: '发票编号', span: 4, content: '', },
  company: { label: '开票单位', span: 4, content: '', },
  receiptUser: { label: '开票人', span: 1, content: '', },
  receiptDate: { label: '开票日期', span: 1, content: '', },
  receiveUser: { label: '接收', span: 1, content: '', },
  receiveDate: { label: '接收日期', span: 1, content: '', },
  remarks: { label: '备注', span: 4, content: '', },
  attachment: { label: '附件', span: 4, slotType: 'file', content: '', },
};
const meetingBook = {
  createTime: { label: '创建时间', span: 1, content: '', },
  createUser: { label: '创建人', span: 1, content: '', },
  host: { label: '主持人', span: 1, content: '', },
  reviewer: { label: '审批人', span: 1, content: '', },
  title: { label: '会议主题', span: 3, content: [], },
  type: { label: '会议类型', span: 1, content: '', },
  subject: { label: '会议议题', span: 4, content: '', },
  meetingRoomName: { label: '会议室名称', span: 2, content: '', },
  meetingRoomAddress: { label: '会议室地址', span: 2, content: '', },
  time: { label: '会议时间', span: 2, content: '', },
  itemName: { label: '所属项目', span: 2, content: '', },
  meetingPersons: { label: '联系人员', span: 4, slotType: 'inner', content: '', },
  meetingUsers: { label: '参会人员', span: 4, content: '', },
};
const meetingSummary = {
  updateTime: { label: '记录时间', span: 2, content: '', },
  updateUser: { label: '记录人', span: 2, content: '', },
  attendMeetingUsers: { label: '到会人员', span: 4, content: '', },
  summary: { label: '会议纪要', span: 4, content: '', },
};
const taskList = {
  compTime: { label: '调研工时', span: 2, content: '', },
  leaderUser: { label: '调研工时', span: 2, content: '', },
  partUser: { label: '调研工时', span: 2, content: '', },
  planEndDate: { label: '调研工时', span: 2, content: '', },
  states: { label: '调研工时', span: 2, content: '', },
  taskName: { label: '调研工时', span: 2, content: '', },
  taskOrder: { label: '调研工时', span: 2, content: '', },
};
const taskDetailList = {
  indexNum: { label: '任务序号', span: 1, content: '', },
  taskName: { label: '任务名称', span: 2, content: '', },
  level: { label: '紧急程度', span: 1, content: '', },
  taskDesc: { label: '详细描述', span: 4, content: '', },
  giveTime: { label: '提出时间', span: 1, content: '', },
  giveUser: { label: '提出人', span: 1, content: '', },
  office: { label: '提出科室', span: 2, content: '', },
  auditUser: { label: '审核人', span: 1, content: '', },
  leaderUser: { label: '责任人', span: 1, content: '', },
  startToEndTime: { label: '计划时间', span: 2, content: '', },
  partUser: { label: '参与人', span: 4, content: '', },
  itemName: { label: '所属项目', span: 4, content: '', },
  planDays: { label: '预计工时', span: 1, content: '', },
  mustAttr: { label: '必须提交文档', span: 1, content: '', },
  taskCate: { label: '任务类型', span: 2, content: '', },
  attachment: { label: '附件', span: 4, slotType: 'file', content: '', },
};
const templateTaskDetailList_1 = {
  indexNum: { label: '任务序号', span: 1, content: '', },
  createUser: { label: '创建人', span: 1, content: '', },
  createTime: { label: '创建时间', span: 1, content: '', },
  level: { label: '紧急程度', span: 1, content: '', },
  taskName: { label: '任务名称', span: 2, content: '', },
  startToEndTime: { label: '计划时间', span: 2, content: '', },
  taskDesc: { label: '详细描述', span: 4, content: '', },
  giveTime: { label: '提出时间', span: 1, content: '', },
  giveUser: { label: '提出人', span: 1, content: '', },
  office: { label: '提出科室', span: 2, content: '', },
  auditUser: { label: '审核人', span: 1, content: '', },
  leaderUser: { label: '责任人', span: 1, content: '', },
  itemName: { label: '所属项目', span: 4, content: '', },
  partUser: { label: '参与人员', span: 4, content: '', },
  planDays: { label: '预计工时', span: 1, content: '', },
  mustAttr: { label: '必须提交文档', span: 1, content: '', },
  taskCate: { label: '任务类型', span: 2, content: '', },
  attachment: { label: '附件', span: 4, slotType: 'file', content: '', },
};
const templateTaskDetailList_2 = {
  indexNum: { label: '任务序号', span: 1, content: '', },
  createUser: { label: '创建人', span: 1, content: '', },
  createTime: { label: '创建时间', span: 1, content: '', },
  planDays: { label: '预计工时', span: 1, content: '', },
  taskName: { label: '子任务名称', span: 2, content: '', },
  startToEndTime: { label: '计划时间', span: 2, content: '', },
  taskDesc: { label: '子任务描述', span: 4, content: '', },
  leaderUser: { label: '责任人', span: 4, content: '', },
  partUser: { label: '参与人员', span: 4, content: '', },
  attachment: { label: '附件', span: 4, slotType: 'file', content: '', },
};
const taskHandleInfoList = {
  createUser: { label: '处理人', span: 2, content: '', },
  compRate: { label: '完成进度', span: 1, content: '', },
  processTime: { label: '完成时间', span: 1, content: '', },
  explan: { label: '说明', span: 4, content: '', },
  attachment: { label: '附件', span: 4, slotType: 'file', content: [], },
};
const templateTaskList = {
  childTaskList: { label: '调研工时', span: 2, content: '', },
  compTime: { label: '调研工时', span: 2, content: '', },
  leaderUser: { label: '调研工时', span: 2, content: '', },
  partUser: { label: '调研工时', span: 2, content: '', },
  planEndDate: { label: '调研工时', span: 2, content: '', },
  states: { label: '调研工时', span: 2, content: '', },
  taskName: { label: '调研工时', span: 2, content: '', },
};
export {
  // 需求管理
  demandReviewList,
  demandAssessList,
  technicalAnalyses,
  demandAnalyses,
  firstGrading,
  investigate,
  investigateUser,
  demandInfo,
  // 项目立项
  itemInfo,
  workList,
  itemReviewList,

  itemWork,
  handleResultList,
  enterInfoList,
  contractInvoiceList,
  payPlanList,
  contractPayList,
  receiptList,

  meetingBook,
  meetingSummary,
  taskList,
  taskDetailList,
  templateTaskDetailList_1,
  templateTaskDetailList_2,
  taskHandleInfoList,
  templateTaskList,
};
