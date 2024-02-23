<template>
	<div class="page-column-main" style="padding: 16px">
		<el-row :gutter="16">
			<el-col :span="25">
				<div class="main-box main-top">
					<div class="top-total">
						<div class="top-total-icon">
							<i class="iconfont icon-xitongguanli"></i>
						</div>
						<div class="top-total-name">
							<p>业务系统</p>
							<p>
								<span class="link" @click="toPage('business')">{{ serviceNumber }}</span
								>个
							</p>
						</div>
					</div>
				</div>
			</el-col>
			<el-col :span="25">
				<div class="main-box main-top">
					<div class="top-total">
						<div class="top-total-icon">
							<i class="iconfont icon-fuwuqi"></i>
						</div>
						<div class="top-total-name">
							<p>主机</p>
							<p>
								<span class="link" @click="toPage('host')">{{ hostNumber.total }}</span
								>台
							</p>
						</div>
					</div>
					<div class="top-num">
						<div class="alarm-tall">
							<div class="ball"></div><span @click="toPage('alarm', { type: '主机', level: 3 })">{{ hostNumber.high }}</span>
						</div>
						<div class="alarm-middle">
							<div class="ball"></div><span @click="toPage('alarm', { type: '主机', level: 2 })">{{ hostNumber.centre }}</span>
						</div>
						<div class="alarm-low">
							<div class="ball"></div><span @click="toPage('alarm', { type: '主机', level: 1 })">{{ hostNumber.low }}</span>
						</div>
					</div>
				</div>
			</el-col>
			<el-col :span="25">
				<div class="main-box main-top">
					<div class="top-total">
						<div class="top-total-icon">
							<i class="iconfont icon-wangluotuopu"></i>
						</div>
						<div class="top-total-name">
							<p>网络</p>
							<p>
								<span class="link" @click="toPage('network')">{{ deviceNumber.total }}</span
								>台
							</p>
						</div>
					</div>
					<div class="top-num">
						<div class="alarm-tall">
							<div class="ball"></div><span @click="toPage('alarm', { type: '网络', level: 3 })">{{ deviceNumber.high }}</span>
						</div>
						<div class="alarm-middle">
							<div class="ball"></div><span @click="toPage('alarm', { type: '网络', level: 2 })">{{ deviceNumber.centre }}</span>
						</div>
						<div class="alarm-low">
							<div class="ball"></div><span @click="toPage('alarm', { type: '网络', level: 1 })">{{ deviceNumber.low }}</span>
						</div>
					</div>
				</div>
			</el-col>
			<el-col :span="25">
				<div class="main-box main-top">
					<div class="top-total">
						<div class="top-total-icon">
							<i class="iconfont icon-shujuku"></i>
						</div>
						<div class="top-total-name">
							<p>数据库</p>
							<p>
								<span class="link" @click="toPage('database')">{{ dbNumber.total }}</span
								>台
							</p>
						</div>
					</div>
					<div class="top-num">
						<div class="alarm-tall">
							<div class="ball"></div><span @click="toPage('alarm', { type: '数据库', level: 3 })">{{ dbNumber.high }}</span>
						</div>
						<div class="alarm-middle">
							<div class="ball"></div><span @click="toPage('alarm', { type: '数据库', level: 2 })">{{ dbNumber.centre }}</span>
						</div>
						<div class="alarm-low">
							<div class="ball"></div><span @click="toPage('alarm', { type: '数据库', level: 1 })">{{ dbNumber.low }}</span>
						</div>
					</div>
				</div>
			</el-col>
			<el-col :span="25">
				<div class="main-box main-top">
					<div class="top-total">
						<div class="top-total-icon">
							<i class="iconfont icon-middle"></i>
						</div>
						<div class="top-total-name">
							<p>中间件</p>
							<p>
								<span class="link" @click="toPage('middleware')">{{ metricNumber.total }}</span
								>个
							</p>
						</div>
					</div>
					<div class="top-num">
						<div class="alarm-tall">
							<div class="ball"></div><span @click="toPage('alarm', { type: '中间件', level: 3 })">{{ metricNumber.high }}</span>
						</div>
						<div class="alarm-middle">
							<div class="ball"></div><span @click="toPage('alarm', { type: '中间件', level: 2 })">{{ metricNumber.centre }}</span>
						</div>
						<div class="alarm-low">
							<div class="ball"></div><span @click="toPage('alarm', { type: '中间件', level: 1 })">{{ metricNumber.low }}</span>
						</div>
					</div>
				</div>
			</el-col>
		</el-row>
		<div class="main-box" style=" flex: 1">
			<div class="main-box-title">
				<h5 class="card-title" style="margin-right: 32px">业务</h5>
				<el-form :inline="true" :model="searchData" class="demo-form-inline">
					<el-form-item label="">
						<el-input placeholder="查找业务名称" style="width: 256px" v-model="searchData.name" @input="getPage"></el-input>
					</el-form-item>
					<el-form-item label="告警等级">
						<el-checkbox-group v-model="checkList" class="hops-checkbox" @change="filterByAlarmLevel">
							<el-checkbox :label="1">低</el-checkbox>
							<el-checkbox :label="2">中</el-checkbox>
							<el-checkbox :label="3">高</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-form>
				<div class="large-btn" @click="toPage('largeScreen')"><i class="el-icon-data-board"></i> 大屏视图</div>
			</div>
			<el-row :gutter="16">
				<el-col :span="4" v-for="item in bData">
					<el-card class="box-card" shadow="hover">
						<div
							:class="{ 'box-card-title': true, 'box-card-title-tall': item.level == 3, 'box-card-title-middle': item.level == 2, 'box-card-title-low': item.level == 1 }"
							@click="toPage('business', { id: item.id })"
						>
							<span class="box-card-name">{{ item.name }}</span>
							<span :class="{ 'box-card-num': true, 'tag-danger': item.level == 3, 'tag-warn': item.level == 2, 'tag-success': item.level == 1 }">{{ item.alarm }}</span>
						</div>
						<el-row class="box-card-alarm">
							<el-col :span="6"> <i class="iconfont icon-fuwuqi"></i> {{ item.host }} </el-col>
							<el-col :span="6"> <i class="iconfont icon-wangluotuopu"></i> {{ item.net }} </el-col>
							<el-col :span="6"> <i class="iconfont icon-shujuku"></i> {{ item.db }} </el-col>
							<el-col :span="6"> <i class="iconfont icon-middle"></i> {{ item.middle }} </el-col>
						</el-row>
						<!-- <div class="box-card-ip">{{ item.ip }}</div>
						<div class="box-card-sys">
							<i :class="[{'iconfont': true, 'icon-windows': item.type == 'win', 'icon-linux': item.type == 'linux', 'icon-macos': item.type == 'mac', }]"></i>
							<span>{{ item.system }}</span>
						</div> -->
					</el-card>
				</el-col>
			</el-row>
		</div>
	</div>
</template>
<script>
import ApiHome from '@/api/home'
export default {
	name: 'index',
	data() {
		const endTime = parseInt(new Date().getTime())
		const h = new Date().getHours() * 3600000
		const m = new Date().getMinutes() * 60000
		const s = new Date().getSeconds() * 1000
		const startTime = endTime - 86400000 - (h + m + s)
		return {
			checkList: [1, 2, 3],
			bData: [],
			dbNumber: {
				centre: 0,
				high: 0,
				low: 0,
				total: 0,
			},
			deviceNumber: {
				centre: 0,
				high: 0,
				low: 0,
				total: 0,
			},
			hostNumber: {
				centre: 0,
				high: 0,
				low: 0,
				total: 0,
			},
			metricNumber: {
				centre: 0,
				high: 0,
				low: 0,
				total: 0,
			},
			serviceNumber: 0,
			searchData: {
				startTime: startTime,
				endTime: endTime,
				name: '',
			},
		}
	},
	mounted() {
		this.getList()
		this.getPage()
	},
	methods: {
		getList() {
			ApiHome.data(this.searchData).then((res) => {
				if (res.status === 1) {
					const data = res.data;
					this.dbNumber = data.dbNumber || this.dbNumber;
					this.deviceNumber = data.deviceNumber || this.deviceNumber;
					this.hostNumber = data.hostNumber || this.hostNumber;
					this.metricNumber = data.metricNumber || this.metricNumber;
					this.serviceNumber = data.serviceNumber || this.serviceNumber;
				}
			})
		},
		getPage() {
			const params = {
				startTime: this.searchData.startTime,
				endTime: this.searchData.endTime,
				page: 1,
				pageSize: 99999,
				name: this.searchData.name,
			}
			ApiHome.page(params).then((res) => {
				if (res.status === 1) {
					const data = res.data
					this.bData = data.records.map((item) => {
						const alarmIdList = (item.alarmIdList || []);
						const alarmList = alarmIdList.filter((alarm) => {
							if (this.checkList.indexOf(alarm.level) >= 0) {
								return alarm
							}
						})
						item['alarm'] = alarmList ? alarmList.length : 0
						item['host'] = item.hostNumber//item.hostIdList ? item.hostIdList.length : 0
						item['db'] = item.dbNumber//item.dbIdList ? item.dbIdList.length : 0
						item['net'] = item.networkNumber//item.networkIdList ? item.networkIdList.length : 0
						item['middle'] = item.middlewareNumber//item.middlewareIdList ? item.middlewareIdList.length : 0
						let level = 0
						alarmIdList.map((alarm) => {
							if (alarm.level > level) {
								level = alarm.level
							}
						})
						item['level'] = level
						return item
					})
				}
			})
		},
		filterByAlarmLevel() {
			this.bData = this.bData.map((item) => {
				const alarmList = (item.alarmIdList || []).filter((alarm) => {
					if (this.checkList.indexOf(alarm.level) >= 0) {
						return alarm
					}
				})
				item['alarm'] = alarmList ? alarmList.length : 0;
				let level = 0
				alarmList.map((alarm) => {
					if (alarm.level > level) {
						level = alarm.level
					}
				})
				item['level'] = level
				return item
			})
		},
		toPage(name, params) {
			name = name || 'business'
			params = params || {}
			params.startTime = this.searchData.startTime
			params.endTime = this.searchData.endTime
			this.$router.push({ name: name, params: params })
			sessionStorage.setItem('navAction', name)
			this.$store.commit('updateNavAction', name)
		},
	},
}
</script>
<style lang="scss" scoped>
.main-top {
	height: 92px;
	position: relative;
}
.top-total {
	display: flex;
}
.top-total .top-total-icon {
	width: 56px;
	height: 56px;
	line-height: 56px;
	text-align: center;
	background: rgba(0, 102, 102, 0.1);
	border-radius: 4px;
}
.top-total .top-total-icon i {
	font-size: 32px;
	color: #006666;
}
.top-total .top-total-name {
	padding-left: 16px;
	font-size: 14px;
	color: #799f9f;
}
.top-total .top-total-name span {
	font-size: 28px;
	font-weight: bold;
	color: #006666;
	margin-right: 4px;
}
.top-num {
	position: absolute;
	top: 16px;
	right: 16px;
}
.top-num div {
	flex: 1;
	font-size: 14px;
	span {
		padding-left: 8px;
		cursor: pointer;
		display: inline-block;
		width: 48px;
	}
}
.ball{
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: 50%;
}
.top-num{
	.alarm-tall{
		color: #ff836b;
		.ball{
			background-color: #ff836b;
		}
	}
	.alarm-middle{
		color: #ffd400;
		.ball{
			background-color: #ffd400;
		}
	}
	.alarm-low{
		color: #65ADEB;
		.ball{
			background-color: #65ADEB;
		}
	}
}

.main-box-title {
	display: flex;
	vertical-align: middle;
	position: relative;
}
.main-box-title label {
	font-size: 14px;
	color: #757e7e;
}
.box-card {
	.box-card-title {
		height: 36px;
		background-image: linear-gradient(270deg, #1ec96900 0%, #1ec969 100%);
		line-height: 36px;
		padding: 0 5px;
		border-radius: 2px;
		cursor: pointer;
	}
	.box-card-title-low {
		background-image: linear-gradient(270deg, #65ADEB00 0%, #65ADEB 100%);
	}
	.box-card-title-middle {
		background-image: linear-gradient(270deg, #ffd40000 0%, #ffd400 100%);
	}
	.box-card-title-tall {
		background-image: linear-gradient(270deg, #ff836b00 0%, #ff836b 100%);
	}

	.box-card-name {
		font-size: 16px;
		color: #393939;
	}
	.box-card-num {
		display: block;
		float: right;
		font-size: 18px;
		line-height: 36px;
		border-radius: 50%;
		text-align: center;
		color: #fff;
		font-weight: bold;
	}
	.box-card-alarm {
		color: #799f9f;
		margin-top: 8px;
		font-size: 12px;
	}
}
.box-card-num.tag-danger {
	color: #ff836b;
}
.box-card-num.tag-warn {
	color: #ffd400;
}
.box-card-num.tag-success {
	color: #65ADEB;
}
.box-card .box-card-ip {
	margin-top: 4px;
	font-size: 14px;
	color: #757e7e;
}
.box-card .box-card-sys {
	margin-top: 16px;
}
.box-card .box-card-sys i {
	font-size: 14px;
}
.box-card .box-card-sys span {
	font-size: 12px;
	color: #799f9f;
	padding-left: 4px;
}
.el-row {
	.el-col {
		margin-bottom: 16px;
	}
}
.large-btn{
	background: rgba(0, 102, 102, 0.1);
	color: #006666;
	height: 28px;
	line-height: 28px;
	font-weight: bold;
	border-radius: 4px;
	padding: 0 8px;
	cursor: pointer;
    position: absolute;
    right: 0;
}
</style>