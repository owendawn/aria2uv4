<template>
  <van-nav-bar title="" style="position: fixed;width: 100%">
    <template #title>
      <h2 style="font-font: monospace;">Aria2UV</h2>
    </template>
    <template #left>
      <i class="fa fa-cloud-upload-alt"></i>&nbsp;
      {{ common.getSize(store.state.globalStates.uploadSpeed) + "/s" }}
    </template>
    <template #right>
      <i class="fa fa-cloud-download-alt"></i>&nbsp;
      {{ common.getSize(store.state.globalStates.downloadSpeed) + "/s" }}
    </template>
  </van-nav-bar>

  <router-view style="height: calc(100% - 95px);position: absolute;top: 45px;overflow: auto;width: 100%"></router-view>

  <van-tabbar v-model="active" route @change="onChange">
    <van-tabbar-item name="download" icon="down" to="/download">
      下载中
      <van-badge
          v-if="store.state.globalStates.numActive>0"
          :content="store.state.globalStates.numActive"
          color="#1989fa"/>
    </van-tabbar-item>
    <van-tabbar-item name="wait" icon="underway-o" to="/wait">
      等待中
      <van-badge
          v-if="store.state.globalStates.numWaiting>0"
          :content="store.state.globalStates.numWaiting"
          color="#1989fa"/>
    </van-tabbar-item>
    <van-tabbar-item name="finish" icon="passed" to="/finish">
      已结束
      <van-badge
          v-if="store.state.globalStates.numStoppedTotal>0"
          :content="store.state.globalStates.numStoppedTotal"
          color="#1989fa"/>
    </van-tabbar-item>
    <van-tabbar-item name="setting" icon="setting-o" to="/settingCommon">
      设置
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import {ref} from 'vue';
import {NavBar, Tabbar, TabbarItem} from 'vant';
import store from '@/store';
import common from './assets/util/common'
import {getAria2Options} from './api/todo'

export default {
  name: 'App',
  components: {
    NavBar, Tabbar, TabbarItem
  },
  setup() {
    getAria2Options().then(re=>{
      store.dispatch("setOptions",re.data.result)
    })
    const active = ref('download');
    const onChange = () => {
      // Toast(`标签 ${index}`);
    }
    return {active, onChange, common, store};
  },
}
</script>

<style>
html, body, #app {
  width: 100%;
  height: 100%;
  position: absolute
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

a:-webkit-any-link {
  color: inherit !important;
}

.van-badge {
  margin-top: -32px !important;
  /* position: absolute; */
  margin-left: -7px;
  transform: translate(50%,-200%)!important;
}
</style>
