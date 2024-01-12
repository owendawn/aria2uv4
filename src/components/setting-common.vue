<template>
  <div>
    <van-tabs>
      <van-tab title="Aria2">
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-cell>
              <template #value>
                <div style="text-align: center;">
                  <van-button plain type="default" size="mini" style="font-weight:900;font-style: italic;">[ http / https ] : //</van-button>
                </div>
              </template>
            </van-cell>
            <van-field
                v-model="opts.ip"
                value=""
                placeholder="127.0.0.1"
                input-align="center"
            />
            <van-cell>
              <template #value>
                <div style="text-align: center;">
                  <van-button plain type="default" size="mini" style="font-weight:900;font-style: italic;">:</van-button>
                </div>
              </template>
            </van-cell>
            <van-field
                v-model="opts.port"
                value=""
                placeholder="6800"
                input-align="center"
            />
            <van-cell>
              <template #value>
                <div style="text-align: center;">
                  <van-button plain type="default" size="mini" style="font-weight:900;font-style: italic;">/ jsonrpc</van-button>
                </div>
              </template>
            </van-cell>
          </van-cell-group>
          <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">
              提交
            </van-button>
          </div>
        </van-form>
      </van-tab>
      <van-tab title="参数">
        <van-form @submit="onSubmit2" label-width="12rem">
          <van-cell-group inset>
            <van-field v-model="store.state.options.dir" value="">
              <template #label>保存路径<br>(dir)</template>
            </van-field>
            <van-field v-model="store.state.options.continue" value="">
              <template #label>断点续传<br>(continue)</template>
              <template #input>
                <van-switch v-model="store.state.options.continue" active-value="true" inactive-value="false"/>
              </template>
            </van-field>
            <van-field v-model="store.state.options['max-concurrent-downloads']" value="">
              <template #label>最大下载任务数<br>(max-concurrent-downloads)</template>
            </van-field>
            <van-field v-model="store.state.options['max-connection-per-server']" value="">
              <template #label>单服务器最大连接数<br>(max-connection-per-server)</template>
            </van-field>
            <van-field v-model="store.state.options['min-split-size']" value="">
              <template #label>
                最小文件分片大小
                <van-button color="#7232dd" plain round size="mini">
                  {{ Math.round(store.state.options['min-split-size'] / 1024 / 1024 * 100) / 100 + 'M' }}
                </van-button>
                <br>(min-split-size)
              </template>
            </van-field>
            <van-field v-model="store.state.options.split" value="">
              <template #label>单任务最大线程数<br>(split)</template>
            </van-field>
            <van-field v-model="store.state.options['max-tries']" value="">
              <template #label>最大重试次数<br>(max-tries)</template>
            </van-field>
            <van-field v-model="store.state.options['retry-wait']" value="">
              <template #label>重试等待时间<br>(retry-wait)</template>
            </van-field>
            <van-field v-model="store.state.options['max-file-not-found']" value="">
              <template #label>文件未找到重试次数<br>(max-file-not-found)</template>
            </van-field>
            <van-field v-model="store.state.options['bt-seed-unverified']" value="">
              <template #label>启动下载未完成BT任务<br>(bt-seed-unverified)</template>
              <template #input>
                <van-switch v-model="store.state.options['bt-seed-unverified']" active-value="true"
                            inactive-value="false"/>
              </template>
            </van-field>
            <van-field v-model="store.state.options['bt-save-metadata']" value="">
              <template #label>保存磁链为BT任务<br>(bt-save-metadata)</template>
              <template #input>
                <van-switch v-model="store.state.options['bt-save-metadata']" active-value="true"
                            inactive-value="false"/>
              </template>
            </van-field>
            <van-field v-model="store.state.options['bt-max-open-files']" value="">
              <template #label>BT任务下载最大文件数<br>(bt-max-open-files)</template>
            </van-field>
          </van-cell-group>
          <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">
              提交
            </van-button>
          </div>
        </van-form>


      </van-tab>
      <van-tab title="帮助">
        <van-cell  value-class="text-center">
          <template #value >
            <van-button round plain type="primary"
                        @click="download('./plugin/BaiduExporter-1.0.3.crx')">
              <i class="fa fa-cube"></i> 浏览器插件
            </van-button>
          </template>
        </van-cell>
        <van-cell value-class="text-center">
          <template #value>
            <van-button round plain type="primary"
                        @click="download('https://gitee.com/owendawn/Resource/raw/master/aria2-1.34.0.zip')">
              <i class="fa fa-layer-group"></i> Aria2
            </van-button>
          </template>
        </van-cell>
        <van-cell value-class="text-center">
          <template #value>
            <van-button round plain type="primary"
                        @click="download('https://gitee.com/owendawn/aria2uv4')">
              <i class="fa fa-chess-rook"></i> 源码
            </van-button>
          </template>
        </van-cell>


      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import {onUnmounted, reactive,getCurrentInstance} from "vue";
import {Toast} from "vant";
import store from '@/store/index'
import {changeGlobalOption, getGlobalStatus} from '@/api/todo'

export default {
  name: "setting-common",
  setup() {
    let opts = reactive({
      ip: window.localStorage.getItem("rpc-ip")||'127.0.0.1',
      port: window.localStorage.getItem("rpc-port")||6800,
      timeout:null
    })
    const {proxy} =getCurrentInstance()
    const refreshData = () => {
      if (opts.timeout) {
        clearTimeout(opts.timeout)
      }
      getGlobalStatus().then((re) => {
        proxy.$store.dispatch("filterStates", [re.data])
        opts.timeout = setTimeout(refreshData, 1000)
      })

    }
    onUnmounted(() => {
      if (opts.timeout) {
        clearTimeout(opts.timeout)
      }
    })
    refreshData();
    const onSubmit = () => {
      window.localStorage.setItem("rpc-ip", opts.ip);
      window.localStorage.setItem("rpc-port", opts.port);
      Toast("保存成功！")
      window.location.reload()
    }
    const onSubmit2 = () => {
      changeGlobalOption(store.state.options).then(re => {
        Toast("保存成功：" + re.data.result)
      })
    }
    const download=(url)=>{
      window.open(url)
    }
    return {opts, onSubmit, store, onSubmit2,download}
  }
}
</script>

<style >
.text-center{text-align: center}
</style>