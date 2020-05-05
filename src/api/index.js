import Axios from "axios"
import http from "http"
import https from "https"
import auth from "@/auth"

let headers = {
    "Accept": "application/json",
    "Content-Type": "application/json"
}
// let apiKey = process.env.VUE_APP_API_KEY
// if (apiKey) {
//     headers["X-API-Key"] = apiKey
// }

const axios = Axios.create({
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
})

axios.interceptors.request.use (
    function (config) {
        if (auth.isAuthenticated() || config.url.endsWith("/logout")) {
            config.headers["X-API-Token"] = auth.getApiToken()
        } else if (config.url.endsWith("/refresh")) {
            // Fake out the auth header because no way to override the root security in OpenAPI 3
            config.headers["X-API-Token"] = "refresh"
        }
        return config
    },
    function (error) {
        return Promise.reject (error)
    }
)

// api.interceptors.response.use(
//     function (response) {
//         let cookie = response.headers["HTTP2_HEADER_COOKIE"]
//         if (cookie !== null) {
//             alert(cookie)
//         }
//     }
// )
export default axios
