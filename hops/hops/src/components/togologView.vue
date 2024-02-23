<template>
	<div class="togologView">
		<!-- <div ref="togologToolTip" class="togologToolTip" @mouseleave="tooltipLeave">
			<el-scrollbar>
				<div class="tooltip-scrollbar">
					<div class="tooltip-txt">
						<p class="tooltip-txt-item">
							<span class="item-title">名称：　</span><span>{{ baseInfo.name || '-' }}</span>
						</p>
						<p class="tooltip-txt-item">
							<span class="item-title">厂商：　</span><span>{{ baseInfo.manufactor || '-' }}</span>
						</p>
						<p class="tooltip-txt-item">
							<span class="item-title">型号：　</span><span>{{ baseInfo.model || '-' }}</span>
						</p>
						<p class="tooltip-txt-item">
							<span class="item-title">地址：　</span><span>{{ baseInfo.targetIp || '-' }}</span>
						</p>
						<p class="tooltip-txt-item">
							<span class="item-title">位置：　</span><span>{{ baseInfo.position || '-' }}</span>
						</p>
					</div>
					<div class="tooltip-cpu">
						<div class="tooltip-cpu-top">
							<div class="tooltip-title">CPU/内存</div>
							<div class="tooltip-title-use">
								<span class="use-margin"
									>CPU利用率 <span class="use-item">{{ cpuValue }}%</span></span
								>
								<span
									>内存利用率 <span class="use-item">{{ memValue }}%</span></span
								>
							</div>
						</div>
						<div class="line-chart">
							<LineChart ref="cpu" v-if="trendData.memTrendData.length || trendData.cpuTrendData.length" :height="140" :jvmData="trendData"></LineChart>
						</div>
					</div>
					<div class="tooltip-temp">
						<div class="tooltip-title">设备温度</div>
						<div class="tooltip-cpu-top">
							<span
								>当前温度 <span class="use-item">{{ tempValue }}°C</span></span
							>
							<span>
								<span class="use-margin">风扇 <span class="use-item">0个</span></span>
								<span class="use-margin">正常 <span class="use-item">0个</span></span>
								<span>异常 <span class="use-item">0个</span></span>
							</span>
						</div>
						<div class="line-chart">
							<LineChart ref="temp" v-if="tempTrendData.length" :height="140" :jvmData="tempTrendData" :title="'设备温度'" :unit="'℃'"></LineChart>
						</div>
					</div>
					<div class="tooltip-port">
						<div class="tooltip-cpu-top">
							<div class="tooltip-title">端口信息</div>
							<span>
								<span class="use-margin"
									>端口 <span class="use-item">{{ portList.length || 0 }}个</span></span
								>
								<span class="use-margin"
									>在线 <span class="use-item">{{ portList.filter((item) => item.status == 1).length || 0 }}个</span></span
								>
								<span
									>离线 <span class="use-item">{{ portList.filter((item) => item.status != 1).length || 0 }}个</span></span
								>
							</span>
						</div>
						<div class="tooltip-cpu-top" v-for="item in portList" :key="item.id">
							<div class="tooltip-prot-item" :title="item.name">
								<p class="use-item">{{ item.name }}</p>
								<p class="use-font">{{ item.ip }}</p>
							</div>
							<span class="tooltip-prot-item" :title="getKb(item.standardBandWidth) + 'kbps'"
								>标准： <span class="use-item">{{ getKb(item.standardBandWidth) }}kbps</span></span
							>
							<span class="tooltip-prot-item" :title="getKb(item.realityBandWidth) + 'kbps'"
								>实际： <span class="use-item">{{ getKb(item.realityBandWidth) }}kbps</span></span
							>
						</div>
					</div>
				</div>
			</el-scrollbar>
		</div> -->
		<div ref="togologClick" class="togologClick"></div>
		<div id="togologView" ref="togologView"></div>
	</div>
</template>
<script>
import { Graph } from '@antv/x6'
import { ApiNetworkList } from '@/api'
import { getKb } from '@/utils/util'
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
const endTime = parseInt(new Date().getTime())
const h = new Date().getHours() * 3600000
const m = new Date().getMinutes() * 60000
const s = new Date().getSeconds() * 1000
const startTime = endTime - 86400000 - (h + m + s)
export default {
	name: 'togologView',
	props: {
		type: {
			type: Number | String,
			default: '',
		},
		planId: {
			type: Number | String,
			default: '',
		},
	},
	components: {
		LineChart: () => import('@/views/network/components/lineChart.vue'),
	},
	data() {
		return {
			topPlanDots: [],
			topPlanLines: [],
			graph: '',
			tempTrendData: [],
			trendData: {
				cpuTrendData: [],
				memTrendData: [],
			},
			baseInfo: {},
			cpuValue: 0,
			memValue: 0,
			tempValue: 0,
			portList: [],
		}
	},
	mounted() {
		this.init()
		this.getList()
	},
	methods: {
		getKb(val) {
			return getKb(val).num
		},
		tooltipLeave() {
			let $this = this
			const text = $this.$refs.togologToolTip
			text.style.display = 'none'
		},
		getList() {
			const startTime = this.type == 1 ? endTime - 86400000 - (h + m + s) : endTime - 86400000
			let params = {
				id: this.planId,
				startTime: startTime,
				endTime: endTime,
			}
			ApiNetworkList('/top/plan/info', params).then((res) => {
				let data = res.data || {}
				if (res.status == 1) {
					// this.$emit('getPlanId', data.id)
					this.initGragh(data.topPlanDots || [], data.topPlanLines || [])
				}
			})
		},
		init() {
			let $this = this
			const graph = new Graph({
				container: document.getElementById('togologView'),
				// width: 1100,
				height: 480,
				autoResize: true,
				panning: {
					// enabled: true, // 支持画布拖拽平移
				},
				interacting: false,
				mousewheel: {
					enabled: true,
					modifiers: 'Ctrl',
					maxScale: 4,
					minScale: 0.2,
				},
				translating: {
					restrict: 0, // 将移动范围限制在画布距离画布边缘 20px 处
				},
				connecting: {
					router: {
						name: 'manhattan',
						args: {
							padding: 1,
						},
					},
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
				},
			})
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
					width: 65,
					height: 65,
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
						{
							tagName: 'text',
							selector: 'labelname',
						},
					],
					attrs: {
						body: {
							stroke: 'transparent',
							fill: 'transparent',
						},
						image: {
							width: 50,
							height: 50,
							refX: 7.5,
							refY: 7.5,
						},
						label: {
							refX: 30,
							refY: 55,
							textAnchor: 'middle',
							textVerticalAnchor: 'middle',
							fontSize: 16,
							fill: '#799F9F',
						},
						labelname: {
							refX: 32,
							refY: 6,
							textAnchor: 'middle',
							textVerticalAnchor: 'middle',
							fontSize: 16,
							fill: '#799F9F',
						},
					},
					ports: { ...ports },
				},
				true
			)
			// graph.on('node:mouseenter', ({ e, node, view }) => {
			// 	let nodeName = node.store.data.name
			// 	if (this.type == 1 && (nodeName == 'network' || nodeName == 'firewall' || nodeName == 'router') && node.store.data.monitorId) {
			// 		const text = $this.$refs.togologToolTip
			// 		const p1 = graph.localToGraph(node.store.data.position.x, node.store.data.position.y)
			// 		text.style.display = 'block'
			// 		text.style.left = (p1.x - 360).toString() + 'px'
			// 		text.style.top = (p1.y - 0).toString() + 'px'
			// 		let params1 = {
			// 			id: node.store.data.monitorId,
			// 			startTime: endTime,
			// 			endTime: endTime,
			// 		}
			// 		$this.baseInfo = {}
			// 		ApiNetworkList('/network/device/list', params1).then((res) => {
			// 			if (res.status == 1) {
			// 				$this.baseInfo = res.data[0] || {}
			// 			}
			// 		})
			// 		let params2 = {
			// 			monitorId: node.store.data.monitorId,
			// 			startTime: startTime,
			// 			endTime: endTime,
			// 			// page: 1,
			// 			// pageSize: 20,
			// 		}
			// 		this.trendData = {
			// 			cpuTrendData: [],
			// 			memTrendData: [],
			// 		}
			// 		this.tempTrendData = []
			// 		this.cpuValue = 0
			// 		this.memValue = 0
			// 		this.tempValue = 0
			// 		this.cpuTrendData = []
			// 		this.memTrendData = []
			// 		ApiNetworkList('/network/device/histroy', params2).then((res) => {
			// 			if (res.status == 1) {
			// 				res.data.forEach((item, ind) => {
			// 					item.cpuUsePercent &&
			// 						item.cpuUsePercent.forEach((it, index) => {
			// 							if (ind == 0) {
			// 								this.cpuTrendData[index] = []
			// 							}
			// 							if (ind == res.data.length - 1 && it.value > this.cpuValue) {
			// 								this.cpuValue = it.value
			// 							}
			// 							this.cpuTrendData[index].push([item.time * 1000, it.value])
			// 						})
			// 					item.memoryUsePercent &&
			// 						item.memoryUsePercent.forEach((it, index) => {
			// 							if (ind == 0) {
			// 								this.memTrendData[index] = []
			// 							}
			// 							if (ind == res.data.length - 1 && it.value > this.memValue) {
			// 								this.memValue = it.value
			// 							}
			// 							this.memTrendData[index].push([item.time * 1000, it.value])
			// 						})
			// 					item.temperature &&
			// 						item.temperature.forEach((it, index) => {
			// 							if (ind == 0) {
			// 								this.tempTrendData[index] = []
			// 							}
			// 							if (ind == res.data.length - 1 && it.value > this.tempValue) {
			// 								this.tempValue = it.value
			// 							}
			// 							this.tempTrendData[index].push([item.time * 1000, it.value])
			// 						})
			// 				})
			// 				this.trendData.cpuTrendData = this.cpuTrendData[0] || []
			// 				this.trendData.memTrendData = this.memTrendData[0] || []
			// 			}
			// 		})
			// 		let params3 = {
			// 			deviceId: node.store.data.monitorId,
			// 		}
			// 		this.portList = []
			// 		ApiNetworkList(`/network/device/interface/list`, params3).then((res) => {
			// 			if (res.status == 1) {
			// 				this.portList = res.data || []
			// 			}
			// 		})
			// 	}
			// })
			graph.on('node:click', ({ e, x, y, node, view }) => {
				let nodeName = node.store.data.name
				if (this.type == 2) {
					$this.$emit('setWarn', { monitorId: node.store.data.monitorId, monitorType: node.store.data.monitorType })
				} else if (nodeName == 'network' || nodeName == 'firewall' || nodeName == 'router') {
					$this.$emit('setWarn', { monitorId: node.store.data.monitorId, monitorType: node.store.data.monitorType })
				} else {
					$this.$emit('setWarn', { monitorId: node.store.data.monitorId, monitorType: node.store.data.monitorType, nodeName: 'other' })
				}
				const text = $this.$refs.togologClick
				const p1 = graph.localToGraph(node.store.data.position.x, node.store.data.position.y)
				text.style.display = 'block'
				let pxV = 65 / 2 - 10
				text.style.left = (p1.x + pxV).toString() + 'px'
				text.style.top = (p1.y - 15).toString() + 'px'
				// node.addTools({
				// 	name: 'boundary',
				// 	args: {
				// 		padding: 5,
				// 		attrs: {
				// 			fill: 'none',
				// 			stroke: '#F38787',
				// 			'stroke-width': 2,
				// 			'stroke-dasharray': '',
				// 		},
				// 	},
				// })
			})
			graph.on('blank:click', ({ e, x, y }) => {
				const text = this.$refs.togologClick
				text.style.display = 'none'
				this.$emit('setWarn', { monitorId: '', monitorType: '' })
			})
			this.graph = graph
			// this.initGragh(this.topPlanDots, this.topPlanLines)
		},
		getLevel(levelData) {
			let high = 0
			let mid = 0
			let low = 0
			levelData.forEach((item) => {
				if (item.level == 3) {
					high++
				} else if (item.level == 2) {
					mid++
				} else if (item.level == 1) {
					low++
				}
			})
			return { high, mid, low }
		},
		getTxtColor(txtData) {
			if (txtData && txtData.length) {
				var { high, mid, low } = this.getLevel(txtData)
			} else {
				return ''
			}
			if (high) {
				return '#FF836B'
			} else if (mid) {
				return '#FFD400'
			} else {
				return '#65ADEB'
			}
		},
		getImage(monitorId, monitorType, alarmIdList) {
			if (monitorId) {
				if (alarmIdList && alarmIdList.length) {
					let { high, mid, low } = this.getLevel(alarmIdList)
					if (high) {
						return require(`@/assets/svgN/${indexImg[monitorType] + 'High'}.svg`)
					} else if (mid) {
						return require(`@/assets/svgN/${indexImg[monitorType] + 'Mid'}.svg`)
					} else {
						return require(`@/assets/svgN/${indexImg[monitorType] + 'L'}.svg`)
					}
				} else {
					return require(`@/assets/svgN/${indexImg[monitorType]}.svg`)
				}
			} else {
				return require(`@/assets/svgN/${indexImg[monitorType] + 'D'}.svg`)
			}
		},
		initGragh(nodes, edges) {
			let $this = this
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
								'xlink:href': this.getImage(item.monitorId, item.monitorType, item.alarmIdList),
							},
							label: {
								text: (item.alarmIdList && item.alarmIdList.length) || '',
								fill: this.getTxtColor(item.alarmIdList),
							},
							labelname: {
								text: item.name || '',
								// fill: '#000',
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
						// tools: ['edge-editor'],
						zIndex: 0,
					})
				})
			}
			$this.graph.fromJSON(nodeData)
			// this.type == 2 && $this.graph.zoomToFit({ maxScale: 1.5 })
			$this.graph.centerContent()
		},
		resize() {
			this.getList()
		},
		getClickNode(id) {
			if (id) {
				let node = this.graph.getCellById(id)
				if (!node) {
					return
				}
				const text = this.$refs.togologClick
				const p1 = this.graph.localToGraph(node.store.data.position.x, node.store.data.position.y)
				text.style.display = 'block'
				let pxV = 65 / 2 - 10
				text.style.left = (p1.x + pxV).toString() + 'px'
				text.style.top = (p1.y - 15).toString() + 'px'
			}
		},
		clearSelect() {
			const text = this.$refs.togologClick
			text.style.display = 'none'
		},
	},
	watch: {
		planId: {
			handler(newV, oldV) {
				if (newV) {
					this.getList()
				}
			},
			// deep: true,
		},
	},
}
</script>
<style scoped>
.togologView {
	position: relative;
	width: 100%;
	height: 100%;
}
.tooltip-scrollbar {
	padding: 16px;
}
.togologClick {
	position: absolute;
	top: 0;
	left: 0;
	display: none;
	width: 20px;
	height: 25px;
	background-color: transparent;
}
.togologClick::after {
	content: '';
	display: inline-block;
	position: relative;
	width: 20px;
	height: 25px;
	background-image: url(@/assets/position.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
	background-position: 0 0;
	z-index: 3;
	animation-name: jump;
	animation-duration: 1s;
	animation-timing-function: ease-in-out;
	animation-iteration-count: infinite;
}
@keyframes jump {
	0%,
	100% {
		top: 0;
	}
	50% {
		top: -6px;
	}
}
.togologToolTip {
	position: absolute;
	top: 0;
	left: 0;
	display: none;
	width: 380px;
	height: 260px;
	border-radius: 4px;
	background: #fff;
	box-shadow: 0 -1px 5px -2px #0066661a, 0 8px 10px -5px #00666614, 0 16px 24px 2px #0066660a, 0 6px 30px 5px #0066660d;
	z-index: 3;
}
.tooltip-txt-item {
	font-size: 14px;
	color: #282827;
	line-height: 24px;
}
.item-title {
	color: #757e7e;
}
.tooltip-cpu-top {
	margin-top: 16px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #757e7e;
}
.tooltip-title {
	color: #282827;
	font-size: 16px;
	line-height: 24px;
}
.tooltip-title::before {
	content: '';
	display: inline-block;
	width: 2px;
	height: 16px;
	border-radius: 2px;
	background-color: #006666;
	vertical-align: -2px;
	margin-right: 4px;
}
.tooltip-title-use {
	color: #757e7e;
	font-size: 12px;
	line-height: 24px;
}
.use-item {
	color: #282827;
	font-size: 14px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
.use-margin {
	margin-right: 20px;
}
.use-font {
	font-size: 10px;
}
.line-chart {
	height: 140px;
}
.tooltip-prot-item {
	width: 120px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
</style>