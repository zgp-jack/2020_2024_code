<template>
	<div class="ruleTable">
		<slot name="search"></slot>
		<el-table
			:data="tableData"
			row-key="id"
			style="width: 100%"
			height="calc(100% - 48px)"
			@row-click="handleRowClick"
			lazy
			:load="load"
			:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
		>
			<el-table-column v-for="item in tableHeader" align="center" show-overflow-tooltip :type="item.type || undefined" :key="item.prop" :prop="item.prop" :label="item.label">
			</el-table-column>
			<slot name="operation"></slot>
		</el-table>
		<slot></slot>
	</div>
</template>
<script>
import { ApiNetworkList } from '@/api'
import { getMbps, getMaxUnitByFlow } from '@/utils/util'
export default {
	name: 'deviceTable',
	data() {
		return {}
	},
	props: ['tableHeader', 'tableData'],
	methods: {
		handleRowClick(row) {
			this.$emit('rowClick', row)
		},
		load(tree, treeNode, resolve) {
			let params = {
				page: 1,
				pageSize: 20,
				deviceId: tree.id,
			}
			ApiNetworkList('/network/device/interface/list', params).then((res) => {
				if (res.status == 1) {
					let data = res.data || []
					data.forEach((item) => {
						item.id += 10000;
						let byBit = getMaxUnitByFlow(item.portSpeed)
						let bit = getMbps(item.standardBandWidth, 1000)
						item.portSpeed = byBit.num + byBit.unit
						item.standardBand = item.standardBandWidth
						item.standardBandWidth = bit.num + bit.unit
					})
					resolve(data)
				}
			})
		},
	},
}
</script>
<style scoped>
.ruleTable {
	position: relative;
	padding: 16px;
	height: 100%;
	/* height: calc(100vh - 65px); */
	background-color: #fff;
}
.ruleTable-search {
	margin-bottom: 16px;
}
.search-input {
	/* width: 256px; */
	width: 50%;
}
</style>