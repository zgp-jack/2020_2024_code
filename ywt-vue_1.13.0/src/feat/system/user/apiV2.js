
/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2023-04-13 16:00:45
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-04-13 16:31:04
 * @Description:用户管理API V2
 */
import Fetch from '@/utils/fetch';

/**
 * 获取所有用户列表
 */
const list = () => Fetch.post('/v2/get/system/users', {});
export default {
  list,
};
