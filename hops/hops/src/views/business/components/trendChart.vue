<template>
	<div id="lineChart" ref="lineChart"></div>
	<!-- <div class="trendChart">
		<p class="trendChart-title">{{ title }}</p>
	</div> -->
</template>
<script>
import * as echarts from 'echarts'
export default {
	name: 'trendChart',
	components: {
		// LineChart: () => import('@/components/lineChart.vue'),
	},
	props: ['title', 'trendData'],
	computed: {
		option() {
			return {
				title: {
					text: '',
				},
				tooltip: {
					trigger: 'axis',
					// appendToBody: true,
					formatter: (params) => {
						let str = `${params[0].axisValueLabel}`
						params.forEach((item, index) => {
							str += `<br/>${item.marker} ${item.seriesName}: ${item.data[1] + '%'}`
						})
						return str
					},
				},
				legend: {},
				grid: {
					top: '12%',
					left: '3%',
					right: '4%',
					bottom: '12%',
					containLabel: true,
				},
				dataZoom: [
					{
						type: 'slider',
						show: true,
						realtime: true,
						backgroundColor: '#fff',
						borderColor: 'none',
						textStyle: {
							color: '#ccc',
						},
						start: 0,
						end: 100,
						height: 12,
						bottom: 8,
					},
				],
				xAxis: {
					type: 'time',
					boundaryGap: false,
				},
				yAxis: {
					type: 'value',
					axisLabel: {
						//y轴设置为%
						show: true,
						interval: 'auto',
						formatter: '{value} %',
					},
					max: 100, //最大值
					min: 0, //最小值
				},
				series: [],
			}
		},
	},
	mounted() {
		this.initTrend()
	},
	methods: {
		initTrend() {
			let series = []
			this.trendData.forEach((item) => {
				series.push({
					name: item[0],
					type: 'line',
					symbol: 'none',
					data: item[1],
				})
			})
			this.option.series = series
			let lineChart = echarts.init(this.$refs.lineChart)
			lineChart.setOption(this.option)
		},
		resize() {
			echarts.init(this.$refs.lineChart).resize()
		},
	},
	watch: {
		trendData(newV) {
			this.trendData = newV
			this.initTrend()
		},
	},
}
</script>
<style scoped>
.trendChart {
	margin-bottom: 16px;
	padding: 10px 16px;
	background: #ffffff;
	border-radius: 4px;
	overflow: hidden;
}
.trendChart:last-child {
	margin-bottom: 0;
}
.trendChart-title {
	font-size: 18px;
	color: #282827;
}
#lineChart {
	height: 240px;
}
</style>