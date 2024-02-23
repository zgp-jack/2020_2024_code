<template>
	<div class="page">
		<Top></Top>
		<div class="flex-page">
			<router-view></router-view>
		</div>
	</div>
</template>
<script>

export default {
	components: {
		Top: () => import('./Top.vue'),
	},
	name: 'home',
	data() {
		return {
			user_name: sessionStorage.getItem('user_name'),
		};
	},
	methods: {
		
	},
};
</script>
<style scoped>
	.page {
		background: url(../assets/内容页面背景图.jpg) no-repeat;
		background-size: cover;
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	.flex-page{
		flex: 1;
		min-height: 0;
	}
</style>