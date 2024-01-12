<template>
  <van-tabs v-model:active="activeName">
    <van-tab title="概况" name="a">
      <van-cell-group>
        <van-cell>
          <template #value>
            <div style="display: flex;justify-content: space-around">
              <van-button color="#333" round plain size="small"
                          @click="$router.back(-1)">
                返回
              </van-button>
              <van-button color="orange" round size="small"
                          v-if="['active'].indexOf(data.info.status)>=0"
                          @click="chooseCommand('pause')">
                暂停
              </van-button>

              <van-button color="green" size="small" plain
                          v-if="['paused'].indexOf(data.info.status)>=0"
                          @click="chooseCommand('unpause')">
                继续
              </van-button>
              <van-button color="blue" size="small"
                          v-if="['error','removed','complete'].indexOf(data.info.status)>=0"
                          @click="chooseCommand('restart')">
                重下
              </van-button>
              <van-button color="#d42ecf" size="small" plain
                          v-if="['active','waiting','paused'].indexOf(data.info.status)>=0"
                          @click="chooseCommand('stop')">
                废弃
              </van-button>
              <van-button color="red" size="small"
                          v-if="['complete','error','removed'].indexOf(data.info.status)>=0"
                          @click="chooseCommand('remove')">
                删除
              </van-button>
            </div>
          </template>
        </van-cell>
        <van-cell>
          <template #value>
            <div style="text-align: center">{{ data.name }}</div>
          </template>
        </van-cell>
        <van-cell v-if="true||['active','waiting'].indexOf(data.info.status)>=0">
          <template #value>
            <div style="width:100%;height: 100px;min-width: 330px;" ref="chartRef"></div>
          </template>
        </van-cell>
        <van-cell title="任务类型" :value="data.type"/>
        <van-cell title="任务状态" :value="parseState(data.info.status,data.info)"/>
        <van-cell title="连接数" :value="data.info.connections"/>
        <van-cell title="磁力链接" value=""/>
        <van-cell style="padding-top:2px">
          <template #value>
            <div style="text-align: center">
              <van-button
                  plain
                  hairline
                  type="primary"
                  @click="copy"
                  style="word-break: break-all;margin-top: 1px;">
                {{ 'magnet:?xt=urn:btih:' + data.info.infoHash }}
              </van-button>
            </div>
          </template>
        </van-cell>
        <van-cell title="下载宣言" value=""/>
        <van-cell style="padding-top: 0;">
          <template #value>
            <van-field
                v-model="data.info.announceListStr"
                type="textarea"
                rows="3"
                placeholder="请输入"
                style="padding:0 6px;font-size: 12px;font-family: fangsong;"
            />
          </template>
        </van-cell>
      </van-cell-group>
    </van-tab>
    <van-tab title="参数" name="b">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field v-model="data.options.dir" label="下载地址"/>
          <van-field v-model="data.options['max-connection-per-server']" label="最大线程数"/>
          <van-field v-model="data.options['max-tries']" label="最大重试数"/>
          <van-field label="User-Agent"/>
          <van-field
              v-model="data.options.ua"
              readonly
              clickable
              name="picker"
              label="User-Agent"
              placeholder="点击选择浏览器标识"
              @click="data.showPicker = true"
          />
          <van-popup v-model:show="data.showPicker" position="bottom">
            <van-picker
                :columns="data.userAgentList"
                @confirm="onChooseUA"
                @cancel="data.showPicker = false"
            />
          </van-popup>
          <van-field label="Header"/>
          <van-field
              v-model="data.options.header"
              type="textarea"
              placeholder="请输入"
              rows="3"
              autosize
              style="padding-top:0px"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block plain
                      hairline type="success" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </van-tab>
    <van-tab title="文件" name="d">
      <DownloadTodoItemFile :todo="data.info"/>
    </van-tab>
    <van-tab title="区块" name="c">
      <DownloadTodoItemRect :todo="data.info"/>
    </van-tab>
    <van-tab title="种链" name="e" v-if="data.info.status==='active'">
      <van-cell-group>
        <van-cell v-for="(v,i) in data.peers" v-bind:key="i">
          <template #value>
            <van-row>
              <van-col span="12">{{ v.name }} </van-col>
              <van-col span="12" style="text-align: center">{{ v.type }}</van-col>
              <van-col span="4">{{ v.state }}</van-col>
              <van-col span="4">{{ v.percent }}</van-col>
              <van-col span="8"><i class="fa fa-download"></i> {{ v.downloadSpeedStr }}</van-col>
              <van-col span="8"><i class="fa fa-upload"></i> {{ v.uploadSpeedStr }}</van-col>
            </van-row>
          </template>
        </van-cell>
      </van-cell-group>
    </van-tab>
  </van-tabs>
</template>

<script>
import { onMounted,ref, reactive, getCurrentInstance, onUnmounted} from 'vue'
import {Toast} from 'vant'
import {
  getStatusAndGlobalStatus, pauseJob, unpauseJob, stopJob, deleteJob,
  addLink, getPeers,changeOption
} from "@/api/todo";
import common from '@/assets/util/common'
import 'echarts/lib/chart/line'
// import ECharts from 'echarts'
import store from "@/store";
import DownloadTodoItemFile from './download-todo-item-file'
import DownloadTodoItemRect from './download-todo-item-rect'

export default {
  name: "download-todo-item",
  components: {
    DownloadTodoItemFile,DownloadTodoItemRect
  },
  props: {
    gid: String
  },
  setup() {
    const {proxy} = getCurrentInstance()
    // console.log(store.state.options)
    let data = reactive({
      info: {
        status:'',
        bitfield:''
      },
      options:{
        dir:null,
        'max-connection-per-server':store.state.options['max-connection-per-server'],
        'max-tries':store.state.options['max-tries'],
        'ua':null,
        header:store.state.options.header
      },

      showPicker: false,
      tmp: null,
      type: null,
      name: null,
      myChart: null,
      fileActive: null,
      timeout: null,
      peers: [],
      fileActiveContent: null,
      userAgentList: [
        '',
        'Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:2.0.1) Gecko/20100101 Firefox/4.0.1',
        'Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.8.131 Version/11.11',
        'Opera/9.80 (Windows NT 6.1; U; en) Presto/2.8.131 Version/11.11',
        'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50',
        'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50\n',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11',
      ],
      chartOps: {
        title: {
          text: '速率统计',
          show: false
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          show: false,
          data: ['上传速率', '下载速率']
        },
        grid: {
          left: '3%',
          right: '25',
          bottom: '0',
          top: '10',
          containLabel: true
        },
        xAxis: {
          type: 'time',
          boundaryGap: false,
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '上传速率',
            type: 'line',
            stack: '速率',
            data: [],
            symbolSize: 3,
            lineStyle: {
              color: '#ff4f26'
            },
            areaStyle: {
              normal: {
                // color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [{
                //   offset: 0,
                //   color: '#eb8f6c'
                // }, {
                //   offset: 1,
                //   color: '#ffe'
                // }])
              }
            },
          },
          {
            name: '下载速率',
            type: 'line',
            stack: '速率',
            data: [],
            symbolSize: 3,
            lineStyle: {
              color: '#03a562'
            },
            areaStyle: {
              normal: {
                // color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [{
                //   offset: 0,
                //   color: '#8ec6ad'
                // }, {
                //   offset: 1,
                //   color: '#ffe'
                // }])
              }
            },
          }
        ]
      }
    })
    let chartRef = ref()
    const parsePeerInfo = (peerid) => {
      let ret;
      try {
        ret = window.format_peerid(peerid);
        if (ret.client === 'unknown') throw 'unknown';
        return ret.client + (ret.version ? '-' + ret.version : '');
      } catch (e) {
        if (peerid === '%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00')
          return 'unknown';
        ret = unescape(peerid).split('-');
        for (var i = 0; i < ret.length; i++) {
          if (ret[i].trim().length) return ret[i];
        }
        return 'unknown';
      }
    }
    const refreshData = () => {
      if (data.timeout) {
        clearTimeout(data.timeout)
      }
      if(data.info.status==='active') {
        getPeers(proxy.$route.query.gid).then(re => {
          data.peers = re.data.result.map(it => {
            it.name = it.ip + ":" + it.port
            it.type = parsePeerInfo(it.peerId);
            it.downloadSpeedStr = common.getSize(it.downloadSpeed) + "/s";
            it.uploadSpeedStr = common.getSize(it.uploadSpeed) + "/s";
            it.percent = common.countBitfield(it.bitfield).percent;
            it.state = it.peerChoking === "false" ? "通畅" : "堵塞";
            return it;
          });
        })
      }
      getStatusAndGlobalStatus(proxy.$route.query.gid).then(re => {
        store.dispatch("filterStates", re.data)
        const arr = re.data.filter(it => it.id.indexOf("sendTellStatusREQ_") === 0).filter(it=>it.result).map(it => it.result)
        if (arr && arr.length > 0) {
          // console.log(arr)
          data.info = arr[0]
          if (data.info) {
            if(!data.dir){
              data.options.dir=data.info.dir
            }
            data.info.announceListStr = data.info?.bittorrent?.announceList.map(it => it[0]).join('\n')
            if (data.info.bittorrent) {
              if (data.info.bittorrent.info) {
                data.type = "Torrent"
                data.name = "✪ " + data.info.bittorrent.info.name;
                // this.checks = this.$props.todo.files.filter(it => it.selected === 'true').map(it => it.index).concat();
              } else {
                data.type = "Magnet";
                data.name = "◑ " + data.info.files[0].path;
              }
            } else{ 
              let uris=data.info.files[0].uris
              if(!uris||uris.length==0){
                data.type = "Unknown";
                data.name = "֍ 未知";
              }else if (new RegExp("^ftp://").test(data.info.files[0].uris[0].uri)) {
                data.type = "FTP";
                data.name = "☢ " + decodeURIComponent(data.info.files[0].uris[0].uri
                    .substring(data.info.files[0].uris[0].uri.lastIndexOf("/") + 1));
              } else if (new RegExp("^https?://").test(data.info.files[0].uris[0].uri)) {
                data.type = "HTTP/HTTPS";
                data.name = "☪ " + decodeURIComponent(
                    data.info.files[0].path.substring(data.info.files[0].path.lastIndexOf("/") + 1)
                    || data.info.files[0].uris[0].uri.substring(data.info.files[0].uris[0].uri.lastIndexOf("/") + 1)
                );
              }
            }
          }
          // console.log(data.info)
          //
          const time = new Date().getTime()
          if (data.info.status === 'active') {
            if (!data.myChart) {
              if (chartRef.value) {
                data.myChart = ECharts.init(chartRef.value);
                data.myChart.setOption(data.chartOps);
                console.log("init")
              }
            } else {
              data.chartOps.series[0].data.push([time, Number(data.info.uploadSpeed) / 1000.0])
              data.chartOps.series[1].data.push([time, Number(data.info.downloadSpeed) / 1000.0])
              while (data.chartOps.series[0].data.length > 30) {
                data.chartOps.series[0].data.shift();
                data.chartOps.series[1].data.shift();
              }
              data.myChart.setOption(data.chartOps);
            }
          }
          //
          if (!data.tmp & data.info) {
            data.tmp.dir = data.info.dir
            data.tmp['max-connection-per-server'] = data.info['max-connection-per-server']
            data.tmp['max-tries'] = data.info['max-tries']
            data.tmp.header = data.info.header
            let tmps = []
            if (data.info.header) {
              let arr = data.info.header.split('\n')
              arr.forEach(it => {
                if (it.toUpperCase().indexOf('USER-AGENT:') >= 0) {
                  let uastr = it.replace('User-Agent:', '').replace(/\r/g, '').trim()
                  data.tmp.ua = uastr
                  data.userAgentList.add(uastr);
                  data.userAgentList = Array.from(new Set(data.userAgentList))
                } else {
                  tmps.push(it);
                }
              })
              this.tmp.header = tmps.join("\n");
            }
          }
        }
        data.timeout = setTimeout(refreshData, 2000)
      }).catch(e=>console.log(e))
    }
    onMounted(async () => {
      setTimeout(() => {
        refreshData()
      }, 1000)

    })
    onUnmounted(() => {
      if (data.timeout) {
        clearTimeout(data.timeout)
      }
    })
    const onSubmit = () => {
      let tmp=Object.assign({},data.options)
      if(tmp.ua&&tmp.ua!==''){
        tmp.header='User-Agent: '+tmp.ua+"\n"+(tmp.header||"")
      }
      tmp.ua=undefined
      if(!tmp.header||tmp.header===''){
          tmp.header=undefined
      }
      console.log('submit', tmp);
      changeOption(data.info.gid,tmp).then(re=>{
        Toast("操作成功："+re.data.result)
      })
    };
    const parseState = (state, it) => {
      switch (state) {
        case "active":
          return "正在下载";
        case "complete":
          return "已完成";
        case "error":
          return "异常终止 - " + common.Aria2ErrorCode[it.errorCode] + "";
        case "paused":
          return "暂停";
        case "waiting":
          return "正在连接";
        case "removed":
          return "已删除";
        default:
          return "未知"
      }
    }
    const onChooseUA = (value) => {
      data.options.ua = value;
      data.showPicker = false
    }
    const chooseCommand = (command) => {
      try {
        switch (command) {
          case 'pause': {
            pauseJob(data.info.gid).then(re => {
              Toast("暂停成功：" + re.data.result)
            })
            break;
          }
          case 'unpause': {
            data.myChart = null
            unpauseJob(data.info.gid).then(re => {
              Toast("继续下载成功：" + re.data.result)
            })
            break;
          }
          case 'restart': {
            console.log(data.info)
            deleteJob(data.info.gid)
            if (data.type === "Torrent" || data.type === "Magnet") {
              addLink("magnet:?xt=urn:btih:" + data.info.infoHash, data.info).then(re => {
                Toast("重下成功：" + re.data.result)
              })
            } else if (data.type === "FTP" || data.type === "HTTP/HTTPS") {
              addLink(data.info.files[0].uris[0].uri, data.info).then(re => {
                Toast("重下成功：" + re.data.result)
              })
            }
            break;
          }
          case 'stop': {
            //仅针对正在下载的任务
            stopJob(data.info.gid).then(re => {
              Toast("取消成功：" + re.data.result)
            })
            // this.$store.dispatch("postToAjax", { jsonrpc: "2.0", method: "aria2.forceRemove", id: common.getReqId(common.reqType.sendForceRemoveREQ), params: [this.$props.todo.gid] })
            break;
          }
          case 'remove': {
            deleteJob(data.info.gid).then(re => {
              Toast("彻底删除成功：" + re.data.result)
              proxy.$router.back(-1)
            })
            break;
          }
        }
      }catch (e){
        console.log(e)
      }
    }
    const copy = (e) => {
      let transfer = document.createElement("input");
      transfer.style.opacity = '0'
      transfer.value = e.target.innerText
      document.body.append(transfer)
      transfer.focus();
      transfer.select();
      if (document.execCommand('copy')) {
        document.execCommand('copy');
      }
      transfer.blur();
      transfer.outerHTML = "";
      Toast("复制成功！")
    }


    const activeName = ref('a');
    return {activeName, copy, chartRef, data, parseState, onSubmit, onChooseUA, chooseCommand};
  }
}
</script>

<style scoped>

</style>