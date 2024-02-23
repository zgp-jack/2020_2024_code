<template>
	<div :class="{ close: !show, warnList: true, warnMain: showFilter }">
		<div v-if="showTop" class="warnList-top">
			<!-- <template v-if="showFilter">
				<el-input class="search-input" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="input2"> </el-input>
				<div class="common-btn">查询</div>
			</template> -->
		</div>
		<div
			:class="['warnList-main', { 'large-card': type === 2 }]"
			:style="{ height: showFilter ? 'calc(100% - 48px)' : '100%', backgroundColor: showIcon ? 'transparent' : '#fff' }"
		>
			<div class="main-txt" v-if="showFilter">
				<div class="main-top">
					<p class="warnList-title">告警消息</p>
					<div class="main-group">
						<p class="group-title">告警等级</p>
						<el-checkbox-group v-model="checkList" @change="changeLevel">
							<el-checkbox class="level-high" :label="3">高</el-checkbox>
							<el-checkbox class="level-middle" :label="2">中</el-checkbox>
							<el-checkbox class="level-low" :label="1">低</el-checkbox>
						</el-checkbox-group>
					</div>
				</div>
				<div class="main-top">
					<div class="warn-pagination"></div>
					<div class="main-group">
						<p class="group-title">告警状态</p>
						<el-checkbox-group v-model="status" @change="changeLevel">
							<el-checkbox class="status-recovered" :label="1">已恢复</el-checkbox>
							<el-checkbox class="status-recovery" :label="0">未恢复</el-checkbox>
						</el-checkbox-group>
					</div>
				</div>
			</div>
			<div v-else :class="['network-main-warn-title', { 'large-label-big': type === 2 }]">
				<p class="warnList-title">告警消息</p>
				<div class="main-top">
					<div class="main-group">
						<p class="group-title">告警等级</p>
						<el-checkbox-group v-model="checkList" @change="changeLevel">
							<el-checkbox class="level-high" :label="3">高</el-checkbox>
							<el-checkbox class="level-middle" :label="2">中</el-checkbox>
							<el-checkbox class="level-low" :label="1">低</el-checkbox>
						</el-checkbox-group>
					</div>
					<div class="main-group">
						<p class="group-title">告警状态</p>
						<el-checkbox-group v-model="status" @change="changeLevel">
							<el-checkbox class="status-recovered" :label="1">已恢复</el-checkbox>
							<el-checkbox class="status-recovery" :label="0">未恢复</el-checkbox>
						</el-checkbox-group>
					</div>
				</div>
			</div>
			<!-- <el-row class="warnList-search" :gutter="16">
				<el-col :span="12">
					<el-input class="search-input" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="input2"> </el-input>
				</el-col>
				<el-col :span="12">
					<el-select v-model="value" placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
					</el-select>
				</el-col>
			</el-row> -->
			<el-scrollbar v-if="cardList.length" class="warnList-scroll" :style="{ height: showFilter ? 'calc(100% - 87px)' : '100%', marginTop: showFilter ? '16px' : '0px' }">
				<div class="warnList-warnCard">
					<ul class="list" v-infinite-scroll="load" infinite-scroll-immediate="false" :infinite-scroll-disabled="disabled" infinite-scroll-distance="0">
						<li v-for="item in cardList" class="list-item" :key="item.id">
							<WarnCard :key="item.id" :cardData="item" @reloadList="reloadList" :showIcon="showIcon"></WarnCard>
						</li>
					</ul>
					<p class="loading" v-if="loading">加载中...</p>
					<p class="loading" v-if="noMore">没有更多了</p>
				</div>
			</el-scrollbar>
			<el-empty v-else class="warnList-empty" :image="require('../assets/table-empty.png')"></el-empty>
		</div>
		<div :class="['collapsed-right', showIcon && 'close']" @click="handleCollapsed()">
			<i class="el-icon-caret-left" v-show="!show"></i>
			<i class="el-icon-caret-right" v-show="show"></i>
		</div>
	</div>
</template>
<script>
import ApiAlarm from '@/api/alarm'
export default {
	name: 'warnList',
	props: {
		showFilter: {
			type: Boolean,
			default: true,
		},
		monitorTypeId: {
			default: -1,
		},
		businessId: {
			type: Number | String,
		},
		searchData: {
			type: Object,
		},
		showTop: {
			type: Boolean,
			default: true,
		},
		showIcon: {
			type: Boolean,
			default: false,
		},
		planId: {
			default: null,
		},
		refresh: {
			type: Boolean,
			default: false,
		},
		isIndex: {
			type: Boolean,
			default: false,
		},
		typeId: {
			type: String,
			default: undefined,
		},
		type: {
			default: 1,
		},
	},
	components: {
		WarnCard: () => import('./warnCard.vue'),
	},
	data() {
		return {
			value: '',
			input2: '',
			checkList: [3, 2, 1],
			status: [0, 1],
			cardList: [],
			show: true,
			currentPage: 1,
			total: 0,
			timer: null,
			loading: false,
		}
	},
	computed: {
		noMore() {
			let more = 0
			if (this.total % 20 == 0 && this.total != 0) {
				more = Math.floor(this.total / 20)
			} else {
				more = Math.floor(this.total / 20) + 1
			}
			return this.currentPage >= more
		},
		disabled() {
			return this.loading || this.noMore
		},
	},
	mounted() {
		const cycle = this.$store.state.config.bigScreenCycle || 60000
		this.getList()
		if (!!this.refresh) {
			this.timer = setInterval(() => {
				this.reloadList()
			}, cycle)
		}
	},
	beforeDestroy() {
		clearInterval(this.timer)
	},
	methods: {
		reloadList() {
			const endTime = new Date().getTime()
			const startTime = endTime - 86400000
			this.getList({ startTime, endTime })
		},
		load(time) {
			if (this.noMore) {
				return
			}
			this.currentPage++
			let params = {
				page: this.currentPage,
				pageSize: 20,
				monitorTypeId: this.monitorTypeId == -1 ? [] : [this.monitorTypeId],
				monitorId: this.monitorTypeId == -1 ? [] : [this.businessId],
				level: [...this.checkList],
				startTime: time ? time.startTime : this.searchData.startTime,
				endTime: time ? time.endTime : this.searchData.endTime,
				status: this.status,
				planId: this.planId,
			}
			if (!!this.businessId) {
				params['businessId'] = this.monitorTypeId == -1 ? [this.businessId] : undefined
				params.planId = undefined
			}
			this.loading = true
			ApiAlarm.page(params).then((res) => {
				if (res.status == 1) {
					this.loading = false
					this.cardList = [...this.cardList, ...res.data.records]
				}
			})
		},
		handleCurrentChange(val) {
			this.currentPage = val
			this.getList()
		},
		getList(time) {
			this.cardList = []
			let params = {
				page: this.currentPage,
				pageSize: 20,
				monitorTypeId: this.monitorTypeId == -1 ? [] : [this.monitorTypeId],
				monitorId: this.monitorTypeId == -1 ? [] : [this.businessId],
				level: [...this.checkList],
				startTime: time ? time.startTime : this.searchData.startTime,
				endTime: time ? time.endTime : this.searchData.endTime,
				status: this.status,
				planId: this.planId,
			}
			if (!!this.businessId) {
				params['businessId'] = this.monitorTypeId == -1 ? [this.businessId] : undefined
				params.planId = undefined
			}
			ApiAlarm.page(params).then((res) => {
				if (res.status == 1) {
					this.total = res.data.total
					this.cardList = res.data.records
				}
			})
		},
		changeLevel(newV) {
			this.currentPage = 1
			this.getList()
		},
		handleCollapsed() {
			this.show = !this.show
			this.$emit('collapsed', this.show)
		},
	},
	watch: {
		businessId(newV, oldV) {
			if (newV && this.typeId == undefined) {
				this.currentPage = 1
				this.getList()
			}
		},
		planId(newV, oldV) {
			if (newV) {
				this.currentPage = 1
				this.getList()
			}
		},
		typeId() {
			this.currentPage = 1
			this.getList()
		},
		'searchData.startTime': {
			handler: function() {
				this.currentPage = 1
				this.getList()
			}
		},
		'searchData.endTime': {
			handler: function() {
				this.currentPage = 1
				this.getList()
			}
		}
	},
}
</script>
<style lang="scss" scoped>
.warnMain {
	// height: 100%;
	position: relative;
}
.warnList {
	height: 100%;
	// position: relative;
}
.warnList-top {
	display: flex;
	justify-content: space-between;
	height: 32px;
	margin-bottom: 16px;
}
.warnList-picker {
	width: 75%;
}
.warnList-main {
	height: calc(100% - 48px);
	padding: 16px;
	background-color: #fff;
}
.main-txt {
	padding-bottom: 16px;
	border-bottom: 1px solid #f0f7f7;
}
.main-top {
	display: flex;
	justify-content: space-between;
	height: 27px;
}
.warnList-title {
	// width: 30%;
	font-size: 18px;
	color: #282827;
}
.main-group {
	width: 210px;
	display: flex;
	align-items: center;
}
.group-title {
	margin-right: 8px;
	font-size: 14px;
	color: #757e7e;
}
.warnList-search {
	margin-top: 16px;
	margin-bottom: 16px;
}
.search-input {
	width: 70%;
}
.warnList-scroll {
	height: calc(100% - 87px);
	margin-right: -16px;
	margin-top: 16px;
}
.warnList-empty {
	height: calc(100% - 46px);
}
.warnList-warnCard {
	padding-right: 16px;
}
.warnList.close {
	width: 0px;
	transition: width 0.3s ease-in-out;
	padding: 0;
	* {
		display: none;
	}
	.collapsed-right {
		left: -16px;
		display: block;
		i {
			display: inline;
		}
	}
}
.collapsed-right {
	position: absolute;
	top: 50%;
	left: 0;
	width: 16px;
	height: 32px;
	line-height: 32px;
	background-color: #ccc;
	cursor: pointer;
	color: #fff;
	z-index: 1;
}
.collapsed-right.close {
	display: none;
}
.warn-pagination {
	position: relative;
	width: 90px;
	margin-left: -16px;
}
.warn-pagination-text {
	position: absolute;
	left: 40px;
	top: 1px;
}
.loading {
	text-align: center;
	color: #bfcbd1;
}
.network-main-warn-title {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
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
</style>