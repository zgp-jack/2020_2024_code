<template>
	<div>
		<div id="container" ref="topologicalGraph"></div>
	</div>
</template>
<script>
import { Graph } from '@antv/x6'
import { DagreLayout } from '@antv/layout'
import { Snapline } from '@antv/x6-plugin-snapline'
export default {
	name: 'topologicalGraph',
	props: ['currentData'],
	data() {
		return {
			graph: null,
			nodeData: {
				nodes: [],
				edges: [],
			},
		}
	},
	mounted() {
		const dagreLayout = new DagreLayout({
			type: 'dagre',
			rankdir: 'TB',
			// width: 780, // 画布宽
			// height: 422, // 画布高
			center: [390, 211],
		})
		let model = dagreLayout.layout(this.nodeData)
		model.nodes = [
			{
				id: 'node1',
				shape: 'rect',
				x: 390,
				y: 111,
				width: 80,
				height: 40,
				label: 'hello',
			},
		]
		model.edges = []
		this.currentData.forEach((item, index) => {
			model.nodes.push({
				id: item.assocId + '+' + item.type,
				x: index * 110,
				y: 200,
				shape: 'rect',
				width: 80,
				height: 40,
				label: item.name,
			})
			model.edges.push({
				source: 'node1',
				target: item.assocId + '+' + item.type,
				shape: 'edge',
			})
			if (item.serviceAssocInfoList) {
				item.serviceAssocInfoList.forEach((it, ind) => {
					model.nodes.push({
						id: it.assocId + '+' + it.type,
						x: index * 110,
						y: 300,
						shape: 'rect',
						width: 80,
						height: 40,
						label: it.name,
					})
					model.edges.push({
						source: item.assocId + '+' + item.type,
						target: it.assocId + '+' + it.type,
						shape: 'edge',
					})
				})
			}
		})
		this.initGraph(model)
	},
	methods: {
		initGraph(model) {
			const container = document.getElementById('container')
			const width = container.scrollWidth || 780
			const height = container.scrollHeight || 422
			/** 使用Graph API创造出实例对象，开始在SVG上画图/事件处理 */
			this.graph = new Graph({
				container: container, // 画布容器
				width, // 画布宽
				height, // 画布高
				background: {
					color: '#ffffff',
				}, // 背景颜色设置
				layout: {
					type: 'force',
				},
				snapline: true, // 对齐线
				// 配置连线规则
				connecting: {
					snap: true, // 自动吸附
					allowBlank: true, //是否允许连接到画布空白位置的点
					allowMulti: false, //是否允许在相同的起始节点和终止之间创建多条边
					allowLoop: false, //是否允许创建循环连线，即边的起始节点和终止节点为同一节点
					highlight: true, //拖动边时，是否高亮显示所有可用的节点
					validateEdge({ edge, type, previous }) {
						// 连线时设置折线
						edge.setRouter({
							name: 'er',
						})
						// 设置连线样式
						edge.setAttrs({
							line: {
								stroke: '#275da3',
								strokeWidth: 4,
							},
						})
						return true
					},
				},
				panning: {
					enabled: true, // 支持画布拖拽平移
				},
				mousewheel: {
					enabled: true, // 支持滚动放大缩小
				},
				translating: {
					restrict: true,
				},
			})
			// 渲染节点和边
			this.graph.fromJSON(model)
			this.graph.centerContent()
			this.graph.use(
				new Snapline({
					enabled: true,
				})
			)
			// this.registerNode()
			// this.addNode(this.graph)
		},
		registerNode() {
			Graph.registerNode(
				'custom-node',
				{
					inherit: 'rect', // 继承于 rect 节点
					width: 100,
					height: 40,
					markup: [
						{
							tagName: 'rect', // 标签名称
							selector: 'body', // 选择器
						},
						{
							tagName: 'image',
							selector: 'img',
						},
						{
							tagName: 'text',
							selector: 'label',
						},
					],
					attrs: {
						body: {
							stroke: '#8f8f8f',
							strokeWidth: 1,
							fill: '#fff',
							rx: 6,
							ry: 6,
						},
						img: {
							'xlink:href': 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
							width: 16,
							height: 16,
							x: 12,
							y: 12,
						},
					},
				},
				true
			)
		},
		addNode(graph) {
			const source = graph.addNode({
				shape: 'custom-node', // 可以直接使用上面注册过的 shape
				x: 40,
				y: 40,
				label: 'hello',
			})
			const target = graph.addNode({
				shape: 'custom-node',
				x: 160,
				y: 180,
				label: 'world',
			})
			//修改节点的数据
			source.prop('size', { width: 120, height: 50 }) // 修改 x 坐标
			source.attr('rect/fill', '#ccc') // 修改填充色，等价于 source.prop('attrs/rect/fill', '#ccc')
			graph.addEdge({
				source,
				target,
				attrs: {
					line: {
						stroke: '#8f8f8f',
						strokeWidth: 1,
					},
				},
			})
		},
	},
}
</script>
<style scoped>
</style>
