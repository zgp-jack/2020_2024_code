<template>
	<div class="echartOld">
		<!-- <div class="card-total">
			<p>
				利用率：<span>{{ idle }}%</span>
			</p>
			<p>
				负载：<span>{{ load }}</span>
			</p>
			<p>
				温度：<span>{{ temperature }}℃</span>
			</p>
		</div> -->
		<div class="echartOld-main" ref="echartOld"></div>
	</div>
</template>
<script>
import * as echarts from 'echarts'
import ApiHost from '@/api/host'
export default {
	name: 'echartOld',
	props: ['jvmData'],
	data() {
		return {
			option: {
				tooltip: {
					trigger: 'axis',
					// position: function (pt) {
					// 	return [pt[0], '10%']
					// },
					// formatter: (params) => {
					// 	let str = `${params[0].axisValueLabel}`
					// 	params.forEach((item, index) => {
					// 		str += `<br/>${item.marker} ${item.seriesName}:${item.data[1].toFixed(0)}${index === 0 ? '%' : '℃'}`
					// 	})
					// 	return str
					// },
					// appendToBody: true,
				},
				grid: {
					top: 16,
					left: 42,
					right: 6,
					bottom: 40,
				},
				xAxis: {
					type: 'time',
					boundaryGap: false,
				},
				yAxis: [
					{
						position: 'left',
						type: 'value',
						// boundaryGap: [0, '100%'],
						max: 100, //最大值
						minInterval: 1,
						min: 0, //最小值
						interval: 25,
						axisLabel: {
							//y轴设置为%
							show: true,
							interval: 'auto',
							formatter: `{value} ${'%'}`,
						},
					},
					// {
					//     position:'right',
					//     type: 'value',
					//     boundaryGap: [0, '100%']
					// },
				],
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
				series: [
					{
						name: '使用率',
						type: 'line',
						symbol: 'none',
						sampling: 'lttb',
						itemStyle: {
							color: 'rgb(255, 70, 131)',
						},
						// areaStyle: {
						// 	color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						// 		{
						// 			offset: 0,
						// 			color: 'rgb(255, 158, 68)',
						// 		},
						// 		{
						// 			offset: 1,
						// 			color: 'rgb(255, 70, 131)',
						// 		},
						// 	]),
						// },
						data: [],
					},
				],
			},
		}
	},
	mounted() {
		this.initData()
	},
	methods: {
		initData() {
			this.jvmData.sort((a, b) => a[0] - b[0])
			this.option.series[0].data = this.jvmData
			// this.option.series[1].data = data2
			this.drawChart()
		},
		drawChart() {
			var myChart = echarts.init(this.$refs.echartOld)
			myChart.setOption(this.option)
		},
		resize() {
			echarts.init(this.$refs.echartOld).resize()
		},
	},
}
</script>
<style scoped>
.echartOld {
}
.echartOld-main {
	width: 100%;
	margin-top: 16px;
	height: 240px;
}
</style>