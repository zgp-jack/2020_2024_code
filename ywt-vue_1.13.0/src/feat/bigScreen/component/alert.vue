<template>
  <el-row>
    <el-col :span="24" class="alert-dialog-text">
      {{ message }}
    </el-col>
    <el-col :span="24" class="alert-dialog-button-col">
      <button class="alert-dialog-button" @click="iKnow">我知道了</button>
    </el-col>

  </el-row>
</template>

<script>
export default {
  props: ['message'],
  methods: {
    iKnow() {
      this.$emit('done');
    },
  },
};
</script>

<style lang="scss" scoped>
 .alert-dialog-button{
    width: 127px;
height: 32px;
color:#e64645;
   background: #0D0101;
  background-image: linear-gradient(180deg, rgba(255,255,255,0.00) 24%, rgba(230,70,69,0.10) 100%);
  border: 1px solid #E64645;
  margin-top: 60px;
  }
  .alert-dialog-button-col{
    text-align: right;
  }
.alert-dialog-text{
opacity: 0.9;
font-weight: 500;
font-size: 18px;
color: #E64645;
letter-spacing: 0;
}
</style>
