/*
 * @Name: 周计划-流水段树形表格组件
 * @Author: 李荣男
 * @Date: 2018年3月9日 15:18:26
 * @Last Modified by: 李荣男
 */
<template>
    <div class="tree_wrap">
        <div class="head_wrap" :style="{right:scrollWidth + 'px'}">
            <div class="table_wrap" :style="{width:computedWidth + 'px'}">
                <template v-for="(ele,index) in headData">
                <span class="head_th checkbox" v-if="ele.value == 'checkbox'" :style="{width:width[index]+'px'}">
                    <i class="check_box iconfont" @click.stop="checkboxFunc(ele)">{{!allIsClick ? "&#xe63c" : "&#xe637"}}</i>
                </span>
                <span class="head_th" v-else :style="{width:width[index]+'px'}">{{ele.name}}</span>
                </template>
            </div>
        </div>
        <div class="body_wrap" v-if="treeData.length > 0" @scroll="scrollFunc">
            <div class="table_wrap" :style="{width:computedWidth + 'px'}">
                <TreeElement :treeData = "treeData" :order="order" :pIdName="pIdName" :treeLayer = "0" @getLiClick="getLiClick" @getChooseBox="getChooseBox" :tableWidth="tableWidth" :headData="headData"></TreeElement>
            </div>
        </div>
        <span class="tips" v-else>暂无数据</span>
    </div>
</template>

<script>
import TreeElement from "./TreeElement"
export default {
  name: "TreeTable",
  components: {
      TreeElement
  },
  props: {
      allShow:{
          type:Boolean,
          default:true
      },
      pIdName:{
          type:String,
          default:'pId'
      },
    headData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    bodyData: {
      type: Array,
      default: function() {
        return [];
      }
    },
  },
  components:{
      TreeElement
  },
  data() {
    return {
      isClickedId:"",
      tableWidth:0,
      scrollWidth: 20, //滚动条宽度
      allIsClick:false,
      detailTimes:0
    };
  },
  methods: {
      resize(){
          this.tableWidth = this.$el.querySelectorAll(".head_wrap")[0].clientWidth
      },
      scrollFunc(){
          this.$el.querySelectorAll(".head_wrap")[0].scrollLeft = this.$el.querySelectorAll(".body_wrap")[0].scrollLeft
      },
      checkboxFunc(){
          this.allIsClick = !this.allIsClick
          this.bodyData.forEach(ele => {
              this.$set(ele,"isChoosed",this.allIsClick)
              this.$set(ele,"halfChoosed",this.allIsClick)
          })
          this.$emit("getChooseBox",this.allIsClick ? this.bodyData : [])
      },
      getChooseBox(ids){
          let _arr = this.bodyData.filter(ele => ele.isChoosed)
          this.allIsClick = _arr.length == this.bodyData.length
          this.$emit("getChooseBox",_arr)
      },
    getLiClick(info){
        this.isClickedId = info.id
        this.treeData.forEach((ele) => {
            ele.isClicked = ele.id == info.id ? true : false
            !ele.childNode ? "" : this.findChildisClicked(ele.childNode,info.id)
        })
        this.$emit("getClicked",info)
    },
    findChildisClicked(child,id){
        child.forEach((_ele) => {
            _ele.isClicked = _ele.id == id ? true : false
            !_ele.childNode ? "" : this.findChildisClicked(_ele.childNode,id)
        })
    },
    //数据重建方法
    reBuildData(arr,type) {
        var newArr = [],
            _pid = this.pIdName;
        arr.forEach((ele, index) => {
            this.detailTimes != 0 ? "" : this.$set(ele,"isShow",this.allShow ? true : false)
            this.$set(ele,"isClicked",this.isClicked == ele.id ? true : false)
            if (ele[_pid] == null || ele[_pid] == "") {
                this.detailTimes != 0 ? "" : this.$set(ele,"halfChoosed",false)
                this.$set(ele, "childNode", this.checkChildNode(ele.id, arr));
                newArr.push(ele)
            }
        }, this)
        this.detailTimes ++
        return newArr
    },
    //找出一个id下的所有子节点的方法 ，用于在递归遍历中
    checkChildNode(cId, arr) {
        let currentArr = [],
            _pid = this.pIdName;
        arr.forEach(function(element, index) {
            if (element[_pid] == cId) {
                this.$set(element, "childNode", this.checkChildNode(element.id,arr))
                element.childNode.length == 0 ? element.childNode = null : ""
                currentArr.push(element)
            }
        }, this);
        return currentArr;
    },
    getScrollBarSize() {
        let cached = 0
        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.style.height = '200px';

        const outer = document.createElement('div');
        const outerStyle = outer.style;

        outerStyle.position = 'absolute';
        outerStyle.top = 0;
        outerStyle.left = 0;
        outerStyle.pointerEvents = 'none';
        outerStyle.visibility = 'hidden';
        outerStyle.width = '200px';
        outerStyle.height = '150px';
        outerStyle.overflow = 'hidden';

        outer.appendChild(inner);

        document.body.appendChild(outer);

        const widthContained = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        let widthScroll = inner.offsetWidth;

        if (widthContained === widthScroll) {
            widthScroll = outer.clientWidth;
        }

        document.body.removeChild(outer);

        cached = widthContained - widthScroll;
    return cached;
}
  },
  computed:{
      width(){
          let _tableWidth = this.tableWidth
          if(!this.$el) return []
          let _arr = this.headData.map(ele => {
              if(ele.width){
                  let _width = ele.width
                  if(ele.width.toString().indexOf("px") > 1){
                      _width = ele.width.split("px")[0]
                  } else if(ele.width.toString().indexOf("%") > 1){
                      _width = parseFloat(ele.width.split("%")[0]) / 100 * _tableWidth
                  }
                  return parseFloat(_width)
              } else {
                  return 0
              }
          })
          return _arr 
      },
      computedWidth(){
          let _width = 0
          this.width.forEach(ele => {
              _width += ele
          })
          return _width
      },
      order(){
          return this.headData.map(ele => ele.value)
      },
      treeData(){
          let _arr = this.bodyData
          return this.reBuildData(_arr)
      },
  },
  mounted(){
    this.resize();
    window.addEventListener("resize", this.resize, false);
    this.scrollWidth = this.getScrollBarSize()
  }
};
</script>

<style lang="less">
.tree_wrap {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
    border: 1px solid #ddd;
      background-color: #eee;
      .iconfont{
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
      }
  .head_wrap {
        position: absolute;
        box-sizing: border-box;
        top:0;
        left:0;
        right:0;
        border-bottom:1px solid #ddd;
        overflow: hidden;
        border-collapse: collapse;
    .head_th {
      box-sizing: border-box;
      display: block;
      float: left;
      border-left: 1px solid #ddd;
      height: 40px;
      line-height: 40px;
      font-weight: 900;
      text-align: center;
      background-color: #eee;
      &:first-child {
        border-left: none;
      }
      &.checkbox{
          font-weight: 100;
          cursor: pointer;
      }
    }
  }
.body_wrap {
    position: absolute;
    box-sizing: border-box;
    top:41px;
    bottom:0;
    width: 100%;
    // border-right: 1px solid #ddd;
    // overflow-x: hidden;
    overflow-y: scroll;
    background-color: #fff;
    .table_wrap{
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
    }
}
.tips{
    display: block;
    width: 100%;
    height: 20px;
    border: 1px solid #ddd;
    line-height: 20px;
    text-align: center;
}
}
</style>
