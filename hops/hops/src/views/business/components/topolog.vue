<template>
	<div class="topolog">
		<div id="tooltipText" ref="tooltipText" class="tooltiptext1"></div>
		<div id="container" ref="topologicalGraph1" style="position: relative"></div>
	</div>
</template>
<script>
import { Graph, Model } from '@antv/x6'
import { ForceLayout, DagreLayout } from '@antv/layout'
export default {
	name: 'topolog',
	data() {
		return {
			originData: {},
		}
	},
	mounted() {
		this.registerNode()
		this.originData = this.getData()
		this.init()
	},
	props: ['currentData', 'currentTitle', 'width', 'searchData'],
	methods: {
		getId(id) {
			let arr = this.$store.state.ruleType
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].id == id) {
					if (arr[i].pid == 0) {
						return arr[i].id
					} else {
						return arr[i].pid
					}
				}
			}
		},
		getData() {
			let nodeData = {
				nodes: [],
				edges: [],
			}
			nodeData.nodes.push({
				id: 'node0',
				size: 80,
				x: 0,
				y: 0,
				label: this.currentTitle,
				type: 0,
			})
			this.currentData.forEach((item) => {
				nodeData.nodes.push({
					id: 'node' + '+' + String(item.assocId) + '+' + String(item.type),
					size: 80,
					x: 0,
					y: 0,
					label: item.name,
					ip: item.ip,
					type: this.getId(item.type),
					alarmNumber: item.alarmNumber,
					monitorId: item.assocId,
				})
				nodeData.edges.push({ source: 'node0', target: 'node' + '+' + String(item.assocId) + '+' + String(item.type) })
				if (item.serviceAssocInfoList) {
					item.serviceAssocInfoList.forEach((it) => {
						nodeData.nodes.push({
							id: 'node' + '+' + String(it.assocId) + '+' + String(it.type),
							size: 80,
							x: 0,
							y: 0,
							label: it.name,
							ip: item.ip,
							type: this.getId(it.type),
							alarmNumber: it.alarmNumber,
							monitorId: it.assocId,
						})
						nodeData.edges.push({
							source: 'node' + '+' + String(item.assocId) + '+' + String(item.type),
							target: 'node' + '+' + String(it.assocId) + '+' + String(it.type),
						})
					})
				}
			})
			return nodeData
		},
		init() {
			const graph = new Graph({
				container: document.getElementById('container'),
				// width: 780,
				height: 422,
				autoResize: true,
				panning: {
					enabled: true, // 支持画布拖拽平移
				},
				mousewheel: {
					enabled: true,
					modifiers: 'Ctrl',
					maxScale: 4,
					minScale: 0.2,
				},
				translating: {
					restrict: 0, // 将移动范围限制在画布距离画布边缘 20px 处
				},
			})
			this.addNode(graph)
			const originData = this.originData
			const svgName = ['business', 'server', 'network', 'middleware', 'database']
			const getModelFromOriginData = (originData) => {
				const model = {
					nodes: [],
					edges: [],
				}
				originData.nodes.forEach((item) => {
					model.nodes.push({
						id: item.id,
						shape: 'custom-node',
						width: item.size,
						height: item.size / 2,
						x: item.x,
						y: item.y,
						data: item.alarmNumber,
						dataset: item.label,
						layer: item.layer,
						monitorId: item.monitorId,
						attrs: {
							body: {
								fill: 'rgb(255,255,255)',
								stroke: 'transparent',
							},
							title: {
								text: item.label,
							},
							text: {
								// text: item.ip,
							},
							image: {
								'xlink:href': require(`@/assets/svg/${svgName[item.type] + this.getImage(item.alarmNumber)}.svg`),
							},
						},
					})
				})
				originData.edges.forEach((item) => {
					model.edges.push({
						source: item.source,
						target: item.target,
						attrs: {
							line: {
								stroke: '#1890ff',
								strokeDasharray: 3,
								targetMarker: null,
							},
						},
					})
				})
				return model
			}

			const forceLayout = new ForceLayout({
				type: 'force',
				center: [this.width / 2 || 400, 180],
				preventOverlap: true,
				linkDistance: (d) => {
					return 100
				},
				nodeStrength: (d) => {
					if (d.isLeaf) {
						return -50
					}
					return -10
				},
				edgeStrength: (d) => {
					if (d.source.id === 'node1' || d.source.id === 'node2' || d.source.id === 'node3') {
						return 0.7
					}
					return 15
				},
				tick: () => {
					const model = getModelFromOriginData(originData)
					graph.fromJSON(model)
				},
			})

			const dagreLayout = new DagreLayout({
				type: 'dagre',
				rankdir: 'TB',
				begin: [0, 0],
				// align: 'UL',
				ranksep: 25,
				nodesep: 10,
			})
			// dagre布局
			const oriData = getModelFromOriginData(originData)
			const model = dagreLayout.layout(oriData)
			graph.fromJSON(model)
			graph.centerContent()
			// force力导向布局
			// forceLayout.layout(originData)
			graph.on('node:dblclick', ({ e, x, y, node, view }) => {
				const svgName = ['business', 'host', 'network', 'middleware', 'database']
				if (node.id != 'node0') {
					let typeId = node.id.split('+')
					let name = svgName[this.getId(typeId[2])]
					let params = {}
					// params.startTime = this.searchData.startTime
					// params.endTime = this.searchData.endTime
					params.name = node.attrs.title.text
					params.id = node.store.data.monitorId
					sessionStorage.setItem('navAction', name)
					const { href } = this.$router.resolve({
						name,
						query: {
							// name: params.name,
							id: params.id,
						},
					})
					window.open(href, '_blank')
				}
			})
			graph.on('node:mouseenter', ({ e, node, view }) => {
				if (node.store.data.data) {
					var text = this.$refs.tooltipText
					const p1 = graph.localToGraph(node.store.data.position.x, node.store.data.position.y)
					text.innerHTML = `高等级：${node.store.data.data.high}<br/>中等级：${node.store.data.data.medium}<br/>低等级：${node.store.data.data.low}`
					text.style.display = 'block'
					text.style.left = (p1.x - 12).toString() + 'px'
					text.style.top = (p1.y - 75).toString() + 'px'
				}
			})
			graph.on('node:mouseleave', ({ node }) => {
				var text = this.$refs.tooltipText
				text.style.display = 'none'
			})
		},
		getImage(alarmNumber) {
			if (!alarmNumber) {
				return ''
			} else if (alarmNumber.high) {
				return 'High'
			} else if (alarmNumber.medium) {
				return 'Mid'
			} else {
				return 'L'
			}
		},
		registerNode() {
			Graph.registerNode(
				'custom-node',
				{
					width: 50,
					height: 50,
					attrs: {
						body: {
							stroke: 'rgb(245,245,245)',
							strokeWidth: 1,
							fill: 'rgb(245,245,245)',
							refWidth: 1,
							refHeight: 1,
						},
						image: {
							width: 30,
							height: 30,
							x: 25,
							y: 12,
							// y: 0,
						},
						title: {
							refX: 40,
							refY: 0,
							// refY: 30,
							fill: 'rgba(0,0,0,0.85)',
							fontSize: 12,
							'text-anchor': 'middle',
						},
						text: {
							refX: 0,
							refY: 55,
							fontSize: 12,
							fill: 'rgba(0,0,0,0.6)',
							'text-anchor': 'start',
						},
					},
					markup: [
						{
							tagName: 'rect',
							selector: 'body',
						},
						{
							tagName: 'image',
							selector: 'image',
						},
						{
							tagName: 'text',
							selector: 'title',
						},
						{
							tagName: 'text',
							selector: 'text',
						},
					],
				},
				true
			)
		},
		addNode(graph) {
			graph.addNode({
				x: 0,
				y: 0,
				shape: 'custom-node',
			})
		},
	},
}
</script>
<style scoped>
.tooltiptext1 {
	width: 100px;
	background-color: black;
	color: #fff;
	border-radius: 6px;
	padding: 5px 0;
	text-align: center;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
	display: none;
	opacity: 0.7;
}
#container {
	position: relative;
	width: 100%;
}
.topolog {
	position: relative;
}
</style>