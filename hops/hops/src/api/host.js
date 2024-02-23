import request from "./request"

// 列表
const list = (data) => {
    return request({
        url: '/api/host/list',
        method: 'post',
        data
    })
}
const info = (data) => {
    return request({
        url: '/api/host/info',
        method: 'get',
        params: data
    })
}
const cpu = (data) => {
    return request({
        url: '/api/host/cpu',
        method: 'post',
        data
    })
}
const mem = (data) => {
    return request({
        url: '/api/host/mem',
        method: 'post',
        data
    })
}
const disk = (data) => {
    return request({
        url: '/api/host/disk',
        method: 'post',
        data
    })
}
const network = (data) => {
    return request({
        url: '/api/host/network',
        method: 'post',
        data
    })
}
const page = (data) => {
    return request({
        url: '/api/host/page',
        method: 'post',
        data
    })
}
const save = (data) => {
    return request({
        url: '/api/host/save',
        method: 'post',
        data
    })
}
const update = (data) => {
    return request({
        url: '/api/host/update',
        method: 'post',
        data
    })
}
const del = (data) => {
    return request({
        url: '/api/host/del',
        method: 'delete',
        data
    })
}
const downExportTemp = (data) => {
    return request({
        url: '/api/host/downExportTemp',
        method: 'post',
        data
    })
}
const exportData = (data) => {
    return request({
        url: '/api/host/exportData',
        method: 'post',
        data
    })
}
export default {
    list,
    info,
    cpu,
    mem,
    disk,
    network,
    page,
    save,
    update,
    del,
    downExportTemp,
    exportData
}