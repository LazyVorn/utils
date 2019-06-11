<template>
    <div style="width:100%;height:100%;">
        <span @click="btnClick(1)">分包单位</span>
        <span @click="btnClick(2)">部位</span>
        <plan-table style="width:90%;height:90%;margin:10px 5%;"
        :headData="headList" :bodyData="demoList" :bakData="bakList"></plan-table>
    </div>
</template>

<script>
import demo from '../components/PlanTable/demo'
import PlanTable from '../components/PlanTable/PlanTable'
export default {
    name:"Plan",
    components:{PlanTable},
    data () {
        return {
            bodyList:demo.list,
            orderMap:{},
            bakList:[],
            demoList:[],
            headList:[{"name":"checkbox","width":"42px","id":"checkbox","disabled":true,"value":"checkbox"},{"name":"序号","width":"38px","id":"order","disabled":true,"value":"order"},{"id":"segmentTaskName",hasArrow:true,"businessEntity":"bim5d_weekly_plan_item","name":"名称","dataType":0,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":1,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"segmentTaskName","disabled":true,"width":"360px"},{"id":"offsetTime","businessEntity":"bim5d_weekly_plan_item","name":"偏差天数","dataType":1,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":2,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"offsetTime","width":"75px"},{"id":"dep","businessEntity":"bim5d_weekly_plan_item","name":"前置任务","dataType":0,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":3,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"dep","width":"75px"},{"id":"costDay","businessEntity":"bim5d_weekly_plan_item","name":"计划工期","dataType":2,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":4,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"costDay","width":"75px"},{"id":"planStartTime","businessEntity":"bim5d_weekly_plan_item","name":"计划开始","dataType":2,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":5,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"planStartTime","width":"120px"},{"id":"planFinishTime","businessEntity":"bim5d_weekly_plan_item","name":"计划完成","dataType":2,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":6,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"planFinishTime","width":"120px"},{"id":"creatorName","businessEntity":"bim5d_weekly_plan_item","name":"创建人","dataType":0,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":7,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"creatorName","width":"75px"},{"id":"responsibleName","businessEntity":"bim5d_weekly_plan_item","name":"责任人","dataType":0,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":8,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"responsibleName","width":"75px"},{"id":"participantNames","businessEntity":"bim5d_weekly_plan_item","name":"参与人","dataType":0,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":9,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"participantNames","width":"75px"},{"id":"subcontractorName","businessEntity":"bim5d_weekly_plan_item","name":"分包单位","dataType":0,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":10,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"subcontractorName","width":"90px"},{"id":"realDay","businessEntity":"bim5d_weekly_plan_item","name":"实际工期","dataType":1,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":11,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"realDay","width":"90px"},{"id":"realStartTime","businessEntity":"bim5d_weekly_plan_item","name":"实际开始","dataType":2,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":12,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"realStartTime","width":"120px"},{"id":"realFinishTime","businessEntity":"bim5d_weekly_plan_item","name":"实际完成","dataType":2,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":13,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"realFinishTime","width":"120px"},{"id":"remark","businessEntity":"bim5d_weekly_plan_item","name":"备注","dataType":0,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":14,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"remark","width":"75px"},{"id":"gantt","businessEntity":"bim5d_weekly_plan_item","name":"横道图","dataType":0,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":15,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"gantt","width":"350px"},{"id":"230012342029729792","businessEntity":"bim5d_weekly_plan_item","name":"文本","dataType":0,"isSystem":0,"isRequired":0,"defaultValue":null,"orderNo":16,"isMobileKeep":0,"isDelete":0,"createTime":1556073784000,"createUserId":"235830039351296","dynamicEnumColumnOptionList":[],"value":"230012342029729792","width":"120px"},{"id":"245366507648499712","businessEntity":"bim5d_weekly_plan_item","name":"新增字段","dataType":0,"isSystem":0,"isRequired":0,"defaultValue":null,"orderNo":21,"isMobileKeep":1,"isDelete":0,"createTime":1559734502000,"createUserId":"235830039351296","dynamicEnumColumnOptionList":[],"value":"245366507648499712","width":"120px"},{"id":"245366510697758720","businessEntity":"bim5d_weekly_plan_item","name":"新增字段","dataType":0,"isSystem":0,"isRequired":0,"defaultValue":null,"orderNo":22,"isMobileKeep":1,"isDelete":0,"createTime":1559734503000,"createUserId":"235830039351296","dynamicEnumColumnOptionList":[],"value":"245366510697758720","width":"120px"},{"id":"245366512505503744","businessEntity":"bim5d_weekly_plan_item","name":"新增字段","dataType":0,"isSystem":0,"isRequired":0,"defaultValue":null,"orderNo":23,"isMobileKeep":1,"isDelete":0,"createTime":1559734503000,"createUserId":"235830039351296","dynamicEnumColumnOptionList":[],"value":"245366512505503744","width":"120px"},{"id":"245366514745262080","businessEntity":"bim5d_weekly_plan_item","name":"新增字段","dataType":0,"isSystem":0,"isRequired":0,"defaultValue":null,"orderNo":24,"isMobileKeep":1,"isDelete":0,"createTime":1559734504000,"createUserId":"235830039351296","dynamicEnumColumnOptionList":[],"value":"245366514745262080","width":"120px"}],
        }
    },
    created(){
        this.btnClick(1)
    },
    methods:{
        btnClick(type){
            let _params = {key:'subcontractorId',valueKey:'subcontractorName',nullValue:'未指定单位'};
            let _return = this.dealTaskData(this.bodyList,type == 1 ? _params : {});
            this.bakList = _return.bakList;
            this.demoList = _return.list;
            this.orderMap = _return.orderMap;
        },
        dealTaskData(arr,params){
            let _mark = 0,
                _orderMap = {},
                _arr = [],
                _return = {},
                _bakList = [];
            if(params && params.key){
                _arr = this.dealGroupByKey({arr:arr,...params});
                _bakList = [..._arr];
                _arr.forEach(ele => {
                    _mark++;
                    ele.order = _mark;
                    _return = this.dealGroupByPosition({obj:ele,arr:ele.children,mark:_mark,orderMap:_orderMap})
                    ele.children = _return.list;
                    _mark = _return.mark
                    _bakList = [..._bakList,..._return.bakList]
                })
            } else {
                _return = this.dealGroupByPosition({obj:null,arr:arr,mark:0,orderMap:_orderMap})
                _arr = _return.list
                _bakList = [..._bakList,..._return.bakList]
            }
            arr.forEach(_ele => {
                _ele.dep = _ele.dependentItemId ? _orderMap[_ele.dependentItemId] + _ele.dependentExpression : "";
            });
            return {
                list:_arr,
                orderMap:_orderMap,
                bakList:_bakList
            }
        },
        dealGroupByKey(arg){
            let _arr = [],
                _obj = {},
                _boxArr = [],
                {arr,key,valueKey,nullValue} = arg;
            arr.forEach(ele => {
                if(!ele[key]){
                    if(obj[-2]){
                        _obj[-2].push(ele)
                    } else {
                        _obj[-2] = [ele];
                        _boxArr.push({
                            id:-2,
                            segmentTaskName:nullValue,
                            children:[],
                            isShow:true,
                            isChoosed:false,
                            isClicked:false,
                            layer:1,
                            parentId:null,
                        }); 
                    }
                } else if(_obj[ele[key]]){
                    _obj[ele[key]].push(ele)
                } else {
                    _obj[ele[key]] = [ele];
                    _boxArr.push({
                        id:ele[key],
                        segmentTaskName:ele[valueKey],
                        children:[],
                        isShow:true,
                        isChoosed:false,
                        isClicked:false,
                        layer:1,
                        parentId:null,
                    });
                }
            });
            _boxArr.forEach(ele => {
                ele.children = _obj[ele.id]
            })
            return _boxArr;
        },
        dealGroupByPosition(arg) {
            let {obj,arr,mark,orderMap} = arg,
                _arr = [],//最外层数组
                _obj = {},//造层级用的临时对象
                activeObj = {},//被选中的行
                _orderItemId = [],//前置任务的前置id集合
                _bakList = [];
            arr.forEach(ele => {
                let _dyArr = ele.dynamicColumnValueList || [];
                if (ele.offsetTime) {
                    ele.delayType = ele.offsetTime > 0 ? -1 : 1;
                } else {
                    ele.delayType = 1;
                    ele.offsetTime = "";
                }
                ele.isLast = true;
                ele.isClick = false;
                // ele.isChoosed = false;
                this.$set(ele,'isClick',false)
                this.$set(ele,'isChoosed',false)
                ele.placement = "1";
                // ele.realDay = this.dealRealCostDay(ele);
                ele.participantArr = ele.participantIds || "";
                // ele.planStartFormat = this.$Util.changeDateFormat(ele.planStartTime);
                // ele.planFinishFormat = this.$Util.changeDateFormat(ele.planFinishTime);
                // ele.realStartFormat = this.$Util.changeDateFormat(ele.realStartTime);
                // ele.realFinishFormat = this.$Util.changeDateFormat(ele.realFinishTime);
                // _dyArr.forEach(info => {
                //     let _value = info.columnValue;
                //     if(info.dataType == 2){
                //         _value = this.$Util.changeDateFormat(parseFloat(_value),"-","","minutes");
                //     } else if (info.dataType == 3){
                //         _value = _value == 'true' ? "是" : "否";
                //     }
                //     ele[info.dynamicColumnId] = _value;
                // })
                //如果为null代表属于手动添加的任务
                if (ele.segmentTaskId == null) {
                    if (ele.positionId == null || ele.positionId == "") {
                        //该类型属于无部位任务
                        ele.segmentId = -1;
                        ele.parentId = -1;
                    } else {
                        //该类型属于手动添加但有部位的任务
                        ele.parentId = ele.positionId;
                        ele.segmentId = ele.positionId;
                        ele.segmentName = ele.positionName;
                    }
                } else {
                    ele.parentId = ele.segmentId;
                }
                if (!_obj[ele.segmentId]) {
                    mark++;
                    _obj[ele.segmentId] = {
                        id:ele.segmentId,
                        parentId:obj ? obj.parentId : null,
                        order:mark,
                        segmentType:ele.segmentId,
                        segmentTaskName:ele.segmentId == -1 ? "无部位" : ele.segmentName,
                        children:[],
                        isShow:true,
                        isChoosed:false,
                        isClicked:false,
                        layer:obj ? obj.layer + 1 : 1
                    };
                    _orderItemId.push(_obj.id);
                    _arr.push(_obj[ele.segmentId]);
                    _bakList.push(_obj[ele.segmentId]);
                }
                mark++;
                ele.order = mark;
                orderMap[ele.itemId] = mark;
                _orderItemId.push(ele.itemId);
                ele.layer = _obj[ele.segmentId].layer + 1;
                _obj[ele.segmentId].children.push(ele);
                _bakList.push(ele);
            });
                console.log('_arr',_arr);
            return {
                list:_arr,
                mark:mark,
                bakList:_bakList
            }
        },
    }
}
</script>

<style>

</style>
