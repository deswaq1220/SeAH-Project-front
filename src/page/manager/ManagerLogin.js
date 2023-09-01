import "../../style/ManagerLogin.css";
import React, { useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../img/logo.png"
// import fetcher from "../../api/fetcher";
import instance from "../../api/fetcher";
import { useCookies } from 'react-cookie'; // useCookies import

// const TK ="eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0IiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTY5MzAxMzE4OX0.D4CN3pj14vb4LEUo2pAUYF0RP-nNg5YqBmwFxUxBeBWopLq3b5UDL2PYxUgeIUJydcIB0m5-cwl7CU31UzTN4A"

function ManagerLogin() {
  const [email, setEmail] = useState(""); // 말이 이메일이지 아이디임
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const formRef = useRef();



  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await instance.post(
  //       `/auth/login`,
  //       {
  //         email: email,
  //         password: password
  //       },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer`,
  //         },
  //       }
  //     );


  //     const accessToken = response.data.access_token;
  //     axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  //     setAtCookie('at', response.data.accessToken);
  //     setrtCookie('rt',response.data.refreshToken);
  //     navigate("/admin/manager");
  //   } catch (error) {
  //     console.error("Login error:", error);
  //   }
  // };

  //성욱 테스트용
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await instance.post(
        `/auth/login`,
        {
          email: email,
          password: password
        }
      );
  
      // 로그인 성공 후에 실행할 작업
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // 로그인 이후에 요청을 보내기 전에 인터셉터 설정
      // instance.interceptors.request.use(
      //   (config) => {
      //     config.headers['Content-Type'] = 'application/json';
      //     config.headers['Authorization'] = `Bearer ${accessToken}`;
      //     return config;
      //   },
      //   (error) => {
      //     console.log(error);
      //     return Promise.reject(error);
      //   }
      // );
  
      // 필요한 처리 실행
      // setAtCookie('at', response.data.accessToken);
      // setrtCookie('rt', response.data.refreshToken);
      navigate("/admin/manager");
    } catch (error) {

      console.error("Login error:", error);
    }
  };



  return (
    <>
    
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img src={logo}
          className="mx-auto h-10 w-auto"
        
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          반갑습니다 관리자님!
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              아이디
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="아이디를 입력하세요"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                비밀번호
              </label>
              <div className="text-sm">
                
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="비밀번호를 입력하세요"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleSubmit}
            >
              로그인
            </button>
          </div>
        </form>

        
      </div>
    </div>
  </>
  );
}

export default ManagerLogin;
