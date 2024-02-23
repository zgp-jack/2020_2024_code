<template>
	<div style="height: 100%; position: relative;">
		<el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label="">
				<el-input v-model="formInline.serviceName" placeholder="名称/影响范围"></el-input>
			</el-form-item>
			<el-form-item label="">
				<el-select v-model="formInline.monitorTypeId" placeholder="告警分类" multiple>
					<el-option v-for="(item, key) in typeList" :key="key" :label="item.typeName" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="">
				<el-select v-model="formInline.level" placeholder="告警等级" multiple>
					<el-option v-for="(item, key) in levelObg" :key="key" :label="item" :value="key"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="">
				<el-select v-model="formInline.processStatus" placeholder="通知状态" multiple>
					<el-option v-for="(item, key) in proStatusObj" :key="key" :label="item" :value="key"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="">
				<el-select v-model="formInline.status" placeholder="恢复状态" multiple>
					<el-option v-for="(item, key) in statusObj" :key="key" :label="item" :value="key"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<div class="common-btn" @click="handleSearch">查询</div>
			</el-form-item>
		</el-form>
		<!-- v-if="updateRow != 0" -->
		<div v-if="updateRow != 0" class="data-msg">正在等待上报数据处理成功({{ updateRow }})</div>
		<el-table :data="tableData" height="calc(100% - 98px)" align="center" @sort-change="handleSortChange">
			<el-table-column prop="name" label="名称" show-overflow-tooltip> </el-table-column>
			<el-table-column prop="alarmValue" label="告警值"  width="80" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{scope.row.alarmValue}}{{scope.row.unit}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="threshold" label="参考值"  width="80" show-overflow-tooltip> </el-table-column>
			<el-table-column prop="serviceName" label="影响范围"  width="130" show-overflow-tooltip> </el-table-column>
			<el-table-column prop="monitorName" label="监测对象"  width="130" show-overflow-tooltip> </el-table-column>
			<el-table-column prop="typeName" label="告警分类" width="80"> </el-table-column>
			<el-table-column prop="levelStr" label="告警等级" width="80">
				<template slot-scope="scope">
					<span :class="'alarm-level-' + scope.row.level" v-show="scope.row.level === 1">低</span>
					<span :class="'alarm-level-' + scope.row.level" v-show="scope.row.level === 2">中</span>
					<span :class="'alarm-level-' + scope.row.level" v-show="scope.row.level === 3">高</span>
				</template>
			</el-table-column>
			<el-table-column prop="beginTimeStr" label="开始时间" width="180" sortable="custom"> </el-table-column>
			<el-table-column prop="endTimeStr" label="恢复时间" width="180" sortable="custom"> </el-table-column>
			<el-table-column prop="duration" label="持续时间" width="140" sortable="custom" show-overflow-tooltip> </el-table-column>
			<el-table-column label="通知状态" width="100">
				<template slot-scope="scope">
					<!-- <span :class="['process-status-item', 'process-status-' + scope.row.processStatus]"></span> -->
					{{ proStatusObj[scope.row.processStatus] || '--' }}
				</template>
			</el-table-column>
			<el-table-column prop="statusStr" label="恢复状态" width="80">
				<template slot-scope="scope">
					<i v-show="scope.row.status === 1" style="color: #1ec969;" class="el-icon-success"></i>
					<i v-show="scope.row.status === 0" style="color: #ff836b;" class="el-icon-error"></i>
				</template>
			</el-table-column>
			<el-table-column label="处理" width="60">
				<template slot-scope="scope">
					<el-tooltip v-if="scope.row.noProcess === 0" content="标记为无需处理" placement="top">
						<i class="iconfont icon-jinzhi common-btn" @click="handleRuleNoProcess(scope.row)"></i>
					</el-tooltip>
					<el-tooltip v-else content="继续处理" placement="top">
						<i class="common-btn iconfont icon-circle-double-right" @click="handleRuleNoProcessDel(scope.row)"></i>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template slot-scope="scope">
					<div class="common-btn" @click="handleView(scope.row)">查看</div>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			style="float: right; margin-top: 16px"
			@current-change="handleCurrentChange"
			:current-page.sync="currentPage"
			:page-size="pageSize"
			:page-sizes="[10, 20, 50, 100]"
			layout="sizes,total,prev, pager, next, jumper"
			@size-change="handleSizeChange"
			:total="total"
		>
		</el-pagination>
		<el-dialog :title="title" :visible.sync="visible" width="550px" v-if="visible">
			<ruleNoProcess :detailData="processData" @handleSubmit="handleSubmit" @handleClose="handleClose" :del="processDel"></ruleNoProcess>
		</el-dialog>
	</div>
</template>
<script>
import { formatTime } from '@/utils/util'
import ApiAlarm from '@/api/alarm'
const RULETYPE = JSON.parse(sessionStorage.getItem('RuleType'));
import { mapState } from 'vuex';
export default {
	name: 'listable',
	components: {
		ruleNoProcess: () => import('@/components/ruleNoProcess.vue'),
	},
	props: {
		timeList: {
			type: Array,
		}
	},
	data() {
		return {
			formInline: {
				serviceName: '',
				startTime: this.timeList[0],
				endTime: this.timeList[1],
				level: [],
				processStatus: [],
				status: [],
				monitorTypeId: []
			},
			tableData: [],
			pageSize: 20,
			currentPage: 1,
			total: 0,
			proStatusObj: { 0: '通知中', 1: '处理中', 2: '已处理' },
			levelObg: { 1: '低', 2: '中', 3: '高' },
			statusObj: { 0: '未恢复', 1: '恢复' },
			typeList: RULETYPE.filter(item => item.pid === 0),
			processData: {},
			visible: false,
			title: '无需处理',
			processDel: false,
			updateRow: 0
		}
	},
    computed: {
        ...mapState({
            alarmTableReload:  state => state.alarmTableReload
        })
    },
	mounted() {
		this.setParams()
	},
	methods: {
		setFilter(item) {
			this.formInline = {
				serviceName: '',
				startTime: this.timeList[0],
				endTime: this.timeList[1],
				level: [],
				processStatus: [],
				status: [],
				monitorTypeId: []
			};
			switch(item.name){
				case '主机':
				case '网络':
				case '中间件':
				case '数据库':
					this.formInline.monitorTypeId = this.typeList.filter(t => t.typeName === item.name).map(m => m.id);
				break;
				case '低':
					this.formInline.level = ['1'];
				break;
				case '中':
					this.formInline.level = ['2'];
				break;
				case '高':
					this.formInline.level = ['3'];
				break;
				case 'time':
					this.formInline.startTime = item.value;
					this.formInline.endTime = item.value;
				break;
				default: break;
			}
			this.currentPage = 1;
			if(item.name === 'time') {
				this.getPageStartTime()
			} else {
				this.getList();
			}
			
		},
		setParams() {
			const params = this.$route.params;
			const type = params.type;
			const level = params.level;
			const status = params.status;
			const startTime = params.startTime;
			const endTime = params.endTime;
			if(!!type) {
				this.formInline.monitorTypeId = this.typeList.filter(item => item.typeName === type).map(item => item.id);
			}
			if(!!level) {
				this.formInline.level = [level+''];
			}
			if(status != null || status != undefined) {
				this.formInline.status = [status+''];
			}
			if(startTime) {
				this.formInline.startTime = startTime;
			}
			if(endTime) {
				this.formInline.endTime = endTime;
			}
			this.handleSearch();
		},
		handleSearch() {
			this.formInline.startTime = this.timeList[0];
			this.formInline.endTime = this.timeList[1];
			this.currentPage = 1;
			this.getList()
		},
		getPageStartTime() {
			let params = {
				page: this.currentPage,
				pageSize: this.pageSize,
				...this.formInline
			}
			ApiAlarm.startTime(params).then((res) => {
				if (res.status === 1) {
					const data = res.data
					this.total = data.total
					this.tableData = data.records.map((item) => {
						item['beginTimeStr'] = this.dayjs(item.beginTime).format('YYYY-MM-DD HH:mm:ss')
						item['endTimeStr'] = item.endTime ? this.dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss') : ''
						item['duration'] = formatTime(parseInt((item.duration) / 1000))
						item['levelStr'] = this.levelObg[item.level]
						item['statusStr'] = this.statusObj[item.status] || '-'
						return item
					})
				}
			})
		},
		handleSortChange(obj) {
			let field = obj.prop;
			if(field === 'beginTimeStr') {
				field = 'begin_time';
			}
			if(field === 'endTimeStr') {
				field = 'end_time';
			}
            this.formInline['field'] = field;
            if(obj.order == "ascending") {
                this.formInline.sort = 'asc';
            }else if(obj.order == "descending") {
                this.formInline.sort = 'desc';
            }else{
                this.formInline.sort = undefined;
                this.formInline.field = undefined;
            }
			this.currentPage = 1;
            this.getList();
		},
		getList(cb) {
			let params = {
				page: this.currentPage,
				pageSize: this.pageSize,
				...this.formInline
			}
			ApiAlarm.page(params).then((res) => {
				if (res.status === 1) {
					const data = res.data
					this.total = data.total
					this.tableData = data.records.map((item) => {
						item['beginTimeStr'] = this.dayjs(item.beginTime).format('YYYY-MM-DD HH:mm:ss')
						item['endTimeStr'] = item.endTime ? this.dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss') : ''
						item['duration'] = formatTime(parseInt((item.duration / 1000)));
						item['levelStr'] = this.levelObg[item.level]
						item['statusStr'] = this.statusObj[item.status] || '-';
						// if(item.id === this.updateRowId) {
						// 	if(item['noProcess'] === 0) {
						// 		item['noProcess'] = 2;
						// 	} else {
						// 		this.updateRowId = null;
						// 	}
						// }
						return item
					})
					if(typeof(cb) === 'function') {
						cb();
					}
				}
			})
		},
		handleCurrentChange(val) {
			this.currentPage = val
			this.getList()
		},
		handleSizeChange: function (val) {
			this.currentPage = 1
			this.pageSize = val
			this.getList()
		},
		handleView(row) {
			let path = 'host';
			const selectRowType = RULETYPE.filter(item => item.typeName === row.typeName);
			if(selectRowType.length > 0) {
				const pid = selectRowType[0].pid || selectRowType[0].id;
				const type = RULETYPE.filter(item => item.id === pid);
				switch(type[0].typeName) {
					case '主机':
						path = 'host';
					break;
					case '网络':
						path = 'network';	
					break;
					case '中间件':
						path = 'middleware';	
					break;
					case '数据库':
						path = 'database';	
					break;
					default: break;
				}
				this.$router.push({name: path, params: {id: row.monitorId}});
				sessionStorage.setItem('navAction', path)
				this.$store.commit('updateNavAction', path)
			}
			
		},
		handleRuleNoProcess(row) {
			this.processDel = false;
			this.processData = row;
			this.visible = true;
		},
		handleRuleNoProcessDel(row) {
			this.processDel = true;
			this.processData = row;
			this.visible = true;
		},
		handleClose() {
			this.visible = false;
		},
		handleSubmit(change) {
			if(change) {
				this.updateRow++;
			}
			this.getList();
			this.handleClose();
		}
	},
	watch: {
        alarmTableReload(val) {
            if(val === true) {
                this.getList(() => {
					this.$store.commit('updateOldList', false);
					this.updateRow = 0;
				});
            }
        }
    }
}
</script>
<style scoped lang="scss">
.process-status-item {
	background-color: #006666;
	width: 12px;
	height: 12px;
	display: inline-block;
	border-radius: 12px;
}
.alarm-level-1 {
	color: #fff;
	background-color: #65ADEB;
	width: 26px;
	border-radius: 50%;
	display: inline-block;
	text-align: center;
}
.alarm-level-2 {
	color: #fff;
	background-color: #ffd400;
	width: 26px;
	border-radius: 50%;
	display: inline-block;
	text-align: center;
}
.alarm-level-3 {
	color: #fff;
	background-color: #ff836b;
	width: 26px;
	border-radius: 50%;
	display: inline-block;
	text-align: center;
}
.data-msg{
	position: absolute;
	right: 0;
	top: 32px;
	font-size: 12px;
}
</style>