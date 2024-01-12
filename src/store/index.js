import { createStore } from 'vuex'
import common from "/assets/util/common";

export default createStore({
    state: {
        globalStates:{},
        setting:{},
        options:{}
    },
    mutations: {
        changeStates(state, value) {
            state.globalStates = Object.assign(state.globalStates,value)
            document.title = ""
                + "↓" + common.getSize(Number(state.globalStates.downloadSpeed), " - . - ")
                + " ↑" + common.getSize(Number(state.globalStates.uploadSpeed), " - . - ")
                + " ~ Aria2UV";
        },
        changeSetting(state, value) {
            state.setting = Object.assign(state.setting, value)
        },
        changeOptions(state,value){
            state.options=Object.assign(state.options,value)
        }
    },
    actions: {
        setSetting(context, value) {
            context.commit('changeSetting', value )
        },
        setOptions(context, value) {
            context.commit('changeOptions', value )
        },
        filterStates(context, value) {
            const arr= value.filter(it=>it.id.indexOf("sendGetGlobalStatREQ_")===0)
            if(arr&&arr.length>0) {
                // console.log(arr)
                context.commit('changeStates', arr[0].result)
            }
        }
    },
    modules: {
    }
})