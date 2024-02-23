
<template>
	<el-row class="network">
		<!-- <el-col class="network-left"> -->
		<LeftTable ref="leftTable" :tableHeader="tableHeader" class="table-left" :tableData="tableData" @rowClick="checkRow">
			<template v-slot:search>
				<div class="leftTable-search">
					<el-input class="search-input" placeholder="输入名称" prefix-icon="el-icon-search" v-model="searchData.name" />
					<el-date-picker
						class="search-picker"
						v-model="timeList"
						type="datetimerange"
						range-separator="-"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						@change="setSearchTime"
					>
					</el-date-picker>
					<div class="common-btn" @click="getList">查询</div>
					<p @click="toView" title="拓扑视图" class="network-togolog"><i class="el-icon-share"></i></p>
				</div>
			</template>
		</LeftTable>
		<!-- </el-col> -->
		<el-col class="network-main" id="networkMain">
			<div style="display: flex; justify-content: space-between">
				<p class="network-title">{{ currentTitle }}</p>
			</div>
			<el-row class="network-top" :gutter="16">
				<el-col :span="6">
					<div class="top-item">
						<p class="item-title">端口</p>
						<el-row class="item-text">
							<el-col :span="12">总数</el-col>
							<el-col :span="12"
								>在线<span class="item-num">{{ portData.filter((item) => item.value == 2).length || 0 }}个</span></el-col
							>
						</el-row>
						<el-row class="item-text">
							<el-col :span="12"
								><span class="item-sum">{{ portData.length || 0 }}</span
								>个</el-col
							>
							<el-col :span="12"
								>离线<span class="item-num">{{ portData.filter((item) => item.value == 1).length || 0 }}个</span></el-col
							>
						</el-row>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="top-item">
						<p class="item-title">风扇</p>
						<el-row class="item-text">
							<el-col :span="12">总数</el-col>
							<el-col :span="12">正常<span class="item-num">0个</span></el-col>
						</el-row>
						<el-row class="item-text">
							<el-col :span="12"><span class="item-sum">0</span>个</el-col>
							<el-col :span="12">异常<span class="item-num">0个</span></el-col>
						</el-row>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="top-item">
						<p class="item-title">设备情况</p>
						<el-row class="item-text">
							<el-col :span="8">温度</el-col>
							<el-col :span="8">CPU利用率</el-col>
							<el-col :span="8">内存利用率</el-col>
						</el-row>
						<el-row class="item-text">
							<el-col :span="8">
								<span class="item-sum">{{ tempValue }}</span
								>℃
							</el-col>
							<el-col :span="8">
								<span class="item-sum">{{ cpuValue }}</span
								>%
							</el-col>
							<el-col :span="8">
								<span class="item-sum">{{ memValue }}</span
								>%
							</el-col>
						</el-row>
					</div>
				</el-col>
			</el-row>
			<el-scrollbar class="network-scroll">
				<EchartCard :title="'CPU/内存'">
					<LineChart ref="cpu" v-if="trendData.memTrendData.length || trendData.cpuTrendData.length" :jvmData="trendData"></LineChart>
					<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
				</EchartCard>
				<!-- <EchartCard :title="'内存'">
					<LineChart ref="mem" v-if="memTrendData.length" :jvmData="memTrendData" :title="'内存'"></LineChart>
				</EchartCard> -->
				<EchartCard :title="'设备温度'">
					<LineChart ref="temp" v-if="tempTrendData.length" :jvmData="tempTrendData" :title="'设备温度'" :unit="'℃'"></LineChart>
					<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
				</EchartCard>
				<EchartCard :title="'端口流量'" :isHeight="true">
					<TableNetPort ref="port" :searchData="searchData" :listData="portList"></TableNetPort>
					<!-- <PortChart ref="port" v-if="portList.length" :defaultData="portList"></PortChart> -->
				</EchartCard>
			</el-scrollbar>
		</el-col>
		<WarnList class="network-right" v-if="businessId" :monitorTypeId="typeId" :businessId="businessId" :searchData="searchData"></WarnList>
	</el-row>
</template>
<script>
import { ApiNetworkList } from '@/api'
import { debounce } from '@/utils/util'
var elementResizeDetectorMaker = require('element-resize-detector')
export default {
	name: 'network',
	data() {
		const endTime = parseInt(new Date().getTime())
		const h = new Date().getHours() * 3600000
		const m = new Date().getMinutes() * 60000
		const s = new Date().getSeconds() * 1000
		const startTime = endTime - 86400000 - (h + m + s)
		return {
			tableHeader: [
				{ prop: 'name', label: '名称', width: 'undefined' },
				{ prop: 'typeName', label: '类型', width: 72 },
				{ prop: 'manufactor', label: '厂商' },
				{ prop: 'model', label: '型号' },
				{ prop: 'targetIp', label: 'snmp IP' },
				{ prop: 'alarm', label: '告警', width: 60 },
			],
			tableData: [],
			portList: [],
			portData: [],
			cpuTrendData: [],
			memTrendData: [],
			tempTrendData: [],
			cpuValue: 0,
			memValue: 0,
			tempValue: 0,
			timeList: [startTime, endTime],
			searchData: {
				startTime: startTime,
				endTime: endTime,
				name: '',
			},
			currentTitle: '',
			interTrendData: [],
			typeId: '',
			businessId: '',
			trendData: {
				cpuTrendData: [],
				memTrendData: [],
			},
		}
	},
	components: {
		LeftTable: () => import('@/components/leftTable.vue'),
		TrendChart: () => import('./components/trendChart.vue'),
		PortChart: () => import('./components/portChart.vue'),
		TableNetPort: () => import('./components/TableNetPort.vue'),
		WarnList: () => import('@/components/warnList.vue'),
		LineChart: () => import('./components/lineChart.vue'),
		EchartCard: () => import('./components/echartCard.vue'),
	},
	mounted() {
		// this.$store.state.ruleType.forEach((item) => {
		// 	if (item.typeName == '网络') {
		// 		this.typeId = item.id
		// 	}
		// })
		this.searchData.name = this.$route.query.name || ''
		this.getList()
		let erd = elementResizeDetectorMaker()
		erd.listenTo(document.getElementById('networkMain'), debounce(this.resizeFunc))
	},
	methods: {
		toView() {
			this.$router.push({ name: 'networkView' })
		},
		resizeFunc() {
			this.$nextTick(() => {
				this.$refs['cpu'] && this.$refs['cpu'].resize()
				this.$refs['mem'] && this.$refs['mem'].resize()
				this.$refs['temp'] && this.$refs['temp'].resize()
				this.$refs['port'] && this.$refs['port'].resize()
			})
		},
		setSearchTime() {
			this.searchData.startTime = this.timeList[0].getTime()
			this.searchData.endTime = this.timeList[1].getTime()
		},
		handleSearch() {
			this.getList()
		},
		checkRow(row) {
			this.currentTitle = row.name
			this.businessId = row.id
			this.typeId = row.type
			this.getPortData(row.id)
			this.getTrenData(row.id)
		},
		getTrenData(id) {
			let params = {
				// page: 1,
				// pageSize: 20,
				monitorId: id,
				...this.searchData,
			}
			this.trendData = {
				cpuTrendData: [],
				memTrendData: [],
			}
			this.tempTrendData = []
			this.cpuValue = 0
			this.memValue = 0
			this.tempValue = 0
			this.cpuTrendData = []
			this.memTrendData = []
			ApiNetworkList(`/network/device/histroy`, params).then((res) => {
				if (res.status == 1 && res.data.length) {
					let data = res.data
					let cpuData = []
					let memData = []
					let temData = []
					this.portData = data[data.length - 1].interfaceStatus || []
					data.forEach((item) => {
						if (item.cpuUsePercent) {
							cpuData.push({ time: item.time, value: item.cpuUsePercent })
						}
						if (item.memoryUsePercent) {
							memData.push({ time: item.time, value: item.memoryUsePercent })
						}
						if (item.temperature) {
							temData.push({ time: item.time, value: item.temperature })
						}
					})
					cpuData.forEach((item, ind) => {
						item.value.forEach((it, index) => {
							if (ind == 0) {
								this.cpuTrendData[index] = []
							}
							if (ind == cpuData.length - 1 && it.value > this.cpuValue) {
								this.cpuValue = it.value
							}
							this.cpuTrendData[index].push([item.time * 1000, it.value])
						})
					})
					memData.forEach((item, ind) => {
						item.value.forEach((it, index) => {
							if (ind == 0) {
								this.memTrendData[index] = []
							}
							if (ind == memData.length - 1 && it.value > this.memValue) {
								this.memValue = it.value
							}
							this.memTrendData[index].push([item.time * 1000, it.value])
						})
					})
					temData.forEach((item, ind) => {
						item.value.forEach((it, index) => {
							if (ind == 0) {
								this.tempTrendData[index] = []
							}
							if (ind == temData.length - 1 && it.value > this.tempValue) {
								this.tempValue = it.value
							}
							this.tempTrendData[index].push([item.time * 1000, it.value])
						})
					})
					// res.data.forEach((item, ind) => {
					// 	item.cpuUsePercent &&
					// 		item.cpuUsePercent.forEach((it, index) => {
					// 			if (ind == 0) {
					// 				this.cpuTrendData[index] = []
					// 			}
					// 			if (ind == res.data.length - 1 && it.value > this.cpuValue) {
					// 				this.cpuValue = it.value
					// 			}
					// 			this.cpuTrendData[index].push([item.time * 1000, it.value])
					// 		})
					// 	item.memoryUsePercent &&
					// 		item.memoryUsePercent.forEach((it, index) => {
					// 			if (ind == 0) {
					// 				this.memTrendData[index] = []
					// 			}
					// 			if (ind == res.data.length - 1 && it.value > this.memValue) {
					// 				this.memValue = it.value
					// 			}
					// 			this.memTrendData[index].push([item.time * 1000, it.value])
					// 		})
					// 	item.temperature &&
					// 		item.temperature.forEach((it, index) => {
					// 			if (ind == 0) {
					// 				this.tempTrendData[index] = []
					// 			}
					// 			if (ind == res.data.length - 1 && it.value > this.tempValue) {
					// 				this.tempValue = it.value
					// 			}
					// 			this.tempTrendData[index].push([item.time * 1000, it.value])
					// 		})
					// })
					this.trendData.cpuTrendData = this.cpuTrendData[0] || []
					this.trendData.memTrendData = this.memTrendData[0] || []
				}
			})
		},
		getPortData(id) {
			let params = {
				deviceId: id,
				// ...this.searchData,
			}
			// params.id = this.$route.params.id || null
			this.portList = []
			ApiNetworkList(`/network/device/interface/list`, params).then((res) => {
				if (res.status == 1) {
					this.portList = res.data || []
				}
			})
		},
		getList() {
			let params = {
				page: 1,
				pageSize: 9999,
				...this.searchData,
			}
			const netId = this.$route.params.id || this.$route.query.id
			this.tableData = []
			ApiNetworkList('/network/device/page', params).then((res) => {
				if (res.status == 1 && res.data.records.length) {
					this.tableData = res.data.records.map((item) => {
						const alarmNumRestored = (item.alarmGrages || []).filter((alarm) => alarm.status === 1).length
						item['alarmNumRestored'] = alarmNumRestored
						item['alarmNumNoRestored'] = (item.alarmGrages || []).length - alarmNumRestored
						return item
					})
					let index = 0
					if (!!netId) {
						index = this.tableData.findIndex((item) => item.id == netId);
						index = index === -1 ? 0 : index;
					}
					this.businessId = res.data.records[index].id
					this.typeId = res.data.records[index].type
					this.currentTitle = res.data.records[index].name
					this.getPortData(this.tableData[index].id)
					this.getTrenData(this.tableData[index].id)
					setTimeout(() => {
						this.$refs['leftTable'].handleCurrentChange(res.data.records[index])
					}, 1)
				}
			})
		},
	},
}
</script>
<style lang="scss" scoped>
.network {
	display: flex;
}
.network-left {
	// width: 500px;
	width: 28.93%;
	height: calc(100vh - 65px);
}
.network-main {
	flex: 1;
	// width: 828px;
	// width: 47.92%;
	padding: 16px 16px 16px 16px;
	min-width: 0;
}
.network-right {
	width: 384px;
	// width: 23.15%;
	height: calc(100vh - 65px) !important;
	padding: 16px 16px 16px 0;
}
.network-title {
	height: 32px;
	font-family: 'MicrosoftYaHeiUI-Bold';
	font-weight: 700;
	font-size: 24px;
	line-height: 32px;
	color: #282827;
	margin-bottom: 16px;
}
.network-scroll {
	height: calc(100vh - 291px);
	// height: calc(100vh - 275px);
	// height: calc(100vh - 149px);
}
.network-scroll .trendChart:last-child {
	margin-bottom: 0;
}
.network-top {
	margin-bottom: 16px;
}
.top-item {
	height: 130px;
	background: #ffffff;
	border-radius: 4px;
	padding: 16px;
}
.item-title {
	font-size: 18px;
	color: #282827;
	margin-bottom: 16px;
}
.item-text {
	display: flex;
	align-items: baseline;
	font-size: 14px;
	color: #799f9f;
}
.item-sum {
	margin-right: 4px;
	font-family: 'MicrosoftYaHeiUI-Bold';
	font-weight: 700;
	font-size: 28px;
	color: #006666;
}
.item-num {
	margin-left: 8px;
	font-size: 14px;
	color: #757e7e;
}
.table-left {
	border-top: 1px solid #f0f7f7;
	width: 500px;
	height: calc(100vh - 65px) !important;
	// background-color: #fff;
}
.leftTable-search {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.search-input {
	width: 100px !important;
}
.search-picker {
	width: 256px;
}
.common-btn {
	margin: 0;
}
.network-togolog {
	display: inline-block;
	width: 32px;
	height: 32px;
	text-align: center;
	border-radius: 4px;
	border: 1px solid #799f9f;
	background: #ffffff;
	cursor: pointer;
	color: #006666;
	font-size: 14px;
	line-height: 32px;
}
</style>