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
				:data="tableData"
				class="network-table-main"
				@row-click="handleRowClick"
			>
				<el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
				<el-table-column prop="name" label="名称" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="isTop" label="拓" width="50" align="center" show-overflow-tooltip>
					<template slot-scope="scope">
						<el-checkbox class="network-checkbox" @change="changeScreen(scope.row)" v-model="scope.row.isTop"></el-checkbox>
					</template>
				</el-table-column>
				<el-table-column prop="isScreen" label="屏" width="50" align="center" show-overflow-tooltip>
					<template slot-scope="scope">
						<el-checkbox class="network-checkbox" @change="changeScreen(scope.row)" v-model="scope.row.isScreen"></el-checkbox>
					</template>
				</el-table-column>

				<!-- <el-table-column prop="type" label="拓　屏" width="80" align="center" show-overflow-tooltip>
					<template slot-scope="scope">
						<span :class="[scope.row.type == 1 ? 'typeT' : 'typeP']"></span>
						<span :class="[scope.row.type == 2 ? 'typeT' : 'typeP']"></span>
					</template>
				</el-table-column> -->
				<el-table-column label="操作" align="center" width="50">
					<template slot-scope="scope">
						<span title="删除" @click="delData(scope.row)"><i class="el-icon-delete-solid"></i></span>
					</template>
				</el-table-column>
			</el-table>
			<el-empty v-else class="warnList-empty" :image="require('@/assets/table-empty.png')"></el-empty>
		</div>
		<div class="network-contain">
			<div class="main">
				<div class="main-top">
					<div class="main-top-back">
						<!-- <i class="el-icon-back top-icon"></i>
						    <i class="el-icon-right top-icon"></i> -->
					</div>
					<div class="main-top-search">
						<el-input class="main-search-input" placeholder="请输入方案名称" prefix-icon="el-icon-search" v-model="searchData.name" />
						<i @click="updateName" class="el-icon-refresh-left top-icon" title="更新"></i>
					</div>
					<div class="main-top-add">
						<el-button type="danger" plain @click="delScheme">删 除</el-button>
						<el-button type="primary" @click="saveScheme"><i class="el-icon-document"></i>保 存</el-button>
					</div>
				</div>
				<div class="topolog" id="container">
					<div ref="tooltipText" class="tooltiptext">
						<p class="tooltip-title">设备详情</p>
						<el-select class="tooltip-select" v-model="deviceData.monitorId" placeholder="请选择" @change="changeTipValue">
							<el-option v-for="item in tipOptions" :key="item.id" :label="item.computerName || item.name" :value="item.id"> </el-option>
						</el-select>
						<p class="tooltip-text">名称：{{ deviceData.name || '-' }}</p>
						<p class="tooltip-text">IP：{{ deviceData.ip || '-' }}</p>
						<!-- <p class="tooltip-text">厂商：-</p>
						<p class="tooltip-text">型号：-</p>
						<p class="tooltip-text">地址：-</p>
						<p class="tooltip-text">位置：-</p> -->
					</div>
					<div ref="tooltipEdge" class="tooltipEdge">
						<el-tabs v-model="activeName" @tab-click="handleClick">
							<el-tab-pane v-for="item in tapData" :key="item.name" :label="item.label" :name="item.name">
								<div class="main-top-search">
									<!-- <el-input class="main-search-input" placeholder="查找端口名称/地址" prefix-icon="el-icon-search" v-model="searchData.name" /> -->
									<span></span>
									<span class="tooltipEdge-title" @click="disPort">解除绑定</span>
								</div>
								<el-table :data="tipTableData" class="network-table-main" height="calc(100% - 50px)">
									<el-table-column label="绑定" align="center" width="50" show-overflow-tooltip>
										<template slot-scope="scope">
											<el-checkbox class="network-checkbox" @change="changePort(scope.row)" v-model="scope.row.checked"></el-checkbox>
										</template>
									</el-table-column>
									<el-table-column prop="name" label="名称" align="center" show-overflow-tooltip></el-table-column>
									<el-table-column prop="ip" label="地址" align="center" show-overflow-tooltip></el-table-column>
									<el-table-column prop="statusName" label="状态" align="center" width="50" show-overflow-tooltip></el-table-column>
								</el-table>
							</el-tab-pane>
						</el-tabs>
					</div>
					<div ref="tooltipRight" class="tooltipRight">
						<p @click="delEdge" class="tooltipRight-del">删除连接线</p>
					</div>
					<div ref="tooltipNode" class="tooltipNode">
						<p @click="delNode('port')" class="tooltipRight-del">解除所有端口绑定</p>
						<p @click="delNode('device')" class="tooltipRight-del">解除设备绑定</p>
						<p @click="delNode('node')" class="tooltipRight-del">删除元件</p>
					</div>
				</div>
			</div>
		</div>
		<!-- <el-dialog :title="'新增方案'" :visible.sync="visible" width="350px" center :close-on-click-modal="false" :show-close="false">
			<el-form :model="formData">
				<el-form-item label="名称">
					<el-input v-model="formData.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="类型">
					<el-select v-model="formData.type" placeholder="请选择类型">
						<el-option label="拓" :value="1"></el-option>
						<el-option label="屏" :value="2"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer dialog-submit">
				<el-button @click="visible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm">确 定</el-button>
			</span>
		</el-dialog> -->
	</div>
</template>
<script>
import { Graph, Shape, Addon } from '@antv/x6'
import { Stencil } from '@antv/x6-plugin-stencil'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Selection } from '@antv/x6-plugin-selection'
import { MessageBox } from 'element-ui'
import { ApiNetworkList } from '@/api'
// import insertCss from 'insert-css'
const defaultImg = {
	server: { img: require('@/assets/svgN/serverD.svg'), img1: require('@/assets/svgN/server.svg'), index: 1, url: '/host/list' },
	network: { img: require('@/assets/svgN/networkD.svg'), img1: require('@/assets/svgN/network.svg'), index: 13, url: '/network/device/list' },
	router: { img: require('@/assets/svgN/routerD.svg'), img1: require('@/assets/svgN/router.svg'), index: 12, url: '/network/device/list' },
	firewall: { img: require('@/assets/svgN/firewallD.svg'), img1: require('@/assets/svgN/firewall.svg'), index: 14, url: '/network/device/list' },
	database: { img: require('@/assets/svgN/databaseD.svg'), img1: require('@/assets/svgN/database.svg'), index: 4, url: '/dbConfig/list' },
	middleware: { img: require('@/assets/svgN/middlewareD.svg'), img1: require('@/assets/svgN/middleware.svg'), index: 3, url: '/jmx/list' },
	// cloud: { img: require('@/assets/svgN/cloudD.svg'), img1: require('@/assets/svgN/cloud.svg'), index: 15 },
}
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
}
const imageShapes = [
	{
		name: 'server',
		label: '主机',
		image: require('@/assets/svgN/serverD.svg'),
	},
	{
		name: 'network',
		label: '交换机',
		image: require('@/assets/svgN/networkD.svg'),
	},
	{
		name: 'middleware',
		label: '中间件',
		image: require('@/assets/svgN/middlewareD.svg'),
	},
	{
		name: 'database',
		label: '数据库',
		image: require('@/assets/svgN/databaseD.svg'),
	},
	{
		name: 'router',
		label: '路由器',
		image: require('@/assets/svgN/routerD.svg'),
	},
	{
		name: 'firewall',
		label: '防火墙',
		image: require('@/assets/svgN/firewallD.svg'),
	},
	// {
	// 	name: 'cloud',
	// 	label: '云',
	// 	image: require('@/assets/svgN/cloud.svg'),
	// },
]
export default {
	name: 'networkTopolog',
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
		}
	},
	mounted() {
		this.init()
		// this.initGragh()
		this.getList()
	},
	methods: {
		init() {
			let $this = this
			// 为了协助代码演示
			preWork()

			// #region 初始化画布
			const graph = new Graph({
				container: document.getElementById('graph-container'),
				grid: true,
				mousewheel: {
					enabled: true,
					zoomAtMousePosition: true,
					modifiers: 'ctrl',
					minScale: 0.5,
					maxScale: 3,
				},
				connecting: {
					// router: {
					// 	name: 'manhattan',
					// 	args: {
					// 		padding: 1,
					// 	},
					// },
					connector: {
						name: 'rounded',
						args: {
							radius: 8,
						},
					},
					anchor: 'center',
					connectionPoint: 'anchor',
					allowBlank: false,
					snap: {
						radius: 20,
					},
					createEdge() {
						return new Shape.Edge({
							attrs: {
								line: {
									stroke: '#C5CED0',
									strokeWidth: 2,
									targetMarker: {
										name: '',
										width: 12,
										height: 8,
									},
								},
							},
							tools: ['edge-editor'],
							zIndex: 0,
						})
					},
					validateConnection({ targetMagnet }) {
						return !!targetMagnet
					},
				},
				highlighting: {
					magnetAdsorbed: {
						name: 'stroke',
						args: {
							attrs: {
								fill: '#fff',
								stroke: '#006665',
							},
						},
					},
				},
				resizing: true,
				rotating: true,
				selecting: {
					enabled: true,
					rubberband: true,
					showNodeSelectionBox: true,
				},
				snapline: true,
				keyboard: true,
				clipboard: true,
			})
			this.graph = graph
			// #endregion
			graph.use(
				new Keyboard({
					enabled: true,
				})
			)
			graph.use(
				new Selection({
					enabled: true,
				})
			)
			// #region 初始化 stencil

			const stencil = new Stencil({
				title: '',
				target: graph,
				stencilGraphWidth: 100,
				stencilGraphHeight: 500,
				stencilGraphPadding: 16,
				groups: [
					{
						name: 'group2',
						collapsable: false,
						graphHeight: 0,
						graphWidth: 80,
						layoutOptions: {
							columns: 1,
							rowHeight: 70,
						},
					},
				],
				layoutOptions: {
					columns: 2,
					columnWidth: 80,
					rowHeight: 55,
				},
				getDropNode(node) {
					node.attrs.image['xlink:href'] = defaultImg[node.store.data.name].img
					node.attrs.text.text = ''
					node.store.data.otherId = true
					node.store.data.monitorType = defaultImg[node.store.data.name].index
					return node.clone()
				},
			})
			document.getElementById('stencil').appendChild(stencil.container)
			// #endregion

			// #region 快捷键与事件
			// copy cut paste
			graph.bindKey(['meta+c', 'ctrl+c'], () => {
				const cells = graph.getSelectedCells()
				if (cells.length) {
					graph.copy(cells)
				}
				return false
			})
			graph.bindKey(['meta+x', 'ctrl+x'], () => {
				const cells = graph.getSelectedCells()
				if (cells.length) {
					graph.cut(cells)
				}
				return false
			})
			graph.bindKey(['meta+v', 'ctrl+v'], () => {
				if (!graph.isClipboardEmpty()) {
					const cells = graph.paste({ offset: 32 })
					graph.cleanSelection()
					graph.select(cells)
				}
				return false
			})

			//undo redo
			graph.bindKey(['meta+z', 'ctrl+z'], () => {
				if (graph.history.canUndo()) {
					graph.history.undo()
				}
				return false
			})
			graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
				if (graph.history.canRedo()) {
					graph.history.redo()
				}
				return false
			})

			// select all
			graph.bindKey(['meta+a', 'ctrl+a'], () => {
				const nodes = graph.getNodes()
				if (nodes) {
					graph.select(nodes)
				}
			})

			//delete
			graph.bindKey('backspace', () => {
				const cells = graph.getSelectedCells()
				if (cells.length) {
					graph.removeCells(cells)
				}
			})

			// zoom
			graph.bindKey(['ctrl+1', 'meta+1'], () => {
				const zoom = graph.zoom()
				if (zoom < 1.5) {
					graph.zoom(0.1)
				}
			})
			graph.bindKey(['ctrl+2', 'meta+2'], () => {
				const zoom = graph.zoom()
				if (zoom > 0.5) {
					graph.zoom(-0.1)
				}
			})

			// 控制连接桩显示/隐藏
			const showPorts = (ports, show) => {
				for (let i = 0, len = ports.length; i < len; i = i + 1) {
					ports[i].style.visibility = show ? 'visible' : 'hidden'
				}
			}
			graph.on('node:mouseenter', () => {
				const container = document.getElementById('graph-container')
				const ports = container.querySelectorAll('.x6-port-body')
				showPorts(ports, true)
			})
			graph.on('node:mouseleave', () => {
				const container = document.getElementById('graph-container')
				const ports = container.querySelectorAll('.x6-port-body')
				showPorts(ports, false)
			})
			graph.on('node:dblclick', ({ e, x, y, node, view }) => {
				clearSelect()
				const text = this.$refs.tooltipText
				const p1 = graph.localToGraph(node.store.data.position.x, node.store.data.position.y)
				let urlItem = defaultImg[node.store.data.name]
				let params = {
					startTime: new Date().getTime(),
					endTime: new Date().getTime(),
					type: urlItem.url.indexOf('/network/device/list') != -1 ? urlItem.index : undefined,
				}
				text.style.display = 'block'
				text.style.left = (p1.x - 150).toString() + 'px'
				text.style.top = (p1.y - 120).toString() + 'px'
				this.id = node.id
				this.tipOptions = []
				this.deviceData = {
					name: '',
					ip: '',
					monitorId: '',
				}
				ApiNetworkList(urlItem.url, params).then((res) => {
					if (res.status == 1) {
						this.tipOptions = res.data
						if (node.store.data.monitorId) {
							let id = node.store.data.monitorId
							let activeTip = this.tipOptions.filter((item) => item.id == id)[0]
							this.deviceData = {
								name: activeTip.computerName || activeTip.name,
								ip: activeTip.ip,
								monitorId: activeTip.id,
							}
						}
					}
				})
			})
			graph.on('node:click', ({ e, x, y, node, view }) => {
				clearSelect()
				node.addTools({
					name: 'boundary',
					args: {
						padding: 5,
						attrs: {
							fill: 'none',
							stroke: '#F38787',
							'stroke-width': 2,
							'stroke-dasharray': '',
						},
					},
				})
			})
			graph.on('node:contextmenu', ({ e, x, y, node, view }) => {
				clearSelect()
				node.addTools({
					name: 'boundary',
					args: {
						padding: 5,
						attrs: {
							fill: 'none',
							stroke: '#F38787',
							'stroke-width': 2,
							'stroke-dasharray': '',
						},
					},
				})
				const text = this.$refs.tooltipNode
				const p1 = graph.localToGraph(x, y)
				text.style.display = 'block'
				text.style.left = (p1.x - 60).toString() + 'px'
				text.style.top = (p1.y - 60).toString() + 'px'
				this.id = node.id
			})
			graph.on('edge:click', ({ e, x, y, edge, view }) => {
				clearSelect()
				edge.attr('line/stroke', '#13605E')
				edge.attr('zIndex', 1)
			})
			graph.on('edge:contextmenu', ({ e, x, y, edge, view }) => {
				clearSelect()
				edge.attr('line/stroke', '#13605E')
				edge.attr('zIndex', 1)
				const text = this.$refs.tooltipRight
				const p1 = graph.localToGraph(x, y)
				text.style.display = 'block'
				text.style.left = (p1.x - 0).toString() + 'px'
				text.style.top = (p1.y - 0).toString() + 'px'
				this.id = edge.id
			})
			graph.on('blank:click', ({ e, x, y }) => {
				clearSelect()
			})
			graph.on('node:port:click', ({ e, x, y, node, view }) => {
				clearSelect()
				const edgesT = graph.getConnectedEdges(node, { incoming: true })
				const edgesS = graph.getConnectedEdges(node, { outgoing: true })
				this.portId = e.target.getAttribute('port')
				let nodeName = node.store.data.name
				let portT = edgesT.filter((item) => {
					return item.store.data.target.port == this.portId
				})
				let portS = edgesS.filter((item) => {
					return item.store.data.source.port == this.portId
				})
				this.portList = [...portS, ...portT]
				this.tapData = []
				if ((nodeName == 'network' || nodeName == 'firewall' || nodeName == 'router') && node.store.data.monitorId && this.portList.length) {
					this.portList.forEach((item, index) => {
						this.tapData.push({
							id: item.id,
							label: '端口' + (index + 1),
							name: String(index + 1),
						})
					})
					let edge = this.portList[0]
					edge.attr('line/stroke', '#13605E')
					edge.attr('zIndex', 1)
					this.activeName = '1'
					const text = this.$refs.tooltipEdge
					const p1 = graph.localToGraph(x, y)
					let params = {
						deviceId: node.store.data.monitorId,
					}
					text.style.display = 'block'
					text.style.left = (p1.x - 350).toString() + 'px'
					text.style.top = (p1.y - 380).toString() + 'px'

					ApiNetworkList('/network/device/interface/list', params).then((res) => {
						if (res.status == 1) {
							let edgeId = ''
							if (edge.store.data.source.port == this.portId) {
								edgeId = edge.store.data.aMonitorDeviceInterfaceId
							} else if (edge.store.data.target.port == this.portId) {
								edgeId = edge.store.data.bMonitorDeviceInterfaceId
							}
							res.data.forEach((item) => {
								if (item.id == edgeId) {
									item.checked = true
								} else {
									item.checked = false
								}
							})
							this.tipTableData = res.data
						}
					})
				}
			})
			// graph.on('graph:mouseleave', ({ e }) => {
			// 	var text = this.$refs.tooltipText
			// 	text.style.display = 'none'
			// })
			// #endregion

			// #region 初始化图形
			const ports = {
				groups: {
					top: {
						position: 'top',
						attrs: {
							circle: {
								r: 4,
								magnet: true,
								stroke: '#A2B1C3',
								strokeWidth: 1,
								fill: '#fff',
								style: {
									visibility: 'hidden',
								},
							},
						},
						zIndex: 1,
					},
					right: {
						position: 'right',
						attrs: {
							circle: {
								r: 4,
								magnet: true,
								stroke: '#A2B1C3',
								strokeWidth: 1,
								fill: '#fff',
								style: {
									visibility: 'hidden',
								},
							},
						},
						zIndex: 1,
					},
					bottom: {
						position: 'bottom',
						attrs: {
							circle: {
								r: 4,
								magnet: true,
								stroke: '#A2B1C3',
								strokeWidth: 1,
								fill: '#fff',
								style: {
									visibility: 'hidden',
								},
							},
						},
						zIndex: 1,
					},
					left: {
						position: 'left',
						attrs: {
							circle: {
								r: 4,
								magnet: true,
								stroke: '#A2B1C3',
								strokeWidth: 1,
								fill: '#fff',
								style: {
									visibility: 'hidden',
								},
							},
						},
						zIndex: 1,
					},
				},
				items: [
					{
						id: 'port_1',
						group: 'top',
					},
					{
						id: 'port_2',
						group: 'right',
						args: {
							dy: -2,
						},
					},
					{
						id: 'port_3',
						group: 'bottom',
						args: {
							dy: -5,
						},
					},
					{
						id: 'port_4',
						group: 'left',
						args: {
							dy: -2,
						},
					},
				],
			}

			Graph.registerNode(
				'custom-image',
				{
					inherit: 'rect',
					width: 52,
					height: 52,
					markup: [
						{
							tagName: 'rect',
							selector: 'body',
						},
						{
							tagName: 'image',
						},
						{
							tagName: 'text',
							selector: 'label',
						},
					],
					attrs: {
						body: {
							stroke: '#F0F7F7',
							fill: '#F0F7F7',
						},
						image: {
							width: 26,
							height: 26,
							refX: 13,
							refY: 13,
						},
						label: {
							refX: 26,
							refY: 47,
							textAnchor: 'middle',
							textVerticalAnchor: 'middle',
							fontSize: 12,
							fill: '#799F9F',
						},
					},
					ports: { ...ports },
				},
				true
			)

			const imageNodes = imageShapes.map((item) =>
				graph.createNode({
					shape: 'custom-image',
					label: item.label,
					name: item.name,
					attrs: {
						image: {
							'xlink:href': item.image,
						},
					},
				})
			)
			stencil.load(imageNodes, 'group2')
			// #endregion
			function clearSelect() {
				const edges = graph.getEdges()
				const nodes = graph.getNodes()
				const text = $this.$refs.tooltipText
				const text1 = $this.$refs.tooltipEdge
				const text2 = $this.$refs.tooltipRight
				const text3 = $this.$refs.tooltipNode
				text.style.display = 'none'
				text1.style.display = 'none'
				text2.style.display = 'none'
				text3.style.display = 'none'
				edges.forEach((edge) => {
					edge.attr('line/stroke', '#C5CED0')
					edge.attr('zIndex', 0)
				})
				nodes.forEach((node) => {
					node.removeTools()
				})
			}
			function preWork() {
				// 这里协助演示的代码，在实际项目中根据实际情况进行调整
				const container = document.getElementById('container')
				const stencilContainer = document.createElement('div')
				stencilContainer.id = 'stencil'
				const graphContainer = document.createElement('div')
				graphContainer.id = 'graph-container'
				container.appendChild(stencilContainer)
				container.appendChild(graphContainer)

				// insertCss(``)
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
						id: item.id,
						shape: 'custom-image',
						name: indexImg[item.monitorType],
						x: item.x,
						y: item.y,
						monitorId: item.monitorId,
						monitorType: item.monitorType,
						attrs: {
							image: {
								'xlink:href': item.monitorId ? require(`@/assets/svgN/${indexImg[item.monitorType]}.svg`) : require(`@/assets/svgN/${indexImg[item.monitorType] + 'D'}.svg`),
							},
						},
					})
				})
				edges.forEach((item) => {
					let labels = []
					if (item.tag && item.tag.length) {
						if (!Array.isArray(item.tag)) {
							item.tag = JSON.parse(item.tag)
						}
						item.tag.forEach((it) => {
							labels.push({
								position: {
									distance: it.distance,
								},
								attrs: {
									body: {
										fill: 'transparent',
									},
									label: {
										text: it.text || '',
										zIndex: 3,
									},
								},
							})
						})
					}
					nodeData.edges.push({
						source: { cell: item.adotId, port: item.aexport },
						target: { cell: item.bdotId, port: item.bexport },
						aMonitorDeviceInterfaceId: item.amonitorDeviceInterfaceId,
						bMonitorDeviceInterfaceId: item.bmonitorDeviceInterfaceId,
						attrs: {
							line: {
								stroke: '#A2B1C3',
								strokeWidth: 2,
								targetMarker: {
									name: '',
									width: 12,
									height: 8,
								},
							},
						},
						labels: labels,
						tools: ['edge-editor'],
						zIndex: 0,
					})
				})
			}
			this.graph.fromJSON(nodeData)
		},
		delScheme() {
			if (this.tableData.length) {
				MessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true,
				})
					.then(() => {
						let params = {
							...this.activeData,
							isTop: this.activeData.isTop ? 1 : 0,
							isScreen: this.activeData.isScreen ? 1 : 0,
							topPlanDots: [],
							topPlanLines: [],
						}
						ApiNetworkList('/top/plan/save', params).then((res) => {
							if (res.status == 1) {
								this.$message({
									type: 'success',
									message: '删除拓扑档案成功',
								})
								this.getList()
							}
						})
					})
					.catch(() => {})
			}
		},
		saveScheme() {
			if (!this.tableData.length) {
				return
			}
			const nodes = this.graph.getNodes()
			const edges = this.graph.getEdges()
			let topPlanDots = []
			let topPlanLines = []
			let params = {
				...this.activeData,
				name: this.searchData.name || null,
				isTop: this.activeData.isTop ? 1 : 0,
				isScreen: this.activeData.isScreen ? 1 : 0,
			}
			nodes.forEach((item) => {
				topPlanDots.push({
					id: !item.store.data.otherId ? item.id : null,
					x: item.store.data.position.x,
					y: item.store.data.position.y,
					otherId: item.id,
					monitorType: item.store.data.monitorType,
					monitorId: item.store.data.monitorId,
				})
			})
			edges.forEach((item) => {
				let tag = []
				if (item.labels && item.labels.length) {
					item.labels.forEach((it) => {
						tag.push({
							distance: it.position.distance,
							text: it.attrs.label.text,
						})
					})
				}
				topPlanLines.push({
					adotId: !this.graph.getCellById(item.store.data.source.cell).store.data.otherId ? item.store.data.source.cell : null,
					bdotId: !this.graph.getCellById(item.store.data.target.cell).store.data.otherId ? item.store.data.target.cell : null,
					aotherId: item.store.data.source.cell,
					botherId: item.store.data.target.cell,
					aexport: item.store.data.source.port,
					bexport: item.store.data.target.port,
					amonitorDeviceInterfaceId: item.store.data.aMonitorDeviceInterfaceId,
					bmonitorDeviceInterfaceId: item.store.data.bMonitorDeviceInterfaceId,
					// tag: item.labels.length ? item.labels[0].attrs.label.text : '',
					tag: (tag && tag.length && JSON.stringify(tag)) || '',
				})
			})
			params.topPlanDots = topPlanDots
			params.topPlanLines = topPlanLines
			ApiNetworkList('/top/plan/save', params).then((res) => {
				if (res.status == 1) {
					this.$message({
						type: 'success',
						message: res.message,
					})
					this.searchData.name = ''
					this.getList(this.activeData.id)
				}
			})
		},
		changeTipValue(val) {
			const nodes = this.graph.getNodes()
			const node = nodes.filter((item) => this.id == item.id)[0]
			node.attr('image/xlink:href', defaultImg[node.store.data.name].img1)
			let activeTip = this.tipOptions.filter((item) => item.id == val)[0]
			node.store.data.monitorId = val
			node.store.data.monitorType = activeTip.type || 1
			this.deviceData = {
				name: activeTip.computerName || activeTip.name,
				ip: activeTip.ip,
				monitorId: activeTip.id,
			}
		},
		getList(id) {
			let params = {
				page: 1,
				pageSize: 20,
				name: '',
				isFind: 0,
			}
			this.tableData = []
			ApiNetworkList('/top/plan/page', params).then((res) => {
				if (res.status == 1 && res.data.records.length) {
					res.data.records.forEach((item) => {
						item.isTop = item.isTop ? true : false
						item.isScreen = item.isScreen ? true : false
					})
					this.tableData = res.data.records
					let activeData = {}
					if (id) {
						activeData = this.tableData.filter((item) => item.id == id)[0]
					} else {
						activeData = this.tableData[0]
					}
					this.$nextTick(() => {
						this.$refs.leftTable.setCurrentRow(activeData)
					})
					this.activeData = activeData
					// this.searchData.name = this.activeData.name
					this.initGragh(activeData.topPlanDots || [], activeData.topPlanLines || [])
				}
			})
		},
		handleCurrentChange(row) {
			this.$refs.leftTable.setCurrentRow(row)
		},
		addScheme() {
			let params = {
				name: '新增方案',
			}
			ApiNetworkList('/top/plan/save', params).then((res) => {
				if (res.status == 1) {
					this.$message({
						type: 'success',
						message: res.message,
					})
					this.getList()
				}
			})
		},
		delData(data) {
			MessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				center: true,
			})
				.then(() => {
					ApiNetworkList('/top/plan/delete', data.id, 'delete').then((res) => {
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
		search() {},
		handleRowClick(row, column, event) {
			this.activeData = row
			this.searchData.name = ''
			this.initGragh(row.topPlanDots, row.topPlanLines)
		},
		disPort() {
			let edge = this.portList[Number(this.activeName) - 1]
			this.tipTableData.forEach((item) => (item.checked = false))
			if (edge.store.data.source.port == this.portId) {
				edge.store.data.aMonitorDeviceInterfaceId = undefined
			} else if (edge.store.data.target.port == this.portId) {
				edge.store.data.bMonitorDeviceInterfaceId = undefined
			}
		},
		handleClick(tab, event) {
			let edge = this.portList[Number(this.activeName) - 1]
			let edgeId = ''
			this.portList.forEach((edge) => {
				edge.attr('line/stroke', '#C5CED0')
				edge.attr('zIndex', 0)
			})
			edge.attr('line/stroke', '#13605E')
			edge.attr('zIndex', 1)
			if (edge.store.data.source.port == this.portId) {
				edgeId = edge.store.data.aMonitorDeviceInterfaceId
			} else if (edge.store.data.target.port == this.portId) {
				edgeId = edge.store.data.bMonitorDeviceInterfaceId
			}
			this.tipTableData.forEach((item) => {
				if (item.id == edgeId) {
					item.checked = true
				} else {
					item.checked = false
				}
			})
		},
		changePort(row) {
			this.tipTableData.forEach((item) => (item.checked = false))
			row.checked = true
			let edge = this.portList[Number(this.activeName) - 1]
			if (edge.store.data.source.port == this.portId) {
				edge.store.data.aMonitorDeviceInterfaceId = row.id
			} else if (edge.store.data.target.port == this.portId) {
				edge.store.data.bMonitorDeviceInterfaceId = row.id
			}
		},
		changeScreen(row) {
			let params = {
				...row,
				isTop: row.isTop ? 1 : 0,
				isScreen: row.isScreen ? 1 : 0,
			}
			ApiNetworkList('/top/plan/save', params).then((res) => {
				if (res.status == 1) {
					this.$message({
						type: 'success',
						message: res.message,
					})
					this.getList(row.id)
				}
			})
		},
		updateName() {
			if (this.searchData.name && this.activeData.id) {
				let params = {
					...this.activeData,
					name: this.searchData.name,
					isTop: this.activeData.isTop ? 1 : 0,
					isScreen: this.activeData.isScreen ? 1 : 0,
				}
				ApiNetworkList('/top/plan/save', params).then((res) => {
					if (res.status == 1) {
						this.$message({
							type: 'success',
							message: res.message,
						})
						this.searchData.name = ''
						this.getList(this.activeData.id)
					}
				})
			}
		},
		delEdge() {
			const cells = this.graph.getCellById(this.id)
			const text = this.$refs.tooltipRight
			if (cells) {
				this.graph.removeCell(cells)
				text.style.display = 'none'
			}
		},
		delNode(type) {
			const text = this.$refs.tooltipNode
			const node = this.graph.getCellById(this.id)
			if (!node) {
				return
			}
			if (type == 'node') {
				this.graph.removeCell(node)
			} else if (type == 'device') {
				node.attr('image/xlink:href', defaultImg[node.store.data.name].img)
				node.store.data.monitorId = ''
				this.deviceData = {
					name: '',
					ip: '',
					monitorId: '',
				}
			} else {
				const edgesS = this.graph.getConnectedEdges(node, { outgoing: true })
				const edgesT = this.graph.getConnectedEdges(node, { incoming: true })
				edgesS.forEach((item) => {
					item.store.data.aMonitorDeviceInterfaceId = null
				})
				edgesT.forEach((item) => {
					item.store.data.bMonitorDeviceInterfaceId = null
				})
			}
			text.style.display = 'none'
		},
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
	height: calc(100% - 64px);
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
</style>