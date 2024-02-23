<template>
	<div class="tableList">
		<el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label="">
				<el-input v-model="formInline.user" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item label="">
				<el-input v-model="formInline.type" placeholder="类型"></el-input>
			</el-form-item>
			<el-form-item>
				<div class="common-btn" @click="getList">查询</div>
				<div class="common-btn" @click="handleAdd">新增</div>
			</el-form-item>
		</el-form>
		<el-table :data="tableData" height="calc(100% - 88px)">
			<el-table-column prop="index" label="序号" type="index"> </el-table-column>
			<el-table-column prop="name" label="名称"> </el-table-column>
			<el-table-column prop="manufactor" label="厂商"> </el-table-column>
			<el-table-column prop="model" label="型号"> </el-table-column>
			<el-table-column prop="managerIp" label="管理地址"> </el-table-column>
			<el-table-column prop="managerPort" label="管理端口"> </el-table-column>
			<el-table-column prop="snmpVersion" label="版本"> </el-table-column>
			<el-table-column prop="snmpTeam" label="团体名"> </el-table-column>
			<el-table-column prop="snmpLevel" label="认证等级"> </el-table-column>
			<el-table-column prop="snmpAuth" label="认证方式"> </el-table-column>
			<el-table-column prop="snmpName" label="用户名"> </el-table-column>
			<el-table-column prop="snmpPass" label="密码"> </el-table-column>
			<el-table-column prop="snmpPrivacy" label="授权方式"> </el-table-column>
			<el-table-column prop="snmpPrivacyKey" label="秘钥"> </el-table-column>
			<el-table-column prop="targetIp" label="snmp目的ip" width="120"> </el-table-column>
			<el-table-column prop="port" label="snmp端口"> </el-table-column>
			<el-table-column prop="position" label="位置"> </el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<span title="编辑" @click="handleEdit(scope.row)"><i class="el-icon-s-tools"></i></span>
					<span title="删除" @click="delData(scope.row)"><i class="el-icon-delete-solid"></i></span>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
<script>
import { delNetwork, ApiNetwork } from '@/api'
import { MessageBox } from 'element-ui'
export default {
	name: 'listable',
	data() {
		return {
			formInline: {},
			tableData: [],
		}
	},
	mounted() {
		this.getList()
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
					delNetwork(data.id).then((res) => {
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
		getList() {
			let params = {
				page: 1,
				pageSize: 20,
				...this.formInline,
			}
			ApiNetwork('page', params).then((res) => {
				if (res.status == 1) {
					this.tableData = res.data.records
				}
			})
		},
		handleAdd() {
			this.$emit('handleFunc', { type: 'add' })
		},
		handleEdit(row) {
			this.$emit('handleFunc', { type: 'edit', value: row })
		},
	},
}
</script>
<style scoped>
.tableList {
	height: 100%;
}
.demo-form-inline {
	background-color: #fff;
	padding: 16px 16px 0 16px;
	/* margin-bottom: 16px; */
}
</style>