<template>
    <div class="select_wrap" :style="{width:width}">
        <div class="select_show_wrap">
            <span class="name" @click.stop="showClick">{{activeName.join(",")}}</span>
            <i class="iconfont show_btn" @click.stop="showClick" :class="[show ? 'active' : '',clearable && activeArr.length != 0 ? 'hide' : '']">&#xe752;</i>
            <i class="iconfont del_btn" v-if="activeArr.length > 0 && clearable" @click.stop="delClick">&#xe60b;</i>
        </div>
        <div class="select_list_wrap" :class="[show ? '' : 'hide',placement == 'top' ? 'top' : 'bottom']" :style="style">
            <template v-if="filterable">
                <input type="text" class="select_input" v-model="select" placeholder="请输入搜索内容">
                <i class="iconfont btn_pic">&#xe68d;</i>
            </template>
            <ul :class="[filterable ? 'active' : '',multiple ? 'multiple' : 'alone']">
                <li v-for="(ele,index) in list" @click.stop="choose(ele)" :class="[isChoosed(ele) ? 'active' : '']">
                    <span class="list_name" :title="ele.name">{{ele.name}}</span>
                    <i class="iconfont" v-show="isChoosed(ele) && multiple">&#xe7ad;</i>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
  name: "LvSelect",
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    filterable: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: "bottom"
    },
    choosed: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: "200px"
    },
    searchKey:{
        type:String,
        default:"pinyinName"
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      over:false,
      list: [],
      activeName: [],
      activeArr: [],
      select: "",
      style: {
        left: 0,
        top: 0
      }
    };
  },
  methods: {
      showClick(){
          this.show ? "" : this.dealOffest()
          this.show = !this.show
      },
    choose(ele) {
      if (this.multiple) {
        if (this.isChoosed(ele)) {
          this.activeArr = this.activeArr.filter(element => element != ele.id);
          this.activeName = this.activeName.filter(
            element => element != ele.name
          );
        } else {
          this.activeArr.push(ele.id);
          this.activeName.push(ele.name);
        }
      } else {
        this.activeArr = [];
        this.activeName = [];
        this.activeArr.push(ele.id);
        this.activeName.push(ele.name);
        this.show = !this.show;
      }
      this.$emit("on-change", this.activeArr.join(","));
    },
    isChoosed(ele) {
      return this.activeArr.some(element => element == ele.id);
    },
    delClick() {
      this.activeArr = [];
      this.activeName = [];
      this.$emit("on-change", "");
      this.$emit("on-close", "");
    },
    bodyClick(event) {
      let _dom = event.target,
        classInfo = "select_list_wrap",
        arrInfo = "select_wrap",
        _mark = 0;
      while (_dom.parentNode && _mark == 0) {
          if(_dom.parentNode.className && this.$el == _dom.parentNode &&
        (_dom.parentNode.className.indexOf(classInfo) >= 0 || _dom.parentNode.className.indexOf(arrInfo) >= 0)){
            _mark = 1
          } else {
              _dom = _dom.parentNode
          }
      }
      if (_mark == 1) return;
        this.show = false;
        this.readyClose()
    },
    scrollFunc(event){
        if(!this.show) return
        setTimeout(() => {
            this.dealOffest()
        }, 200);
    },
    readyClose(){
        if(this.activeArr.join(",") != this.choosed){
            this.$emit("on-close", this.activeArr.join(","));
        }
    },
    dealOffest() {
      let _top = 0,
        _left = 0,
        _dom = this.$el;
      while (_dom) {
        _top += _dom.offsetTop;
        _dom.scrollTop != 0 ? _top = _top - _dom.scrollTop : ""
        _left += _dom.offsetLeft;
        _dom = _dom.offsetParent ? _dom.offsetParent : null;
      }
      this.style.top = this.placement == "top" ? _top - 202 + "px" : _top + 36 + "px";
      this.style.left = _left + "px";
      this.style.width = this.$el.clientWidth + 2 + "px";
    }
  },
  watch: {
    show(newVal,oldVal) {
      if (newVal) {
          if(this.filterable){
              this.$el.querySelectorAll("input")[0].select()
          }
        document.body.addEventListener("click", this.bodyClick, true);
      } else {
        document.body.removeEventListener("click", this.bodyClick, true);
        document.body.removeEventListener("wheel", this.scrollFunc, false);
        this.readyClose()
      }
    },
    data() {
      this.list = this.data;
    },
    select() {
      let _str = this.select;
      if (_str.trim() == "") {
        this.list = this.data;
      } else {
          this.list = this.data.filter(
            ele => ele[this.searchKey].indexOf(_str.toLowerCase()) >= 0 || ele.name.indexOf(_str) >= 0
          );
        // this.list = this.data.filter(ele => ele.name.indexOf(_str) >= 0);
      }
    },
    choosed() {
      let str = this.choosed + ",";
      this.activeArr = [];
      this.activeName = [];
      this.data.forEach(ele => {
        if (str.indexOf(ele.id) >= 0) {
          this.activeArr.push(ele.id);
          this.activeName.push(ele.name);
        }
      });
    },
  },
  created() {
    this.list = this.data;
    document.body.addEventListener("wheel", this.scrollFunc, false);
  },
  mounted() {
    this.$nextTick(() => {
      this.dealOffest();
      let str = this.choosed + ",";
      this.activeArr = [];
      this.activeName = [];
      this.data.forEach(ele => {
        if (str.indexOf(ele.id) >= 0) {
          this.activeArr.push(ele.id);
          this.activeName.push(ele.name);
        }
      });
    });
  },
  beforeDestroy () {
        document.body.removeEventListener("wheel", this.scrollFunc, false);
  }
};
</script>


<style lang="less" scoped>
.select_wrap {
  position: relative;
  box-sizing: border-box;
  width: 200px;
  height: 32px;
  background-color: #fff;
  border: 1px solid #dddee1;
  border-radius: 6px;
  .iconfont {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .select_show_wrap {
    position: relative;
    width: 100%;
    height: 100%;
    cursor: default;
    &:hover{
        .del_btn{
            display:block;
        }
        .hide{
            display:none;
        }
    }
    .name {
      display: inline-block;
      width: 100%;
      height: 100%;
      line-height: 32px;
      text-align: left;
      color: #495060;
      font-size: 12px;
      text-indent: 6px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .iconfont {
      position: absolute;
      display: block;
      font-size: 14px;
      height: 100%;
      width: 14px;
      right: 6px;
      color: #999;
      cursor: pointer;
      transition: 0.3s;
      &:hover {
        color: #bbb;
      }
    }
    .show_btn {
      top: 0;
      line-height: 32px;
      transition: 0.2s;
      &.active {
        transform: rotate(180deg);
      }
    }
    .del_btn {
      top: 50%;
      font-size: 16px;
      margin-top: -6px;
      height: 16px;
      line-height: 16px;
      display: none;
    }
  }
  .select_list_wrap {
    position: fixed;
    height: 200px;
    overflow: hidden;
    // border:1px solid #dddee1;
    // border-radius:0 0 6px 6px;
    background-color: #fff;
    transition: 0.2s;
    z-index: 10;
    &.hide {
      height: 0;
      border-top: none;
      border-bottom: none;
    }
    .select_input {
      box-sizing: border-box;
      width: 94%;
      height: 32px;
      margin: 4px 3%;
      border: 1px solid #dddee1;
      border-radius: 6px;
      color: #aaa;
      font-size: 14px;
      text-indent: 22px;
      line-height: 32px;
      &::placeholder {
        font-size: 12px;
        color: #bbb;
      }
    }
    .btn_pic {
      position: absolute;
      top: 4px;
      left: 10px;
      height: 32px;
      line-height: 32px;
      width: 20px;
      color: #aaa;
    }
    ul {
      position: relative;
      list-style-type: none;
      width: 100%;
      height: 200px;
      overflow: auto;
      font-size: 12px;
      color: #666;
      &.active {
        height: 160px;
      }
      &.alone {
        li.active {
          color: #fff;
          background-color: rgba(45, 140, 240, 0.9);
        }
      }
      &.multiple {
        li.active {
          color: rgb(45, 140, 240);
        }
      }
      li {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 30px;
        padding: 0 6px;
        line-height: 30px;
        cursor: pointer;
        .list_name {
          display: inline-block;
          width: 100%;
          height: 100%;
          line-height: inherit;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .iconfont {
          position: absolute;
          top: 0;
          right: 6px;
          display: block;
          font-size: 14px;
          height: 100%;
          width: 14px;
          color: #666;
          cursor: pointer;
          transition: 0.3s;
          &:hover {
            color: #000;
          }
        }
      }
    }
  }
}
</style>
