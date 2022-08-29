<template>
  <div class="lv_tree_element_wrap">
    <div class="lv_tree_element_table" v-for="info in treeData" :key="info[idName]">
      <div
        class="lv_tree_table_title"
        @click.stop="trClick(info)"
        :class="[info.isClicked ? 'active' : '', `layer${treeLayer}`]"
      >
        <template v-for="(ele, index) in order">
          <span
            v-if="ele == 'name'"
            class="lv_ele_td lv_hasArrow"
            :key="index"
            :style="{ paddingLeft: left + 'px', width: width[index] + 'px' }"
            :title="info[order[index]]"
            @click.stop="trClick(info, order[index])"
          >
            <i
              class="lv_icon"
              v-if="info.childNode || info[pIdName] == ''"
              :class="info.isShow ? 'lv_icon_show' : 'lv_icon_hide'"
              @click.stop="arrowClick(info)"
            ></i>
            {{ info[order[index]] }}
          </span>
          <span v-else-if="ele == 'gantt'" class="lv_ele_td" :key="index" :style="{ width: width[index] + 'px' }">
            <gantt-line
              :maxDays="maxDays"
              :timeSlot="{ start: startTime, end: endTime }"
              :planTimeSlot="{
                start: info.planStartTime,
                end: info.planFinishTime ? info.planFinishTime : changeDate(endTime) + 12 * 3600000,
              }"
              :realTimeSlot="{ start: info.realStartTime, end: info.realFinishTime ? info.realFinishTime : null }"
            ></gantt-line>
          </span>
          <span
            v-else
            class="lv_ele_td"
            :title="info[order[index]]"
            :key="index"
            :style="{ width: width[index] + 'px' }"
            @click.stop="trClick(info, order[index])"
            >{{ info[order[index]] }}</span
          >
        </template>
      </div>
      <div class="lv_tree_table_box" v-show="info.isShow">
        <TaskTreeElement
          v-if="info.childNode"
          :treeData="info.childNode"
          :pIdName="pIdName"
          :maxDays="maxDays"
          :startTime="startTime"
          :endTime="endTime"
          :choosedType="choosedType"
          :width="width"
          :treeLayer="treeLayer + 1"
          @getTrClick="getTrClick"
          :left="parseInt(left) + 25"
          :order="order"
          :headData="headData"
          @getChooseBox="getChooseBox"
        ></TaskTreeElement>
      </div>
    </div>
  </div>
</template>

<script>
import GanttLine from "../components/GanttLine";
export default {
  name: "TaskTreeElement",
  components: { GanttLine },
  props: {
    //每层padding-left增加,作出分层效果
    left: {
      type: Number,
      default: 0,
    },
    //id字段名，默认为id，取决接口返回的JSON数据
    idName: {
      type: String,
      default: "id",
    },
    //pid字段名,默认为pId,取决接口返回的JSON数据
    pIdName: {
      type: String,
      default: "pId",
    },
    //递归用的数据
    treeData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    //单元格宽度数组
    width: {
      type: Array,
      default: function () {
        return [];
      },
    },
    //内容数据相对于表格头的映射
    order: {
      type: Array,
      default: function () {
        return [];
      },
    },
    //头部数据
    headData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    //层级
    treeLayer: {
      type: Number,
      default: 0,
    },
    choosedType: {
      type: String,
      default: "normal",
    },
    maxDays: {
      type: Number,
      default: 7,
    },
    //计划开始时间
    startTime: {
      type: String,
      default: Date.now(),
    },
    //计划完成时间
    endTime: {
      type: String,
      default: Date.now(),
    },
  },
  data() {
    return {};
  },
  methods: {
    changeDate(date) {
      if (!date) return 0;
      let _date = typeof date != "object" ? new Date(date) : date;
      return new Date(_date.getFullYear(), _date.getMonth(), _date.getDate(), 0, 0, 0, 0).getTime();
    },
    //判断全选,半选,没选
    dealIcon(info) {
      if (info.isChoosed) {
        return "lv_icon_check";
      } else if (info.halfChoosed) {
        return "lv_icon_halfCheck";
      } else {
        return "lv_icon_noCheck";
      }
    },
    //点击行并高亮
    trClick(ele, col) {
      this.$emit("getTrClick", { row: ele, col: col });
    },
    //冒泡用,传递高亮行信息
    getTrClick(info) {
      this.$emit("getTrClick", info);
    },
    //收缩事件
    arrowClick(e) {
      e.isShow = !e.isShow;
    },
    //点击勾选框
    checkboxFunc(e) {
      e.isChoosed = !e.isChoosed;
      e.halfChoosed = e.isChoosed;
      if (this.choosedType == "normal") {
        !e.childNode
          ? ""
          : e.childNode.forEach((ele) => {
              ele.isChoosed = e.isChoosed;
              ele.halfChoosed = e.isChoosed;
              !ele.childNode ? "" : this.checkboxChildFunc(ele);
            });
        this.$forceUpdate();
        this.$emit("getChooseBox", e[this.pIdName]);
      } else {
        this.$emit("getChooseBox", null);
        this.$emit("getTrClick", { row: e, col: "checkbox" });
      }
    },
    // 点击勾选框-找子集
    checkboxChildFunc(e) {
      e.childNode.forEach((ele) => {
        ele.isChoosed = e.isChoosed;
        ele.halfChoosed = e.isChoosed;
        !ele.childNode ? "" : this.checkboxChildFunc(ele);
      });
    },
    //准备向上传递用的id
    getChooseBox(pid) {
      if ((!pid || pid == null) && this.choosedType != "normal") {
        return this.$emit("getChooseBox", null);
      }
      let _num = 0,
        _half = 0,
        _obj = this.treeData.filter((ele) => ele[this.idName] == pid)[0];
      !_obj
        ? ""
        : _obj.childNode.forEach((ele) => {
            ele.isChoosed == true ? (_num += 1) : "";
            ele.halfChoosed == true ? (_half += 1) : "";
          });
      if (_num == _obj.childNode.length) {
        _obj.isChoosed = true;
      } else if (_obj.isChoosed) {
        _obj.isChoosed = false;
      }
      _obj.halfChoosed = _num > 0 || _half > 0;
      this.$forceUpdate();
      if (!_obj[this.pIdName] || _obj[this.pIdName] == "") {
        this.$emit("getChooseBox", null);
      } else {
        this.$emit("getChooseBox", _obj[this.pIdName]);
      }
    },
  },
  mounted() {
    if (this.treeLayer == 0) {
      this.$emit("finishLoading", true);
    }
  },
  watch: {
    treeData() {
      this.treeLayer == 0 ? this.$emit("finishLoading", true) : "";
    },
  },
};
</script>

<style>
.lv_tree_element_wrap {
  position: relative;
  width: 100%;
}
.lv_tree_element_wrap .lv_tree_element_table {
  width: 100%;
  overflow: hidden;
}
.lv_tree_element_wrap .lv_tree_element_table .lv_tree_table_title {
  width: 100%;
  overflow: hidden;
  border-bottom: 1px solid #c3e0f5;
}
.lv_tree_element_wrap .lv_tree_element_table .lv_tree_table_title.active {
  background-color: #f5fafe;
}
.lv_tree_element_wrap .lv_tree_element_table .lv_tree_table_title .lv_ele_td {
  box-sizing: border-box;
  display: block;
  float: left;
  height: 38px;
  line-height: 40px;
  text-align: center;
  border-left: 1px solid #c3e0f5;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  transition: 0.2s;
}
.lv_tree_element_wrap .lv_tree_element_table .lv_tree_table_title .lv_ele_td:first-child {
  border-left: none;
}
.lv_tree_element_wrap .lv_tree_element_table .lv_tree_table_title .lv_ele_td.lv_hasArrow {
  text-align: left;
}
.lv_tree_element_wrap .lv_tree_element_table .lv_check_box {
  color: #2c3e50;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.lv_tree_element_wrap .lv_tree_element_table.lv_hide .lv_tree_table_box {
  height: 0;
  opacity: 0;
  border: none;
}
.lv_tree_element_wrap .lv_icon {
  float: left;
  display: block;
  width: 14px;
  height: 14px;
  margin: 12px 5px;
  background-size: 100% 100%;
  cursor: pointer;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.lv_tree_element_wrap .lv_icon.lv_icon_halfCheck {
  width: 24px;
  height: 24px;
  margin: 8px;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAQU0lEQVR4Xu2deZAcZRnGn7dnE0JUJJEIEQoKRAuk1ACV3RmMCClBUgpalKDwD5UA6Vm5BA8siiJrKEtAA3hApncJSVmIGrUoL0AOBQ+mhxiJYCQeHIoaIEKogJBjtl+rA0kFSPZ7u2d6ZtzvmX/7+Y731+9ve2Z2pkfABwmQwC4JCNmQAAnsmgAFYXeQwBgEKAjbgwQoCHuABPIR4BUkHzeO8oQABfHkRLPMfAQoSD5uHOUJAQriyYlmmfkIUJB83DjKEwIUxJMTzTLzEaAg+bhxlCcEelaQWdfrlM19mBaMYpoEmKYJpolgLxXs5sm5GbdlCjCaKJ4JBOs0wbrREtZNGMW6+wbl6V4rumcEOeoGPUBH8RFVzBbgWAim9Bos7qcDBBR3q+AXAG6PQ/l9B1Ycc4muCvKeb+kbJr+E0wCcIcCsbsPg+j1HYI0CN20BblwZytpu7K4rgsxYqnvutgkXiuBcAaZ2o3Cu+X9EQLEJgmWjAa68/2x5rJM776wgQxoM7IPzBFgogj06WSjXGgcEFE0VfO35JoZWnyMvdKKijgkyc1hnlBTfEuDdnSiMa4xfAgo8lQBn3h/Kz4qusiOClCMdFMU14DtQRZ9Pr+ZPgK/svhaX3DMkzaIKL1yQcqTLBDijqAI4r+cEFL9KNuPExvmyoQgShQlyzJD2bdoHt0DwkSI2zjlJYBsBBR6UEo6tnyXPtptKYYKUa3qHCI5r94Y5HwnsjIACD2+agA88ME/WtZNQIYKUI71VgDl5NqrAP6H4sQCPIUD6F2F9onhOEmie+TimtwlICW9MgClIMDUQ7KPA8QIckWfXCjwkJRzTzitJ2wWp1PT7EHw8S4Gq2CDAIghuqYfyUJaxzI4/AgMjurckOBHAxQIcnLHCFfVQ+jOO2WW8rYJUIv00gGvMm1M0IYhQwmXttN68PoM9TWDr69jpOBfAAgB7WjerilpclUFrfqxc2wSpLNZ+BGhYN5VeDlXxyUZV/mQdw5yfBPq/qW8J+rBUZOtVxfTQBJ+IB2W5KTxGqD2CDGlQno5V1n8CqmLJpN1w7j1zZWOrBXC8PwTKNb0IgisEmOCqWoH/PN/Ega3+x70tgpRrep4Ivu7adHo8AT7bCGWRJcsMCbyWQP+Izi4luNtI5tp6KBcaszuNtSzIkZFOngD8W4A3uzaiwPfiUD7pyvE4CYxFwPxaV9FsjuKgFefIE3mJtixIOdIheflF1NgPxQMbpqK8+lTZ7IryOAm4CJQj/bYAp7tyqlgWV2WuK7er4y0J8r4l+qbRJp4UYLJrA1tGccjvPiV/duV4nAQsBNLvEr3hJaQffZ/mymuCA+NBedyV29nxlgSpDOs8KJa4Fm7n226utXjcHwKVSM8B8E1nxYoF9aosdOZ2EmhNkJreC8HRYy2swIsbJ2LfVXPluTwb5BgS2CWBl989fViAd45JSfFovSpvz0MytyBHRjp9IvBv16IKLI5D+ZQrx+MkkIeA9R3UpuDwFfNlVdY1cgtSjjT9Hvky54KKD9arYn1bzjkdAySwI4GZ1+k+fX1wfl9dgYvjUK7KSq8VQZzvIijwbLwW0zAkSdaNMU8CVgLlSGMBBsZ8qq+4M67K8dY5t+XyC1LTv4jgHY7nfj+oV+WUrJtingSyECjX9HIRXOoY83w9lMz3QcgnyJAGlelI/59Rcmzqunoo6YfN+CCBwgiUIz1LgBHXApJg76w3p8slyMxhPaxP8UfXhgBcVg/lckOOERLITWCgpscFgjtcE4wGOPr+s+XXrtyOx3MJUl6sx0iAX7oWSoCwEcqwK8fjJNAKgf5hfWdJ4f4ntOL0elW+k2WtXIJYjU0U8xpVWZplQ8ySQFYCAyO6X5DA+XkrBS6IQzF9qHbbHnIJUh7WOaK41VUIBXER4vF2ELAKAuDyeiiXZVkzlyD9kX64BPzUtRAFcRHi8XYQyCBI5o+/U5B2nCHO0VUCFKSr+Ll4rxOgIL1+hri/rhKgIF3Fz8V7nQAF6fUzxP11lQAF6Sp+Lt7rBChIr58h7q+rBChIC/grN+hUNPEhFcwUxUEq9jv0tbDseB76HwCPCFDf0MRdrd53qh2gKEgOiuntiPqAoUBxIQR9OabgEAcBBf4LYOGktbi6yB+xcZ0ICuIi9Jrj/TWtlICbIDgo41DGcxBIf3pAgJProazJMbzlIRQkA8LKYj1cAzQst6fMMC2j7qvJi81RHNGNWztREGN7Hn6jTpu0Bb8DsL9xCGPtJbAm2YSBon4ObVdbpSDGk2i+y6NxPsayE1DFYFyVWvaR+UdQECO7Sk2fhWCKMc5YMQT+UQ/lgGKm3vmsFMRAu1LTEyC4zRBlpGACSYBK42yJC15m+/QUxECaT68MkDoU6fTTLApiOLGVSNPnvaEhykjBBBT4YhzKUMHL8AqSBXA50mUCnJFlDLPFEFBgURzKZ4uZ/fWz8gpiIE1BDJA6FKEgPfiddArSoe43LENBKIihTfyNUBAK4m/3GyqnIBTE0Cb+RigIBfG3+w2VUxAKYmgTfyMUhIL42/2GyikIBTG0ib8RCkJB/O1+Q+UUhIIY2sTfCAWhIP52v6FyCkJBDG3ib4SCUBB/u99QOQWhIIY28TdCQSiIv91vqJyCUBBDm/gboSAUxN/uN1ROQSiIoU38jVAQCuJv9xsqpyAUxNAm/kYoCAXxt/sNlVMQCmJoE38jFISC+Nv9hsopCAUxtIm/EQpCQfztfkPlFISCGNrE3wgFoSD+dr+hcgpCQQxt4m+EglAQf7vfUDkFoSCGNvE3QkEoiL/db6icglAQQ5v4G6EgFMTf7jdUTkEoiKFN/I1QEArib/cbKqcgFMTQJv5GKAgF8bf7DZVTEApiaBN/IxSEgvjb/YbKKQgFMbSJvxEKQkH87X5D5RSEghjaxN8IBaEg/na/oXIKQkEMbeJvhIJQEH+731A5BaEghjbxN0JBKIi/3W+onIJQEEOb+BuhIBTE3+43VE5BKIihTfyNUBAK4m/3GyqnIBTE0Cb+RigIBfG3+w2VUxAKYmgTfyMUhIL42/2GyikIBTG0ib8RCkJB/O1+Q+UUhIIY2sTfCAWhIP52v6FyCkJBDG3ib4SCUBB/u99QOQWhIIY28TdCQSiIv91vqJyCUBBDm/gboSAUxN/uN1ROQSiIoU38jVAQCuJv9xsqpyAUxNAm/kYoCAXxt/sNlVMQCmJoE38jFISC+Nv9hsopCAUxtIm/EQpCQfztfkPlFISCGNrE3wgFoSD+dr+hcgpCQQxt4m+EglAQf7vfUDkFoSCGNvE3QkF6UJBKpDUAob9t2TuVK/DFOJShTu1oYET3CxI8YVjv2nooFxpy2yOSJbwt29+DgpQjHRJgQZ56OKa9BFQxGFcl/YPVkQcFMWCu1PQECG4zRBkpmEBTcPiK+bKq4GW2T09BjKTLkT4jwFRjnLFiCKyph3JoMVPvfFYKYqTNp1lGUAXGOv30Ki2FghhP6Iyluufum5Fe2g8wDmGsjQQUeDAO5b1tnNI0FQUxYXo5NPN6PaivhF8DeFuGYYy2TmDNZmD2ylDWtj5VthkoSDZeqCzWfRHg5wAOyziU8RwEFPhNsgUfu/9ceSbH8JaHUJAcCI+MdPIEYIEoLoKgL8cUHOIgoMCLUCyc9CQW3TMkzW4BoyAtkK/coFOTBMeL4pAWpuHQVxNQAf6woYm7Vp8jL3QbDgXp9hng+j1NgIL09Onh5rpNgIJ0+wxw/Z4mQEF6+vRwc90mQEG6fQa4fk8ToCA9fXq4uW4ToCDdPgNcv6cJ9Jwg5WGdI4pbXdQ0wdx4UJa5cjxOAq0QsAqiiqvjqnwmy1r5vjA1orNLCe52LZQo5jWqstSV43ESaIWAWRDgS3Eol2ZZK5cglcXajwAN10IUxEWIx9tBwCyI4gtxVa7MsmY+QSJNP7bxsGGhaj2UyJBjhARyEzgq0rcr8DfXBHm+q5JLkMOW68Q91mOTa0OJYmGjKvyeuAsUj7dE4KiaHq2Ce52TKObUq3K7M7dDIJcg6fhypE8IsN9Yi6liSVyVs7JsiFkSyEqgUtPTILjZNU4THBgPyuOu3I7H8wtS0ztEcJxDkNvjqszJsiFmSSArgUqknwNwlaMXX4qrMjnr3PkFiXSBAGPe+0gVL20RvHllKFuybox5ErASKNv+WN8ZV+V465zbcvkFWazvkwC/cS2oipPiqvzEleNxEshDYNb1OmW0hHUASmOOV3yuXpWvZl0jtyDpQpVI1wPY03FpWxZXZW7WjTFPAhYCAzWdGwhuNGQPrYeyxpB7VaRVQdK3cOc7Ft24cQL2f2CepJbzQQJtJVCu6WoRvMvxR/oPcVVm5Fm4JUEGIp0VYOsdRMa+uvHdLBciHs9BoDKs86BY4hqqwEVxKNe4cjs73pIgrzzN+qPl7iGS4N33DUqa5YMEWiaQ3pRjIvBXy+2dRrdgr7x3XGmHIKcAWG6oeE3Qh/7fninPG7KMkMCYBCqRpj2X9p7j6Qu+XK/KJa7Yro63LEg6cbmmq0TgvqOe4u56VT6Yd7McRwJb+y3SKwX4vIuGKjZs3A0HrJorz7myhQrSP6LvLyX4lXET36+HcqoxyxgJvIpAuaYXi+AKCxZVnB9X5RuWbKGCpJNXanozBKdZNpPeiW/jRJzYitmWdZgZRwSGNChPxw0CmP5loMBD8VrMwJAkrVBoy1OsdANHLda3quAhCN5q3NAjTcFHV8yX1cY8Y54SSHsrCbBcgA9YESQB3ts4Wx605gu/gqQLDIxoWUbxWxEElo2pIrX7B+lPdjWq8ifLGGb8ITAwonsHCb6gilAEu1srT4CwEcqwNT9Wrm1XkG2LlGt6kQgW5djcHQB+ggS31AflXznGc8g4IJB+dKRZwkkCfNj0LtXra76xHsqZ7ULRdkHSjZUjHREg98fc09+ZEMVqBR5R4FEt4e9Bc+vVho/xRkCwNwQHQ3EwgENEUM5bogJ3xaGM+QnzrHMXIshWSWp6mwhOyLoh5kkgD4H0RbluwqzG+bIhz/iOvAZ51SLLtVRej/RKYnrXoZ1FcS7PCCh+vllw8spQXmx35YVdQba/Jol0UIDr271xzkcCrxC4vB7KZUXRKFyQdOMzh3VGn+JHAPYvqhDO6xkBxXpVnBwPyj1FVt4RQdICXvmBzfSWK66PxxdZL+ceBwQU+OEW4LxO/B5ixwTZ4SnXAIDrBDhyHJwrltBBAgo8rIoLGlW5s1PLdlyQbYVVapq+w3UJBO/vVLFc5/+TgAIrVXFFI8QPIaKdrKJrgmy/oozooek9fEVxugj27WTxXKuHCSieVsF3A8FN982XFd3aadcF2bHwcqRHiGK2AseKIP2KJH/rvFud0eF1FXhKFKsA3KuCX8ShOG9t24kt9pQgry144Ou6h07EYQEwXQV7CbAXgImdAMM1iiMgwGiiSH9T/WlRrN04Cat79ZPdPS1IcaeIM5OAjQAFsXFiylMCFMTTE8+ybQQoiI0TU54SoCCenniWbSNAQWycmPKUAAXx9MSzbBsBCmLjxJSnBCiIpyeeZdsIUBAbJ6Y8JUBBPD3xLNtGgILYODHlKYH/AXTGe24lPXcPAAAAAElFTkSuQmCC");
}
.lv_tree_element_wrap .lv_icon.lv_icon_check {
  width: 24px;
  height: 24px;
  margin: 8px;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAARpklEQVR4Xu2de5Ac1XWHf2dmdwXCFkiWLCl24SIGB1tFEFZpd1YILBGgrAIclysohkqVS+LRswhwTGzjohzYQCUBJ5iEAJrZRUjl8isCR0kIMgGEhXhMr2QFGSyLPPxIkVgYBUQkl5G0O31SvUhEMrtzb7+mu6d/82+fe8+537nf9ExPz4yADxIggUkJCNmQAAlMToCCcHeQQAsCFITbgwQoCPcACYQjwDNIOG4cVRACFKQgjeYywxGgIOG4cVRBCFCQgjSaywxHgIKE48ZRBSFAQQrSaC4zHAEKEo4bRxWEQGYFWXyfTj/UhVmlJmZJCbPUwywRzFTBlIL0pmOXKUDTU7xWEuxRD3uaZezpbmLPcwPyatYWnRlBFt2vH9AmLlbFeQIshWB61mCxnjYQUGxSwZMAHnUd+Zc2ZGyZIlVBfvtresLUN3EZgM8IsDhtGMyfOQIvKfD1UeCB7Y7sTqO6VASZv1ZPmnIQnxPBtQLMSGPhzJkjAoqDEKxrlnDH1qvkp+2svL2CDGqpbw6uE+BWEUxr50KZqwMIKMZU8Nf7xzC4c5X8sh0rapsgC4d0flnxNQHOaMfCmKNzCSjwCw+4YqsjjyS9yrYIUqnrgCjuAq9AJd3PQs3vAX9x/G7ctHlQxpJaeOKCVOq6ToDPJLUAzltwAoot3iFcMnK97EuCRGKCLBnUroNzsAGCi5MonHOSwBECCrwgZSxtXCmvx00lMUEqNX1MBBfEXTDnI4GJCCiw62A3Pvb8StkTJ6FEBKnUdaMAy8IUqsB/QfGPAvwUJfjPCHs9xRviQcPMxzHZJiBlvMsDpsPDjJJgjgIXCvDRMFUr8KKUsSTOM0nsgvTX9EEIfi/IAlWxT4A7IdjQcOTFIGMZ23kE+oZ1tni4BMCNApwacIXbGo70BhwzaXisgvTX9Q8B3GVdnGIMgjrKuDlO663zMzDTBMbfx87FtQBuAXCSbbGqqLlVGbCNbxUXmyD9q7UXJYzYFuWfDlXx6ZGq/Mh2DOOKSaD3Hn1PqQtrRcbPKlYP9fD77oCstwpuERSPIINaqszFDtsPAVWx5rgpuHbzCjkQdQEcXxwClZreAMHtAnSbVq3A/+wfwylRP3GPRZBKTa8Twd2mov3jHvD5EUfutIllDAn8OoHeYT2v7GGTJZm/ajjyOcvYCcMiC7KgrlO7gZ8LcKKpEAX+1nXk06Y4HieBVgSs3+sqxsaa+M1tq+TlsEQjC1Kp66C89Saq9UPx/L4ZqOxcLodMoTxOAiYClbp+Q4DLTXGqWOdWZYUpbrLjkQQ5e42+uzmGVwSYaipgtInTv3+N/KspjsdJwIaA/12iE96Ef+v7LFO8ejjFHZCfmeImOh5JkP4hXQnFGlPiOC+7mXLxeHEI9Nd1FYB7jCtW3NKoyq3GuAkCoglS06cgOLdVYgV+daAH79uxQt4IUyDHkMCkBN66erpLgA+1pKT4SaMqHwxDMrQgC+o6twf4uSmpAqtdR64xxfE4CYQhYHsFdUxw1rarZUfQHKEFqdTV/x75OmNCxfmNqtheljNOxwASOJrAwnt1TlcXjN9XV+BG15GvBKUXRRDjVQQFXnd3YxYGxQtaGONJwJZApa6uAH0tX+orHnercqHtnEfiwgtS038TwWmG134PNapyadCiGE8CQQhUanqbCL5sGLO/4Ujg30EIJ8iglvrnwv88o2wo6t6GI/7NZnyQQGIEKnW9UoBhUwLxMDvoj9OFEmThkM7rUvzQVBCAmxuO3GYRxxASCE2gr6YXlASPmSZolnDu1qvkaVPc0cdDCVJZrUukhO+ZEnmAM+LIkCmOx0kgCoHeIf1QWWH+EFpxeaMq3wqSK5QgtsZ6ipUjVVkbpCDGkkBQAn3D+v6SB+P9Vgp81nXE6qbaIzWEEqQypMtEsdG0EApiIsTjcRCwFQTAbQ1Hbg6SM5QgvXW9qAz8kykRBTER4vE4CAQQJPDt7xQkjg5xjlQJUJBU8TN51glQkKx3iPWlSoCCpIqfybNOgIJkvUOsL1UCFCRV/EyedQIUJOsdYn2pEqAgqeJn8qwToCBZ7xDrS5UABUkVP5NnnQAFyXqHWF+qBChIqviZPOsEKEjWO8T6UiVAQVLFz+RZJ0BBst4h1pcqAQqSKn4mzzoBCpL1DrG+VAlQkFTxM3nWCVCQrHeI9aVKgIKkip/Js06AgmS9Q6xvnID/h0peE2egibHGgGxtFxYK0i7SzBOKQH9NrwCwSoEzRVAan8T/5U3BHzcc+ftQkwYYREECwGJo+wgsGdSuA3PwDREsb5E18G9RBV0BBQlKjPGJE/DlODgX/tnhIlOyJnDxVkceMcWFPU5BwpLjuEQIBJHjrVdb2OU68pFEigFAQZIiy3kDEwgqx5EESf7LMQUJ3EYOSIJAWDn8Wpol/M7Wq+TJJOqiIElQ5ZyBCESRY1wQxcKtVfl+oKSWwRTEEhTDkiEQVQ5VvObOwGwsl2YSFVKQJKhyTisCUeXwk3jA50ccudMqYYggChICGodEJ7Cgrt09wAabS7mTZlNsabyCpUn+0zEFid5rzhCQgC9Ht+IREVwQcOjb4QqM7B/D+TtXyS/DzmEzjoLYUGJMbATyJIe/aAoSW+s5kYlA3uSgIKaO8nhsBPIoBwWJrf2cqBWBvMpBQbivEyeQZzkoSOLbo9gJ8i4HBSn2/k109Z0gBwVJdIsUd/JOkYOCFHcPJ7byTpKDgiS2TYo5cafJQUGKuY8TWXUnykFBEtkqxZu0U+WgIMXby7GvuJPloCCxb5diTRiHHFA8v6+Jc5O+KzdsZ3izooHcgrpO7QIGSjp+a3YvBNOh8L///GeNqmwKCz7v4069W6fM7MHDUW5Z9+U4JFi63ZH/zSoPCtKiM301Pa0keALAyZOE1RvTsSqpr3tmddMcluNRESwJXWMO5OBLrBbd7f+qHq9T8QMRnNZqE6higzsDlxZFkiLJQUFa7PxKXb8owB02z5BFkaRoclCQVmeQmr4EwW/ZCOLHdLokRZSDgky2+1WlMoSmAGIrSCdLUlQ5KEgLQfqHMAqgHESQTpSkyHJQkFbvQWr6jAjODipIJ0lSdDkoSKv3IHW9FMD6MIJ0giSU463O83OQ1meR74rg40WThHL8f8cpSIvdP+9efde7u/CEAH1FkYRyHNtpCmLY+UWShHK8czNQEItTQxEkoRwTbwQKYiGIH9LJklCOyTcBBbEU5Igk08rYAsFZAYYdE5q1T9wpR+tOUpCAO31BXU/sUXyvEyShHObmUxAzo3dEdIIkh+9W3liEW9ZDtPjtIRQkJL08S+LLgRPGv+eyKOTy/f9fzvyXnUKv7aiBFCQCxTxKQjmCNZyCBOOV65dblCN4sylIcGa5lIRyhGs0BQnHLVeSUI7wTaYg4dnlQhLKEa3BFCQav0xLQjmiN5eCRGeYSUkoRzyNpSDxcExMkuNewfLNgzIWpEzKEYRW61gKEh/LCSXpBp4W4IwIaR6ZshuftJWEckQgPcFQChIvz3fM1n+/ztAmNrdDEsoRfzMpSPxMU5GEciTTSAqSDNe2ShKHHAq8OAqck+Ufkm5Tq45JQ0HaSD2Jl1txySFlLGlcKa+3EUcuUlGQNrcpTkkOTkN31Lty/TMH5Zh8E1CQNgvip4tDElX8nQjmRLllnXKYm09BzIwSiYhDkiiFUQ47ehTEjlMiUWlJQjns20lB7FklEtluSShHsDZSkGC8EolulySUI3j7KEhwZomM8CVBE88COD2JBJQjHFUKEo5bIqPOekBnHTeKLXFLQjnCt4uChGeXyMi4JaEc0dpEQaLxS2R0XJJQjujtoSDRGSYyQ1RJKEc8baEg8XBMZJawklCO+NpBQeJjmchMQSWhHPG2gYLEyzOR2WwloRzx46cg8TNNZMbee/Q9pW58W4DzJ0qgio1dHv7gmWtkbyIFFHRSCpKnxqtKpYbLIbhJBB9RxcsicNXDQ24VD0JE87ScPNRKQfLQJdaYGgEKkhp6Js4DAQqShy6xxtQIUJDU0DNxHghQkDx0iTWmRoCCpIaeifNAgILkoUusMTUCFCQ19EycBwIUJA9dYo2pEaAgqaFn4jwQoCB56BJrTI0ABUkNPRPngQAFyUOXWGNqBChIauiZOA8EKEgeusQaUyNAQVJDz8R5IEBB8tAl1pgaAQqSGnomzgMBCpKHLrHG1AhQkNTQM3EeCFCQPHSJNaZGIHOCVIZ0mSg2moiohxXugKwzxfE4CUQhYCuIKr7qVuWPguSSIMFHYnuH9byyh02msZ5i5UhV1prieJwEohCwFgT4U9eRLwfJFUqQ/tXaixJGTIkoiIkQj8dBwFoQxZfcqtwRJGc4Qerq/8PSLotE1YYjdYs4hpBAaAKL6vpBBf7DNIEqBtyq1ExxRx8PJci89dozbS8OmhJ5iltHqnKLKY7HSSAKgUU1PVcFTxnnUCxrVOVRY9xRAaEE8cdX6vqyAO9vlUwVa9yqXBmkIMaSQFAC/TW9DIJvmsaph1PcAfmZKS7yGWRckJo+JoILDII86lZlWZCCGEsCQQn01/ULAL5i2ItvulWZGnTuKGeQWwQYNBU1KjhxuyOjQQtjPAnYErB8sn7crcqFtnMeiQsvyGo9W0p4xpRQFZ9wq/KwKY7HSSAMgcX36fRmGXsAlFuOV3yhUZW/DJojtCB+ov66+v9zcZLhLLLOrcqKoIUxngRsCPTVdEVJ8IBF7IcbjrxkEXdMSFRB/Eu4VxuSHjjQjZOfXym+5XyQQKwEKjXd6f8Pi+FJ+gduVeaHSRxJkL66Li4BT5sS82qWiRCPhyHQP6QroVhjGqvADa4jd5niJjoeSZDDL7N+CGCeKbl4OOO5AfFj+SCByAQW1HVqD/DvAH7DNFlzFDO3XiuvmeKSEuRSAOstkr9U6kLvs1fIfotYhpBASwL9dfX3nL/3Wj8Uf96oyk2msMmORz6D+BNXarpDBGcai1BsalRlwj+4NI5lAAkcJlCp6x0CfNEERBX7DkzBB3askDdMsYkK0jus55Q9bLEs4sGGI8stYxlGAscQqNT0RhHcboNFFde7Vfkbm9hEBfEn76/pNyG4zKYYBZ450INLophtk4cxHURgUEuVubhfAKuPDPz/o3d3Yz4GxYtCIZaXWH4Bi1bre1XwIgTvtSzox2OC3912tey0jGdYQQn4e8srYb0AH7NF4JVw5shV8oJtfOJnED9B37BWpIlnRVCyKUwVvt0PKfAnI1X5kc0YxhSHQN+wzi55+JIqHBEcb7tyD3BGHBmyjW8VF9sZ5EiSSk1vEMGdIYp7DMDD8LChMSD/HWI8h3QAAf/WkbEyPiHARVZXqd655gcajlwRF4rYBfELq9R1WIDQt7kr8IIodirwYwV+omX8Z2ls/GzDR6cREMyG4FQoTgVwuggqYZeowBOuIy3vMA86dyKCjEtS0++K4ONBC2I8CYQh4L8p14NYPHK97Aszvi3vQY5Jsl7Llb3wzyRWVx3iXBTnKhgBxT8fEnxquyO/invliZ1B3n5PUtcBAe6Lu3DORwKHCdzWcOTmpGgkLohf+MIhnd+l+AcAJye1EM5bMAKKvar4lDsgm5NceVsE8Rcwf62edPwh+D+5Yro9Psn1cu4OIKDAd0aB67Y7sjvp5bRNkKNecvUBuFeABUkvjvN3FgEFdqnisyNVebxdK2u7IEcW1l9T/wrXTRCc067FMk8+CSiwXRW3jzj4DkS0natITZC3zyjD+mH/N3xFcbkI3tfOxTNXhgkoXlXBt0uCrz93tWxLq9LUBTl64ZW6flQU5ymwVAT+VySNX4ZJCxzzxktAgV+IYgeAp1TwpOuI8adt461g4tkyJcivl9h3t07THswrAXNVMFOAmQB62gGGOZIjIEDTU/jf8HtVFLsPHIedWb2zO9OCJNcizkwCdgQoiB0nRhWUAAUpaOO5bDsCFMSOE6MKSoCCFLTxXLYdAQpix4lRBSVAQQraeC7bjgAFsePEqIISoCAFbTyXbUeAgthxYlRBCVCQgjaey7YjQEHsODGqoAT+DyS/eX0SZxD3AAAAAElFTkSuQmCC");
}
.lv_tree_element_wrap .lv_icon.lv_icon_noCheck {
  width: 24px;
  height: 24px;
  margin: 8px;
  background-image: url("data:image/png;base64,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");
}
.lv_tree_element_wrap .lv_icon.lv_icon_show {
  background-image: url("data:image/png;base64,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");
}
.lv_tree_element_wrap .lv_icon.lv_icon_hide {
  background-image: url("data:image/png;base64,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");
}
</style>
