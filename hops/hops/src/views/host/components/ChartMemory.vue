<template>
    <div style="position: absolute; width: calc( 100% - 32px);">
        <div class="card-total">
            <p>利用率：<span>{{ rate }}%</span></p>
            <p>总容量：<span>{{ total }}GB</span></p>
            <p>已使用：<span>{{ used }}GB</span></p>
            <p>SWAP容量：<span>{{ swapTotal }}GB</span></p>
        </div>
        <div id="chartMemory"></div>
    </div>
</template>
<script>
    import * as echarts from 'echarts';
    import ApiHost from '@/api/host';
    import { getGb } from '@/utils/util'
    export default {
        name: 'chartMemory',
        props: {
            searchData: {
                type: Object
            }
        },
        data() {
            return {
                option: {
                    // legend: {
                    //     type: 'plain',
                    // },
                    tooltip: {
                        trigger: 'axis',
                        position: function (pt) {
                            return [pt[0], '10%'];
                        },
                        formatter: (params) => {
                            return `${params[0].axisValueLabel}<br>`+
                            `${params[0].marker} ${params[0].seriesName}:${(params[0].data[1]).toFixed(0)}%<br />`;
                        }
                    },
                    grid: {
                        top: 16,
                        left: 40,
                        right: 6,
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
                            axisLabel: {
                                //y轴设置为%
                                show: true,
                                interval: 'auto',
                                formatter: `{value}%`,
                            }
                        },
                        // {
                        //     position:'right',
                        //     type: 'value',
                        //     boundaryGap: [0, '100%']
                        // },
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
                            name: '内存利用率',
                            type: 'line',
                            symbol: 'none',
                            sampling: 'lttb',
                            // itemStyle: {
                            //     color: 'rgb(255, 70, 131)'
                            // },
                            // areaStyle: {
                            //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            //     {
                            //         offset: 0,
                            //         color: 'rgb(255, 158, 68)'
                            //     },
                            //     {
                            //         offset: 1,
                            //         color: 'rgb(255, 70, 131)'
                            //     }
                            //     ])
                            // },
                            data: []
                        }
                    ]
                },
                rate: 0,
                swapTotal: 0,
                total: 0,
                used: 0
            }
        },
        mounted() {
            this.initData()
        },
        methods: {
            initData() {

                let data1 = [];
                ApiHost.mem(this.searchData).then(result => {
                    // const result = res.data;
                    if(result.status === 1) {
                        const list = result.data.memDataList || [];
                        list.forEach(item => {
                            data1.push([item.time, item.rate]);
                        });
                    }
                    this.rate = ((result.data.rate || 0)).toFixed(2);
                    this.swapTotal = getGb(result.data.swapTotal).num;
                    this.total = getGb(result.data.total).num;
                    this.used = getGb(result.data.used).num;
                    
                    this.option.series[0].data = data1;
                    this.drawChart();
                })
            },
            drawChart() {
                var myChart = echarts.init(document.getElementById('chartMemory'));
                myChart.setOption(this.option);
            },
            resize() {
                echarts.init(document.getElementById('chartMemory')).resize();
            }
        }
    }
</script>
<style scoped>
    #chartMemory{
        width: 100%;
        height: 160px;
    }
</style>