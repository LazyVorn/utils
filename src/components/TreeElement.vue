/*
 * @Name: 周计划-流水段树形表格组件
 * @Author: 李荣男
 * @Date: 2018年3月9日 15:18:26
 * @Last Modified by: 李荣男
 */
<template>
    <div class="tree_element_wrap">
        <div class="tree_element_table" v-for="info in treeData" :key="info.id" :class="!info.isShow ? 'hide' : ''">
            <div class="tree_table_title" @click.stop="liClick(info,$event)" :class="[info.isClicked ? 'active' : '',`layer${treeLayer}`]">
                <template v-for="(ele,index) in order">
                    <span v-if="ele == 'name'" class="ele_td hasArrow" :style="{paddingLeft:left + 'px',width:width[index] + 'px'}" :title="info[order[index]]">
                        <i class="arrow iconfont" v-if="(info.childNode && info.childNode.length != 0) || info[pIdName] ==''" 
                        @click.stop="arrowClick(info)">{{!info.isShow ? "&#xe7fc;" : "&#xe7fb"}}</i>
                        {{info[order[index]]}}
                    </span>
                    <span v-else-if="ele == 'checkbox'" class="ele_td" :style="{width:width[index] + 'px'}" :title="info[order[index]]">
                        <i class="arrow iconfont" 
                         @click.stop="checkboxFunc(info)" v-html="dealIcon(info)"></i>
                    </span>
                    <span v-else class="ele_td" :title="info[order[index]]" :style="{width:width[index] + 'px'}">{{info[order[index]]}}</span>
                </template>
            </div>
            <div class="tree_table_box">
                <TreeElement v-if="info.childNode" :treeData="info.childNode" :pIdName="pIdName" :treeLayer = "treeLayer + 1" @getLiClick="getLiClick" :left="parseInt(left)+25" :order="order" :tableWidth="tableWidth" :headData="headData" @getChooseBox="getChooseBox"></TreeElement>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "TreeElement",
  props: {
    //每层padding-left增加,作出分层效果
    left: {
      type: Number,
      default: 0
    },
    tableWidth: {
      type: Number,
      default: 0
    },
      pIdName:{
          type:String,
          default:'pId'
      },
    treeData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    order: {
      type: Array,
      default: function() {
        return [];
      }
    },
    headData: {
      type: Array,
      default: function() {
        return [];
      }
    },
      treeLayer:{
          type:Number,
          default:0
      },
  },
  data() {
    return {
      treeWidth:0
    };
  },
  methods: {
      dealIcon(info){
          if(info.isChoosed){
              return "&#xe637"
          } else if(info.halfChoosed){
              return "&#xe63b;"
          } else {
              return "&#xe63c"
          }
      },
    liClick(ele, event) {
      this.$emit("getLiClick", ele);
    },
    getLiClick(info) {
      this.$emit("getLiClick", info);
    },
    arrowClick(e) {
      this.$set(e, "isShow", !e.isShow);
    },
    //点击勾选框
    checkboxFunc(e) {
      this.$set(e, "isChoosed", !e.isChoosed);
    this.$set(e, "halfChoosed", e.isChoosed);
      !e.childNode
        ? ""
        : e.childNode.forEach(ele => {
            this.$set(ele, "isChoosed", e.isChoosed);
            this.$set(ele, "halfChoosed", e.isChoosed);
            !ele.childNode ? "" : this.checkboxChildFunc(ele)
          });
      this.$forceUpdate()
      this.$emit("getChooseBox",e[this.pIdName]);
    },
    // //点击勾选框-找子集
    checkboxChildFunc(e) {
      e.childNode.forEach(ele => {
            this.$set(ele, "isChoosed", e.isChoosed);
            this.$set(ele, "halfChoosed", e.isChoosed);
            !ele.childNode ? "" : this.checkboxChildFunc(ele)
          });
    },
    //准备向上传递用的id
    getChooseBox(pid) {
      let _num = 0,
            _half = 0,
        _obj = this.treeData.filter(ele => ele.id == pid)[0]
      !_obj ? "" : _obj.childNode.forEach(ele => {
        ele.isChoosed == true ? (_num += 1) : "";
        ele.halfChoosed == true ? (_half += 1) : "";
      });
      if (_num == _obj.childNode.length) {
        _obj.isChoosed = true;
      } else if (_obj.isChoosed) {
        _obj.isChoosed = false;
      }
    _obj.halfChoosed = _num > 0 || _half > 0;
      this.$forceUpdate()
      if (!_obj[this.pIdName] || _obj[this.pIdName] == "") {
        this.$emit("getChooseBox",null);
      } else {
        this.$emit("getChooseBox",_obj[this.pIdName]);
      }
    }
  },
  computed:{
      width(){
          let _tableWidth = this.treeWidth
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
      }
  },
  mounted () {
    this.$nextTick(() => {
        this.treeWidth = this.tableWidth
    })
  }
};
</script>

<style lang="less">
.tree_element_wrap {
  position: relative;
  width: 100%;
  .tree_element_table {
    width: 100%;
    overflow: hidden;
    .tree_table_title {
      width: 100%;
      overflow: hidden;
      &.active {
        background-color: #d5eaf8;
      }
      .ele_td {
        box-sizing: border-box;
        display: block;
        float: left;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        transition: 0.2s;
        &:first-child{
            border-left: none;
        }
        &.hasArrow {
          text-align: left;
        }
        & > em {
          font-style: normal;
        }
        .arrow {
          margin: 0 5px;
          cursor: pointer;
          color: #2c3e50;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      }
    }
    .check_box {
      color: #2c3e50;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    &.hide {
        .tree_table_box{
            // .ele_td{
        height: 0;
        opacity: 0;
        border: none;
            // }
        }
    }
  }
}
</style>
