<template>
	<div style="position: absolute; width: calc(100% - 32px); height: calc(100% - 70px); margin-top: 16px">
		<el-table :data="listData" row-key="id" height="100%" @expand-change="handleOpenRow" @sort-change="sortChange" :expand-row-keys="expandRowKeys">
			<el-table-column prop="name" label="名称" align="center" show-overflow-tooltip> </el-table-column>
			<el-table-column prop="ip" label="IP" align="center" show-overflow-tooltip> </el-table-column>
			<el-table-column prop="portSpeed" label="实时流量" sortable align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					{{ getBit(scope.row.portSpeed) }}
				</template>
			</el-table-column>
			<el-table-column prop="standardBandWidth" label="参考带宽" sortable width="150" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					{{ getByBit(scope.row.standardBandWidth) }}
				</template>
			</el-table-column>
			<!-- <el-table-column prop="realityBandWidth" label="实际带宽（Kbps）" width="150" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					{{ getKb(scope.row.realityBandWidth) }}
				</template>
			</el-table-column> -->
			<el-table-column prop="statusName" label="状态" align="center" show-overflow-tooltip> </el-table-column>
			<el-table-column type="expand" label="操作" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<div :id="scope.row.id + 'NetChart'" class="net-row-chart" :ref="scope.row.id + 'NetChart'"></div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
<script>
import * as echarts from 'echarts'
import { ApiNetworkList } from '@/api'
import { getKbps, getMbps, getMaxUnitByFlow } from '@/utils/util'
export default {
	props: {
		listData: {
			type: Array,
			default: () => {
				return []
			},
		},
		searchData: {
			type: Object,
		},
	},
	data() {
		return {
			option: {
				legend: {
					type: 'scroll',
				},
				tooltip: {
					trigger: 'axis',
					// appendToBody: true,
					// position: function (pt) {
					// 	return [pt[0], '10%']
					// },
					// formatter: (params) => {
					// 	let str = `${params[0].axisValueLabel}`
					// 	params.forEach((item, index) => {
					// 		str += `<br/>${item.marker} ${item.seriesName}:${item.data[1]}${item.data[2]}`
					// 	})
					// 	return str
					// },
				},
				grid: {
					top: 32,
					left: 68,
					right: 32,
					bottom: 40,
				},
				xAxis: {
					type: 'time',
					boundaryGap: false,
				},
				yAxis: {
					type: 'value',
					axisLabel: {
						show: true,
						interval: 'auto',
					},
					min: 0, //最小值
				},
				dataZoom: [
					{
						type: 'slider',
						show: true,
						realtime: true,
						backgroundColor: '#fff',
						// fillerColor: '#145B58',
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
						name: '上行速率',
						type: 'line',
						stack: '堆叠',
						symbol: 'none',
						sampling: 'lttb',
						areaStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: 'rgb(83, 111, 196)',
								},
								{
									offset: 1,
									color: 'rgba(83, 111, 196, .3)',
								},
							]),
						},
						data: [],
						areaStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
										offset: 0,
										color: 'rgb(83, 111, 196)',
								},
								{
										offset: 1,
										color: 'rgba(83, 111, 196, .3)',
								},
							]),
						},
					},
					{
						name: '下行速率',
						stack: '堆叠',
						type: 'line',
						symbol: 'none',
						sampling: 'lttb',
						areaStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: 'rgba(145, 204, 117, .3)',
								},
								{
									offset: 1,
									color: 'rgb(145, 204, 117)',
								},
							]),
						},
						// yAxisIndex: 1,
						data: [],
						areaStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
										offset: 0,
										color: 'rgba(145, 204, 117, .3)',
								},
								{
										offset: 1,
										color: 'rgb(145, 204, 117)',
								},
							]),
						},
					},
				],
			},
			expandRowKeys: [],
		}
	},
	mounted() {},
	methods: {
		sortChange() {
			this.expandRowKeys = []
		},
		getKb(val) {
			return getKbps(val, 1000).num
		},
		getByBit(val) {
			let bit = getMbps(val, 1000)
			return bit.num + bit.unit
		},
		getBit(val) {
			let bit = getMaxUnitByFlow(val)
			return bit.num + bit.unit
		},
		getList(deviceId, interfaceIndex, id) {
			let data1 = []
			let data2 = []
			const params = {
				monitorId: deviceId,
				interIndex: interfaceIndex,
				startTime: this.searchData.startTime,
				endTime: this.searchData.endTime,
			}
			ApiNetworkList(`/network/device/histroy/interface`, params).then((res) => {
				if (res.status == 1) {
					const list = res.data || []
					let maxVal = 0
					let unitNum = 1
					let unit = ''
					for (let i = 0; i < list.length; i++) {
						let inputSize = list[i].inputSize || 0
						let outputSize = list[i].outputSize || 0
						const size = inputSize > outputSize ? inputSize : outputSize
						if (size > maxVal) {
							maxVal = size
						}
					}
					if (maxVal > 1024 * 1024 * 1024) {
						unit = 'Gbps'
						unitNum = 1024 * 1024 * 1024
					} else if (maxVal > 1024 * 1024) {
						unit = 'Mbps'
						unitNum = 1024 * 1024
					} else if (maxVal > 1024) {
						unit = 'Kbps'
						unitNum = 1024
					} else {
						unit = 'bps'
					}
					list.forEach((item) => {
						data1.push([item.time * 1000, parseFloat(((item.outputSize || 0) / unitNum).toFixed(2)), unit])
						data2.push([item.time * 1000, parseFloat(((item.inputSize || 0) / unitNum).toFixed(2)), unit])
					})
					this.option.yAxis.name = '单位：' + unit
					this.option.series[0].data = data1
					this.option.series[1].data = data2
					// this.option.series[1].data = data2
					this.drawChart(id + 'NetChart')
				}
			})
		},
		drawChart(id) {
			var myChart = echarts.init(document.getElementById(id))
			myChart.setOption(this.option)
		},
		handleOpenRow(row, expand) {
			let id = ''
			expand.forEach((item) => {
				if (item.id == row.id) {
					id = row.id
				}
			})
			if (id) {
				this.getList(row.deviceId, row.interfaceIndex, row.id)
			}
		},
		resize() {
			let ref = this.$refs
			for (let key in ref) {
				if (ref[key]) {
					echarts.init(ref[key]).resize()
				}
			}
		},
	},
}
</script>
<style scoped lang="scss">
.net-row-chart {
	height: 180px;
}
</style>