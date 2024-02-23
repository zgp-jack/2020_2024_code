<template>
	<el-container>
		<!-- <el-header>Header</el-header> -->
		<el-container>
			<el-aside width="192px">
				<Navi></Navi>
			</el-aside>
			<el-container class="container">
				<el-header height="64px">
					<Header></Header>
				</el-header>
				<el-main>
					<router-view />
				</el-main>
			</el-container>
		</el-container>
	</el-container>
</template>
<script>
import ApiCompany from '@/api/company';
import ApiRole from '@/api/role';
import ApiPermissions from '@/api/permissions';
import { ApiOrderUser, ApiWXUser } from '@/api';

const user = JSON.parse(sessionStorage.getItem('user') || '{}');
export default {
	name: 'home',
	components: {
		Navi: () => import('../components/navi.vue'),
		Header: () => import('../components/headerTop.vue'),
	},
	data() {
		return {
			isRouterAlive: true,
			username: user.name,
			ws: '',//建立的连接
			timeout: 3*60*1000000,//3分钟一次心跳
			timeoutObj: null,//心跳心跳倒计时
			serverTimeoutObj: null,//心跳倒计时
			timeoutnum: null,//断开 重连倒计时,
			num: 0,
		}
	},
	mounted() {
		this.getCompanyTree();
		this.getRoleList();
		this.getOrderUser();
		this.getWXUser();
		this.getPermissionsList();
		this.initWebpack();
	},
	methods: {
		getCompanyTree() {
            ApiCompany.companyTree({}).then(res => {
                if(res.status === 1) {
                    const data = res.data;
                    this.$store.commit('SETCOMPANYTREE', data);
                }
            })
        },
		getRoleList() {
            ApiRole.list({}).then(res => {
                if(res.status === 1) {
					const data = res.data;
                    this.$store.commit('SETROLELIST', data);
                }
            })
        },
		listToTree(data) {
			let list = [];
			data.forEach(item => {
				if(item.teamId == null) {
					list.push({label: item.userName, value: item.userId});
					return;
				}
				const treeIndex = list.findIndex(i => i.value === item.teamId + 100000);
				if(treeIndex < 0) {
					list.push({label: item.teamName, value: item.teamId + 100000, children: [{label: item.userName, value: item.userId}]})
				} else {
					list[treeIndex].children.push({label: item.userName, value: item.userId})
				}
			});
			return list;
		},
		deepListToTree(data) {
			let list = [];
			data.map(d => {
				let obj = {label: '', value: null, children: []};
				obj.label = d.name;
				obj.value = d.type === 1 ? d.id : d.userId;
				obj.children = d.type === 1 ? this.deepListToTree(d.users) : undefined;
				list.push(obj);
			})
			return list;
		},
		getPermissionsList() {
			ApiPermissions.list({}).then(res => {
                if(res.status === 1) {
                    const data = res.data;
                    this.$store.commit('SETPERMISSIONS', data);
                }
            })
		},
		getOrderUser() {
			ApiOrderUser({}).then(res => {
				if(res.status === 1) {
                    const data = this.listToTree(res.data);
                    this.$store.commit('SETORDERUSER', data);
					this.$store.commit('SETORDERUSERNORMAL', res.data);
				}
			})
		},
		getWXUser() {
			ApiWXUser({}).then(res => {
				if(res.status === 1) {
					let data = res.data;
					data.forEach(d1 => {
						data.forEach((d2, i2) => {
							if(d1.id === d2.parentId) {
								d1.users.push(d2);
								delete data[i2];
							}
						})
					})
					console.log('deepListToTree', data);
					const wxUser = this.deepListToTree(data);
                    
					console.log(wxUser);
					this.$store.commit('SETWXUSER', wxUser);
				}
			})
		},
		initWebpack() {
			const wsurl = 'ws:' + location.host + '/socket/websocket/user_' + this.username;//ws地址,这里加入自己的地址即可'ws://192.168.2.42:9040/api/websocket/user_'
			this.ws = new WebSocket(wsurl, [sessionStorage.getItem('token')]);
			this.ws.onopen = this.onopen;
			this.ws.onmessage = this.onmessage;
			this.ws.onclose = this.onclose;
			this.ws.onerror = this.onerror;
		},
		reconnect() {//重新连接
			var that = this;
			if(that.lockReconnect) {
				return;
			};
			that.lockReconnect = true;
			//没连接上会一直重连，设置延迟避免请求过多
			that.timeoutnum && clearTimeout(that.timeoutnum);
			that.timeoutnum = setTimeout(function () {
				//新连接
				that.initWebpack();
				that.lockReconnect = false;
			},that.timeout);
		},
		reset(){//重置心跳
			var that = this;
			//清除时间
			clearTimeout(that.timeoutObj);
			clearTimeout(that.serverTimeoutObj);
			//重启心跳
			that.start();
		},
		start(){ //开启心跳
			var self = this;
			self.timeoutObj && clearTimeout(self.timeoutObj);
			self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
			self.timeoutObj = setTimeout(function(){
				//这里发送一个心跳，后端收到后，返回一个心跳消息，
				if (self.ws.readyState == 1) {//如果连接正常
					self.ws.send("heartCheck"); //这里可以自己跟后端约定
				}else{//否则重连
					self.reconnect();
				}
				self.serverTimeoutObj = setTimeout(function() {
					//超时关闭
					self.ws.close();
				}, self.timeout);
			}, self.timeout)
		},
		onopen() {
			//开启心跳
			this.start();
		},
		onmessage(e) {
			//下面这块代码，接收到后端返回的消息后，根据自己的需求去判断
			if(e.data == 'heartCheck' || e.data == '连接成功') {
			}else {
				let res = JSON.parse(e.data);
				if(res.type == 'no:process:status') {
					this.$store.commit('updateOldList', true);
				}
			}
			//收到服务器信息，心跳重置
			this.reset();
		},
		onclose(e) {
			//重连
			this.reconnect();
		},
		onerror(e) {
			//重连
			this.reconnect();
		},
		onsend(msg) {//向服务器发送信息
			//数据发送
			this.websock.send(msg);
		},
		reload () {
			this.isRouterAlive = false;            //先关闭，
			this.$nextTick(function () {
				this.isRouterAlive = true;         //再打开
			}) 
		}
	}
}
</script>
<style lang="scss">
.el-container {
	height: 100%;
}
.container {
	background-color: #f0f7f7;
}
.el-aside {
	background-color: #066666;
}
.el-main {
	padding: 0;
}
.el-header {
	background-color: #fff;
	margin-bottom: 1px;
}
</style>