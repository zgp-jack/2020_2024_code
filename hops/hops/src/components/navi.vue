<template>
	<div class="navi">
		<el-scrollbar class="menu-scroll">
			<div class="navMenuBox">
				<el-menu
					:default-active="$store.state.navAction"
					:default-openeds="$store.state.openListArr"
					background-color="#066666"
					text-color="#fff"
					active-text-color="#fff"
					:unique-opened="true"
					:router="true"
					@open="handleOpen"
					@close="handleClose"
					:collapse="!isCollapse"
					:collapse-transition="false"
					@select="selectNavi"
				>
					<el-menu-item v-for="(item, index) in menuNav.nohas" :key="item.url + index" :index="item.url">
						<span slot="title">{{ item.name }}</span>
					</el-menu-item>
					<el-submenu v-for="(item, index) in menuNav.has" :key="item.url + index" :index="item.url">
						<template slot="title">
							<span>{{ item.name }}</span>
						</template>
						<el-menu-item v-for="(subitem, subindex) in item.children" :index="subitem.url" :key="subitem.url + subindex">{{ subitem.name }}</el-menu-item>
					</el-submenu>
				</el-menu>
			</div>
		</el-scrollbar>
	</div>
</template>
<script>
import { ApiMenuTreeAndAction, ApiMenuTree } from '@/api/index'
export default {
	name: 'navi',
	data() {
		return {
			isCollapse: true,
			menuArr: [],
		}
	},
	mounted() {
		this.getMenuTree()
	},
	computed: {
		menuNav: function () {
			let navi = { has: [], nohas: [] }
			this.menuArr.forEach((item) => {
				if (item.children < 1) {
					navi.nohas.push(item)
				} else {
					navi.has.push(item)
				}
			})
			return navi
		},
	},
	methods: {
		getMenuTree() {
			this.menuArr = JSON.parse(sessionStorage.getItem('menuArr'));
			// ApiMenuTree({}).then((res) => {
			// 	if (res.status === 1) {
			// 		this.menuArr = res.data
			// 	}
			// })
		},
		handleOpen(key, keyPath) {
			// console.log(key, keyPath)
		},
		handleClose(key, keyPath) {
			// console.log(key, keyPath)
		},
		selectNavi(index, pathIndex) {
			let openListArr = []
			sessionStorage.setItem('navAction', index)
			this.$store.commit('updateNavAction', index)
			openListArr = pathIndex
			sessionStorage.setItem('openListArr', JSON.stringify(openListArr))
			this.$store.commit('updateOpenListArr', openListArr)
		},
	},
}
</script>
<style>
.navi {
	height: 100%;
}
.menu-scroll {
	height: 100vh;
}
</style>