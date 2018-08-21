<template>
<div class="assign_test">
    <button @click="aaa">Click here!!!</button>
    <table>
        <tr v-for="ele in a" :key="ele.id" :class="ele.type ? 'active' : ''">
            <td>{{ele.name}}</td>
            <td>{{ele.type ? 'yes' : 'no'}}</td>
        </tr>
    </table>
</div>
</template>

<script>
export default {
data () {
    return {
        a:[
            {id:1,name:"a",type:true},
            {id:2,name:"b",type:false},
            {id:3,name:"c",type:true},
            {id:4,name:"d",type:false},
        ],
        b:[
            {id:1,name:"A",type:true},
            {id:2,name:"b",type:false},
            {id:3,name:"C",type:false},
            {id:4,name:"d",type:false},
            {id:5,name:"E",type:true},
        ]
    }
},
methods: {
    compareNewData(oldArr = [],newArr = [],child = "childNode"){
        if(oldArr.length == 0){
            return oldArr.push(...newArr);
        }
        let addArr = [],
            delArr = [],
            oldIdArr = oldArr.map(ele => ele.id),
            newIdArr = newArr.map(ele => ele.id);
        newArr.forEach(ele => {
            !oldIdArr.includes(ele.id) ? addArr.push(ele) : oldArr.forEach((_ele,index) => {
                index == 0 && newIdArr.includes(_ele.id) ? "" : delArr.push(_ele);
                ele.id == _ele.id ? Object.assign(_ele,ele) : "";
            })
        })
        if(delArr.length != 0) {
            oldArr.length = 0;
            oldArr.push(...oldArr.filter(ele => !delArr.includes(ele.id)));
        }
        addArr.length > 0 ? oldArr.push(...addArr) : "";
    },
    aaa(){
        this.compareNewData(this.a,this.b)
    }
}
}
</script>

<style lang="less" scoped>
.assign_test{
    position: absolute;
    top:10px;
    left:10px;
    width: 500px;
    height: 450px;
    background-color: #ccc;
    z-index: 555;
}
table{
    font-size: 20px;
    .active{
        color:red;
    }
}
</style>
