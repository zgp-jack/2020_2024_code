<template>
	<el-carousel v-if="carouselData.length" height="32px" direction="vertical" indicator-position="none">
		<el-carousel-item v-for="item in carouselData" :key="item.id">
			<div class="carousel-item">
				<span :class="['warnCard-grade', item.level == 3 && 'warnCard-grade-high', item.level == 2 && 'warnCard-grade-medium', item.level == 1 && 'warnCard-grade-low']">{{
					item.level == 1 ? '低' : item.level == 2 ? '中' : '高'
				}}</span>
				<span :title="item.typeName" class="warnCard-title">{{ item.typeName }}状态告警</span>
				<span :title="item.monitorIp" class="warnCard-ip">{{ item.monitorIp }}</span>
				<span :title="(item.name || '') + '（' + (getunit(item.unit, item.alarmValue) || '') + '）。'" class="carousel-text">{{
					'业务（' +
					(item.serviceName || '-') +
					'），' +
					(item.typeName || '-') +
					'(' +
					(item.monitorIp || '-') +
					'），' +
					'位于（' +
					(item.monitorPosition || '-') +
					'），' +
					(item.name || '-') +
					'（' +
					(getunit(item.unit, item.alarmValue) || '-') +
					'）。'
				}}</span>
				<span :class="['carousel-status', item.status == 1 && 'carousel-status-restored']">{{ item.status == 1 ? '已恢复' : '未恢复' }}</span>
				<span :class="['carousel-process', item.noProcess == 0 && 'carousel-process-not']">{{ item.noProcess == 0 ? '无需处理' : '-' }}</span>
			</div>
		</el-carousel-item>
	</el-carousel>
</template>
<script>
import { ApiNetworkList } from '@/api'
export default {
	name: 'carousel',
	props: ['planId'],
	data() {
		return {
			carouselData: [],
		}
	},
	mounted() {
		this.getList()
	},
	methods: {
		getunit(unit, val) {
			if (!unit) {
				return parseFloat(Number(val).toFixed(2)) + '个'
			} else if (unit == 'b/s') {
				let { num, unit } = getMaxUnitByFlow(val)
				return parseFloat(num.toFixed(2)) + unit
			} else {
				return parseFloat(Number(val).toFixed(2)) + unit
			}
		},
		getList() {
			const endTime = parseInt(new Date().getTime())
			const h = new Date().getHours() * 3600000
			const m = new Date().getMinutes() * 60000
			const s = new Date().getSeconds() * 1000
			const startTime = endTime - 86400000 - (h + m + s)
			let params = {
				endTime: endTime,
				startTime: startTime,
				planId: this.planId,
			}
			ApiNetworkList('/alarm/topList', params).then((res) => {
				let data = res.data || []
				if (res.status === 1) {
					this.carouselData = data
				}
			})
		},
	},
}
</script>
<style scoped>
.carousel-item {
	display: flex;
	align-items: center;
	justify-content: center;
	line-height: 32px;
}
.warnCard-grade {
	display: inline-block;
	width: 23px;
	height: 23px;
	margin-right: 4px;
	line-height: 23px;
	font-size: 12px;
	border-radius: 50%;
	text-align: center;
	color: #fff;
}
.warnCard-grade-high {
	background: #ff836b;
}
.warnCard-grade-medium {
	background: #ffd400;
}
.warnCard-grade-low {
	background: #65adeb;
}
.warnCard-title {
	display: inline-block;
	width: 96px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
.warnCard-ip {
	display: inline-block;
	width: 90px;
	margin-left: 16px;
	margin-right: 16px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
.carousel-text {
	display: inline-block;
	width: 400px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
.carousel-status {
	margin-left: 16px;
	margin-right: 16px;
	color: #ff836b;
}
.carousel-status-restored {
	color: #1ec969;
}
.carousel-process {
	display: inline-block;
	width: 70px;
}
.carousel-process::before {
	content: '';
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color: #757e7e;
	margin-right: 4px;
}
.carousel-process-not::before {
	background-color: #ffd400;
}
</style>