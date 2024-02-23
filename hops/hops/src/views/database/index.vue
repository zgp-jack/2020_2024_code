<template>
	<div class="page-row-main">
		<LeftTable ref="leftTable" :tableHeader="tableHeader" :tableData="tableData" class="table-left" @rowClick="handleRowClick">
			<template v-slot:search>
				<div class="leftTable-search">
					<el-input class="search-input" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchData.name" />
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
					<div class="common-btn" @click="handleSearch">查询</div>
				</div>
			</template>
		</LeftTable>
		<div class="page-box" style="width: calc(100% - 532px)">
			<div class="page-content-box">
				<div class="page-content-main" id="chartBox">
					<template v-if="searchData.dbId">
						<div class="page-title-box">
							<el-tooltip class="item" effect="dark" :content="name" placement="top-start">
								<h3 class="page-title-label">{{ name }}</h3>
							</el-tooltip>
						</div>
						<el-scrollbar style="height: calc(100% - 48px)" v-if="checkRow.dbType !== 'cache'">
							<BaseInfo ref="base" :searchData="searchData"></BaseInfo>
							<div style="overflow: hidden">
								<el-row :gutter="16">
									<el-col :span="24">
										<div class="main-box">
											<h5 class="card-title">当前QPS(当前每秒查询率)</h5>
											<!-- height="100px"
												:hasZoom="false"
											:hasyAxis="false" -->
											<ChartDb
												ref="qps"
												:searchData="searchData"
												domId="chartQps"
												:type="1"
												height="140px"
												v-if="time1"
												@loadOver="time2 = true"
												:hasLegend="false"
												hideArea
											></ChartDb>
										</div>
									</el-col>
									<el-col :span="24">
										<div class="main-box">
											<h5 class="card-title">当前TPS(当前每秒事务数)</h5>
											<ChartDb
												ref="tps"
												:searchData="searchData"
												domId="chartTps"
												:type="2"
												height="140px"
												v-if="time2"
												@loadOver="time3 = true"
												:hasLegend="false"
												hideArea
											></ChartDb>
										</div>
									</el-col>
								</el-row>
							</div>
							<div class="main-box">
								<h5 class="card-title">连接数</h5>
								<ChartDb ref="connect" :searchData="searchData" domId="chartConnect" :type="3" v-if="time3" @loadOver="time4 = true" hideArea></ChartDb>
							</div>
							<div class="main-box">
								<h5 class="card-title">线程</h5>
								<ChartDb ref="thread" :searchData="searchData" domId="chartThread" :type="4" v-if="time4" @loadOver="time5 = true" hideArea></ChartDb>
							</div>
							<div class="main-box">
								<h5 class="card-title">流量</h5>
								<ChartDb ref="flow" :searchData="searchData" domId="chartFlow" :type="5" v-if="time5" @loadOver="time6 = true" :isBit="true" stack isFlow></ChartDb>
							</div>
							<div class="main-box">
								<h5 class="card-title">{{ searchData.dbType === 9 ? 'PGA' : '' }}内存</h5>
								<ChartDb ref="mem" :searchData="searchData" domId="chartMemory" :type="6" v-if="time6" @loadOver="time7 = true" :isBit="true" hideArea></ChartDb>
							</div>
							<div class="main-box" v-if="searchData.dbType === 9">
								<h5 class="card-title">其他内存</h5>
								<ChartDb ref="memOther" :searchData="searchData" domId="chartOtherMemory" :type="7" v-if="time7" :isBit="true" hideArea></ChartDb>
							</div>
						</el-scrollbar>
						<el-scrollbar style="height: calc(100% - 48px)" v-else>
							<CacheInfo :searchData="searchData" @setLogLost="setLogLost"></CacheInfo>
						</el-scrollbar>
					</template>
				</div>
				<div :class="{ 'ararm-right': true, close: rightClosed }">
					<LogList :logList="logList" v-show="checkRow.dbType === 'cache'"></LogList>
					<WarnList
						v-if="businessId"
						ref="warn"
						v-show="checkRow.dbType !== 'cache'"
						:monitorTypeId="typeId"
						:businessId="businessId"
						:searchData="searchData"
						@collapsed="handleRightCollapsed"
					></WarnList>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
const RULETYPE = JSON.parse(sessionStorage.getItem('RuleType'))
import ApiDatabase from '@/api/database'
import { debounce } from '@/utils/util'

var elementResizeDetectorMaker = require('element-resize-detector')
export default {
	name: 'database',
	components: {
		LeftTable: () => import('@/components/leftTable.vue'),
		WarnList: () => import('@/components/warnList.vue'),
		BaseInfo: () => import('./components/BaseInfo.vue'),
		ChartDb: () => import('./components/ChartDb.vue'),
		CacheInfo: () => import('./components/CacheInfo.vue'),
		LogList: () => import('./components/LogList.vue'),
	},
	data() {
		const endTime = parseInt(new Date().getTime())
		const h = new Date().getHours() * 3600000
		const m = new Date().getMinutes() * 60000
		const s = new Date().getSeconds() * 1000
		const startTime = endTime - 86400000 - (h + m + s)
		return {
			name: '',
			searchData: {
				name: '',
				dbId: null,
				startTime: startTime,
				endTime: endTime,
				dbType: null,
			},
			timeList: [startTime, endTime],
			basicData: {},
			tableHeader: [
				{ prop: 'name', label: '名称' },
				{ prop: 'url', label: '地址' },
				{ prop: 'dbType', label: '类型' },
				{ prop: 'alarm', label: '告警', width: '100px' },
			],
			tableData: [],
			logList: [],
			checkRow: {},
			time1: false,
			time2: false,
			time3: false,
			time4: false,
			time5: false,
			time6: false,
			time7: false,
			typeId: '',
			businessId: '',
			rightClosed: false,
		}
	},
	mounted() {
		this.searchData.name = this.$route.query.name || ''
		this.getList(true)
		setTimeout(() => {
			this.time1 = true
		}, 500)

		let erd = elementResizeDetectorMaker()
		erd.listenTo(document.getElementById('chartBox'), debounce(this.resizeFunc))
	},
	methods: {
		setSearchTime() {
			this.searchData.startTime = this.timeList[0].getTime()
			this.searchData.endTime = this.timeList[1].getTime()
		},
		getList(init) {
			let params = {
				startTime: this.searchData.startTime,
				endTime: this.searchData.endTime,
				name: this.searchData.name,
			}

			const dbId = this.$route.params.id || this.$route.query.id
			// params.dbId = this.$route.params.id || null,
			ApiDatabase.list(params).then((result) => {
				// const result = res.data;
				this.tableData = []
				let index = 0
				if (result.status === 1) {
					this.tableData = result.data.map((item) => {
						item.dbType = RULETYPE.filter((r) => r.id === item.type)[0]['typeName']
						const alarmNumRestored = (item.alarmGrages || []).filter((alarm) => alarm.status === 1).length
						item['alarmNumRestored'] = alarmNumRestored
						item['alarmNumNoRestored'] = (item.alarmGrages || []).length - alarmNumRestored
						return item
					})
					if (!!dbId) {
						index = this.tableData.findIndex((item) => item.id == dbId)
					}
					this.typeId = this.tableData[index].type
					this.businessId = this.tableData[index].id
					this.checkRow = this.tableData[index]
					this.searchData.dbId = this.checkRow.id
					this.searchData.dbType = this.checkRow.type
					this.name = `${this.checkRow.name}(${this.checkRow.url})`
					if (!init) {
						this.handleRowClick(this.checkRow)
					}
					setTimeout(() => {
						this.$refs['leftTable'].handleCurrentChange(this.checkRow)
					}, 1)
				}
			})
		},
		handleSearch() {
			this.getList()
		},
		reGetAll() {
			this.time1 = false
			this.time2 = false
			this.time3 = false
			this.time4 = false
			this.time5 = false
			this.time6 = false
			this.time7 = false
		},
		handleRowClick(row) {
			this.name = `${row.name}(${row.url})`
			this.searchData.dbType = row.type
			this.searchData.dbId = row.id
			this.checkRow = row
			this.typeId = row.type
			this.businessId = row.id
			this.reGetAll()
			if (row.dbType === 'cache') {
			} else {
				this.$nextTick(() => {
					setTimeout(() => {
						this.time1 = true
					})
				})
				this.$refs['base'].getInfo()
				// console.log('11111111111111');
				// this.$refs['warn'].getList();
			}

			// this.$refs['qps'].initData();
			// this.$refs['tps'].initData();
			// this.$refs['connect'].initData();
			// this.$refs['thread'].initData();
			// this.$refs['flow'].initData();
			// this.$refs['mem'] && this.$refs['mem'].initData();
			// this.$refs['memOther'] && this.$refs['memOther'].initData();
		},
		setLogLost(logList) {
			this.logList = logList
		},
		handleRightCollapsed(show) {
			this.rightClosed = !show
		},
		resizeFunc(element) {
			this.$nextTick(() => {
				this.$refs['qps'] && this.$refs['qps'].resize()
				this.$refs['tps'] && this.$refs['tps'].resize()
				this.$refs['connect'] && this.$refs['connect'].resize()
				this.$refs['thread'] && this.$refs['thread'].resize()
				this.$refs['flow'] && this.$refs['flow'].resize()
				this.$refs['mem'] && this.$refs['mem'].resize()
				this.$refs['memOther'] && this.$refs['memOther'].resize()
			})
		},
	},
}
</script>
<style lang="scss" scoped>
.table-left {
	border-top: 1px solid #f0f7f7;
	height: 100%;
	width: 500px;
}
.page-title-box {
	margin-bottom: 16px;
	.page-title-label {
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		height: 32px;
	}
}
.basic-msg {
	height: 394px;
	label {
		width: 60px;
		display: inline-block;
		position: relative;
	}
	label::after {
		content: ':';
		position: absolute;
		right: 0;
		top: 0;
	}
	span {
		color: #282827;
		padding-left: 14px;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		word-break: break-all;
		display: inline-block;
		flex: 1;
	}
}
.ararm-right {
	width: 384px;
	height: calc(100% - 16px);
	margin: 0 0 0 16px;
}
.ararm-right.close {
	width: 0px;
	transition: width 0.3s ease-in-out;
	padding: 0;
}

.page-content-main {
	position: relative;
	min-width: 0;
	.main-box {
		width: 100%;
		margin-top: 16px;
	}
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
</style>