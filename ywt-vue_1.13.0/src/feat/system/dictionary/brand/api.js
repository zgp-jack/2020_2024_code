/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-28 16:38:22
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-28 16:52:32
 * @Description:厂家品牌API
 */
import Fetch from '@/utils/fetch';

/**
 * 创建厂家品牌
 * name 名称（长度限制50）
 * abbreviation 简称（长度限制20）
 * manufacturerType 类型（数据字典：manufacturerType）
 * contact 主要联系人（长度限制20）
 * phone 联系电话（长度限制20）
 * remark 备注（长度限制50）
 * otherContacts 其它联系人JSON {"contact", "联系人", "phone":"电话"}
 */
const create = ({
  name,
  abbreviation,
  manufacturerType,
  contact,
  phone,
  remark,
  otherContacts,
} = {}) => Fetch.post('/sys/dic/manufacturer/create', {
  name,
  abbreviation,
  manufacturerType,
  contact,
  phone,
  remark,
  otherContacts,
});
/**
 * 更新厂家品牌
 * id 厂家品牌ID
 * name 名称（长度限制50）
 * abbreviation 简称（长度限制20）
 * manufacturerType 类型（数据字典：manufacturerType）
 * contact 主要联系人（长度限制20）
 * phone 联系电话（长度限制20）
 * remark 备注（长度限制50）
 * otherContacts 其它联系人JSON {"contact", "联系人", "phone":"电话"}
 */
const update = ({
  id,
  name,
  abbreviation,
  manufacturerType,
  contact,
  phone,
  remark,
  otherContacts,
} = {}) => Fetch.post('/sys/dic/manufacturer/update', {
  id,
  name,
  abbreviation,
  manufacturerType,
  contact,
  phone,
  remark,
  otherContacts,
});
/**
 * 删除厂家品牌
 */
const deleteBrand = (id) => Fetch.post('/sys/dic/manufacturer/delete', {
  id,
});
/**
 * 厂家品牌详情
 */
const detail = (id) => Fetch.post('/sys/dic/manufacturer/get', {
  id,
});
/**
 * 厂家品牌列表
 */
const list = ({
  query,
  pageNum,
  pageSize,
} = {}) => Fetch.post('/sys/dic/manufacturer/page', {
  query,
  pageNum,
  pageSize,
});
export default {
  create,
  update,
  delete: deleteBrand,
  detail,
  list,
};
