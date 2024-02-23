<template>
    <div style="position: relative; width: 100%; height: auto;">
        <div :id="domId" class="chart-box" :style="{height: height}">
            <!-- <el-empty class="warnList-empty" :image="require('@/assets/table-empty.png')"></el-empty> -->
        </div>
        <div class="card-total-box" v-if="hasLegend" :style="{height: this.totalData.length > 2 ? '120px' : '72px'}">
            <div class="card-item card-item-label" :style="{width: this.totalData.length > 2 ? 'calc(100% - 15px)' : '100%'}">
                <p style="flex: 1;"></p>
                <p>最大</p>
                <p>最小</p>
                <p>当前</p>
                <p class="card-item-avg" @click="sortTable">
                    平均
                    <i class="el-icon-arrow-down" v-show="sortDesc"></i>
                    <i class="el-icon-arrow-up" v-show="!sortDesc"></i>
                </p>
            </div>
            <div class="card-total-scroll" :style="{height: this.totalData.length > 2 ? '96px' : '48px'}">
                <div class="card-item" v-for="item in totalData">
                    <p style="flex: 1; color: #282827">
                        <span class="name-lengend-line" :style="{'background-color': item.color}"></span>
                        <span>{{ item.key }}</span>
                    </p>
                    <p><span>{{ item.max }}</span></p>
                    <p><span>{{ item.min }}</span></p>
                    <p><span>{{ item.current }}</span></p>
                    <p><span>{{ item.avg }}</span></p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ApiDatabase from '@/api/database';
import { getMaxUnitByBit, getValueByUnit, getMaxUnitByFlow } from '@/utils/util'
import * as echarts from 'echarts';
export default {
    name: 'chartConnect',
    props: {
        searchData: {
            type: Object
        },
        domId: {
            type: String
        },
        type: {
            type: Number
        },
        height:{
            type: String
        },
        hasZoom: {
            type: Boolean,
            default: true
        },
        hasyAxis: {
            type: Boolean,
            default: true
        },
        hasLegend: {
            type: Boolean,
            default: true
        },
        isBit: {
            type: Boolean,
            default: false
        },
        isFlow: {
            type: Boolean,
            default: false
        },
        stack: {
            type: Boolean,
            default: false
        },
        hideArea: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            totalData: [],
            option: {
                legend: {
                    type: 'scroll',
                    show: this.hasLegend
                },
                tooltip: {
                    trigger: 'axis',
                    
                    formatter: (params) => {
                        let str = `${params[0].axisValueLabel}`;
                        params.forEach((item,index) => {
                            str += `<br/>${item.marker} ${item.seriesName}:${(item.data[1])}${this.unit}`
                        })
                        return str;
                    },
                },
                grid: {
                    top: this.hasLegend ? 36 : 16,
                    left: this.hasyAxis ? 52 : 0,
                    right: 6,
                    bottom: this.hasZoom ? 38 : 8
                },
                dataZoom: [
                    {
                        type: "slider",
                        show: this.hasZoom,
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
                xAxis: {
                    type: 'time',
                    boundaryGap: true
                },
                yAxis: {
                    type: 'value'
                },
                series: []
            },
            //['#0098d9', '#2b821d', '#c12e34', '#e6b600', '#005eaa', '#339ca8', '#cda819', '#32a487']
            colors: ['#536fc4', '#91cc75', '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa', '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050', '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'],
            colorList: [
                {start: 'rgb(83, 111, 196)', end: 'rgba(83, 111, 196, .3)'},
                {start: 'rgb(145, 204, 117)', end: 'rgba(145, 204, 117, .3)'},
            ],
            seriesData: {
                name: '连接数',
                type: 'line',
                symbol: 'circle',
                symbolSize: 8,
                showSymbol: false,
                sampling: 'lttb',
                itemStyle: {},
                areaStyle: {},
                data: []
            },
            unit: '个',
            sortDesc: false
        }
    },
    mounted() {
        this.initData()
    },
    methods: {
        initData() {
            let type = this.type;
            const params = {
                dataType: type,
                dbId: this.searchData.dbId,
                startTime: this.searchData.startTime,
                endTime: this.searchData.endTime,
                dbType: this.searchData.dbType
            }
            this.option.series = [];
            ApiDatabase.trendData(params).then(result => {
                this.$emit('loadOver');
                // const result = res.data;
                if(result.status === 1) {
                    let max = 0;
                    let unit = 'B';
                    const size = result.data.length;
                    if(this.isBit) {
                        result.data.forEach((item, index) => {
                            max = item.max > max ? item.max : max;
                        })
                        unit = this.isFlow ? getMaxUnitByFlow(max * 8).unit : getMaxUnitByBit(max).unit;
                        this.unit = unit;
                    }
                    result.data.forEach((item,index) => {

                        let series = JSON.parse(JSON.stringify(this.seriesData))
                        series.name = item.key;
                        let color = '';
                        if(this.isFlow) {
                            color = this.colorList[index];
                            series.itemStyle.color = color.start;
                            series.areaStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: color.start
                            },
                            {
                                offset: 1,
                                color: color.end
                            }
                            ]);
                        } else {
                            color = this.colors[index];
                            series.itemStyle.color = color;
                        }
                        if(this.isBit) {
                            if(this.isFlow) {
                                item.avg *= 8;
                                item.current *= 8;
                                item.max *= 8;
                                item.min *= 8;
                            }
                            this.totalData.push({
                                avg: getValueByUnit(item.avg, unit) + this.unit, 
                                current: getValueByUnit(item.current, unit) + this.unit, 
                                max: getValueByUnit(item.max, unit) + this.unit, 
                                min: getValueByUnit(item.min, unit) + this.unit, 
                                key: item.key,
                                color: typeof(color) === 'string' ? color : color.start
                            })
                        } else {
                            this.totalData.push({
                                avg: (item.avg || 0) + this.unit, 
                                current: (item.current || 0) + this.unit, 
                                max: (item.max || 0) + this.unit, 
                                min: (item.min || 0) + this.unit, 
                                key: item.key,
                                color: typeof(color) === 'string' ? color : color.start
                            })
                        }
                        
                        if(this.hideArea) {
                            series.areaStyle.opacity = 0;
                        }
                        
                        const list = item.data;
                        if(this.stack) {
                            series.stack = 'Total';
                        }
                        let data = [];
                        if(this.isBit) {
                            // let max = list[0].value;
                            // list.forEach(item => max = item > max ? item : max);
                            
                            list.forEach((item, index) => {
                                if(this.isFlow) {
                                    item.value *= 8;
                                }
                                data.push([item.time, getValueByUnit(item.value, unit)]);
                            });
                        } else {
                            list.forEach(item => {
                                data.push([item.time, item.value]);
                            });
                        }
                        
                        series.data = data;
                        this.option.series.push(series);
                    })
                }
                this.drawChart();
            })
        },
        sortTable() {
            if(this.sortDesc) {
                this.totalData.sort((a, b) => parseFloat(a.avg) - parseFloat(b.avg));
            } else {
                this.totalData.sort((a, b) => parseFloat(b.avg) - parseFloat(a.avg));
            }
            this.sortDesc = !this.sortDesc;
        },
        drawChart() {
            this.option.yAxis.axisLabel = {
                //y轴设置为%
                show: true,
                interval: 'auto',
                formatter: `{value}${this.unit || '个'}`,
            };
            var myChart = echarts.init(document.getElementById(this.domId), 'theme');
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
    .chart-box{
        width: 100%;
        height: 240px;
    }
    .card-total-box{
        width: 100%;
        position: relative;
        height: 72px;
        margin-top: 8px;
    }
    .card-item-label{
        color: #006666;
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
    }
    .card-total-scroll{
        height: 48px;
        line-height: 24px;
        overflow-y: auto;
        position: absolute;
        top: 24px;
        left: 0;
        width: 100%;
    }
    .card-item:hover{
        background-color: #F0F7F7;
    }
    .card-item{
        display: flex;
        flex-direction: row;
        text-align: left;
        p{
            width: 80px;
            .name-lengend-line{
                width: 18px;
                height: 4px;
                border-radius: 2px;
                display: inline-block;
                vertical-align: middle;
                margin: 0 8px 0 32px;
            }
        }
        .card-item-avg{
            cursor: pointer;
            i{
                font-weight: bold;
                font-size: 12px;
                vertical-align: middle;
            }
        }
    }
</style>