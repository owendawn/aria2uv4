<template>
  <router-link :to="{path:'/downloadItem',query:{gid:opt.gid}}">
    <van-cell is-link icon="">
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <div style="text-align: left;word-break: break-all;font-weight: bold">{{ opt.name }}</div>
        <van-progress :percentage="opt.percent" style="margin:6px 0"/>
        <van-row gutter="20" style="font-size: 0.5rem;color: #817e7e;">
          <van-col span="8" style="text-align: left;min-width: 140px">
            <i class="fa fa-signal"/> {{ info.connections }}
            <i class="fa fa-magnet"/> {{ info.numSeeders }}
            <i class="fa fa-network-wired"/>
            {{ opt.network}}
            <van-loading type="spinner" size="12px" style="display: inline-block" v-if="info.status==='active'"/>
          </van-col>
          <van-col span="8" style="min-width: 140px">
            {{ opt.completedLengthStr}}
            /
            {{ opt.totalLengthStr }}
          </van-col>
          <van-col span="8" style="min-width: 280px">
            <i class="fa fa-upload"/> {{ opt.uploadSpeedStr }}
            <i class="fa fa-download"/> {{ opt.downloadSpeedStr }}
            &emsp;剩余时间: {{ getCastTime() }}
          </van-col>

        </van-row>
      </template>
      <template #right-icon>

      </template>
    </van-cell>
  </router-link>
</template>

<script>
import {reactive,watch} from 'vue'
import common from '@/assets/util/common'
import {} from 'vant'

export default {
  name: "download-todo",
  components: {},
  props: {
    todo: Object
  },
  setup(props) {
    let opt=reactive({
      downloadSpeedStr:0,
      completedLengthStr:0,
      uploadSpeedStr:0,
      totalLengthStr:0,
      network:0,
      percent:0,
      type:'',
      name:'',
      gid:''
    })

    let info = reactive(props.todo);

    const repackage=()=>{
      opt.uploadSpeedStr=common.getSize(info.uploadSpeed)+"/s"
      opt.downloadSpeedStr=common.getSize(info.downloadSpeed)+'/s'
      opt.completedLengthStr=common.getSize(info.completedLength)
      opt.totalLengthStr=common.getSize(info.totalLength)
      opt.network=info.files.filter(it => Number(it.completedLength) >= Number(it.length)).length +'/'+ info.files.length
      opt.percent=info.totalLength==='0'?0:Math.round(info.completedLength/info.totalLength*10000)/100
      if (props.todo.bittorrent) {
        if (props.todo.bittorrent.info) {
          opt.type = "Torrent"
          opt.name = "✪ " + props.todo.bittorrent.info.name;
        } else {
          opt.type = "Magnet";
          opt.name = "◑ " + props.todo.files[0].path;
        }
      } else { 
        let uris=props.todo.files[0].uris
        if(!uris||uris.length==0){
          opt.type = "Unknown";
          opt.name = "֍ 未知";
        }else if (new RegExp("^ftp://").test(props.todo.files[0].uris[0].uri)) {
          opt.type = "FTP";
          opt.name = "☢ " + decodeURIComponent(uris[0].uri.substring(uris[0].uri.lastIndexOf("/") + 1));
        } else if (new RegExp("^https?://").test(props.todo.files[0].uris[0].uri)) {
          opt.type = "HTTP/HTTPS";
          opt.name = "☪ " + decodeURIComponent(
              props.todo.files[0].path.substring(props.todo.files[0].path.lastIndexOf("/") + 1)
              || uris[0].uri.substring(uris[0].uri.lastIndexOf("/") + 1)
          );
        }
      }
    }


    repackage()


    function getCastTime() {
      let time = "∞";
      if (info.downloadSpeed !== "0") {
        let leave = Number(info.totalLength) - Number(info.completedLength);
        let long = Math.round(leave / Number(info.downloadSpeed));
        time = Math.floor(long / 60 / 60) + ":" + Math.floor(long % (60 * 60) / 60) + ":" + Math.floor(long % 60);
      }
      return time;
    }

    watch(props,(a,b)=>{
      // console.log(b.todo)
      info=b.todo
      // console.log(info.gid)
      opt.gid=info.gid
      repackage()
    })

    return {info, getCastTime,opt}
  }
}
</script>

<style scoped>

</style>