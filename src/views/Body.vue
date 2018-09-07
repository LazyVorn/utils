<template>
    <div class="body">
        <router-link to="/6068355004487797345/about">sadfasdf</router-link>
        <h1>This is an body page</h1>
        <ul style="height:40px;list-style-type:none;">
            <li style="float:left;width:50px;height:40px;text-align:center;" v-for="ele in maxLayer" :key="ele" @click="layer = ele">{{ele}}</li>
        </ul>
        <p @click="addData">ADDDATA</p>
            <TreeTable style="width:600px" :headData="head" :treeLayer="layer" 
            :bodyData="data" choosedType="normal" pIdName="pid"
            @getClicked="getClicked" @maxLayer="getMaxLayer" @getChooseBox="getChooseBox"></TreeTable>
        <!-- <paste></paste>
        <button @click="moving = true">点击出框</button>
        <div style="width:1500px;height:500px;margin-left:100px;">
            <LazyLoadTree :headData="head" url="/api/vi/projects/15470987469763243477/projectcraft/element/list" :params="{parentId:''}" :bodyData="data" pIdName="parentId" @getClicked="getClicked" @getChooseBox="getChooseBox"></LazyLoadTree>
        </div>
        <div style="margin-left:900px;">
            <lv-select :data="selectData" multiple filterable></lv-select>
        </div> -->
        <moving-modal title="介是个标题" @close="moving = false">
            <div class="edit_wrap">
                <p><span>名称：</span><input id="edit-name" v-model="editObj.name" type="text"></p>
                <p><span>类型：</span><input id="edit-type" v-model="editObj.type" type="text"></p>
                <p><span>任务数：</span><input id="edit-orderNum" v-model="editObj.orderNum" type="text"></p>
                <p><span>编码：</span><input id="edit-code" v-model="editObj.code" type="text"></p>
            </div>
        </moving-modal>
        <div style="position:absolute;left:0;top:0">
            <!-- <spe-nav></spe-nav> -->
        </div>
        <!-- <mu-choose chooseDom=".demo_li" @getChoosedDom="getChoosedDom"></mu-choose> -->
        <!-- <ul class="demo_ul">
            <li v-for="ele in ulData" :key="ele.id" :id="`demo-li${ele.id}`" class="demo_li" :class="ele.isChoose ? 'active' : ''">{{ele.name}}</li>
        </ul> -->
        <!-- <assign-test></assign-test> -->
    </div>
</template>

<script>
import AssignTest from "../components/AssignTest"
import MuChoose from "../components/MuChoose"
import MovingModal from "../components/MovingModal"
import LazyLoadTree from "../components/LazyLoadTree"
import TreeTable from "../components/TreeTable"
import LvSelect from "../components/LvSelect"
import SpeNav from "../components/SpeNav"
import Paste from "../components/Paste"
import testData from "../assets/test.js"
export default {
  name: "Body",
  components: {
      LazyLoadTree,
      MovingModal,
      AssignTest,
      TreeTable,
      MuChoose,
      LvSelect,
      SpeNav,
      Paste
  },
  data () {
      return {
          moving:false,
          selectData:[{"id":"6298842148508439286","name":"张浩","pinyinName":"zhanghao","pinyinCode":"2608011407080115","parentId":null,"type":"member","order":null,"tag":null,"children":[]},{"id":"6286777766680400383","name":"刘长城","pinyinName":"liuchangcheng","pinyinCode":"12092103080114070308051407","parentId":null,"type":"member","order":null,"tag":null,"children":[]},{"id":"6338974343083102574","name":"武星","pinyinName":"wuxing","pinyinCode":"232124091407","parentId":null,"type":"member","order":null,"tag":null,"children":[]},{"id":"6346542892740346042","name":"彭辉","pinyinName":"penghui","pinyinCode":"16051407082109","parentId":null,"type":"member","order":null,"tag":null,"children":[]},{"id":"5917242334161117925","name":"张波","pinyinName":"zhangbo","pinyinCode":"26080114070215","parentId":null,"type":"member","order":null,"tag":null,"children":[]}],
          head:[
              {name:"",value:"checkbox"},
              {name:"名称",value:"name",width:"300px"},
              {name:"类型",value:"type",width:"100px"},
              {name:"任务数",value:"orderNum",width:"100px"},
              {name:"编码",value:"code",width:"100px"},
          ],
          data:[],
          ulData:[
              {name:"a",id:1,isChoose:false},
              {name:"b",id:2,isChoose:false},
              {name:"c",id:3,isChoose:false},
              {name:"d",id:4,isChoose:false},
              {name:"e",id:5,isChoose:false},
              {name:"f",id:6,isChoose:false},
              {name:"g",id:7,isChoose:false},
              {name:"h",id:8,isChoose:false},
              {name:"i",id:9,isChoose:false},
          ],
          layer:0,
          maxLayer:0,
          editObj:{
              name:"",
              type:"",
              orderNum:"",
              code:""
          }
          }
  },
  created(){
      this.data = testData.data
    //   this.data.forEach(ele => {
    //       ele.num = parseInt(ele.id.toString().slice(0,2))
    //   })
    //   this.$get(this.$api.getTreeData("15470987469763243477","")).then(res => {
    //       this.data = res.data.data || []
    //   })
  },
    methods:{
        addData(){
            this.data.push({
        "id": "15700654249721511",
        "pid": "1570065226471707",
        "name": "塞法",
        "code": "3.4.1.3.1",
        "type": "Segment",
        "buildingId": "1569902158617948",
        "floorId": "1569902217697631",
        "specialtyId": null,
        "orderNum": 1,
        "taskCount": 0
    }, {
        "id": "15700654249895612",
        "pid": "1570065226471707",
        "name": "问问",
        "code": "3.4.1.3.2",
        "type": "Segment",
        "buildingId": "1569902158617948",
        "floorId": "1569902217697631",
        "specialtyId": null,
        "orderNum": 2,
        "taskCount": 0
    },)
        },
        getMaxLayer(num){
            this.maxLayer = num;
        },
        getClicked(info){
            console.log(info);
            let _col = info.col || "name";
            info.col == 'checkbox' ? _col = 'name' : "";
            this.editObj = info.row;
            document.getElementById(`edit-${_col}`).focus();
            setTimeout(()=> document.getElementById(`edit-${_col}`).select(),0);
        },
        getChooseBox(arr){
            console.log(arr);
        },
        getChoosedDom(domArr){
            this.ulData.forEach(ele => {
                let _mark = 0;
                for (let i = 0; i < domArr.length; i++) {
                    domArr[i].getAttribute("id").includes(ele.id) ? _mark++ : "";
                }
                ele.isChoose = _mark > 0;
            });
        }
    }
};
</script>

<style lang="less">
.body {
  width: 100%;
  height: 100%;
  .demo_ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    top: 10px;
    left: 500px;
    width: 600px;
    height: 600px;
    li {
      width: 180px;
      height: 180px;
      border-radius: 6px;
      background-color: #aaa;
      list-style-type: none;
      color: white;
      font-size: 40px;
      line-height: 180px;
      text-align: center;
      &.active{
          background-color: rgb(120, 236, 252);
      }
    }
  }
  .edit_wrap{
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      background-color: #fff;
      padding-top: 50px;
      input{
          width: 200px;
          height: 36px;
          border-radius: 4px;
          margin:5px 0;
          outline: none;
          border: 1px solid #dddee1;
      }
      span{
          display: inline-block;
          width: 60px;
          margin-left: 50px;
      }
  }
}
</style>
