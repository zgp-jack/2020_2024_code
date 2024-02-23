<template>
    <div class="ptz">
        <div class="tab-menu">
            <div :class="['tab-menu-item', {'active': activeName === '1'}]" @click="activeName = '1'">云台控制</div>
            <div :class="['tab-menu-item', {'active': activeName === '2'}]" @click="activeName = '2'">虚拟遥感</div>
        </div>
        <div class="outer-ring" v-if="activeName === '1'">
            <!-- 上 -->
            <i class="caret-up" @mousedown="ptzControlStart('up')" @mouseup="ptzControlStop()"/>
            <!-- 下 -->
            <i class="caret-down" @mousedown="ptzControlStart('down')" @mouseup="ptzControlStop()" />
            <!-- 左 -->
            <i class="caret-left" @mousedown="ptzControlStart('left')" @mouseup="ptzControlStop()" />
            <!-- 右 -->
            <i class="caret-right" @mousedown="ptzControlStart('right')" @mouseup="ptzControlStop()" />
            <!-- <div class="inner-ring">
                <i class="el-icon-plus plus" @mousedown="ptzControlStart('zoom_in')" @mouseup="ptzControlStop()" />
                <div class="line"></div>
                <i class="el-icon-minus minus" @mousedown="ptzControlStart('zoom_out')" @mouseup="ptzControlStop()" />
            </div> -->
            <!-- 左上 -->
            <i class="ob-caret-left" @mousedown="ptzControlStart('left_up')" @mouseup="ptzControlStop()"/>
            <!-- 右上 -->
            <i class="ob-caret-up" @mousedown="ptzControlStart('right_up')" @mouseup="ptzControlStop()"/>
            <!-- 右下 -->
            <i class="ob-caret-right" @mousedown="ptzControlStart('right_down')" @mouseup="ptzControlStop()"/>
            <!-- 左下 -->
            <i class="ob-caret-down" @mousedown="ptzControlStart('left_down')" @mouseup="ptzControlStop()"/>
        </div>
        <VirtualRocker
            v-if="activeName === '2'"
            @ptzControlStart="ptzControlStart"
            @ptzControlStop="ptzControlStop"
        ></VirtualRocker>
        
        <div class="flex-1">
            <!-- <el-input type="number" max="255" min="1" v-model="speed"/> -->
            <div class="btn-group">
                <el-button
                    type="default"
                    size="mini"
                    icon="el-icon-minus"
                    @mousedown.native="ptzControlStart('near')"
                    @mouseup.native="ptzControlStop()"
                ></el-button>
                <span class="btn-group-label">变焦</span>
                <el-button
                    type="default"
                    size="mini"
                    @mousedown.native="ptzControlStart('far')"
                    @mouseup.native="ptzControlStop()"
                ><i class="el-icon-plus"></i></el-button>
            </div>
            <div class="btn-group">
                <el-button
                    type="default"
                    size="mini"
                    icon="el-icon-minus"
                    @mousedown.native="ptzControlStart('zoom_out')"
                    @mouseup.native="ptzControlStop()"
                ></el-button>
                <span class="btn-group-label">变倍</span>
                <el-button
                    type="default"
                    size="mini"
                    @mousedown.native="ptzControlStart('zoom_in')"
                    @mouseup.native="ptzControlStop()"
                ><i class="el-icon-plus el-icon"></i></el-button>
            </div>
            <div class="btn-group">
                <el-button
                    type="default"
                    size="mini"
                    icon="el-icon-minus"
                    @mousedown.native="ptzControlStart('apertuer_small')"
                    @mouseup.native="ptzControlStop()"
                ></el-button>
                <span class="btn-group-label">光圈</span>
                <el-button
                    type="default"
                    size="mini"
                    @mousedown.native="ptzControlStart('apertuer_big')"
                    @mouseup.native="ptzControlStop()"
                ><i class="el-icon-plus el-icon"></i></el-button>
            </div>
            <!-- <el-button
                type="default"
                size="mini"
                icon="el-icon-full-screen"
                @mousedown.native="ptzControlStart('auto_focus')"
                @mouseup.native="ptzControlStop()"
            >自动聚焦</el-button> -->
        </div>
    </div>
</template>
   
<script>
export default {
    props: {
        channelId: String,
        deviceId: String,
        userName: String
    },
    components: {
		VirtualRocker: () => import('./VirtualRocker.vue'),
	},
    data() {
        return {
            speed: 50,
            activeName: '1'
        }
    },
    methods: {
        // 云台控制
        ptzControl(conno) {
            let data = {
                event: 'cameraControl',
                channelId: this.channelId,
                deviceId: this.deviceId,
                action: conno,
                speed: this.speed,
                caller: this.userName
            }
            console.log(data);
            this.$emit('send', data);
            setTimeout(() => {
                this.ptzControlStop();
            }, 500)
        },
        ptzControlStart(conno, speed) {
            speed = speed || this.speed;
            if(!!this.channelId && !!this.deviceId) {
                this.$emit('send', {
                    event: 'cameraControl',
                    channelId: this.channelId,
                    deviceId: this.deviceId,
                    action: conno,
                    speed: speed,
                    caller: this.userName
                });
            }
        },
        ptzControlStop() {
            if(!!this.channelId && !!this.deviceId) {
                this.$emit('send', {
                    event: 'cameraControl',
                    channelId: this.channelId,
                    deviceId: this.deviceId,
                    action: 'stop',
                    speed: this.speed,
                    caller: this.userName
                });
            }
        }
    },
}
</script>
   
<style lang="css" scoped>
.ptz {
    display: flex;
    height: 100%;
    flex-direction: column;
}
.tab-menu {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
}
.tab-menu .tab-menu-item{
    width: 50%;
    background-image: linear-gradient(180deg, #C5E0FF 0%, #72B0F9 100%);
    color: #0D407C;
    text-align: center;
    cursor: pointer;
}
.tab-menu .tab-menu-item.active{
    background-image: linear-gradient(180deg, #2675D0 0%, #285DAF 100%);
    color: #C4DCFF;
}
.flex-1{
    flex: 1;
    min-width: 0;
    text-align: center;
    padding: 0 8px;
}
.flex-1 .btn-group{
    margin-bottom: 16px;
}
.flex-1 .btn-group .btn-group-label{
    border: none;
    color: #C4DCFF;
    font-size: 14px;
    padding: 0 20px;
    height: 24px;
    line-height: 24px;
}
.flex-1 .btn-group .el-button{
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    padding: 0;
    border: none;
    border-radius: 50%;
    background-image: linear-gradient(180deg, #6B9FDD 0%, #BAD8FC 100%);
    box-shadow: 0px 2px 4px 0px;
    color: #084588;
    font-size: 14px;
    font-weight: bold;
}
.ptz .outer-ring {
    position: relative;
    width: 158px;
    height: 158px;
    background: url(../../assets/云台控制背景.svg) no-repeat;
    background-size: cover;
    border-radius: 50%;
    margin: 21px auto 45px auto;
}

.ptz .outer-ring i {
    display: inline-block;
    width: 22px;
    height: 22px;
    background: url(../../assets/云台控制_箭头线性.svg) no-repeat;
    cursor: pointer;
}

.ptz .outer-ring i:hover {
    background: url(../../assets/云台控制_箭头面性_选中.svg) no-repeat;
}

.ptz .outer-ring .caret-up {
    position: absolute;
    top: 20px;
    left: 75px;
    margin-left: -7px;
}

.ptz .outer-ring .caret-down {
    transform: rotate(180deg);
    position: absolute;
    bottom: 20px;
    left: 75px;
    margin-left: -7px;
}

.ptz .outer-ring .caret-left {
    transform: rotate(270deg);
    position: absolute;
    left: 20px;
    top: 75px;
    margin-top: -7px;
}

.ptz .outer-ring .caret-right {
    transform: rotate(90deg);
    position: absolute;
    right: 20px;
    top: 75px;
    margin-top: -7px;
}

.ptz .outer-ring .ob-caret-left {
    transform: rotate(315deg);
    position: absolute;
    top: 32px;
    left: 36px;
}

.ptz .outer-ring .ob-caret-up {
    transform: rotate(45deg);
    position: absolute;
    top: 32px;
    right: 36px;
}

.ptz .outer-ring .ob-caret-right {
    transform: rotate(135deg);
    position: absolute;
    bottom: 32px;
    right: 36px;
}

.ptz .outer-ring .ob-caret-down {
    transform: rotate(225deg);
    position: absolute;
    bottom: 32px;
    left: 36px;
}

.ptz .outer-ring .inner-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid #ddd;
}

.ptz .outer-ring .inner-ring .plus {
    position: absolute;
    top: 10px;
    left: 40px;
    margin-left: -10px;
}

.ptz .outer-ring .inner-ring .line {
    height: 1px;
    width: 100%;
    background-color: #ddd;
    position: absolute;
    top: 39px;
    left: 0;
}

.ptz .outer-ring .inner-ring .minus {
    position: absolute;
    bottom: 10px;
    left: 40px;
    margin-left: -10px;
}</style>