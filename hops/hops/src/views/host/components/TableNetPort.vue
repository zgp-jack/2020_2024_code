<template>
    <div style="position: absolute; width: calc( 100% - 32px); height: calc( 100% - 70px);">
        <el-table :data="listData" height="100%" @expand-change="handleOpenRow" @sort-change="handleSortChange">
            <el-table-column prop="name" label="名称"> </el-table-column>
            <el-table-column prop="mac" label="MAC" width="140"> </el-table-column>
            <el-table-column prop="status" label="状态"> </el-table-column>
            <el-table-column prop="upStr" label="上行速率" width="130" sortable sort-by="up"> </el-table-column>
            <el-table-column prop="downStr" label="下行速率" width="130" sortable sort-by="down"> </el-table-column>
            <el-table-column prop="errorPack" label="错误包" sortable> </el-table-column>
            <el-table-column type="expand" label="操作">
                <template slot-scope="scope">
                    <div :key="scope.row.id" :id="scope.row.id + 'NetChart'" class="net-row-chart"></div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import * as echarts from 'echarts';
    import ApiHost from '@/api/host';
    import { getMaxUnitByFlow, getValueByUnit } from '@/utils/util';
    export default {
        props: {
            listData: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            searchData: {
                type: Object
            }
        },
        components: {
            ChartCpu: () => import('./ChartCpu.vue'),
        },
        data() {
            return {
                unit: 'bps',
                option: {
                    legend: {
                        type: 'plain',
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: (params) => {
                            let str = `${params[0].axisValueLabel}`;
                            params.forEach((item,index) => {
                                str += `<br/>${item.marker} ${item.seriesName}:${item.data[1]}${this.unit}`
                            })
                            return str;
                        },
                    },
                    grid: {
                        top: 24,
                        left: 60,
                        right: 32,
                        bottom: 40
                    },
                    xAxis: {
                        type: 'time',
                        boundaryGap: false
                    },
                    yAxis: [
                        {
                            position:'left',
                            type: 'value',
                        },
                    ],
                    dataZoom: [
                        {
                            type: "slider",
                            show: true,
                            realtime: true,
                            backgroundColor: "#fff",
                            // fillerColor: '#145B58',
                            borderColor: 'none',
                            textStyle: {
                                color: '#ccc'
                            },
                            start: 0,
                            end: 100,
                            height: 12,
                            bottom: 8
                        },
                    ],
                    series: [
                        {
                            name: '上行速率',
                            type: 'line',
                            symbol: 'none',
                            sampling: 'lttb',
                            stack: 'Total',
                            itemStyle: {
                                color: 'rgb(83, 111, 196)'
                            },
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgb(83, 111, 196)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(83, 111, 196, .3)'
                                }
                                ])
                            },
                            data: []
                        },
                        {
                            name: '下行速率',
                            type: 'line',
                            symbol: 'none',
                            sampling: 'lttb',
                            stack: 'Total',
                            // yAxisIndex: 1,
                            itemStyle: {
                                color: 'rgb(145, 204, 117)'
                            },
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgba(145, 204, 117, .3)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgb(145, 204, 117)'
                                }
                                ])
                            },
                            data: []
                        }
                    ]
                },
                chartList: []
            }
        },
        mounted() {
            this.chartList = [];
        },
        beforeDestroy() {
            // this.disposeChart();
        },
        methods: {
            getList(id) {
                let data1 = [];
                let data2 = [];
                const params= {
                    networkId: id,
                    hostId: this.searchData.hostId,
                    startTime: this.searchData.startTime,
                    endTime: this.searchData.endTime
                }
                ApiHost.network(params).then(result => {
                    // const result = res.data;
                    if(result.status === 1) {
                        const list = result.data;
                        let max = 0;
                        let unit = 'bps';
                        list.forEach(item => {
                            max = item.up > max ? item.up : max;
                            max = item.down > max ? item.down : max;
                        })
                        unit = getMaxUnitByFlow(max).unit;
                        this.unit = unit;
                        list.forEach(item => {
                            const up = getValueByUnit(item.up, unit);
                            const down = getValueByUnit(item.down, unit);
                            data1.push([item.time, up]);
                            data2.push([item.time, down]);
                        });
                        this.option.series[0].data = data1;
                        this.option.series[1].data = data2;
                        this.drawChart(id + 'NetChart');
                    }
                })
            },
            handleSortChange() {
                this.$nextTick(() => {
                    this.chartList.forEach(id => {
                        this.getList(id);
                    })
                })
            },
            drawChart(id) {
                var myChart = echarts.init(document.getElementById(id));
                myChart.clear();
                myChart.setOption(this.option);
            },
            handleOpenRow(row, expand) {
                row.expand = !row.expand;
                
                if(row.expand) {
                    if(this.chartList.indexOf(row.id) < 0) {
                        this.chartList.push(row.id);
                    }
                    this.getList(row.id);
                }
            },
            resize() {
                this.chartList.forEach(id => {
                    echarts.init(document.getElementById(id + 'NetChart')).resize();
                })
            },
            disposeChart() {
                this.chartList.forEach(id => {
                    echarts.init(document.getElementById(id + 'NetChart')).dispose();
                })
            }
        }
    }
</script>
<style scoped lang="scss">
.net-row-chart{
    height: 180px;
}
</style>