<template>
    <div class="table_tr">
        <div class="table_title" :class="info.isClicked ? 'active' : ''" @click.stop="getTrClick(info)">
            <template v-for="(head,index) in headArr">
                <div class="table_td" :class="[head.hasArrow ? 'arrow' : '']" :style="{width:head.width}" :key="head.id">
                    <Unit :info="info" :keyName="head.id" :index="index" :headObj="head" @getChoosed="getChoosed"></Unit>
                </div>
            </template>
        </div>
        <template v-if="info.children && info.children.length > 0">
            <div class="table_body" v-show="info.isShow">
                <table-element v-for="ele in info.children" :key="ele.id" :headArr="headArr"
                :info="ele" @getChoosed="getChoosed" @getTrClick="getTrClick"></table-element>
            </div>
        </template>
    </div>
</template>

<script>
import Cell from './cell';
import Unit from './Unit'
export default {
    name:"TableElement",
    props:{
        // 该递归单元的数据
        info:{
            type:Object,
            default(){
                return {}
            }
        },
        // 表格头数据
        headArr:{
            type:Array,
            default(){
                return []
            }
        }
    },
    components: { Unit },
    data () {
        return {
            
        }
    },
    methods: {
        // 获取勾选事件并上传
        getChoosed(obj){
            if(!obj.isChoosed) {
                this.info.isChoosed = false;
            } else if (this.info.children) {
                this.info.isChoosed = this.info.children.every(ele => ele.isChoosed);
            }
            this.$emit('getChoosed',this.info);
        },
        // 点击事件
        getTrClick(obj){
            this.$emit('getTrClick',obj);
        }
    }
}
</script>

<style lang="less">
    .table_tr{
        box-sizing: border-box;
        width: 100%;
        .table_body{
            width: 100%;
        }
        .table_title{
            box-sizing: border-box;
            width: 100%;
            height: 40px;
            border-bottom:1px solid #c3e0f5;
            font-size: 0;
            &.active{
                background-color: #ebf7ff;
            }
            .table_td{
                display: inline-block;
                box-sizing: border-box;
                height: 40px;
                font-size: 14px;
                border-right:1px solid #c3e0f5;
                border-left:1px solid transparent;
                &.hide{
                    border-right:1px solid transparent;
                }
                &.arrow{
                    .cell{
                        text-align: left;
                    }
                }
                &:last-of-type{
                    border-right:1px solid transparent;
                }
            }
        }
    }
</style>
