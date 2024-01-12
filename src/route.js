import {createRouter, createWebHashHistory} from "vue-router"

const download = () => import("@_c/download")
const downloadItem = () => import("@/components/download-todo-item")
const wait = () => import("@/components/wait")
const finish = () => import("@/components/finish")
const settingCommon = () => import("@/components/setting-common")

const routes = [
    {path: "/", redirect: "/home"},
    {path: "/home", name: "home", component: download},
    {path: "/download", name: "download", component: download},
    {path: "/downloadItem", name: "downloadItem", component: downloadItem},
    {path: "/wait", name: "wait", component: wait},
    {path: "/finish", name: "finish", component: finish},
    {path: "/settingCommon", name: "settingCommon", component: settingCommon},
]
export default  createRouter({
    history: createWebHashHistory(),
    routes: routes
})