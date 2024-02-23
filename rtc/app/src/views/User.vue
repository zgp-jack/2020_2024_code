<template>
    <div fill style="padding: 20px">
      <VideoPlay></VideoPlay>
      <transition name="van-slide-up">
        <AudioPlay :title="call_username"></AudioPlay>
      </transition>
      <h2 class="box-title">{{title}}列表</h2>
      <van-card
        v-for="user,index in userList"
        :key="index"
        :desc="user.name"
        :title="user.name"
        thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
      >
        <template #thumb>
          <van-icon name="desktop-o" size="15rem"/>
        </template>
        <template #tags>
          <van-tag type="primary" v-if="user.status === 1">在线</van-tag>
          <van-tag type="danger" v-if="user.status === 0">离线</van-tag>
          <van-tag type="success" v-if="user.status === 2">通话中</van-tag>
        </template>
        <template #footer>
          <van-button type="info" size="mini" @click="audioCall(user.name)" icon="audio">语音通话</van-button>
          <van-button type="info" size="mini" @click="videoCall(user.name)" icon="live">视频通话</van-button>
        </template>
      </van-card>
    </div>
</template>
<script>
  import Bus from './Bus';
  export default {
    name: 'user',
    data() {
      return {
        user_name: sessionStorage.user_name || 'zw',
        call_username: '',
        userList: [],
        title: '人员'
      }
    },
    computed: {
      users() {
        return this.$store.state.users
      }
    },
    components: {
      VideoPlay: () => import('./VideoPlay.vue'),
      AudioPlay: () => import('./AudioPlay.vue')
    },
    mounted() {
      this.title = this.$route.params.name || '人员';
      Bus.$off('setCallName').$on('setCallName', data => {
        this.call_username = data.name;
      })
    },
    methods: {
      audioCall(user) {
        if(user == this.user_name) {
          return false;
        }
        this.call_username = user;
        Bus.$emit('audioCall', user);
      },
      videoCall(user) {
        if(user == this.user_name) {
          return false;
        }
        this.call_username = user;
        Bus.$emit('videoCall', user);
      }
    },
    watch: {
      users: {
        handler(val) {
          this.userList = val;
          console.log(this.userList);
        },
        immediate: true,
        deep: true
      }
    }
  }
</script>
<style lang="css">
.van-card__content{
  text-align: left;
}
</style>