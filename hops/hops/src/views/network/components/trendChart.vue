<template>
	<div class="trendChart">
		<p class="trendChart-title">{{ title }}</p>
		<LargeChart></LargeChart>
	</div>
</template>
<script>
export default {
	name: 'trendChart',
	components: {
		LargeChart: () => import('@/components/largeChart.vue'),
	},
	props: ['title'],
}
</script>
<style scoped>
.trendChart {
	margin-bottom: 16px;
	padding: 16px;
	background: #ffffff;
	border-radius: 4px;
}
.trendChart-title {
	font-size: 18px;
	color: #282827;
}
</style>