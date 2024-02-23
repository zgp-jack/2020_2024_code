
<template>
	<el-row class="settingRule">
		<el-col class="settingRule-main">
			<el-menu :default-active="activeIndex" active-text-color="#006666" mode="horizontal" @select="handleSelect">
				<el-menu-item v-for="item in menuNav.nohas" :key="item.id" :index="String(item.id)">
					<span slot="title">{{ item.typeName }}</span>
				</el-menu-item>
				<el-submenu v-for="item in menuNav.has" :key="item.id" :index="String(item.id)">
					<template slot="title">
						<span>{{ item.typeName }}</span>
					</template>
					<el-menu-item v-for="subitem in item.children" :index="String(subitem.id)" :key="subitem.id">{{ subitem.typeName }}</el-menu-item>
				</el-submenu>
			</el-menu>
			<RuleTable :tableHeader="tableHeader" :tableData="tableData">
				<template #search>
					<div class="common-btn" @click="add">新增</div>
				</template>
				<template #operation>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<span title="编辑" @click="change(scope.row)"><i class="el-icon-s-tools"></i></span>
							<span title="删除" @click="delData(scope.row)"><i class="el-icon-delete-solid"></i></span>
						</template>
					</el-table-column>
				</template>
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
			</RuleTable>
		</el-col>
		<el-dialog :title="dialogTitle" :visible.sync="visible" width="650px" :close-on-click-modal="false" :show-close="false" center>
			<Edit ref="editDialog" :formData="formData" :rules="rules" :metricsOption="metricsOption" :objectOption="objectOption">
				<template #submit>
					<span slot="footer" class="dialog-footer dialog-submit">
						<el-button @click="visible = false">取 消</el-button>
						<el-button type="primary" @click="submitForm">确 定</el-button>
					</span>
				</template>
			</Edit>
		</el-dialog>
	</el-row>
</template>
<script>
import { getRuleType, getRuleTable, delRuleTable, saveRuleTable, updateRuleTable, getRuleMetrics, ApiNetworkList } from '@/api'
import { getTree } from '@/utils/util.js'
import { MessageBox } from 'element-ui'
export default {
	name: 'settingRule',
	components: {
		RuleTable: () => import('./components/ruleTable.vue'),
		Edit: () => import('./components/edit.vue'),
	},
	data() {
		return {
			visible: false,
			dialogTitle: '新增',
			tableHeader: [
				// { prop: 'index', label: '序号', type: 'index' },
				{ prop: 'name', label: '名称' },
				// { prop: 'type', label: '类型', option: true },
				{ prop: 'typeN', label: '类型' },
				{ prop: 'levelTypeName', label: '等级类型' },
				{ prop: 'level1', label: '低等级' },
				{ prop: 'level2', label: '中等级' },
				{ prop: 'level3', label: '高等级' },
				{ prop: 'typeName', label: '对象' },
				{ prop: 'metricName', label: '指标' },
				{ prop: 'triggerTypeName', label: '触发器' },
				{ prop: 'triggerWindow', label: '触发窗口' },
				// { prop: 'monitorList', label: '作用范围' },
				{ prop: 'monitorListName', label: '作用范围' },
				{ prop: 'validityCycle', label: '有效日期' },
				{ prop: 'validityBeginTime', label: '有效开始时间' },
				{ prop: 'validityEndTime', label: '有效结束时间' },
			],
			metricsOption: [],
			tableData: [],
			activeIndex: '',
			menuNav: {},
			formData: {},
			objectOption: [],
			treeData: [],
			currentPage: 1,
			pageSize: 10,
			total: 0,
			rules: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
			},
		}
	},
	mounted() {
		this.getList()
	},
	methods: {
		handleSizeChange(val) {
			this.currentPage = 1
			this.pageSize = val
			this.getList()
		},
		handleCurrentChange(val) {
			this.currentPage = val
			this.getList()
		},
		change(data) {
			let validityCycle = []
			let monitorIdList = []
			this.dialogTitle = '编辑'
			this.visible = true
			data.validityCycle.split(',').forEach((item) => {
				item && validityCycle.push(Number(item))
			})
			data.monitorList.forEach((item) => {
				monitorIdList.push(item.monitorId)
			})
			data.monitorIdList = monitorIdList
			this.formData = { ...data, timeList: [data.validityBeginTime, data.validityEndTime], validityCycle: validityCycle }
		},
		submitForm() {
			this.$refs.editDialog.validFN((valid) => {
				if (valid) {
					let params = {
						...this.formData,
						monitorTypeId: Number(this.activeIndex),
						validityCycle: this.formData.validityCycle.join(),
						validityBeginTime: this.formData.timeList[0],
						validityEndTime: this.formData.timeList[1],
						// level1: this.formData.triggerType == '0' ? this.formData.level1 * 1000 : this.formData.level1,
						// level2: this.formData.triggerType == '0' ? this.formData.level2 * 1000 : this.formData.level2,
						// level3: this.formData.triggerType == '0' ? this.formData.level3 * 1000 : this.formData.level3,
						type: 0,
					}
					if (this.dialogTitle == '新增') {
						saveRuleTable(params).then((res) => {
							if (res.status == 1) {
								this.$message({
									type: 'success',
									message: '增加成功!',
								})
								this.visible = false
								this.currentPage = 1
								this.getTable(this.activeIndex)
							}
						})
					} else {
						updateRuleTable(params).then((res) => {
							if (res.status == 1) {
								this.$message({
									type: 'success',
									message: '修改成功!',
								})
								this.visible = false
								this.getTable(this.activeIndex)
							}
						})
					}
				}
			})
		},
		add() {
			this.dialogTitle = '新增'
			this.visible = true
			this.formData = { timeList: ['00:00:01', '23:59:59'] }
		},
		delData(data) {
			MessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				center: true,
			})
				.then(() => {
					delRuleTable(data.id).then((res) => {
						if (res.status == 1) {
							this.$message({
								type: 'success',
								message: '删除成功!',
							})
							this.getTable(this.activeIndex)
						}
					})
				})
				.catch(() => {})
		},
		getMetrics(id) {
			getRuleMetrics(Number(id)).then((res) => {
				if (res.status == 1) {
					this.metricsOption = res.data
				}
			})
		},
		getList() {
			// let treeArr = this.$store.state.ruleType
			let treeArr = this.$store.state.ruleType.filter((item) => {
				return item.typeName != 'iis'
			})
			this.treeData = getTree(treeArr, 0)
			let navi = { has: [], nohas: [] }
			this.treeData.forEach((item) => {
				// || item.id == 2
				if (!item.children && item.id != 15) {
					navi.nohas.push(item)
				} else if (item.children) {
					navi.has.push(item)
				}
			})
			this.menuNav = navi
			this.handleSelect(navi.nohas[0].id)
			this.activeIndex = String(navi.nohas[0].id)
		},
		getObject(key) {
			let params = {
				page: 1,
				pageSize: 20,
				type: key > 3 && key < 8 ? key : undefined,
				dbType: key >= 8 ? key : undefined,
			}
			this.objectOption = []
			let url = {
				1: '/host/page',
				2: '/network/device/page',
				5: '/jmx/page',
				6: '/jmx/page',
				7: '/jmx/page',
				8: '/dbConfig/page',
				9: '/dbConfig/page',
				10: '/dbConfig/page',
				11: '/dbConfig/page',
				12: '/network/device/page',
				13: '/network/device/page',
				14: '/network/device/page',
			}
			ApiNetworkList(url[key], params).then((res) => {
				if (res.status == 1) {
					res.data.records.forEach((item) => {
						this.objectOption.push({ name: item.name || item.computerName, id: item.id })
					})
				}
			})
		},
		getTable(key) {
			let params = {
				typeId: Number(key),
				page: this.currentPage,
				pageSize: this.pageSize,
			}
			getRuleTable(params).then((res) => {
				if (res.status == 1) {
					res.data.records.forEach((item) => {
						let name = ''
						item.monitorList.forEach((it) => {
							name += it.name + ','
						})
						item.monitorListName = name.length ? name.slice(0, name.length - 1) : ''
						item.typeN = item.type == 1 ? '默认' : '自定义'
						item.triggerTypeName = item.triggerType == '0' ? 'ai' : item.triggerType == '1' ? '阈值（绝对值）' : '阈值（百分比）'
						item.levelTypeName = item.levelType == '0' ? '时间' : '阈值'
					})
					this.total = res.data.total
					this.tableData = res.data.records
				}
			})
		},
		handleSelect(key) {
			this.activeIndex = key
			this.getMetrics(key)
			this.getTable(key)
			this.getObject(key)
		},
	},
}
</script>
<style lang="scss" scoped>
.settingRule {
	display: flex;
	height: 100%;
	padding: 16px;
}
.settingRule-main {
	width: 100%;
	height: calc(100% - 61px);
	background-color: #fff;
}
.common-btn {
	margin-bottom: 16px;
}
.dialog-submit {
	display: flex;
	width: 100%;
	justify-content: space-around;
}
</style>