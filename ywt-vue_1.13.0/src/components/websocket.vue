<template>
  <div class="websockt"></div>
</template>

<script>
export default {
  name: "test",
  data() {
    return {
      websock: null,
    };
  },
  created() {
    // this.initWebSocket();
  },
  destroyed() {
    this.websock.close();
  },
  methods: {
    initWebSocket() {
      //初始化weosocket
      const wsuri = "ws://192.168.1.104:8989/ywt/webSocket/test";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      // let actions = { test: "1234jjj" };
      // this.websocketsend(JSON.stringify(actions));
    },
    websocketonerror() {
      //连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage(e) {
      //数据接收
      // const redata = JSON.parse(e.data);
      const data = e.data;
      try {
        let tempData = JSON.parse(data);
        if (tempData.body) {
          this.$emit("websocket", tempData.body);
        }
      } catch (error) {
        console.log(error);
      }
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
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