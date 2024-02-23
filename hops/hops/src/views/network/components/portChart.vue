<template>
	<div class="trendChart">
		<p class="trendChart-title">
			<span>{{ title }}</span>
			<!-- <el-checkbox v-model="checked">仅看有流量的</el-checkbox> -->
		</p>
		<!-- <p class="trendChart-ip">10086（192.168.0.0）</p> -->
		<!-- <LargeChart></LargeChart> -->
		<p ref="multipleChart" class="p_chart"></p>
	</div>
</template>
<script>
import * as echarts from 'echarts'
export default {
	name: 'portChart',
	data() {
		return {
			checked: false,
			data: {
				name: 'name',
			},
			fluxData: [],
		}
	},
	components: {
		LargeChart: () => import('@/components/largeChart.vue'),
	},
	props: ['title', 'defaultData'],
	computed: {
		option() {
			return {
				title: {
					text: this.data.name,
					show: true,
					left: 'center',
					top: 15,
					textStyle: {
						color: '#fff',
						fontSize: 12,
						fontWeight: 'lighter',
					},
				},
				tooltip: {
					trigger: 'axis',
					formatter: (params) => {
						let unit = this.unit
						let str = `${params[0].axisValueLabel}`
						params.forEach((item) => {
							str += `<br/>${item.marker} ${item.seriesName}:${item.data[1]}${unit}`
						})
						return str
					},
				},
				grid: {
					left: 30,
					right: 50,
					top: 50,
					bottom: 40,
					containLabel: true,
				},
				calculable: true,
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
				xAxis: [
					{
						type: 'time',
						splitLine: {
							show: false,
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#828E9F',
								opacity: 0.5,
							},
						},
						axisLabel: {
							interval: 0,
							rotate: 0,
							textStyle: {
								color: '#828E9F',
								fontSize: 13,
							},
						},
						axisTick: { show: false },
						// formatter: (value, index) => {
						// 	return CommonFun.formatterTimeConversion({ beginTime: value / 1000 }, { label: '开始时间' })
						// },
					},
				],
				yAxis: [
					{
						type: 'value',
						name: '单位：' + this.unit,
						nameTextStyle: {
							color: '#ccc',
						},
						splitNumber: 5,
						splitLine: {
							show: true,
							lineStyle: {
								color: '#828E9F',
								opacity: 0.5,
							},
						},
						axisLine: {
							lineStyle: {
								color: '#828E9F',
								opacity: 0.5,
							},
						},
						axisLabel: {
							textStyle: {
								color: '#828E9F',
							},
						},
						axisTick: { show: false },
					},
				],
				series: [
					{
						name: '传输速率',
						type: 'line',
						symbolSize: 6,
						showSymbol: this.fluxData.length < 2,
						itemStyle: { normal: { color: '#22C3FF' } },
						data: this.fluxData,
						areaStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: 'rgba(34, 195, 255,.7)',
								},
								{
									offset: 1,
									color: 'rgba(255, 70, 131,.3)',
								},
							]),
						},
					},
				],
			}
		},
	},
	mounted() {
		this.setData()
	},
	methods: {
		setData() {
			// this.data.name = `${this.defaultData.name} ${this.defaultData.ip}`;
			const list = this.defaultData
			let maxVal = 0
			let unitNum = 1
			let iSpace = 1
			for (let i = 0; i < list.length; i += iSpace) {
				const size = list[i].inputSize + list[i].outputSize
				if (size > maxVal) {
					maxVal = size
				}
			}
			if (maxVal > 1024 * 1024 * 1024) {
				this.unit = 'Gbps'
				unitNum = 1024 * 1024 * 1024
			} else if (maxVal > 1024 * 1024) {
				this.unit = 'Mbps'
				unitNum = 1024 * 1024
			} else if (maxVal > 1024) {
				this.unit = 'Kbps'
				unitNum = 1024
			} else {
				this.unit = 'bps'
			}
			this.fluxData = []
			for (let i = 0; i < list.length; i += iSpace) {
				const size = (list[i].inputSize || 0) + (list[i].outputSize || 0)
				let item = [list[i].time * 1000, parseFloat((size / unitNum).toFixed(2))]
				this.fluxData.push(item)
			}
			// this.$nextTick(() => {
			this.init()
			// })
		},
		init() {
			let multipleChart = echarts.init(this.$refs.multipleChart)
			multipleChart.setOption(this.option)
		},
		resize() {
			echarts.init(this.$refs.multipleChart).resize()
		},
	},
}
</script>
<style scoped>
.trendChart {
	margin-bottom: 16px;
	padding: 16px;
	background: #ffffff;
	border-radius: 4px;
}
.trendChart-title {
	display: flex;
	justify-content: space-between;
	font-size: 18px;
	color: #282827;
}
.trendChart-ip {
	font-size: 14px;
	color: #282827;
	margin-bottom: 16px;
	margin-top: 16px;
}
.p_chart {
	height: 240px;
}
</style>