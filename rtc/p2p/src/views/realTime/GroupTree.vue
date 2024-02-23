<template>
    <div class="el-tab-panel">
        <el-scrollbar class="tree-view">
            <el-tree
            :data="groupTree"
            node-key="id"
            :expand-on-click-node="false"
            highlight-current
            @node-click="handleNodeClick"
            >
                <span class="custom-tree-node" slot-scope="{ node, data }" @mouseover="handleNodeClick(data)" @mouseout="handleNodeClick()">
                    <!-- @contextmenu.prevent.stop="rightClick($event, data)" @click="leftClick(data)" -->
                    <span>
                        <template v-if="data.main">
                            <i class="icon-group"></i>
                            <span>{{ data.name }}</span>
                        </template>
                        <template v-else>
                            <span v-show="data.online" class="online-status"></span>
                            <span v-show="!data.online" class="offline-status"></span>
                            <!-- <i
                                :class="[
                                    data.type == 1 ? 'el-icon-user-solid' : 'el-icon-video-camera-solid',
                                ]"
                                :size="20"
                            ></i> -->
                            <span>{{ data.name }}</span>
                        </template>
                    </span>
                    <div v-show="data.check" class="check-ctl">
                        <el-button type="text" class="tree-btn" v-show="data.main" @click="multiVideoCall('audio')">
                            <i class="icon-audio"></i>
                        </el-button>
                        <el-button type="text" class="tree-btn" v-show="data.main" @click="multiVideoCall()">
                            <i class="icon-video"></i>
                        </el-button>
                    </div>
                </span>
            </el-tree>
        </el-scrollbar>
        <el-row class="tab-tool-panel" v-show="false">
            <span v-show="toolVisible" class="tool-panel">
                <el-tooltip class="item" effect="dark" content="语音通话" placement="top-start">
                    <el-button type="primary" icon="el-icon-mic" circle @click="multiVideoCall('audio')"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="视频通话" placement="top-start">
                    <el-button type="success" icon="el-icon-video-camera" circle @click="multiVideoCall()"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="添加成员" placement="top-start">
                    <el-button type="info" icon="el-icon-circle-plus" circle @click="addUserToGroup()"></el-button>
                </el-tooltip>
            </span>
            <!-- 集群右键 -->
			<div v-show="visible" class="context-menu" :style="contextmenuStyle">
				<ul>
					<li @click="addUserToGroup()"><i class="el-icon-circle-plus"></i> 添加成员</li>
					<li @click="multiVideoCall('audio')"><i class="el-icon-mic"></i> 语音通话</li>
					<li @click="multiVideoCall()"><i class="el-icon-video-camera"></i> 视频通话</li>
				</ul>
			</div>
        </el-row>
        <el-dialog title="添加用户" v-if="visibleAdd" :visible.sync="visibleAdd">
            <GroupAdd
                :group="selectGroup"
                @cancleVisible="visibleAdd = !visibleAdd"
                @handleSuccess="addUserToGroupSuccess"
            ></GroupAdd>
        </el-dialog>
    </div>
</template>
<script>
export default {
    components: {
		GroupAdd: () => import('./GroupAdd.vue'),
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
        groupTree() {
            return [...this.list];
        }
    },
    data() {
        return {
            visible: false,
            toolVisible: false,
            selectGroup: null,
            visibleAdd: false,
            //右键菜单
            contextmenuStyle: {
                top: '0px',
				left: '0px',
            },
        }
    },
    mounted() {
        //初始化
        this.$emit('roomEvent', {event: 'setGroupListCheck', args: [{}]})
    },
    methods: {
        handleNodeClick(data, node, vm) {
            if(!!data) {
                if(data.main) {
                    this.leftClick(data);
                    this.$emit('roomEvent', {event: 'setGroupListCheck', args: [data]})
                }
            } else {
                this.$emit('roomEvent', {event: 'setGroupListCheck', args: [{}]})
            }
        },
        rightClick(evt, data) {
            this.contextmenuStyle = {
				top: evt.clientY + 'px',
				left: evt.clientX + 'px',
			};
            if (data.main) {
                this.visible = !this.visible;
                this.selectGroup = data;
            }
        },
        // 左键点击事件
		leftClick(data) {
            if (data.main) {
                this.toolVisible = true;
                this.selectGroup = data;
            }
		},
        addUserToGroup() {
            if (!!this.selectGroup) {
				this.visibleAdd = true;
			}
        },
        multiVideoCall(audio) {
            this.$emit('roomEvent', {event: 'multiVideoCall', args: [audio, this.selectGroup]})
        },
        addUserToGroupSuccess(insertList) {
			this.visibleAdd = false;
			// this.getGroupList();
			this.selectGroup = null;
			//如果存在房间
			console.log(insertList);
			// const users = this.users;
			let offline = [];
			insertList.forEach((u) => {
				offline.push(u.label);
			});
			if (!!this.callingRoomId) {
				this.send({
					event: 'updateRoom',
					roomId: this.callingRoomId,
					jion: offline,
					offline: offline,
				});
			}
		},
        send(message) {
            this.$emit('roomEvent', {event: 'send', args: [message]})
        }
    }
}
</script>