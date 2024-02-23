<template>
	<div :class="{ close: !show, leftTable: true }">
		<slot name="search"></slot>
		<el-table
			:data="tableData"
			style="width: 100%"
			current-change
			ref="leftTable"
			highlight-current-row
			@current-change="handleCurrentChange"
			height="calc(100% - 48px)"
			@row-click="handleRowClick"
			@sort-change="sortChangeFun"
		>
			<el-table-column
				v-for="item in tableHeader"
				:width="item.width || width"
				align="center"
				:type="item.type || undefined"
				:key="item.prop"
				:prop="item.prop"
				:label="item.label"
				:sortable="item.sortable || undefined"
				show-overflow-tooltip
			>
				<template slot-scope="scope">
					<div v-if="item.prop === 'alarm'" class="alarm-total-box">
						<span style="color: #1ec969" class="alarmNumRestored">{{ scope.row.alarmNumRestored }}</span>
						<span style="color: #ccc" class="line"></span>
						<span style="color: #ff836b" class="alarmNumNoRestored">{{ scope.row.alarmNumNoRestored }}</span>
					</div>
					<span v-else>{{ scope.row[item.prop] }}</span>
				</template>
			</el-table-column>
			<slot name="operation"></slot>
		</el-table>
		<div class="collapsed-right" @click="handleCollapsed()">
			<i class="el-icon-caret-left" v-show="show"></i>
			<i class="el-icon-caret-right" v-show="!show"></i>
		</div>
	</div>
</template>
<script>
export default {
	name: 'leftTable',
	data() {
		return {
			input2: '',
			show: true,
		}
	},
	props: ['tableHeader', 'tableData', 'width'],
	methods: {
		sortChangeFun(column, prop, order) {
			let orderA = ''
			if (column.order == 'ascending') {
				orderA = 'ASC'
			} else if (column.order == 'descending') {
				orderA = 'DESC'
			} else {
				orderA = ''
			}
			let sortObj = {
				prop: column.prop,
				order: orderA,
			}
			this.$emit('sortClick', sortObj)
		},
		handleCurrentChange(row) {
			this.$refs.leftTable.setCurrentRow(row)
		},
		handleRowClick(row) {
			this.$emit('rowClick', row)
		},
		handleCollapsed() {
			this.show = !this.show
			this.$emit('collapsed', this.show)
		},
	},
	watch: {
		tableData: {
			handler(newV, oldV) {
				if (newV) {
					this.$refs.leftTable.setCurrentRow(newV[0])
				}
			},
			deep: true,
		},
	},
}
</script>
<style lang="scss" scoped>
.leftTable {
	position: relative;
	padding: 16px;
	height: 100%;
	/* height: calc(100vh - 65px); */
	background-color: #fff;
	position: relative;
}
.leftTable.close {
	width: 0px;
	transition: width 0.3s ease-in-out;
	padding: 0;
	* {
		display: none;
	}
	.collapsed-right {
		right: -16px;
		display: block;
		i {
			display: inline;
		}
	}
}
.leftTable-search {
	margin-bottom: 16px;
}
.search-input {
	/* width: 256px; */
	width: 50%;
}
.collapsed-right {
	position: absolute;
	top: 50%;
	right: 0;
	width: 16px;
	height: 32px;
	background-color: #ccc;
	cursor: pointer;
	line-height: 32px;
	color: #fff;
	z-index: 1;
}
.alarm-total-box {
	.alarmNumRestored {
		display: inline-block;
		// width: 30px;
		text-align: right;
	}
	.line {
		width: 1px;
		height: 12px;
		background-color: #ccc;
		display: inline-block;
		vertical-align: unset;
		margin: 0 2px;
	}
	.alarmNumNoRestored {
		display: inline-block;
		// width: 30px;
		text-align: left;
	}
}
</style>