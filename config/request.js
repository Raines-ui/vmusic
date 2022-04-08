import http from './common.js'
export function request(options) {
    if(!options.url){
        console.error('URL不能为空');
        return false;
    }
    const headers = {
        'content-type': 'application/json'
    }
    return http({
        method: options.method || 'GET',
        url: options.url,
        data: options.data || '',
        datatype: options.datatype || 'json',
        headers: options.headers || headers
    })
}