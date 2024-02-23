import request from "./request"

// 列表
const listPage = (data) => {
    return request({
        url: '/api/system/user/listPage',
        method: 'post',
        data
    })
}
const save = (data) => {
    return request({
        url: '/api/system/user/save',
        method: 'post',
        data
    })
}
const del = (data) => {
    return request({
        url: '/api/system/user/delete',
        method: 'delete',
        data
    })
}
const resetPwd = (data) => {
    return request({
        url: '/api/system/user/reset-password',
        method: 'put',
        data
    })
}
const loginOut = (data) => {
    return request({
        url: '/api/system/user/logout',
        method: 'get',
        data
    })
}


export default {
    listPage,
    save,
    del,
    resetPwd,
    loginOut
}