<template>
    <div class="joystick-box">
        <div id="joystick_zone"></div>
    </div>
</template>
<script>
import nipplejs from "nipplejs";
export default {
    data() {
        return {
            speed: 50,
            timer: null,
            timer_interval: 200
        }
    },
    mounted() {
        var manager = nipplejs.create({
            zone: document.getElementById("joystick_zone"),
            size: 158,
            mode: "static",
            position: { left: "50%", top: "45%" },//在容器内垂直居中显示
            color: "gray",
            follow: false
        });
        manager.on("move", (evt, data) => {
            //节流
            if (!this.timer) {
                this.timer = setTimeout(() => {
                    this.getDirection(data);
                    clearTimeout(this.timer);
                    this.timer = null;
                }, this.timer_interval)
            }
        });
        //停止滑动摇杆的事件 
        manager.on("end", (evt, data) => {
            setTimeout(() => {
                this.ptzControlStop();
            }, 201)
        });

    },
    methods: {
        getDirection(data) {
            let pos = data.vector;
            let rad = Math.atan2(pos.y, pos.x);// [-PI, PI]
            let dse = parseInt(Math.sqrt(pos.x ** 2 + pos.y ** 2) * 100);
            //手抖判断
            if(dse < 10) {
                return false
            }
            let conno = '';
            //根据夹角判断方向
            if ((rad >= -Math.PI / 8 && rad < 0) || (rad >= 0 && rad < Math.PI / 8)) {
                conno = 'right'; // 右
            } else if (rad >= Math.PI / 8 && rad < 3 * Math.PI / 8) {
                conno = 'right_up'; // 右上
            } else if (rad >= 3 * Math.PI / 8 && rad < 5 * Math.PI / 8) {
                conno = 'up'; // 上
            } else if (rad >= 5 * Math.PI / 8 && rad < 7 * Math.PI / 8) {
                conno = 'left_up'; // 左上
            } else if ((rad >= 7 * Math.PI / 8 && rad < Math.PI) || (rad >= -Math.PI && rad < -7 * Math.PI / 8)) {
                conno = 'left'; // 左
            } else if (rad >= -7 * Math.PI / 8 && rad < -5 * Math.PI / 8) {
                conno = 'left_down'; // 左下
            } else if (rad >= -5 * Math.PI / 8 && rad < -3 * Math.PI / 8) {
                conno = 'down'; // 下
            } else {
                conno = 'right_down'; // 右下
            }
            this.ptzControlStart(conno, dse)
        },
        ptzControlStart(conno, dse) {
            this.$emit('ptzControlStart', conno, dse);
        },
        ptzControlStop() {
            this.$emit('ptzControlStop');
        }
    },
    beforeDestroy() {
    }
}
</script>
<style lang="css" scoped>
    .joystick-box{
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>