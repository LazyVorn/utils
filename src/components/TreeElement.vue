/*
 * @Name: 周计划-流水段树形表格组件
 * @Author: 李荣男
 * @Date: 2018年3月9日 15:18:26
 * @Last Modified by: 李荣男
 */
<template>
    <div class="tree_element_wrap">
        <div class="tree_element_table" v-for="info in treeData" :key="info.id" :class="!info.isShow ? 'hide' : ''">
            <div class="tree_table_title" @click.stop="liClick(info,$event)" :class="info.liClicked ? 'active' : ''">
                <template v-for="(ele,index) in order">
                    <span v-if="index == 0" class="ele_td" :style="{paddingLeft:left + 'px',width:width[index] + 'px'}" :title="info[order[index]]">
                        <i class="arrow iconfont" v-if="(info.childNode && info.childNode.length != 0) || info.pid ==''" 
                        @click.stop="arrowClick(info)">{{!info.isShow ? "&#xe7fc;" : "&#xe7fb"}}</i>
                        {{info[order[index]]}}
                    </span>
                    <span v-else class="ele_td" :title="info[order[index]]" :style="{width:width[index] + 'px'}">
                        <lv-select v-if="index ==3" :data="selectData" multiple filterable></lv-select>
                    </span>
                </template>
                <span style="width:20px"></span>
            </div>
            <div class="tree_table_box">
                <TreeElement v-if="info.childNode" :treeData="info.childNode" @getLiClick="getLiClick" :left="parseInt(left)+25" :order="order" :width="width" @checkBox="checkBox"></TreeElement>
            </div>
        </div>
    </div>
</template>

<script>
import LvSelect from "./LvSelect"
export default {
  name: "TreeElement",
  props: {
    //每层padding-left增加,作出分层效果
    left: {
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
    width: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  components:{LvSelect},
  data() {
    return {
      choose: {},
          selectData:[{"id":"6298842148508439286","name":"张浩","pinyinName":"zhanghao","pinyinCode":"2608011407080115","parentId":null,"type":"member","order":null,"tag":null,"children":[]},{"id":"6286777766680400383","name":"刘长城","pinyinName":"liuchangcheng","pinyinCode":"12092103080114070308051407","parentId":null,"type":"member","order":null,"tag":null,"children":[]},{"id":"6338974343083102574","name":"武星","pinyinName":"wuxing","pinyinCode":"232124091407","parentId":null,"type":"member","order":null,"tag":null,"children":[]},{"id":"6346542892740346042","name":"彭辉","pinyinName":"penghui","pinyinCode":"16051407082109","parentId":null,"type":"member","order":null,"tag":null,"children":[]},{"id":"5917242334161117925","name":"张波","pinyinName":"zhangbo","pinyinCode":"26080114070215","parentId":null,"type":"member","order":null,"tag":null,"children":[]}],
          
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
      !e.childNode
        ? ""
        : e.childNode.forEach(ele => {
            this.$set(ele, "isShow", e.isShow);
          });
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
      this.$emit("checkBox");
    },
    //准备向上传递用的id
    checkBox() {
      let _num = 0;
      this.treeData[0].childNode.forEach(ele => {
        ele.isClick == true ? (_num += 1) : "";
      });
      if (_num == this.treeData[0].childNode.length) {
        this.treeData[0].isClick = true;
      } else if (this.treeData[0].isClick) {
        this.treeData[0].isClick = false;
      }
      if (!this.treeData[0].pid || this.treeData[0].pid == "") {
        this.getChoosedId(this.treeData);
      } else {
        this.$emit("checkBox");
      }
    }
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
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        transition: 0.2s;
        &:first-child {
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
