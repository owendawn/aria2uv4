<template>
  <div class="download-area">
    <van-grid   :column-num="3">
      <van-grid-item text="URL" @click="opts.showLinkDiv=true">
        <template #icon>
          <i class="fa fa-link"></i>
        </template>
      </van-grid-item>
      <van-grid-item text="Torrent" @click="opts.showBtDiv=true">
        <template #icon>
          <i class="fa fa-file-download"></i>
        </template>
      </van-grid-item>
      <van-grid-item text="MetaLink" @click="opts.showMetaLinkDiv=true">
        <template #icon>
          <i class="fa fa-bezier-curve"></i>
        </template>
      </van-grid-item>
    </van-grid >
    <van-empty description="尚无任务" v-if="opts.downloads.length===0"/>
    <div v-if="opts.downloads.length>0">
      <ToDownload v-for="v in opts.downloads" v-bind:key="v.id" :todo="v"/>
    </div>

    <van-popup v-model:show="opts.showLinkDiv" position="top">
      <van-form @submit="onSaveLink">
        <van-cell-group inset>
          <van-field
              label="链接"
              value=""
              input-align="right"
              clearable>
            <template #input>
              <van-button type="primary" size="mini" round color="purple"
                          @click="linkTmp.link='magnet:?xt=urn:btih:xxx'">
                <i class="fa fa-magnet"></i>
              </van-button>
              <van-button type="default" size="mini" round
                          @click="linkTmp.link=''">
                <i class="fa fa-broom"></i>
              </van-button>
            </template>
          </van-field>
          <van-field
              v-model="linkTmp.link"
              placeholder="请输入"
              clickable
              @clear="linkTmp.link=''"
              type="textarea"
              rows="3"/>
          <van-field
              v-model="linkTmp.dir"
              label="下载路径"
              placeholder="请输入"
          />
          <van-field input-align="center">
            <template #input>
              <van-button type="success" size="mini" round plain
                          @click="linkTmp.dir='C:/Users/Administrator/Desktop'">
                <i class="fa fa-home"></i>
              </van-button>
              <van-button type="success" size="mini" round plain
                          @click="linkTmp.dir='D:/TDDOWNLOAD'">
                <i class="fa fa-cog"></i>
              </van-button>
            </template>
          </van-field>

          <van-field label="最大连接数">
            <template #input>
              <van-slider v-model="linkTmp['max-connection-per-server']" max="16">
                <template #button>
                  <van-button type="primary" size="mini" round>{{ linkTmp['max-connection-per-server'] }}</van-button>
                </template>
              </van-slider>
            </template>
          </van-field>
          <van-field label="最大线程数">
            <template #input>
              <van-slider v-model="linkTmp.split" max="100">
                <template #button>
                  <van-button type="primary" size="mini" round>{{ linkTmp.split }}</van-button>
                </template>
              </van-slider>
            </template>
          </van-field>
          <van-field
              v-model="linkTmp['ftp-type']"
              readonly
              clickable
              name="picker"
              label="FTP类型"
              placeholder="点击选择"
              @click="opts.showFtpTypePicker = true"
          />

          <van-field
              v-model="linkTmp['ftp-user']"
              label="FTP用户"
              placeholder="请输入"
          />
          <van-field
              v-model="linkTmp['ftp-passwd']"
              label="FTP密码"
              placeholder="请输入"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </van-popup>

    <van-popup v-model:show="opts.showBtDiv" position="top">
      <van-form @submit="onSaveBt">
        <van-cell-group inset>
          <van-field label="种子" input-align="right" type="file" @change="changeBTCode"/>
          <van-field v-model="linkTmp.dir" label="下载路径" placeholder="请输入"/>
          <van-field input-align="center">
            <template #input>
              <van-button type="success" size="mini" round plain
                          @click="linkTmp.dir='C:/Users/Administrator/Desktop'">
                <i class="fa fa-home"></i>
              </van-button>
              <van-button type="success" size="mini" round plain
                          @click="linkTmp.dir='D:/TDDOWNLOAD'">
                <i class="fa fa-cog"></i>
              </van-button>
            </template>
          </van-field>
          <van-field label="最大连接数">
            <template #input>
              <van-slider v-model="linkTmp['max-connection-per-server']" max="16">
                <template #button>
                  <van-button type="primary" size="mini" round>{{ linkTmp['max-connection-per-server'] }}</van-button>
                </template>
              </van-slider>
            </template>
          </van-field>
          <van-field label="最大线程数">
            <template #input>
              <van-slider v-model="linkTmp.split" max="100">
                <template #button>
                  <van-button type="primary" size="mini" round>{{ linkTmp.split }}</van-button>
                </template>
              </van-slider>
            </template>
          </van-field>
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </van-popup>

    <van-popup v-model:show="opts.showMetaLinkDiv" position="top">
      <van-form @submit="onSaveMetaLink">
        <van-cell-group inset>
          <van-field label="MetaLink" input-align="right" type="file" @change="changeMetaLinkCode"/>
          <van-field v-model="linkTmp.dir" label="下载路径" placeholder="请输入"/>
          <van-field input-align="center">
            <template #input>
              <van-button type="success" size="mini" round plain
                          @click="linkTmp.dir='C:/Users/Administrator/Desktop'">
                <i class="fa fa-home"></i>
              </van-button>
              <van-button type="success" size="mini" round plain
                          @click="linkTmp.dir='D:/TDDOWNLOAD'">
                <i class="fa fa-cog"></i>
              </van-button>
            </template>
          </van-field>
          <van-field label="最大连接数">
            <template #input>
              <van-slider v-model="linkTmp['max-connection-per-server']" max="16">
                <template #button>
                  <van-button type="primary" size="mini" round>{{ linkTmp['max-connection-per-server'] }}</van-button>
                </template>
              </van-slider>
            </template>
          </van-field>
          <van-field label="最大线程数">
            <template #input>
              <van-slider v-model="linkTmp.split" max="100">
                <template #button>
                  <van-button type="primary" size="mini" round>{{ linkTmp.split }}</van-button>
                </template>
              </van-slider>
            </template>
          </van-field>
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </van-popup>

    <van-popup v-model:show="opts.showFtpTypePicker" position="bottom">
      <van-picker
          :columns="['binary','ascii']"
          @confirm="onChooseFtpType"
          @cancel="opt.showFtpTypePicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import {ref, reactive, onUnmounted} from 'vue';
import { showToast, showFailToast } from 'vant'
import ToDownload from './download-todo'
import {getDownloadsAndGlobalOptions, addLink, addBt, addMetaLink} from '@/api/todo'
import store from '../store';

export default {
  name: "download",
  components: {
    ToDownload
  },
  setup() {
    let opts = reactive({
      showFtpTypePicker: false,
      showLinkDiv: false,
      showBtDiv: false,
      showMetaLinkDiv: false,
      downloads:[],
      timeout:null,
    })
    let linkTmp = reactive({
      btContent: null,
      dir: store.state.options.dir,
      link: null,
      'max-connection-per-server': 16,
      split: 32,
      'ftp-type': null,
      'ftp-user': null,
      'ftp-passwd': null,
    })
    const refreshData =  () => {
      if (opts.timeout) {
        clearTimeout(opts.timeout)
      }
      getDownloadsAndGlobalOptions().then( (re) => {
        store.dispatch("filterStates", re.data)
        const arr  = re.data.filter(it => it.id.indexOf("sendTellActiveREQ_") === 0).map(it => it.result);
        if (arr&&arr.length>0) {
          opts.downloads.length=0
          opts.downloads.push(... arr[0])
          // console.log(opts.downloads[0].completedLength)
        }
        opts.timeout = setTimeout(refreshData, 1000)
      })

    }
      refreshData()

    onUnmounted(()=>{
      if (opts.timeout) {
        clearTimeout(opts.timeout)
      }
    })
    const onChooseFtpType = (v) => {
      linkTmp["ftp-type"] = v
      opts.showFtpTypePicker = false
    }
    const onSaveLink = () => {
      linkTmp["btContent"] = undefined
      linkTmp["mateContent "] = undefined
      if (linkTmp["ftp-type"] === '') {
        linkTmp["ftp-type"] = undefined
      }
      if (linkTmp["ftp-user"] === '') {
        linkTmp["ftp-user"] = undefined
      }
      if (linkTmp["ftp-passwd"] === '') {
        linkTmp["ftp-passwd"] = undefined
      }
      if(linkTmp.link){
        let str=linkTmp.link.trim().toUpperCase()
        if(str.indexOf('ED2K://')===0){
          showFailToast(`暂不支持该协议的下载功能！！！`);
          return
        }
      }
      addLink(linkTmp.link, linkTmp).then(re => {
        opts.showLinkDiv = false
        showToast (`操作成功: ${re.data.result}`);
      })
    }
    const onSaveBt = () => {
      linkTmp["link"] = undefined
      linkTmp["mateContent "] = undefined
      linkTmp["ftp-type"] = undefined
      linkTmp["ftp-user"] = undefined
      linkTmp["ftp-passwd"] = undefined
      addBt(linkTmp.btContent, linkTmp).then(re => {
        opts.showBtDiv = false
        showToast (`操作成功: ${re.data.result}`);
      })
    }
    const onSaveMetaLink = () => {
      linkTmp["btContent"] = undefined
      linkTmp["link"] = undefined
      linkTmp["ftp-type"] = undefined
      linkTmp["ftp-user"] = undefined
      linkTmp["ftp-passwd"] = undefined
      addMetaLink(linkTmp.mateContent, linkTmp).then(re => {
        opts.showMetaLinkDiv = false
        showToast (`操作成功: ${re.data.result}`);
      })
    }
    const changeBTCode = (e) => {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (ee) => {
        linkTmp.btContent = ee.target.result
            .replace("data:application/octet-stream;base64,", "")
            .replace("data:application/x-bittorrent;base64,", "");
      }
    }
    const changeMetaLinkCode = (e) => {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (ee) => {
        linkTmp.mateContent  = ee.target.result
            .replace("data:application/octet-stream;base64,", "")
            .replace("data:application/x-bittorrent;base64,", "");
      }
    }
    const activeId = ref('1');
    return {
      activeId, linkTmp,
      onSaveLink, opts, onChooseFtpType, onSaveBt, changeBTCode,
      onSaveMetaLink,changeMetaLinkCode
    };
  }
}
</script>

<style scoped>
.slider-cls {
  background: aquamarine;
  border-radius: 50%;
  padding: 0 3px;
}
</style>