import request from '@/common/utils/request';
// 新增电话簿
const submitPhone = (params) => request.post('/system/phoneBook/sysBatchAdd', params);
// 新增IP
const submitIpAddress = (params) => request.post('/system/ipAddress/sysBatchAdd', params);
// 电话簿列表
const getPhoneBook = ({
  pageNum,
  pageSize,
  deptId,
  phone,
}) => request.get(`/system/phoneBook/list?pageNum=${pageNum}&pageSize=${pageSize}`, {
  params: {
    deptId,
    phone,
  },
});
// IP列表
const getIpAddress = ({
  pageNum,
  pageSize,
  deptId,
  ipAddress,
}) => request.get(`/system/ipAddress/list?pageNum=${pageNum}&pageSize=${pageSize}`, {
  params: {
    deptId,
    ipAddress,
  },
});
// 获取电话簿详情
const getPhoneDetail = (id) => request.get(`/system/phoneBook/${id}`);
// 获取IP详情
const getIpDetail = (id) => request.get(`/system/ipAddress/${id}`);
// 删除电话簿
const delPhoneBook = (ids) => request.delete(`/system/phoneBook/${ids}`);
// 删除Ip
const delIpAddress = (ids) => request.delete(`/system/ipAddress/${ids}`);
// 修改电话簿
const updatePhoneBook = (params) => request.put('/system/phoneBook/sysEdit', params);
// 修改IP
const updateIpAddress = (params) => request.put('/system/ipAddress/sysEdit', params);
// /system/phoneBook/sysSave
const getSysSave = (data) => request.post('/system/phoneBook/sysSave', data);

export default {
  submitPhone,
  getPhoneBook,
  getIpAddress,
  delPhoneBook,
  delIpAddress,
  submitIpAddress,
  getPhoneDetail,
  getIpDetail,
  updatePhoneBook,
  updateIpAddress,
  getSysSave,
};
