<template>
	<div class="echartCard">
		<p class="echartCard-title">{{ title }}</p>
		<slot></slot>
	</div>
</template>
<script>
export default {
	name: 'echartCard',
	props: ['title'],
}
</script>
<style scoped>
.echartCard {
	margin-bottom: 16px;
	padding: 16px;
	background: #ffffff;
	border-radius: 4px;
}
.echartCard:last-child {
	margin-bottom: 0;
}
.echartCard-title {
	margin-bottom: 16px;
	font-size: 18px;
	color: #282827;
}
</style>