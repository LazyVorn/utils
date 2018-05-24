<template>
    <div class="paste_btn">
        <input type="text" id="paste-input" @paste="pasteClick" @focus="pasteClick">
        <button @click="pasteBtn">粘贴</button>
        <div>{{text}}</div>
    </div>
</template>

<script>
export default {
name:"paste",
data () {
    return {
        text : ""
    }
},
methods:{
    pasteClick(tag){
        let _text = window.clipboardData ? window.clipboardData.getData('Text') : tag.clipboardData.getData("Text"),
            _arr = _text.split("\n")
        this.text = _arr.map(ele => ele.split("\t"))
        console.log(this.text);
    },
    pasteBtn(){
        this.pasteClick()
    },
},
created(){
    document.body.addEventListener("paste",this.pasteClick,false)
}
}
</script>

<style>
.paste_btn{
    width: 400px;
    height: 400px;
    border: 1px solid #eff0f5;
    background-color: rgb(202, 231, 240);
    border-radius: 6px;
}
</style>
