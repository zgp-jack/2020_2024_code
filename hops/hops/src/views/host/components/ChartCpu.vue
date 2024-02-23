<template>
    <div style="position: absolute; width: calc( 100% - 32px);">
        <div class="card-total">
            <p>利用率：<span>{{ idle }}%</span></p>
            <p>负载：<span>{{ load }}</span></p>
            <p>温度：<span>{{ temperature }}℃</span></p>
        </div>
        <div id="chartCpu"></div>
    </div>
</template>
<script>
    import * as echarts from 'echarts';
    import ApiHost from '@/api/host';
    export default {
        name: 'ChartCpu',
        props: {
        searchData: {
                type: Object
            }
        },
        data() {
            return {
                option: {
                    legend: {
                        type: 'plain',
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: (params) => {
                            let str = `${params[0].axisValueLabel}`;
                            params.forEach((item,index) => {
                                str += `<br/>${item.marker} ${item.seriesName}:${(item.data[1]).toFixed(0)}${item.seriesName==='CPU使用率'?'%':'℃'}`
                            })
                            return str;
                        },
                        appendToBody: true
                    },
                    grid: {
                        top: 36,
                        left: 40,
                        right: 40,
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
                        {
                            position:'right',
                            type: 'value',
                            boundaryGap: [0, '100%'],
                            axisLabel: {
                                //y轴设置为%
                                show: true,
                                interval: 'auto',
                                formatter: `{value}℃`,
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
                            name: 'CPU使用率',
                            type: 'line',
                            symbol: 'none',
                            sampling: 'lttb',
                            yAxisIndex: 0,
                            data: []
                        },
                        {
                            name: 'CPU温度',
                            type: 'line',
                            symbol: 'none',
                            sampling: 'lttb',
                            yAxisIndex: 1,
                            // yAxisIndex: 1,
                            // itemStyle: {
                            //     color: 'rgb(255, 70, 131, .5)'
                            // },
                            // areaStyle: {
                            //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            //     {
                            //         offset: 0,
                            //         color: 'rgb(255, 158, 68, .5)'
                            //     },
                            //     {
                            //         offset: 1,
                            //         color: 'rgb(255, 70, 131, .5)'
                            //     }
                            //     ])
                            // },
                            data: []
                        }
                    ]
                },
                idle: 0,
                load: 0,
                temperature: 0
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            initData() {

                let data1 = [];
                let data2 = [];
                
                ApiHost.cpu(this.searchData).then(result => {
                    // const result = res.data;
                    if(result.status === 1) {
                        const list = result.data.cpuDataList || [];
                        
                        list.forEach(item => {
                            data1.push([item.time, item.idle]);
                            data2.push([item.time, item.temperature]);
                        });
                    }
                    this.option.series[0].data = data1;
                    this.option.series[1].data = data2;
                    this.idle = ((result.data.idle || 0)).toFixed(2);
                    this.load = result.data.load;
                    this.temperature = (result.data.temperature || 0).toFixed(2);
                    this.drawChart();
                })
                
            },
            drawChart() {
                var myChart = echarts.init(document.getElementById('chartCpu'));
                myChart.clear();
                myChart.setOption(this.option);
            },
            resize() {
                echarts.init(document.getElementById('chartCpu')).resize();
            }
        }
    }
</script>
<style scoped>
    #chartCpu{
        width: 100%;
        height: 160px;
    }
</style>