<template>
    <div class="move_modal_wrap" :style="style">
        <div class="move_modal_title" @mousedown="mouseDown($event)">
            这是个标题,就拽它
            <i class="iconfont close_btn">&#xe603</i>
        </div>
        <div class="move_modal_body">
            <slot></slot>
        </div>
        <i class="move_btn" @mousedown="styleMouseDown($event)"></i>
    </div>    
</template>

<script>
export default {
    name:"MovingModal",
    props:{
    },
    data () {
        return {
            style:{
                width:"1000px",
                height:"600px",
                left:"100px",
                top:"100px"
            },
            startPage:{
                x:0,
                y:0
            },
            backupPosition:{
                x:0,
                y:0
            },
            backupStyle:{
                x:0,
                y:0
            }      
        }
    },
    methods:{
        mouseDown(event){
            this.startPage.x = event.pageX
            this.startPage.y = event.pageY
            this.backupPosition.x = parseFloat(this.style.left)
            this.backupPosition.y = parseFloat(this.style.top)
            document.body.addEventListener("mousemove",this.mouseMove,false)
            document.body.addEventListener("mouseup",this.mouseUp,false)
        },
        mouseMove(event){
            this.style.left = (this.backupPosition.x + event.pageX - this.startPage.x) + "px"
            this.style.top = (this.backupPosition.y + event.pageY - this.startPage.y) + "px"
        },
        mouseUp(event){
            document.body.removeEventListener("mousemove",this.mouseMove,false)
        },
        styleMouseDown(event){
            this.startPage.x = event.pageX
            this.startPage.y = event.pageY
            this.backupStyle.x = parseFloat(this.style.width)
            this.backupStyle.y = parseFloat(this.style.height)
            document.body.addEventListener("mousemove",this.styleMouseMove,false)
            document.body.addEventListener("mouseup",this.styleMouseUp,false)
        },
        styleMouseMove(event){
            if(this.backupStyle.x + event.pageX - this.startPage.x < 200) return
            if(this.backupStyle.y + event.pageY - this.startPage.y < 100) return
            this.style.width = (this.backupStyle.x + event.pageX - this.startPage.x) + "px"
            this.style.height = (this.backupStyle.y + event.pageY - this.startPage.y) + "px"
        },
        styleMouseUp(event){
            document.body.removeEventListener("mousemove",this.styleMouseMove,false)
        }
    }
}
</script>

<style lang="less">
    .move_modal_wrap{
        position: fixed;
        box-sizing: border-box;
        border-radius: 6px 6px 0 0;
        box-shadow: 2px 2px 5px #aaa;
        overflow: hidden;
        .move_modal_title{
            border: 1px solid #dddee1;
            height: 34px;
            background-color: #fff;
            line-height: 34px;
            text-indent: 10px;
            cursor: move;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
            .close_btn{
                float: right;
                cursor: pointer;
                margin-right: 5px;
            }
        }
        .move_modal_body{
            position: absolute;
            top:34px;
            bottom:0;
            width: 100%;
            overflow: auto;
            background-color: #ccc;
        }
        .move_btn{
            position: absolute;
            bottom:0;
            right:0;
            width: 4px;
            height: 4px;
            cursor: se-resize;
        }
    }
</style>
