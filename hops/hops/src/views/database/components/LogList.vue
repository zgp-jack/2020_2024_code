<template>
    <div class="main-box">
        <h5 class="card-title">日志</h5>
        <div class="log-list-item" v-for="item in logList">
            <div class="log-list-title">
                <span style="margin-right: 16px;">{{ item.nameSpace }}</span>
                <span>{{ item.dateTime }}</span>
            </div>
            <p class="log-list-msg">{{ item.value }}</p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'logLost',
    props: {
        logList: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {
        }
    }
}
</script>
<style lang="scss" scoped>
.main-box{
    margin-top: 48px;
    height: calc(100% - 50px);
}
.log-list-item:not(:first-of-type) {
    border-top: 1px solid #ccc;
}
.log-list-item{
    padding: 16px 0;
    .log-list-title{
        color: #282827;
        display: flex;
        span{
            display: inline-block;
        }
    }
    .log-list-msg{
        color: #757E7E;
        margin-top: 8px;
    }
}
</style>