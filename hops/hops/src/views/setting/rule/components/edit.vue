<template>
	<el-form :model="formData" :rules="rules" ref="ruleForm" class="ruleEdit">
		<el-form-item label="名称" prop="name" :label-width="formLabelWidth">
			<el-input v-model="formData.name" autocomplete="off" placeholder="请输入名称"></el-input>
		</el-form-item>
		<el-form-item label="指标" :label-width="formLabelWidth">
			<el-select v-model="formData.metricId" placeholder="请选择指标" @change="change">
				<el-option v-for="item in metricsOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="触发器" :label-width="formLabelWidth">
			<el-select v-model="formData.triggerType" placeholder="请选择触发器">
				<el-option label="AI" :value="0"></el-option>
				<el-option label="阈值（绝对值）" :value="1"></el-option>
				<el-option label="阈值（百分比）" :value="2"></el-option>
			</el-select>
		</el-form-item>
		<!-- <el-form-item label="类型" :label-width="formLabelWidth">
			<el-select v-model="formData.type" placeholder="请选择类型">
				<el-option label="自定义" :value="0"></el-option>
				<el-option label="默认" :value="1"></el-option>
			</el-select>
		</el-form-item> -->
		<el-form-item label="低等级" :label-width="formLabelWidth">
			<el-input v-model="formData.level1" autocomplete="off" placeholder="请输入低等级">
				<!-- <el-select v-model="select" slot="prepend" placeholder="请选择">
					<el-option label="餐厅名" value="1"></el-option>
					<el-option label="订单号" value="2"></el-option>
					<el-option label="用户电话" value="3"></el-option>
				</el-select> -->
				<template slot="append">{{ formData.triggerType == 0 ? 's' : unit ? unit : '个' }}</template>
			</el-input>
		</el-form-item>
		<el-form-item label="中等级" :label-width="formLabelWidth">
			<el-input v-model="formData.level2" autocomplete="off" placeholder="请输入中等级">
				<template slot="append">{{ formData.triggerType == 0 ? 's' : unit ? unit : '个' }}</template>
			</el-input>
		</el-form-item>
		<el-form-item label="高等级" :label-width="formLabelWidth">
			<el-input v-model="formData.level3" autocomplete="off" placeholder="请输入高等级">
				<template slot="append">{{ formData.triggerType == 0 ? 's' : unit ? unit : '个' }}</template>
			</el-input>
		</el-form-item>
		<!-- <el-form-item label="对象" :label-width="formLabelWidth">
			<el-select v-model="formData.monitorTypeId" placeholder="请选择对象">
				<el-option v-for="item in objectOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
			</el-select>
		</el-form-item> -->
		<el-form-item v-if="formData.triggerType != 0" label="触发窗口" :label-width="formLabelWidth">
			<el-input v-model="formData.triggerWindow" autocomplete="off" placeholder="请输入触发窗口"></el-input>
		</el-form-item>
		<el-form-item label="作用范围" :label-width="formLabelWidth">
			<el-select v-model="formData.monitorIdList" multiple collapse-tags placeholder="请选择作用范围">
				<el-option v-for="item in objectOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="有效日期" :label-width="formLabelWidth">
			<el-select v-model="formData.validityCycle" multiple collapse-tags placeholder="请选择有效时间">
				<el-option v-for="item in weekOption" :key="item.value" :label="item.label" :value="item.value"> </el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="有效时间" :label-width="formLabelWidth">
			<el-time-picker
				is-range
				v-model="formData.timeList"
				range-separator=""
				start-placeholder="开始时间"
				end-placeholder="结束时间"
				placeholder="选择时间范围"
				value-format="HH:mm:ss"
				class="add-item-input"
			>
			</el-time-picker>
		</el-form-item>
		<slot name="submit"></slot>
	</el-form>
</template>
<script>
export default {
	name: 'edit',
	props: ['formData', 'metricsOption', 'objectOption', 'rules'],
	data() {
		return {
			formLabelWidth: '',
			weekOption: [
				{ value: 1, label: '星期一' },
				{ value: 2, label: '星期二' },
				{ value: 3, label: '星期三' },
				{ value: 4, label: '星期四' },
				{ value: 5, label: '星期五' },
				{ value: 6, label: '星期六' },
				{ value: 7, label: '星期七' },
			],
			unit: 's',
			select: '',
		}
	},
	mounted() {},
	methods: {
		change(value) {
			this.metricsOption.forEach((item) => {
				if (item.id == value) {
					this.unit = item.unit
				}
			})
		},
		validFN(valfn) {
			this.$refs.ruleForm.validate((valid) => {
				if (valid) {
					return valfn(true)
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
	},
}
</script>
<style scoped>
.ruleEdit {
	display: flex;
	flex-wrap: wrap;
}
</style>