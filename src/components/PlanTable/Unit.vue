<template>
    <span class="cell" :style="getStyle(info)" :title="headObj.render ? '' : info[keyName]">
        <template v-if="keyName == 'checkbox'">
            <i class="bimicon check_btn" 
            :class="info.isChoosed ? 'icon-xuanzhong' : 'icon-weixuanzhong'"
            @click.stop="choosed"></i>
        </template>
        <template v-else-if="headObj.hasArrow && !info.isLast">
            <i class="bimicon arrow_box"
            :class="info.isShow ? 'icon-zhankai1' : 'icon-zhankai'"
            @click.stop="toggle"></i>
            <template v-if="headObj.render">
                <Cell :row="info" :column="keyName" :index="index" :render="headObj.render"></Cell>
            </template>
            <template v-else>{{info[keyName]}}</template>
        </template>
        <template v-else>
            <template v-if="headObj.render">
                <Cell :row="info" :column="keyName" :index="index" :render="headObj.render"></Cell>
            </template> 
            <template v-else>{{info[keyName]}}</template>
        </template>
    </span>
</template>

<script>
import Cell from './cell'
export default {
    name:"Unit",
    props:{
        // 该条目所在行的信息
        info:{
            type:Object,
            default(){
                return {}
            }
        },
        // 该条目对应的key
        keyName:{
            type:[Number,String],
            default:'name'
        },
        // 该条目对应的index
        index:{
            type:Number,
            default:0
        },
        // 与该条目对应的头信息
        headObj:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    components: {
        Cell
    },
    methods: {
        // 点击伸缩箭头
        toggle(){
            this.info.isShow = !this.info.isShow;
        },
        // 点击勾选
        choosed(){
            console.log(this.info);
            this.info.isChoosed = !this.info.isChoosed;
            this.findChildren(this.info);
            this.$emit('getChoosed',this.info);
        },
        // 勾选方法需要的递归子方法
        findChildren(obj){
            if(obj.children){
                obj.children.forEach(ele => {
                    ele.isChoosed = obj.isChoosed;
                    this.findChildren(ele);
                });
            }
        },
        // 计算样式
        getStyle(obj){
            let _style = {}
            if(this.headObj.hasArrow){
                _style = {paddingLeft:((obj.layer - 1) * 20) + 'px'}
            } else {
                
            }
            return _style;
        }
    }
}
</script>

<style lang="less">
.cell{
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 100%;
    line-height: 40px;
    padding:0 8px;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    .arrow_box{
        font-size: 14px;
        margin: 5px;
        color:#a6d9f3;
        cursor: pointer;
    }
    .check_btn{
        font-size: 24px!important;
        color: #dcdcdc!important;
        &.icon-xuanzhong{
            color: #3999ff!important;
        }
    }
}
</style>


