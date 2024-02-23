import request from "./request"

// 列表
const list = (data) => {
    return request({
        url: '/api/dbConfig/list',
        method: 'post',
        data
    })
}
const info = (data) => {
    return request({
        url: '/api/dbConfig/info',
        method: 'post',
        data
    })
}
const trendData = (data) => {
    return request({
        url: '/api/dbConfig/trendData',
        method: 'post',
        data
    })
}
const page = (data) => {
    return request({
        url: '/api/dbConfig/page',
        method: 'post',
        data
    })
}
const save = (data) => {
    return request({
        url: '/api/dbConfig/save',
        method: 'post',
        data
    })
}
const update = (data) => {
    return request({
        url: '/api/dbConfig/update',
        method: 'post',
        data
    })
}
const del = (data) => {
    return request({
        url: '/api/dbConfig/del',
        method: 'delete',
        data
    })
}
const cacheInfo = (data) => {
    return request({
        url: '/api/dbConfig/cache/info',
        method: 'post',
        data
    })
}

const downExportTemp = (data) => {
    return request({
        url: '/api/dbConfig/downExportTemp',
        method: 'post',
        data
    })
}
const exportData = (data) => {
    return request({
        url: '/api/dbConfig/exportData',
        method: 'post',
        data
    })
}

export default {
    list,
    info,
    trendData,
    page,
    save,
    update,
    del,
    cacheInfo,
    downExportTemp,
    exportData
}