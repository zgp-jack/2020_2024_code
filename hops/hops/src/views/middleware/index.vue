
<template>
	<el-row class="network">
		<LeftTable ref="leftTable" :tableHeader="tableHeader" class="table-left" :tableData="tableData" @rowClick="checkRow">
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
		<el-col class="network-main" id="middleware">
			<p class="network-title">{{ currentTitle }}</p>
			<el-scrollbar class="network-scroll">
				<template v-if="jvmTitle == 'jvm'">
					<!-- <EchartCard v-for="(item, key) in jvmData" :key="key" :title="key">
						<EchartOld :ref="key" v-if="item.length" :jvmData="item"></EchartOld>
					</EchartCard> -->
					<EchartCard :title="'eden'">
						<EchartOld ref="eden" v-if="jvmData.eden.length" :jvmData="jvmData.eden"></EchartOld>
						<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
					</EchartCard>
					<EchartCard :title="'survivor'">
						<EchartOld ref="survivor" v-if="jvmData.survivor.length" :jvmData="jvmData.survivor"></EchartOld>
						<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
					</EchartCard>
					<EchartCard :title="'old'">
						<EchartOld ref="old" v-if="jvmData.old.length" :jvmData="jvmData.old"></EchartOld>
						<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
					</EchartCard>
					<EchartCard :title="'code'">
						<EchartOld ref="code" v-if="jvmData.code.length" :jvmData="jvmData.code"></EchartOld>
						<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
					</EchartCard>
					<EchartCard :title="'heapMemoryUsage'">
						<EchartOld ref="heapMemoryUsage" v-if="jvmData.heapMemoryUsage.length" :jvmData="jvmData.heapMemoryUsage"></EchartOld>
						<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
					</EchartCard>
					<!-- <EchartCard :title="'nonHeapMemoryUsage'">
						<EchartOld v-if="jvmData.nonHeapMemoryUsage.length" :jvmData="jvmData.nonHeapMemoryUsage"></EchartOld>
					</EchartCard> -->
					<!-- <EchartCard :title="'线程'" :isHeight="true">
						<ThreadLoad v-if="threadData.length" :threadId="threadId" :searchData="searchData" :threadData="threadData"></ThreadLoad>
					</EchartCard> -->
				</template>
				<template v-if="jvmTitle == 'tomcat'">
					<div class="middle-top">
						<EchartCard :title="'当前连接数'" class="middle-center">
							<EchartLine ref="countList" v-if="tomcatData.countList.length" :jvmData="tomcatData.countList" :height="142" unit="个"></EchartLine>
							<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
						</EchartCard>
						<EchartCard :title="'端口号'" class="middle-center">
							<div class="middle-title">{{ tomcatPort }}</div>
						</EchartCard>
					</div>
					<EchartCard :title="'IO'">
						<EchartLine ref="ioList" v-if="tomcatData.ioList.sendList.length" :jvmData="tomcatData.ioList" :height="240" :unit="unit"></EchartLine>
						<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
					</EchartCard>
					<EchartCard :title="'请求'">
						<EchartLine ref="questList" v-if="tomcatData.questList.errorList.length" :jvmData="tomcatData.questList" :height="240" unit="个"></EchartLine>
						<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
					</EchartCard>
					<EchartCard :title="'Session'">
						<EchartLine ref="sessionList" v-if="tomcatData.sessionList.totalList.length" :jvmData="tomcatData.sessionList" :height="240" unit="个"></EchartLine>
						<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
					</EchartCard>
					<EchartCard :title="'线程'">
						<EchartLine ref="threadList" v-if="tomcatData.threadList.activeThread.length" :jvmData="tomcatData.threadList" :height="240" unit="个"></EchartLine>
						<el-empty v-else class="warnList-empty" :image="require('@/assets/empty.png')"></el-empty>
					</EchartCard>
				</template>
				<template v-if="jvmTitle == 'iis'">
					<EchartCard :title="'站点'">
						<RuleTable v-if="siteTableData.length" :tableHeader="siteTableHeader" :tableData="siteTableData"> </RuleTable>
					</EchartCard>
					<EchartCard :title="'虚拟目录'">
						<RuleTable v-if="dirTableData.length" :tableHeader="dirTableHeader" :tableData="dirTableData"> </RuleTable>
					</EchartCard>
				</template>
			</el-scrollbar>
		</el-col>
		<WarnList class="network-right" v-if="businessId" :monitorTypeId="typeId" :businessId="businessId" :searchData="searchData"></WarnList>
	</el-row>
</template>
<script>
import { getMiddleList, listMiddle } from '@/api'
import { debounce } from '@/utils/util'
var elementResizeDetectorMaker = require('element-resize-detector')
export default {
	name: 'middleware',
	data() {
		const endTime = parseInt(new Date().getTime())
		const h = new Date().getHours() * 3600000
		const m = new Date().getMinutes() * 60000
		const s = new Date().getSeconds() * 1000
		const startTime = endTime - 86400000 - (h + m + s)
		return {
			dialogTableVisible: false,
			tableHeader: [
				{ prop: 'name', label: '名称' },
				{ prop: 'host', label: '地址' },
				{ prop: 'typeName', label: '类型' },
				{ prop: 'alarm', label: '告警', width: '100px' },
			],
			middleHeader: [
				// { prop: 'threadId', label: '线程ID' },
				{ prop: 'threadName', label: '线程名称' },
				{ prop: 'threadState', label: '线程状态' },
				{ prop: 'blockedTime', label: '阻塞时间' },
				{ prop: 'blockedCount', label: '阻塞次数' },
				{ prop: 'waitedTime', label: '等待时间' },
				{ prop: 'waitedCount', label: '等待次数' },
				{ prop: 'lockName', label: '锁名称' },
				// { prop: 'lockOwnerId', label: '所有者ID' },
				{ prop: 'lockOwnerName', label: '所有者名称' },
			],
			siteTableHeader: [
				{ prop: 'name', label: '名称' },
				{ prop: 'website', label: '网址' },
				{ prop: 'port', label: '端口' },
				{ prop: 'state', label: '状态' },
			],
			dirTableHeader: [
				{ prop: 'physicalPath', label: '物理路径' },
				{ prop: 'vpath', label: '虚拟地址' },
				// { prop: 'waitedTime', label: '程序路径' },
			],
			siteTableData: [],
			listNetData: [],
			dirTableData: [],
			jvmTitle: '',
			tomcatPort: '',
			tableData: [],
			threadData: [],
			threadId: '',
			jvmData: {
				old: [],
				eden: [],
				survivor: [],
				code: [],
				heapMemoryUsage: [],
				nonHeapMemoryUsage: [],
			},
			tomcatData: {
				countList: [],
				ioList: {
					sendList: [],
					receivedList: [],
				},
				questList: {
					errorList: [],
					requestList: [],
				},
				sessionList: {
					totalList: [], // sessionCounter
					historyList: [], // sesseionMaxActive
					currentList: [], // sesseionMaxActive
				},
				threadList: {
					activeThread: [], // tomcatCurrentThreadCount
					busyThread: [], // tomcatCurrentThreadsBusy
					maxThread: [], // tomcatMaxThreads
				},
			},
			timeList: [startTime, endTime],
			searchData: {
				startTime: startTime,
				endTime: endTime,
				name: '',
			},
			currentTitle: '',
			typeId: '',
			businessId: '',
			unit: '',
		}
	},
	components: {
		LeftTable: () => import('@/components/leftTable.vue'),
		RuleTable: () => import('./components/ruleTable.vue'),
		WarnList: () => import('@/components/warnList.vue'),
		EchartCard: () => import('./components/echartCard.vue'),
		ModalBox: () => import('@/components/modalBox.vue'),
		EchartOld: () => import('./components/echartOld.vue'),
		EchartLine: () => import('./components/echartLine.vue'),
		ThreadLoad: () => import('./components/threadLoad.vue'),
	},
	mounted() {
		this.searchData.name = this.$route.query.name || ''
		this.getList()
		let erd = elementResizeDetectorMaker()
		erd.listenTo(document.getElementById('middleware'), debounce(this.resizeFunc))
	},
	methods: {
		resizeFunc() {
			this.$nextTick(() => {
				if (this.jvmTitle == 'jvm') {
					this.$refs['old'] && this.$refs['old'].resize()
					this.$refs['eden'] && this.$refs['eden'].resize()
					this.$refs['survivor'] && this.$refs['survivor'].resize()
					this.$refs['code'] && this.$refs['code'].resize()
					this.$refs['heapMemoryUsage'] && this.$refs['heapMemoryUsage'].resize()
				} else if (this.jvmTitle == 'tomcat') {
					this.$refs['countList'] && this.$refs['countList'].resize()
					this.$refs['ioList'] && this.$refs['ioList'].resize()
					this.$refs['questList'] && this.$refs['questList'].resize()
					this.$refs['sessionList'] && this.$refs['sessionList'].resize()
					this.$refs['threadList'] && this.$refs['threadList'].resize()
				}
			})
		},
		handleSearch() {
			this.getList()
		},
		setSearchTime() {
			this.searchData.startTime = this.timeList[0].getTime()
			this.searchData.endTime = this.timeList[1].getTime()
		},
		checkRow(row) {
			let params = {
				monitorId: row.id,
				...this.searchData,
			}
			this.typeId = row.type
			this.businessId = row.id
			this.currentTitle = row.name
			if (row.type == '6') {
				this.threadId = row.id
				this.jvmData = {
					old: [],
					eden: [],
					survivor: [],
					code: [],
					heapMemoryUsage: [],
				}
				listMiddle('list', params).then((res) => {
					if (res.status == 1) {
						let jvmObject = res.data
						this.jvmData.old = jvmObject['old']
						this.jvmData.eden = jvmObject['eden']
						this.jvmData.survivor = jvmObject['survivor']
						this.jvmData.code = jvmObject['code']
						this.jvmData.heapMemoryUsage = jvmObject['heapMemoryUsage']
						this.jvmTitle = 'jvm'
					}
				})
				// listMiddle('thread/name', params).then((res) => {
				// 	if (res.status == 1) {
				// 		this.threadData = res.data
				// 	}
				// })
			} else if (row.type == '7') {
				let countList = []
				let sendList = []
				let receivedList = []
				let errorList = []
				let requestList = []
				let totalList = []
				let historyList = []
				let currentList = []
				let activeThread = []
				let busyThread = []
				let maxThread = []
				listMiddle('tomcat', params).then((res) => {
					if (res.status == 1) {
						this.tomcatPort = res.data.length && res.data[0].tomcatPort
						let list = res.data || []
						let maxVal = 0
						let unitNum = 1
						let unit = 'bps'
						for (let i = 0; i < list.length; i++) {
							const sizeS = list[i].bytesSent || 0
							const sizeR = list[i].bytesReceived || 0
							const size = sizeS > sizeR ? sizeS : sizeR
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
						this.unit = unit
						res.data.forEach((item) => {
							countList.push([item.time * 1000, item.tomcatConnectionCount])
							sendList.push([item.time * 1000, parseFloat(((item.bytesSent || 0) / unitNum).toFixed(2)), unit])
							receivedList.push([item.time * 1000, parseFloat(((item.bytesReceived || 0) / unitNum).toFixed(2)), unit])
							errorList.push([item.time * 1000, item.errorCount])
							requestList.push([item.time * 1000, item.requestCount])
							historyList.push([item.time * 1000, item.sesseionMaxActive])
							totalList.push([item.time * 1000, item.sessionCounter])
							currentList.push([item.time * 1000, item.activeSessions])
							activeThread.push([item.time * 1000, item.tomcatCurrentThreadCount])
							busyThread.push([item.time * 1000, item.tomcatCurrentThreadsBusy])
							maxThread.push([item.time * 1000, item.tomcatMaxThreads])
						})
						this.tomcatData.countList = countList
						this.tomcatData.ioList = { sendList, receivedList }
						this.tomcatData.questList = { requestList, errorList }
						this.tomcatData.sessionList = { totalList, historyList, currentList }
						this.tomcatData.threadList = { activeThread, busyThread, maxThread }
						this.jvmTitle = 'tomcat'
					}
				})
			} else {
				listMiddle('iis', params).then((res) => {
					if (res.status == 1 && res.data) {
						this.dirTableData = res.data.iisPathList
						this.siteTableData = res.data.siteInfoList
					}
					this.jvmTitle = 'iis'
				})
			}
		},
		getList() {
			let params = {
				page: 1,
				pageSize: 9999,
				...this.searchData,
			}
			const middleId = this.$route.params.id || this.$route.query.id
			// ;(params.id = this.$route.params.id || null),
			this.tableData = []
			getMiddleList(params).then((res) => {
				if (res.status == 1 && res.data.records.length) {
					res.data.records.forEach((item) => {
						this.$store.state.ruleType.forEach((it) => {
							if (it.id == item.type) {
								item.typeName = it.typeName
							}
						})
					})
					this.jvmTitle = res.data.records[0].typeName
					this.businessId = res.data.records[0].id
					this.typeId = res.data.records[0].type
					this.tableData = res.data.records.map((item) => {
						const alarmNumRestored = (item.alarmGrages || []).filter((alarm) => alarm.status === 1).length
						item['alarmNumRestored'] = alarmNumRestored
						item['alarmNumNoRestored'] = (item.alarmGrages || []).length - alarmNumRestored
						return item
					})
					this.currentTitle = res.data.records[0].name
					let index = 0
					if (!!middleId) {
						index = this.tableData.findIndex((item) => item.id == middleId)
					}
					const row = res.data.records[index]
					this.checkRow(row)
					setTimeout(() => {
						this.$refs['leftTable'].handleCurrentChange(row)
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
	width: 28.93%;
	height: calc(100vh - 65px);
}
.network-main {
	// width: 47.92%;
	min-width: 0;
	flex: 1;
	padding: 16px 16px 16px 16px;
}
.network-right {
	width: 384px;
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
	height: calc(100vh - 145px);
}

.table-left {
	border-top: 1px solid #f0f7f7;
	width: 500px;
	height: calc(100vh - 65px) !important;
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
.middle-top {
	display: flex;
	justify-content: space-between;
}
.middle-center {
	height: 200px;
	width: 49%;
	text-align: center;
}
.middle-title {
	margin-top: 50px;
	color: #000;
	font-size: 24px;
	font-weight: 900;
}
</style>