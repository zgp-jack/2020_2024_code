import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/store'

const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
VueRouter.prototype.replace = function (location) {
    return originalReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach(async (to, from, next) => {
    let token = store.state.token
    next()
    // if (to.name == 'login' || token) {
    //     next()
    // } else {
    //     next({ path: '/login' })
    // }
})

export default router
