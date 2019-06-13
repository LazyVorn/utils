<template>
  <div style="width:100%;height:100%;">
    <span @click="btnClick('subcontractorId')">分包单位</span>
    <span @click="btnClick('position')">部位</span>
    <span @click="isEdited = !isEdited">点击编辑</span>
    <plan-table
      style="width:90%;height:90%;margin:10px 5%;"
      :headData="headList"
      :bodyData="demoList"
      :bakData="bakList"
    ></plan-table>
  </div>
</template>

<script>
import demo from "../components/PlanTable/demo";
import PlanTable from "../components/PlanTable/PlanTable";
export default {
  name: "Plan",
  components: { PlanTable },
  data() {
    return {
      bodyList: demo.list,
      orderMap: {},
      bakList: [],
      demoList: [],
      isEdited: false,
      paramObj: {
        subcontractorId: {
          key: "subcontractorId",
          valueKey: "subcontractorName",
          nullValue: "未指定单位"
        },
        position: {}
      },
      headRender: {
        segmentTaskName: this.segmentTaskName,
        planStartTime: this.planStartTime,
        planFinishTime: this.planFinishTime,
        realStartTime: this.realStartTime,
        realFinishTime: this.realFinishTime
      },
      headList: [
        {
          name: "checkbox",
          width: "44px",
          id: "checkbox",
          disabled: true,
          value: "checkbox"
        },
        {
          name: "序号",
          width: "44px",
          id: "order",
          disabled: true,
          value: "order"
        },
        {
          id: "segmentTaskName",
          hasArrow: true,
          businessEntity: "bim5d_weekly_plan_item",
          name: "名称",
          dataType: 0,
          isSystem: 1,
          isRequired: 0,
          defaultValue: null,
          orderNo: 1,
          isMobileKeep: 0,
          isDelete: 0,
          createTime: null,
          createUserId: null,
          dynamicEnumColumnOptionList: [],
          value: "segmentTaskName",
          disabled: true,
          width: "360px"
        },
        {
          id: "offsetTime",
          businessEntity: "bim5d_weekly_plan_item",
          name: "偏差天数",
          dataType: 1,
          isSystem: 1,
          isRequired: 0,
          defaultValue: null,
          orderNo: 2,
          isMobileKeep: 0,
          isDelete: 0,
          createTime: null,
          createUserId: null,
          dynamicEnumColumnOptionList: [],
          value: "offsetTime",
          width: "75px"
        },
        {
          id: "dep",
          businessEntity: "bim5d_weekly_plan_item",
          name: "前置任务",
          dataType: 0,
          isSystem: 1,
          isRequired: 0,
          defaultValue: null,
          orderNo: 3,
          isMobileKeep: 0,
          isDelete: 0,
          createTime: null,
          createUserId: null,
          dynamicEnumColumnOptionList: [],
          value: "dep",
          width: "100px"
        },
        {
          id: "costDay",
          businessEntity: "bim5d_weekly_plan_item",
          name: "计划工期",
          dataType: 2,
          isSystem: 1,
          isRequired: 0,
          defaultValue: null,
          orderNo: 4,
          isMobileKeep: 0,
          isDelete: 0,
          createTime: null,
          createUserId: null,
          dynamicEnumColumnOptionList: [],
          value: "costDay",
          width: "90px"
        },
        {
          id: "planStartTime",
          businessEntity: "bim5d_weekly_plan_item",
          name: "计划开始",
          dataType: 2,
          isSystem: 1,
          isRequired: 0,
          defaultValue: null,
          orderNo: 5,
          isMobileKeep: 0,
          isDelete: 0,
          createTime: null,
          createUserId: null,
          dynamicEnumColumnOptionList: [],
          value: "planStartTime",
          width: "120px"
        },
        {
          id: "planFinishTime",
          businessEntity: "bim5d_weekly_plan_item",
          name: "计划完成",
          dataType: 2,
          isSystem: 1,
          isRequired: 0,
          defaultValue: null,
          orderNo: 6,
          isMobileKeep: 0,
          isDelete: 0,
          createTime: null,
          createUserId: null,
          dynamicEnumColumnOptionList: [],
          value: "planFinishTime",
          width: "120px"
        },
        {
          id: "creatorName",
          businessEntity: "bim5d_weekly_plan_item",
          name: "创建人",
          dataType: 0,
          isSystem: 1,
          isRequired: 0,
          defaultValue: null,
          orderNo: 7,
          isMobileKeep: 0,
          isDelete: 0,
          createTime: null,
          createUserId: null,
          dynamicEnumColumnOptionList: [],
          value: "creatorName",
          width: "120px"
        },
        {
          id: "responsibleName",
          businessEntity: "bim5d_weekly_plan_item",
          name: "责任人",
          dataType: 0,
          isSystem: 1,
          isRequired: 0,
          defaultValue: null,
          orderNo: 8,
          isMobileKeep: 0,
          isDelete: 0,
          createTime: null,
          createUserId: null,
          dynamicEnumColumnOptionList: [],
          value: "responsibleName",
          width: "120px"
        },
        {
          id: "subcontractorName",
          businessEntity: "bim5d_weekly_plan_item",
          name: "分包单位",
          dataType: 0,
          isSystem: 1,
          isRequired: 0,
          defaultValue: null,
          orderNo: 9,
          isMobileKeep: 0,
          isDelete: 0,
          createTime: null,
          createUserId: null,
          dynamicEnumColumnOptionList: [],
          value: "subcontractorName",
          width: "120px"
        },
        {
          id: "realDay",
          businessEntity: "bim5d_weekly_plan_item",
          name: "实际工期",
          dataType: 1,
          isSystem: 1,
          isRequired: 0,
          defaultValue: null,
          orderNo: 11,
          isMobileKeep: 0,
          isDelete: 0,
          createTime: null,
          createUserId: null,
          dynamicEnumColumnOptionList: [],
          value: "realDay",
          width: "90px"
        },
        {
          id: "realStartTime",
          businessEntity: "bim5d_weekly_plan_item",
          name: "实际开始",
          dataType: 2,
          isSystem: 1,
          isRequired: 0,
          defaultValue: null,
          orderNo: 12,
          isMobileKeep: 0,
          isDelete: 0,
          createTime: null,
          createUserId: null,
          dynamicEnumColumnOptionList: [],
          value: "realStartTime",
          width: "120px"
        },
        {
          id: "realFinishTime",
          businessEntity: "bim5d_weekly_plan_item",
          name: "实际完成",
          dataType: 2,
          isSystem: 1,
          isRequired: 0,
          defaultValue: null,
          orderNo: 13,
          isMobileKeep: 0,
          isDelete: 0,
          createTime: null,
          createUserId: null,
          dynamicEnumColumnOptionList: [],
          value: "realFinishTime",
          width: "120px"
        },
        {
          id: "remark",
          businessEntity: "bim5d_weekly_plan_item",
          name: "备注",
          dataType: 0,
          isSystem: 1,
          isRequired: 0,
          defaultValue: null,
          orderNo: 14,
          isMobileKeep: 0,
          isDelete: 0,
          createTime: null,
          createUserId: null,
          dynamicEnumColumnOptionList: [],
          value: "remark",
          width: "120px"
        },
        {
          id: "gantt",
          businessEntity: "bim5d_weekly_plan_item",
          name: "横道图",
          dataType: 0,
          isSystem: 1,
          isRequired: 0,
          defaultValue: null,
          orderNo: 15,
          isMobileKeep: 0,
          isDelete: 0,
          createTime: null,
          createUserId: null,
          dynamicEnumColumnOptionList: [],
          value: "gantt",
          width: "350px"
        },
        {
          id: "227458620042801152",
          businessEntity: "bim5d_weekly_plan_item",
          name: "日期",
          dataType: 2,
          isSystem: 0,
          isRequired: 0,
          defaultValue: null,
          orderNo: 18,
          isMobileKeep: 1,
          isDelete: 0,
          createTime: 1555464929000,
          createUserId: "232213917065216",
          dynamicEnumColumnOptionList: [],
          value: "227458620042801152",
          width: "120px"
        },
        {
          id: "227458677391519744",
          businessEntity: "bim5d_weekly_plan_item",
          name: "布尔",
          dataType: 3,
          isSystem: 0,
          isRequired: 0,
          defaultValue: null,
          orderNo: 19,
          isMobileKeep: 1,
          isDelete: 0,
          createTime: 1555464943000,
          createUserId: "232213917065216",
          dynamicEnumColumnOptionList: [],
          value: "227458677391519744",
          width: "80px"
        }
      ]
    };
  },
  created() {
    this.headList.forEach(ele => {
      if (this.headRender[ele.id]) {
        ele.render = this.headRender[ele.id];
      }
    });
    this.btnClick("subcontractorId");
  },
  methods: {
    // 重新渲染
    overload() {},
    //点击上下移
    orderClick(ele, type) {
      // this.$post(this.$api.changeItemOrder(this.projectId, ele.itemId, type), {
      //     periodId: this.periodId,
      //     segmentId: ele.segmentId,
      //     page: -1,
      //     responsibleIds: ele.responsibleId
      // }).then(res => {
      //     // this.activeTr = ele;
      //     // this.editDay = ele.costDay;
      //     // this.editName = ele.segmentTaskName;
      //     this.overload();
      // });
    },
    //插入新任务的按钮
    insetClick(ele) {
      this.$emit("insetTask", ele);
    },
    //插入新任务的按钮
    editSpeClick(ele) {
      this.$emit("editSpeTask", ele);
    },
    //计划的日期变更
    dateChange(type, ele, newTime) {
      let _key = type == "start" ? "planStartTime" : "planFinishTime",
        _time = newTime;
      console.log(type, ele, newTime);
      // this.activeTr[_key] = newTime;
      // if(ele.dep != "" && type == 'start'){
      // this.dateDepObj = {
      //     obj:ele,
      //     type:'start',
      //     time:_time
      // }
      // this.dateDepCheck = true;
      // } else {
      // this.changeFunc(_key, _time);
      // }
    },
    //start--这里放各列的render函数
    segmentTaskName(h, params) {
      let _obj = params.row;
      if (_obj.isClicked && this.isEdited) {
        let _arr = [
          h("i", {
            domProps: {
              className: "bimicon up_btn icon-xiajiantou-copy"
            },
            on: {
              click: _obj => this.orderClick(_obj, "up")
            }
          }),
          h("i", {
            domProps: {
              className: "bimicon down_btn icon-xiajiantou"
            },
            on: {
              click: _obj => this.orderClick(_obj, "down")
            }
          }),
          h("i", {
            domProps: {
              className: "bimicon inset_btn icon-zaihoumiancharuxinmuluxiang",
              title: "插入新任务"
            },
            on: {
              click: _obj => this.insetClick(_obj)
            }
          })
        ];
        _obj.segmentId && _obj.segmentId.toString().includes("-1")
          ? _arr.push(
              h("i", {
                domProps: {
                  className: "bimicon edit_btn icon-bianji",
                  title: "编辑该任务"
                },
                on: {
                  click: _obj => this.editSpeClick(_obj)
                }
              })
            )
          : "";
        let _input = h("input", {
          domProps: {
            value: _obj.segmentTaskName,
            className: "table_input"
          },
          on: {
            "on-change"(event) {
              _obj.segmentTaskName = event.target.value;
            },
            blur(event) {}
          }
        });
        return h(
          "span",
          {
            domProps: {
              className: "edit_name"
            }
          },
          _obj.isLast
            ? [_input, ..._arr]
            : [h("span", _obj.segmentTaskName || "")]
        );
      } else {
        return h("span", _obj.segmentTaskName || "");
      }
    },
    planStartTime(h, params) {
      let _obj = params.row;
      if (_obj.isLast) {
        return h("date-input", {
          props: {
            isEditing: _obj.isClicked && this.isEdited,
            date: _obj.planStartTime,
            compareTime: _obj.planFinishTime,
            type: "start"
          },
          on: {
            change: event => this.dateChange("start", _obj, event)
          }
        });
      } else {
        return h("span", "");
      }
    },
    planFinishTime(h, params) {
      let _obj = params.row;
      if (_obj.isLast) {
        return h("date-input", {
          props: {
            isEditing: _obj.isClicked && this.isEdited,
            date: _obj.planFinishTime,
            compareTime: _obj.planStartTime,
            type: "start"
          },
          on: {
            change: event => this.dateChange("finish", _obj, event)
          }
        });
      } else {
        return h("span", "");
      }
    },
    realStartTime(h, params) {
      let _obj = params.row;
      if (_obj.isLast) {
        return h("date-input", {
          props: {
            isEditing: false,
            date: _obj.realStartTime,
            compareTime: _obj.realFinishTime,
            type: "start"
          }
        });
      } else {
        return h("span", "");
      }
    },
    realFinishTime(h, params) {
      let _obj = params.row;
      if (_obj.isLast) {
        return h("date-input", {
          props: {
            isEditing: false,
            date: _obj.realFinishTime,
            compareTime: _obj.realStartTime,
            type: "finish"
          }
        });
      } else {
        return h("span", "");
      }
    },
    // planStartTime(h,params){
    //     let _obj = params.row;
    //     if(_obj.isClicked && this.isEdited && _obj.isLast){

    //     } else {
    //         return h('span',_obj.planStartTime)
    //     }
    // },
    //end--这里放各列的render函数
    btnClick(type) {
      let _params = this.paramObj[type];
      let _return = this.dealTaskData(this.bodyList, _params);
      this.bakList = _return.bakList;
      this.demoList = _return.list;
      this.orderMap = _return.orderMap;
    },
    // 获取任务列表并准备组装
    dealTaskData(arr, params) {
      let _mark = 0,
        _orderMap = {},
        _arr = [],
        _return = {},
        _bakList = [];
      if (params && params.key) {
        _arr = this.dealGroupByKey({ arr: arr, ...params });
        _bakList = [..._arr];
        _arr.forEach(ele => {
          _mark++;
          ele.order = _mark;
          _return = this.dealGroupByPosition({
            obj: ele,
            arr: ele.children,
            mark: _mark,
            orderMap: _orderMap
          });
          ele.children = _return.list;
          _mark = _return.mark;
          _bakList = [..._bakList, ..._return.bakList];
        });
      } else {
        _return = this.dealGroupByPosition({
          obj: null,
          arr: arr,
          mark: 0,
          orderMap: _orderMap
        });
        _arr = _return.list;
        _bakList = [..._bakList, ..._return.bakList];
      }
      arr.forEach(_ele => {
        _ele.dep = _ele.dependentItemId
          ? _orderMap[_ele.dependentItemId] + _ele.dependentExpression
          : "";
      });
      return {
        list: _arr,
        orderMap: _orderMap,
        bakList: _bakList
      };
    },
    // 如果按制定条件分类，则调用该方法
    dealGroupByKey(arg) {
      let _arr = [],
        _obj = {},
        _boxArr = [],
        { arr, key, valueKey, nullValue } = arg;
      arr.forEach(ele => {
        if (!ele[key]) {
          if (_obj[-2]) {
            _obj[-2].push(ele);
          } else {
            _obj[-2] = [ele];
            _boxArr.push({
              id: -2,
              segmentTaskName: nullValue,
              children: [],
              isShow: true,
              isChoosed: false,
              isClicked: false,
              layer: 1,
              parentId: null
            });
          }
        } else if (_obj[ele[key]]) {
          _obj[ele[key]].push(ele);
        } else {
          _obj[ele[key]] = [ele];
          _boxArr.push({
            id: ele[key],
            segmentTaskName: ele[valueKey],
            children: [],
            isShow: true,
            isChoosed: false,
            isClicked: false,
            layer: 1,
            parentId: null
          });
        }
      });
      _boxArr.forEach(ele => {
        ele.children = _obj[ele.id];
      });
      return _boxArr;
    },
    //处理实际工期的方法
    dealRealCostDay(ele) {
      if (!ele.realFinishTime || !ele.realStartTime) {
        return "";
      }
      let _start = parseFloat(this.$Util.changeDate(ele.realStartTime)),
        _end = parseFloat(this.$Util.changeDate(ele.realFinishTime)),
        _halfDay = 3600000 * 12;
      if (new Date(ele.realStartTime).getHours() >= 12) {
        _start += _halfDay;
      }
      if (new Date(ele.realFinishTime).getHours() >= 12) {
        _end += _halfDay * 2;
      } else {
        _end += _halfDay;
      }
      return (_end - _start) / (_halfDay * 2);
    },
    //组装“流水段+任务”层级
    dealGroupByPosition(arg) {
      let { obj, arr, mark, orderMap } = arg,
        _pId = obj ? obj.id : null,
        _arr = [], //最外层数组
        _obj = {}, //造层级用的临时对象
        activeObj = {}, //被选中的行
        _orderItemId = [], //前置任务的前置id集合
        _bakList = [];
      arr.forEach(ele => {
        let _dyArr = ele.dynamicColumnValueList || [];
        if (ele.offsetTime) {
          ele.delayType = ele.offsetTime > 0 ? -1 : 1;
        } else {
          ele.delayType = 1;
          ele.offsetTime = "";
        }
        ele.id = ele.itemId;
        ele.bakSegmentId
          ? (ele.segmentId = ele.bakSegmentId)
          : (ele.bakSegmentId = ele.segmentId);
        ele.isLast = true;
        this.$set(ele, "isClick", false);
        this.$set(ele, "isChoosed", false);
        ele.placement = "1";
        ele.realDay = this.dealRealCostDay(ele);
        ele.participantArr = ele.participantIds || "";
        _dyArr.forEach(info => {
          let _value = info.columnValue;
          if (info.dataType == 2) {
            _value = this.$Util.changeDateFormat(
              parseFloat(_value),
              "-",
              "",
              "minutes"
            );
          } else if (info.dataType == 3) {
            _value = _value == "true" ? "是" : "否";
          }
          ele[info.dynamicColumnId] = _value;
        });
        //如果为null代表属于手动添加的任务
        if (ele.segmentTaskId == null) {
          if (ele.positionId == null || ele.positionId == "") {
            //该类型属于无部位任务
            ele.segmentId = _pId ? `-1_${_pId}` : -1;
          } else {
            //该类型属于手动添加但有部位的任务
            ele.segmentId = _pId ? `${ele.positionId}_${_pId}` : ele.positionId;
            ele.segmentName = ele.positionName;
          }
        } else {
          ele.segmentId = _pId ? `${ele.segmentId}_${_pId}` : ele.segmentId;
        }
        ele.parentId = ele.segmentId;
        if (!_obj[ele.segmentId]) {
          mark++;
          _obj[ele.segmentId] = {
            id: ele.segmentId,
            parentId: obj ? obj.parentId : null,
            order: mark,
            segmentType: ele.segmentId,
            segmentTaskName: ele.segmentId.toString().includes("-1")
              ? "无部位"
              : ele.segmentName,
            children: [],
            isShow: true,
            isChoosed: false,
            isClicked: false,
            layer: obj ? obj.layer + 1 : 1
          };
          _orderItemId.push(_obj.id);
          _arr.push(_obj[ele.segmentId]);
          _bakList.push(_obj[ele.segmentId]);
        }
        mark++;
        ele.order = mark;
        orderMap[ele.itemId] = mark;
        _orderItemId.push(ele.itemId);
        ele.layer = _obj[ele.segmentId].layer + 1;
        _obj[ele.segmentId].children.push(ele);
        _bakList.push(ele);
      });
      return {
        list: _arr,
        mark: mark,
        bakList: _bakList
      };
    }
  }
};
</script>

<style lang="less">
.edit_name {
  display: inline-block;
  position: relative;
  width: 100%;
  .inset_btn,
  .edit_btn {
    position: absolute;
    left: 18px;
    top: 10px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    color: #aaa;
    &:hover {
      color: #6a7ab5;
    }
  }
  .edit_btn {
    left: 38px;
  }
  .up_btn,
  .down_btn {
    position: absolute;
    left: 0px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color: #aaa;
    &:hover {
      color: #6a7ab5;
    }
  }
  .up_btn {
    top: 2px;
  }
  .down_btn {
    bottom: 2px;
  }
  input {
    width: 70%;
    float: right;
    text-align: left;
    text-indent: 5px;
    // margin-right: 5px;
    margin: 5px 4%;
    height: 30px;
    border: 1px solid #ddd;
    border-radius: 6px;
  }
  &:hover {
    .inset_btn,
    .up_btn,
    .down_btn {
      color: #6a7ab5;
    }
  }
}
</style>
