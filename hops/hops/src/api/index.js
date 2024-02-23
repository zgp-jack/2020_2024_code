import request from "./request"

// 登录
export const reqLogin = (data) => {
    return request({
        url: '/api/system/user/login',
        method: 'post',
        data
    })
}

// 监控设置-规则管理
// 规则列表
export const getRuleType = (id) => {
    return request({
        url: `/api/monitor/rule/get/type`,
        method: 'get',
    })
}

// 规则管理信息
export const getRuleTable = (data) => {
    return request({
        url: `/api/monitor/rule/listPage`,
        method: 'post',
        data
    })
}
// 删除规则信息
export const delRuleTable = (data) => {
    return request({
        url: '/api/monitor/rule/delete',
        method: 'delete',
        data
    })
}
// 新增规则信息
export const saveRuleTable = (data) => {
    return request({
        url: '/api/monitor/rule/save',
        method: 'post',
        data
    })
}
// 修改规则信息
export const updateRuleTable = (data) => {
    return request({
        url: '/api/monitor/rule/update',
        method: 'post',
        data
    })
}
// 获得指标信息
export const getRuleMetrics = (id) => {
    return request({
        url: `/api/monitor/rule/get/metric/${id}`,
        method: 'get'
    })
}

// 监控设置-中间件管理
// 中间件管理列表
export const getMiddleList = (data) => {
    return request({
        url: '/api/jmx/page',
        method: 'post',
        data
    })
}
// 中间件新增
export const saveMiddle = (data) => {
    return request({
        url: '/api/jmx/save',
        method: 'post',
        data
    })
}
// 删除
export const delMiddle = (data) => {
    return request({
        url: '/api/jmx/delete',
        method: 'delete',
        data
    })
}
// 编辑
export const updateMiddle = (data) => {
    return request({
        url: '/api/jmx/update',
        method: 'post',
        data
    })
}

// 中间件
// List
export const listMiddle = (url, data) => {
    return request({
        url: `/api/jmx/data/${url}`,
        method: 'post',
        data
    })
}

export const downExportTempMiddle = (data) => {
    return request({
        url: '/api/jmx/downExportTemp',
        method: 'post',
        data
    })
}
export const exportMiddle = (data) => {
    return request({
        url: '/api/jmx/exportData',
        method: 'post',
        data
    })
}

// 监控设置-网络管理
// network
export const ApiNetwork = (url, data) => {
    return request({
        url: `/api/network/device/${url}`,
        method: 'post',
        data
    })
}
// delNetwork
export const delNetwork = (data) => {
    return request({
        url: '/api/network/device/delete',
        method: 'delete',
        data
    })
}
// 网络设备
export const ApiNetworkList = (url, data, method) => {
    return request({
        url: `/api${url}`,
        method: method || 'post',
        data: method == 'get' ? undefined : data
    })
}

// 业务
// 查询List
export const ApiBusinessList = (data) => {
    return request({
        url: '/api/service/page',
        method: 'post',
        data
    })
}
export const ApiBuinessTrend = (data) => {
    return request({
        url: '/api/service/trendData',
        method: 'post',
        data
    })
}
export const ApiMenuTree = (data) => {
    return request({
        url: '/api/resource/menu/tree',
        method: 'get',
        params: data
    })
}
export const ApiMenuTreeAndAction = (data) => {
    return request({
        url: '/api/resource/menu/treeAndAction',
        method: 'post',
        data
    })
}
export const ApiOrderUser = (data) => {
    return request({
        url: '/api/order/users',
        method: 'post',
        data
    })
}
export const ApiWXUser = (data) => {
    return request({
        url: '/api/wx/users',
        method: 'post',
        data
    })
}
