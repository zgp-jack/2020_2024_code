<template>
	<div class="network-topolog">
		<div class="network-table leftTable">
			<div class="leftTable-search">
				<!-- <el-input class="search-input" placeholder="请输入名称" prefix-icon="el-icon-search" v-model="searchData.name" /> -->
				<div class="common-btn" @click="addScheme"><i class="el-icon-plus"></i>新增方案</div>
			</div>
			<el-table
				v-if="tableData.length"
				ref="leftTable"
				highlight-current-row
				@current-change="handleCurrentChange"
				@row-click="handleRowClick"
				:data="tableData"
				class="network-table-main"
			>
				<el-table-column prop="index" label="序号" type="index" width="50" align="center"></el-table-column>
				<el-table-column width="80" prop="name" label="名称" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="ips" label="IPS" align="center" show-overflow-tooltip> </el-table-column>
				<!-- <el-table-column prop="planId" label="节点数" width="50" align="center" show-overflow-tooltip> </el-table-column> -->
				<el-table-column width="80" label="操作" align="center">
					<template slot-scope="scope">
						<span :title="scope.row.runningStatus ? '正在执行' : '立即执行'" class="execute" @click="executeFn(scope.row, $event)"
							><i :class="scope.row.runningStatus ? 'el-icon-loading' : 'el-icon-video-play'"></i
						></span>
						<span title="编辑" @click="change(scope.row)"><i class="el-icon-s-tools"></i></span>
						<span title="删除" @click="delData(scope.row)"><i class="el-icon-delete-solid"></i></span>
					</template>
				</el-table-column>
			</el-table>
			<el-empty v-else class="warnList-empty" :image="require('@/assets/table-empty.png')"></el-empty>
		</div>
		<div class="network-contain">
			<div class="main">
				<div class="topolog" id="container"></div>
			</div>
		</div>
		<el-dialog :title="dialogTitle" :visible.sync="visible" v-if="visible" width="650px" :close-on-click-modal="false" :show-close="false" center>
			<el-form :model="formData">
				<el-form-item label="名称">
					<el-input v-model="formData.name" autocomplete="off" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="IPS">
					<el-input v-model="formData.ips" autocomplete="off" placeholder="请输入IPS"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer dialog-submit">
				<el-button @click="visible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { MessageBox } from 'element-ui'
import { ApiNetworkList } from '@/api'
import G6 from '@antv/g6'
// import insertCss from 'insert-css'
const indexImg = {
	1: 'server',
	3: 'middleware',
	4: 'database',
	5: 'middleware',
	6: 'middleware',
	7: 'middleware',
	8: 'database',
	9: 'database',
	10: 'database',
	11: 'database',
	12: 'router',
	13: 'network',
	14: 'firewall',
	15: 'unknown',
}
export default {
	name: 'autoNetworkTopolog',
	data() {
		return {
			searchData: {
				name: '',
			},
			tableData: [],
			tipTableData: [],
			deviceData: {
				monitorId: '',
				name: '',
				ip: '',
			},
			tipOptions: [],
			id: '',
			portId: '',
			graph: '',
			visible: false,
			formData: {},
			activeData: '',
			activeName: '1',
			tapData: [],
			portList: [],
			dialogTitle: '新增',
			tiemr: null,
		}
	},
	mounted() {
		let $this = this
		// this.init()  // 初始化X6
		this.initG6() // 初始化G
		// this.initGragh()
		this.getList()
		this.timer = setInterval(() => {
			$this.getLoopList()
		}, 10000)
	},
	methods: {
		delData(data) {
			MessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				center: true,
			})
				.then(() => {
					ApiNetworkList('/top/find/delete', data.id, 'delete').then((res) => {
						if (res.status == 1) {
							this.$message({
								type: 'success',
								message: '删除成功!',
							})
							this.getList()
						}
					})
				})
				.catch(() => {})
		},
		change(data) {
			this.dialogTitle = '编辑'
			this.visible = true
			this.formData = { ...data }
		},
		submitForm() {
			let params = {
				...this.formData,
			}
			let url = this.dialogTitle == '编辑' ? '/top/find/update' : '/top/find/save'
			ApiNetworkList(url, params).then((res) => {
				if (res.status == 1) {
					this.$message({
						type: 'success',
						message: this.dialogTitle == '编辑' ? '修改成功' : '新增成功!',
					})
					this.visible = false
					this.getList()
				}
			})
		},
		initG6() {
			const container = document.getElementById('container')
			const width = container.scrollWidth
			const height = container.scrollHeight || 700
			const graph = new G6.Graph({
				container: 'container',
				width,
				height,
				layout: {
					type: 'force',
					preventOverlap: true,
					linkDistance: (d) => {
						if (d.root) {
							return 1
						}
						return 50
					},
					nodeStrength: (d) => {
						if (d.root) {
							return -5000
						}
						return -500
					},
					edgeStrength: (d) => {
						if (d.root) {
							return 10
						}
						return 2
					},
				},
				defaultNode: {
					type: 'image',
					size: [26, 26],
					clipCfg: {
						show: false,
						// Clip type options: circle, ellipse, rect, path
						type: 'circle',
						// circle
						r: 30,
						// clip style
						// style: {
						// 	lineWidth: 1,
						// },
					},
					labelCfg: {
						style: {
							fill: '#006666',
							fontSize: 14,
							background: {
								fill: 'transparent',
								stroke: 'transparent',
								padding: [2, 2, 2, 2],
								radius: 2,
							},
						},
						position: 'bottom',
					},
				},
				defaultEdge: {
					// type: 'polyline',
					style: {
						stroke: '#F6BD16',
					},
				},
				modes: {
					default: ['drag-canvas', 'drag-node'],
				},
			})

			this.graph = graph

			graph.on('node:dragstart', function (e) {
				graph.layout()
				refreshDragedNodePosition(e)
			})
			graph.on('node:drag', function (e) {
				refreshDragedNodePosition(e)
			})
			graph.on('node:dragend', function (e) {
				e.item.get('model').fx = null
				e.item.get('model').fy = null
			})

			if (typeof window !== 'undefined')
				window.onresize = () => {
					if (!graph || graph.get('destroyed')) return
					if (!container || !container.scrollWidth || !container.scrollHeight) return
					graph.changeSize(container.scrollWidth, container.scrollHeight)
				}

			function refreshDragedNodePosition(e) {
				const model = e.item.get('model')
				model.fx = e.x
				model.fy = e.y
			}
		},
		initGragh(nodes, edges) {
			let nodeData = {
				nodes: [],
				edges: [],
			}
			if (nodes && edges) {
				nodes.forEach((item) => {
					nodeData.nodes.push({
						id: 'node' + item.id,
						size: item.root ? [26, 13] : [26, 26],
						img: item.root ? require(`@/assets/svgN/proble.svg`) : require(`@/assets/svgN/${indexImg[item.monitorType]}.svg`),
						label: item.name,
						root: item.root,
					})
				})
				edges.forEach((item) => {
					nodeData.edges.push({
						source: 'node' + item.adotId,
						target: 'node' + item.bdotId,
					})
				})
			}
			this.graph.data(nodeData)
			this.graph.render()
		},
		getLoopList() {
			let params = {
				page: 1,
				pageSize: 20,
			}
			ApiNetworkList('/top/find/page', params).then((res) => {
				if (res.status == 1 && res.data.records.length) {
					this.tableData = res.data.records
					let initData = this.tableData.filter((item) => item.id == this.activeData)[0]
					this.$refs.leftTable.setCurrentRow(initData)
				}
			})
		},
		getList() {
			let params = {
				page: 1,
				pageSize: 20,
			}
			this.tableData = []
			ApiNetworkList('/top/find/page', params).then((res) => {
				if (res.status == 1 && res.data.records.length) {
					this.tableData = res.data.records
					let initData = res.data.records[0]
					this.activeData = initData.id
					this.$nextTick(() => {
						this.$refs.leftTable.setCurrentRow(initData)
					})
					let param = {
						page: 1,
						pageSize: 20,
						isFind: 1,
						id: initData.planId,
					}
					ApiNetworkList('/top/plan/page', param).then((res) => {
						if (res.status == 1 && res.data.records.length) {
							let initData = res.data.records[0]
							this.initGragh(initData.topPlanDots || [], initData.topPlanLines || [])
						}
					})
				}
			})
		},
		handleCurrentChange(row) {
			this.$refs.leftTable.setCurrentRow(row)
		},
		addScheme() {
			this.dialogTitle = '新增'
			this.visible = true
			this.formData = {}
		},
		executeFn(row, e) {
			e.stopPropagation()
			if (row.runningStatus) {
				return
			}
			ApiNetworkList(`/top/find/start/${row.id}`, {}).then((res) => {
				if (res.status == 1) {
					this.$message({
						type: 'success',
						message: '正在执行中!',
					})
					row.runningStatus = 1
					// setTimeout(() => {
					// 	this.getList()
					// }, 1000)
				}
			})
		},
		search() {},
		handleRowClick(row, column, event) {
			this.activeData = row.id
			if (row.planId) {
				let param = {
					page: 1,
					pageSize: 20,
					isFind: 1,
					id: row.planId,
				}
				ApiNetworkList('/top/plan/page', param).then((res) => {
					if (res.status == 1 && res.data.records.length) {
						let initData = res.data.records[0]
						this.initGragh(initData.topPlanDots || [], initData.topPlanLines || [])
					}
				})
			} else {
				this.initGragh([], [])
			}
		},
	},
	beforeDestroy() {
		clearInterval(this.timer)
	},
}
</script>
<style scoped>
.network-topolog {
	display: flex;
	height: 100%;
	background-color: #fff;
}
.network-table {
	width: 400px;
	height: calc(100vh - 158px);
	/* height: 100%; */
	padding: 16px;
	background-color: #fff;
}
.network-contain {
	flex: 1;
	min-width: 0;
	padding-bottom: 16px;
	padding-right: 16px;
	background-color: #fff;
}
.main {
	height: 100%;
	/* padding-left: 16px;
	padding-top: 16px; */
	padding: 16px;
	background-color: #f0f7f7;
}
.leftTable-search {
	display: flex;
	justify-content: space-between;
}
.search-input {
	width: 120px;
}
.network-table-main {
	margin-top: 16px;
	width: 100%;
	height: calc(100% - 48px);
	overflow-y: auto;
}
.main-top {
	display: flex;
	justify-content: space-between;
	padding: 16px;
	background-color: #fff;
	height: 64px;
}
.top-icon {
	width: 32px;
	color: #2b5f5f;
	text-align: center;
	line-height: 32px;
	font-size: 16px;
	margin-right: 16px;
	cursor: pointer;
}
.main-top-search {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.main-search-input {
	width: 165px;
	margin-right: 16px;
}
.main-top-add {
	display: flex;
}
.el-icon-document {
	margin-right: 4px;
}
.topolog {
	position: relative;
	width: 100%;
	height: 100%;
}

.tooltiptext {
	position: absolute;
	display: none;
	top: 0;
	left: 0;
	width: 260px;
	max-height: 240px;
	padding: 16px;
	opacity: 1;
	border-radius: 4px;
	background: #ffffff;
	box-shadow: 0 -1px 5px -2px #0066661a, 0 8px 10px -5px #00666614, 0 16px 24px 2px #0066660a, 0 6px 30px 5px #0066660d;
	z-index: 1;
}
.tooltip-title {
	color: #282827;
	font-size: 16px;
	font-weight: bold;
}
.tooltip-select {
	margin-top: 8px;
}
.tooltip-text {
	margin-top: 8px;
	color: #757e7e;
	font-size: 14px;
}

.tooltipEdge {
	position: absolute;
	display: none;
	top: 0;
	left: 0;
	width: 400px;
	height: 380px;
	padding: 16px;
	opacity: 1;
	border-radius: 4px;
	background: #ffffff;
	box-shadow: 0 -1px 5px -2px #0066661a, 0 8px 10px -5px #00666614, 0 16px 24px 2px #0066660a, 0 6px 30px 5px #0066660d;
	z-index: 1;
}
.tooltipEdge-title {
	color: #006666;
	font-size: 14px;
	cursor: pointer;
}
.typeT {
	position: relative;
	display: inline-block;
	width: 15px;
	height: 15px;
	background-color: #1ec969;
	/* background-color: #006464; */
	border-radius: 50%;
	margin-left: 5px;
	margin-right: 5px;
}
.typeT::after {
	box-sizing: content-box;
	content: '';
	border: 1px solid #fff;
	border-left: 0;
	border-top: 0;
	height: 7px;
	left: 5px;
	position: absolute;
	top: 3px;
	width: 4px;
	transition: transform 0.15s ease-in 0.05s;
	transform-origin: center;
	transform: rotate(45deg) scaleY(1);
}
.typeP {
	display: inline-block;
	width: 15px;
	height: 15px;
	background-color: #fff;
	border: 1px solid #dde9e8;
	border-radius: 50%;
	margin-left: 5px;
	margin-right: 5px;
}
.tooltipRight {
	position: absolute;
	display: none;
	top: 0;
	left: 0;
	padding: 10px;
	width: 100px;
	height: 40px;
	border-radius: 4px;
	background: #ffffff;
	z-index: 1;
	box-shadow: 0 -1px 5px 0 #0066660f, 0 3px 14px 2px #0066660d, 0 8px 10px 1px #0066660f, 0 5px 5px -3px #0066661a;
}
.tooltipRight-del {
	font-size: 14px;
	color: #282827;
	cursor: pointer;
}
.tooltipNode {
	position: absolute;
	display: none;
	top: 0;
	left: 0;
	padding: 10px;
	width: 140px;
	height: 80px;
	color: #282827;
	font-size: 14px;
	border-radius: 4px;
	background: #ffffff;
	z-index: 1;
	box-shadow: 0 -1px 5px 0 #0066660f, 0 3px 14px 2px #0066660d, 0 8px 10px 1px #0066660f, 0 5px 5px -3px #0066661a;
}
.execute {
	color: #006666;
	font-size: 14px;
}
</style>