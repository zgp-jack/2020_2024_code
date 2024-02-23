<template>
    <div>
        <el-form :model="formData">
            <!-- <el-form-item label="告警名称" :label-width="formLabelWidth">
                <el-input v-model="formData.name" autocomplete="off"></el-input>
            </el-form-item> -->
            <el-form-item label="告警时间" :label-width="formLabelWidth">
                <template v-for="(item, index) in timeList">
                    <el-time-picker
                        is-range
                        v-model="item.value"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        :key="index"
                        placeholder="选择时间范围"
                        style="width: calc(100% - 60px)">
                    </el-time-picker>
                    <el-button size="mini" style="margin-left: 16px;" @click.prevent="removeTimeLine(index)" circle><i class="el-icon-close"></i></el-button>
                </template>
                <el-button size="mini" style="margin-left: 0;" @click.prevent="addTimeLine()" circle><i class="el-icon-plus"></i></el-button>
            </el-form-item>
            <!-- <el-form-item label="监测对象类型" :label-width="formLabelWidth">
                <el-input v-model="formData.typeName" autocomplete="off" disabled></el-input>
            </el-form-item> -->
            <el-form-item label="监测对象" :label-width="formLabelWidth">
                <el-select v-model="checkMonitorList" placeholder="请选择监测对象" multiple filterable>
                    <el-option v-for="item in monitorList" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="del">
            <el-button @click="closeDialog">确 定</el-button>
            <el-button type="primary" @click="handleDelete">删 除</el-button>
        </div>
        <div slot="footer" class="dialog-footer" v-else>
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
    </div>
</template>
<script>
import ApiDatabase from '@/api/database';
import ApiHost from '@/api/host';
import ApiProcess from '@/api/process';
import { getMiddleList, ApiNetwork } from '@/api/index';
const RULETYPE = JSON.parse(sessionStorage.getItem('RuleType'));
export default {
    props: {
        del: {
            type: Boolean,
            default: false
        },
        detailData: {
            type: Object,
            default: () => {
                return {
                    beginTime: 0,
                    endTime: 0,
                    metricId: null,
                    monitorId: null,
                    monitorTypeId: null,
                    typeName: ''
                }
            }
        }
    },
    data() {
        return {
            type: 'edit',
            formData: {
                metricId: null
            },
            timeList: [{label: '', value: [0, 0]}],
            formLabelWidth: '120px',
            monitorList: [],
            checkMonitorList: []
        }
    },
    mounted() {
        this.initData();
    },
    methods: {
        initData() {
            this.formData.metricId = this.detailData.metricId;
            
            this.getProcess();

            let typeName = '';
            const typePid = RULETYPE.filter(rule => rule.id === this.detailData.monitorTypeId)[0];
            const typeId = this.detailData.monitorTypeId;
            typeName = typePid.typeName;
            if(typePid.pid !== 0) {
                typeName = RULETYPE.filter(rule => rule.id === typePid.pid)[0].typeName;
            }
            switch(typeName) {
                case '主机':
                    this.getHostList(typeId);
                break;
                case '网络':
                    this.getNetList(typeId);
                break;
                case '数据库':
                    this.getDBList(typeId);
                break;
                case '中间件':
                    this.getMidddleList(typeId);
                break;
            }
        },
        addTimeLine() {
            this.timeList.push({label: '', value: [new Date(0), new Date(3600000)]});
        },
        removeTimeLine(index) {
            this.timeList.splice(index, 1);
        },
        getProcess() {
            const params = {
                metricId: this.detailData.metricId,
                monitorId: this.detailData.monitorId,
                monitorTypeId: this.detailData.monitorTypeId,
            }
            ApiProcess.view(params).then(res => {
                if(res.status === 1) {
                    const data = res.data;
                    this.timeList = [{label: '', value: [0, 0]}];
                    //值为空，设置默认值
                    let beginTime = new Date(this.detailData.beginTime);
                    let endTime = this.detailData.endTime ? new Date(this.detailData.endTime) : new Date();
                    let timeList = [];
                    //大于24小时
                    if(endTime.getTime() - beginTime.getTime() > 86400000) {
                        timeList.push({beginTime: '00:00:00', endTime: '23:59:59'})
                        //this.timeList[0].value = [new Date(2023, 1, 1, 0, 0, 0), new Date(2023, 1, 1, 23, 59, 59)];
                    } else {
                        //跨天
                        if(beginTime.getDate() != endTime.getDate()) {
                            //添加一行
                            //this.addTimeLine();
                            //this.timeList[0].value = [
                            //    new Date(2023, 1, 1, beginTime.getHours(), beginTime.getMinutes(), beginTime.getSeconds()), 
                            //    new Date(2023, 1, 1, 23, 59, 59)
                            //];
                            //this.timeList[1].value = [
                            //    new Date(2023, 1, 1, 0, 0, 0),
                            //    new Date(2023, 1, 1, endTime.getHours(), endTime.getMinutes(), endTime.getSeconds())
                            //];
                            timeList.push({beginTime: `${beginTime.getHours()}:${beginTime.getMinutes()}:${beginTime.getSeconds()}`, endTime: '23:59:59'})
                            timeList.push({beginTime: '00:00:00', endTime: `${endTime.getHours()}:${endTime.getMinutes()}:${endTime.getSeconds()}`})
                        } else {
                            //this.timeList[0].value = [beginTime, endTime];
                            timeList.push({beginTime: `${beginTime.getHours()}:${beginTime.getMinutes()}:${beginTime.getSeconds()}`,
                                            endTime: `${endTime.getHours()}:${endTime.getMinutes()}:${endTime.getSeconds()}`})
                        }
                    }
                    if(!data) {
                        this.type = 'add';
                        this.checkMonitorList = [this.detailData.monitorId];
                    } else {
                        this.type = 'edit';
                        this.formData.id = data.id;
                        this.checkMonitorList = data.monitorList.map(item => item.monitorId);

                        data.timeList.map(item => {
                            //const beginTimeList = item.beginTime.split(':');
                            //const endTimeList = item.endTime.split(':');
                            //let beginTime = new Date(2023, 1, 1, beginTimeList[0], beginTimeList[1], beginTimeList[2]);
                            //let endTime = new Date(2023, 1, 1, endTimeList[0], endTimeList[1], endTimeList[2]);
                            //this.timeList.push({label: '', value: [beginTime, endTime]});
                            timeList.push({beginTime: item.beginTime, endTime: item.endTime});
                        })
                    }
                    //融合
                    //let timeList = this.timeList.map(item => {
                        //const time = item.value;
                        //const begin = `${time[0].getHours()}:${time[0].getMinutes()}:${time[0].getSeconds()}`
                        //const end = `${time[1].getHours()}:${time[1].getMinutes()}:${time[1].getSeconds()}`
                        //return {
                            //beginTime: begin,
                            //endTime: end,
                        //}
                    //});
                    timeList = this.mergeTime(timeList);
                    this.timeList = [];
                    timeList.forEach(item => {
                        const beginTimeList = item.beginTime.split(':');
                        const endTimeList = item.endTime.split(':');
                        let beginTime = new Date(2023, 1, 1, beginTimeList[0], beginTimeList[1], beginTimeList[2]);
                        let endTime = new Date(2023, 1, 1, endTimeList[0], endTimeList[1], endTimeList[2]);
                        this.timeList.push({label: '', value: [beginTime, endTime]})
                    })
                }
            })
        },
        getHostList(id) {
            ApiHost.page({page: 1, pageSize: 10000}).then(res => {
                if(res.status === 1) {
                    const data = res.data;
                    this.monitorList = data.records.map(item => {
                        return {
                            label: item.computerName,
                            value: item.id
                        }
                    });
                }
            })
        },
        getDBList(id) {
            ApiDatabase.page({page: 1, pageSize: 10000}).then(res => {
                if(res.status === 1) {
                    const data = res.data;
                    this.monitorList = data.records.filter(d => d.type === id).map(item => {
                        return {
                            label: item.name,
                            value: item.id
                        }
                    });
                }
            })
        },
        getMidddleList(id) {
            getMiddleList({page: 1, pageSize: 10000}).then(res => {
                if(res.status === 1) {
                    const data = res.data;
                    this.monitorList = data.records.filter(d => d.type === id).map(item => {
                        return {
                            label: item.name,
                            value: item.id
                        }
                    });
                }
            })
        },
        getNetList(id) {
            ApiNetwork('page', {page: 1, pageSize: 10000}).then(res => {
                if(res.status === 1) {
                    const data = res.data;
                    let list = data.records.filter(d => d.type === id);
                    if(list.length === 0) {
                        list = data.records;
                    }
                    this.monitorList = list.map(item => {
                        return {
                            label: item.name,
                            value: item.id
                        }
                    });
                }
            })
        },
        submitForm() {
            let params = {
                id: this.formData.id,
                metricId: this.formData.metricId,
                monitorList: [],
                timeList: []
            }
            this.checkMonitorList.map(item => {
                params.monitorList.push({monitorId: item, monitorTypeId: this.detailData.monitorTypeId})
            })
            const timeList = [];
            this.timeList.map(item => {
                const time = item.value;
                const begin = `${time[0].getHours()}:${time[0].getMinutes()}:${time[0].getSeconds()}`
                const end = `${time[1].getHours()}:${time[1].getMinutes()}:${time[1].getSeconds()}`
                timeList.push({beginTime: begin, endTime: end})
            })
            
            params.timeList = this.mergeTime(timeList);
            // console.log(timeList);
            ApiProcess[this.type === 'edit' ? 'update' : 'save'](params).then(res => {
                if(res.status === 1) {
                    this.$emit('handleSubmit', true);
                }
            })
        },
        mergeTime(timeList) {
            //融合
            for(let i = 0; i < timeList.length; i++) {
                for(let j = 0; j < timeList.length; j++) {
                    
                    const j_begin = timeList[j].beginTime.split(':');
                    const j_end = timeList[j].endTime.split(':');
                    const i_begin = timeList[i].beginTime.split(':');
                    const i_end = timeList[i].endTime.split(':');
                    const j_begin_time = new Date(2023, 1, 1, j_begin[0], j_begin[1], j_begin[2]);
                    const j_end_time = new Date(2023, 1, 1, j_end[0], j_end[1], j_end[2]);
                    const i_begin_time = new Date(2023, 1, 1, i_begin[0], i_begin[1], i_begin[2]);
                    const i_end_time = new Date(2023, 1, 1, i_end[0], i_end[1], i_end[2]);
                    //j开始时间在i时间之内 || j结束时间在i时间之内
                    const merge = j_begin_time <= i_end_time && j_begin_time >= i_begin_time
                                || j_end_time <= i_end_time && j_end_time >= i_begin_time
                    //融合
                    if(merge) {
                        if(j_end_time > i_end_time) {
                            timeList[i].endTime = timeList[j].endTime;
                        }
                        if(j_begin_time < i_begin_time) {
                            timeList[i].beginTime = timeList[j].beginTime;
                        }
                        if(i != j) {
                            timeList.splice(j, 1);
                        }
                    }
                }
            }
            return timeList;
        },
        handleDelete() {
            ApiProcess.del({id: this.formData.id}).then(res => {
                if(res.status === 1) {
                    this.$emit('handleSubmit');
                }
            })
        },
        closeDialog() {
            this.$emit('handleClose');
        }
    }
}
</script>