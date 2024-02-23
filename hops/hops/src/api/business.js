import request from "./request"

// 列表
const page = (data) => {
    return request({
        url: '/api/service/page',
        method: 'post',
        data
    })
}
const save = (data) => {
    return request({
        url: '/api/service/save',
        method: 'post',
        data
    })
}
const update = (data) => {
    return request({
        url: '/api/service/update',
        method: 'post',
        data
    })
}
const del = (data) => {
    return request({
        url: '/api/service/del',
        method: 'delete',
        data
    })
}

export default {
    page,
    save,
    update,
    del
}