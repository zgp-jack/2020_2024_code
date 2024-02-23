<template>
    <div class="pending-panel">
        <div class="pending-title">
            <van-loading type="spinner" style="display: inline-block; margin-right: 20px;"/>
            <p style="margin-top: 20px;">{{ title }}</p>
        </div>
        <van-row class="video-btn-box">
            <van-col span="24">
                <van-button type="danger" round class="call-btn" @click="handlePendingLeave(true)">
                    <i class="iconfont icon-guaduan"></i>
                </van-button>
                <p>取消</p>
            </van-col>
        </van-row>
    </div>
</template>
<script>
    import Bus from './Bus';
    export default {
        props: {
        },
        data() {
            return {
                title: '等待对方接受邀请...',
                audioShow: false,
                timeUp: 0,
                timer: null
            }
        },
        mounted() {
            Bus.$on('rejection', () => {
                this.title = '对方已拒接';
                setTimeout(() => {
                    this.handlePendingLeave();
                }, 1000);
                
            })
            if(!!this.timer) {
                clearInterval(this.timer);
            }
            this.timer = setInterval(() => {
                this.timeUp++;
                if(this.timeUp == 15) {
                    this.title = '暂时无法接通,请稍后尝试';
                }
                if(this.timeUp >= 18) {
                    this.handlePendingLeave();
                    this.timeUp = 0;
                    clearInterval(this.timer);
                }
            }, 1000)
        },
        methods: {
            handlePendingLeave() {
                Bus.$emit('pendingLeave');
                clearInterval(this.timer);
            }
        }
    }
</script>
<style>
.pending-panel{
    background: linear-gradient(#000 1%, #222 10%,#000 30%,#000 80%, #222 95%, #000 100%);
    color: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    top: 0;
    z-index: 99999;
}
.pending-title{
    margin-top: 60%;
    font-size: 16px;
    color: #e3e3e3;
}
</style>