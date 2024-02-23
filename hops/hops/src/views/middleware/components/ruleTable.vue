<template>
	<div class="ruleTable">
		<slot name="search"></slot>
		<el-table :data="tableData" style="width: 100%" height="100%" @row-click="handleRowClick">
			<el-table-column prop="index" label="序号" type="index"></el-table-column>
			<el-table-column v-for="item in tableHeader" align="center" :type="item.type || undefined" :key="item.prop" :prop="item.prop" :label="item.label" show-overflow-tooltip>
			</el-table-column>
			<slot name="operation"></slot>
		</el-table>
	</div>
</template>
<script>
export default {
	name: 'ruleTable',
	data() {
		return {
			input2: 'zgp',
		}
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
	/* padding: 16px; */
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