import Axios from "axios"
import http from "http"
import https from "https"

let headers = {
    "Accept": "application/json",
    "Content-Type": "application/json"
}
let apiKey = process.env.VUE_APP_API_KEY
if (apiKey) {
    headers["X-API-Key"] = apiKey
}

const api = Axios.create({
    baseURL: process.env.VUE_APP_EQUIPMENT_MANAGER_BASE_URL,
    withCredentials: false,

    //60 sec timeout
    timeout: 60000,
    headers: headers,

    //keepAlive pools and reuses TCP connections, so it's faster
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),

    //follow up to 10 HTTP 3xx redirects
    maxRedirects: 10,

    //cap the maximum content length we'll accept to 50MBs, just in case
    maxContentLength: 50 * 1000 * 1000
});

export default {
    api: api,
    getMachineList() {

    }
}
