<template>
    <div class="date_input_wrap">
      <template v-if="isEditing">
          <i class="date_btn date_input_up_btn" :class="dateType == 'up' ? 'active' : ''" @click.stop="dateBtnClick(-1)">上午</i>
          <i class="date_btn date_input_down_btn" :class="dateType == 'down' ? 'active' : ''" @click.stop="dateBtnClick(1)">下午</i>
        <input type="number" @keyup.enter="enterFunc" @blur="checkValue" v-model.trim="value" maxlength="8" onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'>
      </template>
      <template v-else>
        <template v-if="date">
          <i v-if="dateType == 'up'" class="date_type up_type">上午</i>
          <i v-if="dateType == 'down'" class="date_type down_type">下午</i>
        </template>
        <p :title="showDate">{{showDate}}</p>
      </template>
       
    </div>
</template>

<script>
export default {
  name: "DateInput",
  props: {
    //传入日期
    date: {
      type: Number,
      default: Date.now()
    },
    //比较用的日期,和type搭配
    compareTime: {
      type: Number,
      default: 0
    },
    //当前日历为起始日历,或是截止日历
    type: {
      type: String,
      default: ""
    },
    //是否处于编辑模式
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //日期无"-"版,number型,如20180202
      value: 0,
      //当前年份,用于填满用户的日期缩写
      year: 1970,
      dateType:'up'
    };
  },
  methods: {
    //点击回车触发失焦事件
    enterFunc() {
      this.$el.getElementsByTagName("input")[0].blur();
    },
    //失焦事件,根据输入长度处理数据
    checkValue() {
      if(this.$Util.changeDate(this.showDate) == this.$Util.changeDate(this.date) || this.value == ""){
          // if(this.$el.getElementsByTagName("input")[0]){
          //   this.$el.getElementsByTagName("input")[0].focus();
          //   this.$el.getElementsByTagName("input")[0].select();
          // }
        return
      };
      let _date = this.value.toString(),
        _time = this.date,
        _len = _date.length;
      if (_len == 4) {
        _time = `${this.year}-${_date.slice(0, 2)}-${_date.slice(2, 4)}`;
      } else if (_len == 6) {
        _time = `20${_date.slice(0, 2)}-${_date.slice(2, 4)}-${_date.slice(
          4,
          6
        )}`;
      } else if (_len == 8) {
        _time = `${_date.slice(0, 4)}-${_date.slice(4, 6)}-${_date.slice(
          6,
          8
        )}`;
      }
      this.emitValue(this.checkDate(_time) ? _time : this.date);
    },
    //传出新日期,如日期没改变则不传
    emitValue(_date) {
      // if(!this.date || this.date == "") {
      //   this.value = "";
      //   return;
      // }
      if(this.$Util.changeDate(_date) == 0){
        this.value = "";
        return;
      }
      this.value = parseInt(this.$Util.changeDateFormat(_date, "", "number"));
      if (this.$Util.changeDate(_date) == this.date) {
        if (this.$el.getElementsByTagName("input")[0]) {
          this.$el.getElementsByTagName("input")[0].focus();
          this.$el.getElementsByTagName("input")[0].select();
        }
        return;
      }
      this.year = this.value.toString().slice(0, 4);
      this.$emit("change", this.$Util.changeDate(_date) + (this.dateType == 'up' ? 0 : 12 * 3600000));
    },
    //检查日期是否合法,返回布尔值
    checkDate(date) {
      if (
        isNaN(new Date(date).getTime()) ||
        date != this.$Util.changeDateFormat(date)
      ) {
        return false;
      } else if (this.compareTime && this.compareTime != 0 && this.type == "start") {
        // new Date(date).getTime() <= new Date(this.compareTime).getTime()
        //   ? ""
        //   : this.$Message.error("开始时间不得晚于结束时间,已还原");
        // return new Date(date).getTime() <= new Date(this.compareTime).getTime();
        return new Date(date).getTime() > new Date("1970-01-01").getTime();
      } else if (this.compareTime && this.compareTime != 0 && this.type == "finish") {
        new Date(date).getTime() >= new Date(this.compareTime).getTime()
          ? ""
          : this.$Message.error("开始时间不得晚于结束时间,已还原");
        return new Date(date).getTime() >= new Date(this.compareTime).getTime();
      } else {
        return new Date(date).getTime() > new Date("1970-01-01").getTime();
      }
    },
    dateBtnClick(type){
      this.dateType = type == -1 ? 'up' : 'down';
      if(this.value == "") return;
      this.$emit("change", this.$Util.changeDate(this.date) + (this.dateType == 'up' ? 0 : 12 * 3600000));
    },
  },
  created() {
    this.year = new Date(this.date ? this.date : Date.now()).getFullYear();
    if(this.date && this.date != 0){
      this.value = parseInt(this.$Util.changeDateFormat(this.date, "", "number"));
      this.dateType = new Date(this.date).getHours() <= 11 ? 'up' : 'down';
    } else {
      this.value = "";
      this.dateType = "down";
    }
  },
  computed: {
    //展示用的日期,有"-"号
    showDate() {
      let _date = this.value.toString();
      return _date == ""  ? "" : `${_date.slice(0, 4)}-${_date.slice(4, 6)}-${_date.slice(6, 8)}`;
    },
  },
  watch: {
    //如果处于编辑模式,默认得焦并全选input文本
    isEditing() {
      if (this.isEditing && this.$el.getElementsByTagName("input")) {
        this.$nextTick(() => {
          this.$el.getElementsByTagName("input")[0].focus();
          this.$el.getElementsByTagName("input")[0].select();
        });
      }
    },
    date(){
    this.year = new Date(this.date ? this.date : Date.now()).getFullYear();
    if(this.date && this.date != 0){
      this.value = parseInt(this.$Util.changeDateFormat(this.date, "", "number"));
      this.dateType = new Date(this.date).getHours() <= 11 ? 'up' : 'down';
    } else {
      this.value = ""
    }
    }
  }
};
</script>

<style lang="less" scoped>
.date_input_wrap {
  position: relative;
  width: 100%;
  height: 90%;
  .date_btn{
    box-sizing: border-box;
    position: absolute;
    right: 0;
    width: 30px;
    height: 50%;
    cursor: pointer;
    font-style: normal;
    font-size: 12px;
    font-weight: 900;
    text-align: center;
    border: 1px solid #ddd;
    background-color: #fff;
    transition: .3s;
    line-height: initial;
    &.date_input_up_btn{
      top:0;
      border-radius: 0 6px 0 0;
    }
    &.date_input_down_btn{
      bottom: 0;
      border-radius: 0 0 6px 0;
    }
    &.active{
      color: #6a7ab5;
      border:1px solid #6a7ab5;
    }
  }
  .date_type{
    display: block;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50%;
    font-style: normal;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    text-indent: 0;
    cursor: default;
    &.up_type{
      color:sandybrown;
    }
    &.down_type{
      color:cadetblue;
    }
  }
  p {
    width: 100%;
    height: 50%;
    line-height: 18px;
    text-indent:0;
    text-align: center;
    cursor: pointer;
  }
  input {
    width: 100%;
    height: 100%;
    border: 1px solid #ddd;
    border-radius: 6px;
    text-indent: 10px;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    &[type="number"] {
      -moz-appearance: textfield;
    }
    &:focus {
      outline: none;
    }
  }
}
</style>
