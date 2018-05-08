<template>
  <div class="select_wrap">
      <div class="select_show_wrap">
          <span class="name" @click="show = !show">{{activeName.join(",")}}</span>
          <i class="iconfont show_btn" @click="show = !show" :class="show ? 'active' : ''">&#xe752;</i>
          <i class="iconfont del_btn" v-if="activeArr.length > 0" @click="delClick">&#xe60b;</i>
      </div>
      <div class="select_list_wrap" :class="[show ? '' : 'hide',placement == 'top' ? 'top' : 'bottom']" :style="style">
          <template v-if="filterable">
            <input type="text" class="select_input" v-model="select" placeholder="请输入搜索内容">
            <i class="iconfont btn_pic">&#xe68d;</i>
          </template>
          <ul :class="[filterable ? 'active' : '',multiple ? 'multiple' : 'alone']">
              <li v-for="(ele,index) in list" @click="choose(ele)" :class="[isChoosed(ele) ? 'active' : '']">
                  <span class="list_name" :title="ele.name">{{ele.name}}</span>
                  <i class="iconfont" v-show="isChoosed(ele) && multiple">&#xe7ad;</i>
              </li>
          </ul>
      </div>
  </div>
</template>

<script>
export default {
  name:"LvSelect",
  props:{
      data:{
          type:Array,
          default:function(){
              return []
          }
      },
      filterable:{
          type:Boolean,
          default:false
      },
      multiple:{
          type:Boolean,
          default:false
      },
      placement:{
          type:String,
          default:"bottom"
      }
  },
  data () {
      return {
          show:false,
          list:[],
          activeName:[],
          activeArr:[],
          select:"",
          style:{
              left:0,
              top:0
          }
      }
  },
  methods:{
      choose(ele){
            if(this.multiple){
                if(this.isChoosed(ele)){
                    this.activeArr = this.activeArr.filter( element => element != ele.id) 
                    this.activeName = this.activeName.filter( element => element != ele.name) 
                } else {
                    this.activeArr.push(ele.id)
                    this.activeName.push(ele.name)
                }
            } else {
                this.activeArr = []
                this.activeName = []
                this.activeArr.push(ele.id)
                this.activeName.push(ele.name)
                this.show = !this.show
            }
            this.$emit('on-change',this.activeArr.join(","))
      },
      isChoosed(ele){
          return this.activeArr.some( element => element == ele.id)
      },
      delClick(){
        this.activeArr = []
        this.activeName = []
        this.$emit('on-change',"")
      },
        bodyClick(event){
            let _dom = event.target,
                classInfo = "select_list_wrap",
                _mark = 0;
            while (_dom.parentNode && _mark == 0) {
                _dom.parentNode.className &&
                _dom.parentNode.className.indexOf(classInfo) >= 0
                ? (_mark = 1)
                : (_dom = _dom.parentNode);
            }
            if (_mark == 1) return;
            this.show = false
        },
  },
  watch:{
      show(){
          if(this.show) {
                document.body.addEventListener("click",this.bodyClick,false)
          } else {
                document.body.removeEventListener("click",this.bodyClick,false)
          }
      },  
      data(){
          this.list = this.data
      },
      select(){
          let _str = this.select
          if(_str.length == 1){
              let p = /[A-Za-z]/
              if(p.test(_str)){
                  this.list = this.data.filter(ele => ele.pinyinName[0] == _str.toLowerCase())
              } else {
                    if( _str.trim() == ""){
                        this.list = this.data;
                    } else {
                        this.list = this.data.filter(ele => ele.name.indexOf(_str) >= 0)
                    }
              }
          } else if( _str.trim() == ""){
              this.list = this.data;
          } else {
                 this.list = this.data.filter(ele => ele.name.indexOf(_str) >= 0)
          }
      }
  },
  created(){
      this.list = this.data
  },
  mounted(){
      this.$nextTick(() => {
            let _top = 0,
                _left = 0,
                _dom = this.$el;
        while(_dom){
            _top += _dom.offsetTop;
            _left += _dom.offsetLeft;
            _dom = _dom.offsetParent ? _dom.offsetParent : null
        }
        this.style.top = this.placement == "top" ? (_top - 202) + 'px' : (_top + 36) + 'px'
        this.style.left = _left + 'px'
        this.style.width = (this.$el.clientWidth + 2) + 'px'
      })
  }
}
</script>


<style lang="less" scoped>
.select_wrap{
    position: relative;
    box-sizing: border-box;
    width: 200px;
    height: 34px;
    border:1px solid #dddee1;
    border-radius: 6px;
    .iconfont{
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .select_show_wrap{
        position: relative;
        width: 100%;
        height: 100%;
        cursor: default;
        .name{
            display: inline-block;
            width: 100%;
            height: 100%;
            line-height: 34px;
            text-align: center;
            color:#aaa;
            font-size: 14px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .iconfont{
            position: absolute;
            display: block;
            font-size: 14px;
            height: 100%;
            width: 14px;
            right:6px;
            color:#ccc;
            cursor: pointer;
            transition: .3s;
            &:hover{
                color:#bbb;
            }
        }
        .show_btn{
            top:0;
            line-height: 34px;
            transition: .2s;
            &.active{
                transform: rotate(180deg)
            }
        }
        .del_btn{
            top:50%;
            font-size: 16px;
            margin-top: -6px;
            height: 16px;
            line-height: 16px;
            background-color: #fff;
        }
    }
    .select_list_wrap{
        position: fixed;
        height: 200px;
        overflow: hidden;
        // border:1px solid #dddee1;
        // border-radius:0 0 6px 6px;
        background-color: #fff;
        transition: .2s;
        z-index: 10;
        &.hide{
            height: 0;
            border-top:none;
            border-bottom:none;
        }
        .select_input{
            box-sizing: border-box;
            width: 94%;
            height: 34px;
            margin: 4px 3%;
            border:1px solid #dddee1;
            border-radius: 6px;
            color:#aaa;
            font-size: 14px;
            text-indent: 22px;
            &::placeholder{
                font-size: 12px;
                color:#bbb;
            }
        }
        .btn_pic{
            position: absolute;
            top:4px;
            left:10px;
            height: 34px;
            line-height: 34px;
            width: 20px;
            color:#aaa;
        }
        ul{
            position: relative;
            list-style-type: none;
            width: 100%;
            height: 200px;
            overflow: auto;
            font-size: 12px;
            color:#666;
            &.active{
                height: 160px;
            }
            &.alone{
                li.active{
                    color:#fff;
                    background-color: rgba(45,140,240,.9);
                }
            }
            &.multiple{
                li.active{
                    color:rgb(45,140,240);
                }
            }
            li{
                position: relative;
                box-sizing: border-box;
                width: 100%;
                height: 30px;
                padding: 0 6px;
                line-height: 30px;
                cursor: pointer;
                .list_name{
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    line-height: inherit;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .iconfont{
                    position: absolute;
                    top:0;
                    right:6px;
                    display: block;
                    font-size: 14px;
                    height: 100%;
                    width: 14px;
                    color:#666;
                    cursor: pointer;
                    transition: .3s;
                    &:hover{
                        color:#000;
                    }
                }
            }
        }
    }
}
</style>
