<template>
    <div class="business-left">
        <p class="large-label">报修排名</p>
        <el-tabs class="large-card" v-model="tab1Active" style="padding-top: 4px;">
            <el-tab-pane name="1">
                <span slot="label"><i class="el-icon-date"></i> 故障</span>
                <Bar :tableData="listMetric"></Bar>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label"><i class="el-icon-date"></i> 设备</span>
                <Bar :tableData="listMonitor"></Bar>
            </el-tab-pane>
        </el-tabs>
        <p class="large-label">资源使用情况</p>
        <div class="flex-1" style="height: calc(100% - 303px);">
            <div class="large-card" style="height: 50%;">
                <p class="large-sub-label">CPU</p>
                <BarMountain v-if="cpuData.length" :seriesData="cpuData" :xAxisData="cpuName" domId="barCpu" height="calc(100% - 34px)"></BarMountain>
            </div>
            <div class="large-card" style="height: calc(50% - 8px); margin-top: 8px;">
                <p class="large-sub-label">内存</p>
                <BarMountain v-if="memData.length" :seriesData="memData" :xAxisData="memName" domId="barMem" height="calc(100% - 34px)"></BarMountain>
            </div>
        </div>
    </div>
</template>
<script>
import ApiLargeScreen from '@/api/large';
export default {
    name: 'businessLeft',
    props:{
        planId: {
            type: [Number, String]
        },
    },
    components: {
        Bar: () => import('../components/bar.vue'),
        BarMountain: () => import('../components/barMountain.vue'),
    },
    data() {
        const endTime = new Date().getTime();
        const startTime = endTime - 86400000;
        return {
            tab1Active: '1',
            listMetric: [],
            listMonitor: [],
            cpuData: [],
            cpuName: [],
            memData: [],
            memName: [],
            searchData: {
				startTime: startTime,
				endTime: endTime,
			},
            timer: null
        }
    },
    mounted() {
        const cycle = this.$store.state.config.bigScreenCycle || 60000;
        this.getBusinessMetric();
        this.getBusinessMonitor();
        this.getBusinessCpu();
        this.getBusinessMem();
        this.timer = setInterval(() => {
            this.setTime();
            this.getBusinessMetric();
            this.getBusinessMonitor();
            this.getBusinessCpu();
            this.getBusinessMem();
        }, cycle)
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        setTime() {
            this.tab1Active =  this.tab1Active === '1' ? '2' : '1';
            const endTime = new Date().getTime();
		    const startTime = endTime - 86400000;
            this.searchData.startTime = startTime;
            this.searchData.endTime = endTime;
        },
        getBusinessMetric() {
            const params = {
                ...this.searchData,
                planId: this.planId
            }
            ApiLargeScreen.metric(params).then(res => {
                let total = 0;
                res.data.map(item => {
                    total += item.num || 0;
                })
                if(res.status === 1) {
                    this.listMetric = res.data.map(item => {
                        return {
                            name: item.name,
                            value: parseInt(item.num/total * 100),
                            num: item.num,
                            unit: '个'
                        }
                    });
                }
            })
        },
        getBusinessMonitor() {
            const params = {
                ...this.searchData,
                planId: this.planId
            }
            ApiLargeScreen.monitor(params).then(res => {
                let total = 0;
                res.data.map(item => {
                    total += item.num || 0;
                })
                if(res.status === 1) {
                    this.listMonitor = res.data.map(item => {
                        return {
                            name: item.name,
                            value: parseInt(item.num/total * 100),
                            num: item.num,
                            unit: '个'
                        }
                    });
                }
            })
        },
        getBusinessCpu() {
            this.cpuData = [];
            this.cpuName = [];
            const params = {
                ...this.searchData,
                id: this.planId
            }
            ApiLargeScreen.cpu(params).then(res => {
                if(res.status === 1) {
                    const list = res.data.sort((a, b) => b.num - a.num);
                    list.map(item => {
                        this.cpuData.push(item.num);
                        this.cpuName.push(item.name);
                    })
                }
            })
        },
        getBusinessMem() {
            this.memData = [];
            this.memName = [];
            const params = {
                ...this.searchData,
                id: this.planId
            }
            ApiLargeScreen.mem(params).then(res => {
                if(res.status === 1) {
                    const list = res.data.sort((a, b) => b.num - a.num);
                    list.map(item => {
                        this.memData.push(item.num);
                        this.memName.push(item.name);
                    })
                }
            })
        },
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