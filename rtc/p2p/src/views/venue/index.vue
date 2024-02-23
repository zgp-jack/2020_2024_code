<template>
	<el-container class="page-container">
		<div class="table-panel">
			<el-form :inline="true" size="mini" :model="formInline" class="demo-form-inline" slot="left">
				<el-form-item label="">
					<el-input v-model="formInline.stationName" placeholder="场站名称">
						<el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getList">查询</el-button>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="tableData" stripe style="width: 100%" height="calc(100% - 80px)">
				<el-table-column type="index" label="序号" width="180"> </el-table-column>
				<el-table-column prop="stationName" label="场站名称" width="180"> </el-table-column>
				<el-table-column prop="typeName" label="场站类型" width="180"> </el-table-column>
				<el-table-column prop="longitudeStr" label="经度"> </el-table-column>
				<el-table-column prop="latitudeStr" label="纬度"> </el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
						<el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-dialog title="场站" v-if="dialogVisible" :visible.sync="dialogVisible" width="30%" center>
			<el-form
				:model="formData"
				status-icon
				:rules="rules"
				ref="ruleForm"
				label-position="left"
				label-width="100px"
				class="form-user"
			>
				<el-form-item label="场站名称" prop="username">
					<el-input
						type="text"
						placeholder="请输入场站名称"
						v-model="formData.stationName"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="场站类型" prop="type">
					<el-select v-model="formData.type" placeholder="请选择">
						<el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="经度" prop="longitude">
					<el-input-number placeholder="经度" style="width: 100%;" v-model="formData.longitude" :precision="14" :step="0.01" :min="-180" :max="180"></el-input-number>
				</el-form-item>
				<el-form-item label="纬度" prop="latitude">
					<el-input-number placeholder="纬度" style="width: 100%;" v-model="formData.latitude" :precision="14" :step="0.01" :min="-90" :max="90"></el-input-number>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm()">确 定</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>

<script>
import tool from '@/js/tool.js'
export default {
	data() {
		return {
			formInline: { stationName: '' },
			tableData: [],
			dialogVisible: false,
			formData: {
				stationName: '',
				type: null,
				longitude: 0,
				latitude: 0
			},
			rules: {
				
			},
			typeList: [
				{id: 1, name: '平台'},
				{id: 2, name: '集气站'},
				{id: 3, name: '作业区'}
			],
			submitType: 'add',
		};
	},
	mounted() {
		this.getList();
	},
	methods: {
		getList() {
			this.$axios({
				method: 'get',
				url: '/api/station/list',
				params: { stationName: this.formInline.stationName },
			}).then((res) => {
				const data = res.data.data;
				if (data.status === 1) {
					this.tableData = data.data.map(item => {
						return {
							...item,
							typeName: this.typeList.filter(t => t.id === item.type)[0].name,
							longitudeStr: tool.decimalToDMS(item.longitude, 1),
							latitudeStr: tool.decimalToDMS(item.latitude, 0),
						}
					});
				}
			});
		},
		handleAdd() {
			this.formData = {
				stationName: '',
				type: null,
				longitude: '',
				latitude: ''
			};
			this.dialogVisible = true;
			this.submitType = 'add';
		},
		handleEdit(item) {
			this.formData['id'] = item.id;
			this.formData.stationName = item.stationName;
			this.formData.type = item.type;
			this.formData.longitude = item.longitude;
			this.formData.latitude = item.latitude;
			this.dialogVisible = true;
			this.submitType = 'edit';
		},
		handleDelete(item) {
			this.$confirm('确认删除该场站?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.$axios({
						method: 'get',
						url: '/api/station/delete',
						params: { id: item.id },
					}).then((res) => {
						const data = res.data.data;
						if (res.data.code === 0) {
							this.getList();
							this.$message({
								type: 'success',
								message: '删除成功!',
							});
						}
					});
				})
				.catch(() => {});
		},
		submitForm() {
			const url = this.submitType === 'add' ? '/api/station/save' : '/api/station/update';
			this.$refs.ruleForm.validate((valid) => {
				if (valid) {
					this.$axios({
						method: 'get',
						url: url,
						params: { ...this.formData },
					}).then((res) => {
						const data = res.data.data;
						decodeURI;
						if (res.data.code === 0) {
							this.$message({
								type: 'success',
								message: this.submitType === 'add' ? '新增成功！' : '修改成功！',
							});
							this.dialogVisible = false;
							this.getList();
						}
					});
				}
			});
		},
	},
};
</script>
<style scoped>
.demo-form-inline{
	padding: 0 10px;
}
</style>