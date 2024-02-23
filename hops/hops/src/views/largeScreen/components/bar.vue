<template>
	<div class="large-bar-box">
		<div class="large-bar-cell" v-for="(item, index) in tableData" :key="index">
			<div class="large-bar-label">
				<span v-if="showIndex" :class="['large-index', 'large-index-' + index]">{{ index + 1 }}</span>
				<el-tooltip :content="item.name" placement="top">
					<span class="large-bar-name">{{ item.name }}</span>
				</el-tooltip>
			</div>
			<div :class="{ 'large-bar-value': true, 'percentage-index': showIndex }">
				<el-progress :percentage="item.value" :class="'percentage-' + index" :show-text="false"></el-progress>
				<p class="large-bar-num">{{ item.num || 0 }} <span v-if="item.unit">{{ item.unit }}</span></p>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		tableData: {
			type: Array,
			default: () => {
				return [
					{ name: '内存预警', value: 100, unit: '' },
					{ name: '主机告警状态', value: 50, unit: '' },
					{ name: 'XX故障', value: 35, unit: '' },
					{ name: 'XX故障', value: 20, unit: '' },
					{ name: 'XX故障', value: 8, unit: '' },
					{ name: 'XX故障', value: 4, unit: '' },
				]
			},
		},
		showIndex: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {}
	},
}
</script>
<style lang="scss" scoped>
.large-bar-box {
	height: auto;
}
.large-bar-cell:last-child {
	margin-bottom: 0;
}
.large-bar-cell {
	display: flex;
	margin-bottom: 16px;
	margin-right: 16px;
	.large-bar-label {
		width: 110px;
		.large-index {
			width: 22px;
			height: 22px;
			border-radius: 4px;
			color: #006666;
			background: #dde9e8;
			display: inline-block;
			text-align: center;
			vertical-align: middle;
			margin-right: 10px;
		}
		.large-index-0 {
			background: #ff836b;
			color: #fff;
		}
		.large-index-1 {
			background: #ffbc00;
			color: #fff;
		}
		.large-index-2 {
			background: #65adeb;
			color: #fff;
		}
		.large-bar-name {
			font-size: 12px;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			display: inline-block;
			width: 78px;
			height: 22px;
			line-height: 22px;
			vertical-align: middle;
		}
	}
	.large-bar-value {
		flex: 1;
		min-width: 0;
	}
	.large-bar-num {
		display: inline-block;
		width: 58px;
		text-overflow: ellipsis;
		overflow: hidden;
		text-align: right;
		vertical-align: middle;
	}
}
</style>
<style>
.large-bar-box .el-progress {
	width: calc(100% - 60px);
	display: inline-block;
}
.large-bar-box .el-progress-bar__outer {
	height: 8px !important;
	border-radius: 2px;
}
.large-bar-box .el-progress-bar__inner {
	height: 8px !important;
	border-radius: 2px;
	background: linear-gradient(270deg, #006666 0%, #cce0e0 100%);
}
.percentage-index .percentage-0 .el-progress-bar__inner {
	background: linear-gradient(270deg, #ff836b 0%, #ffe6e1 100%);
}
.percentage-index .percentage-1 .el-progress-bar__inner {
	background: linear-gradient(270deg, #ffbc00 0%, #fff2cc 100%);
}
.percentage-index .percentage-2 .el-progress-bar__inner {
	background: linear-gradient(270deg, #65adeb 0%, #e0effb 100%);
}
</style>