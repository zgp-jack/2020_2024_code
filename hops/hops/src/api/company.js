import request from "./request"

// 列表
const companyTree = (data) => {
    return request({
        url: '/api/postCompany/companyTree',
        method: 'post',
        data
    })
}
const save = (data) => {
    return request({
        url: '/api/system/user/save',
        method: 'post',
        data
    })
}

export default {
    companyTree,
    save
}