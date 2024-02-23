<template>
	<div style="background-color: #fff">
		<p class="title">登录</p>
		<van-image round width="240px" fit="cover" height="240px" :src="require('../assets/cat.jpeg')" />
		<van-form style="margin: 20px 0">
			<van-field v-model="username" name="用户名" label="用户名" placeholder="用户名" :rules="[{ required: true, message: '请填写用户名' }]" />
			<van-field v-model="password" type="password" name="密码" label="密码" placeholder="密码" :rules="[{ required: true, message: '请填写密码' }]" />
			<van-checkbox class="vancheck" v-model="rememberThePwd" shape="square" @change="onChange"> 记住密码 </van-checkbox>
			<div style="margin: 30px 20px">
				<van-button round block type="info" native-type="submit" @click="onSubmit">登录</van-button>
			</div>
			<div class="reg">
				<div @click="toRegister"></div>
			</div>
		</van-form>
	</div>
</template>

<script>
import { Toast } from 'vant'
import crypto from 'crypto'
export default {
	name: 'Login',
	data() {
		return {
			username: localStorage.username || '',
			password: localStorage.password || '',
			rememberThePwd: localStorage.remember === '1',
		}
	},
	methods: {
		onSubmit(values) {
			if (this.rememberThePwd) {
				localStorage.setItem('username', this.username)
				localStorage.setItem('password', this.password)
				localStorage.setItem('remember', '1')
			}
			this.$axiosHttp({
				method: 'get',
				url: '/api/user/login',
				params: {
					username: this.username,
					password: crypto.createHash('md5').update(this.password, 'utf8').digest('hex'),
				},
			}).then((res) => {
				if (res.status === 200) {
					const data = res.data.data
					if (res.data.code === 0) {
						sessionStorage.setItem('user', JSON.stringify(data.role))
						sessionStorage.setItem('user_name', data.username)
						sessionStorage.setItem('token', data.accessToken)
						this.$router.push({ path: '/device' })
					}
				}
			})
		},
		toRegister() {},
		onChange() {},
	},
}
</script>

<style>
.title {
	/* border-radius: 15px; */
	size: 1px;
	height: 50px;
	line-height: 50px;
	background-color: #20a0ff;
	color: #fff;
	text-align: center;
	font-size: 18px;
	margin-bottom: 10px;
}
.vancheck {
	height: 40px;
	margin: 4px 0 4px 15px;
	font-size: 14px;
}
.van-checkbox__label {
	color: #646566;
}
</style>