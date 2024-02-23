<template>
    <div class="business-left">
        <p class="large-label">站点</p>
        <div class="large-card flex-1">
            <IndexTable :tableHeader="tableHeader1" :tableData="tableData1"></IndexTable>
        </div>
    </div>
</template>
<script>
import { getMiddleList, listMiddle } from '@/api'
export default {
    name: 'businessLeft',
    props: {
        searchId: {
            type: Number
        }
    },
    components: {
        IndexTable: () => import('../../components/table.vue'),
    },
    data() {
        const endTime = new Date().getTime()
		const startTime = endTime - 86400000;
        return {
            tableHeader1: [
                { prop: 'name', label: '名称' },
				{ prop: 'website', label: '网址' },
				{ prop: 'port', label: '端口' },
				{ prop: 'state', label: '状态' },
            ],
            tableData1: [],
            tableData2: [],
            searchData: {
				startTime: startTime,
				endTime: endTime,
				name: '',
			},
            timer: null
        }
    },
    mounted() {
        const cycle = this.$store.state.config.bigScreenCycle || 60000;
        this.getList({monitorId: this.searchId,...this.searchData});
        this.timer = setInterval(() => {
            this.setTime();
            this.getList({monitorId: this.searchId,...this.searchData});
        }, cycle)
    },
    beforeDestroy(){
        clearInterval(this.timer);
    },
    methods: {
        setTime() {
            const endTime = parseInt(new Date().getTime());
		    const startTime = endTime - 86400000;
            this.searchData.startTime = startTime;
            this.searchData.endTime = endTime;
        },
        getList(params) {
            listMiddle('iis', params).then((res) => {
                if (res.status == 1 && res.data) {
                    this.tableData2 = res.data.iisPathList
                    this.tableData1 = res.data.siteInfoList
                }
                this.$emit('setTableData', this.tableData2);
                this.jvmTitle = 'iis'
            });
            getMiddleList({page: 1, pageSize: 9999, ...params}).then((res) => {
				if (res.status == 1 && res.data.records.length) {
					res.data.records.forEach((item) => {
						this.$store.state.ruleType.forEach((it) => {
							if (it.id == item.type) {
								item.typeName = it.typeName
							}
						})
					})
					const row = res.data.records.filter((item) => item.id === this.searchId)[0];
                    this.$emit('setTopInfo', {name: row.name, tip: row.typeName, ip: row.host});
				}
			})
        }
    },
    watch: {
        searchId: function(val) {
            this.getList({monitorId: val, ...this.searchData});
        } 
    }
}
</script>
<style lang="scss" scoped>
.business-left{
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>