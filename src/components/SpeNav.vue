<template>
    <div class="spe_nav_wrap" :style="style">
        <div class="spe_nav_box">
            <slot></slot>
        </div>
        <div class="spe_nav_line" @mousedown="mouseDown($event)" :class="active ? 'active' : ''"></div>
    </div>    
</template>

<script>
export default {
name:"SpeNav",
data () {
    return {
        startPage:0,
        backupPosition:0,
        style:{
            width:"300px"
        },
        active:true
    }
},
methods:{
    mouseDown(event){
        this.active = true
        this.startPage = event.pageX
        this.backupPosition = parseFloat(this.style.width)
        document.body.addEventListener("mousemove",this.mouseMove,false)
        document.body.addEventListener("mouseup",this.mouseUp,false)
    },
    mouseMove(event){
        this.style.width = (this.backupPosition + event.pageX - this.startPage) + "px"
    },
    mouseUp(event){
        this.active = false
        document.body.removeEventListener("mousemove",this.mouseMove,false)
    },
}
}
</script>

<style>
.spe_nav_wrap{
    position: relative;
    width:300px;
    height:500px;
    border: 1px solid #dddee1;
    border-radius: 6px;
    overflow: hidden;
    background-color: #fff;
}
.spe_nav_wrap .spe_nav_box{
        width: 100%;
        height: 100%;
        overflow: auto;
}
.spe_nav_wrap .spe_nav_line{
    position: absolute;
    right:0;
    top:0;
    width: 0;
    height: 100%;
    border-right:3px solid transparent;
    cursor: e-resize;
    transition: .3s;
}
.spe_nav_wrap .spe_nav_line:hover{
    border-right:3px solid rgb(92, 102, 236);
}
.spe_nav_wrap .spe_nav_line.active{
    border-right:3px solid rgb(92, 102, 236);
}
</style>
