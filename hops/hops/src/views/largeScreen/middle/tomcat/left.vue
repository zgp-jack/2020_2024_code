<template>
    <div class="business-left">
        <p class="large-label">基本情况</p>
        <div class="flex-1 large-card">
            <p class="large-sub-label">IO</p>
            <LineMultipleChart :left="75" :unit="unit" domId="lineIO" v-if="tomcatData.ioList.length" :seriesData="tomcatData.ioList" height="calc(100% - 24px)"> </LineMultipleChart>
        </div>
        <div class="flex-1 large-card">
            <p class="large-sub-label">请求</p>
            <LineMultipleChart unit="个" domId="lineSurvivor" v-if="tomcatData.questList.length" :seriesData="tomcatData.questList" height="calc(100% - 24px)"> </LineMultipleChart>
        </div>
        <div class="flex-1 large-card">
            <p class="large-sub-label">Session</p>
            <LineMultipleChart unit="个" domId="lineSession" v-if="tomcatData.sessionList.length" :seriesData="tomcatData.sessionList" height="calc(100% - 24px)"> </LineMultipleChart>
        </div>
    </div>
</template>
<script>
import { getMiddleList, listMiddle } from '@/api';
import { getMaxUnitByFlow, getValueByUnit } from '@/utils/util'
export default {
    name: 'middleTomcatLeft',
    props: {
        searchId: {
            type: Number
        }
    },
    components: {
        LineMultipleChart: () => import('../../components/lineMultiple.vue'),
    },
    data() {
        const endTime = parseInt(new Date().getTime())
		const h = new Date().getHours() * 3600000
		const m = new Date().getMinutes() * 60000
		const s = new Date().getSeconds() * 1000
		const startTime = endTime - 86400000;
        return {
            searchData: {
				startTime: startTime,
				endTime: endTime,
				name: '',
			},
            tomcatData: {
				countList: [],
				ioList: [],
				questList: [],
				sessionList: [],
				threadList: [],
			},
            unit: [],
            timer: null
        }
    },
    mounted() {
        const cycle = this.$store.state.config.bigScreenCycle || 60000;
        this.getList({monitorId: this.searchId,...this.searchData});
        this.timer = setInterval(() => {
            this.setTime();
            this.getList({monitorId: this.searchId,...this.searchData});
        }, cycle)
    },
    beforeDestroy(){
        clearInterval(this.timer);
    },
    methods: {
        setTime() {
            const endTime = parseInt(new Date().getTime());
		    const startTime = endTime - 86400000;
            this.searchData.startTime = startTime;
            this.searchData.endTime = endTime;
        },
        getList(params) {
            let countList = []
            let sendList = []
            let receivedList = []
            let errorList = []
            let requestList = []
            let totalList = []
            let historyList = []
            let currentList = []
            let activeThread = []
            let busyThread = []
            let maxThread = []
            listMiddle('tomcat', params).then((res) => {
                if (res.status == 1) {
                    this.tomcatPort = res.data.length && res.data[0].tomcatPort
                    let max = 0;
                    let unit = 'bps';
                    res.data.forEach(item => {
                        max = (item.bytesSent > max) ? item.bytesSent : max;
                        max = (item.bytesReceived > max) ? item.bytesReceived : max;
                    })
                    unit = getMaxUnitByFlow(max).unit;
                    this.unit = unit;
                    res.data.forEach((item) => {
                        
                        countList.push([item.time * 1000, item.tomcatConnectionCount])
                        sendList.push([item.time * 1000, getValueByUnit(item.bytesSent * 8, unit)])
                        receivedList.push([item.time * 1000, getValueByUnit(item.bytesReceived * 8, unit)])
                        errorList.push([item.time * 1000, item.errorCount])
                        requestList.push([item.time * 1000, item.requestCount])
                        historyList.push([item.time * 1000, item.sesseionMaxActive])
                        totalList.push([item.time * 1000, item.sessionCounter])
                        currentList.push([item.time * 1000, item.activeSessions])
                        activeThread.push([item.time * 1000, item.tomcatCurrentThreadsBusy])
                        busyThread.push([item.time * 1000, item.tomcatCurrentThreadCount])
                        maxThread.push([item.time * 1000, item.tomcatMaxThreads])
                    })
                    this.tomcatData.countList = countList
                    this.tomcatData.ioList = [{name: '发送数据', data: sendList}, {name: '接受数据', data: receivedList}]
                    this.tomcatData.questList = [{name: '请求数', data: requestList}, {name: '错误数', data: errorList}]
                    this.tomcatData.sessionList = [{name: '总数', data: totalList}, {name: '历史数', data: historyList}, {name: '当前数', data: currentList}]
                    this.tomcatData.threadList = [{name: '当前活跃', data: busyThread}, {name: '当前繁忙', data: activeThread}, {name: '最大线程', data: maxThread}]
                    this.$emit('setList', this.tomcatData.countList);
                    this.$emit('setThreadList', this.tomcatData.threadList);
                }
            })
            getMiddleList({page: 1, pageSize: 9999, ...params}).then((res) => {
				if (res.status == 1 && res.data.records.length) {
					res.data.records.forEach((item) => {
						this.$store.state.ruleType.forEach((it) => {
							if (it.id == item.type) {
								item.typeName = it.typeName
							}
						})
					})
					const row = res.data.records.filter((item) => item.id === this.searchId)[0];
                    this.$emit('setTopInfo', {name: row.name, tip: row.typeName, ip: row.host});
				}
			})
        }
    },
    watch: {
        searchId: function(val) {
            this.getList({monitorId: val, ...this.searchData});
        } 
    }
}
</script>
<style lang="scss" scoped>
.business-left{
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>