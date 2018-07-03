<template>
    <div class="mc_wrap" :style="lineStyle">
        <i class="line_arrow" @mousedown="arrowDown($event)" @mouseup="arrowUp($event)"></i>
    </div>
</template>

<script>
export default {
  props: {
    chooseDom: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      mouseX: 0,
      mouseY: 0,
      lineTop:0,
      lineLeft:0,
      lineWidth: 0,
      lineHeight: 0,
      domBackup: [],
      lineStyle: {},
    };
  },
  methods: {
      //获取可被选中的所有dom
    getDom(info) {
      if (info == "") return null;
      if (info.slice(0, 1) == ".") {
        return document.querySelectorAll(info);
      } else if (info.slice(0, 1) == "#") {
        return document.getElementById(info);
      } else {
        return document.getElementsByTagName(info.toUpperCase());
      }
    },
    //判断该dom是否在选区范围内
    isChoosedDom(dom, tl, tr, bl, br) {
      let _t = 0,
        _l = 0,
        _w = dom.clientWidth,
        _h = dom.clientHeight,
        _dom = dom;
      while (_dom) {
        _t += _dom.offsetTop;
        _dom.scrollTop != 0 ? (_t = _top - _dom.scrollTop) : "";
        _l += _dom.offsetLeft;
        _dom = _dom.offsetParent ? _dom.offsetParent : null;
      }
      let domXTrue =
          (tl[0] <= _l && _l <= tr[0]) ||
          (tl[0] <= _l + _w && _l + _w <= tr[0]),
        domYTrue =
          (tl[1] <= _t && _t <= bl[1]) ||
          (tl[1] <= _t + _h && _t + _h <= br[1]),
        lineXTrue =
          (_l <= tl[0] && tl[0] <= _l + _w) ||
          (_l <= tr[0] && tr[0] <= _l + _w),
        lineYTrue =
          (_t <= tl[1] && tl[1] <= _t + _h) ||
          (_t <= tr[1] && tr[1] <= _t + _h);
      if (domXTrue && domYTrue) {
        return true;
      } else if (lineXTrue && lineYTrue) {
        return true;
      } else {
        return (domXTrue && lineYTrue) || (lineXTrue && domYTrue);
      }
    },
    //过滤dom的方法
    filterDom() {
      let tl = [
          parseFloat(this.lineStyle.left),
          parseFloat(this.lineStyle.top)
        ],
        tr = [
          parseFloat(this.lineStyle.left) + parseFloat(this.lineStyle.width),
          parseFloat(this.lineStyle.top)
        ],
        bl = [
          parseFloat(this.lineStyle.left),
          parseFloat(this.lineStyle.top) + parseFloat(this.lineStyle.height)
        ],
        br = [
          tr[0],
          parseFloat(this.lineStyle.top) + parseFloat(this.lineStyle.height)
        ],
        domArr = this.getDom(this.chooseDom),
        _arr = [];
      for (let i = 0; i < domArr.length; i++) {
        this.isChoosedDom(domArr[i], tl, tr, bl, br)
          ? _arr.push(domArr[i])
          : "";
      }
      return _arr;
    },
    //鼠标移动时的事件
    moveClick(event) {
        this.lineStyle.height =
            parseFloat(this.lineHeight) + parseFloat(event.pageY - this.mouseY) +
            "px";
        this.lineStyle.width =
            parseFloat(this.lineWidth) + parseFloat(event.pageX - this.mouseX) +
            "px";
        if(event.pageY - this.mouseY < 0){
        this.lineStyle.top = parseFloat(this.lineTop) - parseFloat(this.mouseY - event.pageY) +
            "px";
        this.lineStyle.height =
            parseFloat(this.lineHeight) + parseFloat(this.mouseY - event.pageY) +
            "px";
        }
        if(event.pageX - this.mouseX < 0){
        this.lineStyle.left = parseFloat(this.lineLeft) - parseFloat(this.mouseX - event.pageX) +
            "px";
        this.lineStyle.width =
            parseFloat(this.lineWidth) + parseFloat(this.mouseX - event.pageX) +
            "px";
        }
    },
    //鼠标落下事件
    arrowDown(event) {
      this.mouseY = event.pageY;
      this.mouseX = event.pageX;
      this.lineStyle = {
        width: 0,
        height: 0,
        left: this.mouseX + "px",
        top: this.mouseY + "px",
        display: "block"
      };
      this.lineTop = parseFloat(this.lineStyle.top);
      this.lineLeft = parseFloat(this.lineStyle.left);
      this.domBackup = [];
      document.getElementById("app").setAttribute("class", "no_select");
      document.body.addEventListener("mousemove", this.moveClick, false);
      document.body.addEventListener("mouseup", this.arrowUp, false);
    },
    //鼠标提起事件
    arrowUp(event) {
      this.lineHeight = parseFloat(this.lineStyle.height);
      this.lineWidth = parseFloat(this.lineStyle.width);
      this.lineTop = parseFloat(this.lineStyle.top);
      this.lineLeft = parseFloat(this.lineStyle.left);
      this.domBackup = this.filterDom();
      document.getElementById("app").setAttribute("class", "");
      document.body.removeEventListener("mousemove", this.moveClick, false);
      document.body.removeEventListener("mouseup", this.arrowUp, false);
      document.body.addEventListener("click", this.clearStyle, false);
      this.$emit("getChoosedDom",this.domBackup)
    },
    //清除样式
    clearStyle() {
      this.lineStyle = {};
      this.lineHeight = 0;
      this.lineWidth = 0;
      this.lineTop = 0;
      this.lineLeft = 0;
      this.mouseX = 0;
      this.mouseY = 0;
      document.body.removeEventListener("click", this.clearStyle, false);
    }
  },
  created() {
    document.body.addEventListener("mousedown", this.arrowDown, false);
  },
  beforeDestroy() {
    document.body.removeEventListener("mousedown", this.arrowDown, false);
  }
};
</script>

<style lang="less">
.mc_wrap {
  position: fixed;
  display: none;
  border: 2px solid #6a7ab5;
  background-color: rgba(106, 122, 181, 0.3);
  z-index: 10001;
  .mc_arrow {
    position: absolute;
    display: block;
    bottom: 0;
    right: 0;
    width: 8px;
    height: 8px;
    background-color: #6a7ab5;
    cursor: cell;
  }
}
.no_select {
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  -khtml-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}
</style>
