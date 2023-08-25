// 토큰 관리와 갱신
import axios from "axios";
// 토큰 갱신 항수
const tokenRefresh = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  try {
    const response = await axios.post("http://localhost:8081/auth/refresh", {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    const result = await response.json();
    console.log("토큰 갱신 결과:", result);

    localStorage.setItem('access_token', result.accessToken);
    console.log("새로운 액세스 토큰:", result.accessToken);

    localStorage.setItem('refresh_token', result.refreshToken);
    console.log("새로운 리프레시 토큰:", result.refreshToken);

    localStorage.setItem('message', result.message);
  } catch (error) {
    console.error("토큰 갱신 오류:", error);
    alert(error);
  }
};
const instance = axios.create({
  baseURL: "http://localhost:8081",
});
// 요청이 전달되기 전에 작업 수행 혹은 요청 오류가 있는 함수를 받음
instance.interceptors.request.use(
  //작업 수행
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    console.log(`기존 토큰 : ${accessToken}`);
    config.headers["Content-Type"] = "application/json";
    config.headers["Authorization"] = `Bearer ${accessToken}`;
    return config;
  },
  // 요청 오류
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (response) => {
    if (response.status === 404) {
      console.log("404 페이지로 넘어가야 함!");
    }
    return response;
  },
  async (error) => {
    console.log(error.response.status); // 401
    if (error.response?.status === 401) {
      // 토큰 갱신 함수
      await tokenRefresh();
      const new_accessToken = localStorage.getItem("access_token");
      console.log(`새로운 토큰 : ${new_accessToken}`);
      error.config.headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${new_accessToken}`,
      };
      // 중단된 요청을(에러난 요청)을 토큰 갱신 후 재요청
      const response = await axios.request(error.config);
      return response;
    }
    return Promise.reject(error);
  }
);
export default instance;
