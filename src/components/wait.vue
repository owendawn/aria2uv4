<template>
  <div>
    <van-empty description="尚无任务" v-if="data.downloads.length===0"/>
    <div v-if="data.downloads.length>0">
      <ToDownload v-for="v in data.downloads" v-bind:key="v.id" :todo="v"/>
    </div>
  </div>
</template>

<script>
import {ref, reactive, onMounted, onUnmounted, getCurrentInstance} from 'vue';
import ToDownload from './download-todo'
import {getWaitsAndGlobalOptions} from '@/api/todo'
// import store from '../store';

export default {
  name: "wait",
  components: {
    ToDownload
  },
  setup() {
    let data = reactive({
      timeout: null,
      downloads: [],
    })
    const {proxy} = getCurrentInstance()
    const refreshData = () => {
      if (data.timeout) {
        clearTimeout(data.timeout)
      }
      getWaitsAndGlobalOptions().then((re) => {
        proxy.$store.dispatch("filterStates", re.data)
        const arr = re.data.filter(it => it.id.indexOf("sendTellWaitREQ_") === 0).map(it => it.result);
        if (arr&&arr.length>0) {
          data.downloads = arr[0]
        }
        data.timeout = setTimeout(refreshData, 1000)
      })

    }
    onUnmounted(() => {
      if (data.timeout) {
        clearTimeout(data.timeout)
      }
    })
    onMounted(refreshData)
    const activeId = ref('1');
    return {activeId, data};
  }
}
</script>

<style scoped>

</style>