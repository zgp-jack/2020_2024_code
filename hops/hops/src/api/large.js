import request from "./request"

// 
const metric = (data) => {
    return request({
        url: '/api/bigScreen/metric',
        method: 'post',
        data
    })
}
const monitor = (data) => {
    return request({
        url: '/api/bigScreen/monitor',
        method: 'post',
        data
    })
}
const cpu = (data) => {
    return request({
        url: '/api/bigScreen/cpu',
        method: 'post',
        data
    })
}
const mem = (data) => {
    return request({
        url: '/api/bigScreen/mem',
        method: 'post',
        data
    })
}
const tem = (data) => {
    return request({
        url: '/api/bigScreen/tem',
        method: 'post',
        data
    })
}
const cpuTrend = (data) => {
    return request({
        url: '/api/bigScreen/history/cpu',
        method: 'post',
        data
    })
}
const memTrend = (data) => {
    return request({
        url: '/api/bigScreen/history/mem',
        method: 'post',
        data
    })
}
const temTrend = (data) => {
    return request({
        url: '/api/bigScreen/history/tem',
        method: 'post',
        data
    })
}
const screenUp = (data) => {
    return request({
        url: '/api/bigScreen/screenUp',
        method: 'post',
        data
    })
}
const alarmRank = (data) => {
    return request({
        url: '/api/bigScreen/alarmRank',
        method: 'post',
        data
    })
}
const topPlan = (data) => {
    return request({
        url: '/api/top/plan/page',
        method: 'post',
        data
    })
}
const planSave = (data) => {
    return request({
        url: '/api/top/plan/save',
        method: 'post',
        data
    })
}

export default {
    metric,
    monitor,
    cpu,
    mem,
    tem,
    cpuTrend,
    memTrend,
    temTrend,
    screenUp,
    alarmRank,
    topPlan,
    planSave
}