import request from "./request"

// 列表
const page = (data) => {
    return request({
        url: '/api/alarm/listPage',
        method: 'post',
        data
    })
}
const startTime = (data) => {
    return request({
        url: '/api/alarm/page/startTime',
        method: 'post',
        data
    })
}
const time = (data) => {
    return request({
        url: '/api/alarm/time',
        method: 'post',
        data
    })
}
const type = (data) => {
    return request({
        url: '/api/alarm/type',
        method: 'post',
        data
    })
}
const level = (data) => {
    return request({
        url: '/api/alarm/level',
        method: 'post',
        data
    })
}

export default {
    page,
    startTime,
    time,
    type,
    level
}