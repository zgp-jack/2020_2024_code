<template>
    <div class="business-left">
        <p class="large-label">设备情况</p>
        <div class="flex-1 large-card">
            <p class="large-sub-label">CPU/内存利用率</p>
            <LiquidChart height="calc(50% - 34px)" v-if="cpuValue != null && memValue != null" :value1="cpuValue" :value2="memValue"></LiquidChart>
            <LineChart domId="lineCpuMem" height="calc(50% - 23px)" :seriesData1="trendData.cpuTrendData" :seriesData2="trendData.memTrendData">
                <template v-slot:title>
                    <div class="line-title">
                        <div class="line-title-legend">
                            <div class="line-title-legend-item" style="margin-right:16px"><div style="background-color: #006666"></div>CPU使用情况</div>
                            <div class="line-title-legend-item"><div style="background-color: #ffbc00"></div>CPU温度</div>
                        </div>
                    </div>
                </template>
            </LineChart>
        </div>
        <div class="large-card" style="height: 228px;">
            <p class="large-sub-label">设备温度</p>
            <DashboardView :legendList="dashLegend" :percentageValue="percentageValue"></DashboardView>
        </div>
    </div>
</template>
<script>
import { ApiNetworkList } from '@/api'
export default {
    name: 'netLeft',
    props: {
        searchId: {
            type: Number
        }
    },
    components: {
        LiquidChart: () => import('../components/liquid.vue'),
        LineMultipleChart: () => import('../components/lineMultiple.vue'),
        LineChart: () => import('../components/line.vue'),
        DashboardView: () => import('../components/dashboard.vue'),
    },
    data() {
        const endTime = new Date().getTime();
        const startTime = endTime - 86400000;
        return {
            tab1Active: '1',
            dashLegend: [
                {label: '正常风扇', value: '0', icon: 'iconfont icon-fengshan', color: 'linear-gradient(180deg, #1EC969 0%, #D2F4E1 100%)', background: 'rgba(30, 201, 105, 0.1)', fontColor: '#7ECA9F'},
                {label: '异常风扇', value: '0', icon: 'iconfont icon-fengshan', color: 'linear-gradient(180deg, #FF836B 0%, #FFE6E1 100%)', background: 'rgba(255, 131, 107, 0.1)', fontColor: '#F0A496'}
            ],
            cpuTrendData: [],
			memTrendData: [],
			tempTrendData: [],
            trendData: {
                cpuTrendData: [],
                memTrendData: [],
            },
            cpuValue: null,
            memValue: null,
            tempValue: null,
            searchData: {
                startTime: startTime,
                endTime: endTime
            },
            timer: null,
            percentageValue: {
                value: 0,
                label: '设备当前温度'
            },
        }
    },
    mounted() {
        const cycle = this.$store.state.config.bigScreenCycle || 60000;
        this.getBaseInfo();
        this.getTrenData(this.searchId);
        this.timer = setInterval(() => {
            this.setTime();
            this.getBaseInfo();
            this.getTrenData(this.searchId);
        }, cycle)
    },
    beforeDestroy(){
        clearInterval(this.timer);
    },
    methods: {
        setTime() {
            const endTime = new Date().getTime();
		    const startTime = endTime - 86400000;
            this.searchData.startTime = startTime;
            this.searchData.endTime = endTime;
        },
        getBaseInfo() {
            let params = {
                page: 1,
                pageSize: 20,
                ...this.searchData,
            }
            ApiNetworkList('/network/device/page', params).then(result => {
                if(result.status === 1) {
                    if (!!this.searchId) {
						const row = result.data.records.filter((item) => item.id === this.searchId)[0];
                        this.$emit('setTopInfo', {name: row.name, tip: row.manufactor, ip: row.targetIp});
					}
                }
            })
        },
        getTrenData(id) {
            let params = {
                page: 1,
                pageSize: 20,
                monitorId: id,
                ...this.searchData,
            }
            let tempTrendData = [];
            this.trendData = {
                cpuTrendData: [],
                memTrendData: [],
            }
            this.tempValue = 0
            ApiNetworkList(`/network/device/histroy`, params).then((res) => {
                if (res.status == 1 && res.data.length) {
                    this.interTrendData = res.data[res.data.length - 1].interfaceStatus || []
                    res.data.forEach((item, ind) => {
                        item.cpuUsePercent &&
                            item.cpuUsePercent.forEach((it, index) => {
                                if (ind == 0) {
                                    this.cpuTrendData[index] = []
                                }
                                if (ind == res.data.length - 1 && it.value > this.cpuValue) {
                                    this.cpuValue = it.value
                                }
                                this.cpuTrendData[index].push([item.time * 1000, it.value])
                            })
                        item.memoryUsePercent &&
                            item.memoryUsePercent.forEach((it, index) => {
                                if (ind == 0) {
                                    this.memTrendData[index] = []
                                }
                                if (ind == res.data.length - 1 && it.value > this.memValue) {
                                    this.memValue = it.value
                                }
                                this.memTrendData[index].push([item.time * 1000, it.value])
                            })
                        item.temperature &&
                            item.temperature.forEach((it, index) => {
                                if (ind == 0) {
                                    tempTrendData.push({name: `设备温度${index+1}`, data: []})
                                }
                                if (ind == res.data.length - 1 && it.value > this.tempValue) {
                                    this.tempValue = it.value;
                                    this.percentageValue.value = parseFloat(it.value);
                                }
                                tempTrendData[index]['data'].push([item.time * 1000, parseInt(it.value)])
                            })
                    })
                    this.tempTrendData = tempTrendData;
                    this.$emit('setTempTrendData', this.tempTrendData);
                    this.trendData.cpuTrendData = this.cpuTrendData[0] || []
                    this.trendData.memTrendData = this.memTrendData[0] || []
                }
            })
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