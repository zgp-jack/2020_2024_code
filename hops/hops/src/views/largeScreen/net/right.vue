<template>
    <div class="net-right">
        <div class="large-card" style="height: 300px">
            <span class="large-sub-sub-label">温度情况</span>
            <LineMultipleChart v-if="tempTrendData.length" domId="lineMemOtherMultiple" :seriesData="tempTrendData" unit="℃" height="calc(100% - 34px)"> </LineMultipleChart>
            <el-empty v-else class="warnList-empty" :image="require('@/assets/table-empty.png')"></el-empty>
        </div>
        <p class="large-label">端口</p>
        <div class="large-card flex-1">
            <IndexTable style="margin-top: 8px;" :tableHeader="tableHeader" :tableData="tableData"></IndexTable>
        </div>
        <!-- <p class="large-label">告警</p>
        <WarnList style="flex:1; min-height: 0;" :businessId="searchId" :monitorTypeId="2" :searchData="searchWarn" refresh :showTop="false" :showFilter="false" :showIcon="true"></WarnList> -->
    </div>
</template>
<script>
import { ApiNetworkList } from '@/api';
import { getMaxUnitByFlow, getValueByUnit } from '@/utils/util'
    export default {
        name: 'netRight',
        props: {
            searchId: {
                type: Number
            },
            tempTrendData: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        components: {
            IndexTable: () => import('../components/table.vue'),
            WarnList: () => import('@/components/warnList.vue'),
            LineMultipleChart: () => import('../components/lineMultiple.vue'),
        },
        data() {
            const endTime = parseInt(new Date().getTime())
		    const startTime = endTime - 86400000;
            return {
                tab2Active: '1',
                tableHeader: [
                    {label: '端口', prop: 'name', width: '120px'},
                    {label: 'IP', prop: 'ip'},
                    {label: '实时流量', prop: 'portSpeedStr', width: '90px', sortable: true, sortBy: 'portSpeed'},
                    {label: '参考带宽', prop: 'standardBandWidthStr', width: '90px', sortable: true, sortBy: 'standardBandWidth'},
                ],
                tableData: [],
                portList: [],
                searchData: {
                    startTime: startTime,
                    endTime: endTime
                },
                searchWarn: {
                    startTime: startTime,
                    endTime: endTime
                },
                timer: null
            }
        },
        mounted() {
            const cycle = this.$store.state.config.bigScreenCycle || 60000;
            this.getPortData(this.searchId);
            this.timer = setInterval(() => {
                this.setTime();
                this.getPortData(this.searchId);
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
            getPortData(id) {
                let params = {
                    deviceId: id
                }
                ApiNetworkList(`/network/device/interface/list`, params).then((res) => {
                    if (res.status == 1) {
                        let max = 0;
                        let max1 = 0;
                        res.data.map(item => {
                            max1 = max1 < item.portSpeed ? item.portSpeed : max1;
                            // max = max < item.realityBandWidth ? item.realityBandWidth : max;
                            max = max < item.standardBandWidth ? item.standardBandWidth : max;
                        })
                        let unit = getMaxUnitByFlow(max, 1000).unit;
                        let unit1 = getMaxUnitByFlow(max1 * 8).unit;
                        this.unit = unit;
                        // this.tableHeader[2].label = `标准带宽(${unit})`;
                        // this.tableHeader[3].label = `实际带宽(${unit})`
                        this.tableData = res.data.map(item => {
                            // * 8
                            const num1 = getValueByUnit((item.portSpeed || 0) * 8, unit1);
                            const num2 = getValueByUnit(item.standardBandWidth, unit, 1000);
                            item.portSpeedStr = num1 + unit1;
                            item.standardBandWidthStr = num2 + unit;
                            return item;
                        })
                    }
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
.net-right{
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 16px;
}
</style>