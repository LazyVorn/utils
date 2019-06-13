<template>
    <div class="plan_table_wrap">
        <table-head :data="headData" :totalWidth="totalWidth" :allChoosed="allChoosed" @getAllChoosed="getAllChoosed"></table-head>
        <table-body v-if="bodyData.length > 0" :totalWidth="totalWidth" 
        :data="bodyData" :bakData="bakData" :headArr="headData" @getChoosed="getChoosed"></table-body>
        <div class="table_layer"  v-if="bodyData.length == 0">
            <span>暂无数据</span>
        </div>
    </div>
</template>

<script>
import TableHead from './TableHead'
import TableBody from './TableBody'
export default {
    name:"PlanTable",
    props:{
        headData:{
            type:Array,
            default(){
                return []
            }
        },
        bodyData:{
            type:Array,
            default(){
                return []
            }
        },
        bakData:{
            type:Array,
            default(){
                return []
            }
        }
    },
    components: {
        TableHead,
        TableBody
    },
    data () {
        return {
            totalWidth:"",
            allChoosed:false,
        }
    },
    methods: {
      getTotalWidth(arr){
          let _arr = arr.map(ele => parseFloat(ele.width) || 0);
          return parseFloat(_arr.reduce((pre,cur) => pre + cur) + 18) + 'px';
      },
      getAllChoosed(){
          this.allChoosed = !this.allChoosed;
          this.bakData.forEach(ele => ele.isChoosed = this.allChoosed);
      },
      getChoosed(){
          let _arr = this.bakData.filter(ele => ele.isChoosed);
          if(_arr.length == this.bakData.length) {
              this.allChoosed = true;
          } else {
              this.allChoosed = false;
          }
          this.$emit('getChoosed',_arr)
      }  
    },
    created(){
        this.totalWidth = this.getTotalWidth(this.headData);
    },
    watch:{
        headData(){
            this.totalWidth = this.getTotalWidth(this.headData);
        }
    }
}
</script>

<style lang="less">
    .plan_table_wrap{
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        font-size: 14px;
        overflow: auto;
        border-left: 1px solid #c3e0f5;
        border-right: 1px solid #c3e0f5;
        table{
            border-collapse: collapse;
            table-layout: fixed;
        }
        .table_layer{
            position: absolute;
            display: flex;
            width: 100%;
            top: 76px;
            left: 0;
            bottom:0;
            cursor: default;
            align-items: Center;
            justify-content: center;
            background-color: #ffffff;
        }
    }
</style>
