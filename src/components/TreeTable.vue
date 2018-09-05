/*
 * @Name: 树形表格组件
 * @Author: 李荣男
 * @Date: 2018-06-08 14:32:42
 * @Last Modified by: 李荣男
 */
<template>
    <div class="lv_tree_wrap">
        <div class="lv_head_wrap" ref="lvHeadWrap" :style="{right:scrollWidth + 'px'}">
            <div class="lv_table_wrap" :style="{width:computedWidth + 'px'}">
                <template v-for="(ele,index) in headData">
                    <span class="lv_head_th checkbox" v-if="ele.value == 'checkbox' && choosedType == 'normal'" :key="index" :style="{width:width[index]+'px'}">
                        <i class="lv_icon" @click.stop="checkboxFunc(ele)" :class="allIsClick ? 'lv_icon_check' : 'lv_icon_noCheck'"></i>
                    </span>
                    <span class="lv_head_th" v-else :key="index" :style="{width:width[index]+'px'}">{{ele.name}}</span>
                </template>
            </div>
        </div>
        <div class="lv_body_wrap" ref="lvBodyWrap" @scroll="scrollFunc">
            <div class="lv_table_wrap" :style="computedWidth > tableWidth ? {width:computedWidth + 'px'} : {}" v-if="data.length > 0">
                <TreeElement :treeData="treeData" :order="order" :choosedType="choosedType" 
                :idName="idName" :pIdName="pIdName" :treeLayer="0" :width="width" :headData="headData" 
                @getTrClick="getTrClick" @getChooseBox="getChooseBox" @finishLoading="loading = false"></TreeElement>
            </div>
            <span class="lv_tips" v-else>暂无数据</span>
            <transition name="fade">
                <div class="lv_tt_layer" v-if="loading">
                    <p>数据加载中......</p>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import TreeElement from "./TreeElement";
export default {
  name: "TreeTable",
  components: {
    TreeElement
  },
  props: {
    //id字段名,默认为pId,取决接口返回的JSON数据
    idName: {
      type: String,
      default: "id"
    },
    //pid字段名,默认为pId,取决接口返回的JSON数据
    pIdName: {
      type: String,
      default: "pId"
    },
    //初始展开层级
    treeLayer: {
      type: Number,
      default: 0
    },
    //表格头数据
    headData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    //表格内容数据
    bodyData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    choosedType:{
      type:String,
      default:"normal"
    },
    changeInfo:{
      type:Array,
      default(){
        return []
      }
    },
  },
  components: {
    TreeElement
  },
  data() {
    return {
      data: [], //实际用到的表格内容数据,是bodyData的深拷贝
      treeData: [],//递归后的数据
      isClickedId: "", //高亮行的id
      tableWidth: 0, //表格宽度,用来计算单元格宽度
      scrollWidth: 20, //滚动条宽度
      allIsClick: false, //是否全部选中
      detailTimes: 0, //判断是否第一次递归数据,以防数据变动导致allIsClick触发
      loading: false,//加载状态
      maxLayer:0,//树型表格最大层级
      isChoosedId:[],//被选中的id集合
      showData:[],
    };
  },
  methods: {
    //监听视窗变化,动态响应宽度
    resize() {
      this.tableWidth = this.$refs.lvHeadWrap.clientWidth;
    },
    //监听滚动,如果列过多出现横向滚动条,需要让表格头的scrollLeft随着实时变动
    scrollFunc() {
      this.$refs.lvHeadWrap.scrollLeft = this.$refs.lvBodyWrap.scrollLeft;
    },
    //点击全选键
    checkboxFunc() {
      this.allIsClick = !this.allIsClick;
      this.data.forEach(ele => {
        ele.isChoosed = this.allIsClick;
        ele.halfChoosed = this.allIsClick;
      });
      this.$emit("getChooseBox", this.allIsClick ? this.data : []);
    },
    //获取勾选的单元行
    getChooseBox(ids) {
      let _arr = this.data.filter(ele => ele.isChoosed);
      this.allIsClick = _arr.length == this.data.length;
      this.isChoosedId = _arr.map(ele => ele[this.idName]);
      this.$emit("getChooseBox", _arr);
    },
    //获取高亮的单元行
    getTrClick(info) {
      let _id = this.idName
      this.isClickedId = info.row[_id];
      this.data.forEach(ele => ele.isClicked = ele[_id] == info.row[_id])
      this.$emit("getClicked", info);
    },
    //getTrClick专用,递归数据
    findChildIsClicked(child, id) {
      child.forEach(_ele => {
        _ele.isClicked = _ele[this.idName] == id ? true : false;
        !_ele.childNode ? "" : this.findChildIsClicked(_ele.childNode, id);
      });
    },
    //数据重建方法
    reBuildData(arr, type) {
      var newArr = [],
        _id = this.idName,
        _pid = this.pIdName,
        _cArr = [],
        _pArr = [];
      arr.forEach(ele => {
        this.$set(ele, "isShow", this.showData.includes(ele[_id]));
        this.$set(ele,"isChoosed",this.isChoosedId.includes(ele[_id]));
        this.$set(ele, "isClicked", this.isClickedId == ele[_id] ? true : false);
        if (ele[_pid] == null || ele[_pid] == "") {
          _pArr.push(ele);
        } else {
          ele.isLastElement = !arr.some(_ele => _ele[_pid] == ele[_id]);
          _cArr.push(ele);
        }
      });
      if (this.detailTimes != 0) {
        _pArr.forEach((ele, index) => {
          ele.layer = 1;
          ele.childNode = this.checkChildNode(ele[_id], _cArr, _pid,ele.layer);
          newArr.push(ele);
        });
      } else {
        _pArr.forEach((ele, index) => {
          ele.layer = 1;
          this.$set(ele, "halfChoosed", false);
          ele.childNode = this.checkChildNode(ele[_id], _cArr, _pid,ele.layer);
          newArr.push(ele);
        });
      }
      this.detailTimes++;
      return newArr;
    },
    //找出一个id下的所有子节点的方法 ，用于在递归遍历中
    checkChildNode(cId, _arr, _pid,_layer) {
      let currentArr = [];
      _arr.forEach(element => {
        if (element[_pid] == cId) {
          element.layer = _layer + 1;
          this.maxLayer != 0 && this.maxLayer > element.layer ? "" : this.maxLayer = element.layer;
          if(!element.isLastElement){
            element.childNode = this.checkChildNode(element[this.idName], _arr, _pid,element.layer);
          } else {
            element.childNode = null;
          }
          currentArr.push(element);
        }
      });
      return currentArr;
    },
    //获取滚动条宽度
    getScrollBarSize() {
      let cached = 0;
      const inner = document.createElement("div");
      inner.style.width = "100%";
      inner.style.height = "200px";
      const outer = document.createElement("div");
      const outerStyle = outer.style;
      outerStyle.position = "absolute";
      outerStyle.top = 0;
      outerStyle.left = 0;
      outerStyle.pointerEvents = "none";
      outerStyle.visibility = "hidden";
      outerStyle.width = "200px";
      outerStyle.height = "150px";
      outerStyle.overflow = "hidden";
      outer.appendChild(inner);
      document.body.appendChild(outer);
      const widthContained = inner.offsetWidth;
      outer.style.overflow = "scroll";
      let widthScroll = inner.offsetWidth;
      if (widthContained === widthScroll) {
        widthScroll = outer.clientWidth;
      }
      document.body.removeChild(outer);
      cached = widthContained - widthScroll;
      return cached;
    },
    getShowData(){
      let _arr = [];
      this.data.forEach(ele => {
        if(ele.isShow && !ele.isLastElement){
          _arr.push(ele[this.idName]);
        }
      });
      this.showData = _arr;
    }
  },
  computed: {
    //单元格宽度数组,算出来的
    width() {
      let _tableWidth = this.tableWidth;
      if (!this.$el) return [];
      let _totalWidth = 0;
      let _arr = this.headData.map((ele, index) => {
        if (ele.width && ele.width != "") {
          let _width = ele.width;
          if (ele.width.toString().indexOf("px") > 1) {
            _width = ele.width.split("px")[0];
          } else if (ele.width.toString().indexOf("%") > 1) {
            _width = parseFloat(ele.width.split("%")[0]) / 100 * _tableWidth;
          }
          _totalWidth += _width;
          return parseFloat(_width);
        } else {
          if (index == this.headData.length - 1) {
            return _tableWidth - _totalWidth;
          } else {
            _totalWidth += ele.value == "checkbox" ? 40 : ele.width;
            return ele.value == "checkbox" ? 40 : ele.width;
          }
        }
      });
      //   _arr[_arr.length-1] -= this.scrollWidth;
      //最后一格减一个滚动条的宽度
      _arr[_arr.length - 1] -= this.scrollWidth + 2;
      return _arr;
    },
    //用width数组算出来的实际宽度,用于单元列过多出现横向滚动条
    computedWidth() {
      let _width = 0;
      this.width.forEach(ele => {
        _width += ele;
      });
      return _width;
    },
    //用head做的body映射
    order() {
      return this.headData.map(ele => ele.value);
    }
  },
  watch: {
    //深拷贝,以免递归时添加的字段影响到父组件的数据
    bodyData(newVal, oldVal) {
      this.getShowData();
      this.data = JSON.parse(JSON.stringify(newVal));
      this.treeData = this.reBuildData(this.data);
      this.$emit("maxLayer",this.maxLayer)
      // let _layer = this.treeLayer;
      // _layer == 0 ? this.data.forEach(ele => ele.isShow = true) : this.data.forEach(ele => {
      //     ele.isShow = ele.layer < _layer ? true : false;
      // });
      this.data.length > 0 && newVal.length != oldVal.length ? (this.loading = true) : "";
    },
    treeLayer(newVal,oldVal){
        let _layer = newVal;
        _layer == 0 ? this.data.forEach(ele => ele.isShow = true) : this.data.forEach(ele => {
            ele.isShow = ele.layer < _layer ? true : false;
        });
    },
    changeInfo(){
      if(this.changeInfo.length == 0) return;
      this.changeInfo.forEach(ele => {
        this.data.forEach(_ele => {
          if(_ele.id == ele.id){
            _ele[ele.key] = ele.value; 
          }
        })
      })
    },
  },
  mounted() {
    this.resize();
    window.addEventListener("resize", this.resize, false);
    this.scrollWidth = this.getScrollBarSize();
    this.getShowData();
    this.data = JSON.parse(JSON.stringify(this.bodyData));
    // this.data = this.bodyData;
    this.treeData = this.reBuildData(this.data);
    this.$emit("maxLayer",this.maxLayer)
    let _layer = this.treeLayer;
    _layer == 0 ? this.data.forEach(ele => ele.isShow = true) : this.data.forEach(ele => {
        ele.isShow = ele.layer < _layer ? true : false;
    });
  }
};
</script>

<style>
.fade-leave-active {
  transition: opacity 1s;
}
.fade-leave-to {
  opacity: 0;
}
.lv_tree_wrap {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  border: 1px solid #C3E0F5;
  background-color: #D7EBF9;
}
.lv_tree_wrap .lv_head_wrap {
  position: absolute;
  box-sizing: border-box;
  top: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  border-collapse: collapse;
}
.lv_tree_wrap .lv_head_wrap .lv_head_th {
  box-sizing: border-box;
  display: block;
  float: left;
  border-left: 1px solid #C3E0F5;
  height: 40px;
  line-height: 40px;
  font-weight: 400;
  text-align: center;
  background-color: #D7EBF9;
}
.lv_tree_wrap .lv_head_wrap .lv_head_th:first-child {
  border-left: none;
}
.lv_tree_wrap .lv_body_wrap {
  position: absolute;
  box-sizing: border-box;
  top: 41px;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #C3E0F5;
  overflow-y: auto;
  background-color: #fff;
}
.lv_tree_wrap .lv_body_wrap .lv_table_wrap {
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
}
.lv_tree_wrap .lv_tt_layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 3;
  cursor: default;
}
.lv_tree_wrap .lv_tt_layer > p {
  position: absolute;
  top: 40%;
  width: 100%;
  color: #2d8cf0;
  text-align: center;
  cursor: default;
}
.lv_tree_wrap .lv_tips {
  position: absolute;
  display: block;
  width: 100%;
  height: 20px;
  top: 40%;
  line-height: 20px;
  text-align: center;
  cursor: default;
}
.lv_tree_wrap .lv_icon {
  float: left;
  display: block;
  width: 24px;
  height: 24px;
  margin: 8px;
  background-size: 100% 100%;
  cursor: pointer;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.lv_tree_wrap .lv_icon.lv_icon_halfCheck {
  background-image: url("data:image/png;base64,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");
}
.lv_tree_wrap .lv_icon.lv_icon_check {
  background-image: url("data:image/png;base64,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");
}
.lv_tree_wrap .lv_icon.lv_icon_noCheck {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAOpElEQVR4Xu2ce6wdVRWH15pz24ut9oG0hdLCPWf2JiAhVEwKibwDRALFhIgC/5gWIlaLKIoQQgpCjIAivlAeAo3BF48QRRHBojxMJERFykv3zJw21FKovFopYO85ywy51zS1986eOY+96PlNctM/Zs381v7W/XrOmZlzmbCBAAhMSIDBBgRAYGICEAS/HSAwCQEIgl8PEIAg+B0AgWoE8ApSjRuOGhACEGRABo1lViMAQapxw1EDQgCCDMigscxqBCBINW44akAIQJABGTSWWY0ABKnGDUcNCAG1gqxbt2726OjoHBGZQ0Tv/IjIHkQ0PCCz2WWXycwtEXmZiDaN/zDzJmPMS9oWrUaQLMv2bbVaJzPzsUR0DBHN1gYL/fSFwGoReZCI7rPW/qUviVrvpG/cuHH6li1bzmDmTxLR4aFhIF8XARF5jplvGxoaumVkZOSFEN0FeQVpNpuzRkdHv0BEK5h59xALR+a7h4CIvM3Mq4aGhq4aGRlp9rPzvgoiIlGWZee22+3LmXlGPxeKrHc/AREZZeZvz5gx47K5c+f+ux8r6psgzWZzUavV+hERHdSPhSFjlybwIjOfFcfxr3u9yr4Ikqbp8na7fS0z4wpUryc6WOf/ehzHFzPzaK+W3XNBkiRZRUT5h3BsINB1AiLyMBEtsdZu7vrJiahngojIUJIkdzPzyb1oHOcEge0IPDk8PHzMwoULX+k2lZ4J4py7n5mP73bDOB8I7IyAiDxLREdZa/Obj13beiJIkiT3EtGJVboUkfVE9EtmbjLzKyLyKhG9JiJS5Xw4RjeBKIre2263Z0dRtHu73d6TmU8gokMqdr1meHj46G6+knRdEOfcHcz8sTILFJHNURRdQ0R3x3G8psyxqN31CGRZNq/Vai1h5guJyJRc4ePGmMUlj5mwvKuCpGn6eRG51re5/Lp2FEU3TJ06dWU3rffNR51uAvnn2CzLVojIpUQ0q0S31xtjlpeo770gWZYtbrfbj5Voao2InG6tfabEMSgdQALr169//5tvvnkrMy/xXb6IfMJae7tv/UR1XXkFye+Qp2n6hO9NQBG5eWhoaEW9Xn+r0wXg+MEh4Jw7n4iuZOYpRasWkX/NnDmz3ukd964IkiTJuUT0naKmx/Z/yRiTf97ABgKlCSRJkj/tvdrnQBH5lrU2f+av8taxIBs2bJi2devWDUQ006OLnxtjTveoQwkITEjA97Pu2LNbDWPM81VxdiyIc+4yZs4/RE26ichfjTGHMfN/imqxHwSKCDjnfszMZxbVEdEqY8xSj7qdlnQkyKZNm973+uuvbySiaUUNRFG0f6PR+HtRHfaDgA+Bse8S5ffK8m+bTrrVarV6vV5fW1S3s/0dCZKm6bL8A7dHcNcuu3lkoWRACDjnPsvM3ytabv4OJ47jy4vqui6Ic+4hZj6yIHhrrVbbu16vv1alQRwDAhMRGLt6mj9ist9klEQks9bGVUhWfgVZu3btXqOjo/mH80k3EfmBtfYzRXXYDwJVCPheQa3Vah+s1+v5rYhSW2VBkiTJH2HPH2WfdGPm4+I49rosV3Qu7AeBHQk0m809W62Wz/fVLzTGXF2WYGVBfK4iiMgrxpg5zNwu2xjqQcCXgHPuT8x8aMHbrAestfmDkKW2yoIkSfIPIrIFTd1prT2tVEcoBoGSBJIkuYKILin4XdxirS39dxAqCTL24Si/n1GbrClmvi6O4xUl14tyEChFwDl3NjPf5HHQvLJ/nK6SIM65A5n5KY+GVhpjcruxgUDPCGRZdny73b6/KCCKoiMbjcYjRXXb768qyNHM/HuPoHOMMTd61KEEBCoTSNN0PxEpvAmd33mP4/inZYIqCeJrLDMvi+P41jINoRYEyhJwzi1gZp/nrc4zxvg+VPtOG5UESZIk/zpt/rXaSTcIUkQI+7tBoIQgVxhjVpbJrCRImqYnicivioIgSBEh7O8GAV9Bqjz+DkG6MSGcIygBCBIUP8K1E4Ag2ieE/oISgCBB8SNcOwEIon1C6C8oAQgSFD/CtROAINonhP6CEoAgQfEjXDsBCKJ9QugvKAEIEhQ/wrUTgCDaJ4T+ghKAIEHxI1w7AQiifULoLygBCBIUP8K1E4Ag2ieE/oISgCBB8SNcOwEIon1C6C8oAQgSFD/CtROAINonhP6CEoAgQfEjXDsBCKJ9QugvKAEIEhQ/wrUTgCDaJ4T+ghKAIEHxI1w7AQiifULoLygBCBIUP8K1E4Ag2ieE/oISgCBB8SNcOwEIon1C6C8oAQgSFD/CtROAINonhP6CEoAgQfEjXDsBCKJ9QugvKAEIEhQ/wrUTgCDaJ4T+ghKAIEHxI1w7AQiifULoLygBCBIUP8K1E4Ag2ieE/oISgCBB8SNcOwEIon1C6C8oAQgSFD/CtROAINonhP6CEoAgQfEjXDsBCKJ9QugvKAEIEhQ/wrUTgCDaJ4T+ghKAIEHxI1w7AQiifULoLygBCBIUP8K1E4Ag2ieE/oISgCBB8SNcOwEIon1C6C8oAQgSFD/CtROAINonhP6CEoAgQfEjXDsBCKJ9QugvKAEIEhQ/wrUTgCDaJ4T+ghKAIEHxI1w7AQiifULoLygBCBIUP8K1E4Ag2ieE/oISgCBB8SNcOwEIon1C6C8oAQgSFD/CtROAINonhP6CEoAgQfEjXDsBCKJ9QugvKAEIEhQ/wrUTgCDaJ4T+ghKAIEHxI1w7AQiifULoLygBCBIUP8K1E4Ag2ieE/oISgCBB8SNcOwEIon1C6C8oAQgSFD/CtROAINonhP6CEoAgQfEjXDsBCKJ9QugvKAEIEhQ/wrUTgCDaJ4T+ghKAIEHxI1w7AQiifULoLygBCBIUP8K1E4Ag2ieE/oISgCBB8SNcOwEIon1C6C8oAQgSFD/CtROAINonhP6CEoAgQfEjXDsBCKJ9QugvKAEIEhQ/wrUTgCDaJ4T+ghKAIEHxI1w7AQiifULoLygBCBIUP8K1E4Ag2ieE/oISgCBB8SNcOwEIon1C6C8oAQgSFD/CtROAINonhP6CEoAgQfEjXDsBCKJ9QugvKAEIEhQ/wrUTgCDaJ4T+ghKAIEHxI1w7AQiifULoLygBCBIUP8K1E4Ag2ieE/oISgCBB8SNcOwEIon1C6C8oAQgSFD/CtRNQJ0iSJCcS0b0e4JYaY1Z51KEEBCoT8BWEmb8Zx/EXywRxmeLx2iRJjiWi1UXHMvOyOI5vLarDfhDohICvIET0VWPMJWWyKgmSZdnidrv9WFEQBCkihP3dIOArCDNfFMfxVWUyKwnSbDb3b7Vaz3oEfdoYc4NHHUpAoDIB51zMzEnRCZh5eRzH1xfVbb+/kiAiMjVN07eLgkTkcmvtpUV12A8CnRDIsuzIdrv9kMc5TjTG3OdR97+SSoLkRzvnnmfmBZOFicjN1tqzyzSEWhAoSyBN0zNE5CdFx9VqtXq9Xl9bVNfxK8iYIPcz8/EFYfcZY/IrXthAoGcEkiS5gIiuLgh40xgzrWwTlV9B0jS9VEQuK2oqjuOZzLytbGOoBwFfAs65wv+sReQBa+0Jvuccr6ssSJIkHyaiR4sCoyg6pdFo3FNUh/0gUIXAunXrZm/btm0TEdUKjr/AGPONshmVBcmDkiR5lYhmFYSuMsYsLdsY6kHAh0CapktF5Jai2lqtdkC9Xn+uqG7H/Z0Kkl/C/VRB6Fsiso+1NrccGwh0lYBz7mlm/sBkJxWRv1lrF1UJ7kiQNE0PF5FHioJxNauIEPZXIZCm6bL8d6voWBE531p7bVHdzvZ3JMjY26yniOhAj/CDjDF5LTYQ6JjAhg0bpr3xxhuOmecXnWy33XbbY8GCBS8X1fVEEOfcacx8e1G4iDw3a9asxXPmzNlSVIv9IFBEwDl3OzOfVlTHzF+L4/jiorqJ9nf8CpKf2Dn3BDMf7NHEamPMcR51KAGBCQkkSZI/T/XlIkQisnloaGjfer3+WlFtTwXJsuyIdrv9sE8TInKHtfbjPrWoAYEdCaRpeqGIXOlJ5nPGmO961u60rCuvIPmZkyTJb/Wf4dnMo7VabUknZnvmoGwXISAiUZIkP2Rm31sGa+I4XsTM7U4QdFOQuUS0hojyfws3EUmJ6KPW2qcLi1Ew0ASSJJkrIvlnjqN8QURRdHCj0XjSt76nb7HGT+6cO4yZ/0hEkWdjud13ishXrLXPeB6DsgEhkGXZvFardREzn0NE7ymx7HOMMTeWqJ+wtGuvINtJcj4zX1O2ORHJn6e5Z3h4+O6FCxf+s+zxqN81CIw9OnKKiJzkc5Vqx1Xnd9WttWd1i0bXBRn7PHITEXXymHv+0pi/9UqZORORdSLS0XvJbgHDebpLgJnnEZHJf0Rkf2Y+rIOE3xljip4wL3X6nggyJslviOgjpbpBMQhUJ7BGRA631m6ufor/P7JngohILUmSm0pcdejmunCuASIgIr+dPn36qfPnz9/a7WX3TJDxRtM0XS4i3+924zgfCIwRuMIYs7JXNHouSN54s9lc1Gq1fkFE+/RqITjvwBF4VUROtdb+oZcr74sgY5LMarVa+SMCRY/H93K9OPcuQEBE7poyZcq5IyMjL/R6OX0TZHwhzWbz0FardR0RfajXi8P5dy0CIvJsrVY7r9FoPNCvlfVdkPGFJUmSX+HKn7I8ol+LRc67lsCfoyi6sl6v38XM0s9VBBNkfJFr1649YHR0NP/a5JnMvHc/F48s1QReIqKfMfNtcRw/HqrT4IJsv3Dn3CHMnP/d32NEJH/QrPDLMKHAIbfrBF4UkSeI6KGhoaEH6/V64Z+27XoHOzmhKkF27M85NyP/tmIURXuJyB75DxFN7QcYZPSOADO3ROTlWq32UrvdfqFWqz2t9clu1YL0bkQ4Mwj4EYAgfpxQNaAEIMiADh7L9iMAQfw4oWpACUCQAR08lu1HAIL4cULVgBKAIAM6eCzbjwAE8eOEqgElAEEGdPBYth8BCOLHCVUDSgCCDOjgsWw/AhDEjxOqBpTAfwEEarVf+Tfy+AAAAABJRU5ErkJggg==");
}
</style>
