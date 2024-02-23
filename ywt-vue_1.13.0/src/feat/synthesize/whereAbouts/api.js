import Fetch from '@/utils/fetch';

/**
 * 获取用户人员去向分页列表
 */
const getwhereAboutsList = ({
  // / 科室编号
  deptNo,
  // / 排序方向
  direction,
  // / 排序列
  orderBy,
  orderByAndDirection,
  // / 当前页
  pageNum,
  // / 每页多少条
  pageSize,
  // / 关键词
  query,
  // / 去向Id(多选,逗号拼接)
  whereaboutsIds,
} = {}) => Fetch.post('/v1/post/user/whereabouts/getPage', {
  deptNo,
  direction,
  orderBy,
  orderByAndDirection,
  pageNum,
  pageSize,
  query,
  whereaboutsIds,
});

/**
 * 人员去向删除
 */
const deleteWhereAbouts = (id) => Fetch.post('/v1/delete/whereabouts', { id, });
/**
 * 人员去向列表
 */
const getWhereAboutsList = () => Fetch.post('/v1/get/whereabouts/list', {});
/**
 * 人员去向选项下拉数据
 */
const whereAboutsOptions = () => Fetch.post('/v1/get/whereabouts/option', {});
/**
 * 查询用户去向
 */
const getUserWhereAbouts = (id) => Fetch.post('/v1/get/whereabouts/relation/list', { id, });
/**
 * 人员去向保存
 */
const savewhereAbouts = ({
  // / 颜色编码
  colorCode,
  // / 主键(修改传递)
  id,
  // / 去向名称
  name,
  // / 去向状态 1启用 0禁用
  state,
} = {}) => Fetch.post('/v1/post/whereabouts', {
  colorCode,
  id,
  name,
  state,
});
/**
 * 给用户添加去向
 */
const addUserWhereAbouts = ({ // / 结束时间
  endTime,
  // / 开始时间
  startTime,
  // / 用户ID
  userId,
  // / 去向ID
  whereaboutsId,

} = {}) => Fetch.post('/v1/post/whereabouts/relation', { endTime, startTime, userId, whereaboutsId, });

/**
 * 某个用户的去向删除
 */
const deleteUserWhereAbouts = (id) => Fetch.post('/v1/delete/whereabouts/relation', { id, });

export default {
  getwhereAboutsList,
  deleteWhereAbouts,
  getWhereAboutsList,
  whereAboutsOptions,
  getUserWhereAbouts,
  savewhereAbouts,
  addUserWhereAbouts,
  deleteUserWhereAbouts,
};
