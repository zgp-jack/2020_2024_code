<template>
	<div :style="{width:'100%', height:height}">
        <div class="liquid-box">
            <div id="liquid1" ref="chart1"></div>
            <div id="liquid2" ref="chart2"></div>
        </div>
        <div class="liquid-legend">
            <span style="color: #799F9F;">CPU当前利用率</span>
            <span style="color: #D3B04C;">内存当前利用率</span>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts';
import 'echarts-liquidfill'
export default {
    props: {
        height: {
            style: String,
            default: '50%'
        },
        value1: {
            type: [Number, String],
            default: 0
        },
        value2: {
            type: [Number, String],
            default: 0
        }
    },
	data() {
		return {
            color: [
                {label: 'rgba(0, 120, 120, 1)', background: 'rgba(230, 239, 238, 1)', start: 'rgba(0, 101, 101, 1)', end: 'rgba(36, 167, 116, 1)'},
                {label: 'rgba(219, 161, 0, 1)', background: 'rgba(252, 247, 232, 1)', start: 'rgba(255, 189, 0, 1)', end: 'rgba(255, 150, 3, 1)'}
            ],
            option: {
                tooltip: {
                    trigger: 'item',
                    show: true,
                    appendToBody: true,
                    confine: true
                },
                series: [{
                    name: '内存当前利用率',
                    type: 'liquidFill',
                    radius: '140px',
                    data: [0.6],
                    label: {
                        normal: {
                            color: 'rgba(0, 120, 120, 1)',
                            insideColor: '#fff',
                            textStyle: {
                                fontSize: 32,
                            }
                        }
                    },
                    backgroundStyle: {   // 设置水球图内部背景色
                        color: 'rgba(230, 239, 238, 1)',//水球图内部背景色
                    },
                    color: [{
                        type: 'linear',
                        x: 0,
                        y: 1,
                        x2: 0,
                        y2: 0,
                        colorStops: [{
                            offset: 1,
                            color: ['rgba(0, 101, 101, 1)'], // 0% 处的颜色
                        }, {
                            offset: 0,
                            color: ['rgba(36, 167, 116, 1)'], // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }],
                    outline: {
                        show: true,
                        borderDistance: 0,
                        itemStyle: {
                            borderColor: '#fff',
                            borderWidth: 5,
                            shadowColor: 'rgba(0, 120, 120, 1)',
                            shadowBlur: 10,
                        }
                    }
                }]
            }
        }
	},
	mounted() {
		this.drawLiquidfill(0, this.value1);
        this.drawLiquidfill(1, this.value2);
	},
    beforeDestroy() {
        let myChart1 = echarts.init(this.$refs['chart1']);
        let myChart2 = echarts.init(this.$refs['chart2']);
        myChart1.dispose();
        myChart2.dispose();
    },
	methods: {
		drawLiquidfill(index, value) {
            value = parseFloat(value) / 100;
            let liquid = echarts.init(document.getElementById(index === 0 ? 'liquid1' : 'liquid2'));
            
            let options = JSON.parse(JSON.stringify(this.option));
            options.tooltip.formatter = function (params) { 
                console.log(params);
                return `${params.seriesName}:${(params.value * 100).toFixed(0)}%`;
            }
            options.series[0].name = index === 0 ? 'CPU当前利用率' : '内存当前利用率';
            options.series[0].label.normal.color = this.color[index].label;
            options.series[0].backgroundStyle.color = this.color[index].background;
            options.series[0].color[0].colorStops[0].color = this.color[index].start;
            options.series[0].color[0].colorStops[1].color = this.color[index].end;
            options.series[0].outline.itemStyle.shadowColor = this.color[index].label;
            options.series[0].data = [value];

            liquid.setOption(options);
  		}
 	}
}
</script>
<style lang="scss" scoped>
.liquid-box{
    display: flex;
    height: calc(100% - 48px);
    div{
        width: 50%;
        height: 100%;
    }
}
.liquid-legend{
    display: flex;
    span{
        width: 50%;
        height: 28px;
        line-height: 28px;
        font-size: 14px;
        display: inline-block;
        text-align: center;
    }
}
</style>