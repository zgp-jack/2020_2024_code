<template>
	<div class="page-row-main">
		<!-- <div class="main-box table-left"> -->
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
		<!-- </div> -->
		<div class="page-box" style="width: calc(100% - 532px)">
			<div class="page-content-box">
				<div class="page-content-main" style="position: relative; width: 100%" id="chartBox">
					<div class="page-title-box" style="margin-bottom: 16px">
						<h3 class="page-title-label">{{ name }}</h3>
					</div>
					<el-scrollbar style="height: calc(100% - 48px); width: 100%" v-if="searchData.hostId">
						<div class="main-box">
							<h5 class="card-title">基础配置</h5>
							<BasicInfo ref="base" :searchData="searchData" @setNetListData="setNetListData"></BasicInfo>
						</div>
						<div class="main-box" style="height: 224px; margin-top: 16px">
							<h5 class="card-title">CPU</h5>
							<ChartCpu ref="cpu" :searchData="searchData"></ChartCpu>
						</div>
						<div class="main-box" style="height: 224px; margin-top: 16px">
							<h5 class="card-title">内存</h5>
							<ChartMemory ref="mem" :searchData="searchData"></ChartMemory>
						</div>
						<div class="main-box" style="height: 417px; margin-top: 16px">
							<h5 class="card-title">磁盘</h5>
							<TableDisk ref="disk" :searchData="searchData"></TableDisk>
						</div>
						<div class="main-box" style="height: 404px; margin-top: 16px">
							<h5 class="card-title">网口</h5>
							<TableNetPort v-if="listNetData.length" ref="net" :searchData="searchData" :listData="listNetData"></TableNetPort>
						</div>
					</el-scrollbar>
				</div>
				<div :class="{ 'ararm-right': true, close: rightClosed }">
					<WarnList ref="warn" v-if="businessId" :monitorTypeId="typeId" :businessId="businessId" :searchData="searchData" @collapsed="handleRightCollapsed"></WarnList>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import alarm from '@/api/alarm'
import ApiHost from '@/api/host'
import { getMaxUnitByFlow, getValueByUnit, debounce } from '@/utils/util'

var elementResizeDetectorMaker = require('element-resize-detector')
export default {
	name: 'host',
	components: {
		ChartCpu: () => import('./components/ChartCpu.vue'),
		ChartMemory: () => import('./components/ChartMemory.vue'),
		TableDisk: () => import('./components/TableDisk.vue'),
		TableNetPort: () => import('./components/TableNetPort.vue'),
		BasicInfo: () => import('./components/BasicInfo.vue'),
		LeftTable: () => import('@/components/leftTable.vue'),
		WarnList: () => import('@/components/warnList.vue'),
	},
	data() {
		const endTime = parseInt(new Date().getTime())
		const h = new Date().getHours() * 3600000
		const m = new Date().getMinutes() * 60000
		const s = new Date().getSeconds() * 1000
		const startTime = endTime - 86400000 - (h + m + s)
		return {
			name: '',
			tableHeader: [
				{ prop: 'computerName', label: '名称' },
				{ prop: 'ip', label: '地址' },
				{ prop: 'alarm', label: '告警', width: '100px' },
			],
			searchData: {
				hostId: '',
				name: '',
				startTime: startTime,
				endTime: endTime,
			},
			timeList: [startTime, endTime],
			tableData: [],
			listNetData: [],
			checkRow: null,
			typeId: '',
			businessId: '',
			rightClosed: false,
		}
	},
	mounted() {
		this.$store.state.ruleType.forEach((item) => {
			if (item.typeName == '主机') {
				this.typeId = item.id
			}
		})
		this.searchData.name = this.$route.query.name || ''
		this.getList(true)

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
				name: this.searchData.name,
				startTime: this.searchData.startTime,
				endTime: this.searchData.endTime,
			}

			const hostId = this.$route.params.id || this.$route.query.id
			// params.hostId = this.$route.params.id || null;
			ApiHost.list(params).then((result) => {
				// const result = res.data;
				this.tableData = []
				let index = 0
				if (result.status === 1) {
					this.tableData = result.data.map((item) => {
						const alarmNumRestored = (item.alarmGrages || []).filter((alarm) => alarm.status === 1).length
						item['alarmNumRestored'] = alarmNumRestored
						item['alarmNumNoRestored'] = (item.alarmGrages || []).length - alarmNumRestored
						return item
					})
					if (!!hostId) {
						index = this.tableData.findIndex((item) => item.id == hostId)
					}
					this.checkRow = this.tableData[index]
					this.businessId = result.data[index].id
					this.searchData.hostId = this.checkRow.id
					this.name = `${this.checkRow.computerName}(${this.checkRow.ip})`
					if (!init) {
						this.handleRowClick(this.checkRow)
					}
					this.$nextTick(() => {
						this.$refs['leftTable'] && this.$refs['leftTable'].handleCurrentChange(this.checkRow)
					})
				}
			})
		},
		setNetListData(list) {
			this.listNetData = [];
			this.$nextTick(() => {
				let max = 0;
				let unit = 'bps';
				list.forEach(item => {
					max = item.up > max ? item.up : max;
					max = item.down > max ? item.down : max;
				})
				unit = getMaxUnitByFlow(max).unit;
				this.listNetData = list.map((item) => {
					const up = getValueByUnit(item.up, unit);
					const down = getValueByUnit(item.down, unit);
					item.upStr = up + unit;
					item.downStr = down + unit;
					item.errorPack = item.errorPack || 0;
					return item
				})
			})
		},
		handleSearch() {
			this.getList()
			// this.$refs['warn'].getList()
		},
		handleRowClick(row) {
			this.name = `${row.computerName}(${row.ip})`
			this.searchData.hostId = row.id
			this.checkRow = row
			this.businessId = row.id
			this.$refs['base'].getInfo()
			this.$refs['cpu'].initData()
			this.$refs['mem'].initData()
			this.$refs['disk'].getList()
			// this.$refs['warn'].getList()
		},
		handleRightCollapsed(show) {
			this.rightClosed = !show
		},
		resizeFunc(element) {
			this.$nextTick(() => {
				this.$refs['cpu'] && this.$refs['cpu'].resize()
				this.$refs['mem'] && this.$refs['mem'].resize()
				this.$refs['net'] && this.$refs['net'].resize()
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
.page-content-main .main-box {
	width: calc(100% - 15px);
	position: relative;
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