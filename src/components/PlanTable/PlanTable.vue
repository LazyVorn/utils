<template>
    <div class="plan_table_wrap">
        <table-head :data="headData" :totalWidth="totalWidth" :allChoosed="allChoosed" @getAllChoosed="getAllChoosed"></table-head>
        <table-body v-if="bodyData.length > 0" :data="bodyData" :totalWidth="totalWidth" :headArr="headData" @getChoosed="getChoosed"></table-body>
        <div class="table_layer"  v-if="bodyData.length == 0">
            <span>暂无数据</span>
        </div>
    </div>
</template>

<script>
import TableHead from './TableHead'
import TableBody from './TableBody'
export default {
    name:"PlanTable",
    props:{
        headData:{
            type:Array,
            default(){
                return []
            }
        },
        bodyData:{
            type:Array,
            default(){
                return []
            }
        },
        bakData:{
            type:Array,
            default(){
                return []
            }
        }
    },
    components: {
        TableHead,
        TableBody
    },
    data () {
        return {
            headList:[{"name":"序号","width":"38px","id":"order","disabled":true,"value":"order"},{"id":"segmentTaskName","businessEntity":"bim5d_weekly_plan_item","name":"名称","dataType":0,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":1,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"segmentTaskName","disabled":true,"width":"360px"},{"id":"offsetTime","businessEntity":"bim5d_weekly_plan_item","name":"偏差天数","dataType":1,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":2,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"offsetTime","width":"75px"},{"id":"dep","businessEntity":"bim5d_weekly_plan_item","name":"前置任务","dataType":0,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":3,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"dep","width":"75px"},{"id":"costDay","businessEntity":"bim5d_weekly_plan_item","name":"计划工期","dataType":2,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":4,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"costDay","width":"75px"},{"id":"planStartTime","businessEntity":"bim5d_weekly_plan_item","name":"计划开始","dataType":2,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":5,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"planStartTime","width":"120px"},{"id":"planFinishTime","businessEntity":"bim5d_weekly_plan_item","name":"计划完成","dataType":2,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":6,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"planFinishTime","width":"120px"},{"id":"creatorName","businessEntity":"bim5d_weekly_plan_item","name":"创建人","dataType":0,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":7,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"creatorName","width":"75px"},{"id":"responsibleName","businessEntity":"bim5d_weekly_plan_item","name":"责任人","dataType":0,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":8,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"responsibleName","width":"75px"},{"id":"participantNames","businessEntity":"bim5d_weekly_plan_item","name":"参与人","dataType":0,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":9,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"participantNames","width":"75px"},{"id":"subcontractorName","businessEntity":"bim5d_weekly_plan_item","name":"分包单位","dataType":0,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":10,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"subcontractorName","width":"90px"},{"id":"realDay","businessEntity":"bim5d_weekly_plan_item","name":"实际工期","dataType":1,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":11,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"realDay","width":"90px"},{"id":"realStartTime","businessEntity":"bim5d_weekly_plan_item","name":"实际开始","dataType":2,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":12,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"realStartTime","width":"120px"},{"id":"realFinishTime","businessEntity":"bim5d_weekly_plan_item","name":"实际完成","dataType":2,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":13,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"realFinishTime","width":"120px"},{"id":"remark","businessEntity":"bim5d_weekly_plan_item","name":"备注","dataType":0,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":14,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"remark","width":"75px"},{"id":"gantt","businessEntity":"bim5d_weekly_plan_item","name":"横道图","dataType":0,"isSystem":1,"isRequired":0,"defaultValue":null,"orderNo":15,"isMobileKeep":0,"isDelete":0,"createTime":null,"createUserId":null,"dynamicEnumColumnOptionList":[],"value":"gantt","width":"350px"},{"id":"230012342029729792","businessEntity":"bim5d_weekly_plan_item","name":"文本","dataType":0,"isSystem":0,"isRequired":0,"defaultValue":null,"orderNo":16,"isMobileKeep":0,"isDelete":0,"createTime":1556073784000,"createUserId":"235830039351296","dynamicEnumColumnOptionList":[],"value":"230012342029729792","width":"120px"},{"id":"245366507648499712","businessEntity":"bim5d_weekly_plan_item","name":"新增字段","dataType":0,"isSystem":0,"isRequired":0,"defaultValue":null,"orderNo":21,"isMobileKeep":1,"isDelete":0,"createTime":1559734502000,"createUserId":"235830039351296","dynamicEnumColumnOptionList":[],"value":"245366507648499712","width":"120px"},{"id":"245366510697758720","businessEntity":"bim5d_weekly_plan_item","name":"新增字段","dataType":0,"isSystem":0,"isRequired":0,"defaultValue":null,"orderNo":22,"isMobileKeep":1,"isDelete":0,"createTime":1559734503000,"createUserId":"235830039351296","dynamicEnumColumnOptionList":[],"value":"245366510697758720","width":"120px"},{"id":"245366512505503744","businessEntity":"bim5d_weekly_plan_item","name":"新增字段","dataType":0,"isSystem":0,"isRequired":0,"defaultValue":null,"orderNo":23,"isMobileKeep":1,"isDelete":0,"createTime":1559734503000,"createUserId":"235830039351296","dynamicEnumColumnOptionList":[],"value":"245366512505503744","width":"120px"},{"id":"245366514745262080","businessEntity":"bim5d_weekly_plan_item","name":"新增字段","dataType":0,"isSystem":0,"isRequired":0,"defaultValue":null,"orderNo":24,"isMobileKeep":1,"isDelete":0,"createTime":1559734504000,"createUserId":"235830039351296","dynamicEnumColumnOptionList":[],"value":"245366514745262080","width":"120px"}],
            totalWidth:"",
            allChoosed:false,
        }
    },
    methods: {
      getTotalWidth(arr){
          let _arr = arr.map(ele => parseFloat(ele.width) || 0);
          return parseFloat(_arr.reduce((pre,cur) => pre + cur) + 18) + 'px';
      },
      getAllChoosed(){
          this.allChoosed = !this.allChoosed;
          this.bakData.forEach(ele => ele.isChoosed = this.allChoosed);
      },
      getChoosed(){
          let _arr = this.bakData.filter(ele => ele.isChoosed);
          if(_arr.length == this.bakData.length) {
              this.allChoosed = true;
          } else {
              this.allChoosed = false;
          }
          this.$emit('getChoosed',_arr)
      }  
    },
    created(){
        this.totalWidth = this.getTotalWidth(this.headList);
    }
}
</script>

<style lang="less">
    .plan_table_wrap{
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        font-size: 14px;
        overflow: auto;
        border-left: 1px solid #c3e0f5;
        border-right: 1px solid #c3e0f5;
        table{
            border-collapse: collapse;
            table-layout: fixed;
        }
        .table_layer{
            position: absolute;
            display: flex;
            width: 100%;
            top: 76px;
            left: 0;
            bottom:0;
            cursor: default;
            align-items: Center;
            justify-content: center;
            background-color: #ffffff;
        }
    }
</style>
