<template>
	<div class="echartOld">
		<!-- <p class="trendChart-title">{{ title }}</p> -->
		<div class="echartOld-main" :style="{ height: height + 'px' }" ref="echartLine"></div>
	</div>
</template>
<script>
import * as echarts from 'echarts'
export default {
	name: 'lineChart',
	props: {
		height: {
			type: Number,
			default: 240,
		},
		jvmData: {},
		title: {
			type: String,
		},
		unit: {
			type: String,
			default: '%',
		},
	},
	data() {
		return {
			option: {
				tooltip: {
					trigger: 'axis',
					formatter: (params) => {
						let str = `${params[0].axisValueLabel}`
						params.forEach((item, index) => {
							str += `<br/>${item.marker}${item.seriesName}:${item.data[1]}${this.unit}`
						})
						return str
					},
					// appendToBody: true,
				},
				grid: {
					top: '25',
					left: '0%', //默认10%
					right: '0%', //默认10%
					bottom: this.height == 140 ? '10' : '20', //默认60
					containLabel: true,
				},
				xAxis: {
					type: 'time',
					// boundaryGap: false,
					show: this.height == 140 ? false : true,
				},
				yAxis: {
					type: 'value',
					axisLabel: {
						//y轴设置为%
						show: true,
						interval: 'auto',
						formatter: `{value} ${this.unit}`,
					},
					minInterval: 1,
					max: 100, //最大值
					min: 0, //最小值
					interval: 25,
				},
				dataZoom: [
					{
						type: 'slider',
						show: true,
						realtime: true,
						backgroundColor: 'rgba(185, 222, 214, 0.4)',
						borderColor: 'none',
						fillerColor: 'rgba(185, 222, 214, 1)',
						textStyle: {
							color: '#ccc',
						},
						start: 0,
						end: 100,
						height: 12,
						bottom: 8,
					},
				],
			},
			keyOption: {
				cpuTrendData: 'cpu',
				memTrendData: '内存',
			},
		}
	},
	mounted() {
		this.initData()
	},
	methods: {
		initData() {
			let series = []
			if (Array.isArray(this.jvmData)) {
				this.jvmData.forEach((item, index) => {
					series.push({
						name: this.title + (this.jvmData.length == 1 ? '' : index + 1),
						type: 'line',
						symbol: 'none',
						sampling: 'lttb',
						smooth: true,
						data: item,
						itemStyle: {
							// color: 'rgb(255, 70, 131, .5)',
						},
					})
				})
				this.option.legend = {
					type: 'scroll',
					show: this.jvmData.length > 1,
				}
			} else {
				for (let key in this.jvmData) {
					const list = this.jvmData[key]
					series.push({
						name: this.keyOption[key],
						type: 'line',
						symbol: 'none',
						sampling: 'lttb',
						smooth: true,
						data: list,
					})
				}
				this.option.legend = {
					type: 'scroll',
				}
			}
			this.option.series = series
			this.drawChart()
		},
		drawChart() {
			var myChart = echarts.init(this.$refs.echartLine)
			myChart.setOption(this.option)
		},
		resize() {
			echarts.init(this.$refs.echartLine).resize()
		},
	},
}
</script>
<style scoped>
.echartOld {
	margin-bottom: 16px;
	/* padding: 16px; */
	background: #ffffff;
	border-radius: 4px;
}
.trendChart-title {
	font-size: 18px;
	color: #282827;
}
.echartOld-main {
	width: 100%;
	margin-top: 16px;
	/* height: 142px; */
}
</style>