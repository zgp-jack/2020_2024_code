<template>
	<div class="container text-center">
		<div class="login-box">
			<div class="login-box-img">
				<img src="@/assets/login-img.png">
			</div>
			<div class="login-box-panel">
				<div class="login-logo">
					<img src="@/assets/logo-name.png" />
				</div>
				<div class="error-box">
					<div class="errortip" v-if="!!errorTipText"><i class="el-icon-error"></i>{{ errorTipText }}</div>
				</div>
				<el-input class="form-control" type="text" placeholder="请输入昵称" required autofocus v-model="user_name" @keyup.enter.native="submit"></el-input>
				<br />
				<el-input class="form-control" type="password" placeholder="请输入密码" required autofocus v-model="password" @keyup.enter.native="submit"></el-input>
				<br />
				<div class="verification-div name-div">
					<input style="display: none" />
					<el-input class="name-input verification-input form-control" type="text" v-model="verification" @keyup.enter.native="submit" placeholder="验证码"></el-input>
					<img v-if="verImgUrl" :src="verImgUrl" @click="getVerition" class="verification-view" />
					<img v-else class="verification-view" />
				</div>
				<el-button class="btn btn-primary btn-block" @click="submit">登录</el-button>
			</div>
		</div>
	</div>
</template>
<script>
// import crypto from 'crypto'
import jwtDecode from 'jwt-decode';
import { reqLogin } from '@/api';

export default {
	name: 'login',
	data() {
		return {
			user_name: '',
			password: '',
			verImgUrl: '',
			verification: '',
			key: '',
			errorTipText: '',
		}
	},
	mounted() {
		// this.key = new Date().getTime() + Math.floor(Math.random() * 1000) / 1000
		// this.verImgUrl = '/img/code?key=' + this.key
		this.getVerition()
	},
	methods: {
		getVerition() {
			let $this = this
			$this.verImgUrl = ''
			$this.$nextTick(() => {
				$this.key = new Date().getTime() + Math.floor(Math.random() * 1000) / 1000
				$this.verImgUrl = '/imgv/code?key=' + $this.key
			})
		},
		submit() {
			if (!this.user_name) {
				this.errorTipText = '用户名不能为空！'
			} else if (!this.password) {
				this.errorTipText = '密码不能为空！'
			} else if (!this.verification) {
				this.errorTipText = '验证码不能为空！'
			} else {
				let loginParam = {
					username: this.user_name,
					// password: crypto.createHash('md5').update(this.password, 'utf8').digest('hex'),
					password: this.password,
					rememberMe: 1,
					captcha: this.verification,
					key: this.key,
				}
				reqLogin(loginParam).then((res) => {
					if (res.status === 1) {
						this.$store.dispatch('getRuleTypeAction')
						this.$store.commit('SETTOKEN', res.data.token)
						this.$store.commit('updateNavAction', 'index')

						const decode = jwtDecode(res.data.token);
						const user = {name: decode.sub, id: decode.id, role: decode.role};
						sessionStorage.setItem('user', JSON.stringify(user));
						
						sessionStorage.setItem('menuArr', JSON.stringify(decode.menus));

						this.$router.push({ path: '/index' })
					} else {
						this.errorTipText = res.message
						this.getVerition()
					}
				})
			}
			setTimeout(() => {
				this.errorTipText = ''
			}, 3000)
		},
	},
}
</script>
<style lang="scss" scoped>
.login-logo{
	width: 100%;
	text-align: left;
}

.login-logo span {
	font-size: 22px;
	font-weight: bold;
	color: #191919;
	display: inline-block;
	line-height: 28px;
	vertical-align: middle;
}
.login-logo img{
	width: 439PX;
	height: 98px;
	display: inline-block;
	vertical-align: middle;
	margin-top: 60px;
}
.login-box{
	background-color: #fff;
	width: 1360px;
	height: 720px;
	padding: 32px 32px 56px 32px;
	margin: auto;
	box-sizing: border-box;
	display: flex;
	box-shadow: 0px 6px 30px 5px rgba(0,102,102,0.05), 0px 16px 24px 2px rgba(0,102,102,0.04), 0px 8px 10px -5px rgba(0,102,102,0.08), 0px -1px 5px -2px rgba(0,102,102,0.1);
	border-radius: 8px 8px 8px 8px;
}
.login-box-img {
	flex: 1;
	padding: 73px 0 0 44px;
}
.login-box-panel{
	flex: 1;
	padding: 0 32px 0 120px;
}
.container {
	height: 100%;
	height: 100%;
	background: url('@/assets/login-bg.png');
	box-sizing: border-box;
	padding-top: 10vh;
}
.login-title {
	text-align: left;
	color: #191919;
	font-size: 18px;
}
.login-title::after {
		content: '';
		display: block;
		width: 32px;
		height: 4px;
		background: #006666;
	}
.form-control {
	height: 48px;
	margin-bottom: 60px;
	font-size: 18px;
}
.btn {
	width: 100%;
	color: #fff;
	background-color: #006666;
	border-color: #006666;
}
.name-div {
	position: relative;
	/* margin-bottom: 16px; */
}
.verification-view {
	position: absolute;
	right: 0;
	cursor: pointer;
	width: 120px;
	height: 56px;
	top: -8px;
}
.error-box{
	height: 40px;
	width: 100%;
}
.errortip {
	display: inline-block;
	height: 32px;
	width: auto;
	margin: 4px 0 4px 0;
	padding: 0 16px;
	text-align: center;
	color: #191919;
	line-height: 32px;
	background-color: #FFF2F0;
	border: 1px solid #F6EBE6;
	i{
		color: #FD8166;
		margin-right: 8px;
	}
}
</style>