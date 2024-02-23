/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-01 16:58:04
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-11 17:16:52
 * @Description: 人员画像API
 */
import Fetch from '@/utils/fetch';
/**
 * 人员画像列表
 */
const list = ({
  pageNum = 0,
  pageSize = 10,
  name,
  education,
  position,
  teamId,
  specialties,
  staging,
} = {}) => Fetch.post('/bus/busPersonnelInfo/queryByPage', {
  pageNum,
  pageSize,
  name,
  education,
  position,
  teamId,
  specialties,
  staging,
});
/**
 * 根据用户id获取个人信息
 * @param {Number} engineerId 用户id
 */
const engineerDetail = (engineerId) => Fetch.post('/bus/busPersonnelInfo/getByUserId', {
  userId: engineerId,
});
/**
 * 根据个人信息id获取人员画像基本信息
 * @param {Number} id 个人信息id
 */
const baseInfoDetail = (id) => Fetch.post('/bus/busPersonnelInfo/getById', {
  id,
});
/**
 * 人员画像预览信息
 * @param {Number} id 个人信息id
 * @returns
 */
const preview = (id) => Fetch.post('/bus/busPersonnelInfo/personnelPreview', {
  id,
});
/**
 * 新增人员画像基本信息
 * @param {Number} userId 用户id
 * @param {String} name 姓名
 * @param {String} gender 性别 字典gender_code 男：1，女：2
 * @param {String} birthday 出生日期 （1995-01-01）
 * @param {String} nativePlace  籍贯
 * @param {String} education  学历 字典user_education
 * @param {String} position  职位
 * @param {String} workDate  工作日期（1995-01-01）
 * @param {String} phone  联系电话
 * @param {Number} deptId  科室id
 * @param {Number} teamId  小组id
 * @param {String} photoAddr  照片地址
 * @returns
 */
const createBaseInfo = ({
  userId,
  name,
  gender,
  birthday,
  nativePlace,
  education,
  position,
  workDate,
  phone,
  deptId,
  teamId,
  photoAddr,
} = {}) => Fetch.post('/bus/busPersonnelInfo/saveOrUpdate', {
  userId,
  name,
  gender,
  birthday,
  nativePlace,
  education,
  position,
  workDate,
  phone,
  deptId,
  teamId,
  photoAddr,
});
/**
 * 更新人员画像基本信息
 *
 * @param {Number} id 个人信息id （更新时传）
 * @param {Number} userId 用户id
 * @param {String} name 姓名
 * @param {String} gender 性别 字典gender_code 男：1，女：2
 * @param {String} birthday 出生日期 （1995-01-01）
 * @param {String} nativePlace  籍贯
 * @param {String} education  学历 字典user_education
 * @param {String} position  职位
 * @param {String} workDate  工作日期（1995-01-01）
 * @param {String} phone  联系电话
 * @param {Number} deptId  科室id
 * @param {Number} teamId  小组id
 * @param {String} photoAddr  照片地址
 * @returns
 */
const updateBaseInfo = ({
  id,
  userId,
  name,
  gender,
  birthday,
  nativePlace,
  education,
  position,
  workDate,
  phone,
  deptId,
  teamId,
  photoAddr,
} = {}) => Fetch.post('/bus/busPersonnelInfo/saveOrUpdate', {
  id,
  userId,
  name,
  gender,
  birthday,
  nativePlace,
  education,
  position,
  workDate,
  phone,
  deptId,
  teamId,
  photoAddr,
});
/**
 * 删除人员画像基本信息（删除人员画像）
 * @param {Number} id 人员画像id
 */
const deleteBaseInfo = (id) => Fetch.post('/bus/busPersonnelInfo/deleteById', {
  id,
});

// #region 人员画像-学历信息相关
/**
 * 新增人员画像学历信息
 * @param {Number} personnelId 人员画像id
 * @param {String} education  学历 字典user_education
 * @param {String} startDate  开始时间（1995-01-01）
 * @param {String} endDate  结束时间（1995-01-01）
 * @param {String} school  毕业院校
 * @param {String} major  专业
 */
const createQualificationInfo = ({
  personnelId,
  education,
  startDate,
  endDate,
  school,
  major,
} = {}) => Fetch.post('/bus/personnelEducation/saveOrUpdate', {
  personnelId,
  education,
  startDate,
  endDate,
  school,
  major,
});
/**
 * 更新人员画像学历信息
 * @param {Number} id 学历id
 * @param {Number} personnelId 人员画像id
 * @param {String} education  学历 字典user_education
 * @param {String} startDate  开始时间（1995-01-01）
 * @param {String} endDate  结束时间（1995-01-01）
 * @param {String} school  毕业院校
 * @param {String} major  专业
 */

const updateQualificationInfo = ({
  id,
  personnelId,
  education,
  startDate,
  endDate,
  school,
  major,
} = {}) => Fetch.post('/bus/personnelEducation/saveOrUpdate', {
  id,
  personnelId,
  education,
  startDate,
  endDate,
  school,
  major,
});
/**
 * 删除人员画像学历信息
 * @param {Number} id 学历id
 * @returns
 */
const deleteQualificationInfo = (id) => Fetch.post('/bus/personnelEducation/deleteById', {
  id,
});
/**
 * 学历信息列表
 * @param {Number} personnelId 人员画像id
 * @returns
 */
const qualificationInfoList = (personnelId) => Fetch.post('/bus/personnelEducation/getEducationList', {
  personnelId,
});
// #endregion 人员画像-学历信息相关

// #region 人员画像-技能信息相关
/**
 * 新增人员画像技能信息
 * @param {Number} personnelId 人员画像id
 * @param {String} specialtie 技能
 */
const createSkillInfo = ({
  personnelId,
  specialtie,
} = {}) => Fetch.post('/bus/personnelSpecialtie/saveOrUpdate', {
  personnelId,
  specialtie,
});
/**
 * 更新人员画像技能信息
 * @param {Number} id 技能id
 * @param {Number} personnelId 人员画像id
 * @param {String} specialtie 技能
 */
const updateSkillInfo = ({
  id,
  personnelId,
  specialtie,
} = {}) => Fetch.post('/bus/personnelSpecialtie/saveOrUpdate', {
  id,
  personnelId,
  specialtie,
});
/**
 * 删除人员画像技能信息
 * @param {Number} id 技能id
 * @returns
 */
const deleteSkillInfo = (id) => Fetch.post('/bus/personnelSpecialtie/deleteById', {
  id,
});
/**
 * 技能信息列表
 * @param {Number} personnelId 人员画像id
 * @returns
 */
const skillInfoList = (personnelId) => Fetch.post('/bus/personnelSpecialtie/getByPersonnelId', {
  personnelId,
});
// #endregion 人员画像-技能信息相关

// #region 人员画像-工作经历相关
/**
 * 新增人员画像工作经历信息
 * @param {Number} personnelId 人员画像id
 * @param {String} companyName 单位名称
 * @param {String} dept 部门
 * @param {String} station 岗位
 * @param {String} startDate 开始时间（1995-01-01）
 * @param {String} endDate 结束时间（1995-01-01）
 */
const createWorkExperienceInfo = ({
  personnelId,
  companyName,
  dept,
  station,
  startDate,
  endDate,
} = {}) => Fetch.post('/bus/personnelExperience/saveOrUpdate', {
  personnelId,
  companyName,
  dept,
  station,
  startDate,
  endDate,
});
/**
 * 更新人员画像工作经历信息
 * @param {Number} id 工作经历id
 * @param {Number} personnelId 人员画像id
 * @param {String} companyName 单位名称
 * @param {String} dept 部门
 * @param {String} station 岗位
 * @param {String} startDate 开始时间（1995-01-01）
 * @param {String} endDate 结束时间（1995-01-01）
 */
const updateWorkExperienceInfo = ({
  id,
  personnelId,
  companyName,
  dept,
  station,
  startDate,
  endDate,
} = {}) => Fetch.post('/bus/personnelExperience/saveOrUpdate', {
  id,
  personnelId,
  companyName,
  dept,
  station,
  startDate,
  endDate,
});
/**
 * 删除人员画像工作经历信息
 * @param {Number} id 工作经历id
 * @returns
 */
const deleteWorkExperienceInfo = (id) => Fetch.post('/bus/personnelExperience/deleteById', {
  id,
});
/**
 * 工作经历信息列表
 * @param {Number} personnelId 人员画像id
 * @returns
 */
const workExperienceInfoList = (personnelId) => Fetch.post('/bus/personnelExperience/getExperienceList', {
  personnelId,
});

// #endregion 人员画像-工作经历相关

// #region 人员画像-成长计划相关
/**
 * 新增人员画像成长计划信息
 * @param {Number} personnelId 人员画像id
 * @param {Number} planDate 时间
 * @param {Number} content 计划内容
 */
const createGrowthPlanInfo = ({
  personnelId,
  planDate,
  content,
} = {}) => Fetch.post('/bus/busPersonnelPlan/saveOrUpdate', {
  personnelId,
  planDate,
  content,
});
/**
 * 更新人员画像成长计划信息
 * @param {Number} id 成长计划id
 * @param {Number} personnelId 人员画像id
 * @param {Number} planDate 时间
 * @param {Number} content 计划内容
 */
const updateGrowthPlanInfo = ({
  id,
  personnelId,
  planDate,
  content,
} = {}) => Fetch.post('/bus/busPersonnelPlan/saveOrUpdate', {
  id,
  personnelId,
  planDate,
  content,
});
/**
 * 删除人员画像成长计划信息
 * @param {Number} id 成长计划id
 */
const deleteGrowthPlanInfo = (id) => Fetch.post('/bus/busPersonnelPlan/deleteById', {
  id,
});
/**
 * 成长计划信息列表
 * @param {Number} personnelId 人员画像id
 */
const growthPlanInfoList = (personnelId) => Fetch.post('/bus/busPersonnelPlan/getPlanList', {
  personnelId,
});
// #endregion 人员画像-成长计划相关

// #region 人员画像-科研课题情况相关
/**
 * 新增人员画像科研课题情况信息
 * @param {Number} personnelId 人员画像id
 * @param {String} title 课题名称
 * @param {String} deptName 主导部门
 * @param {String} principal 负责人
 * @param {String} participant 参与人
 * @param {String} topicLevel 课题级别 字典topic_level
 * @param {String} startDate 开始时间（1995-01-01）
 * @param {String} endDate 结束时间（1995-01-01）
 * @param {String} successState 是否成功(0失败1成功)
 */
const createResearchProjectInfo = ({
  personnelId,
  title,
  deptName,
  principal,
  participant,
  topicLevel,
  startDate,
  endDate,
  successState,
} = {}) => Fetch.post('/bus/busPersonnelTopic/saveOrUpdate', {
  personnelId,
  title,
  deptName,
  principal,
  participant,
  topicLevel,
  startDate,
  endDate,
  successState,
});
/**
 * 更新人员画像科研课题情况信息
 * @param {Number} id 科研课题id
 * @param {Number} personnelId 人员画像id
 * @param {String} title 课题名称
 * @param {String} deptName 主导部门
 * @param {String} principal 负责人
 * @param {String} participant 参与人
 * @param {String} topicLevel 课题级别 字典topic_level
 * @param {String} startDate 开始时间（1995-01-01）
 * @param {String} endDate 结束时间（1995-01-01）
 * @param {String} successState 是否成功(0失败1成功)
 */
const updateResearchProjectInfo = ({
  id,
  personnelId,
  title,
  deptName,
  principal,
  participant,
  topicLevel,
  startDate,
  endDate,
  successState,
} = {}) => Fetch.post('/bus/busPersonnelTopic/saveOrUpdate', {
  id,
  personnelId,
  title,
  deptName,
  principal,
  participant,
  topicLevel,
  startDate,
  endDate,
  successState,
});
/**
 * 删除人员画像科研课题情况信息
 * @param {Number} id 科研课题id
 */
const deleteResearchProjectInfo = (id) => Fetch.post('/bus/busPersonnelTopic/deleteById', {
  id,
});
/**
 * 科研课题信息列表
 * @param {Number} personnelId 人员画像id
 */
const researchProjectInfoList = (personnelId) => Fetch.post('/bus/busPersonnelTopic/getTopicList', {
  personnelId,
});
// #endregion 人员画像-科研课题情况相关

// #region 人员画像-论文发表情况相关
/**
 * 新增人员画像论文发表情况信息
 * @param {Number} personnelId 人员画像id
 * @param {String} publishDate 发表时间
 * @param {String} title 论文名称
 * @param {String} platform 发表平台
 * @param {String} deptName 主导部门
 * @param {String} principal 负责人
 * @param {String} participant 参与人
 */
const createPaperInfo = ({
  personnelId,
  publishDate,
  title,
  platform,
  deptName,
  principal,
  participant,
} = {}) => Fetch.post('/bus/personnelTreatise/saveOrUpdate', {
  personnelId,
  publishDate,
  title,
  platform,
  deptName,
  principal,
  participant,
});
/**
 * 更新人员画像论文发表情况信息
 * @param {Number} id 论文id
 * @param {Number} personnelId 人员画像id
 * @param {String} publishDate 发表时间
 * @param {String} title 论文名称
 * @param {String} platform 发表平台
 * @param {String} deptName 主导部门
 * @param {String} principal 负责人
 * @param {String} participant 参与人
 */
const updatePaperInfo = ({
  id,
  personnelId,
  publishDate,
  title,
  platform,
  deptName,
  principal,
  participant,
} = {}) => Fetch.post('/bus/personnelTreatise/saveOrUpdate', {
  id,
  personnelId,
  publishDate,
  title,
  platform,
  deptName,
  principal,
  participant,
});
/**
 * 删除人员画像论文发表情况信息
 * @param {Number} id 论文id
 */
const deletePaperInfo = (id) => Fetch.post('/bus/personnelTreatise/deleteById', {
  id,
});
/**
 * 论文信息列表
 * @param {Number} personnelId 人员画像id
 */
const paperInfoList = (personnelId) => Fetch.post('/bus/personnelTreatise/getTreatiseList', {
  personnelId,
});
// #endregion 人员画像-论文发表情况相关

export default {
  list,
  preview,
  engineerDetail,
  createBaseInfo,
  updateBaseInfo,
  deleteBaseInfo,
  baseInfoDetail,
  createQualificationInfo,
  updateQualificationInfo,
  deleteQualificationInfo,
  qualificationInfoList,
  createSkillInfo,
  updateSkillInfo,
  deleteSkillInfo,
  skillInfoList,
  createWorkExperienceInfo,
  updateWorkExperienceInfo,
  deleteWorkExperienceInfo,
  workExperienceInfoList,
  createGrowthPlanInfo,
  updateGrowthPlanInfo,
  deleteGrowthPlanInfo,
  growthPlanInfoList,
  createResearchProjectInfo,
  updateResearchProjectInfo,
  deleteResearchProjectInfo,
  researchProjectInfoList,
  createPaperInfo,
  updatePaperInfo,
  deletePaperInfo,
  paperInfoList,
};
