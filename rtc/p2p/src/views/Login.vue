<template>
	<div class="login-container">
	  	<el-form class="login-form" ref="form" :model="form" label-width="0px" @keyup.enter.native="submit">
			<h2>应急通信指挥系统</h2>
			<el-form-item label="" prop="username">
				<el-input v-model="form.username">
					<i slot="prefix" class="el-input__icon icon-user"></i>
				</el-input>
			</el-form-item>
			<el-form-item label="" prop="password">
				<el-input type="password" v-model="form.password">
					<i slot="prefix" class="el-input__icon icon-pwd"></i>
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submit" style="width: 100%;">登录</el-button>
			</el-form-item>
	  	</el-form>
	</div>
</template>
<script>
import crypto from 'crypto';
export default {
	data() {
		return {
			form: {
				username: '',
				password: ''
			},
		};
	},
	methods: {
		submit() {
			if (this.form.username !== '' && this.form.password !== '') {
				let loginParam = {
					username: this.form.username,
					password: crypto.createHash('md5').update(this.form.password, 'utf8').digest('hex'),
				};
				this.$axios({
					method: 'get',
					url: '/api/user/login',
					params: loginParam,
				}).then((res) => {
					if (res.status === 200) {
						const data = res.data.data;
						if (res.data.code === 0) {
							sessionStorage.setItem('user', JSON.stringify(data.role));
							sessionStorage.setItem('user_name', data.username);
							sessionStorage.setItem('token', data.accessToken);
							this.$router.push({ path: '/home' });
						}
					}
				});
			}
		},
	},
};
</script>
<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(../assets/login.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}
.login-form {
  width: 404px;
  height: 420px;
  background-image: url(../assets/login-box.png);
  background-repeat: no-repeat;
  background-size: cover;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.login-form h2 {
	font-size: 28px;
	color: #DEE7FF;
	margin: 30px 0;
}
.login-form .el-form-item {
	width: 85%;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 30px;
}
.login-form .el-input__inner{
	background: rgba(118,171,255,0.12);
	border: 1px solid rgba(60,175,255,1);
	color: #fff;
}
</style>