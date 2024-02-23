<template>
    <div class="el-tab-panel">
        <el-scrollbar ref="scrollbar" class="tree-view">
            <el-tree
                :data="deviceTree"
                node-key="id"
                ref="deviceTree"
                default-expand-all
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
                highlight-current
                >
                <div class="custom-tree-node" slot-scope="{ node, data }" @mouseover="handleMouseOver(data)" @mouseout="handleMouseOver()">
                    <p
                        style="cursor: pointer; margin: 8px 0"
                    >
                        <template v-if="data.main">
                            <i class="el-icon-s-home" :size="20"></i>
                            <span>{{ data.name }}</span>
                        </template>
                        <template v-else>
                            <template v-if="data.type !== 'channel'">
                                <span v-show="data.status" class="online-status"></span>
                                <span v-show="!data.status" class="offline-status"></span>
                                <i
                                    :class="[
                                        { 'icon-scj': data.type === 'user' },
                                        { 'icon-bkq': data.type === 'wfs' },
                                        { 'icon-wrj': data.type === 'drone' },
                                        { 'icon-gismap': data.type === 'map' }
                                    ]"
                                    :size="20"
                                ></i>
                                <span>{{ data.name }}</span>
                            </template>
                            <span v-else style="margin-left: 16px;">{{ data.name }}</span>
                            <i class="el-icon-microphone" v-show="!!data.audioStauts"></i>
                        </template>
                    </p>
                    <div v-show="data.check" class="check-ctl">
                        <el-button type="text" class="tree-btn" v-show="data.type == 'channel'" @click="vidioCallWfs(data)">
                            <i class="icon-play"></i>
                        </el-button>
                        <el-button type="text" class="tree-btn" v-show="data.type == 'sdk'" @click="vidioCallSdk(data)">
                            <i class="icon-play"></i>
                        </el-button>
                        <el-button type="text" class="tree-btn" v-show="data.type == 'map'" @click="connectUser('map')">
                            <i class="icon-play"></i>
                        </el-button>
                        <el-button type="text" class="tree-btn" v-show="data.type == 'user'" @click="audioCall()">
                            <i class="icon-audio"></i>
                        </el-button>
                        <el-button type="text" class="tree-btn" v-show="data.type == 'user'" @click="videoCall()">
                            <i class="icon-video"></i>
                        </el-button>
                    </div>
                </div>
            </el-tree>
        </el-scrollbar>
        <el-row class="tab-tool-panel" v-show="toolCtlVisible">
            <span>
                <CameraControl
                    v-if="wfsCheck"
                    :userName="user_name"
                    :channelId="wfsCheck.id"
                    :deviceId="wfsCheck.deviceId"
                    @send="send"
                ></CameraControl>
            </span>
        </el-row>
        <!-- 设备人员右键 -->
        <div v-show="visible" class="context-menu" :style="contextmenuStyle">
            <ul>
                <li @click="audioCall()"><i class="el-icon-microphone"></i> 语音通话</li>
                <li @click="videoCall()"><i class="el-icon-video-camera"></i> 视频通话</li>
            </ul>
        </div>
        <!-- 布控球 -->
        <div v-show="visibleWfs" class="context-menu" :style="contextmenuStyle">
            <ul>
                <li @click="vidioCallWfs()"><i class="el-icon-video-camera"></i> 查看视频</li>
                <li @click="realNameWfs()"><i class="el-icon-edit"></i> 重命名</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    components: {
        CameraControl: () => import('./CameraControl.vue'),
    },
    props: {
        list: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    computed: {
        deviceTree() {
            return [
                // ...this.list
                {
					id: 99999,
					main: true,
					name: '应急指挥中心',
					children: this.list,
				},
            ]
        }
    },
    data() {
        return {
            user_name: sessionStorage.getItem('user_name'),
            callingUsername: [], //被叫名称
            //左键菜单
            toolVisible: false,
            toolCtlVisible: false,
            wfsCheck: null,
            //右键菜单
            contextmenuStyle: {
                top: '0px',
				left: '0px',
            },
            visible: false,
            visibleWfs: false,

            playDeviceList: [], //正在播放的设备
        }
    },
    mounted() {
        //初始化
        this.$emit('roomEvent', {event: 'setUserListCheck', args: [{}]})
    },
    methods: {
        handleMouseOver(data) {
            if(!!data) {
                this.$emit('roomEvent', {event: 'setUserListCheck', args: [data]});
            } else {
                this.$emit('roomEvent', {event: 'setUserListCheck', args: [{}]})
            }
        },
        handleNodeClick(data) {
            this.setCurrentNode(data);
        },
        leftClick(type, name, data) {
			switch (type) {
				case 'user':
					// this.setUserCheck(name);
					this.callingUsername = name;
                    this.$emit('roomEvent', {event: 'setCallingUsername', args: [name]});
					break;
				case 'wfs': break;
				case 'channel':
					this.wfsCheck = data;
                case 'sdk':
                    
                    break;
				default:
					break;
			}
        },
        setCurrentNode(data) {
            if(!!data) {
                this.leftClick(data.type, data.name, data);
                this.$refs['deviceTree'].setCurrentKey(data.id);
            }
        },
        connectUser(type, name, data) {
            if (name === this.user_name) {
				return false;
			}
			switch (type) {
				case 'user':
					// this.setUserCheck(name);
					this.callingUsername = name;
                    this.$emit('roomEvent', {event: 'setCallingUsername', args: [name]});
                    this.$emit('roomEvent', {event: 'setConnectUserName', args: [name]});
                    this.$emit('playerEvent', {event: 'createConnection', args: [this.callingUsername, false, false, true]});
					this.send({
						event: 'connectUser',
						caller: this.user_name,
						partner: this.callingUsername,
						streamType: 'video',
					});
					break;
				case 'wfs':
					break;
				case 'channel':
					//未在播放的设备
					name = `${data.deviceId}-${data.id}`;
					if(this.playDeviceList.indexOf(name) < 0) {
						this.playDeviceList.push(name);
						this.send({
							event: 'wfsCall',
							caller: this.user_name,
							deviceId: data.deviceId,
							channelId: data.id,
						});
                        
			            this.toolCtlVisible = true;
						//创建wfs连接
                        this.$emit('playerEvent', {event: 'initWfs', args: [this.user_name, data]})
						// this.initWfs(this.user_name, deviceId, channelId);
					}
					break;
				case 'map':
                this.$emit('playerEvent', {event: 'initMap', args: [this.user_name]})
					break;
				default:
					break;
			}
        },
        audioCall() {
            this.$emit('roomEvent', {event: 'audioCall', args: []})
        },
        videoCall(name) {
            this.$emit('roomEvent', {event: 'videoCall', args: []})
        },
        vidioCallWfs(data) {
            data = data || this.wfsCheck;
            this.toolCtlVisible = true;
            this.send({
                event: 'wfsCall',
                caller: this.user_name,
                deviceId: data.deviceId,
                channelId: data.id,
            });
            this.$emit('playerEvent', {event: 'initWfs', args: [this.user_name, data]})
            //更新滚动条
            this.$nextTick(() => {
                this.$refs.scrollbar.update()
            });
        },
        vidioCallSdk(data) {
            data = data || this.wfsCheck;
            this.send({
                event: 'sdkCall',
                caller: this.user_name,
                deviceIp: data.deviceIp,
                devicePort: data.devicePort,
                deviceUser: data.deviceUser,
                devicePassword: data.devicePassword
            });
            this.$emit('playerEvent', {event: 'initSdk', args: [this.user_name, data]})
        },
        send(message) {
            this.$emit('roomEvent', {event: 'send', args: [message]})
        }
    },
}
</script>