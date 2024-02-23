<template>
	<div class="ruleTable">
		<slot name="search"></slot>
		<el-table :data="tableData" style="width: 100%" height="calc(100% - 101px)" @row-click="handleRowClick">
			<el-table-column v-for="item in tableHeader" align="center" show-overflow-tooltip :type="item.type || undefined" :key="item.prop" :prop="item.prop" :label="item.label">
			</el-table-column>
			<slot name="operation"></slot>
		</el-table>
		<slot></slot>
	</div>
</template>
<script>
export default {
	name: 'networkTable',
	data() {
		return {}
	},
	props: ['tableHeader', 'tableData'],
	methods: {
		handleRowClick(row) {
			this.$emit('rowClick', row)
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