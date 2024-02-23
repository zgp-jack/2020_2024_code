<template>
	<div class="tableList">
		<el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label="">
				<el-input v-model="formInline.name" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item label="">
				<!-- <el-input v-model="formInline.type" placeholder="请选择类型"></el-input> -->
				<el-select v-model="formInline.type" clearable placeholder="请选择类型">
					<el-option label="iis" :value="5"></el-option>
					<el-option label="jvm" :value="6"></el-option>
					<el-option label="tomcat" :value="7"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<div class="common-btn" @click="search">查询</div>
				<div class="common-btn" @click="handleAdd">新增</div>
			</el-form-item>
			<el-form-item style="float: right">
				<div class="common-btn" @click="handleDown">下载模板</div>
				<el-upload
					:action="uploadUrl"
					:show-file-list="false"
					:on-success="handleUploadSuccess"
					:on-error="handleUploadError"
					:before-upload="handleUploadBefore"
					:headers="myHeaders"
					accept=".xlsx,.xls"
					style="display: inline-block"
				>
					<div class="common-btn"><i class="pageImport-img"></i>导入</div>
				</el-upload>
				<div class="common-btn" @click="handleExport">导出</div>
			</el-form-item>
		</el-form>
		<el-table :data="tableData" height="calc(100% - 101px)">
			<el-table-column prop="index" align="center" label="序号" type="index"> </el-table-column>
			<el-table-column prop="name" align="center" label="名称"> </el-table-column>
			<el-table-column prop="type" align="center" label="类型">
				<template slot-scope="scope">{{ scope.row.type == 5 ? 'iis' : scope.row.type == 6 ? 'jvm' : 'tomcat' }}</template>
			</el-table-column>
			<el-table-column prop="version" align="center" label="版本"> </el-table-column>
			<el-table-column prop="username" align="center" label="用户名"> </el-table-column>
			<el-table-column prop="password" align="center" label="密码"> </el-table-column>
			<el-table-column prop="port" align="center" label="端口"> </el-table-column>
			<el-table-column prop="host" align="center" label="ip地址"> </el-table-column>
			<el-table-column prop="jmxSslName" align="center" label="是否启用ssl"> </el-table-column>
			<el-table-column prop="jmxTimeout" align="center" label="超时时间"> </el-table-column>
			<el-table-column prop="authId" align="center" label="认证ID"> </el-table-column>
			<el-table-column prop="position" align="center" label="位置"> </el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<span title="编辑" @click="handleEdit(scope.row)"><i class="el-icon-s-tools"></i></span>
					<span title="删除" @click="delData(scope.row)"><i class="el-icon-delete-solid"></i></span>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			style="float: right; margin-top: 16px"
			@current-change="handleCurrentChange"
			:current-page.sync="currentPage"
			:page-size="pageSize"
			:page-sizes="[10, 20, 50, 100]"
			layout="sizes,total,prev, pager, next, jumper"
			@size-change="handleSizeChange"
			:total="total"
		>
		</el-pagination>
	</div>
</template>
<script>
import { getMiddleList, delMiddle, downExportTempMiddle, exportMiddle } from '@/api'
import { MessageBox } from 'element-ui'
export default {
	name: 'listable',
	data() {
		return {
			formInline: {
				type: '',
			},
			tableData: [],
			uploadUrl: '/api/jmx/importData',
			myHeaders: { token: sessionStorage.getItem('TOKEN') },
			currentPage: 1,
			pageSize: 10,
			total: 0,
		}
	},
	mounted() {
		this.getList()
	},
	methods: {
		search() {
			this.currentPage = 1
			this.getList()
		},
		handleSizeChange(val) {
			this.currentPage = 1
			this.pageSize = val
			this.getList()
		},
		handleCurrentChange(val) {
			this.currentPage = val
			this.getList()
		},
		delData(data) {
			MessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				center: true,
			})
				.then(() => {
					delMiddle(data.id).then((res) => {
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
				page: this.currentPage,
				pageSize: this.pageSize,
				...this.formInline,
			}
			getMiddleList(params).then((res) => {
				if (res.status == 1) {
					res.data.records.forEach((item) => {
						if (item.jmxSsl == '0') {
							item.jmxSslName = '停用'
						} else if (item.jmxSsl == '1') {
							item.jmxSslName = '启用'
						}
					})
					this.total = res.data.total
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
		handleDown() {
			downExportTempMiddle({}).then((res) => {
				if (res.status === 1) {
					window.open(`/file/${res.data}`)
				}
			})
		},
		handleExport() {
			exportMiddle(this.formInline).then((res) => {
				if (res.status === 1) {
					window.open(`/file/${res.data}`)
				}
			})
		},
		//上传相关
		handleUploadSuccess: function (response, file, fileList) {
			if (response.status == 1) {
				this.getList()
			} else {
			}
		},
		handleUploadError: function (err, file, fileList) {
			console.log('返回错误内容：')
			console.log(err, file, fileList)
		},
		handleUploadBefore: function (file) {},
	},
}
</script>
<style scoped>
.tableList {
	height: 100%;
	background-color: #fff;
	padding: 16px;
}
.demo-form-inline {
	background-color: #fff;
}
</style>