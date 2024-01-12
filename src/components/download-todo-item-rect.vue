<template>
  <div style="text-align: center;margin-top:20px;padding:0 10px;">
    <div style="margin-bottom: 20px;">
      <span class="piece" style="background:#05bfa9; "></span>&nbsp;
      <span style="font-size: 10px">
        <van-badge :content="opts.ok" color="#1989fa">已完成&emsp;</van-badge>
      </span>&emsp;
      <span class="piece"></span>&nbsp;
      <span style="font-size: 10px">
        <van-badge :content="opts.fail" color="#1989fa">未完成&emsp;</van-badge>
      </span>
    </div>
    <canvas ref="myCanvas" style="width: 100%;margin-right: -10%" @resize="render"></canvas>
  </div>
</template>

<script>
import {reactive, getCurrentInstance,onMounted,watch} from 'vue'
import common from "@/assets/util/common";

export default {
  name: "download-todo-item-rect",
  components: {},
  props: {
    todo: Object
  },
  setup(props) {
    console.log(props)
    let opts = reactive({
      ok:0,
      fail:0,
      info:{}
    })
    let {proxy} = getCurrentInstance()

    const render = () => {
      opts.ok=0
      opts.fail=0
      if(!opts.info.bitfield){
        return;
      }
      let arr = common.parseHexStringToBitArray(opts.info.bitfield)
      // arr.reverse()
      let rate=1
      const dom = proxy.$refs.myCanvas;
      const w = dom.width
      dom.height = Math.ceil(opts.info.numPieces  / (w/12))*13*rate
      console.log(arr.length,dom.offsetWidth,dom.offsetHeight,dom.width,dom.height)
      let ctx = dom.getContext("2d");
      // ctx.clearRect(0,0,w,dom.height*13)
      const cols = Math.floor(w / 12.5);
      console.log(cols)
      let row = 0;
      for (let i = 0; i < Number(opts.info.numPieces); i++) {
        if (i - row * cols > cols) {
          row++;
        }
        if (arr[i] === 0) {
          opts.fail++;
          ctx.strokeStyle = "#05685c"
          ctx.lineWidth=0.5
          ctx.rect((i * 11 - row * cols*11 - 11)*rate, row * (10 + 1)*rate, 10*rate, 10*rate);
        } else {
          opts.ok++;
          ctx.fillStyle = "#05bfa9";
          ctx.fillRect((i * 11 - row * cols*11 - 11)*rate, row * (10 + 1)*rate, 10*rate, 10*rate)
          // console.log(i*11-row*cols*11-11,row*(10+1))
        }
        ctx.stroke()
      }
    }
    onMounted(()=>{
      setTimeout(()=>{
        render()
      },1000)
    })

    watch(props,(a,b)=>{
      // console.log(a.todo,b.todo)
      opts.info=b.todo
      render()
    })


    return {opts, render};
  }
}
</script>

<style scoped>
.piece{
  display: inline-block;
  width: 10px;
  height: 10px;
  vertical-align: middle;
  border: 1px solid #05bfa9;
}
/deep/.van-badge{
  margin-top: 0!important;
}
</style>