<template>
	<div class="networkTogologView">
		<div class="togolog-main">
			<p @click="toView" title="列表视图" class="network-list"><i class="el-icon-date"></i></p>
			<div class="togolog">
				<!-- calss设置宽高， type==2,  setWarn点击事件 -->
				<TogologView class="togolog-container" :type="type" @setWarn="getWarn"></TogologView>
				<div class="carousel-main">
					<Carousel v-if="planId" :planId="planId"></Carousel>
				</div>
			</div>
			<div class="network-warn">
				<WarnList class="network-right" v-if="businessId" :showTop="false" :showIcon="true" :monitorTypeId="typeId" :businessId="businessId" :searchData="searchData"></WarnList>
			</div>
		</div>
	</div>
</template>
<script>
import { ApiNetworkList } from '@/api'
export default {
	name: 'networkTogologView',
	components: {
		WarnList: () => import('@/components/warnList.vue'),
		Carousel: () => import('./components/carousel.vue'),
		TogologView: () => import('@/components/togologView.vue'),
	},
	data() {
		const endTime = parseInt(new Date().getTime())
		const h = new Date().getHours() * 3600000
		const m = new Date().getMinutes() * 60000
		const s = new Date().getSeconds() * 1000
		const startTime = endTime - 86400000 - (h + m + s)
		return {
			searchData: {
				startTime: startTime,
				endTime: endTime,
			},
			businessId: 0,
			typeId: '',
			planId: '',
			tableData: [],
			type: '',
		}
	},
	mounted() {
		this.$store.state.ruleType.forEach((item) => {
			if (item.typeName == '网络') {
				this.typeId = item.id
			}
		})
		this.getList()
	},
	methods: {
		getList() {
			let params = {
				page: 1,
				pageSize: 20,
				name: '',
				type: 1,
			}
			this.tableData = []
			ApiNetworkList('/top/plan/page', params).then((res) => {
				let data = res.data.records || []
				if (res.status == 1) {
					this.tableData = data
					this.type = data[0].id
					this.planId = data[0].id
				}
			})
		},
		getWarn(warn) {
			this.typeId = warn.monitorType || ''
			this.businessId = warn.monitorId || ''
		},
		// getId(id) {
		// 	this.planId = id
		// },
		toView() {
			this.$router.push({ name: 'network' })
		},
	},
}
</script>
<style scoped>
.networkTogologView {
	width: 100%;
	height: 100%;
	padding: 16px;
}
.togolog-main {
	position: relative;
	display: flex;
	justify-content: center;
	width: 100%;
	height: 100%;
	padding: 16px;
	border-radius: 4px;
	background-color: #fff;
}
.togolog-container {
	width: 100%;
	height: 650px;
}
.network-list {
	position: absolute;
	left: 15px;
	top: 15px;
	width: 32px;
	height: 32px;
	text-align: center;
	border-radius: 4px;
	border: 1px solid #799f9f;
	background: #ffffff;
	cursor: pointer;
	color: #006666;
	font-size: 14px;
	line-height: 32px;
}
.network-warn {
	position: absolute;
	top: 15px;
	right: 15px;
	height: calc(100% - 32px);
}
.network-right {
	width: 384px;
	height: 100% !important;
	box-shadow: 0 -1px 5px 0 #0066660f, 0 3px 14px 2px #0066660d, 0 8px 10px 1px #0066660f, 0 5px 5px -3px #0066661a;
}
.togolog {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	width: 1150px;
	height: 100%;
}
.network-carousel {
}
.carousel-main {
	width: 800px;
	height: 96px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	cursor: pointer;
	overflow: hidden;
}
</style>