<template>
    <div class="table_head_wrap" :style="{width:totalWidth}">
        <div class="head_td" v-for="(ele,index) in data" :key="ele.id"
        :style="{width:ele.width}">
            <template v-if="ele.headRender">
                <Cell :row="ele.name" :column="ele" :index="index" :render="ele.headRender"></Cell>
            </template>
            <template v-else-if="ele.id == 'checkbox'">
                <span class="cell">
                    <i class="bimicon check_btn" 
                    :class="allChoosed ? 'icon-xuanzhong' : 'icon-weixuanzhong'"
                    @click.stop="choosed"></i>
                </span>
            </template>
            <template v-else>
                <span class="cell" :title="ele.name">{{ele.name}}</span>
            </template>
        </div>
    </div>
</template>

<script>
import Cell from './cell';
export default {
    name:"TableHead",
    props:{
        data:{
            type:Array,
            default(){
                return []
            }
        },
        totalWidth:{
            type:[String,Number],
            default:"100%"
        },
        allChoosed:{
            type:Boolean,
            default:false
        }
    },
    components: {
        
    },
    data () {
        return {
            
        }
    },
    methods: {
        choosed(){
            this.$emit('getAllChoosed')
        }
    }
}
</script>

<style lang="less">
    .table_head_wrap{
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 76px;
        color: #000000;
        font-size: 0;
        background-color: #d7ebf9;
        border: 1px solid #c3e0f5;
        border-left:1px solid transparent;
        border-right:1px solid transparent;
                .head_td{
                    display: inline-block;
                    box-sizing: border-box;
                    font-size: 14px;
                    border-right:1px solid #c3e0f5;
                    border-left:1px solid transparent;
                    &>.cell{
                        display: block;
                        width: 100%;
                        height: 100%;
                        padding: 0;
                        line-height: 76px;
                        font-weight: 400;
                        text-align: center;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    &:last-of-type{
                        border-right:1px solid transparent;
                    }
                }
    }
</style>
