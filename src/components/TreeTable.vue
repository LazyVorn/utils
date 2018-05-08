/*
 * @Name: 周计划-流水段树形表格组件
 * @Author: 李荣男
 * @Date: 2018年3月9日 15:18:26
 * @Last Modified by: 李荣男
 */
<template>
    <div class="tree_wrap">
        <div class="head_wrap">
            <span class="head_th" v-for="(ele,index) in headData" :style="{width:width[index]+'px'}" :key="ele.value">{{ele.name}}</span>
            <span class="head_th" style="width:20px;float:right;"></span>
        </div>
        <div class="body_wrap" v-if="treeData.length > 0">
            <TreeElement :treeData = "treeData" :order="order" :width="width"></TreeElement>
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
      choose: {},
      isClickedId:"",
      tableWidth:0
    };
  },
  methods: {
      resize(){
          this.tableWidth = this.$el.clientWidth
      },
    getisClicked(id){
        this.isClickedId = id
        this.treeData.forEach((ele) => {
            ele.isClicked = ele.id == id ? true : false
            !ele.childNode ? "" : this.findChildisClicked(ele.childNode,id)
        })
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
            this.$set(ele,"isClicked",this.isClicked == ele.id ? true : false)
            if (ele[_pid] == null || ele[_pid] == "") {
                this.$set(ele,"isShow",this.allShow ? true : false)
                this.$set(ele, "childNode", this.checkChildNode(ele.id, arr));
                newArr.push(ele)
            }
        }, this)
        return newArr
    },
    //找出一个id下的所有子节点的方法 ，用于在递归遍历中
    checkChildNode(cId, arr) {
        let currentArr = [],
            _pid = this.pIdName;
        arr.forEach(function(element, index) {
            if (element[_pid] == cId) {
                element.type == "工作项" ? this.$set(element,"wbsType",type) : ""
                this.$set(element, "childNode", this.checkChildNode(element.id,arr))
                element.childNode.length == 0 ? element.childNode = null : ""
                currentArr.push(element)
            }
        }, this);
        return currentArr;
    },
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
          _arr[_arr.length - 1] -= 20
          return _arr 
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
  .head_wrap {
        box-sizing: border-box;
        width: 100%;
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
    }
  }
.body_wrap {
    position: absolute;
    top:40px;
    bottom:0;
    width: 100%;
    border: 1px solid #ddd;
    overflow-x: hidden;
    overflow-y: scroll;
    background-color: #fff;
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
