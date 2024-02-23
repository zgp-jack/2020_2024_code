
import request from "./request"

// 列表
const list = (data) => {
    return request({
        url: '/api/system/permission/list',
        method: 'post',
        data
    })
}
// 列表
const listPage = (data) => {
    return request({
        url: '/api/system/permission/listPage',
        method: 'post',
        data
    })
}
const save = (data) => {
    return request({
        url: '/api/system/permission/save',
        method: 'post',
        data
    })
}
const del = (data) => {
    return request({
        url: '/api/system/permission/delete',
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