import request from "./request"

// 列表
const list = (data) => {
    return request({
        url: '/api/system/role/list',
        method: 'post',
        data
    })
}
// 列表
const listPage = (data) => {
    return request({
        url: '/api/system/role/listPage',
        method: 'post',
        data
    })
}
const save = (data) => {
    return request({
        url: '/api/system/role/save',
        method: 'post',
        data
    })
}
const del = (data) => {
    return request({
        url: '/api/system/role/delete',
        method: 'delete',
        data
    })
}

export default {
    list,
    listPage,
    save,
    del
}