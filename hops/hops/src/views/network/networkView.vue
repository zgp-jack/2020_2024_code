<template>
	<div class="networkview warnList-main">
		<div class="networkview-left">
			<div class="networkview-list">
				<p @click="toView" title="列表视图" class="networkview-btn"><i class="el-icon-date"></i>列表视图</p>
			</div>
			<p class="networkview-list-title">{{ baseInfo.name || '设备情况排名' }}</p>
			<div v-if="monitorId" class="network-left-content-click">
				<div class="networkview-left-content-item networkview-top">
					<p class="networkview-left-title">基本信息</p>
					<div class="tooltip-txt">
						<p class="tooltip-txt-item">
							<span class="item-title">名称：　</span><span>{{ baseInfo.name || '-' }}</span>
						</p>
						<p class="tooltip-txt-item">
							<span class="item-title">厂商：　</span><span>{{ baseInfo.manufactor || '-' }}</span>
						</p>
						<p class="tooltip-txt-item">
							<span class="item-title">型号：　</span><span>{{ baseInfo.model || '-' }}</span>
						</p>
						<p class="tooltip-txt-item">
							<span class="item-title">地址：　</span><span>{{ baseInfo.targetIp || '-' }}</span>
						</p>
						<p class="tooltip-txt-item">
							<span class="item-title">位置：　</span><span>{{ baseInfo.position || '-' }}</span>
						</p>
					</div>
				</div>
				<div class="networkview-left-content-item networkview-bottom">
					<div class="networkview-left-cpu-title">
						<p class="networkview-left-title margin-bottom">CPU/内存</p>
						<!-- <p>
							<span class="networkview-cpu-title-margin">CPU利用率<span class="networkview-cpu-title-value">15%</span></span>
							<span>内存利用率<span class="networkview-cpu-title-value">26%</span></span>
						</p> -->
						<div class="tooltip-cpu-top">
							<div class="tooltip-title-use">
								<span class="use-margin"
									>CPU利用率 <span class="use-item">{{ cpuValue }}%</span></span
								>
								<span
									>内存利用率 <span class="use-item">{{ memValue }}%</span></span
								>
							</div>
						</div>
					</div>
					<div class="line-chart">
						<LineChart ref="cpuT" v-if="trendData.memTrendData.length || trendData.cpuTrendData.length" :height="380" :jvmData="trendData"></LineChart>
					</div>
				</div>
			</div>
			<div v-else class="network-left-content">
				<div class="networkview-left-item">
					<p class="networkview-left-title">CPU利用率</p>
					<el-scrollbar v-if="listCpu.length" class="networkview-scrollbar">
						<Bar :tableData="listCpu"></Bar>
					</el-scrollbar>
					<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
				</div>
				<div class="networkview-left-item">
					<p class="networkview-left-title">内存利用率</p>
					<el-scrollbar v-if="listMem.length" class="networkview-scrollbar">
						<Bar :tableData="listMem"></Bar>
					</el-scrollbar>
					<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
				</div>
				<div class="networkview-left-item">
					<p class="networkview-left-title">温度</p>
					<el-scrollbar v-if="listTemp.length" class="networkview-scrollbar">
						<Bar :tableData="listTemp"></Bar>
					</el-scrollbar>
					<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
				</div>
			</div>
		</div>
		<div class="networkview-main">
			<p class="large-label">
				{{ planName }}
				<el-select v-model="planId" class="large-label-append" @change="changePlan">
					<el-option v-for="item in planList" :key="item.id" :value="item.id" :label="item.name"></el-option>
				</el-select>
			</p>
			<div class="network-main-togolog">
				<TogologView ref="togolog" v-if="planId" :type="1" :planId="planId" @setWarn="getWarn"></TogologView>
			</div>
			<div class="network-main-warn">
				<div class="network-main-warn-list">
					<WarnList
						v-if="planId"
						style="flex: 1; min-height: 0"
						:searchData="searchData"
						:planId="planId"
						:typeId="typeId"
						:businessId="businessId"
						:monitorTypeId="monitorTypeId"
						:showTop="false"
						:showFilter="false"
						:showIcon="true"
					></WarnList>
				</div>
			</div>
		</div>
		<div class="networkview-right">
			<div v-if="monitorId" class="network-right-content-click">
				<div class="networkview-left-content-item networkview-right-top networkview-right-margin">
					<p class="networkview-left-title">端口信息</p>
					<div class="tooltip-cpu-top">
						<span>
							<span class="use-margin"
								>端口 <span class="use-item">{{ portList.length || 0 }}个</span></span
							>
							<span class="use-margin"
								>在线 <span class="use-item">{{ portList.filter((item) => item.status == 1).length || 0 }}个</span></span
							>
							<span
								>离线 <span class="use-item">{{ portList.filter((item) => item.status != 1).length || 0 }}个</span></span
							>
						</span>
					</div>
					<el-scrollbar class="scrollbar-port">
						<div class="tooltip-cpu-top" v-for="item in portList" :key="item.id">
							<div class="tooltip-prot-item" :title="item.name">
								<p class="use-item-name">{{ item.name }}</p>
								<p class="use-font-ip">{{ item.ip }}</p>
							</div>
							<span class="tooltip-prot-item" :title="getByBit(item.standardBandWidth)"
								>参考带宽： <span class="use-item">{{ getByBit(item.standardBandWidth) }}</span></span
							>
							<span class="tooltip-prot-item" :title="getBit(item.portSpeed)"
								>实时流量： <span class="use-item">{{ getBit(item.portSpeed) }}</span></span
							>
						</div>
					</el-scrollbar>
				</div>
				<div class="networkview-left-content-item networkview-bottom">
					<p class="networkview-left-title">设备温度</p>
					<div class="tooltip-cpu-top">
						<span
							>当前温度 <span class="use-item">{{ tempValue }}°C</span></span
						>
						<span>
							<span class="use-margin">风扇 <span class="use-item">0个</span></span>
							<span class="use-margin">正常 <span class="use-item">0个</span></span>
							<span>异常 <span class="use-item">0个</span></span>
						</span>
					</div>
					<LineChart ref="temp" v-if="tempTrendData.length" :height="350" :jvmData="tempTrendData" :title="'设备温度'" :unit="'℃'"></LineChart>
					<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
				</div>
			</div>
			<div v-else class="networkview-right-default">
				<div class="networkview-left-item networkview-right-margin">
					<p class="networkview-left-title">CPU利用率</p>
					<LineMultipleChart
						ref="cpu"
						v-if="cpuTrendData.length"
						:seriesData="cpuTrendData"
						:isShowZoom="true"
						:unit="'%'"
						:domId="'cpuMulLine'"
						:height="'210px'"
					></LineMultipleChart>
					<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
				</div>
				<div class="networkview-left-item">
					<p class="networkview-left-title">内存利用率</p>
					<LineMultipleChart
						ref="mem"
						v-if="memTrendData.length"
						:seriesData="memTrendData"
						:isShowZoom="true"
						:unit="'%'"
						:domId="'memMulLine'"
						:height="'210px'"
					></LineMultipleChart>
					<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
				</div>
				<div class="networkview-left-item">
					<p class="networkview-left-title">温度</p>
					<LineMultipleChart
						ref="tem"
						v-if="temTrendData.length"
						:seriesData="temTrendData"
						:isShowZoom="true"
						:unit="'℃'"
						:domId="'temMulLine'"
						:height="'210px'"
					></LineMultipleChart>
					<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { ApiNetworkList } from '@/api'
import ApiLargeScreen from '@/api/large'
import { getMbps, getMaxUnitByFlow } from '@/utils/util'
export default {
	name: 'networkView',
	components: {
		TogologView: () => import('@/components/togologView.vue'),
		Bar: () => import('../largeScreen/components/bar.vue'),
		WarnList: () => import('@/components/warnList.vue'),
		LineChart: () => import('@/views/network/components/lineChart.vue'),
		LineMultipleChart: () => import('./components/lineMultiple.vue'),
	},
	data() {
		const endTime = parseInt(new Date().getTime())
		const h = new Date().getHours() * 3600000
		const m = new Date().getMinutes() * 60000
		const s = new Date().getSeconds() * 1000
		const startTime = endTime - 86400000 - (h + m + s)
		return {
			searchData: {
				startTime: startTime,
				endTime: endTime,
			},
			planList: [],
			status: [0, 1],
			checkList: [3, 2, 1],
			currentPage: 1,
			planId: '',
			planName: '',
			monitorId: '',
			businessId: undefined,
			typeId: '',
			monitorTypeId: undefined,
			listCpu: [],
			listMem: [],
			listTemp: [],
			searchWarn: {},
			tempTrendData: [],
			temTrendData: [],
			memTrendData: [],
			cpuTrendData: [],
			baseInfo: {},
			portList: [],
			cpuValue: 0,
			memValue: 0,
		}
	},
	mounted() {
		this.getPlanList()
	},
	methods: {
		getByBit(val) {
			let bit = getMbps(val, 1000)
			return bit.num + bit.unit
		},
		getBit(val) {
			let bit = getMaxUnitByFlow(val)
			return bit.num + bit.unit
		},
		getWarn(warn) {
			let $this = this
			$this.baseInfo = {}
			this.typeId = String(warn.monitorId) + String(warn.monitorType) || ''
			this.businessId = warn.monitorId || ''
			this.monitorTypeId = warn.monitorType
			if (warn.nodeName && warn.nodeName == 'other') {
				this.monitorId = ''
			} else if (warn.monitorId) {
				this.monitorId = warn.monitorId || ''
				let params1 = {
					id: warn.monitorId,
					...this.searchData,
				}
				ApiNetworkList('/network/device/list', params1).then((res) => {
					if (res.status == 1) {
						$this.baseInfo = res.data[0] || {}
					}
				})
				let params2 = {
					monitorId: warn.monitorId,
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
				let cpuTrendData = []
				let memTrendData = []
				ApiNetworkList('/network/device/histroy', params2).then((res) => {
					if (res.status == 1 && res.data.length) {
						let data = res.data
						let cpuData = []
						let memData = []
						let temData = []
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
									cpuTrendData[index] = []
								}
								if (ind == cpuData.length - 1 && it.value > this.cpuValue) {
									this.cpuValue = it.value
								}
								cpuTrendData[index].push([item.time * 1000, it.value])
							})
						})
						memData.forEach((item, ind) => {
							item.value.forEach((it, index) => {
								if (ind == 0) {
									memTrendData[index] = []
								}
								if (ind == memData.length - 1 && it.value > this.memValue) {
									this.memValue = it.value
								}
								memTrendData[index].push([item.time * 1000, it.value])
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
						this.trendData.cpuTrendData = cpuTrendData[0] || []
						this.trendData.memTrendData = memTrendData[0] || []
					}
				})
				let params3 = {
					deviceId: warn.monitorId,
				}
				this.portList = []
				ApiNetworkList(`/network/device/interface/list`, params3).then((res) => {
					if (res.status == 1) {
						this.portList = res.data || []
					}
				})
			} else {
				this.businessId = undefined
				this.monitorId = ''
				this.monitorTypeId = undefined
				this.typeId = ''
			}
		},
		toView() {
			this.$router.push({ name: 'network' })
		},
		changeLevel() {
			this.currentPage = 1
			this.getList()
		},
		changePlan(val) {
			let selectVal = this.planList.filter((item) => item.id == val)
			this.planId = selectVal[0].id
			this.planName = selectVal[0].name
			this.businessId = undefined
			this.monitorId = ''
			this.monitorTypeId = undefined
			this.typeId = ''
			this.baseInfo = {}
			this.$refs['togolog'] && this.$refs['togolog'].clearSelect()
			this.getBusinessMem()
			this.getBusinessCpu()
			this.getBusinessTem()
			this.getBusinessCpuTrend()
			this.getBusinessMemTrend()
			this.getBusinessTemTrend()
		},
		getPlanList() {
			let params = {
				page: 1,
				pageSize: 20,
				name: '',
				type: 1,
			}
			this.planList = []
			ApiNetworkList('/top/plan/page', params).then((res) => {
				let data = res.data.records || []
				if (res.status == 1) {
					this.planList = data
					this.planId = data[0].id
					this.planName = data[0].name
					this.getBusinessMem()
					this.getBusinessCpu()
					this.getBusinessTem()
					this.getBusinessCpuTrend()
					this.getBusinessMemTrend()
					this.getBusinessTemTrend()
				}
			})
		},
		getBusinessCpuTrend() {
			const params = {
				...this.searchData,
				id: this.planId,
			}
			this.cpuTrendData = []
			ApiLargeScreen.cpuTrend(params).then((res) => {
				if (res.status === 1) {
					let data = res.data || {}
					for (let key in data) {
						// let cpuTrendData = []
						// data[key].forEach((item) => {
						// 	cpuTrendData.push([item.time, item.value])
						// })
						this.cpuTrendData.push({ name: key, data: data[key] })
					}
				}
			})
		},
		getBusinessTemTrend() {
			const params = {
				...this.searchData,
				id: this.planId,
			}
			this.temTrendData = []
			ApiLargeScreen.temTrend(params).then((res) => {
				if (res.status === 1) {
					let data = res.data || {}
					for (let key in data) {
						// let temTrendData = data[key]
						// data[key].forEach((item) => {
						// 	temTrendData.push([item.time, item.value])
						// })
						this.temTrendData.push({ name: key, data: data[key] })
					}
				}
			})
		},
		getBusinessMemTrend() {
			const params = {
				...this.searchData,
				id: this.planId,
			}
			this.memTrendData = []
			ApiLargeScreen.memTrend(params).then((res) => {
				if (res.status === 1) {
					let data = res.data || {}
					for (let key in data) {
						// let memTrendData = data[key]
						// data[key].forEach((item) => {
						// 	memTrendData.push([item.time, item.value])
						// })
						this.memTrendData.push({ name: key, data: data[key] })
					}
				}
			})
		},
		getBusinessCpu() {
			const params = {
				...this.searchData,
				id: this.planId,
			}
			this.listCpu = []
			ApiLargeScreen.cpu(params).then((res) => {
				let total = 0
				if (res.status === 1) {
					res.data.map((item) => {
						total += item.num || 0
					})
					const list = res.data.sort((a, b) => b.num - a.num)
					this.listCpu = list.map((item) => {
						return {
							name: item.name,
							value: parseInt((item.num / total) * 100),
							num: item.num + '%',
						}
					})
				}
			})
		},
		getBusinessTem() {
			const params = {
				...this.searchData,
				id: this.planId,
			}
			this.listTemp = []
			ApiLargeScreen.tem(params).then((res) => {
				let total = 0
				if (res.status === 1) {
					res.data.map((item) => {
						total += item.num || 0
					})
					const list = res.data.sort((a, b) => b.num - a.num)
					this.listTemp = list.map((item) => {
						return {
							name: item.name,
							value: parseInt((item.num / total) * 100),
							num: item.num + '℃',
						}
					})
				}
			})
		},
		getBusinessMem() {
			const params = {
				...this.searchData,
				id: this.planId,
			}
			this.listMem = []
			ApiLargeScreen.mem(params).then((res) => {
				let total = 0
				if (res.status === 1) {
					res.data.map((item) => {
						total += item.num || 0
					})
					const list = res.data.sort((a, b) => b.num - a.num)
					this.listMem = list.map((item) => {
						return {
							name: item.name,
							value: parseInt((item.num / total) * 100),
							num: item.num + '%',
						}
					})
				}
			})
		},
	},
}
</script>
<style scoped>
.networkview {
	display: flex;
	height: 100%;
	padding: 16px;
	justify-content: space-between;
	font-family: 'DingTalk';
}
.networkview-left {
	width: 392px;
	height: 100%;
}
.networkview-main {
	flex: 1;
	margin-left: 16px;
	margin-right: 16px;
}
.networkview-right {
	width: 392px;
}
.networkview-right-default {
	height: calc(100% - 16px);
}
.network-right-content-click {
	height: 100%;
}
.networkview-list {
	height: 50px;
	padding: 8px 16px;
	background: #ffffff;
	border-radius: 4px 4px 4px 4px;
}
.networkview-btn {
	width: 100px;
	height: 32px;
	text-align: center;
	border-radius: 4px;
	border: 1px solid #006666;
	background: #ffffff;
	cursor: pointer;
	color: #006666;
	font-size: 14px;
	line-height: 32px;
}
.el-icon-date {
	margin-right: 4px;
}
.networkview-list-title {
	height: 50px;
	margin-top: 16px;
	padding-left: 50px;
	background-image: url(@/assets/network-label-small.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
	background-position: 0 0;
	line-height: 50px;
	color: #2d856c;
	font-size: 20px;
	background-color: #fff;
}
.network-left-content {
	height: calc(100% - 140px);
}
.network-left-content-click {
	height: calc(100% - 124px);
}
.networkview-left-item {
	width: 100%;
	height: 33.33%;
	padding: 16px;
	/* padding-right: 0; */
	margin-top: 8px;
	background: #ffffff;
	border-radius: 4px 4px 4px 4px;
}
.networkview-left-content-item {
	width: 100%;
	padding: 16px;
	margin-top: 8px;
	background: #ffffff;
	border-radius: 4px 4px 4px 4px;
}
.networkview-left-title {
	display: inline-block;
	background: url(@/assets/label-sub-before.png) no-repeat 100% 100%;
	background-position: 0 6px;
	padding-left: 8px;
	margin-bottom: 16px;
	height: 24px;
	line-height: 24px;
	font-size: 16px;
	color: #2d856c;
}
.networkview-left-title::after {
	content: '';
	width: auto;
	height: 2px;
	background-image: radial-gradient(closest-side at 50% 50%, #006666, #fff);
	display: block;
}
.large-label {
	height: 50px;
	line-height: 50px;
	font-size: 20px;
	color: #2d856c;
	background-image: url(@/assets/network-label.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
	background-position: 0 0;
	padding-left: 50px;
	position: relative;
	background-color: transparent;
	box-shadow: 0px 4px 10px 0px rgba(3, 104, 104, 0.22);
	margin: 0;
}
.large-label-append {
	float: right;
	margin-right: 135px;
	width: 220px;
}
.network-main-togolog {
	width: 100%;
	height: 480px;
	margin-top: 16px;
	background: #ffffff;
	border-radius: 4px 4px 4px 4px;
}
.network-main-warn {
	position: relative;
	margin-top: 16px;
	padding-top: 50px;
}
.network-main-warn-title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 50px;
	padding-left: 50px;
	padding-right: 85px;
	background-image: url(@/assets/network-label.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
	background-position: 0 0;
	line-height: 50px;
}
.main-top {
	display: flex;
	justify-content: space-between;
	height: 27px;
}
.warnList-title {
	font-size: 20px;
	color: #2d856c;
}
.main-group {
	width: 210px;
	display: flex;
	align-items: center;
	margin-right: 40px;
}
.group-title {
	margin-right: 8px;
	font-size: 14px;
	color: #757e7e;
}
.network-main-warn-list {
	width: 100%;
	height: 214px;
	margin-top: 8px;
	background-color: #fff;
	border-radius: 4px 4px 4px 4px;
}
.networkview-right-margin {
	margin-top: 0;
}
.networkview-top {
	height: 250px;
}
.networkview-right-top {
	height: 374px;
}
.networkview-bottom {
	height: 451px;
}
.networkview-left-cpu-title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
	font-size: 12px;
	color: #555555;
}
.networkview-cpu-title-value {
	margin-left: 4px;
	font-size: 14px;
	color: #2d856c;
}
.networkview-cpu-title-margin {
	margin-right: 20px;
}
.networkview-scrollbar {
	height: calc(100% - 40px);
}
.tooltip-txt-item {
	margin-top: 8px;
	font-size: 14px;
	color: #282827;
	line-height: 24px;
}
.item-title {
	color: #757e7e;
}
.margin-bottom {
	margin-bottom: 0;
}
.tooltip-cpu-top {
	/* margin-top: 16px; */
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
	color: #555555;
	font-size: 12px;
}
.use-font {
	font-size: 10px;
}
.use-item {
	color: #2d856c;
	font-size: 14px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
.use-margin {
	margin-right: 20px;
}
.tooltip-prot-item {
	width: 120px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
.scrollbar-port {
	height: calc(100% - 62px);
}
.use-item-name {
	font-size: 14px;
	color: #282827;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
.use-font-ip {
	font-size: 10px;
	color: #757e7e;
}
</style>