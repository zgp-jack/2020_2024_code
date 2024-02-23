<template>
	<div>
		<el-transfer
			filterable
			:filter-method="filterMethod"
			filter-placeholder="请输入用户名称"
			v-model="value"
			:titles="['未加入', '已加入']"
			:data="tableData"
			:render-content="renderFunc"
		>
		</el-transfer>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleCancel">取 消</el-button>
			<el-button type="primary" @click="handleSubmit">确 定</el-button>
		</div>
	</div>
</template>
<script>
import axios from 'axios';
export default {
	props: {
		group: {
			type: Object,
		},
	},
	data() {
		return {
			tableData: [],
			value: [],
			renderFunc(h, option) {
				return (
					<span>
						{option.type == 1 ? <i class="el-icon-s-custom"></i> : <i class="el-icon-video-camera-solid"></i>}
						{option.label}
					</span>
				);
			},
		};
	},
	mounted() {
		this.getList();
	},
	methods: {
		async getList() {
			const groupUser = this.group.children.map((item) => item.id);
			this.value = groupUser;
			let resUser = await axios.get('/api/user/query');
			let resDevice = await axios.get('/debug/api/device/query/devices?page=1&count=15');
			this.tableData = resUser.data.data.data.map((item) => {
				return {
					key: item.id,
					label: item.username,
					disabled: groupUser.indexOf(item.id) >= 0,
					type: 1, // 1 是用户， 0是设备
				};
			});
			resDevice.data.data.list.forEach((item) => {
				this.tableData.push({
					key: item.deviceId,
					label: item.name,
					disabled: groupUser.indexOf(item.deviceId) >= 0,
					type: 0,
				});
			});
		},
		filterMethod(query, item) {
			return item.label.indexOf(query) > -1;
		},
		handleSubmit() {
			const params = {
				id: this.group.id,
				userIds: this.value.filter((item) => typeof item == 'number').join(),
				deviceIds: this.value.filter((item) => typeof item == 'string').join(),
			};
			const oldVal = this.group.children.map((item) => item.id);
			let insertIds = [];
			let insertList = [];
			this.value.forEach((n) => {
				let has = false;
				oldVal.forEach((o) => {
					if (o === n) {
						has = true;
					}
				});
				if (!has) {
					insertIds.push(n);
				}
			});
			insertList = this.tableData.filter((i) => insertIds.findIndex((j) => j === i.key) >= 0);
			this.$axios({
				method: 'get',
				url: '/api/group/updateUser',
				params,
			}).then((res) => {
				const data = res.data.data;
				if (data.status === 1) {
					this.$emit('handleSuccess', insertList);
				}
			});
		},
		handleCancel() {
			this.$emit('cancleVisible');
		},
	},
};
</script>
<style>
.el-transfer-panel {
	text-align: left;
}
.dialog-footer {
	margin-top: 20px;
}
</style>