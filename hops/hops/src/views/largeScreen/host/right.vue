<template>
    <div class="business-right">
        <div class="flex-1">
            <div class="large-card" style="height: 33.34%;">
                <LineChart domId="lineCpu" :units="['%', '℃']" :seriesData1="listIdle" :seriesData2="listTemperature" height="100%">
                    <template v-slot:title>
                        <div class="line-title">
                            <span class="large-sub-label">CPU使用情况</span>
                            <div class="line-title-legend" style="float: right">
                                <div class="line-title-legend-item" style="margin-right:16px"><div style="background-color: #006666"></div>CPU使用情况</div>
                                <div class="line-title-legend-item"><div style="background-color: #ffbc00"></div>CPU温度</div>
                            </div>
                        </div>
                    </template>
                </LineChart>
            </div>
            <div class="large-card" style="height: 33.34%;">
                <LineChart domId="linemem" :units="['%']" :legend="['内存利用率']" :seriesData1="listMem" height="100%">
                    <template v-slot:title>
                        <div class="line-title">
                            <span class="large-sub-label">内存利用率</span>
                            <div style="float: right; font-size: 12px">
                                <div>当前利用率<span style="color: #282827;font-size: 14px;">{{memRate}}%</span></div>
                            </div>
                        </div>
                    </template>
                </LineChart>
            </div>
            <div class="large-card" style="height: 33.33%;">
                <p class="large-sub-label">磁盘明细</p>
                <Bar :showIndex="false" :tableData="listDisk"></Bar>
            </div>
        </div>
        <!-- <p class="large-label">告警</p>
        <WarnList style="flex:1; min-height: 0;" :businessId="searchId" :monitorTypeId="1" :searchData="searchWarn" refresh :showTop="false" :showFilter="false" :showIcon="true"></WarnList> -->
    </div>
</template>
<script>
export default {
    name: 'businessRight',
    props: {
        searchId: {
            type: Number
        },
        listIdle: {
            type: Array,
            default: () => {
                return [];
            }
        },
        listTemperature: {
            type: Array,
            default: () => {
                return [];
            }
        },
        listMem: {
            type: Array,
            default: () => {
                return [];
            }
        },
        listDisk: {
            type: Array,
            default: () => {
                return [];
            }
        },
        memRate: {
            type: [String, Number],
            default: 0
        }
    },
    components: {
        Bar: () => import('../components/bar.vue'),
        LineChart: () => import('../components/line.vue'),
        WarnList: () => import('@/components/warnList.vue'),
        PieChart: () => import('../components/pie.vue'),
    },
    data() {
        const endTime = parseInt(new Date().getTime());
		const startTime = endTime - 86400000;
        return {
            tab2Active: '1',
            searchData: {
                hostId: 3,
				name: '',
				startTime: startTime,
				endTime: endTime,
            },
            searchWarn: {
                startTime: startTime,
                endTime: endTime
            },
            timer: null,
        }
    },
    mounted() {
        const cycle = this.$store.state.config.bigScreenCycle || 60000;
        this.timer = setInterval(() => {
            this.setTime();
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
    }
}
</script>
<style lang="scss" scoped>
.business-right{
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 16px;
}
</style>