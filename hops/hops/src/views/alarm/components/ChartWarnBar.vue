<template>
    <div class="pie-box">
        <div :id="domId" class="chartWarnBar"></div>
        <div class="legend-box">
            <div class="lendgen-list" v-for="item,index in valList" @click="handleFilter(item)">
                <span class="legend-ball" :style="{'background-color': colorList[index]}"></span>
                <p>{{ item.name }}</p>
                <span class="legend-value">{{ item.value }}/{{ ((item.value / totalValue || 0) * 100).toFixed(2) }}%</span>
            </div>
        </div>
    </div>
</template>
<script>
import ApiAlarm from '@/api/alarm';
import * as echarts from 'echarts';
export default {
    name: 'chartWarnBar',
    props: {
        domId: {
            type: String
        },
        timeList: {
            type: Array
        },
        method: {
            type: String,
            default: 'type'
        }
    },
    data() {
        var emphasisStyle = {
            itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.3)'
            }
        };
        return {
            valList: [],
            colorList: ['#209BD9', '#FFD400', '#FF836B', '#1EC969'],
            option: {
                legend: {
                    show: false
                },
                toolbox: {
                    trigger: 'item',
                    show: true
                },
                color: ['#209BD9', '#FFD400', '#FF836B', '#1EC969'],
                // xAxis: {
                //     type: 'value',
                //     splitLine: {
                //         show: false
                //     }
                // },
                // yAxis: {
                //     type: 'category',
                //     data: [],
                //     show: false
                // },
                grid: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                },
                series: []
            },
            totalValue: 0,
            seriesData: {
                name: '',
                type: 'pie',
                radius: ['60%', '90%'],
                emphasis: emphasisStyle,
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                    show: true,
                    fontSize: 18,
                    fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: []
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
            this.totalValue = 0;
            // const typeStr = this.method === 'type' ? '告警类型' : '告警等级';
            // this.option.yAxis.data = [typeStr];
            ApiAlarm[this.method](params).then(res => {
                if(res.status === 1) {
                    const list = res.data;
                    this.option.series = [];
                    this.valList = [];
                    for(const item of list) {
                        this.valList.push({name: item.name, value: item.num});
                        this.totalValue += item.num;
                        // const seriesData = JSON.parse(JSON.stringify(this.seriesData));
                        // seriesData.name = item.name;
                        // seriesData.data = [item.num];
                        // seriesData.stack = typeStr;
                        if(item.num === 0) {
                            // seriesData.label.show = false;
                            // seriesData.labelLine.show = false;
                        }
                    }
                    const seriesData = JSON.parse(JSON.stringify(this.seriesData));
                    seriesData.data = this.valList;
                    this.option.series.push(seriesData);
                }
                this.drawChart();
            })
        },
        drawChart() {
            var myChart = echarts.init(document.getElementById(this.domId));
            myChart.setOption(this.option);
            myChart.on('click', params => {
                this.$emit('setFilter', params.data);
                console.log(params);
            })
        },
        handleFilter(item) {
            this.$emit('setFilter', item)
        }
    }
}
</script>
<style lang="scss" scoped>
.chartWarnBar{
    width: 50%;
    height: 100%;
}
.pie-box{
    display: flex;
    width: 100%;
    height: calc(100% - 36px);
}
.legend-box{
    flex: 1;
}
.lendgen-list {
    line-height: 30px;
    cursor: pointer;
    .legend-ball{
        width: 10px;
        height: 10px;
        border-radius: 10px;
        display: inline-block;
        margin-right: 4px;
    }
    p {
        color: #799F9F;
        font-size: 14px;
        display: inline-block;
        width: 60px;
    }
    .legend-value {
        font-size: 14px;
        color: #606266;
    }
}
</style>