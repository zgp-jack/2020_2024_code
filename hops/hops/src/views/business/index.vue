<template>
	<el-row class="business">
		<LeftTable ref="leftTable" :tableHeader="tableHeader" :width="'75px'" class="table-left" :tableData="tableData" @rowClick="checkRow" @sortClick="sortClick">
			<template v-slot:search>
				<div class="leftTable-search">
					<el-input class="search-input" placeholder="请输入名称" prefix-icon="el-icon-search" v-model="searchData.name" />
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
					<div class="common-btn" @click="search">查询</div>
				</div>
			</template>
		</LeftTable>
		<el-col class="business-container">
			<div class="business-top">
				<el-col class="business-main">
					<!-- <router-link :to="`/business/${7}`">
						<div class="common-btn">查询</div>
					</router-link> -->
					<!-- <div class="common-btn" @click="$router.push(`/businessDetail/${7}`)">查询</div> -->
					<p class="business-title">{{ currentTitle }}</p>
					<div class="business-graph">
						<p class="graph-title">业务逻辑</p>
						<div class="topolog-img">
							<div class="img-item" v-for="(item, index) in imageUrl" :key="index">
								<img class="img-icon" :src="require(`@/assets/svg/${item[0]}.svg`)" alt="" />
								<span>{{ item[1] + (item[2] || item[2] == 0 ? '-' + item[2] : '') }}</span>
							</div>
						</div>
						<div class="graph" id="graphTopologic" ref="graphTopologic">
							<TopologicalGraph
								ref="topologic"
								v-if="currentData.length"
								:currentData="currentData"
								:currentTitle="currentTitle"
								:searchData="searchData"
								:width="width"
							></TopologicalGraph>
						</div>
					</div>
				</el-col>
				<WarnList class="business-right" v-if="businessId" :monitorTypeId="-1" :businessId="businessId" :searchData="searchData"></WarnList>
			</div>
			<div class="business-bottom">
				<el-row :gutter="16">
					<el-col :span="12">
						<div class="trendChart">
							<p class="trendChart-title">CPU利用率</p>
							<div class="lineChart">
								<TrendChart ref="cpu" v-if="cpuTrendData.length" :title="'CPU利用率'" :trendData="cpuTrendData"></TrendChart>
								<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
							</div>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="trendChart">
							<p class="trendChart-title">内存利用率</p>
							<div class="lineChart">
								<TrendChart ref="mem" v-if="memTrendData.length" :title="'内存利用率'" :trendData="memTrendData"></TrendChart>
								<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
							</div>
						</div>
					</el-col>
				</el-row>
			</div>
		</el-col>
	</el-row>
</template>
<script>
import { ApiBusinessList, ApiBuinessTrend } from '@/api'
import { debounce } from '@/utils/util'
var elementResizeDetectorMaker = require('element-resize-detector')
export default {
	name: 'business',
	data() {
		const endTime = parseInt(new Date().getTime())
		const h = new Date().getHours() * 3600000
		const m = new Date().getMinutes() * 60000
		const s = new Date().getSeconds() * 1000
		const startTime = endTime - 86400000 - (h + m + s)
		return {
			tableHeader: [
				{ prop: 'name', label: '名称', width: 'undefined' },
				{ prop: 'hostNumber', label: '主机', sortable: 'custom', width: 60 },
				{ prop: 'networkNumber', label: '网络', sortable: 'custom', width: 60 },
				{ prop: 'dbNumber', label: '数据库', sortable: 'custom', width: 74 },
				{ prop: 'middlewareNumber', label: '中间件', sortable: 'custom', width: 74 },
				{ prop: 'alarm', label: '告警', width: 100 },
			],
			imageUrl: [
				['businessD', '业务'],
				['serverD', '主机'],
				['networkD', '网络'],
				['databaseD', '数据库'],
				['middlewareD', '中间件'],
			],
			tableData: [],
			currentData: [],
			cpuTrendData: [],
			memTrendData: [],
			searchData: {
				startTime: startTime,
				endTime: endTime,
			},
			currentTitle: '',
			timeList: [startTime, endTime],
			businessId: '',
			width: 400,
		}
	},
	components: {
		LeftTable: () => import('@/components/leftTable.vue'),
		WarnList: () => import('@/components/warnList.vue'),
		TrendChart: () => import('./components/trendChart.vue'),
		TopologicalGraph: () => import('./components/topolog.vue'),
	},
	mounted() {
		let id = this.$route.params.id
		this.getList(id)
		let erd = elementResizeDetectorMaker()
		erd.listenTo(document.getElementById('graphTopologic'), debounce(this.resizeFunc))
	},
	methods: {
		sortClick(sort) {
			this.searchData.field = sort.prop || ''
			this.searchData.sort = sort.order || ''
			this.currentData = []
			this.getList()
		},
		resizeFunc() {
			let num = JSON.parse(JSON.stringify(this.currentData))
			this.currentData = []
			this.$nextTick(() => {
				this.width = this.$refs.graphTopologic && this.$refs.graphTopologic.clientWidth
				this.$refs['cpu'] && this.$refs['cpu'].resize()
				this.$refs['mem'] && this.$refs['mem'].resize()
				this.currentData = num
			})
		},
		search() {
			this.getList()
		},
		setSearchTime() {
			this.searchData.startTime = this.timeList[0].getTime()
			this.searchData.endTime = this.timeList[1].getTime()
		},
		checkRow(row) {
			this.currentData = []
			this.$nextTick(() => {
				this.currentData = row.serviceAssocInfoList
			})
			this.imageUrl[1][2] = row.hostNumber
			this.imageUrl[2][2] = row.networkNumber
			this.imageUrl[3][2] = row.dbNumber
			this.imageUrl[4][2] = row.middlewareNumber
			this.currentTitle = row.name
			this.businessId = row.id
			this.getTrend(row.id)
		},
		getList(id) {
			let params = {
				page: 1,
				pageSize: 9999,
				...this.searchData,
			}
			ApiBusinessList(params).then((res) => {
				if (res.status == 1 && res.data.records.length) {
					res.data.records.forEach((item) => {
						item.dbNumber = item.dbNumber || 0
						item.hostNumber = item.hostNumber || 0
						item.middlewareNumber = item.middlewareNumber || 0
						item.networkNumber = item.networkNumber || 0
						item.alarmId = item.alarmIdList && item.alarmIdList.length
						const alarmNumRestored = (item.alarmIdList || []).filter((alarm) => alarm.status === 1).length
						item['alarmNumRestored'] = alarmNumRestored
						item['alarmNumNoRestored'] = (item.alarmIdList || []).length - alarmNumRestored
					})
					this.tableData = res.data.records
					let index = 0
					if (!!id) {
						index = this.tableData.findIndex((item) => item.id === id)
						if (index === -1) {
							index = 0
						}
					}
					this.imageUrl[1].push(res.data.records[index].hostNumber)
					this.imageUrl[2].push(res.data.records[index].networkNumber)
					this.imageUrl[3].push(res.data.records[index].dbNumber)
					this.imageUrl[4].push(res.data.records[index].middlewareNumber)
					this.currentTitle = res.data.records[index].name
					this.currentData = res.data.records[index].serviceAssocInfoList
					this.businessId = res.data.records[index].id
					this.getTrend(res.data.records[index].id)

					const row = res.data.records[index]
					setTimeout(() => {
						this.$refs['leftTable'].handleCurrentChange(row)
					}, 1)
				}
			})
		},
		getTrend(id) {
			let params = {
				id,
				...this.searchData,
			}
			this.cpuTrendData = []
			this.memTrendData = []
			ApiBuinessTrend(params).then((res) => {
				if (res.status == 1 && res.data.length) {
					let cpuTrendData = []
					let memTrendData = []
					res.data.forEach((item) => {
						let cpuList = []
						let memList = []
						item.cpuDataList.forEach((it) => {
							cpuList.push([it.time, parseInt(it.idle)])
						})
						item.memDataList.forEach((it) => {
							memList.push([it.time, parseInt(it.rate)])
						})
						cpuList.length && cpuTrendData.push([item.name, cpuList])
						memList.length && memTrendData.push([item.name, memList])
					})
					this.cpuTrendData = cpuTrendData
					this.memTrendData = memTrendData
				}
			})
		},
	},
}
</script>
<style lang="scss" scoped>
.business {
	display: flex;
}
// .business-left {
// 	width: 500px;
// 	height: calc(100vh - 65px);
// }
.business-container {
	flex: 1;
	min-width: 0;
}
.business-top {
	display: flex;
}
.business-main {
	flex: 1;
	min-width: 0;
	padding: 16px 16px 0 16px;
}
.business-right {
	width: 384px;
	height: 560px !important;
	padding: 16px 16px 0 0;
}
.business-title {
	height: 32px;
	font-family: 'MicrosoftYaHeiUI-Bold';
	font-weight: 700;
	font-size: 24px;
	line-height: 32px;
	color: #282827;
	margin-bottom: 16px;
}
.business-graph {
	position: relative;
	padding: 16px;
	background: #ffffff;
	border-radius: 4px;
}
.graph-title {
	margin-bottom: 16px;
	font-size: 18px;
	color: #282827;
}
.graph {
	height: 422px;
	background: #fff;
	overflow: hidden;
}
.business-bottom {
	padding: 16px 16px 0 16px;
}
.table-left {
	border-top: 1px solid #f0f7f7;
	width: 500px;
	height: calc(100vh - 65px) !important;
	background-color: #fff;
}
.leftTable-search > * {
	margin-right: 16px;
}
.search-input {
	width: 120px !important;
}
.search-picker {
	width: 256px;
}
.common-btn {
	margin: 0;
}

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
.lineChart {
	height: 240px;
}
.topolog-img {
	display: flex;
	position: absolute;
	right: 16px;
	top: 16px;
}
.img-icon {
	width: 16px;
	height: 16px;
	margin-left: 5px;
	margin-right: 5px;
}
.img-item {
	display: flex;
	align-items: center;
}
</style>