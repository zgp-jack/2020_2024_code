<template>
	<div fill style="padding: 20px">
		<h2 class="box-title">集群列表</h2>
		<van-cell-group inset class="group-box">
			<van-cell v-for="(item, index) in groupList" :key="index" :title="item.name" icon="friends-o" value="" @click="onGroupSelect(item)">
				<template #label>
					<span v-for="m in item.children" :class="['custom-title', { 'user-online': m.online }]">
						<van-icon name="manager" v-if="m.master" />
						<van-icon name="user-o" v-else />
						{{ m.name }}
					</span>
				</template>
				<template #right-icon>
					<van-icon name="phone" class="search-icon" />
				</template>
			</van-cell>
		</van-cell-group>
		<van-action-sheet v-model="showAction" :actions="actions" cancel-text="取消" @select="onSelect"> </van-action-sheet>
		<van-popup v-model="showPicker" position="bottom" get-container="#app">
			<van-picker show-toolbar :columns="userList" @cancel="showPicker = false" @confirm="onConfirm" value-key="name" item-height="100px" />
		</van-popup>
		<van-action-sheet v-model="showUser" :actions="actionsUser" cancel-text="取消" @select="onUserSelect"> </van-action-sheet>
		<transition name="van-slide-up">
			<AudioPlay :open="checkedList[0]" :title="call_username"></AudioPlay>
		</transition>
		<transition name="van-slide-up">
			<MultiVideoPlay :open="checkedList[0]" :title="call_username"></MultiVideoPlay>
		</transition>
	</div>
</template>
<script>
import Bus from './Bus'

export default {
	data() {
		return {
			groupList: [],
			checkedList: [true, false],
			call_username: '',
			showAction: false,
			actions: [
				{ name: '发起语音通话', code: 'audio' },
				{ name: '发起视频通话', code: 'video' },
				{ name: '添加用户进入集群', code: 'join' },
			],
			user: JSON.parse(sessionStorage.getItem('user')),
			selectGroup: null,
			showUser: false,
			actionsUser: [],
			userList: [],
			showPicker: false,
		}
	},
	components: {
		AudioPlay: () => import('./AudioPlay.vue'),
		MultiVideoPlay: () => import('./MultiVideoPlay.vue'),
	},
	mounted() {
		this.getGroupList()
		this.getUserList()
		Bus.$off('setCallName').$on('setCallName', (data) => {
			this.call_username = data.name
		})
		Bus.$off('setGroupChecked').$on('setGroupChecked', (groupId) => {
			this.selectGroup = this.groupList.filter((group) => group.id === groupId)[0]
		})
		Bus.$off('handleAddUserToGroup').$on('handleAddUserToGroup', () => {
			this.actionsUser = this.userList.filter((item) => this.selectGroup.children.findIndex((user) => user.id === item.code) < 0)
			this.showUser = true
		})
	},
	methods: {
		getUserList() {
			this.$axiosHttp.get('/api/user/query').then((res) => {
				const data = res.data.data
				if (data.status === 1) {
					this.userList = data.data.map((item) => {
						return {
							name: item.username,
							code: item.id,
						}
					})
				}
			})
		},
		getGroupList(id) {
			this.$axiosHttp({
				method: 'get',
				url: '/api/group/getGroupList',
				params: { userId: this.user.id },
			}).then((res) => {
				const users = this.$store.state.users
				const data = res.data.data
				if (data.status === 1) {
					this.groupList = data.data.map((item) => {
						return {
							id: item.id,
							name: item.name,
							children: item.userList.map((u) => {
								return {
									id: u.userId,
									name: u.userName,
									online: users.findIndex((uu) => uu.name === u.userName) >= 0,
									master: u.roleId === 1,
								}
							}),
						}
					})
					if (!!id) {
						this.selectGroup = this.groupList.filter((item) => item.id === id)[0]
					}
				}
			})
		},
		onGroupSelect(group) {
			this.showAction = true
			this.selectGroup = group
			this.actionsUser = this.userList.filter((item) => this.selectGroup.children.findIndex((user) => user.id === item.code) < 0)
		},
		onSelect(item) {
			this.showAction = false
			if (item.code === 'video') {
				// this.changeCheck(0, true);
				setTimeout(() => {
					Bus.$emit('multiVideoCall', this.selectGroup)
				}, 100)
			} else if (item.code === 'audio') {
				// this.changeCheck(0, true);
				setTimeout(() => {
					Bus.$emit('multiAudioCall', this.selectGroup)
				}, 100)
			} else if (item.code === 'join') {
				this.showUser = true
			}
		},
		onUserSelect(item) {
			let userIds = this.selectGroup.children.map((user) => user.id)
			userIds.push(item.code)
			const params = {
				id: this.selectGroup.id,
				userIds: userIds,
			}
			this.$axiosHttp({
				method: 'get',
				url: '/api/group/updateUser',
				params: params,
			}).then((res) => {
				const data = res.data.data
				if (data.status === 1) {
					this.getGroupList(this.selectGroup.id)
					this.showUser = false
					Bus.$emit('addUserToGroupSuccess', [{ label: item.name }])
				}
			})
		},
		onConfirm() {},
		changeCheck(index, open) {
			if (open) {
				this.checkedList[index] = true
				this.actions[2].name = '关闭集群'
				return
			}
			this.checkedList[index] = !this.checkedList[index]
			this.actions[2].name = (this.checkedList[index] ? '关闭' : '开启') + '集群'
		},
	},
}
</script>
<style lang="css">
.van-cell {
	text-align: left;
}
.user-online {
	color: #07c160;
}
.search-icon {
	font-size: 16px;
	line-height: inherit;
}
.group-box .van-cell__value {
	display: none;
}
</style>