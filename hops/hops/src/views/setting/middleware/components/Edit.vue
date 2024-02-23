<template>
	<div>
		<el-form :model="formData">
			<el-form-item label="名称" :label-width="formLabelWidth">
				<el-input v-model="formData.name" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="类型" :label-width="formLabelWidth">
				<el-select v-model="formData.type" placeholder="请选择类型">
					<el-option label="iis" :value="5"></el-option>
					<el-option label="jvm" :value="6"></el-option>
					<el-option label="tomcat" :value="7"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="版本" :label-width="formLabelWidth">
				<el-input v-model="formData.version" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="用户名" :label-width="formLabelWidth">
				<el-input v-model="formData.username" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="密码" :label-width="formLabelWidth">
				<el-input v-model="formData.password" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="端口" :label-width="formLabelWidth">
				<el-input v-model="formData.port" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="ip地址" :label-width="formLabelWidth">
				<el-input v-model="formData.host" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="是否启用ssl" :label-width="formLabelWidth">
				<el-select v-model="formData.jmxSsl" placeholder="请选择是否启用ssl">
					<el-option label="停用" :value="0"></el-option>
					<el-option label="启用" :value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="认证ID" :label-width="formLabelWidth">
				<el-input v-model="formData.authId" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="超时时间" :label-width="formLabelWidth">
				<el-input v-model="formData.jmxTimeout" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="位置" :label-width="formLabelWidth">
				<el-input v-model="formData.position" autocomplete="off"></el-input>
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
	props: ['formData'],
	data() {
		return {
			formLabelWidth: '120px',
			visible: false,
			orderUserList: []
		}
	},
	computed: {
		...mapState({
            orderUser: state => state.orderUser,
			orderUserNormal: state => state.orderUserNormal,
        })
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