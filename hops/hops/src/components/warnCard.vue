<template>
	<div class="warnCard">
		<p class="warnCard-top">
			<span
				:class="['warnCard-grade', cardData.level == 3 && 'warnCard-grade-high', cardData.level == 2 && 'warnCard-grade-medium', cardData.level == 1 && 'warnCard-grade-low']"
				>{{ cardData.level == 1 ? '低' : cardData.level == 2 ? '中' : '高' }}</span
			>
			<span class="warnCard-title">{{ cardData.typeName }}状态告警</span>
			<span class="warnCard-ip">{{ cardData.monitorIp }}</span>
		</p>
		<p class="warnCard-text">
			{{
				'业务（' +
				(cardData.serviceName || '-') +
				'），' +
				(cardData.typeName || '-') +
				'(' +
				(cardData.monitorIp || '-') +
				'），' +
				'位于（' +
				(cardData.monitorPosition || '-') +
				'），' +
				(cardData.name || '-') +
				'（' +
				(getunit(cardData.unit, cardData.alarmValue) || '-') +
				'）。'
			}}
		</p>
		<div class="warnCard-bottom">
			<p class="warnCard-item warnCard-gap">
				<span>开始时间：{{ cardData.beginTime ? dayjs(cardData.beginTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}</span>
				<span style="margin-left: 12px; width: 145px">
					处理人：
					<span class="item-name">{{cardData.makeUserToName || '-'}}</span>
				</span>
			</p>
			<p class="warnCard-item">
				<span>恢复时间：{{ cardData.endTime ? dayjs(cardData.endTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}</span>
				<span style="margin-left: 12px; width: 145px">
					处理状态：
					<!-- item-circle item-circle-processed -->
					<span class="item-name" v-if="showIcon">-</span>
					<template v-else>
						<span class="btn-no-process" v-if="cardData.noProcess === 0">
							<span class="item-name">{{ cardData.currStateToName || '-' }}</span>
							<el-tooltip content="标记为无需处理" placement="top">
								<i class="iconfont icon-jinzhi" @click="handleRuleNoProcess"></i>
							</el-tooltip>
						</span>
						<span class="btn-no-process" @click="handleDelRuleNoProcess" v-else>
							<span class="item-name" style="width: 66px"><span class="ball warnCard-grade-medium"></span>无需处理 </span>
							<el-tooltip content="继续处理" placement="top">
								<i style="font-size: 14px; font-weight: bold" class="iconfont icon-circle-double-right"></i>
							</el-tooltip>
						</span>
					</template>
				</span>
			</p>
		</div>
		<el-dialog :title="title" :visible.sync="visible" width="550px" v-if="visible">
			<ruleNoProcess :del="visibleDel" :detailData="cardData" @handleSubmit="handleSubmit" @handleClose="handleClose"></ruleNoProcess>
		</el-dialog>
	</div>
</template>
<script>
import { getMaxUnitByFlow } from '@/utils/util'
export default {
	name: 'warnCard',
	props: ['cardData', 'showIcon'],
	components: {
		ruleNoProcess: () => import('@/components/ruleNoProcess.vue'),
	},
	data() {
		return {
			visible: false,
			title: '无需处理',
			visibleDel: false,
		}
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
		handleRuleNoProcess() {
			this.visible = true
		},
		handleClose() {
			this.visible = false
		},
		handleSubmit() {
			this.handleClose()
			this.$emit('reloadList')
		},
		handleDelRuleNoProcess() {
			this.title = '删除'
			this.visible = true
			this.visibleDel = true
		},
	},
}
</script>
<style scoped>
.warnCard {
	width: 100%;
	background-color: transparent;
	margin-bottom: 8px;
}
.warnCard::after {
	content: '';
	display: block;
	width: 100%;
	height: 1px;
	margin-top: 16px;
	margin-bottom: 16px;
	background-color: #f0f7f7;
}
.warnCard:last-child::after {
	display: none;
}
.warnCard-top {
	font-size: 14px;
	color: #282827;
	margin-bottom: 4px;
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
.warnCard-ip {
	margin-left: 16px;
}
.warnCard-text {
	font-size: 14px;
	color: #757e7e;
	margin-bottom: 4px;

	display: -webkit-box;
	overflow: hidden;
	white-space: normal !important;
	text-overflow: ellipsis;
	word-wrap: break-word;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
}
.warnCard-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 12px;
	color: #799f9f;
}
.warnCard-gap {
	/* margin-bottom: 4px; */
}
.item-name {
	display: inline-block;
	width: 50px;
}
.item-circle::before {
	content: '';
	display: inline-block;
	width: 10px;
	height: 10px;
	margin-right: 4px;
	border-radius: 50%;
}
.item-circle-processed::before {
	background: #757e7e;
}
.item-circle-processing::before {
	background: #1ec969;
}
.item-circle-process::before {
	background: #ff836b;
}
.btn-no-process {
	cursor: pointer;
}
.ball {
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	margin-right: 2px;
}
</style>