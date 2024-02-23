import request from "./request"

// 列表
const save = (data) => {
    return request({
        url: '/api/monitor/no/process/save',
        method: 'post',
        data
    })
}
const update = (data) => {
    return request({
        url: '/api/monitor/no/process/update',
        method: 'post',
        data
    })
}
const del = (data) => {
    return request({
        url: `/api/monitor/no/process/${data.id}`,
        method: 'delete',
        data
    })
}
const view = (data) => {
    return request({
        url: `/api/monitor/no/process/${data.monitorTypeId}/${data.monitorId}/${data.metricId}`,
        method: 'get',
    })
}

export default {
    save,
    update,
    del,
    view
}