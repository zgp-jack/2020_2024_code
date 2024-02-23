<template>
    <div class="setting-panel">
        <TableList></TableList>
    </div>
</template>
<script>
    export default {
        name: 'settingMiddleware',
        components: {
            TableList: () => import('./components/TableList.vue')
        },
        data() {
            return {
                
            }
        }
    }
</script>
<style scoped lang="scss">
.setting-panel{
    padding: 16px;
}
</style>