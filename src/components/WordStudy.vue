<template>
    <div class="word_wrap">
        <div class="word_btn_wrap">
            <button @click="exportWordClick">导出</button>
        </div>
        <ul class="word_list_wrap">
            <li v-for="(ele,index) in wordArr" :key="index">
                <span>{{`${index + 1}. `}}</span>
                <span class="word_span">{{ele.word}}</span>
                <span>:</span>
                <span class="name_span">{{ele.name}}</span>
                <i class="word_btn" @click="delWord(index)"></i>
            </li>
        </ul>
        <div class="word_import_wrap">
            <input class="word_import_input" ref="wordImportInput" type="text" v-model="importWord" @keyup.enter="wordClick">
        </div>
        <div class="word_export_layer" v-if="showLayer">
            <div class="word_export_wrap">
                <div class="word_export_title">
                    <p>导出单词本</p>
                    <i class="word_btn" @click="showLayer = false"></i>
                </div>
                <textarea class="word_export_box">{{exportWord}}</textarea>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      wordArr: [],
      importWord: "",
      exportWord: "",
      showLayer: false
    };
  },
  methods: {
    wordClick() {
      let _obj = {},
        _arr = this.importWord.split(":");
      _obj.word = _arr[0];
      _obj.name = _arr.length > 1 ? _arr[1] : "";
      this.wordArr = [_obj,...this.wordArr].sort(this.compare("word"));
      this.importWord = "";
      this.$refs.wordImportInput.focus();
    },
    exportWordClick() {
      let _words = "";
      this.wordArr.forEach(ele => {
        _words += `${ele.word}:${ele.name}\n`;
      });
      this.exportWord = _words;
      this.showLayer = true;
    },
    delWord(index) {
      this.wordArr.splice(index, 1);
    },
    compare(property) {
      return function(obj1, obj2) {
        let value1 = obj1[property],
          value2 = obj2[property];
        return value1 > value2;
      };
    }
  }
};
</script>

<style lang="less">
.word_wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgb(235, 232, 232);
  .word_btn_wrap {
    width: 100%;
    height: 40px;
    button {
      float: right;
      box-sizing: border-box;
      padding: 0 12px;
      height: 34px;
      margin: 4px 10px;
      font-size: 14px;
      line-height: 34px;
      border: 1px solid #ddd;
      border-radius: 6px;
      color: #fff;
      background-color: rgb(91, 141, 216);
      cursor: pointer;
      transition: 0.3s;
      &:hover {
        background-color: rgb(37, 122, 248);
      }
    }
  }
  .word_list_wrap {
    box-sizing: border-box;
    position: absolute;
    top: 50px;
    left: 10px;
    right: 50%;
    bottom: 10px;
    padding: 10px;
    margin-right: 10px;
    overflow: auto;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    list-style-type: none;
    li {
      float: left;
      position: relative;
      width: 40%;
      height: 40px;
      margin: 0 5%;
      line-height: 40px;
      font-size: 16px;
      font-weight: 600;
      color: #424242;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      border-bottom: 1px dashed #ccc;
      .word_span {
        color: rgb(118, 123, 128);
      }
      .name_span {
        color: rgb(82, 158, 245);
      }
    }
  }
  .word_import_wrap {
    box-sizing: border-box;
    position: absolute;
    top: 50px;
    left: 50%;
    right: 10px;
    bottom: 10px;
    padding: 10px;
    margin-left: 10px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    overflow: auto;
    .word_import_input {
      width: 100%;
      height: 32px;
      border: 1px solid #ddd;
      border-radius: 6px;
      list-style: 32px;
      color: #424242;
      font-size: 14px;
      &:active {
        outline: none;
      }
      &:focus {
        border: 1px solid skyblue;
      }
    }
  }
  .word_export_layer {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left:0;
    background-color: rgba(0, 0, 0, 0.6);
    cursor: default;
    .word_export_wrap {
      position: absolute;
      width: 600px;
      height: 600px;
      top: 10%;
      left: 50%;
      margin-left: -300px;
      background-color: #fff;
      border: 1px solid #aaa;
      border-radius: 6px;
      .word_export_title {
        position: relative;
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #aaa;
        p {
          width: 100%;
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          text-align: center;
        }
      }
      .word_export_box {
        box-sizing: border-box;
        width: 580px;
        height: 520px;
        padding: 10px 20px;
        margin: 20px 10px;
        font-size: 16px;
        font-weight: 600;
        line-height: 32px;
        border: 1px solid #ccc;
        border-radius: 0 0 6px 6px;
      }
    }
  }
  .word_btn {
    position: absolute;
    display: block;
    width: 14px;
    height: 14px;
    top: 0;
    right: 0;
    margin: 12px;
    background-size: 100% 100%;
    cursor: pointer;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: url("data:image/png;base64,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");
  }
}
</style>
