<template>
	<div class="portEdit">
		<el-form :model="formData">
			<el-form-item label="端口名称" :label-width="formLabelWidth">
				<el-input v-model="formData.name" autocomplete="off" disabled></el-input>
			</el-form-item>
			<el-form-item label="IP" :label-width="formLabelWidth">
				<el-input v-model="formData.ip" autocomplete="off" disabled></el-input>
			</el-form-item>
			<el-form-item label="参考带宽" :label-width="formLabelWidth">
				<el-input v-model="formData.standardBand" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="实时流量" :label-width="formLabelWidth">
				<el-input v-model="formData.portSpeed" autocomplete="off" placeholder="请输入实时流量" disabled></el-input>
			</el-form-item>
			<el-form-item label="状态" :label-width="formLabelWidth">
				<el-input v-model="formData.statusName" autocomplete="off" disabled></el-input>
			</el-form-item>
			<el-form-item label="维护人员" :label-width="formLabelWidth">
				<el-cascader v-model="orderUserList" :options="orderUser" :show-all-levels="false" filterable style="width: 100%;"></el-cascader>
			</el-form-item>
		</el-form>
		<slot name="submit"></slot>
	</div>
</template>
<script>
import { mapState } from 'vuex';
export default {
	name: 'portEdit1',
	props: ['formData'],
	data() {
		return {
			formLabelWidth: '',
			visible: false,
			orderUserList: []
		}
	},
	mounted() {
		this.orderUserList = [];
		const sendUser = this.formData['sendUser'];
		if(!!sendUser) {
			const checkUser = this.orderUserNormal.find(user => user.userId === sendUser);
			if(!!checkUser.teamId) {
				this.orderUserList.push(checkUser.teamId + 100000);
			}
			this.orderUserList.push(checkUser.userId);
		}
	},
	computed: {
		...mapState({
            orderUser: state => state.orderUser,
			orderUserNormal: state => state.orderUserNormal,
        })
	},
	methods: {
		submitForm() {},
	},
	watch: {
		orderUserList: {
			handler: function(val) {
				const len = val.length;
				this.formData.sendUser = len ? val[len - 1] : undefined;
			},
			deep: true
		}
	}
}
</script>