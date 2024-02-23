<template>
    <div id="chartWarnTrend"></div>
</template>
<script>
import ApiAlarm from '@/api/alarm'
import * as echarts from 'echarts';
export default {
    name: 'chartWarnTrend',
    props: {
        timeList: {
            type: Array
        }
    },
    data() {
        return {
            option: {
                tooltip: {
                    trigger: 'axis',
                    position: function (pt) {
                        return [pt[0] + 10, '50%'];
                    },
                    formatter: (params) => {
                        let str = `${params[0].axisValueLabel}`;
                        params.forEach((item,index) => {
                            str += `<br/>${item.marker} ${item.seriesName}:${(item.data[1])}个`
                        })
                        return str;
                    },
                    appendToBody: true
                },
                grid: {
                    top: 16,
                    left: 32,
                    right: 6,
                    bottom: 40
                },
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%']
                },
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
                    name: '告警数量',
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 8,
                    showSymbol: false,
                    sampling: 'lttb',
                    itemStyle: {
                        color: 'rgb(255, 70, 131)'
                    },
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
        }
    },
    mounted() {
        this.initData()
    },
    methods: {
        initData() {
            const params = {
                startTime: this.timeList[0],
                endTime: this.timeList[1],
            }
            let data1 = [];
            ApiAlarm.time(params).then(result => {
                if(result.status === 1) {
                    const list = result.data;
                    list.forEach(item => {
                        data1.push([item.time, item.num]);
                    });
                    this.option.series[0].data = data1;
                    this.drawChart();
                }
                
            })
        },
        drawChart() {
            var myChart = echarts.init(document.getElementById('chartWarnTrend'));
            myChart.setOption(this.option);
            myChart.on('click', params => {
                console.log(new Date(params.data[0]));
                this.$emit('setFilter', {name: 'time', value: params.data[0]})
            })
        }
    }
}
</script>
<style scoped>
    #chartWarnTrend{
        width: 100%;
        height: 120px;
    }
</style>