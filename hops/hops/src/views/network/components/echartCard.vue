<template>
	<div class="echartCard">
		<p class="echartCard-title">{{ title }}</p>
		<div :class="[isHeight ? 'content-thread' : 'content']">
			<slot></slot>
		</div>
	</div>
</template>
<script>
export default {
	name: 'echartCard',
	props: {
		title: {
			type: String,
		},
		isHeight: {
			type: Boolean,
			default: false,
		},
	},
}
</script>
<style scoped>
.echartCard {
	position: relative;
	margin-bottom: 16px;
	padding: 16px;
	background: #ffffff;
	border-radius: 4px;
}
.echartCard:last-child {
	margin-bottom: 0;
}
.echartCard-title {
	/* margin-bottom: 16px; */
	font-size: 18px;
	color: #282827;
}
.content {
	height: 240px;
}
.content-thread {
	min-height: 360px;
}
</style>