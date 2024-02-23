<template>
    <div class="divChart" ref="chart" :id="domId" :style="{height: height}"></div>
</template>
<script>
import * as echarts from 'echarts'
export default {
    name: "echartDiv",
    props: {
        domId: {
            type: String,
            default: 'divChart'
        },
        height: {
            type: String,
            default: '100%'
        },
        seriesData: {
            type: Array,
            default: () => {
                return []
            }
        },
        xAxisData: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    computed: {
        option() {
            return {
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "none",
                    },
                    textStyle: {
                        fontFamily: 'DingTalk',
                    },
                    formatter: function (params) {//hover到某一柱子时显示单位，例如：“1号商店进货：60个”
                        return params[0].name + ": " + params[0].value + "%";
                    },
                },
                grid: {
                    top: 16,
                    left: 43,
                    bottom: 26,
                },
                xAxis: {
                    data: this.xAxisData.length > 6 ? this.xAxisData.splice(0, 6) : this.xAxisData,
                    axisTick: { show: false },
                    axisLine: {
                        lineStyle: {
                            color: "#757E7E",
                        },
                    },
                    axisLabel: {
                        color: "#757E7E",
                        interval: 0,
                        fontSize: 10,
                        width: 70,
                        overflow: 'truncate',
                        align: 'right',
                        fontFamily: 'DingTalk',
                        rotate: 10
                    },
                    axisPointer: {
                        type: "shadow",
                    },
                },
                yAxis: {
                    name: "",
                    type: "value",
                    min: 0,
                    max: 100,
                    interval: 25,
                    axisLabel: {
                        color: "#757E7E",
                        formatter: `{value}%`,
                        fontFamily: 'DingTalk',
                    },
                    axisTick: { show: false },
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                },
                color: ['#FF836B', '#FFBC00', '#65ADEB', '#006666', '#006666', '#006666'],
                series: [
                    {
                        name: "hill",
                        type: "pictorialBar",
                        barCategoryGap: "0%",
                        symbol: "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
                        label: {
                            show: true,
                            color: '#757E7E',
                            position: 'top',
                            formatter: '{c}%',
                            fontFamily: 'DingTalk',
                        },
                        itemStyle: {
                            normal: {
                                color: (params) => {
                                    let colorList = [
                                        { color0: '#FF836B', color1: '#FFE6E1', color2: 'rgba(255, 255, 255, 0)' },
                                        { color0: '#FFBC00', color1: '#FFF2CC', color2: 'rgba(255, 255, 255, 0)' },
                                        { color0: '#65ADEB', color1: '#E0EFFB', color2: 'rgba(255, 255, 255, 0)' },
                                        { color0: '#006666', color1: '#CCE0E0', color2: 'rgba(255, 255, 255, 0)' },
                                        { color0: '#006666', color1: '#CCE0E0', color2: 'rgba(255, 255, 255, 0)' },
                                        { color0: '#006666', color1: '#CCE0E0', color2: 'rgba(255, 255, 255, 0)' },
                                    ]
                                    return {
                                        type: "linear", x: 0, y: 0, x2: 0, y2: 1,
                                        colorStops: [
                                            { offset: 0, color: colorList[params.dataIndex].color0 },
                                            { offset: .8, color: colorList[params.dataIndex].color1 },
                                            { offset: 1, color: colorList[params.dataIndex].color2 },
                                        ],
                                        globalCoord: false
                                    }
                                }
                            },
                        },
                        emphasis: {
                            opacity: 1
                        },
                        data: this.seriesData.length > 6 ? this.seriesData.splice(0, 6) : this.seriesData,
                        z: 10,
                    },
                    {
                        name: "glyph",
                        type: "pictorialBar",
                        barGap: "-100%",//设置图的大小，越大底部重叠的越多
                        symbolPosition: "end",
                        symbolSize: 0,
                        symbolOffset: [0, "100%"],
                        data: [],
                    },
                ],
            }
        }
    },
    data() {
        return {
            
        };
    },
    mounted() {
        setTimeout(() => {
            this.drawChart();
        }, 200);
    },
    beforeDestroy() {
        let myChart = echarts.init(this.$refs['chart']);
        myChart.dispose();
    },
    methods: {
        drawChart() {
            if(this.seriesData.length <= 0 || this.xAxisData.length <= 0) {
                return false;
            }
            var myChart = echarts.init(document.getElementById(this.domId));
            myChart.clear();
            myChart.setOption(this.option);
        },
    }
};
</script>
<style lang="scss" scoped>
.divChart{
    width: 100%;
}
</style>