<template>
    <div class="move_modal_wrap" :style="style" :class="[max ? 'max' : '', min ? 'min' : '']">
        <div class="move_modal_title" @mousedown="mouseDown($event)">
            <span>{{title}}</span>
            <div class="move_modal_btn_wrap" @mousedown.stop="">
                <i class="lv_icon lv_close_btn" @click.stop="closeClick"></i>
                <i class="lv_icon" :class="max ? 'lv_max_btn' : 'lv_window_btn'" @click.stop="toggleClick"></i>
                <i v-if="needHide" class="lv_icon lv_min_btn" @click.stop="minClick"></i>
            </div>
        </div>
        <div class="move_modal_body">
            <slot></slot>
        </div>
        <i class="move_btn" @mousedown="styleMouseDown($event)"></i>
    </div>
</template>

<script>
export default {
  name: "MovingModal",
  props: {
    title: {
      type: String,
      default: ""
    },
    needHide: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      style: {
        width: "400px",
        height: "600px",
        left: "100px",
        top: "100px"
      },
      startPage: {
        x: 0,
        y: 0
      },
      backupPosition: {
        x: 0,
        y: 0
      },
      backupStyle: {
        x: 0,
        y: 0
      },
      max: false,
      min: false
    };
  },
  methods: {
    mouseDown(event) {
      if (this.max) return;
      this.startPage.x = event.pageX;
      this.startPage.y = event.pageY;
      this.backupPosition.x = parseFloat(this.style.left);
      this.backupPosition.y = parseFloat(this.style.top);
      document.body.addEventListener("mousemove", this.mouseMove, false);
      document.body.addEventListener("mouseup", this.mouseUp, false);
    },
    mouseMove(event) {
      this.style.left =
        this.backupPosition.x + event.pageX - this.startPage.x + "px";
      this.style.top =
        this.backupPosition.y + event.pageY - this.startPage.y + "px";
    },
    mouseUp(event) {
      document.body.removeEventListener("mousemove", this.mouseMove, false);
    },
    styleMouseDown(event) {
      this.startPage.x = event.pageX;
      this.startPage.y = event.pageY;
      this.backupStyle.x = parseFloat(this.style.width);
      this.backupStyle.y = parseFloat(this.style.height);
      document.body.addEventListener("mousemove", this.styleMouseMove, false);
      document.body.addEventListener("mouseup", this.styleMouseUp, false);
    },
    styleMouseMove(event) {
      if (this.backupStyle.x + event.pageX - this.startPage.x < 200) return;
      if (this.backupStyle.y + event.pageY - this.startPage.y < 100) return;
      this.style.width =
        this.backupStyle.x + event.pageX - this.startPage.x + "px";
      this.style.height =
        this.backupStyle.y + event.pageY - this.startPage.y + "px";
    },
    styleMouseUp(event) {
      document.body.removeEventListener(
        "mousemove",
        this.styleMouseMove,
        false
      );
    },
    closeClick() {
      this.$emit("close", "");
    },
    toggleClick() {
      this.max = !this.max;
    },
    minClick() {
      this.min = !this.min;
    }
  }
};
</script>

<style>
.move_modal_wrap {
  position: fixed;
  box-sizing: border-box;
  border-radius: 6px 6px 0 0;
  box-shadow: 2px 2px 5px #aaa;
  overflow: hidden;
  transition: 0.1s;
  background-color: #fff;
  border:1px solid #dddee1;
  z-index: 999;
}
.move_modal_wrap.max {
  width: 100% !important;
  height: 100% !important;
  left: 0 !important;
  top: 0 !important;
}
.move_modal_wrap.min {
  width: 0 !important;
  height: 0 !important;
  left: 0 !important;
  bottom: 0 !important;
}
.move_modal_wrap .move_modal_title {
  border-bottom: 1px solid #dddee1;
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
}
.move_modal_wrap .move_modal_title .move_modal_btn_wrap {
  width: auto;
  height: 100%;
  float: right;
  cursor: default;
}
.move_modal_wrap .move_modal_title .move_modal_btn_wrap .lv_icon {
  float: right;
  display: block;
  width: 14px;
  height: 14px;
  margin: 10px 8px;
  background-size: 100% 100%;
  cursor: pointer;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.move_modal_wrap .move_modal_title .move_modal_btn_wrap .lv_icon.lv_close_btn {
  background-image: url("data:image/png;base64,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");
}
.move_modal_wrap .move_modal_title .move_modal_btn_wrap .lv_icon.lv_max_btn {
  background-image: url("data:image/png;base64,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");
}
.move_modal_wrap .move_modal_title .move_modal_btn_wrap .lv_icon.lv_window_btn {
  background-image: url("data:image/png;base64,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");
}
.move_modal_wrap .move_modal_title .move_modal_btn_wrap .lv_icon.lv_min_btn {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAFg0lEQVR4Xu3bsa0lVRBF0cbHgMCIlsDAIAAiAJXOSD1q7YV9S/1q1d/Cml8e/xEg8J8Cv7AhQOC/BQTir4PA/wgIxJ8HAYH4GyCwCfg/yOZmKiIgkMihrbkJCGRzMxUREEjk0NbcBASyuZmKCAgkcmhrbgIC2dxMRQQEEjm0NTcBgWxupiICAokc2pqbgEA2N1MRAYFEDm3NTUAgm5upiIBAIoe25iYgkM3NVERAIJFDW3MTEMjmZioiIJDIoa25CQhkczMVERBI5NDW3AQEsrmZiggIJHJoa24CAtncTEUEBBI5tDU3AYFsbqYiAgKJHNqam4BANjdTEQGBRA5tzU1AIJubqYiAQCKHtuYmIJDNzVREQCCRQ1tzExDI5mYqIiCQyKGtuQkIZHMzFREQSOTQ1twEBLK5mYoICCRyaGtuAgLZ3ExFBAQSObQ1NwGBbG6mIgICiRzampuAQDY3UxEBgUQObc1NQCCbm6mIgEAih7bmJiCQzc1UREAgkUNbcxMQyOZmKiIgkMihrbkJCGRzMxUREEjk0NbcBASyuZmKCAgkcmhrbgIC2dxMRQQEEjm0NTcBgWxupiICAokc2pqbgEA2N1MRAYFEDm3NTUAgm5upiIBAIoe25iYgkM3NVERAIJFDW3MTEMjmZioiIJDIoa25CQhkczMVERBI5NDW3AQEsrmZiggIJHJoa24CAtncTEUEBBI5tDU3AYFsbqYiAgKJHNqam4BANjdTEQGBRA5tzU1AIJubqYiAQCKHtuYmIJDNzVREQCCRQ1tzExDI5mYqIiCQyKGtuQkIZHMzFREQSOTQ1twEBLK5mYoI/Eggfz7P82vEyZrfFvjneZ4/lhV+JJC/nuf5bfmoGQIvC/z9PM/vyzcFsqiZ+ZqAQL52Mb/3VQGBvMrtY18TEMjXLub3viogkFe5fexrAgL52sX83lcFBPIqt499TUAgX7uY3/uqgEBe5faxrwkI5GsX83tfFRDIq9w+9jUBgXztYn7vqwICeZXbx74mIJCvXczvfVVAIK9y+9jXBATytYv5va8KCORVbh/7msBPCcQ/uf3an0n39/6Uf3Lb5bZ5RuBH/sltBsmiXQGBdG9v84OAQA5InnQFBNK9vc0PAgI5IHnSFRBI9/Y2PwgI5IDkSVdAIN3b2/wgIJADkiddAYF0b2/zg4BADkiedAUE0r29zQ8CAjkgedIVEEj39jY/CAjkgORJV0Ag3dvb/CAgkAOSJ10BgXRvb/ODgEAOSJ50BQTSvb3NDwICOSB50hUQSPf2Nj8ICOSA5ElXQCDd29v8ICCQA5InXQGBdG9v84OAQA5InnQFBNK9vc0PAgI5IHnSFRBI9/Y2PwgI5IDkSVdAIN3b2/wgIJADkiddAYF0b2/zg4BADkiedAUE0r29zQ8CAjkgedIVEEj39jY/CAjkgORJV0Ag3dvb/CAgkAOSJ10BgXRvb/ODgEAOSJ50BQTSvb3NDwICOSB50hUQSPf2Nj8ICOSA5ElXQCDd29v8ICCQA5InXQGBdG9v84OAQA5InnQFBNK9vc0PAgI5IHnSFRBI9/Y2PwgI5IDkSVdAIN3b2/wgIJADkiddAYF0b2/zg4BADkiedAUE0r29zQ8CAjkgedIVEEj39jY/CAjkgORJV0Ag3dvb/CAgkAOSJ10BgXRvb/ODgEAOSJ50BQTSvb3NDwICOSB50hUQSPf2Nj8ICOSA5ElXQCDd29v8ICCQA5InXQGBdG9v84OAQA5InnQFBNK9vc0PAgI5IHnSFRBI9/Y2PwgI5IDkSVdAIN3b2/wgIJADkiddAYF0b2/zg4BADkiedAUE0r29zQ8CAjkgedIVEEj39jY/CAjkgORJV0Ag3dvb/CAgkAOSJ12BfwHVMCjJ95rdNwAAAABJRU5ErkJggg==");
}
.move_modal_wrap .move_modal_body {
  position: absolute;
  top: 34px;
  bottom: 0;
  left: 10px;
  right: 10px;
  overflow: auto;
}
.move_modal_wrap .move_btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 4px;
  height: 4px;
  cursor: se-resize;
}
</style>
