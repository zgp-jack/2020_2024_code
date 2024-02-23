<template>
    <el-steps :active="taskProcessActive" finish-status="success" align-center>
        <el-step v-for="item,index in taskProcess" :key="item.id">
            <el-popover
                slot="icon"
                placement="top"
                trigger="click">
                <el-checkbox-group v-model="item.taskCompleted">
                    <el-checkbox v-for="task in item.items" :label="task.value" :key="item.value">{{ task.label }}</el-checkbox>
                </el-checkbox-group>
                <span slot="reference" style="cursor: pointer;">{{ index + 1 }}</span>
            </el-popover>
            <span slot="title" style="cursor: pointer;">{{ item.label }}</span>
        </el-step>
    </el-steps>
</template>
<script>
export default {
    props: {

    },
    data() {
        return {
            taskProcessActive: 0,
			taskProcess: [
				{id: 1, label: '任务1', status: 0, items: [{label: '代办1', value: 1}, {label: '代办2', value: 2}], taskCompleted: []},
				{id: 2, label: '任务2', status: 0, items: [{label: '代办1', value: 1}, {label: '代办2', value: 2}], taskCompleted: []},
				{id: 3, label: '任务3', status: 0, items: [{label: '代办1', value: 1}, {label: '代办2', value: 2}], taskCompleted: []},
			]
        }
    },
}
</script>
<style lang="css" scoped>

</style>