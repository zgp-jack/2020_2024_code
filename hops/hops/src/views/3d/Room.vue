<template>
    <div class="room-panel" v-cloak>
        <Scene v-if="!showServer" :model="model" :showServer="showServer" key="scene1" @handlerClick="serverOpen($event)"></Scene>
        <Scene v-else :model="modelServer" id="container1" :showServer="showServer" key="scene2" @handlerClick="serverClose($event)"></Scene>
    </div>
</template>
<script> 
import Scene from './Scene.vue'
export default {
    name: 'room',
    components: {
        Scene,
    },
    data() {
        return {
            model: [
                {
                cabinet: 
                {
                    'uuid': '1',
                    'id': 1, 
                    'name':'1号机柜', 
                    'size': {w: 30, h: 70, d: 30}, // 尺寸
                    'position': {x: 0, y: 0, z: -50}, // 位置
                    'servers': [
                    {'uuid': '11', 'id':11, 'name':'1号服务器', 'ip':'', 'apps': ''},
                    {'uuid': '12', 'id':12, 'name':'2号服务器', 'ip':'', 'apps': ''},
                    {'uuid': '13', 'id':13, 'name':'3号服务器', 'ip':'', 'apps': ''},
                    {'uuid': '14', 'id':14, 'name':'4号服务器', 'ip':'', 'apps': ''},
                    {'uuid': '15', 'id':15, 'name':'5号服务器', 'ip':'', 'apps': ''},
                    {'uuid': '16', 'id':16, 'name':'6号服务器', 'ip':'', 'apps': ''},
                    {'uuid': '17', 'id':17, 'name':'7号服务器', 'ip':'', 'apps': ''}
                    ]
                }
                },
                {
                cabinet: 
                {
                    'uuid': '2',
                    'id': 2, 
                    'name':'2号机柜', 
                    'size': {w: 30, h: 70, d: 30}, // 尺寸 宽、高、深
                    'position': {x: 50, y: 0, z: -50}, // 位置
                    'servers': [
                    {'uuid': '21', 'id':21, 'name':'', 'ip':'', 'apps': ''}
                    ]
                }
                },
                {
                cabinet: 
                {
                    'uuid': '3',
                    'id': 3, 
                    'name':'3号机柜', 
                    'size': {w: 30, h: 70, d: 30}, // 尺寸
                    'position': {x: -50, y: 0, z: -50}, // 位置
                    'servers': [
                    {'uuid': '31', 'id':31, 'name':'', 'ip':'', 'apps': ''}
                    ]
                }
                }
            ],
            modelServer: [],
            showServer: false
        }
    },
    mounted() {
        
    },
    methods: {
        serverOpen(server) {
            this.showServer = true;
            const serverClone = JSON.parse(JSON.stringify(server));
            serverClone[0].cabinet.position = {x: 0, y: 0, z: -50};
            this.modelServer = serverClone;
        },
        serverClose() {
            this.showServer = false;
        }
    }
}
</script>
<style>
.room-panel {
    background-color: #fff;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: fixed;
}
.container{
    width: 100%;
    height: 100%;
    background-color: #fff;
}
    [v-cloak]{
        display: none;
    }
</style>