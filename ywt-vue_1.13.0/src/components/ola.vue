<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 14:16:19
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-04-16 14:53:40
 * @Description: 添添呼websocket
-->
<template>
  <div class="websockt" />
</template>

<script>
import { ola, } from '@/utils/ola_api';
export default {
  data() {
    return {
      websock: null,
      serIP: '192.168.6.23',
      serPort: '29003',
      ola_extn: '1002',
      ola_queue: ['10010'],
    };
  },
  created() {
    this.initWebSocket();
  },
  destroyed() {
    console.log('close');
  },
  methods: {
    initWebSocket() {
      this.OLA_URI = 'ws://' + this.serIP + ':' + this.serPort + '/ola_socket';
      ola.connect(this.OLA_URI);
      ola.onConnect = this.onConnect;
      ola.onClose = this.onClose;
      ola.onMessage = this.onMessage;
    },
    onMessage(evt) {
      var data = JSON.parse(evt.data);

      if (data.event_type === 'agent_state') {
        if (data.state === 'login') {
          console.log('已签入');
        } else if (data.state === 'logout') {
          console.log('未签入');
        } else if (data.state === 'ready') {
          console.log('示闲中');
        } else if (data.state === 'unready') {
          console.log('示忙中');
        } else if (data.state === 'acw') {
          console.log('话后整理中');
        } else if (data.state === 'busy') {
          console.log('通话中');
        }

        if (data.state === 'busy') {
          if (data.private_data === 'ring') {
            console.log(data);
            this.$emit('olaRing', {
              phone: data.other_dn,
              id: data.call_accept,
            });
          } else if (data.private_data === 'answered') {
            if (data.call_direction !== 'inbound') {
              // 表示座机打出去的   可配置外呼弹屏
              //   alert('外呼坐席已接听，可配置外呼弹屏,拨打号码:" + data.other_dn);
            } else {
              //   alert(
              //     "呼入坐席已接听，可配置来电弹屏,来电号码：" + data.other_dn
              //   );
            }
          }
        } else if (data.old_state === 'busy') {
          // 挂机后系统可以返回两种状态:acw 话后整理状态 ready 示闲状态，如果不需要acw，可以联系我们后台修改配置，如果需要保留，如果需要再次
          // 拨打电话的话，需要手动点击示闲按钮
        }
      }
    },
    onConnect() {
      console.log('websocket connected');
      ola._extn = this.ola_extn;
      ola.subscribe('ola.agent.' + this.ola_extn);
      ola.subscribe('ola.caller.' + this.ola_extn);
      ola.get_agent_state(this.ola_extn);

      this.login();
      this.logout();
      setTimeout(() => {
        this.login();
      }, 1000);
      setTimeout(() => {
        this.go_ready();
      }, 3000);
    },
    login() {
      ola.login(this.ola_queue, this.ola_extn, { type: 'onhook', });
    },
    logout() {
      ola.logout();
    },
    go_ready() {
      ola.go_ready();
    },
    go_break() {
      ola.go_break('');
    },
    answer() {
      ola.answer();
    },
    dial(dst, uuid) {
      ola.dial(dst, uuid);
    },
    conference(dst) {
      ola.conference(dst);
    },
    conference_uuid(channel_uuid) {
      ola.conference_uuid(channel_uuid);
    },
    hangup() {
      ola.hangup();
    },
    take_call(uuid) {
      ola.take_call(this.ola_extn, uuid);
    },
    ipt_focus(obj) {},
    onClose() {
      console.log('websocket 断开');
    },
  },
};
</script>
<style lang="scss" scoped>
.websocket {
  width: 1px;
  height: 1px;
}
</style>
