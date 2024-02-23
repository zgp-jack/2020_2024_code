<template>
	<div class="echartOld">
		<div class="echartOld-main" :style="{ height: height + 'px' }" ref="echartLine"></div>
	</div>
</template>
<script>
import * as echarts from 'echarts'
import ApiHost from '@/api/host'
export default {
	name: 'echartLine',
	props: ['jvmData', 'height', 'unit'],
	data() {
		return {
			nameOption: {
				sendList: '发送数据',
				receivedList: '接受数据',
				errorList: '错误数',
				requestList: '请求数',
				totalList: '总数',
				historyList: '历史数',
				currentList: '当前数',
				activeThread: '当前活跃',
				busyThread: '当前繁忙',
				maxThread: '最大线程',
			},
		}
	},
	computed: {
		option() {
			return {
				tooltip: {
					trigger: 'axis',
					formatter: (params) => {
						let str = `${params[0].axisValueLabel}`
						params.forEach((item, index) => {
							str += `<br/>${item.marker} ${item.seriesName}:${item.data[1]}${item.data[2] || ''}`
						})
						return str
					},
				},
				grid: {
					top: '40',
					left: '3%', //默认10%
					right: '4%', //默认10%
					bottom: '12%', //默认60
					containLabel: true,
				},
				xAxis: {
					type: 'time',
					boundaryGap: false,
				},
				yAxis: {
					type: 'value',
					// boundaryGap: [0, '100%'],
					name: '单位：' + this.unit,
					minInterval: 1,
					min: 0, //最小值
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
			}
		},
	},
	mounted() {
		this.initData()
	},
	methods: {
		initData() {
			if (Array.isArray(this.jvmData)) {
				const list = this.jvmData
				// let maxVal = 0
				// let unitNum = 1
				// let iSpace = 1
				// for (let i = 0; i < list.length; i += iSpace) {
				// 	const size = list[i][1]
				// 	if (size > maxVal) {
				// 		maxVal = size
				// 	}
				// }
				// if (maxVal > 1024 * 1024 * 1024) {
				// 	this.unit = 'Gbps'
				// 	unitNum = 1024 * 1024 * 1024
				// } else if (maxVal > 1024 * 1024) {
				// 	this.unit = 'Mbps'
				// 	unitNum = 1024 * 1024
				// } else if (maxVal > 1024) {
				// 	this.unit = 'Kbps'
				// 	unitNum = 1024
				// } else {
				// 	this.unit = 'bps'
				// }
				// let fluxData = []
				// for (let i = 0; i < list.length; i += iSpace) {
				// 	const size = list[i][1]
				// 	let item = [list[i][0], parseFloat((size / unitNum).toFixed(2))]
				// 	fluxData.push(item)
				// }
				this.option.series = [
					{
						name: '连接数',
						type: 'line',
						symbol: 'none',
						sampling: 'lttb',
						smooth: true,
						itemStyle: {
							color: 'rgba(31, 120, 193,.7)',
						},
						// areaStyle: {
						// 	color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						// 		{
						// 			offset: 0,
						// 			color: 'rgba(31, 120, 193, .7)',
						// 		},
						// 		{
						// 			offset: 1,
						// 			color: 'rgba(31, 120, 193, .5)',
						// 		},
						// 	]),
						// },
						data: list,
					},
				]
			} else {
				let series = []
				for (let key in this.jvmData) {
					const list = this.jvmData[key]
					// let maxVal = 0
					// let unitNum = 1
					// let iSpace = 1
					// for (let i = 0; i < list.length; i += iSpace) {
					// 	const size = list[i][1]
					// 	if (size > maxVal) {
					// 		maxVal = size
					// 	}
					// }
					// if (maxVal > 1024 * 1024 * 1024) {
					// 	this.unit = 'Gbps'
					// 	unitNum = 1024 * 1024 * 1024
					// } else if (maxVal > 1024 * 1024) {
					// 	this.unit = 'Mbps'
					// 	unitNum = 1024 * 1024
					// } else if (maxVal > 1024) {
					// 	this.unit = 'Kbps'
					// 	unitNum = 1024
					// } else {
					// 	this.unit = 'bps'
					// }
					// let fluxData = []
					// for (let i = 0; i < list.length; i += iSpace) {
					// 	const size = list[i][1]
					// 	let item = [list[i][0], parseFloat((size / unitNum).toFixed(2))]
					// 	fluxData.push(item)
					// }
					series.push({
						name: this.nameOption[key],
						type: 'line',
						symbol: 'none',
						sampling: 'lttb',
						smooth: true,
						data: list,
						// itemStyle: {
						// 	color: 'rgb(255, 70, 131, .5)',
						// },
						// areaStyle: {
						// 	color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						// 		{
						// 			offset: 0,
						// 			color: 'rgb(255, 158, 68, .5)',
						// 		},
						// 		{
						// 			offset: 1,
						// 			color: 'rgb(255, 70, 131, .5)',
						// 		},
						// 	]),
						// },
					})
				}
				this.option.series = series
				this.option.legend = {}
			}
			// this.option.series[1].data = data2
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
	position: relative;
	margin-top: -16px;
}
.echartOld-main {
	width: 100%;
	margin-top: 16px;
	/* height: 142px; */
}
</style>