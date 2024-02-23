<template>
	<div fill style="padding: 20px 20px 160px 20px">
		<VideoPlay></VideoPlay>
		<transition name="van-slide-up">
			<AudioPlay :title="call_username"></AudioPlay>
		</transition>
		<h2 class="box-title">{{ title }}列表</h2>
		<van-grid :border="false" :column-num="2" :gutter="20">
			<van-grid-item v-for="(user, index) in userList" :key="index">
				<div class="card-icon" :style="{ 'background-color': user.status === 1 ? '#1a539a' : '#a6a6a6' }">
					<van-icon name="desktop-o" size="15rem" />
				</div>
				<span>{{ user.name }}</span>
				<van-tag type="primary" v-if="user.status === 1">在线</van-tag>
				<van-tag color="#b3b6b9" v-if="user.status === 0">离线</van-tag>
				<van-tag type="success" v-if="user.status === 2">通话中</van-tag>
				<van-row style="width: 100%" v-if="user.status === 1">
					<van-col span="12">
						<div class="btn-cell" @click="audioCall(user.name)"><van-icon name="audio" size="4rem" />语音通话</div>
					</van-col>
					<van-col span="12">
						<div class="btn-cell" @click="videoCall(user.name)" style="background-color: #1989fa"><van-icon name="live" size="4rem" />视频通话</div>
					</van-col>
				</van-row>
				<van-row style="width: 100%" v-else>
					<van-col span="12">
						<div class="btn-cell" style="background-color: #b3b6b9"><van-icon name="audio" size="4rem" />语音通话</div>
					</van-col>
					<van-col span="12">
						<div class="btn-cell" style="background-color: #b3b6b9"><van-icon name="live" size="4rem" />视频通话</div>
					</van-col>
				</van-row>
			</van-grid-item>
		</van-grid>
		<!-- <van-card
        v-for="user,index in userList"
        :key="index"
        :desc="user.name"
        :title="user.name"
        thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
      >
        <template #thumb>
          <van-icon name="desktop-o" size="15rem"/>
        </template>
        <template #tags>
          <van-tag type="primary" v-if="user.status === 1">在线</van-tag>
          <van-tag type="danger" v-if="user.status === 0">离线</van-tag>
          <van-tag type="success" v-if="user.status === 2">通话中</van-tag>
        </template>
        <template #footer>
          <van-button type="info" size="mini" @click="audioCall(user.name)" icon="audio">语音通话</van-button>
          <van-button type="info" size="mini" @click="videoCall(user.name)" icon="live">视频通话</van-button>
        </template>
      </van-card> -->
	</div>
</template>
<script>
import { PullRefresh } from 'vant'
import Bus from './Bus'
import commonFun from '../js/commonFun'
export default {
	name: 'device',
	data() {
		return {
			user_name: sessionStorage.user_name,
			call_username: '',
			userList: [],
			title: '设备',
		}
	},
	computed: {
		users() {
			return this.$store.state.users
		},
	},
	components: {
		VideoPlay: () => import('./VideoPlay.vue'),
		AudioPlay: () => import('./AudioPlay.vue'),
	},
	mounted() {
		this.getUserList()
		this.title = this.$route.params.name || '设备'
		Bus.$off('setCallName').$on('setCallName', (data) => {
			this.call_username = data.name
		})
	},
	methods: {
		audioCall(user) {
			if (user == this.user_name) {
				return false
			}
			this.call_username = user
			Bus.$emit('audioCall', user)
		},
		videoCall(user) {
			if (user == this.user_name) {
				return false
			}
			this.call_username = user
			Bus.$emit('videoCall', user)
		},
		getUserList() {
			this.$axiosHttp.get('/api/user/query').then((res) => {
				const data = res.data.data
				if (data.status === 1) {
					this.userList = data.data.map((item) => {
						return {
							name: item.username,
							id: item.id,
							status: 0,
						}
					})
					this.setUserStatus(this.users)
				}
			})
		},
		setUserStatus(users) {
			this.userList.forEach((u) => {
				users.forEach((uu) => {
					if (u.name === uu.name) {
						u['status'] = 1
					}
				})
			})
			commonFun.orderBy(this.userList, ['status'], 'desc')
		},
	},
	watch: {
		users: {
			handler: function (val) {
				this.setUserStatus(val)
			},
			deep: true,
			immediate: true,
		},
	},
}
</script>
<style lang="css">
.card-icon {
	width: 100%;
	height: 30rem;
	background-color: #1a539a;
	padding-top: 7rem;
	color: #fff;
}
.van-card__content {
	text-align: left;
}
.van-grid-item__content--center {
	padding: 0 !important;
}
.btn-cell {
	font-size: 12px;
	background-color: #07c160;
	color: #fff;
	margin-top: 10px;
	height: 30px;
	line-height: 30px;
}
</style>