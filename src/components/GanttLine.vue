<template>
    <div class="gantt_line_wrap">
        <template v-if="days < maxDays">
            <p v-for="(ele,index) in days" :key="index" :style="{width:1/days * 100 + '%'}"></p>
            <div class="plan_line" :title="planTitle" :style="{width:planSlot.width,left:planSlot.left}"></div>
            <div class="real_line" :class="noFinish ? '' : 'active'" :title="realTitle" :style="{width:realSlot.width,left:realSlot.left,backgroundImage:noFinish?`url(${imgSrc})` : ''}"></div>
        </template>
        <template v-else>
            <h1>提示:日期超出,当前展示最大值为{{maxDays}}日</h1>
        </template>
    </div>
</template>

<script>
import img from "../assets/gantt_line.png"
export default {
    name:"GanttLine",
    props:{
        timeSlot:{
            type:Object,
            default(){
                return {}
            }
        },
        planTimeSlot:{
            type:Object,
            default(){
                return {}
            }
        },
        realTimeSlot:{
            type:Object,
            default(){
                return {}
            }
        },
        maxDays:{
            type:Number,
            default:14
        }
    },
    data(){
        return {
            imgSrc: img,
            planStart:Date.now(),
            planEnd:Date.now(),
            planSlot:{},
            realStart:Date.now(),
            realEnd:Date.now(),
            realSlot:{},
            noFinish:false
            
        }
    },
    created () {
        this.dealDate()
    },
    computed: {
        planTitle(){
            if(!this.planTimeSlot.start && !this.planTimeSlot.end) return ''
            let _start = this.changeDateFormat(this.planTimeSlot.start),
                _end = this.planTimeSlot.end ? this.changeDateFormat(this.planTimeSlot.end) : ''
            return `计划开始:${_start},计划完成:${_end}`
        },
        realTitle(){
            if(!this.realTimeSlot.start && !this.realTimeSlot.end) return ''
            let _start = this.changeDateFormat(this.realTimeSlot.start),
                _end = this.realTimeSlot.end ? this.changeDateFormat(this.realTimeSlot.end) : ''
            return `实际开始:${_start},实际完成:${_end}`
        },
        days(){
            return ((this.changeDate(this.timeSlot.end) - this.changeDate(this.timeSlot.start)) / (1000 * 3600 * 24)) + 1;
        },
        dateArr(){
            let _arr = [],
                _mark = this.changeDate(this.timeSlot.start).getTime(),
                _endTime = this.changeDate(this.timeSlot.end).getTime();
            while(_mark <= _endTime){
                _arr.push(_mark);
                _mark += 3600 * 24 * 1000;
            } 
            return _arr;
        }
    },
    methods: {
        dealDate(){
            if(this.days <= this.maxDays){
                this.planStart = this.planTimeSlot.start;
                this.planEnd = this.planTimeSlot.end;
                this.planSlot = this.compareDate(this.planStart,this.planEnd);
                if(this.realTimeSlot.start && this.realTimeSlot.end) {
                    this.realStart = this.realTimeSlot.start;
                    this.realEnd = this.realTimeSlot.end;
                    this.realSlot = this.compareDate(this.realStart,this.realEnd);
                    this.noFinish = false;
                } else if(this.realTimeSlot.start){
                    this.realStart = this.realTimeSlot.start;
                    this.realEnd = Date.now();
                    this.realSlot = this.compareDate(this.realStart,this.realEnd);
                    this.noFinish = true;
                } else {
                    this.realSlot = new Array(this.days).fill("");
                }
            }
        },
        changeDateFormat(date,sign,type){
            if(!date || date == "null" || date == "") return ""
            sign ? "" : sign = "-"
            date = typeof date != 'object' ? new Date(date) : date
            let year = date.getFullYear(),
                month = parseInt(date.getMonth() + 1) > 9 ? date.getMonth() + 1 : "0" + "" + (date.getMonth() + 1),
                day = parseInt(date.getDate()) > 9 ? date.getDate() : "0" + "" + date.getDate();
            if(type == 'number'){
                return parseInt(`${year}${month}${day}`)
            } else {
                return `${year}${sign}${month}${sign}${day}`
            }
        },
        changeDate(time){
            let date = typeof time != "object" ? new Date(time) : time;
            return new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0,0);
        },
        compareDate(startTime,endTime){
            let _obj = {arr:[],start:-1,end:-1},
                _len = this.dateArr.length,
                start = this.changeDate(startTime),
                end = this.changeDate(endTime);
            this.dateArr.forEach((ele,index) => {
               _obj.arr.push(ele >= start.getTime() && ele <= end.getTime() ? ele : "");
               ele >= start.getTime() && _obj.start == -1 ? _obj.start = index : "";
               ele > end.getTime() && _obj.end == -1 ? _obj.end = index : "";
            })
            _obj.start != -1 && _obj.end == -1 ? _obj.end = _len : "";
            _obj.width = (_obj.end - _obj.start)/_len * 100 + "%";
            _obj.left = _obj.start/_len * 100 + "%";
            if(new Date(startTime).getHours() >= 12 && _obj.start != -1){
                _obj.left = (_obj.start + 0.5)/_len * 100 + "%";
                if(new Date(endTime).getHours() < 12 && _obj.end != -1){
                    _obj.width = (_obj.end - _obj.start - 1)/_len * 100 + "%";
                } else {
                    _obj.width = (_obj.end - _obj.start - 0.5)/_len * 100 + "%";
                }
            } else if(new Date(endTime).getHours() < 12 && _obj.end != -1){
                _obj.width = (_obj.end - _obj.start - 0.5)/_len * 100 + "%";
            }
            return _obj;
        }
    },
    watch:{
        timeSlot:{
    　　　　handler(newValue, oldValue) {
                this.dealDate()
    　　　　},
    　　　　deep: true
        },
        realTimeSlot:{
    　　　　handler(newValue, oldValue) {
                this.dealDate()
    　　　　},
    　　　　deep: true
        },
        maxDays:{
    　　　　handler(newValue, oldValue) {
                this.dealDate()
    　　　　},
    　　　　deep: true
        },
        planTimeSlot:{
    　　　　handler(newValue, oldValue) {
                this.dealDate()
    　　　　},
    　　　　deep: true
        },
    }
}
</script>

<style lang="less">
    .gantt_line_wrap{
        box-sizing: border-box;
        position: relative;
        width: 100%;
        // border: 1px solid #dddee1;
        height: 100%;
        overflow: hidden;
        // background-color: #eee;
        p{
            float: left;
            position: relative;
            box-sizing: border-box;
            height: 100%;
            border-right:1px solid #c3e0f5;
        }
        .plan_line{
            position: absolute;
            box-sizing: border-box;
            height: 10px;
            top:8px;
            border-radius: 0 6px 6px 0;
            background-color: #3999ff;
        }
        .real_line{
            position: absolute;
            box-sizing: border-box;
            height: 10px;
            bottom:8px;
            border-radius: 0 6px 6px 0;
            &.active{
                background-color: #ffc200;
            }
        }
        h1{
            width: 100%;
            height: 100%;
            line-height: 40px;
            font-size: 12px;
            color:#666;
            text-align: center
        }
    }
</style>
