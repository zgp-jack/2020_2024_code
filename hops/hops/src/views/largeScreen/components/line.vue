<template>
    <div style="width: 100%;" :style="{height: height}" >
        <slot name="title"></slot>
        <div class="LineChart" ref="chart" :id="domId" ></div>
    </div>
</template>
<script>
    import * as echarts from 'echarts';
    export default {
        name: 'ChartCpu',
        props: {
            domId: {
                type: String,
                default: 'lineCpu'
            },
            height: {
                type: String,
                default: '100%'
            },
            legend: {
                type: Array,
                default: () => {
                    return ['CPU使用率', 'CPU温度']
                }
            },
            units: {
                type: Array,
                default: () => {
                    return ['%', '℃']
                }
            },
            seriesData1: {
                type: Array,
                default: () => {
                    return []
                }
            },
            seriesData2: {
                type: Array,
                default: () => {
                    return []
                }
            },
            left: {
                type: [String, Number],
                default: 60
            },
        },
        data() {
            return {
                option: {
                    tooltip: {
                        trigger: 'axis',
                        // position: function (pt) {
                        //     return [pt[0], '10%'];
                        // },
                        textStyle: {
                            fontFamily: 'DingTalk'
                        },
                        formatter: (params) => {
                            let str = `${params[0].axisValueLabel}`;
                            let unit = this.units[0];
                            if(params[0].seriesName === 'CPU温度') {
                                unit = this.units[1];
                            }
                            params.forEach((item,index) => {
                                if(this.units.length > 0 && index===1) {
                                    unit = this.units[1];
                                }
                                str += `<br/>${item.marker} ${item.seriesName}:${parseFloat(item.data[1]).toFixed(0)}${unit}`
                            })
                            return str;
                        },
                        appendToBody: true
                    },
                    color: ['#006666', '#ffbc00'],
                    grid: {
                        top: 16,
                        left: this.left,
                        right: 6,
                        bottom: 24
                    },
                    xAxis: {
                        type: 'time',
                        boundaryGap: false,
                        axisLabel: {
                            interval: 12,
                            formatter: '{HH}',
                            textStyle: {
                                fontFamily: 'DingTalk'
                            },
                        }
                    },
                    yAxis: [
                        {
                            type: 'value',
                            splitLine: {
                                show: false
                            }
                        },
                    ],
                    series: [
                        {
                            name: this.legend[0],
                            type: 'line',
                            symbol: 'none',
                            sampling: 'average',
                            smooth: 1,
                            smoothMonotone: 'x',
                            data: [],
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: '#006666'
                                },
                                {
                                    offset: .5,
                                    color: 'rgba(255, 255, 255, .1)'
                                }
                                ])
                            },
                        },
                        {
                            name: this.legend[1],
                            type: 'line',
                            symbol: 'none',
                            sampling: 'lttb',
                            smooth: true,
                            data: [],
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: '#ffbc00'
                                },
                                {
                                    offset: .5,
                                    color: 'rgba(255, 255, 255, .1)'
                                }
                                ])
                            },
                        }
                    ]
                }
            }
        },
        mounted() {
            this.initData();
        },
        beforeDestroy() {
            let myChart = echarts.init(this.$refs['chart']);
            myChart.dispose();
        },
        methods: {
            initData() {
                if(this.seriesData1.length) {
                    this.option.series[0].data = this.seriesData1;
                }
                if(this.seriesData2.length) {
                    this.option.series[1].data = this.seriesData2;
                }
                this.option.yAxis[0].axisLabel = {
                    //y轴设置为%
                    show: true,
                    interval: 'auto',
                    textStyle: {
                        fontFamily: 'DingTalk'
                    },
                    formatter: `{value}${this.units[0] || 'bps'}`,
                }
                if(this.units.length > 1) {
                    this.option.series[0].yAxisIndex = 0;
                    this.option.series[1].yAxisIndex = 1;
                    this.option.grid.right = 48;
                    this.option.yAxis.push({
                        type: 'value',
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            //y轴设置为%
                            show: true,
                            interval: 'auto',
                            textStyle: {
                                fontFamily: 'DingTalk'
                            },
                            formatter: `{value}${this.units[1] || '℃'}`,
                        },
                    })
                }
                this.drawChart();
            },
            drawChart() {
                let myChart = echarts.init(document.getElementById(this.domId));
                myChart.clear();
                myChart.setOption(this.option);
            },
            resize() {
                echarts.init(document.getElementById(this.domId)).resize();
            }
        },
        watch: {
            seriesData1: {
                handler: function() {
                    this.initData();
                },
                deep: true
            },
            seriesData2: {
                handler: function() {
                    this.initData();
                },
                deep: true
            },
        }
    }
</script>
<style scoped>
    .LineChart{
        width: 100%;
        height: calc(100% - 23px);
    }
</style>