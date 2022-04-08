import axios from 'axios';
const http = axios.create({
    baseURL: 'http://localhost:8080',//请求接口
    timeout: 5000 //访问超时
})
export default http;