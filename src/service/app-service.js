import axios from "axios";

const API_URL = "http://localhost:5000/"
// const API_URL = process.env.REACT_APP_BASR_URL

const URL_START_SERVER = API_URL + "api/start"
const URL_END_SERVER = API_URL + "api/end"
const URL_STATUS_SERVER = API_URL + "api/check"
const URL_FETCH_ALL_DEVICE = API_URL + "api/fetch-device"
const URL_FETCH_INFO = API_URL + "api/info"


export class AppService {
    static startServer() {
        // return axios.get(`${API_URL}api/start`)
        return axios.get(URL_START_SERVER)
    }
    static endServer() {
        return axios.get(URL_END_SERVER)
    }
    static checkServer() {
        return axios.get(URL_STATUS_SERVER, {
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        })
    }
    static fetchAllDevices() {
        return axios.get(URL_FETCH_ALL_DEVICE)
    }

    static getInfo(deviceID, type, startTime, endTime) {
        return axios.post(URL_FETCH_INFO, {
            "deviceID": deviceID,
            "startTime": startTime,
            "endTime": endTime,
            "type": type
        }
        )
    }
}

export default AppService;