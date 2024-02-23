<template>
    <div class="el-tab-panel">
        <el-scrollbar class="tree-view">
            <el-tree
            :data="screenTree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick">
                <span class="custom-tree-node" slot-scope="{ node, data }" @mouseover="handleNodeClick(data)" @mouseout="handleNodeClick()">
                    <!-- @contextmenu.prevent.stop="rightClick($event, data.name)" @click="leftClick(data.name, data)" -->
                    <p
                        style="cursor: pointer; margin: 0"
                    >
                        <template v-if="data.main">
                            <i class="el-icon-s-home" :size="20"></i>
                            <span>{{ data.name }}</span>
                        </template>
                        <template v-else>
                            <i class="icon-zju"></i>
                            <span>{{ data.name }}</span>
                        </template>
                    </p>
                    <div v-show="data.check" class="check-ctl">
                        <el-button type="text" class="tree-btn" v-show="data.name !== user_name" @click="videoRecord('share')">
                            <i class="el-icon-s-platform" style="font-size: 18px;"></i>
                        </el-button>
                    </div>
                </span>
            </el-tree>
        </el-scrollbar>
        <el-row class="tab-tool-panel" v-show="false">
            <span v-show="toolVisible" class="tool-panel">
                <!-- <el-button
                    type="danger"
                    :icon="isVideoRecord ? 'el-icon-video-play' : 'el-icon-video-pause'"
                    @click="videoRecord('record')"
                    :title="isVideoRecord ? '开始录像' : '结束录像'"
                    circle
                ></el-button> -->
                <el-button
                    v-if="callingUsername && callingUsername != user_name"
                    :icon="shareList[callingUsername] ? 'el-icon-plus' : 'el-icon-minus'"
                    @click="videoRecord('share')"
                    :title="shareList[callingUsername] ? '开始共享' : '结束共享'"
                    circle
                ></el-button>
            </span>
        </el-row>
        <!-- 投屏 -->
        <div v-show="visible" class="context-menu" :style="contextmenuStyle">
            <ul>
                <!-- <li @click="videoRecord('record')"><i :class="isVideoRecord ? 'el-icon-video-play' : 'el-icon-video-pause'"></i> {{ isVideoRecord ? '开始录像' : '结束录像' }}</li> -->
                <li @click="videoRecord('share')"><i :class="shareList[callingUsername] ? 'el-icon-plus' : 'el-icon-minus'"></i> {{ shareList[callingUsername] ? '开始共享' : '结束共享' }}</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        list: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    computed: {
        screenTree() {
            return [
                {
                    id: 99999,
                    main: true,
                    name: '应急指挥中心',
                    children: this.list.filter(item => item.type === 'user'),
                }
            ];
        }
    },
    data() {
        return {
            user_name: sessionStorage.getItem('user_name'),
            visible: false,
            toolVisible: false,
            shareList: {},
            isVideoRecord: true,
            callingUsername: '',
            contextmenuStyle: {
                top: '0px',
				left: '0px',
            }
        }
    },
    mounted() {
        //初始化
        this.$emit('roomEvent', {event: 'setUserListCheck', args: [{}]})
    },
    methods: {
        handleNodeClick(data, node, vm) {
            if(!!data) {
                this.leftClick(data.name, data);
                this.$emit('roomEvent', {event: 'setUserListCheck', args: [data]})
            } else {
                this.$emit('roomEvent', {event: 'setUserListCheck', args: [{}]})
            }
        },
        rightClick(evt, name) {
            this.contextmenuStyle = {
				top: evt.clientY + 'px',
				left: evt.clientX + 'px',
			};
            this.callingUsername = name;
            this.$emit('roomEvent', {event: 'setCallingUsername', args: [name]});
            
            this.visible = !this.visible;
        },
        leftClick(name, data) {
            this.toolVisible = false;
            if(!data.main) {
                this.callingUsername = name;
                this.$emit('roomEvent', {event: 'setCallingUsername', args: [name]});
                if (this.shareList[name] == undefined) {
                    this.shareList[name] = true;
                }
                this.toolVisible = true;
            }
            
        },
        videoRecord(type) {
            if (type == 'share') {
				if (this.shareList[this.callingUsername]) {
                    this.$emit('playerEvent', {event: 'startRecordScreen', args: [type]})
                    this.shareList[this.callingUsername] = undefined;
				} else {
                    this.$emit('playerEvent', {event: 'stopRecordScreen', args: [type]})
				}
			} else {
				if (this.isVideoRecord) {
                    this.$emit('playerEvent', {event: 'startRecordScreen', args: [type]})
				} else {
                    this.$emit('playerEvent', {event: 'stopRecordScreen', args: [type]})
				}
				this.isVideoRecord = !this.isVideoRecord;
			}
        }
    }
}
</script>