<template>
    <div style="width: 100%; position: relative;" :style="{height: height}" >
        <slot name="title"></slot>
        <div class="PieChart" :id="domId" ref="chart"></div>
        <div style="position: absolute; top: 24px; right: 16px">
            <div class="pie-legend" v-for="item,index in legendList">
                <div class="pie-legend-label"> {{ item.label }}<span class="pie-legend-value">{{ item.value + item.unit }}</span></div>
                <ul>
                    <li>
                        <div class="pie-legend-icon" :style="{background: `rgb(${color[index*2].r},${color[index*2].g},${color[index*2].b})`}"></div>
                        <p>已使用</p><span class="pie-legend-value">{{ item.used + item.unit }}</span>
                    </li>
                    <li>
                        <div class="pie-legend-icon" :style="{background: `rgb(${color[index*2+1].r},${color[index*2+1].g},${color[index*2+1].b})`}"></div>
                        <p>剩余容量</p><span class="pie-legend-value">{{ item.other + item.unit}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import * as echarts from 'echarts';
    export default {
        name: 'ChartCpu',
        props: {
            domId: {
                type: String,
                default: 'pieMem'
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
            legendList: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data() {
            var colorList = [
                {r: 255, g: 131, b: 107}, {r: 30, g: 201, b: 105}, {r: 255, g: 212, b: 0}, {r: 101, g: 173, b: 235},
            ]
            return {
                color: [
                    {r: 255, g: 131, b: 107}, {r: 30, g: 201, b: 105}, {r: 255, g: 212, b: 0}, {r: 101, g: 173, b: 235},
                ],
                option: {
                    series: [
                        {
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        const color = colorList[params.dataIndex];
                                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                offset: 0,
                                                color: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`
                                            },{
                                                offset: 1,
                                                color: `rgba(${color.r}, ${color.g}, ${color.b}, .3)`
                                            }
                                        ])
                                    }
                                }
                            },
                            type: 'pie',
                            center: ["25%", "50%"],
                            radius: ['40%', '70%'],
                            label: {
                                normal: {
                                    show:false
                                }
                            },
                            data: []
                        },
                        {
                            name: '外边框',
                            type: 'pie',
                            tooltip: {
                                show: false,
                            },
                            clockWise: true, //顺时加载
                            hoverAnimation: false, //鼠标移入变大
                            center: ['25%', '50%'],//这里跟上面那组一样即可
                            radius: ['70%', '80%'],//这里根据自己的需要自行调整
                            label: {
                                normal: {
                                    show: false //重点：此处主要是为了不展示data中的value和name
                                }
                            },
                            data: []
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
                let seriesData = []
                this.seriesData.map(item => {
                    if(!!item.subLabel) {
                        seriesData.push({
                            name: `${item.label}-${item.subLabel}`,
                            value: item.value,
                        })
                    }
                })
                let outData = [];
                seriesData.forEach((item,index) => {
                    const color = this.color[index];
                    outData.push({
                        value: item.value,
                        name: '',//因为不展示label，可不填
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: `rgba(${color.r}, ${color.g}, ${color.b}, .3)`
                                    },{
                                        offset: 1,
                                        color: `rgba(${color.r}, ${color.g}, ${color.b}, .1)`
                                    }
                                ])
                            }
                        }
                    })
                })
                this.option.series[0].data = seriesData;
                this.option.series[1].data = outData;
                this.drawChart();
            },
            drawChart() {
                var myChart = echarts.init(document.getElementById(this.domId));
                myChart.clear();
                myChart.setOption(this.option);
            },
            resize() {
                echarts.init(document.getElementById(this.domId)).resize();
            }
        }
    }
</script>
<style lang="scss" scoped>
    .PieChart{
        width: 100%;
        height: calc(100% - 34px);
        position: relative;
    }
    .pie-legend {
            display: block;
            margin-top: 24px;
            position: relative;
            height: 80px;
        }
        .pie-legend-value{
            display: inline-block;
            vertical-align: middle;
            text-align: right;
            float: right;
        }
        .pie-legend-label{
            width: 160px;
            position: relative;
        }
        ul{
            border-left: 1px solid #edf0ef;
            list-style: none;
            padding: 0;
            text-align: left;
            margin-top: -6px;
            position: absolute;
            left: 8px;
            li{
                vertical-align: bottom;
                width: 150px;
                height: 24px;
                .pie-legend-icon{
                    width: 8px;
                    height: 8px;
                    display: inline-block;
                    vertical-align: middle;
                    background-color: #fff;
                    position: relative;
                    top: 10px;
                    margin: 0 2px;
                }
                p{
                    position: relative;
                    display: inline-block;
                    top: 10px;
                    font-size: 11px;
                    span{
                        font-size: 14px;
                        font-weight: bold;
                        padding: 0 2px;
                    }
                }
                .pie-legend-value{
                    position: relative;
                    top: 10px;
                }
            }
            li::before{
                content: '';
                display: inline-block;
                width: 6px;
                height: 1px;
                background-color: #edf0ef;
                vertical-align: bottom;
            }
        }
</style>