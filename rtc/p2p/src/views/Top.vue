<template>
    <div class="top-content">
        <div class="top-opa">
            <div class="top-left">
                <div class="now-date">
                    <p class="now-data-time">{{ dateTime }}</p>
                    <p class="now-data-day">{{ dateDay }} {{ dateWeek }}</p>
                </div>
                <div class="menu-box">
                    <div
                        v-for="item,index in menu"
                        v-if="index < 3"
                        :class="['menu-item', {'active': item.active}]"
                        @click="toPage(item)">
                        <span>{{ item.label }}</span>
                    </div>
                </div>
                <!-- <slot name="left"></slot> -->
            </div>
            <div class="top-center">
                <img src="../assets/sys-name.svg" class="sys-name"/>
            </div>
            <div class="top-right">
                <div class="menu-box">
                    <div
                        v-for="item,index in menu"
                        v-if="index > 2"
                        :class="['menu-item', {'active': item.active}]"
                        @click="toPage(item)">
                        <span>{{ item.label }}</span>
                    </div>
                </div>
                <div class="weather-box">
                    <el-switch
                        v-model="openRecord"
                        active-color="#2D6DFF"
                        active-text="作业记录"
                        inactive-color="#ccc"
                        @change="setOpenRecord()"
                    >
                    </el-switch>
                </div>
                <div class="user-box">
                    <span style="padding-right: 2px;">{{ user_name }}</span>
                    <el-button type="text" @click="loginOut()">
                        <i class="icon-back"></i>
                    </el-button>
                </div>
                <!-- <el-button v-if="showRecordControl" type="text" @click="setOpenRecord()">{{openRecord ? '关闭' : '开启'}}作业记录</el-button>
                <span>当前用户：{{ user_name }}</span>
                <el-button type="text" icon="el-icon-back" @click="backTo()">返回</el-button> -->
            </div>
        </div>
    </div>
</template>
<script>
import Bus from './Bus'
export default {
    data() {
        return {
            user_name: sessionStorage.getItem('user_name'),
            openRecord: sessionStorage.getItem('open_record') === 'true',
            showRecordControl: false,
            dateTime: '',
            dateDay: '',
            dateWeek: '',
            menu: [
				{ label: '实时指挥', value: 1, path: 'room', active: true },
				{ label: '群指管理', value: 2, path: 'group', active: false },
				{ label: '终端管理', value: 3, path: 'user', active: false },
				{ label: '录屏管理', value: 4, path: 'videoManager', active: false },
				{ label: '站场管理', value: 5, path: 'venue', active: false },
            ],
        }
    },
    mounted() {
        this.showRecordControl = this.$route.name === 'room';
        if(this.openRecord) {
            setTimeout(() => {
                if(this.showRecordControl) {
                    this.startRecordStatus();
                }
            }, 500);
        }
        setInterval(this.getDate(), 1000);
    },
    methods: {
        toPage(item) {
            this.menu.forEach(m => {
                m.active = m.value === item.value;
            })
			this.$router.push({ path: item.path });
		},
        getDate() {
            const weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
            const now = new Date();

            const year = now.getFullYear();
            const month = ('0' + (now.getMonth() + 1)).slice(-2);
            const day = ('0' + now.getDate()).slice(-2);
            const hours = ('0' + now.getHours()).slice(-2);
            const minutes = ('0' + now.getMinutes()).slice(-2);
            const seconds = ('0' + now.getSeconds()).slice(-2);
            const week = weeks[now.getDay()];

            this.dateTime = `${hours}:${minutes}:${seconds}`;
            this.dateDay = `${year}-${month}-${day}`;
            this.dateWeek = `${week}`;
            return this.getDate;
        },
        setOpenRecord() {
            sessionStorage.setItem('open_record', this.openRecord);
            if(this.openRecord) {
                this.startRecordStatus();
            } else {
                this.stopRecordStatus();
            }
        },
        startRecordStatus() {
            Bus.$emit('startJobRecord')
        },
        stopRecordStatus() {
            Bus.$emit('stopJobRecord')
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
    }
}
</script>
<style>
.top-content{
    background-color: transparent;
    color: #fff;
    background-image: url(../assets/top.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
.top-content .sys-name {
    display: inline;
}
.top-opa{
    display: flex;
    width: 100%;
    height: 74px;
}
.top-opa .top-left{
    flex: 1;
    min-width: 0;
    display: flex;
    padding-top: 40px;
}
.now-date{
    padding-left: 20px;
    width: 124px;
    color: #C4DCFF;
    text-align: left;
}
.now-date .now-data-time {
    font-size: 18px;
}
.now-date .now-data-day {
    font-size: 12px;
}
.menu-box{
    flex: 1;
    display: flex;
    justify-content: space-around;
}
.menu-box .menu-item {
    font-size: 16px;
    color: #F3F9FF;
    width: 128px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    position: relative;
}
.menu-box .menu-item span{
    position: relative;
    z-index: 1;
}
.menu-box .menu-item::after {
    content: '';
    position: absolute;
    background-image: url(../assets/导航未选中.svg);
    width: 128px;
    height: 32px;
    top: 0;
    left: 0;
    transform: rotateY(180deg);
    z-index: 0;
}
.menu-box .menu-item.active::after {
    background-image: url(../assets/导航选中.svg);
    transform: rotateY(0deg);
}
.top-opa .top-center {
    width: 36%;
    padding-top: 16px;
}
.top-opa .top-right{
    width: 32%;
    text-align: center;
    display: flex;
    padding-top: 40px;
}
.top-opa .top-right .weather-box {
    width: 120px;
    line-height: 40px;
    text-align: right;
}
.top-opa .top-right .user-box {
    width: 160px;
    color: #9EBCFF;
    text-align: right;
    padding-right: 20px;
}
</style>