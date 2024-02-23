import request from "./request"

// 列表
const page = (data) => {
    return request({
        url: '/api/wx/assoc/page',
        method: 'post',
        data
    })
}
const save = (data) => {
    return request({
        url: '/api/wx/assoc/save',
        method: 'post',
        data
    })
}
const update = (data) => {
    return request({
        url: '/api/wx/assoc/update',
        method: 'post',
        data
    })
}
const del = (data) => {
    return request({
        url: '/api/wx/assoc/del',
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