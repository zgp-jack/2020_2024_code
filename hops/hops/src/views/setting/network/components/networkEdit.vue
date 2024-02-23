<template>
	<div class="networkEdit">
		<el-form :model="formData">
			<el-form-item label="名称" :label-width="formLabelWidth">
				<el-input v-model="formData.name" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="类型" :label-width="formLabelWidth">
				<el-select v-model="formData.type" placeholder="请选择设备" :disabled="dialogTitle == '编辑' ? true : false">
					<el-option v-for="item in typeOption" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="厂商" :label-width="formLabelWidth">
				<el-input v-model="formData.manufactor" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="型号" :label-width="formLabelWidth">
				<el-input v-model="formData.model" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="管理地址" :label-width="formLabelWidth">
				<el-input v-model="formData.managerIp" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="管理端口" :label-width="formLabelWidth">
				<el-input v-model="formData.managerPort" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="snmp目的ip" :label-width="formLabelWidth">
				<el-input v-model="formData.targetIp" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="snmp端口" :label-width="formLabelWidth">
				<el-input v-model="formData.port" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="位置" :label-width="formLabelWidth">
				<el-input v-model="formData.position" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="维护人员" :label-width="formLabelWidth">
				<el-cascader v-model="orderUserList" :options="orderUser" :show-all-levels="false" filterable style="width: 100%;"></el-cascader>
			</el-form-item>
			<el-form-item label="绑定设备" :label-width="formLabelWidth">
				<el-select v-model="formData.oidInfoId" placeholder="请选择设备">
					<el-option v-for="item in oidTableData" :key="item.id" :label="item.manufactor + '-' + item.model" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="版本" :label-width="formLabelWidth">
				<el-select v-model="formData.snmpVersion" placeholder="请选择版本">
					<el-option label="1" :value="1"></el-option>
					<el-option label="2" :value="2"></el-option>
					<el-option label="3" :value="3"></el-option>
				</el-select>
			</el-form-item>
			<template v-if="formData.snmpVersion == 1 || formData.snmpVersion == 2">
				<el-form-item label="团体名" :label-width="formLabelWidth">
					<el-input v-model="formData.snmpTeam" autocomplete="off"></el-input>
				</el-form-item>
			</template>
			<template v-else>
				<el-form-item label="认证等级" :label-width="formLabelWidth">
					<el-select v-model="formData.snmpLevel" placeholder="请选择版本">
						<el-option label="noAuthNoPriv" value="noAuthNoPriv"></el-option>
						<el-option label="authNoPriv" value="authNoPriv"></el-option>
						<el-option label="authPriv" value="authPriv"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="用户名" :label-width="formLabelWidth">
					<el-input v-model="formData.snmpName" autocomplete="off"></el-input>
				</el-form-item>
				<template v-if="formData.snmpLevel == 'authNoPriv' || formData.snmpLevel == 'authPriv'">
					<el-form-item label="认证方式" :label-width="formLabelWidth">
						<el-input v-model="formData.snmpAuth" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="密码" :label-width="formLabelWidth">
						<el-input v-model="formData.snmpPass" autocomplete="off"></el-input>
					</el-form-item>
				</template>
				<template v-if="formData.snmpLevel == 'authPriv'">
					<el-form-item label="授权方式" :label-width="formLabelWidth">
						<el-input v-model="formData.snmpPrivacy" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="秘钥" :label-width="formLabelWidth">
						<el-input v-model="formData.snmpPrivacyKey" autocomplete="off"></el-input>
					</el-form-item>
				</template>
			</template>
		</el-form>
		<slot name="submit"></slot>
	</div>
</template>
<script>
import { mapState } from 'vuex';
export default {
	name: 'networkEdit',
	props: ['formData', 'oidTableData', 'dialogTitle'],
	data() {
		return {
			formLabelWidth: '',
			visible: false,
			typeOption: [],
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
		this.typeOption = this.$store.state.ruleType.filter((item) => {
			return item.pid == 2
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