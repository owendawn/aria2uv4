import { createApp } from 'vue'

import './style.css'

import App from './App.vue'
import store from '@/store'
import router from './route'

import 'vant/lib/index.css';
import vant from 'vant';
import { NavBar } from 'vant';

import vuex from 'vuex';


const app = createApp(App)
app.use(vant);

app.use(store).use(router).mount('#app')
