import axios from 'axios'

const ip=window.localStorage.getItem("rpc-ip");
const port=window.localStorage.getItem("rpc-port");
axios.defaults.baseURL = ip&&port? ('http://'+ip+":"+port):'http://127.0.0.1:6800'

export default function requset() {
    return axios;
}
