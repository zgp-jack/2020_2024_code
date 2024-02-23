<template>
	<div class="header">
		<div class="sys-name">
			<img src="@/assets/logo-name.png" />
		</div>
		<span class="header-item header-img1">
			<el-popover placement="bottom" trigger="hover">
				<p class="header-user"><i class="el-icon-user"></i>{{ user.name }}</p>
				<p class="header-user"><i class="el-icon-lock"></i>{{ user.role }}</p>
				<i class="el-icon-user-solid" slot="reference"></i>
			</el-popover>
		</span>
		<span class="header-item header-img2" @click="handleEditPwd">
			<i class="el-icon-s-tools" style="margin: 0"></i>
		</span>
		<span class="header-item header-img3" @click="loginOut"><i class="el-icon-switch-button"></i></span>
	</div>
</template>
<script>
import ApiUser from '@/api/user'
const user = JSON.parse(sessionStorage.getItem('user'));
export default {
	name: 'headerTop',
	data() {
		return {
			user: {
				id: user.id,
				name: user.name,
				role: (user.role || {}).name,
			},
		}
	},
	methods: {
		loginOut() {
			ApiUser.loginOut()
				.then((res) => {
					sessionStorage.clear()
					this.$router.push('/login')
				})
				.catch((error) => {
					sessionStorage.clear()
					this.$router.push('/login')
				})
		},
		handleEditPwd() {
			this.$prompt('新密码', '修改密码', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputType: 'password',
				inputErrorMessage: '修改密码格式不正确',
			})
				.then(({ value }) => {
					const params = {
						id: this.user.id,
						password: value, //this.$md5(value + '/~!@#$%^&*+web+')
					}
					ApiUser.resetPwd(params).then((res) => {
						if (res.status) {
							this.$message({
								message: '修改密码成功',
								type: 'success',
							})
							this.loginOut();
						}
					})
				})
				.catch(() => {})
		},
	},
}
</script>
<style>
.header {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: end;
}
.sys-name{
	flex: 1;
}
.sys-name span {
	font-family: 'DingTalk';
	font-size: 26px;
	font-weight: bold;
	color: #333;
	display: inline-block;
	vertical-align: middle;
	padding-left: 4px;
}
.sys-name img{
	height: 46px;
	display: inline-block;
	vertical-align: middle;
}
.header-item {
	display: inline-block;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	font-size: 18px;
	margin-right: 16px;
	text-align: center;
	cursor: pointer;
}
.header-item i {
	font-size: 16px;
	color: #757e7e;
}
.header-img2,
.header-img1 {
	background-color: #f0f7f7;
}
.header-img1,
.header-img2,
.header-img3 {
	line-height: 30px;
}
.header-img3 {
	margin-left: 16px;
	background: #ffffff;
	border: 1px solid #dde9e8;
	line-height: 28px;
}
.header-user i {
	font-size: 16px;
	vertical-align: middle;
	padding-right: 8px;
	line-height: 24px;
}
</style>