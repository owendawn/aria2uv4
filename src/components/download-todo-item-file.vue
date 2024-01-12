<template>
  <van-cell-group>
    <van-cell>
      <template #value>
        <div style="text-align: center">
          <van-button round plain type="primary" size="mini" @click="data.files.forEach(it=>it.checked=true)">全选</van-button>
          <van-button round plain type="warning" size="mini" @click="data.files.forEach(it=>it.checked=false)">取消全选</van-button>
        </div>
      </template>
    </van-cell>
      <van-cell v-for="(v,i) in data.files" v-bind:key="i">
        <template #value>
          <div>
            <van-checkbox v-model="v.checked"
                          style="display: inline-block;vertical-align: middle"></van-checkbox>
            &nbsp;
            <span v-html="getStep(v.path.match(/\//g)?v.path.match(/\//g).length :0)"></span>
            <i v-if="!isVideo(v.path)" class="fa fa-file"></i>
            <i v-if="isVideo(v.path)" class="fa fa-film"></i>
            {{ common.getSize(v.length) }}
            -
            {{
              v.length === "0" ? "0"
                  : (Math.round(Number(v.completedLength) * 10000 / Number(v.length)) / 100 + "%")
            }}
            <br>
            {{ v.path }}
          </div>
        </template>
      </van-cell>
    <van-cell>
      <template #value>
        <div style="text-align: center">
          <van-button type="primary" size="small" @click="onChangeOption">提交</van-button>
        </div>
      </template>
    </van-cell>
  </van-cell-group>
</template>

<script>
import {reactive, getCurrentInstance, ref} from 'vue'
import store from '@/store/index'
import common from "@/assets/util/common";
import {changeOption} from '@/api/todo'
import {Toast} from "vant";

export default {
  name: "download-todo-item-file",
  components: {},
  props: {
    todo: Object
  },
  setup(props) {
    let dir = ref(store.state.options.dir.replace(/\\/g, '/'))

    let data = reactive({
      info: {},
      fileActive: false,
      files: []
    })
    const getFiles2 = () => {
      const {proxy} = getCurrentInstance()
      let arr = [];
      arr = proxy.todo.files?.map(it => {
        let path = it.path.replace(/\\/g, '/').substring(dir.value.length)
        if (path.indexOf("/") === 0) {
          path = path.substring(1)
        }
        path = path.substring(path.indexOf("/") + 1)
        it.path = path
        it.checked = it.selected === 'true'
        return it;
      }).sort((a, b) => a.path.localeCompare(b.path))
      return arr;
    }
    data.files = getFiles2()
    const getStep = (s) => {
      let str = "";
      for (let i = 0; i < s; i++) {
        str += "&emsp;&emsp;"
      }
      return str;
    }
    const isVideo = path => {
      const m = path.toLowerCase().match(/(.mp4)|(.avi)|(.mkv)|(.mov)|(.rm)|(.rmvb)|(.ogg)/g)
      return m ? m.length > 0 : false
    }
    const onChangeOption=()=>{
      changeOption(props.todo.gid,{ "select-file": data.files.filter(it=>it.checked).map(it=>it.index).join(",") })
      .then(re=>{
        Toast("彻底删除成功：" + re.data.result)
      })
    }
    return {data, common, getStep, isVideo,onChangeOption};
  }
}
</script>

<style scoped>
</style>