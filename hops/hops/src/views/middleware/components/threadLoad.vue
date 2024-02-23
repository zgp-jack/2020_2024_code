<template>
	<div class="threadLoad">
		<div class="threadLoad-btn">
			<el-input class="search-input" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="name" />
			<div class="common-btn" @click="handleSearch">查询</div>
		</div>
		<ul class="infinite-list">
			<el-collapse v-model="activeName" accordion @change="changeThread">
				<el-collapse-item v-for="(item, index) in splitData" :key="index" :title="item" :name="item">
					<div :id="index + 'NetChart'" class="net-row-chart"></div>
				</el-collapse-item>
			</el-collapse>
		</ul>
	</div>
</template>
<script>
import * as echarts from 'echarts'
import { listMiddle } from '@/api'
// import { trimAll } from '@/utils/util.js'
export default {
	name: 'threadLoad',
	props: ['threadData', 'searchData', 'threadId'],
	data() {
		return {
			start: 0,
			activeName: '',
			splitData: [],
			name: '',
			option: {
				tooltip: {
					trigger: 'axis',
					appendToBody: true,
					formatter: (params) => {
						let str = `${params[0].data[0]}<br/>${params[0].data[1]}`
						for (let i = 2; i < params[0].data.length; i++) {
							str += `<br/>${params[0].data[i].name}: ${params[0].data[i].value}`
						}
						return str
					},
				},
				grid: {
					top: '3%',
					left: '0%',
					right: '3%',
					bottom: '10%',
					containLabel: true,
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
				xAxis: {
					type: 'category',
					splitNumber: 24,
					nameTextStyle: {
						fontWeight: 'bold',
					},
				},
				yAxis: {
					type: 'category',
					nameGap: 50,
					splitLine: {
						show: true,
					},
					data: ['NEW', 'RUNNABLE', 'BLOCKED', 'WAITING', 'TIMED_WAITING', 'TERMINATED'],
				},
				series: [
					{
						type: 'line',
					},
				],
			},
		}
	},
	mounted() {
		this.splitData = JSON.parse(JSON.stringify(this.threadData))
	},
	methods: {
		drawChart(id) {
			var myChart = echarts.init(document.getElementById(id))
			myChart.setOption(this.option)
		},
		handleSearch() {
			if (this.name) {
				this.splitData = this.threadData.filter((item) => {
					return item.indexOf(this.name) > 0
				})
			} else {
				this.splitData = JSON.parse(JSON.stringify(this.threadData))
			}
		},
		changeThread(name) {
			if (name) {
				let params = {
					threadName: name,
					monitorId: this.threadId,
					...this.searchData,
				}
				listMiddle('thread', params).then((res) => {
					if (res.status == 1) {
						let echartData1 = []
						let echartData2 = []
						res.data.forEach((item) => {
							echartData1.push([
								this.dayjs(item.time * 1000).format('YYYY-MM-DD HH:mm:ss'),
								item.threadState,
								{ name: '阻塞时间', value: item.blockedTime },
								{ name: '阻塞次数', value: item.blockedCount },
								{ name: '等待时间', value: item.waitedTime },
								{ name: '等待次数', value: item.waitedCount },
								{ name: '锁名称', value: item.lockName },
								{ name: '所有者', value: item.lockOwnerName },
							])
						})
						this.option.series[0].data = echartData1
						this.drawChart(this.splitData.indexOf(name) + 'NetChart')
					}
				})
			}
		},
		load() {
			this.start += 10
			for (let i = 0; i < 10 && this.splitData.length < this.threadData.length; i++) {
				this.splitData.push(this.threadData[i + this.start])
			}
		},
	},
}
</script>
<style scoped>
.infinite-list {
	width: 100%;
	margin-top: 16px;
	padding-left: 0;
	height: 400px;
	overflow: auto;
}
.threadLoad-btn {
	display: flex;
	margin-top: 16px;
}
.search-input {
	width: 150px;
	margin-right: 8px;
}
.net-row-chart {
	height: 240px;
	width: 740px;
}
</style>