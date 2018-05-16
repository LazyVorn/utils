/*
 * @Name: 周计划-流水段树形表格组件
 * @Author: 李荣男
 * @Date: 2018年3月9日 15:18:26
 * @Last Modified by: 李荣男
 */
<template>
    <div class="tree_element_wrap">
        <div class="tree_element_table" v-for="info in treeData" :key="info.id" :class="!info.isShow ? 'hide' : ''">
            <div class="tree_table_title" @click.stop="liClick(info,$event)" :class="[info.liClicked ? 'active' : '',`layer${treeLayer}`]">
                <template v-for="(ele,index) in order">
                    <span v-if="index == 0" class="ele_td" :style="{paddingLeft:left + 'px',width:width[index] + 'px'}" :title="info[order[index]]">
                        <i class="arrow iconfont" v-if="(info.childNode && info.childNode.length != 0) || info.pid ==''" 
                        @click.stop="arrowClick(info)">{{!info.isShow ? "&#xe7fc;" : "&#xe7fb"}}</i>
                        {{info[order[index]]}}
                    </span>
                    <span v-else class="ele_td" :title="info[order[index]]" :style="{width:width[index] + 'px'}">{{info[order[index]]}}</span>
                </template>
            </div>
            <div class="tree_table_box">
                <TreeElement v-if="info.childNode" :treeData="info.childNode" :treeLayer = "treeLayer + 1" @getLiClick="getLiClick" :left="parseInt(left)+25" :order="order" :tableWidth="tableWidth" :headData="headData" @checkBox="checkBox"></TreeElement>
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
      choose: {},
      treeWidth:0
    };
  },
  methods: {
    liClick(ele, event) {
      this.$emit("getLiClick", ele.id);
    },
    getLiClick(id) {
      this.$emit("getLiClick", id);
    },
    arrowClick(e) {
      this.$set(e, "isShow", !e.isShow);
    },
    //获取选中的部位id
    getChoosedId(e) {
      this.treeData.forEach(ele => {
        if (ele.childNode) {
          this.findChild(ele.childNode);
        }
      });
      this.$emit("checkBox", this.choose);
    },
    //遍历child
    findChild(arr) {
      arr.forEach(ele => {
        if (ele.childNode) {
          this.findChild(ele.childNode);
        }
      });
    },
    //点击勾选框
    checkboxFunc(e) {
      this.$set(e, "isClick", !e.isClick);
      !e.childNode
        ? ""
        : e.childNode.forEach(ele => {
            this.$set(ele, "isClick", e.isClick);
          });
      this.$forceUpdate()
      this.$emit("checkBox",e.pid);
    },
    //准备向上传递用的id
    checkBox(pid) {
      let _num = 0,
        _obj = this.treeData.filter(ele => ele.id == pid)[0]
      _obj.childNode.forEach(ele => {
        ele.isClick == true ? (_num += 1) : "";
      });
      if (_num == _obj.childNode.length) {
        _obj.isClick = true;
      } else if (_obj.isClick) {
        _obj.isClick = false;
      }
      this.$forceUpdate()
      if (!_obj.pid || _obj.pid == "") {
        this.getChoosedId(this.treeData);
      } else {
        this.$emit("checkBox",_obj.pid);
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
        &:first-child {
            border-left: none;
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
