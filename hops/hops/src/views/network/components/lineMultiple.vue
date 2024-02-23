<template>
	<div style="width: 100%" :style="{ height: height }">
		<slot name="title"></slot>
		<div class="LineChart" :id="domId" ref="chart"></div>
	</div>
</template>
<script>
import * as echarts from 'echarts'
import { hexToRgba } from '@/utils/util'
export default {
	name: 'lineMultiple',
	props: {
		domId: {
			type: String,
			default: 'lineCpu',
		},
		height: {
			type: String,
			default: '100%',
		},
		seriesData: {
			type: Array,
			default: () => {
				return []
			},
		},
		unit: {
			type: String,
			default: 'b',
		},
		isShowZoom: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			colorList: [
				'#006666',
				'#FFBC00',
				'#FF836B',
				'#536fc4',
				'#91cc75',
				'#2ec7c9',
				'#b6a2de',
				'#5ab1ef',
				'#ffb980',
				'#d87a80',
				'#8d98b3',
				'#e5cf0d',
				'#97b552',
				'#95706d',
				'#dc69aa',
				'#07a2a4',
				'#9a7fd1',
				'#588dd5',
				'#f5994e',
				'#c05050',
				'#59678c',
				'#c9ab00',
				'#7eb00a',
				'#6f5553',
				'#c14089',
			],
			seriesObj: {
				name: '',
				type: 'line',
				symbol: 'circle',
				symbolSize: 8,
				showSymbol: false,
				// sampling: 'average',
				// smooth: 1,
				// smoothMonotone: 'x',
				areaStyle: {},
				itemStyle: {},
				data: [],
			},
			option: {
				legend: {
					type: 'scroll',
					icon: 'roundRect',
					itemWidth: 8,
					itemHeight: 8,
					show: true,
					align: 'left',
				},
				tooltip: {
					trigger: 'axis',
					formatter: (params) => {
						let str = `${params[0].axisValueLabel}`
						params.forEach((item, index) => {
							str += `<br/>${item.marker} ${item.seriesName}:${item.data[1]}${this.unit}`
						})
						return str
					},
					appendToBody: true,
				},
				grid: {
					top: 32,
					left: 42,
					right: 6,
					bottom: this.isShowZoom ? 40 : 20,
				},
				xAxis: {
					type: 'time',
					boundaryGap: false,
					axisLabel: {
						interval: 12,
						formatter: '{HH}',
					},
				},
				yAxis: [
					{
						type: 'value',
						splitLine: {
							show: false,
						},
						axisLabel: {
							//y轴设置为%
							show: true,
							interval: 'auto',
							formatter: `{value} ${this.unit}`,
						},
						minInterval: 1,
						// max: 100, //最大值
						min: 0, //最小值
						// interval: 25,
					},
				],
				dataZoom: [
					{
						type: 'slider',
						show: this.isShowZoom,
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
				series: [],
			},
		}
	},
	mounted() {
		this.initData()
	},
	beforeDestroy() {
		let myChart = echarts.init(this.$refs['chart'])
		myChart.dispose()
	},
	methods: {
		initData() {
			if (this.seriesData.length) {
				let seriesData = []
				this.seriesData.forEach((item, index) => {
					let series = JSON.parse(JSON.stringify(this.seriesObj))
					// const color = hexToRgba(colorList[params.dataIndex]);
					const color = this.colorList[index]
					series.itemStyle.color = color
					series.areaStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{
							offset: 0,
							color: color,
						},
						{
							offset: 0.9,
							color: 'rgba(255, 255, 255, .1)',
						},
					])
					series.data = item.data
					series.name = item.name
					seriesData.push(series)
				})
				this.option.series = seriesData
			}
			this.drawChart()
		},
		drawChart() {
			let myChart = echarts.init(document.getElementById(this.domId))
			myChart.clear()
			myChart.setOption(this.option)
		},
		resize() {
			echarts.init(document.getElementById(this.domId)).resize()
		},
	},
}
</script>
<style scoped>
.LineChart {
	width: 100%;
	height: calc(100% - 23px);
}
</style>