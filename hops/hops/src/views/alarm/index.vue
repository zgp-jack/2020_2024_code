<template>
	<div class="alarm-list-box">
		<div class="warnList-top">
			<el-date-picker
				class="warnList-picker"
				v-model="time"
				type="datetimerange"
				range-separator="-"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				@change="setSearchTime"
				> </el-date-picker>
			<div class="common-btn" @click="handlerSearch">查询</div>
		</div>
		<el-row :gutter="20" class="alarm-top">
			<el-col :span="12">
				<div class="main-box">
					<h5 class="card-title">告警趋势</h5>
					<ChartWarnTrend ref="trend" :timeList="timeList" @setFilter="setFilter"></ChartWarnTrend>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="main-box">
					<h5 class="card-title">告警类型</h5>
					<ChartWarnBar ref="type" :timeList="timeList" method="type" domId="chartWarnType" @setFilter="setFilter"></ChartWarnBar>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="main-box">
					<h5 class="card-title">告警等级</h5>
					<ChartWarnBar ref="level" :timeList="timeList" method="level" domId="chartWarnLv" @setFilter="setFilter"></ChartWarnBar>
				</div>
			</el-col>
		</el-row>
		<div class="main-box alarm-table">
			<TableWarn ref="table" :timeList="timeList"></TableWarn>
		</div>
	</div>
</template>
<script>
export default {
	name: 'alarm',
	components: {
		TableWarn: () => import('./components/TableWarn.vue'),
		ChartWarnTrend: () => import('./components/ChartWarnTrend.vue'),
		ChartWarnBar: () => import('./components/ChartWarnBar.vue'),
	},
	data() {
		const endTime = parseInt(new Date().getTime())
		const h = new Date().getHours() * 3600000
		const m = new Date().getMinutes() * 60000
		const s = new Date().getSeconds() * 1000
		const startTime = endTime - 86400000 - (h + m + s)
		return {
			time: [startTime, endTime],
			timeList: [startTime, endTime],
			params: {}
		}
	},
	mounted() {
		const params = this.$route.params;
		this.params.type = params.type;
		this.params.level = params.level;
		this.params.status = params.status;
		// let groupA = [];
		// let groupB = [];
		// let groupC = [];
		// for(let i = 1; i <= 240; (i % 2 !== 0) ? i += 5 : i++) {
		// 	groupA.push(i);
		// }
		// for(let j = 2; j <= 240; j+=3) {
		// 	groupB.push(j);
		// }
		// for(let k = 3; k <= 240; (k % 2 === 0) ? k +=5 : k++) {
		// 	groupC.push(k);
		// }
		// console.log(groupC, groupB, groupA)
	},
	methods: {
		setSearchTime() {
			this.timeList[0] = this.time[0].getTime()
			this.timeList[1] = this.time[1].getTime()
		},
		handlerSearch() {
			this.$refs['trend'].initData();
			this.$refs['type'].initData();
			this.$refs['level'].initData();
			this.$refs['table'].handleSearch();
		},
		setFilter(item) {
			this.$refs['table'].setFilter(item);
		}
	},
}
</script>
<style lang="scss" scoped>
.alarm-list-box {
	padding: 16px;
	display: flex;
	flex-direction: column;
	height: 100%;
	.warnList-top {
		height: 30px;
	}
	.alarm-top {
		height: 188px;
	}
	.alarm-table {
		flex: 1;
		margin-top: 16px;
		min-height: 0;
	}
}
.alarm-top {
	margin-top: 16px;
	.main-box {
		height: 188px;
	}
}
.warnList-picker {
	width: 256px;
	margin-right: 16px;
}
</style>