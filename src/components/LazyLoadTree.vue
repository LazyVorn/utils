/*
 * @Name: 树形表格组件
 * @Author: 李荣男
 * @Date: 2018-06-08 14:32:42
 * @Last Modified by: 李荣男
 */
<template>
    <div class="lv_tree_wrap">
        <div class="lv_head_wrap" :style="{right:scrollWidth + 'px'}">
            <div class="lv_table_wrap" :style="{width:computedWidth + 'px'}">
                <template v-for="(ele,index) in headData">
                    <span class="lv_head_th checkbox" v-if="ele.value == 'checkbox'" :style="{width:width[index]+'px'}">
                        <i class="lv_icon" @click.stop="checkboxFunc(ele)" :class="allIsClick ? 'lv_icon_check' : 'lv_icon_noCheck'"></i>
                    </span>
                    <span class="lv_head_th" v-else :style="{width:width[index]+'px'}">{{ele.name}}</span>
                </template>
            </div>
        </div>
        <div class="lv_body_wrap" @scroll="scrollFunc">
            <div class="lv_table_wrap" :style="computedWidth > tableWidth ? {width:computedWidth + 'px'} : {}" v-if="data.length > 0">
                <TreeElement :treeData="treeData" :order="order" :pIdName="pIdName" :treeLayer="0" :width="width" @getArrowClick="getArrowClick" @getLiClick="getLiClick" @getChooseBox="getChooseBox" @finishLoading="loading = false" :headData="headData"></TreeElement>
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
  name: "LazyLoadTree",
  components: {
    TreeElement
  },
  props: {
    //pid字段名,默认为pId,取决接口返回的JSON数据
    pIdName: {
      type: String,
      default: "pId"
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
    url: {
      type: String,
      default: ""
    },
    params: {
      type: Object,
      default: function() {
        return {};
      }
    },
  },
  components: {
    TreeElement
  },
  data() {
    return {
      data: [], //实际用到的表格内容数据,是bodyData的深拷贝
      treeData: [],
      isClickedId: "", //高亮行的id
      tableWidth: 0, //表格宽度,用来计算单元格宽度
      scrollWidth: 20, //滚动条宽度
      allIsClick: false, //是否全部选中
      detailTimes: 0, //判断是否第一次递归数据,以防数据变动导致allIsClick触发
      loading: false,
      backupData:[]
    };
  },
  methods: {
    //监听视窗变化,动态响应宽度
    resize() {
      this.tableWidth = this.$el.querySelectorAll(
        ".lv_head_wrap"
      )[0].clientWidth;
    },
    //监听滚动,如果列过多出现横向滚动条,需要让表格头的scrollLeft随着实时变动
    scrollFunc() {
      //没用id和ref是怕一个页面引用多个treeTable而导致id或ref重复
      this.$el.querySelectorAll(
        ".lv_head_wrap"
      )[0].scrollLeft = this.$el.querySelectorAll(
        ".lv_body_wrap"
      )[0].scrollLeft;
    },
    //点击全选键
    checkboxFunc() {
      this.allIsClick = !this.allIsClick;
      this.data.forEach(ele => {
        this.$set(ele, "isChoosed", this.allIsClick);
        this.$set(ele, "halfChoosed", this.allIsClick);
      });
      this.$emit("getChooseBox", this.allIsClick ? this.data : []);
    },
    //获取勾选的单元行
    getChooseBox(ids) {
      let _arr = this.data.filter(ele => ele.isChoosed);
      this.allIsClick = _arr.length == this.data.length;
      this.$emit("getChooseBox", _arr);
    },
    //获取高亮的单元行
    getLiClick(info) {
      this.isClickedId = info.id;
      this.treeData.forEach(ele => {
        ele.isClicked = ele.id == info.id ? true : false;
        !ele.childNode ? "" : this.findChildisClicked(ele.childNode, info.id);
      });
      this.$emit("getClicked", info);
    },
    //getLiClick专用,递归数据
    findChildisClicked(child, id) {
      child.forEach(_ele => {
        _ele.isClicked = _ele.id == id ? true : false;
        !_ele.childNode ? "" : this.findChildisClicked(_ele.childNode, id);
      });
    },
    dealRootData(arr){
        let _arr = [];
        arr.forEach(ele => {
        this.$set(ele, "isShow", false);
        this.$set(ele, "halfChoosed", false);
        this.$set(ele, "childNode", []);
        this.$set(ele, "isClicked", this.isClicked == ele.id ? true : false);
        _arr.push(ele);
      });
      this.backupData = [..._arr]
      return _arr;
    },
    dealChildData(url,params,parent){
        this.$post(url,params).then(res => {
            let _arr = res.data || [];
            _arr.forEach(ele => {
                ele.isLeaf ? "" : this.$set(ele, "isShow", false);
                this.$set(ele, "halfChoosed", false);
                this.$set(ele, "childNode", ele.isLeaf ? null : []);
                this.$set(ele, "isClicked", this.isClicked == ele.id ? true : false);
            });
            this.backupData = [this.backupData,..._arr]
            parent.childNode = [..._arr];
        });
    },
    getArrowClick(element){
        this.dealChildData(this.url,this.params,element);
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
      this.data = JSON.parse(JSON.stringify(newVal));
      this.treeData = this.dealRootData(this.data);
      this.data.length > 0 ? (this.loading = true) : "";
    }
  },
  mounted() {
    this.resize();
    window.addEventListener("resize", this.resize, false);
    this.data = JSON.parse(JSON.stringify(this.bodyData));
    this.treeData = this.dealRootData(this.data);
    this.scrollWidth = this.getScrollBarSize();
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
  border: 1px solid #ddd;
  background-color: #eee;
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
  border-left: 1px solid #ddd;
  height: 40px;
  line-height: 40px;
  font-weight: 900;
  text-align: center;
  background-color: #eee;
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
  border-top: 1px solid #ddd;
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
  width: 16px;
  height: 16px;
  margin: 12px 5px 0 12px;
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
  margin: 12px;
  background-image: url("data:image/png;base64,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");
}
.lv_tree_wrap .lv_icon.lv_icon_check {
  margin: 12px;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAMHklEQVR4Xu2dW6h1VRmGHzOiI0oWFghJdBFFURZoaRphqYn+ZXa46CYrKG86XERBGRidKKqb6EgXQURnTKpfSkHSSioJJCzqwg5UElpSSVhpfLhm7f723mvNMcc7DnO86+a/+OcY7/je733mmHPNtdc6Dr/sgB040IHj7I0dsAMHO2BAnA47cIgDBsTxsAMGxBmwA2kOeAdJ882jBnHAgAzSaJeZ5oABSfPNowZxwIAM0miXmeaAAUnzzaMGccCADNJol5nmgAFJ882jBnHAgAzSaJeZ5oABSfPNowZxwIAM0miXmeaAAUnzzaMGccCADNJol5nmgAFJ882jBnHAgAzSaJeZ5oABSfPNowZxwIAM0miXmeaAAUnzzaMGccCADNJol5nmgAFJ882jBnHAgAzSaJeZ5kCLgJwKvAw4D3gMcBJwclp5HtW4A7cDdwC/B64BvgTc1tKaWwLk5cBbgNNaMshrKe7Aj4EPAF8orryPYAuAnA18BHh6C4Z4Dc04EKC8Abix5opqA/Ja4OPAA2qaYO1mHbgXiIx8ptYKawESuh8E3lyrcOt25cD7gLfVWHEtQN5Tq+AaJlsziwPvBt6eZaYZk9QA5GLgqhlr9KF2YHLgJcBXS9pRGpCnAd8DHlKySGutxoG7gTOAW0pVVBqQnwJPKlWcdVbpwM3AM0pVVhKQi4CvlyrMOqt24ALgaIkKSwLyLeD8EkVZY/UOxIn2SIkqSwHyCOBPwPElirLG6h24B3gU8Bd1paUAeVXNhz1qEz1/FQdeCXxOrVwKkE8Br1EX4/mHcuBjwOXqiksB8m3gXHUxnn8oB+Ke9oXqiksB8gvgCepiPP9QDtxa4pFBKUDuG6p1LraEA/HQ8GFqoRKAhEZ8KtMvO5DbAXl+5QKAAckdC883OSDPr1zAgDjNQgfk+ZULGBBhPDy1PL9yAQPiFAsdkOdXLmBAhPHw1PL8ygUMiFMsdECeX7mAARHGw1PL8ysXMCBOsdABeX7lAgZEGA9PLc+vXMCAOMVCB+T5lQsYEGE8PLU8v3KBTQ/9YcX1h/nPwImFy5TnVy7gHaRwZOrIxd/7XALE32icVXAJ8vzKBQxIwbjUkQo4LgT+ATwUuA44vdBS5PmVCxiQQlGpI7MXjmkFDweuL/QzFvL8ygUMSJ3kFlDdD45J9oTNTqL+rRd5fuUCBqRAVMtLHAbHXki+CzxFuDx5fuUCBkQYjzpT7wLHtLJHbn4A54mipcrzKxcwIKJo1Jl2DhzTCh+9+cJyxZd2yPMrFzAgdZIsUE2BY1pG/BhrXG7lhkSeX7mAARFEtfyUS+DYC8n3gfgV41wveX7lAgYkVxaqzZMDjmnxpwABSfyb4yXPr1zAgOTIQbU5csIxFRE7SEASl11LX/L8ygU2DvizWEujUH781UD8XJ7iFfci8W2bS1/y/MoFvIMszUCV8YqdY28hHwbemKEyeX7lAgYkQwzKTtELHOGKPL9yAQNSNt0L1XqCw4AsbLaHz3OgNzgMyLz++ugFDvQIhwFZ0HAP3d2BXuEwILv32EcmOtAzHAYkseketpsDvcNhQHbrs49KcGANcBiQhMZ7yHYH1gKHAdneax8x04E1wWFAZjbfhx/uwDeAF2++fUThVa6Pj8xZm/xBt1zAT9Ln9Ft2bMDxIuCfIoUacHgHETVztGnXCocBGS3JgnrXDIcBEQRmpCnXDocBGSnNmWsdAQ4Dkjk0o0w3ChwGZJREZ6xzJDgMSMbgjDDVaHAYkBFSnanGEeFYDSBRSOlvNbkCuDJT+Fqf5qrNQ0DVOj8EvEk1+cJ55Q+65QKFn6TfAxwBjgLPA+LM+uCFTWh5+Kg7x9QTeX7lAgUB2QvHZOCaIRkdjtVcYgWE94pPw/vBsWZIDMf93ZWf4OUCBXaQw+BYIySG479nW3l+5QJiQHaBYy8k8SusDxLvZsrpDcf/uivPr1xACMgcOCZbzwfiXZ8eITEc/3/qkedXLiACJAWOniExHPvvy/L8ygUEgCyBo0dIDMfBF63y/MoFMgOSA46eIDEch9/RyfMrF8gISE44eoDEcGx/u0OeX7lAJkAUcLQMieHYDoefg+zxKL5s4KLNR0h2s27eUS29u2U4du+d/AQvF8i0g4Rlyl0k5m8BEsOxOxzeQfbxas2QGI55cBiQA/xaIySGYz4cBuQQzwKSC4Dr0nzdOqrk5Zbh2NqOAw+Q3yLIBTLegxzr0t+BCzuHxHCkw+EdZAfveobEcOzQ4C2HyE/wcgHhDjJ51yMkhmM5HN5BZngYkDwfuGHGmDmHxj3J1cAD5ww64FjDkcHEzRTyE7xcoMAOMtl9N3CeEJKLga8shMRw5IPDO0iCly1DYjgSGup7kPymtQiJ4cjfZ+8gCzwNSOIbTW5aMMdhQ+dcbhkOURP8pQ3LjP0rcG5lSAzHsh5uGy2/h5YLFLxJ38/MmpAYjm3xXv7/8vzKBSoDEi2oAYnhWB7+XWaQ51cu0AAgEyTnADfv4nrCMXvvSQxHgoGJQ+T5lQs0Akj4f9fmxl0JyWXApSv8NdnE/MqHyfMrF2gIkBKQKBNR66eWlTUtnVueX7lAY4BMkDwHuGVpdwqONxz7my3Pr1ygQUDC6juB53YCieE4+Ewkz69coFFAeoHEcBy+TcvzKxdoGJDWITEc269h5fmVCzQOyATJmcDPtvej2BGGYzer5fmVC3QASLTij8DZjUBiOHaDI46S51cu0AkgrUBiOHaHw4DM8yrL0TV3EsMxv4XyE7xcoKMdZGpPQPJs4Jfz+5U8wnCkWSfPr1ygQ0CiVX8A4mFiCUgMRxocvsRK9y3LyBKQGI5lrZKf4OUCne4gU9uUkBiOZXB4B1nuX5YZApJnAbdlme3+SQxHHjPlJ3i5QOc7yNTG327uSXJAYjjywOEdJJ+PWWbKAYnhyNKK/0wiP8HLBVayg+TYSQxHXji8g+T3M8uMsZPEPUn8u+vLcOzq1Lzj5Cd4ucDKdpCpfXEvEs9JdoHEcMwL/Zyj5fmVC6wUkGjiLpAYjjlxn3+sPL9ygRUDMkESl1vxVvCxL8MxP/BzR8jzKxdYOSDR0Pg4Slxu7YXEcMyNetrx8vzKBQYA5FhIDEda2FNGyfMrF9hUfV9K9Z2N+TlwLXB5Z+vuebny/MoFBtlBeg5Zz2uX51cuYEB6zl/za5fnVy5gQJoPWc8LlOdXLmBAes5f82uX51cuYECaD1nPC5TnVy5gQHrOX/Nrl+dXLmBAmg9ZzwuU51cuYEB6zl/za5fnVy5gQJoPWc8LlOdXLmBAes5f82uX51cuYECaD1nPC5TnVy5gQHrOX/Nrl+dXLmBAmg9ZzwuU51cuYEB6zl/za5fnVy5gQJoPWc8LlOdXLmBAes5f82uX51cusLF4hD+Yaj5NK1ygPL9ygU1TfgOcssIGuaR6DvwKOFUtXwqQHwLPVBfj+Ydy4CbgDHXFpQD5NPBqdTGefygHPgG8Tl1xKUBeCnxRXYznH8qBS4CvqSsuBciJwJ0lfrZXbZjnb8KBfwEnAH9Tr6YUIFHHD4DT1QV5/iEcuGHzZX3yYksC8grg8/KKLDCCA3HJ/uUShZYEJOoJ8s8sUZg1VuvAjcBZpaorDcjjgJ8AcU/ilx2Y68BdwFOBX88dmHp8aUBinS8AjvqGPbVlw46LT2NEdr5T0oEagER9VwLvKFmotbp34ArgXaWrqAVI1Ple4K2lC7Zelw68v1ZWagISnboM+CRwfJdt86LVDsTzjsjIZ9VCB81fG5BY15OBjwLn1DLBuk06cD3weuDWmqtrAZCp/iNAXGeeVtMQa1d34EfAO4FvVl9Jo+8kPR64dPOOxWOBk4CTWzDLa8juwO3AHcDvgGs2D//ix1GbebW0gzRjihdiByYHDIizYAcOccCAOB52wIA4A3YgzQHvIGm+edQgDhiQQRrtMtMcMCBpvnnUIA4YkEEa7TLTHDAgab551CAOGJBBGu0y0xwwIGm+edQgDhiQQRrtMtMcMCBpvnnUIA4YkEEa7TLTHDAgab551CAOGJBBGu0y0xwwIGm+edQgDhiQQRrtMtMcMCBpvnnUIA4YkEEa7TLTHDAgab551CAOGJBBGu0y0xwwIGm+edQgDhiQQRrtMtMcMCBpvnnUIA78G5AyI+eMHN8iAAAAAElFTkSuQmCC");
}
.lv_tree_wrap .lv_icon.lv_icon_noCheck {
  margin: 12px;
  background-image: url("data:image/png;base64,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");
}
</style>
