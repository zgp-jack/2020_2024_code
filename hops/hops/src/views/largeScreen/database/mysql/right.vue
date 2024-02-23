<template>
    <div class="mysql-right">
        <div class="large-card" style="height: 50%;">
            <LineChart domId="lineFlow" height="100%" :units="[FlowListUnit]" :legend="['上行', '下行']" :seriesData1="FlowList[0]" :seriesData2="FlowList[1]">
                <template v-slot:title>
                    <div class="line-title">
                        <span class="large-sub-sub-label">流量</span>
                        <div class="line-title-legend" style="float: right">
                            <div class="line-title-legend-item" style="margin-right:16px"><div style="background-color: #006666"></div>上行</div>
                            <div class="line-title-legend-item"><div style="background-color: #ffbc00"></div>下行</div>
                        </div>
                    </div>
                </template>
            </LineChart>
        </div>
        <p class="large-label">内存</p>
        <div class="large-card" style="height: 50%;">
            <LineMultipleChart  v-if="seriesData.length" domId="lineMemMultiple" :seriesData="seriesData" :unit="seriesDataUnit" height="100%"> </LineMultipleChart>
        </div>
        <!-- <p class="large-label">告警</p>
        <WarnList style="flex:1; min-height: 0;" :businessId="searchId" :monitorTypeId="4" :searchData="searchWarn" refresh :showTop="false" :showFilter="false" :showIcon="true"></WarnList> -->
    </div>
</template>
<script>
import ApiDatabase from '@/api/database';
import { getMaxUnitByBit, getValueByUnit, getMaxUnitByFlow } from '@/utils/util';
export default {
    name: 'mysqlRight',
    props: {
        searchId: {
            type: Number
        }
    },
    components: {
        LineMultipleChart: () => import('../../components/lineMultiple.vue'),
        WarnList: () => import('@/components/warnList.vue'),
        LineChart: () => import('../../components/line.vue'),
    },
    data() {
        const endTime = parseInt(new Date().getTime())
		const startTime = endTime - 86400000;
        return {
            seriesDataUnit: 'B',
            seriesData: [],
            searchData: {
                startTime: startTime,
                endTime: endTime,
                dbType: 8
            },
            searchWarn: {
                startTime: startTime,
				endTime: endTime
            },
            FlowList: [],
            FlowListUnit: '',
            timer: null
        }
    },
    mounted() {
        const cycle = this.$store.state.config.bigScreenCycle || 60000;
        this.getChartData(6, 'seriesData');
        this.getChartData(5, 'FlowList');
        this.timer = setInterval(() => {
            this.setTime();
            this.getChartData(6, 'seriesData');
            this.getChartData(5, 'FlowList');
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
        getChartData(type, args) {
            const params = {
                dbId: this.searchId,
                dataType: type,
                ...this.searchData
            }
            ApiDatabase.trendData(params).then(result => {
                if(result.status === 1) {
                    let max = 0;
                    let unit = 'B';
                    const size = result.data.length;
                    
                    result.data.forEach((res, index) => {
                        (res.data || []).forEach(item => {
                            max = item.value > max ? item.value : max;
                        })
                    })
                    unit = args === 'FlowList' ? getMaxUnitByFlow(max * 8).unit : getMaxUnitByBit(max).unit;
                    this[args + 'Unit'] = unit;
                        
                    result.data.forEach((item,index) => {
                        const list = item.data;
                        let data = [];
                        list.forEach((item, index) => {
                            if(args === 'FlowList') {
                                item.value *= 8;
                            }
                            data.push([item.time, getValueByUnit(item.value, unit)]);
                        });
                        if(args === 'FlowList') {
                            this[args].push(data);
                        }else {
                            this[args].push({name: item.key, data: data});
                        }
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.mysql-right{
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 16px;
}
</style>