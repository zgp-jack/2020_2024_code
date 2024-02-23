import request from "./request"

// 列表
const data = (data) => {
    return request({
        url: '/api/home/data',
        method: 'post',
        data
    })
}
const page = (data) => {
    return request({
        url: '/api/service/page',
        method: 'post',
        data
    })
}


export default {
    data,
    page
}