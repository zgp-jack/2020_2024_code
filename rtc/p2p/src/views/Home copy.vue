<template>
	<div class="boxouter-home page-content">
		<h1 class="sys-name">应急通信指挥系统</h1>
		<div class="top-right">
			<span>当前用户：{{ user_name }}</span>
			<el-button type="text" icon="el-icon-switch-button" @click="loginOut()">退出</el-button>
		</div>
		<div class="cd-timeline-top">
			<i class="el-icon-guide"></i>
			<h2>导航</h2>
		</div>
		<section id="cd-timeline" class="cd-container">
			<div class="cd-timeline-block" v-for="item in menu">
				<div class="cd-timeline-content">
					<h4 @click="toPage(item)">{{ item.label }}</h4>
				</div>
			</div>
		</section>
	</div>
</template>
<script>
import Bus from './Bus';

export default {
	name: 'home',
	data() {
		return {
			user_name: sessionStorage.getItem('user_name'),
			menu: [
				{ label: '实时指挥', value: 1, icon: 'el-icon-s-platform', path: 'room' },
				{ label: '群指管理', value: 2, icon: 'el-icon-menu', path: 'group' },
				{ label: '终端管理', value: 3, icon: 'el-icon-s-custom', path: 'user' },
				{ label: '录屏管理', value: 4, icon: 'el-icon-video-camera-solid', path: 'videoManager' },
				{ label: '站场管理', value: 5, icon: 'el-icon-location', path: 'venue' },
			],
			active: 1,
		};
	},
	methods: {
		toPage(item) {
			this.active = item.value;
			this.$router.push({ path: item.path });
		},
		handleCommand(command) {
			switch (command) {
				case 'grid2':
					Bus.$emit('changeVideoGrid', 2);
					break;
				case 'grid3':
					Bus.$emit('changeVideoGrid', 3);
					break;
				case 'grid4':
					Bus.$emit('changeVideoGrid', 4);
					break;
			}
		},
		loginOut() {
			this.$axios({
				method: 'get',
				url: '/api/user/logout',
				params: { username: this.user_name },
			}).then((res) => {
				sessionStorage.removeItem('user_name');
				sessionStorage.removeItem('user');
				sessionStorage.removeItem('token');
				this.$router.push({ path: '/login' });
				if (res.status === 200) {
					
				}
			}).catch(res => {
				sessionStorage.removeItem('user_name');
				sessionStorage.removeItem('user');
				sessionStorage.removeItem('token');
				this.$router.push({ path: '/login' });
			})
		},
	},
};
</script>
<style scoped>
.page-content {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
}
.top-right{
	position: absolute;
	right: 32px;
}
.cd-timeline-top i{
	font-size: 68px;
	color: #2c3e50;
}
.cd-timeline-top h2 {
	border-style: double;
	border-color: #2c3e50;
	border-width: 0 0 10px 0;
	width: 80px;
	height: 48px;
	line-height: 48px;
	margin: auto;
}
.cd-container {
  width: 1000px;
  margin: 0 auto;
  background: #fff;
  padding: 0 10%;
  border-radius: 2px;
}
.cd-container::after {
  content: '';
  display: table;
  clear: both;
}
#cd-timeline {
  position: relative;
  padding: 2em 0;
  margin-bottom: 2em;
  padding-bottom: 0;
}
#cd-timeline::before {
  content: '';
  position: absolute;
  top: 0;
  left: 25px;
  height: 100%;
  width: 4px;
  background: #2c3e50;
}
#cd-timeline::before {
    left: 50%;
    margin-left: -2px;
}
.cd-timeline-block {
  position: relative;
  margin: 2em 0;
}
.cd-timeline-block:after {
  content: "";
  display: table;
  clear: both;
}
.cd-timeline-block:first-child {
  margin-top: 0;
}
.cd-timeline-block:last-child {
  margin-bottom: 0;
}
@media only screen and (min-width: 1170px) {
  .cd-timeline-block {
    margin: 4em 0;
  }
  .cd-timeline-block:first-child {
    margin-top: 0;
  }
  .cd-timeline-block:last-child {
    margin-bottom: 0;
  }
}

.cd-timeline-content {
  position: relative;
  border-radius: 0px;
	text-align: right;
	height: 80px;
	width: 446px;
	margin-right: 54px;
}
.cd-timeline-content:after {
  content: "";
  display: table;
  clear: both;
}
.cd-timeline-content h4 {
  color: #fff;
  margin-top: 28px;
  height: 52px;
  line-height: 52px;
  background-color: #2c3e50;
  width: 180px;
  display: inline-block;
  text-align: center;
  font-size: 18px;
  cursor: pointer;
  letter-spacing: 1px;
}

.cd-timeline-content::before {
  content: '';
  position: absolute;
  top: 24px;
  right: 100%;
  height: 4px;
  width: 54px;
  background-color: #2c3e50;
}

.cd-timeline-content::before {
	top: 100%;
	left: 100%;
	margin-top: -4px;
}
.cd-timeline-block:nth-child(even) .cd-timeline-content {
	float: right;
	text-align: left;
	margin-right: 0;
	margin-left: 54px;
}
.cd-timeline-block:nth-child(even) .cd-timeline-content::before {
	top: 100%;
	left: auto;
	right: 100%;
	margin-top: -4px;
}
</style>