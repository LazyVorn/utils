<template>
            <TaskTree style="width:100%" :headData="head" :treeLayer="layer" :maxDays="9"
            :bodyData="data" choosedType="normal" pIdName="pId" startTime="2018-09-14" endTime="2018-09-21"></TaskTree>
</template>

<script>
import TaskTree from "../components/TaskTree"
import testData from "../assets/test1.js"
export default {
data () {
    return {
        head:[
              {name:"序号",value:"_code",width:"40px"},
              {name:"名称",value:"name",width:"310px"},
              {name:"计划工期",value:"costDay",width:"100px"},
              {name:"计划开始时间",value:"planStartTime",width:"130px"},
              {name:"计划完成时间",value:"planFinishTime",width:"130px"},
              {name:"责任人",value:"responsibleName",width:"95px"},
              {name:"分包单位",value:"subcontractorName",width:"110px"},
              {name:"参与人",value:"participantNames",width:"95px"},
              {name:"gantt",value:"gantt"}
              ],
        layer:0,
        data:[],
        testData:testData.data.list,
    }
},
components:{TaskTree},
created(){
    let _rootObj = {},
        _segObj = {},
        _rootArr = [],
        _segArr = [],
        _mark = 0;
    this.testData.forEach(ele => {
        ele.id = ele.itemId;
        ele.name = ele.segmentTaskName;
        ele.pId = ele.positionId ? ele.positionId : -1;
        if(ele.buildingId){
            if(!_rootObj[ele.buildingId]){
                _rootObj[ele.buildingId] = ele.buildingName;
                _rootArr.push({
                    id:ele.buildingId,
                    pId:null,
                    name:ele.buildingName,
                })
            }
        } 
        if(ele.positionId){
            if(!_segObj[ele.positionId]){
                _segObj[ele.positionId] = ele.positionName;
                _segArr.push({
                    id:ele.positionId,
                    pId:ele.buildingId || null,
                    name:ele.positionName,
                })
            }
        } else {
            _mark ++;
        }
        if(_mark > 0) {
            _segArr.push({
                id:-1,
                pId:null,
                name:"无部位"
            })
        }
        this.data = [..._rootArr,..._segArr,...this.testData];
    })
},
methods:{
    getClicked(){

    },
    getMaxLayer(){

    },
    getChooseBox(){

    }
}
}
</script>

<style>

</style>
