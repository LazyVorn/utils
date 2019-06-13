

<template>
    <div class="table_body_wrap" :style="{width:totalWidth}">
        <table-element v-for="ele in data" :key="ele.id" 
        :info="ele" :headArr="headArr"
        @getChoosed="getChoosed" @getTrClick="getTrClick"></table-element>
    </div>
</template>

<script>
import Cell from './cell';
import TableElement from './TableElement'
export default {
    name:"TableBody",
    props:{
        // 树形数据
        data:{
            type:Array,
            default(){
                return []
            }
        },
        // 表格头数据
        headArr:{
            type:Array,
            default(){
                return []
            }
        },
        // 树形的数据的备份，扁平数据
        bakData:{
            type:Array,
            default(){
                return []
            }
        },
        // 组件总宽度
        totalWidth:{
            type:[String,Number],
            default:"100%"
        }
    },
    components: {
        TableElement
    },
    data () {
        return {
            
        }
    },
    methods: {
        // 获取勾选事件并上传
        getChoosed(){
            let _arr = this.bakData.forEach(ele => ele.isChoosed);
            this.$emit('getChoosed',_arr);
        },
        // 点击事件
        getTrClick(obj){
            this.bakData.forEach(ele => this.$set(ele,'isClicked', ele.id == obj.id));
            this.$emit('getTrClick',obj);
        }
    }
}
</script>

<style lang="less">
    .table_body_wrap{
        position: absolute;
        box-sizing: border-box;
        width: 100%;
        top: 76px;
        left: 0;
        bottom: 0;
        overflow: auto;
        background-color: #ffffff;
        border: 1px solid #c3e0f5;
        border-left:1px solid transparent;
        border-right:1px solid transparent;
        border-top:none;
    }
</style>
