<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default { name: 'app' };
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 14px;
  height: 100%;
}
*{
  box-sizing: border-box;
}
html, body{
  padding: 0;
  margin: 0;
  height: 100%;
  box-sizing: border-box;
}
ul {
	margin: 0;
	padding: 0;
}
h1,h2,h3,h4,h5,h6,p{
  padding: 0;
  margin: 0;
}
.demo-form-inline {
    margin-bottom: 5px;
    text-align: left;
    padding-top: 10px;
}
.demo-form-inline .el-form-item__label {
    color: #fff;
}
</style>
