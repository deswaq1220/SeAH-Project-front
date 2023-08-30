import Cookies from "universal-cookie/es6";
import axios from "axios";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie"; 


const ACCESS_TOKEN_COOKIE = 'myAccessToken';
const REFRESH_TOKEN_COOKIE = 'myRefreshToken';
const cookies = new Cookies();

const INSTANCE = () => {
    const instance = {
        baseURL: process.env.REACT_APP_API_BASE_URL,
        timeout: 10000,
    }
    const accessToken = cookies.get(ACCESS_TOKEN_COOKIE);

    if(accessToken) {
        const axiosWithAuthHeader = {...instance};
        axiosWithAuthHeader.headers = {"Authorization" : `Bearer ${accessToken}`}
        return axios.create(axiosWithAuthHeader)
    } else {
        return axios.create(instance);
    }
}

function refreshRequest(originalRequest) {
    return originalRequest
        .then((res) => res) // 200
        .catch((err) => { // 401, 500, 기타 등등
            const config = err.config;
            if (err?.response?.data.statusCode === "EXPIRED") {
                const authToken = useCookies["at"];

                return axios.post(`process.env.REACT_APP_API_BASE_URL/auth/refresh`, {
                    accessToken: "test",
                    refreshToken: "test"
                },{
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                      },
                })
                    .then((res) => {
                        if (res?.data?.accessToken && res?.data?.refreshToken) {
                            cookies.set(ACCESS_TOKEN_COOKIE, res?.data?.accessToken);
                            cookies.set(REFRESH_TOKEN_COOKIE, res?.data?.refreshToken);
                            return axios({
                                ...config,
                                headers: {"Authorization": `Bearer ${cookies.get(ACCESS_TOKEN_COOKIE)}`}
                            }).then((res) => res)
                        } else {
                            Swal.fire({
                                title: "토큰이 만료되었습니다.",
                                icon: 'warning',
                            })
                            console.log("들어오나?");
                            window.location.href = '/login'
                            cookies.remove(ACCESS_TOKEN_COOKIE)
                            cookies.remove(REFRESH_TOKEN_COOKIE)
                        }
                    }).catch(() => {
                        alert("몰라용")
                        window.location.href = '/404'
                        cookies.remove(ACCESS_TOKEN_COOKIE)
                        cookies.remove(REFRESH_TOKEN_COOKIE)
                    })
            } else {
                alert("여긴가?");
                throw err
                
            }
        });
}

export default {
    get : (url, options)=>{
        const originalRequest = INSTANCE().get(url,options);
        return refreshRequest(originalRequest);
    },
    delete : (url, options)=>{
        const originalRequest = INSTANCE().delete(url,options);
        return refreshRequest(originalRequest);
    },
    post : (url,data, options)=>{
        const originalRequest = INSTANCE().post(url,data,options);
        return refreshRequest(originalRequest);
    },
    put : (url,data, options)=>{
        const originalRequest = INSTANCE().put(url,data,options);
        return refreshRequest(originalRequest);
    }
}