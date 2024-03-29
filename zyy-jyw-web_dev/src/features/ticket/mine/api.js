import Request from '@/common/utils/request';

const list = ({
  keyword,
  createInfoStartDate,
  createInfoEndDate,
  createFaultStartDate,
  createFaultEndDate,
  createUserList, // 建单人
  hospitalList,
  createTime,
  createUser,
  currState,
  degree,
  deptId,
  faultRemark,
  makeUser,
  orderNum,
  phone,
  rangeType,
  reception,
  source,
  pageNum,
  pageSize,
} = {}) => Request.post(`/obstacles/mine/order/page?pageNum=${pageNum}&pageSize=${pageSize}`, {
  keyword,
  createInfoStartDate,
  createInfoEndDate,
  createFaultStartDate,
  createFaultEndDate,
  createUserList,
  hospitalList,
  createTime,
  createUser,
  currState,
  degree,
  deptId,
  faultRemark,
  makeUser,
  orderNum,
  phone,
  rangeType,
  reception,
  source,
});
const count = () => Request.get('/obstacles/mine/order/count');
export default {
  list,
  count,
};
