/*
 * @Name: 树形表格单元组件
 * @Author: 李荣男
 * @Date: 2018-06-08 14:32:42
 * @Last Modified by: 李荣男
 */
<template>
    <div class="lv_tree_element_wrap">
        <div class="lv_tree_element_table" v-for="info in treeData" :key="info.id">
            <div class="lv_tree_table_title" @click.stop="liClick(info,$event)" :class="[info.isClicked ? 'active' : '',`layer${treeLayer}`]">
                <template v-for="(ele,index) in order">
                    <span v-if="ele == 'name'" class="lv_ele_td lv_hasArrow" :style="{paddingLeft:left + 'px',width:width[index] + 'px'}" :title="info[order[index]]">
                        <i class="lv_icon" v-if="(info.childNode && info.childNode.length != 0) || info[pIdName] ==''" :class="info.isShow ? 'lv_icon_show' : 'lv_icon_hide'" @click.stop="arrowClick(info)"></i>
                        {{info[order[index]]}}
                    </span>
                    <span v-else-if="ele == 'checkbox'" class="lv_ele_td" :style="{width:width[index] + 'px'}" :title="info[order[index]]">
                        <i class="lv_icon" @click.stop="checkboxFunc(info)" :class="dealIcon(info)"></i>
                    </span>
                    <span v-else class="lv_ele_td" :title="info[order[index]]" :style="{width:width[index] + 'px'}">{{info[order[index]]}}</span>
                </template>
            </div>
            <div class="lv_tree_table_box" v-show="info.isShow">
                <TreeElement v-if="info.childNode" :treeData="info.childNode" :pIdName="pIdName" :width="width" :treeLayer="treeLayer + 1" @getLiClick="getLiClick" :left="parseInt(left)+25" :order="order" :headData="headData" @getChooseBox="getChooseBox"></TreeElement>
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
    //pid字段名,默认为pId,取决接口返回的JSON数据
    pIdName: {
      type: String,
      default: "pId"
    },
    //递归用的数据
    treeData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    //单元格宽度数组
    width: {
      type: Array,
      default: function() {
        return [];
      }
    },
    //内容数据相对于表格头的映射
    order: {
      type: Array,
      default: function() {
        return [];
      }
    },
    //头部数据
    headData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    //层级
    treeLayer: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  mounted(){
      if(this.treeLayer == 0){
        console.log(Date.now());
          this.$emit("finishLoading",true)
      }
    },
  methods: {
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
    liClick(ele, event) {
      this.$emit("getLiClick", ele);
    },
    //冒泡用,传递高亮行信息
    getLiClick(info) {
      this.$emit("getLiClick", info);
    },
    //收缩事件
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
            !ele.childNode ? "" : this.checkboxChildFunc(ele);
          });
      this.$forceUpdate();
      this.$emit("getChooseBox", e[this.pIdName]);
    },
    // //点击勾选框-找子集
    checkboxChildFunc(e) {
      e.childNode.forEach(ele => {
        this.$set(ele, "isChoosed", e.isChoosed);
        this.$set(ele, "halfChoosed", e.isChoosed);
        !ele.childNode ? "" : this.checkboxChildFunc(ele);
      });
    },
    //准备向上传递用的id
    getChooseBox(pid) {
      let _num = 0,
        _half = 0,
        _obj = this.treeData.filter(ele => ele.id == pid)[0];
      !_obj
        ? ""
        : _obj.childNode.forEach(ele => {
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
    }
  },
};
</script>

<style lang="less">
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
  border-bottom: 1px solid #ddd;
}
.lv_tree_element_wrap .lv_tree_element_table .lv_tree_table_title.active {
  background-color: #d5eaf8;
}
.lv_tree_element_wrap .lv_tree_element_table .lv_tree_table_title .lv_ele_td {
  box-sizing: border-box;
  display: block;
  float: left;
  height: 40px;
  line-height: 42px;
  text-align: center;
  border-left: 1px solid #ddd;
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
  width: 16px;
  height: 16px;
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
  margin: 12px;
  background-image: url("data:image/png;base64,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");
}
.lv_tree_element_wrap .lv_icon.lv_icon_check {
  margin: 12px;
  background-image: url("data:image/png;base64,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");
}
.lv_tree_element_wrap .lv_icon.lv_icon_noCheck {
  margin: 12px;
  background-image: url("data:image/png;base64,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");
}
.lv_tree_element_wrap .lv_icon.lv_icon_show {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAPh0lEQVR4Xu2dB8wuRRWGH0AjFkA6oiJFghQpCoSOAlIiGCBSTAQEUcAgsVGFqAldQCERpIliNFggFBUUVKSp9N6kCCJFmqAihmbeuNdcLvf/v535Zufb2Xkn+XMTmDNzzjP7fju7c2Z2DlxMwASmJDCH2ZiACUxNwALx1WEC0xCwQHx5mIAF4mvABOII+A4Sx81WlRCwQCoZaIcZR8ACieNmq0oIWCCVDLTDjCNggcRxs1UlBCyQSgbaYcYRsEDiuNmqEgIWSCUD7TDjCFggcdxsVQkBC6SSgXaYcQQskDhutqqEgAVSyUA7zDgCFkgcN1tVQqA2gSwEzDvT35yVjPO4Yb4E/AN4FngGeHLcBkuxH6pAVgFWBVYCVgTeC7yjlEEpxM+/ALfO9HcjcHMhvrd2cygCWR3YGFi/+dNdwiU/gb8DlwFXAL8Grs/vQtoeSxbIYsCuwM7Ae9JicWuJCNwGfBc4E/hbojazNlOiQDYFPgdskZWUOxuXwHnAN4FLx20op30pAnkdsCPwJUDPFy7lErgaOAY4G3i572GUIJB1mlv0Mn2Haf+CCNwC7AZcG2SVuXKfBbIg8A1gp8xM3F0+ArqDnAQc2LxGztdzy576KpBtgNOABVrG4WplE3ik+SHUm69elb4J5A3AccBnekXJzuQgoLvJ4cBXAS1M9qL0SSB6xji3WdzrBRw7MRECvwe2BR6dSO+zdNoXgazQLDDpucPFBB4ANgT070RLHwSyMvA74K0TJeHO+0bgr8AGwH2TdGzSAlkTuASYZ5IQ3HdvCWia9UHgzkl5OEmBvK9ZVe1KHM8BVzV/jwGPN+kOykR9oi9z3EkNfES/Su1RNrSmwYsACwP6b+sCWquaO6LNNiYSidq/v03l1HUmJRA9c1ze0Wvcs4BvN9O21Lzc3tQENgH2ah6wU3PSNEuJqA+nbnhUe5MQyFKA0g30a5Sq/As4ETgBeChVo24nisC7gC8Cn0p8V7mjuVs9HeVVpNEkBHJDs1cj0uVXmWnadARwerOZJ0WbbiMNAU3FPtskls6XpkmU8Lh1orZaNZNbIMcCX2jl2fSVXgS+BRzS1xSFBDEOpQnNFI5qtiakuN60iKz0lCwlhcNtHd0MuKht5WnqaRfbDsDtCdpyE/kIrA38OMHOzueB9+ca/1wC0S1Wr+r01mOcol8O3YEEyaU8AlrrOiPBNElbe7Nse8glED0jKLU5trwC7AGcGtuA7XpF4DDgoDE9OqCZuo3ZzPTmOQSi1VCtlMeWF5rNUufENmC7XhLYu3nrGHsN/rs5kKPT9ZFY50KI3wssHWIwS93tgZ+MYW/T/hLYFzh6DPf0TNvp1uuuBbL7mNMivU9X+rvLcAmcDHx6jPCUrnTNGPbTmnYtkLuBZSOdP6V57og0t1lBBH4FfCjSX22R0Aa7TkqXAlFOvzbmxxSdp7QWoOcPl+ET0KLiTcDbI0LVC5zlgbsibEeadCkQbXzRRR5adPiYTkRUurNLPQTWaFKQYiLW281xpmlT9tmVQHSQm3JnYope52p65VIfgeOBfSLC1rrY/F2sj3UlkNiUkusAHSPqUicBbX3Qc2vMgvIuzfFQScl1IRCdmK4cfu0XCC1Kada5ri71ElCulfLsQotORFHKfdLShUA2By6M8PJKYL0IO5sMi4A2Xunk+JjtEDrBP+mzaxcC0b4MbZwJLVsCPw81cv1BEvgycGhEZFp3U1pTstKFQKT+0G9xaKeYbPTKzsUEtKVX18RcgSiUcaHMi2QltUB0ttU9Ed4pee3gCDubDJeA0ki0RSKkaIlAp3Em+6FNLRC9otV+8NCihZ6JnVwR6qzrZyHwceD7ET1pr0iyD/ekFoj2a+wZGJQ+rLJooI2rD5+AXvXqzN7Qom0V2nOSpKQWiF61bRTomX4l9JUoFxOYlUBMLt+RzWnxSWimFkjMA3ryNw9JyLiRPhCI2Wj3U2C7VM6nFIhOZo/ZCqu9yn9IFZDbGRQBbXfQ16hCStLtuCkFslzkg7b2Kevb2y4mMCuBDwM/C8Si77kn+8pxSoGsFvH24KnmKMtABq5eCYHYH91k13WyhppT70LzqPSWYvFKBtthhhPQmobOUg4tyVJOUgpk4+ak9pBglDcTuuoe0r7rlk1Aia/aNKd/Q4pmMzeGGExVN6VAYuaL+kDKkikCcRuDJaCT+ZV6ElK0fVef1Ri7pBTIVsD5gR7ptfASgTauXheBmKUDXYuhD/ezpWqB1HWxlRitBVLiqNnnbAQskGyo3VGJBCyQEkfNPmcjYIFkQ+2OSiRggZQ4avY5GwELJBtqd1QiAQukxFGzz9kIWCDZULujEglYICWOmn3ORsACyYbaHZVIwAIpcdTsczYCFkg21O6oRAIWSImjZp+zEbBAsqF2RyUSsEBKHDX7nI2ABZINtTsqkYAFUuKo2edsBCyQbKjdUYkELJASR80+ZyNggWRD7Y5KJGCBlDhq9jkbAQskG2p3VCIBC6TEUbPP2QhYINlQu6MSCVggJY6afc5GwALJhtodlUjAAilx1OxzNgIWSDbU7qhEAoMRyJbABYEj0MXp7usCOv7eJT+Bi4ErE3f7IPDOwDZ9uvs0wPYDjgoE6uppCOwPHJ2mqf+3Mpg7SF++D2KBJL5CA5qzQKaBZYEEXEkDrWqBWCADvbTThGWBWCBprqSBtmKBWCADvbTThGWBWCBprqSBtmKBWCADvbTThGWBWCBprqSBtmKBWCADvbTThGWBWCBprqSBtmKBWCADvbTThGWBWCBprqSBtmKBFCCQgV571YblZMVqh96BtyFggbSh5DrVErBAqh16B96GgAXShpLrVEvAAql26B14GwIWSBtKrlMtAQuk2qF34G0IWCBtKLlOtQQskGqH3oG3IWCBtKHkOtUSsECqHXoH3oaABdKGkutUS8ACqXboHXgbAhZIG0quUy0BC6TaoXfgbQhYIG0ouU61BCyQaofegbchYIG0oeQ61RKwQKodegfehoAF0oaS61RLwAKpdugdeBsCFkgbSq5TLQELpNqhd+BtCFggbSi5TrUELJBqh96BtyFggbSh5DrVErBAqh16B96GgAXShpLrVEvAAql26B14GwKDEcjmwIVtIp6pzl+BdwTauHpdBB4G3hYYsq7FXwbazLb6HCkaadpYH7gssL1ngfkCbVy9LgL/At4UGPJ6wJWBNp0LZDXg+kCnXgbmCrRx9XoIzAm8FBHuysAtEXavMUl5B1kGuCfCqXmAf0bY2WT4BBYDHokIc0nggQi7TgWyKPBohFOrAjdF2Nlk+AQ2BC6NCHMB4OkIu04FosafB94Q6NiOwI8CbVy9DgJ7AicFhqpnlrcE2kxZPeUUS53oGUTPIiHlq8DXQgxctxoCJwJ7BUb7R2CtQJtsAjkL2CHQud8AGwfauHodBO4ElgsM9XvAJwJtsglEd4OvBDqnaZke1F8MtHP1YRNYBHgsIsQDgSMj7GZrknqKtSVwQYRzH4x8GIvoyiaFENgNOD3C142A30bYZRGIHo6eAfT+OqQIxO4hBq47eAKXA1rwCymahega/E+I0XR1U99B1NfVwBqBDmodZOHmLVigqasPkMBSwH0RcemVsGYjyUoXAtH8b/8ID/VgpQcsFxM4Dvh8BIZDgEMj7KY06UIgH4icA94BrJAyOLdVJIEFgQcj8q8U7OrAdSmj7kIg8k/L/EtEOPqRyIf8iK5s0lMCMW9CFcrtwIqpY+pKIIcBB0U4e1cTZEyCWkR3NukZAW19uBt4Y4RfmtYfHWE3rUlXAlkauDfS2f2Ar0fa2qxsAhcBm0WEoKxwJTY+HmE7EYGoU+0N0R6R0PJc8yySJBsztHPXnxgBZWAoEyOmnAdsHWM4yqarO4j63Qo4f5QDU/z/q5p34K9E2tusLAL69dfUShkVMUXLCtfGGI6y6VIg6vu2Md5MHQAcNSoA//9BENDKt95+xpQrImcqrfrqWiC7At9p5clrK+lBfdsx7kKR3dosM4HTgE+O0Wenbz67Foji/hPw7jEAbAOcO4a9TftLQImFh4/hXtLU9tn5kUMgsQuHM/xVfo0e4M4ZA6RN+0dAr2XHybrVdaHdqJrGd1ZyCETOa5ql6VZs0cP6HsCpsQ3YrjcEdM2dAOw9pkdHRK61BXWbSyDzN28pFgry7rWVTwa0DdOlTALaK/7DyLWOmSNWIqNWzbWXqNOSSyAKYgvgFwmi0S11O0C5Wy7lENBU+wfA4glcXhO4JkE7I5vIKRA5czywz0ivRld4oblNa/eiNum79JeATkU8FvhYIhezZlrkFogY3QiskgiWtmQeA2hzv1bgXfpDQPt79m2eNWJyq2YXycXApjlDnIRA9MpXr+c0H01VdISpRKI7VMzZXKn8cDuwbnNoQuodojqUcG3giZyQJyEQxaejIZWr1cW5vGcCephXuopL9wR0d9DWWJ1Mo2lUzDaHUV4+xP+Ep30iWcukBKIgdXbRJcCbO4pYzyYSoe5Wmoop01N/+gV6MvLEjI5cLaJZPUto2qS8KW1sWx5YCVinY+//1ghQC87ZyyQFomA3aI6pnzt75O6wBAL6QdPbL22GmkiZtEAUtH6B9C2HZMdFToSkO01NQN8F0dTt/tQNh7TXB4HIX6UrSyRaUHQxAT1raC9R9meOWdH3RSDySyuj2j+i3Ygu9RLQy5WPRn72IDm1PglEwelLQmcA2yeP1A32nYC2zSq/Sou/vTmToG8CmTGIuzRrGl28Bu77hVKjf/pW5c6ADjLvVemrQARJ5yPp10TJia/vFTU7k4rAP5pdo0pF6TzxMMbpPgtkRjzLNrk82uPuMhwCpwAHd3ESSUpEJQhkRrz6MI/OPdokJQC3lZWAnjOU0auZwURf37aNuiSBzIhJ363TF6n0r0s5BM4GdHZuUdsUShTIjEtCJ4DrGxI7Ae8q5zqpylNlbutAcuXHPVVi5CULZGbeSlnRsfdaXFLGZ+iH50scuz76rNQQHcNzJaBTEjvdL54DwFAEMisrrcxrQ7+S6rT3REl1SrRzSUfgz8CtwM1NrtQNk8yZShfWq1saqkCm4iWRzNv86RS/0C9hdTUOfW9XC3d6Jauvh+mvyOlSDOTaBBLDyDYVE7BAKh58hz6agAUympFrVEzAAql48B36aAIWyGhGrlExAQuk4sF36KMJWCCjGblGxQQskIoH36GPJmCBjGbkGhUTsEAqHnyHPpqABTKakWtUTMACqXjwHfpoAhbIaEauUTEBC6TiwXfoowlYIKMZuUbFBCyQigffoY8mYIGMZuQaFROwQCoefIc+msB/ASb/4Ocg5utwAAAAAElFTkSuQmCC");
}
.lv_tree_element_wrap .lv_icon.lv_icon_hide {
  background-image: url("data:image/png;base64,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");
}

</style>
